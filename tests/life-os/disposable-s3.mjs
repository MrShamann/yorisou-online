// A minimal, disposable S3-compatible object server for the OSF-1 test harnesses.
//
// WHY THIS EXISTS.
//
// `lib/server/yorisouData.ts` talks to the identity store through the AWS SDK's `S3Client` with an
// explicit endpoint and path-style addressing (`sharedStoreMode === "s3-compatible"`). That mode is
// first-class production architecture, not a test affordance — Supabase Storage's S3 gateway is the
// real user of it.
//
// A production DEPLOYMENT CONTEXT is the only way to exercise INTERNAL access: `lifeOsInternalAccess`
// returns `not_production` everywhere else, deliberately. And in a production context
// `sharedStoreBoundary.ts` correctly refuses to run with no store configured. So the INTERNAL
// rehearsal needs a store the auth layer can genuinely write to and read back.
//
// An earlier attempt pointed the endpoint at a stub that answered every request with static XML.
// The app booted and then registration returned 503, because a store that accepts writes and returns
// nothing is not a store. This is the real thing, scoped to the harness:
//
//   PUT    /{bucket}/{key}   store bytes, return an ETag
//   GET    /{bucket}/{key}   return bytes, or 404 NoSuchKey
//   HEAD   /{bucket}/{key}   return metadata, or 404
//   DELETE /{bucket}/{key}   remove, return 204
//   GET    /{bucket}?list-type=2   minimal ListObjectsV2
//
// WHAT IT DELIBERATELY DOES NOT DO: verify SigV4. A signature check would test the AWS SDK, which is
// not the subject; the harness generates both halves of the credential anyway. This process listens
// on loopback only, holds one disposable directory, and is killed with the rest of the stack.
//
// It is NOT importable by application code and NOT referenced outside tests/.
//
//   node tests/life-os/disposable-s3.mjs <port> <dataDir>

import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const port = Number.parseInt(process.argv[2] ?? "0", 10);
const root = process.argv[3];
if (!port || !root) {
  console.error("usage: node tests/life-os/disposable-s3.mjs <port> <dataDir>");
  process.exit(1);
}
mkdirSync(root, { recursive: true });

/** Object keys become paths under one disposable directory. Traversal is refused, not sanitised. */
function pathFor(bucket, key) {
  const decoded = decodeURIComponent(key);
  if (decoded.includes("..")) return null;
  return join(root, bucket, decoded);
}

function xmlError(res, status, code, message) {
  res.writeHead(status, { "Content-Type": "application/xml" });
  res.end(
    `<?xml version="1.0" encoding="UTF-8"?><Error><Code>${code}</Code>` +
      `<Message>${message}</Message><RequestId>${randomUUID()}</RequestId></Error>`,
  );
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      res.writeHead(200, { "Content-Type": "application/xml" });
      res.end('<?xml version="1.0"?><ListAllMyBucketsResult><Buckets/></ListAllMyBucketsResult>');
      return;
    }
    const [bucket, ...rest] = segments;
    const key = rest.join("/");

    // ListObjectsV2 — REAL, because the foundation store finds records by enumerating a prefix
    // (lib/server/yorisouData.ts:886). An empty listing is not a harmless simplification here: it
    // makes every lookup-by-enumeration return nothing, which surfaces as `missing_user_profile` and
    // a 503 on registration. That is exactly the wrong-conclusion trap this file was written to
    // avoid, and it cost a diagnosis to find.
    if (!key && url.searchParams.get("list-type") === "2") {
      const prefix = url.searchParams.get("prefix") ?? "";
      const bucketRoot = join(root, bucket);
      const found = [];
      const walk = (dir, rel) => {
        let entries;
        try {
          entries = readdirSync(dir, { withFileTypes: true });
        } catch {
          return;
        }
        for (const entry of entries) {
          const relKey = rel ? `${rel}/${entry.name}` : entry.name;
          if (entry.isDirectory()) walk(join(dir, entry.name), relKey);
          else if (relKey.startsWith(prefix)) found.push(relKey);
        }
      };
      walk(bucketRoot, "");
      const contents = found
        .sort()
        .map((k) => `<Contents><Key>${k}</Key><Size>${statSync(join(bucketRoot, k)).size}</Size></Contents>`)
        .join("");
      res.writeHead(200, { "Content-Type": "application/xml" });
      res.end(
        `<?xml version="1.0" encoding="UTF-8"?><ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/">` +
          `<Name>${bucket}</Name><Prefix>${prefix}</Prefix><KeyCount>${found.length}</KeyCount>` +
          `<MaxKeys>1000</MaxKeys><IsTruncated>false</IsTruncated>${contents}</ListBucketResult>`,
      );
      return;
    }
    if (!key) return xmlError(res, 404, "NoSuchKey", "no key given");

    const file = pathFor(bucket, key);
    if (!file) return xmlError(res, 400, "InvalidRequest", "key escapes the bucket");

    if (req.method === "PUT") {
      const body = await readBody(req);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, body);
      res.writeHead(200, { ETag: `"${createHash("md5").update(body).digest("hex")}"` });
      res.end();
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      let body;
      try {
        body = readFileSync(file);
      } catch {
        // The SDK maps this to NoSuchKey, which the application treats as "absent" — and that
        // distinction is load-bearing: POR-1's durable deletion fallback runs only on absence.
        return xmlError(res, 404, "NoSuchKey", "The specified key does not exist.");
      }
      const stat = statSync(file);
      const headers = {
        "Content-Length": String(body.length),
        "Content-Type": "application/octet-stream",
        ETag: `"${createHash("md5").update(body).digest("hex")}"`,
        "Last-Modified": stat.mtime.toUTCString(),
      };
      if (req.method === "HEAD") {
        res.writeHead(200, headers);
        res.end();
        return;
      }
      res.writeHead(200, headers);
      res.end(body);
      return;
    }

    if (req.method === "DELETE") {
      rmSync(file, { force: true });
      res.writeHead(204);
      res.end();
      return;
    }

    return xmlError(res, 405, "MethodNotAllowed", `${req.method} is not supported`);
  } catch (error) {
    return xmlError(res, 500, "InternalError", error instanceof Error ? error.message : "unknown");
  }
}).listen(port, "127.0.0.1", () => {
  process.stdout.write(`disposable-s3 listening on 127.0.0.1:${port} root=${root}\n`);
});
