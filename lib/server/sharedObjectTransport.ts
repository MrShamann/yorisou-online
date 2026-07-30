// POR-1 — THE SHARED OBJECT TRANSPORT, in one place.
//
// WHAT THIS EXISTS TO FIX.
//
// MPV-1C taught `yorisouData` to speak Supabase Storage's REST API, which is what made an ISOLATED
// Preview identity store possible: a Preview deployment writes accounts, sessions and lookups into a
// Supabase bucket rather than into the AWS bucket Production uses.
//
// `foundation/store.ts` never learned. It builds a plain `new S3Client({ region })` — no endpoint, no
// REST mode — and points it at whatever `YORISOU_SHARED_STORE_BUCKET` names. In the isolated Preview
// that resolves to AWS S3 with a bucket named `yorisou-preview-auth` and, because the Preview
// environment carries no AWS credentials, every write throws. The auth routes log and swallow those
// errors, so the failure is completely silent: Preview appears to work, and the canonical identity
// mirror — the UserProfile and the AuthIdentities that ARE the email and LINE login routes — simply
// does not exist there.
//
// That is not a cosmetic gap. It means the foundation half of an account deletion could never be
// PROVEN in Preview, because there was nothing in Preview to erase. A deletion test that passes
// because its target was never created is the most comfortable kind of false confidence.
//
// So the transport lives here, once, and both stores use the same mode decision. Two copies of a
// transport is exactly how these two drifted apart, and a third copy would be a third chance.

import "server-only";

import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { resolveSharedStoreMode, type SharedStoreMode } from "./yorisouData";

const bucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const region = process.env.YORISOU_SHARED_STORE_REGION || "us-east-2";
const endpoint = process.env.YORISOU_SHARED_STORE_ENDPOINT?.trim() || "";
const forcePathStyle = (process.env.YORISOU_SHARED_STORE_FORCE_PATH_STYLE || "").trim() === "true";
const accessKeyId = process.env.YORISOU_SHARED_STORE_ACCESS_KEY_ID?.trim() || "";
const secretAccessKey = process.env.YORISOU_SHARED_STORE_SECRET_ACCESS_KEY?.trim() || "";

/**
 * The mode is resolved by the SAME function `yorisouData` uses, deliberately.
 *
 * If this module made its own decision the two stores could disagree about which bucket they are
 * talking to — which is precisely the state this file was written to end, and it would be invisible
 * again because the disagreement only shows up as missing records.
 */
export function sharedObjectTransportMode(): SharedStoreMode {
  return resolveSharedStoreMode({ bucket, endpoint, accessKeyId, secretAccessKey, forcePathStyle });
}

const mode = sharedObjectTransportMode();
const restBase = endpoint.replace(/\/$/, "");

function restHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: secretAccessKey,
    Authorization: `Bearer ${secretAccessKey}`,
    ...extra,
  };
}

let client: S3Client | null = null;

function s3(): S3Client {
  if (!client) {
    client =
      mode === "s3-compatible"
        ? new S3Client({
            region,
            endpoint,
            forcePathStyle,
            credentials: { accessKeyId, secretAccessKey },
          })
        : new S3Client({ region });
  }
  return client;
}

export function sharedObjectTransportConfigured(): boolean {
  return mode !== "disabled" && bucket.length > 0;
}

export async function getSharedObject<T>(key: string): Promise<T | null> {
  if (mode === "supabase-rest") {
    const res = await fetch(`${restBase}/object/${bucket}/${key}`, {
      method: "GET",
      headers: restHeaders(),
      cache: "no-store",
    });
    // Supabase answers 400 for some missing-object shapes. Both mean "not there" for an ordinary
    // read; the STRICT existence probe that erasure verification needs is a different question and
    // deliberately not answered here.
    if (res.status === 404 || res.status === 400) return null;
    if (!res.ok) throw new Error(`shared_object_read_failed:${res.status}`);
    const text = await res.text();
    return text ? (JSON.parse(text) as T) : null;
  }

  try {
    const response = await s3().send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = await response.Body?.transformToString();
    return body ? (JSON.parse(body) as T) : null;
  } catch (error) {
    if (error instanceof NoSuchKey) return null;
    const name = (error as { name?: string })?.name || "";
    if (name === "NoSuchKey" || name === "NotFound") return null;
    throw error;
  }
}

export async function putSharedObject<T>(key: string, value: T): Promise<void> {
  const body = JSON.stringify(value, null, 2) + "\n";

  if (mode === "supabase-rest") {
    const res = await fetch(`${restBase}/object/${bucket}/${key}`, {
      method: "POST",
      headers: restHeaders({ "Content-Type": "application/json", "x-upsert": "true" }),
      body,
    });
    if (!res.ok) throw new Error(`shared_object_write_failed:${res.status}`);
    return;
  }

  await s3().send(
    new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "application/json" }),
  );
}

export async function deleteSharedObject(key: string): Promise<void> {
  if (mode === "supabase-rest") {
    const res = await fetch(`${restBase}/object/${bucket}/${key}`, {
      method: "DELETE",
      headers: restHeaders(),
    });
    // A missing object is the desired end state, not a failure to retry.
    if (!res.ok && res.status !== 404) throw new Error(`shared_object_delete_failed:${res.status}`);
    return;
  }

  await s3().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function listSharedObjectKeys(prefix: string): Promise<string[]> {
  if (mode === "supabase-rest") {
    // Supabase Storage's list is FOLDER-oriented and returns names relative to the prefix, so full
    // keys are reconstructed. Entries without an `id` are folders, not objects.
    const folder = prefix.replace(/\/$/, "");
    const keys: string[] = [];
    let offset = 0;
    for (;;) {
      const res = await fetch(`${restBase}/object/list/${bucket}`, {
        method: "POST",
        headers: restHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ prefix: `${folder}/`, limit: 1000, offset }),
      });
      if (!res.ok) throw new Error(`shared_object_list_failed:${res.status}`);
      const entries = (await res.json()) as { name: string; id: string | null }[];
      for (const entry of entries) if (entry.id) keys.push(`${folder}/${entry.name}`);
      if (entries.length < 1000) break;
      offset += 1000;
    }
    return keys;
  }

  const keys: string[] = [];
  let continuationToken: string | undefined;
  do {
    const response = await s3().send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix, ContinuationToken: continuationToken }),
    );
    for (const entry of response.Contents || []) if (entry.Key) keys.push(entry.Key);
    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);
  return keys;
}
