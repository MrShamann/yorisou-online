// POR-1 WS-G-C — PREVIEW_SYNTHETIC_ORPHAN_REMEDIATOR.
//
// OPERATOR-ONLY. PREVIEW-ONLY. Not a product path, not an admin API, not importable by any route.
//
// WHY IT HAS TO EXIST.
//
// These satellites are unreachable through the normal deletion path. Their accounts are gone, their
// jobs are terminally failed with no frozen manifest, and `executeDeletion` correctly refuses to
// proceed because it cannot prove what it would be erasing. That refusal is right and is not
// weakened. What it leaves behind is an ACTIVE identity link, foundation records and LINE lookups
// with no owner left to enumerate them from.
//
// PROVENANCE, which is the only thing that makes this safe.
//
// A satellite is removable only when its owner reference is DANGLING — no surviving account — and
// the Preview account population was provably synthetic in full. The governed classifier partitioned
// all 149 accounts with ZERO unknown, so no non-synthetic account existed here; a dangling owner ref
// therefore belonged to a synthetic one. That argument is re-checked at runtime rather than assumed:
// if any unknown account is present, this refuses to run at all.
//
// It takes no account id, job id, key, prefix, table or email from the command line. The candidate
// set is derived, and every removal goes through the SAME narrow adapters the product's own erasure
// uses — `eraseCanonicalIdentityLinks`, `deleteFoundationRecord`, `deleteSharedIdentityObject`.

import { listAccounts, deleteSharedIdentityObject } from "../lib/server/yorisouData";
import { partitionPreviewIdentities } from "../lib/server/previewSyntheticClassifier";
import { eraseCanonicalIdentityLinks } from "../lib/server/canonicalIdentityLinks";
import { deleteFoundationRecord } from "../lib/server/foundation/store";

const PREVIEW_PROJECT_REF = "nbltsbonsnbpfptihomc";
const MODE = process.argv.includes("--execute")
  ? "execute"
  : process.argv.includes("--verify-only")
    ? "verify-only"
    : "dry-run";

const FORBIDDEN_FLAGS = ["--account-id", "--job-id", "--object-key", "--prefix", "--table", "--email"];

function assertPreviewOnly() {
  const url = process.env.SUPABASE_URL ?? "";
  if (!url.includes(PREVIEW_PROJECT_REF)) {
    throw new Error(
      `refusing to run: SUPABASE_URL is not the Preview project (${PREVIEW_PROJECT_REF}). ` +
        "This tool removes identity records and must never be pointed at Production.",
    );
  }
  for (const flag of FORBIDDEN_FLAGS) {
    if (process.argv.some((arg) => arg.startsWith(flag))) {
      throw new Error(`refusing to run: ${flag} is not accepted — candidates are DERIVED, never supplied`);
    }
  }
}

const rest = (path: string) => {
  const url = process.env.SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
};

const store = (path: string, init?: RequestInit) => {
  const base = process.env.YORISOU_SHARED_STORE_ENDPOINT ?? "";
  const key = process.env.YORISOU_SHARED_STORE_SECRET_ACCESS_KEY ?? "";
  return fetch(`${base}/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...(init?.headers ?? {}) },
  });
};

async function listObjects(prefix: string): Promise<string[]> {
  const bucket = process.env.YORISOU_SHARED_STORE_BUCKET ?? "";
  const response = await store(`object/list/${bucket}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefix: `${prefix}/`, limit: 1000, offset: 0 }),
  });
  if (!response.ok) throw new Error(`store_list_failed:${response.status}`);
  const rows = (await response.json()) as { name: string; id: string | null }[];
  return rows.filter((r) => r.id).map((r) => `${prefix}/${r.name}`);
}

async function readObject<T>(key: string): Promise<T | null> {
  const bucket = process.env.YORISOU_SHARED_STORE_BUCKET ?? "";
  const response = await store(`object/${bucket}/${key}`);
  if (!response.ok) return null;
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : null;
}

const label = (id: string) => `${id.slice(0, 8)}…`;

async function main() {
  assertPreviewOnly();

  // ── THE PROVENANCE PRECONDITION ────────────────────────────────────────────
  //
  // The whole safety argument is "every account here was synthetic, so a dangling owner reference
  // was synthetic". If that is not true right now, this tool has no basis to delete anything.
  const accounts = await listAccounts();
  const { unknown } = partitionPreviewIdentities(accounts);
  if (unknown.length > 0) {
    throw new Error(
      `refusing to run: ${unknown.length} unclassified Preview account(s) present. The dangling-owner ` +
        "argument only holds while the population is provably synthetic in full.",
    );
  }
  const surviving = new Set(accounts.map((a) => a.id));
  const dangling = (ownerId: string | null | undefined): ownerId is string =>
    typeof ownerId === "string" && ownerId.length > 0 && !surviving.has(ownerId);

  // ── CANDIDATES, DERIVED ────────────────────────────────────────────────────
  const linkRows = (await (await rest(
    "yorisou_canonical_identity_links?select=owner_account_id,link_kind&link_state=eq.active",
  )).json()) as { owner_account_id: string | null; link_kind: string }[];
  const linkOwners = [...new Set(linkRows.map((r) => r.owner_account_id).filter(dangling))];

  const profiles: Array<{ key: string; id: string }> = [];
  for (const key of await listObjects("phase1/foundation-v1/user-profiles")) {
    const record = await readObject<{ userProfileId?: string; legacyAccountId?: string }>(key);
    if (record && dangling(record.legacyAccountId)) {
      profiles.push({ key, id: record.userProfileId ?? key.split("/").pop()!.replace(/\.json$/, "") });
    }
  }

  const identities: Array<{ key: string; id: string }> = [];
  for (const key of await listObjects("phase1/foundation-v1/auth-identities")) {
    const record = await readObject<{ authIdentityId?: string; legacyAccountId?: string }>(key);
    if (record && dangling(record.legacyAccountId)) {
      identities.push({ key, id: record.authIdentityId ?? key.split("/").pop()!.replace(/\.json$/, "") });
    }
  }

  const lineLookups: string[] = [];
  for (const key of await listObjects("phase1/accounts/by-line-user")) {
    const record = await readObject<{ accountId?: string }>(key);
    if (record && dangling(record.accountId)) lineLookups.push(key);
  }

  const sessions: string[] = [];
  for (const key of await listObjects("phase1/sessions")) {
    const record = await readObject<{ userId?: string | null; principalLanding?: { legacyAccountId?: string } }>(key);
    if (!record) continue;
    const owner = record.userId || record.principalLanding?.legacyAccountId;
    // ANONYMOUS SESSIONS ARE PRESERVED. No owner means nothing to orphan, and deleting them would be
    // destroying unrelated Preview state to make a number look better.
    if (dangling(owner)) sessions.push(key);
  }

  console.log(
    JSON.stringify({
      mode: MODE,
      project: PREVIEW_PROJECT_REF,
      accountsScanned: accounts.length,
      unknownAccounts: unknown.length,
      danglingActiveLinkOwners: linkOwners.length,
      danglingUserProfiles: profiles.length,
      danglingAuthIdentities: identities.length,
      danglingLineLookups: lineLookups.length,
      danglingOwnerLinkedSessions: sessions.length,
    }),
  );

  const total = linkOwners.length + profiles.length + identities.length + lineLookups.length + sessions.length;
  if (MODE !== "execute") {
    console.log(`(${MODE}: no destructive operation — pass --execute to remediate ${total} orphan(s))`);
    return;
  }
  if (total === 0) {
    console.log(JSON.stringify({ removed: 0, note: "no orphans" }));
    return;
  }

  let removed = 0;
  const failures: string[] = [];

  // Every removal goes through the same narrow adapter the product's own erasure uses.
  for (const owner of linkOwners) {
    try {
      await eraseCanonicalIdentityLinks(owner);
      removed += 1;
      console.log(`  erased identity links for ${label(owner)}`);
    } catch (error) {
      failures.push(`identity_links:${label(owner)}:${error instanceof Error ? error.message : "unknown"}`);
    }
  }
  for (const profile of profiles) {
    try {
      await deleteFoundationRecord("user-profiles", profile.id);
      removed += 1;
      console.log(`  removed UserProfile ${label(profile.id)}`);
    } catch (error) {
      failures.push(`user_profile:${label(profile.id)}:${error instanceof Error ? error.message : "unknown"}`);
    }
  }
  for (const identity of identities) {
    try {
      await deleteFoundationRecord("auth-identities", identity.id);
      removed += 1;
      console.log(`  removed AuthIdentity ${label(identity.id)}`);
    } catch (error) {
      failures.push(`auth_identity:${label(identity.id)}:${error instanceof Error ? error.message : "unknown"}`);
    }
  }
  for (const key of [...lineLookups, ...sessions]) {
    try {
      await deleteSharedIdentityObject(key);
      removed += 1;
      console.log(`  removed ${key.split("/").slice(0, 2).join("/")}/…`);
    } catch (error) {
      failures.push(`object:${error instanceof Error ? error.message : "unknown"}`);
    }
  }

  console.log(JSON.stringify({ removed, failures: failures.length }));
  for (const failure of failures) console.error(`  FAILED ${failure}`);
  if (failures.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "unknown");
  process.exit(1);
});
