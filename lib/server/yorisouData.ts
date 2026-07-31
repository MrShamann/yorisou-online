import { promises as fs } from "fs";
import path from "path";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";

import { assertIdentityKey, SHARED_STORE_PREFIX } from "./identityKeyScope";
import { assertSharedStoreEnvironmentBoundary } from "./sharedStoreBoundary";
import { classifySharedStoreDelete } from "./sharedStoreDeleteClassification";
import {
  withAccountMutationLease,
  withAccountProvisioningLease,
  withLegacyBootstrapContext,
} from "./accountMutationLease";
import {
  assertAccountWriteContext,
  type AccountDeletionContext,
  type AccountWriteContext,
} from "./accountWriteContext";
import {
  eraseCanonicalLineSubjects,
  findCanonicalLineEventById,
  listCanonicalLineEvents,
  listCanonicalRecentLineSubjects,
  recordCanonicalLineEvent,
} from "./canonicalLineActivity";
import {
  isCanonicalLineActivitySchemaReady,
  resolveLineActivityMode,
} from "./canonicalLineActivityRollout";
import {
  identityLinksForAccount,
  lineIdentityDigest,
  retireCanonicalIdentityLink,
  syncCanonicalIdentityLinks,
} from "./canonicalIdentityLinks";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import type { AdvisorLead } from "@/lib/yorisouAdvisorStorage";
import type { AdvisorRecommendation, Locale } from "@/lib/ai/yorisouAdvisor";
import { isPlaceholderEmail } from "@/lib/server/foundation/ids";

export type AccountRole = "self" | "family" | "facility";
export type LineBindingStatus = "not_connected" | "registered" | "connected";

export type SupportProfile = {
  lineBindingStatus: LineBindingStatus;
  lineDisplayName: string;
  lineNotificationsEnabled: boolean;
  familyContactName: string;
  familyContactRelation: string;
  familyContactMethod: string;
  familyContactValue: string;
  familyShareNote: string;
};

export type AccountRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  city: string;
  role: AccountRole;
  createdAt: string;
  updatedAt: string;
  lineUserId?: string;
  lineConnectedAt?: string;
  linePictureUrl?: string;
  lineIdTokenSubject?: string;
  /**
   * POR-1 WS5 — set when the deletion saga reaches `locked`, cleared on cancellation. Its presence
   * means this account may not authenticate and no session may act as it. The durable job in the
   * database remains the source of truth for the saga; this is the enforcement marker that rides
   * along with the record every authenticated request already loads.
   */
  deletionLockedAt?: string;
  supportProfile: SupportProfile;
};

export type SessionRecord = {
  id: string;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  principalLanding?: SessionPrincipalLanding | null;
};

export type SessionPrincipalLanding = {
  version: 1;
  kind: "canonical_principal";
  principalId: string;
  userProfileId: string;
  legacyAccountId: string | null;
  source: "email_login" | "register" | "line_login" | "line_bind" | "session_upgrade";
  issuedAt: string;
};

export type ConsultationRecord = {
  id: string;
  sessionId: string;
  userId: string | null;
  createdAt: string;
  locale: Locale;
  recommendedCategory: string;
  secondaryRecommendation: string;
  summary: string;
  suggestedNextAction: string;
  answerLabels: Record<string, string>;
  leadSubmitted: boolean;
  lead: AdvisorLead | null;
};

export type PasswordResetTokenRecord = {
  tokenHash: string;
  accountId: string;
  email: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
};

export type LineWebhookEventRecord = {
  id: string;
  accountId: string | null;
  lineUserId: string | null;
  sourceType: string | null;
  eventType: string;
  messageType: string | null;
  messageText: string | null;
  postbackData: string | null;
  replyTokenPresent: boolean;
  replyStatus: "not_attempted" | "sent" | "failed";
  replyError: string | null;
  webhookEventId: string | null;
  deliveryMode: string | null;
  isRedelivery: boolean;
  eventTimestamp: string | null;
  receivedAt: string;
};

export type RecentLineWebhookSubjectRecord = {
  eventId: string;
  webhookEventId: string | null;
  lineUserId: string;
  accountId: string | null;
  sourceType: string | null;
  eventType: string;
  messageType: string | null;
  messageText: string | null;
  postbackData: string | null;
  eventTimestamp: string | null;
  receivedAt: string;
};

type DataFile<T> = {
  path: string;
  fallback: T;
};

type AccountEmailLookup = {
  accountId: string;
  email: string;
  updatedAt: string;
};

type AccountLineLookup = {
  accountId: string;
  lineUserId: string;
  updatedAt: string;
};

type MigrationState = {
  version: number;
  migratedAt: string;
  source: "legacy_file" | "shared_store_bootstrap";
  accountCount: number;
  sessionCount: number;
  consultationCount: number;
};

const DEFAULT_SHARED_REGION = "us-east-2";
// Single definition, shared with the identity-deletion scope rule so the two cannot drift apart.
const SHARED_PREFIX = SHARED_STORE_PREFIX;
const MIGRATION_VERSION = 2;

const dataDir =
  process.env.YORISOU_DATA_DIR ||
  (process.env.NODE_ENV === "production" ? path.join("/tmp", "yorisou-phase1") : path.join(process.cwd(), "data"));
const sharedStoreBucket = process.env.YORISOU_SHARED_STORE_BUCKET?.trim() || "";
const sharedStoreRegion = process.env.YORISOU_SHARED_STORE_REGION || DEFAULT_SHARED_REGION;

// MPV-1C — optional S3-COMPATIBLE endpoint support (e.g. Supabase Storage), WITHOUT
// changing the default AWS behavior. When no endpoint is configured the store behaves
// exactly as before (AWS default credential provider). Two non-default modes:
//   • "s3-compatible": a custom S3 endpoint + explicit access-key credentials (the
//     existing @aws-sdk/client-s3 path with { endpoint, forcePathStyle, credentials }).
//   • "supabase-rest": Supabase Storage's REST object API, authenticated by a
//     server-only bearer token (the isolated Preview service-role key). Used when the
//     endpoint is the Supabase Storage REST base (".../storage/v1"); needs no S3 keys.
// Fail closed on partial/malformed configuration. Never log secret values.
const sharedStoreEndpoint = process.env.YORISOU_SHARED_STORE_ENDPOINT?.trim() || "";
const sharedStoreForcePathStyle = (process.env.YORISOU_SHARED_STORE_FORCE_PATH_STYLE || "").trim() === "true";
const sharedStoreAccessKeyId = process.env.YORISOU_SHARED_STORE_ACCESS_KEY_ID?.trim() || "";
const sharedStoreSecretAccessKey = process.env.YORISOU_SHARED_STORE_SECRET_ACCESS_KEY?.trim() || "";

/** Exposed so the non-secret runtime attestation reports the same value the store actually uses. */
export function currentSharedStoreMode(): SharedStoreMode {
  return sharedStoreMode;
}

export type SharedStoreMode = "disabled" | "aws" | "s3-compatible" | "supabase-rest";

// Pure resolver (exported for tests). Never returns a mode whose required inputs are
// absent — it throws a bounded, secret-free error instead (fail closed).
//
// MPV-1D — the ONLY configuration that may resolve to "disabled" (local-file mode) is a
// FULLY-ABSENT shared-store config: no bucket AND no endpoint AND no access key AND no
// secret/token AND forcePathStyle false/absent. Any shared-store-specific variable set
// without a bucket is an orphaned/misconfigured shared store and MUST throw
// `shared_store_bucket_required` — never silently fall back to ephemeral local storage.
export function resolveSharedStoreMode(env: {
  bucket?: string;
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  forcePathStyle?: boolean;
} = {
  bucket: sharedStoreBucket,
  endpoint: sharedStoreEndpoint,
  accessKeyId: sharedStoreAccessKeyId,
  secretAccessKey: sharedStoreSecretAccessKey,
  forcePathStyle: sharedStoreForcePathStyle,
}): SharedStoreMode {
  const bucket = (env.bucket || "").trim();
  const endpoint = (env.endpoint || "").trim();
  const accessKeyId = (env.accessKeyId || "").trim();
  const secretAccessKey = (env.secretAccessKey || "").trim();
  const forcePathStyle = env.forcePathStyle === true;
  if (!bucket) {
    // Fail closed: shared-store-specific config without a bucket is invalid, not local.
    if (endpoint || accessKeyId || secretAccessKey || forcePathStyle) {
      throw new Error("shared_store_bucket_required");
    }
    return "disabled";
  }
  if (!endpoint) return "aws";
  // Supabase Storage REST base: ".../storage/v1" (optionally trailing slash).
  if (/\/storage\/v1\/?$/.test(endpoint)) {
    if (!secretAccessKey) throw new Error("shared_store_supabase_rest_missing_token");
    return "supabase-rest";
  }
  // Custom S3-compatible endpoint: BOTH credentials required (reject partial creds).
  if (Boolean(accessKeyId) !== Boolean(secretAccessKey)) throw new Error("shared_store_partial_credentials");
  if (!accessKeyId || !secretAccessKey) throw new Error("shared_store_endpoint_missing_credentials");
  return "s3-compatible";
}

// Authoritative resolution at module initialization: a malformed shared-store config
// throws HERE (fail at startup) rather than silently selecting local storage. There is
// no separate `shouldUseSharedStore` bypass — the resolver alone decides disabled/valid.
const sharedStoreMode: SharedStoreMode = resolveSharedStoreMode();

// POR-1 — the environment boundary, checked at initialization alongside the mode.
//
// Resolving a VALID configuration is not the same as resolving the RIGHT one. A Preview deployment
// pointed at the Production identity bucket resolves perfectly well; that is how it went unnoticed.
// This asserts which side of the boundary the resolved configuration actually lands on, and throws
// before any identity object can be written.
export const sharedStoreBoundary = assertSharedStoreEnvironmentBoundary({
  deploymentEnvironment: process.env.VERCEL_ENV || "development",
  sharedStoreMode,
  bucket: sharedStoreBucket,
  endpoint: sharedStoreEndpoint,
  supabaseUrl: process.env.SUPABASE_URL,
});

const shouldUseSharedStore = sharedStoreMode !== "disabled";
const sharedRestBase = sharedStoreEndpoint.replace(/\/$/, ""); // ".../storage/v1"

const accountsFile: DataFile<AccountRecord[]> = {
  path: path.join(dataDir, "phase1-accounts.json"),
  fallback: [],
};
const sessionsFile: DataFile<SessionRecord[]> = {
  path: path.join(dataDir, "phase1-sessions.json"),
  fallback: [],
};
const consultationsFile: DataFile<ConsultationRecord[]> = {
  path: path.join(dataDir, "phase1-consultations.json"),
  fallback: [],
};
const passwordResetTokensFile: DataFile<PasswordResetTokenRecord[]> = {
  path: path.join(dataDir, "phase1-password-reset-tokens.json"),
  fallback: [],
};
const lineWebhookEventsFile: DataFile<LineWebhookEventRecord[]> = {
  path: path.join(dataDir, "phase1-line-webhook-events.json"),
  fallback: [],
};
const recentLineWebhookSubjectsFile: DataFile<RecentLineWebhookSubjectRecord[]> = {
  path: path.join(dataDir, "phase1-line-webhook-recent-subjects.json"),
  fallback: [],
};

let sharedStoreClient: S3Client | null = null;
let sharedStoreReadyPromise: Promise<void> | null = null;

function getSharedStoreClient() {
  if (!shouldUseSharedStore || sharedStoreMode === "supabase-rest") {
    return null;
  }

  if (!sharedStoreClient) {
    if (sharedStoreMode === "s3-compatible") {
      // Custom S3-compatible endpoint (e.g. Supabase Storage S3): explicit endpoint +
      // credentials. Never logged.
      sharedStoreClient = new S3Client({
        region: sharedStoreRegion,
        endpoint: sharedStoreEndpoint,
        forcePathStyle: sharedStoreForcePathStyle,
        credentials: {
          accessKeyId: sharedStoreAccessKeyId,
          secretAccessKey: sharedStoreSecretAccessKey,
        },
      });
    } else {
      // AWS default — unchanged behavior (default credential provider chain).
      sharedStoreClient = new S3Client({
        region: sharedStoreRegion,
      });
    }
  }

  return sharedStoreClient;
}

// ── Supabase Storage REST transport (MPV-1C fallback) ────────────────────────
// A minimal server-only adapter over Supabase Storage's REST object API, used when
// no S3 access keys are available. Auth is a server-only bearer (the isolated Preview
// service-role key) — it never reaches the browser. Preserves the existing object-key
// layout (phase1/**). Same four operations as the S3 path.
function sharedRestHeaders(extra: Record<string, string> = {}) {
  return {
    apikey: sharedStoreSecretAccessKey,
    Authorization: `Bearer ${sharedStoreSecretAccessKey}`,
    ...extra,
  };
}

async function sharedRestReadJson<T>(key: string): Promise<T | null> {
  const res = await fetch(`${sharedRestBase}/object/${sharedStoreBucket}/${key}`, {
    method: "GET",
    headers: sharedRestHeaders(),
    cache: "no-store",
  });
  if (res.status === 404 || res.status === 400) return null;
  if (!res.ok) throw new Error(`shared_store_rest_read_failed:${res.status}`);
  const text = await res.text();
  if (!text) return null;
  return JSON.parse(text) as T;
}

async function sharedRestWriteJson<T>(key: string, value: T): Promise<void> {
  const res = await fetch(`${sharedRestBase}/object/${sharedStoreBucket}/${key}`, {
    method: "POST",
    headers: sharedRestHeaders({ "Content-Type": "application/json", "x-upsert": "true" }),
    body: JSON.stringify(value, null, 2) + "\n",
  });
  if (!res.ok) throw new Error(`shared_store_rest_write_failed:${res.status}`);
}

async function sharedRestDeleteJson(key: string): Promise<void> {
  const res = await fetch(`${sharedRestBase}/object/${sharedStoreBucket}/${key}`, {
    method: "DELETE",
    headers: sharedRestHeaders(),
  });
  if (res.ok) return;

  // Supabase Storage answers 400 — not 404 — when the object is already gone, and deleting something
  // twice is the normal shape of a resumable erasure. The classification is a pure function so the
  // rule can be exercised exhaustively; see the comment there for why the status alone is not the
  // evidence and a blanket "400 means gone" would be the fail-open version of the same bug.
  const body = await res.text().catch(() => "");
  if (classifySharedStoreDelete({ status: res.status, body }) === "already_absent") return;
  throw new Error(`shared_store_rest_delete_failed:${res.status}`);
}

async function sharedRestListKeys(prefix: string): Promise<string[]> {
  // Supabase Storage list is folder-oriented and returns names relative to the prefix;
  // the store lists single-folder prefixes (phase1/<category>/), so full keys are
  // reconstructed as prefix + child name for file entries (id present).
  const folder = prefix.replace(/\/$/, "");
  const keys: string[] = [];
  const pageSize = 1000;
  let offset = 0;
  for (;;) {
    const res = await fetch(`${sharedRestBase}/object/list/${sharedStoreBucket}`, {
      method: "POST",
      headers: sharedRestHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ prefix: `${folder}/`, limit: pageSize, offset }),
    });
    if (!res.ok) throw new Error(`shared_store_rest_list_failed:${res.status}`);
    const entries = (await res.json()) as { name: string; id: string | null }[];
    for (const entry of entries) {
      if (entry.id) keys.push(`${folder}/${entry.name}`);
    }
    if (entries.length < pageSize) break;
    offset += pageSize;
  }
  return keys;
}

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${randomBytes(6).toString("hex")}`;
}

/**
 * The authority on what "the same email" means for an account.
 *
 * Exported because the provisioning saga is keyed by a digest of the normalized address, and that
 * key has to agree with the `accounts/by-email` lookup exactly. A fourth private copy of this
 * two-line function is how the key silently stops matching the account it is supposed to name.
 */
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sortByCreatedAtDesc<T extends { createdAt: string }>(entries: T[]) {
  return [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function defaultSupportProfile(): SupportProfile {
  return {
    lineBindingStatus: "not_connected",
    lineDisplayName: "",
    lineNotificationsEnabled: false,
    familyContactName: "",
    familyContactRelation: "",
    familyContactMethod: "",
    familyContactValue: "",
    familyShareNote: "",
  };
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, 64);

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
}

function migrationStateKey() {
  return `${SHARED_PREFIX}/migrations/file-store-v${MIGRATION_VERSION}.json`;
}

function accountRecordKey(id: string) {
  return `${SHARED_PREFIX}/accounts/by-id/${id}.json`;
}

function accountEmailLookupKey(email: string) {
  const digest = createHash("sha256").update(normalizeEmail(email)).digest("hex");
  return `${SHARED_PREFIX}/accounts/by-email/${digest}.json`;
}

function sessionRecordKey(id: string) {
  return `${SHARED_PREFIX}/sessions/${id}.json`;
}

function consultationRecordKey(id: string) {
  return `${SHARED_PREFIX}/consultations/${id}.json`;
}

function passwordResetTokenKey(tokenHash: string) {
  return `${SHARED_PREFIX}/password-resets/${tokenHash}.json`;
}

function lineUserLookupKey(lineUserId: string) {
  const digest = createHash("sha256").update(lineUserId).digest("hex");
  return `${SHARED_PREFIX}/accounts/by-line-user/${digest}.json`;
}

function lineWebhookEventKey(id: string) {
  return `${SHARED_PREFIX}/line-events/${id}.json`;
}

function recentLineWebhookSubjectsKey() {
  return `${SHARED_PREFIX}/line-events/admin-recent-subjects.json`;
}

function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function ensureFile<T>(file: DataFile<T>) {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(file.path);
  } catch {
    await fs.writeFile(file.path, JSON.stringify(file.fallback, null, 2) + "\n", "utf8");
  }
}

async function readLocalJson<T>(file: DataFile<T>) {
  await ensureFile(file);
  const content = await fs.readFile(file.path, "utf8");

  try {
    return JSON.parse(content) as T;
  } catch {
    return file.fallback;
  }
}

async function writeLocalJson<T>(file: DataFile<T>, value: T) {
  await ensureFile(file);
  await fs.writeFile(file.path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function isMissingObjectError(error: unknown) {
  return (
    error instanceof NoSuchKey ||
    (typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error.name === "NoSuchKey" || error.name === "NotFound" || error.name === "NoSuchBucket"))
  );
}

async function sharedReadJson<T>(key: string) {
  if (sharedStoreMode === "supabase-rest") {
    return sharedRestReadJson<T>(key);
  }
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return null;
  }

  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: sharedStoreBucket,
        Key: key,
      }),
    );
    const content = await response.Body?.transformToString();

    if (!content) {
      return null;
    }

    return JSON.parse(content) as T;
  } catch (error) {
    if (isMissingObjectError(error)) {
      return null;
    }
    throw error;
  }
}

async function sharedWriteJson<T>(key: string, value: T) {
  if (sharedStoreMode === "supabase-rest") {
    return sharedRestWriteJson<T>(key, value);
  }
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }

  await client.send(
    new PutObjectCommand({
      Bucket: sharedStoreBucket,
      Key: key,
      Body: JSON.stringify(value, null, 2) + "\n",
      ContentType: "application/json",
    }),
  );
}

async function sharedDeleteJson(key: string) {
  if (sharedStoreMode === "supabase-rest") {
    return sharedRestDeleteJson(key);
  }
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    throw new Error("shared_store_not_configured");
  }

  await client.send(
    new DeleteObjectCommand({
      Bucket: sharedStoreBucket,
      Key: key,
    }),
  );
}

async function sharedListKeys(prefix: string) {
  if (sharedStoreMode === "supabase-rest") {
    return sharedRestListKeys(prefix);
  }
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return [];
  }

  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: sharedStoreBucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );

    for (const entry of response.Contents || []) {
      if (entry.Key) {
        keys.push(entry.Key);
      }
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

async function sharedListJsonObjects<T>(prefix: string) {
  const keys = await sharedListKeys(prefix);
  const entries = await Promise.all(keys.map((key) => sharedReadJson<T>(key)));
  const resolved: T[] = [];

  for (const entry of entries) {
    if (entry) {
      resolved.push(entry);
    }
  }

  return resolved;
}

async function getSharedAccountById(id: string) {
  return sharedReadJson<AccountRecord>(accountRecordKey(id));
}

async function getSharedAccountByEmail(email: string) {
  const lookup = await sharedReadJson<AccountEmailLookup>(accountEmailLookupKey(email));

  if (!lookup) {
    return null;
  }

  return getSharedAccountById(lookup.accountId);
}

async function getSharedAccountByLineUserId(lineUserId: string) {
  const lookup = await sharedReadJson<AccountLineLookup>(lineUserLookupKey(lineUserId));

  if (lookup) {
    return getSharedAccountById(lookup.accountId);
  }

  const accounts = await listSharedAccounts();
  const account = accounts.find((entry) => entry.lineUserId === lineUserId) || null;

  if (account) {
    await sharedWriteJson(lineUserLookupKey(lineUserId), {
      accountId: account.id,
      lineUserId,
      updatedAt: nowIso(),
    } satisfies AccountLineLookup);
  }

  return account;
}

// The lowest-level account writer there is: the primary record plus every index that resolves to it.
// It takes a context so that no path — not even one inside this module — can reach the store without
// naming the authority it is writing under.
async function putSharedAccountRecord(context: AccountWriteContext, account: AccountRecord) {
  assertAccountWriteContext(context, account.id);
  const normalizedEmail = normalizeEmail(account.email);
  const normalizedAccount = {
    ...account,
    email: normalizedEmail,
  };
  const existingAccount = await getSharedAccountById(normalizedAccount.id);

  // POR-1 — THE SERIALIZATION POINT, and it runs BEFORE the mirror objects, not after.
  //
  // This function is the one funnel through which every identity key family is written: the account
  // record, the email lookup, the retirement of a superseded LINE lookup and the current one. So it
  // is where the strongly consistent statement of what this account owns belongs.
  //
  // The ORDER is the safety property. Commit the link first and a failed object write leaves a link
  // with no object, which makes a deletion manifest WIDER than it needs to be — harmless, because
  // deleting an absent key is success. Write the object first and a failed link commit leaves an
  // object with no link, which makes the manifest NARROWER — and a manifest that never names a key
  // is a key that is never erased and never missed. That is the defect this whole migration exists
  // to close, so the order is not an implementation detail.
  //
  // It also throws rather than warning. A LINE binding that answers "connected" while the registry
  // does not record the connection is the false-success shape this package has already had to remove
  // from registration twice; contract §9 requires the response to wait for the commit.
  await syncCanonicalIdentityLinks({
    accountId: normalizedAccount.id,
    links: identityLinksForAccount({
      email: normalizedEmail,
      lineUserId: normalizedAccount.lineUserId,
    }),
  });

  await sharedWriteJson(accountRecordKey(normalizedAccount.id), normalizedAccount);
  await sharedWriteJson(accountEmailLookupKey(normalizedEmail), {
    accountId: normalizedAccount.id,
    email: normalizedEmail,
    updatedAt: nowIso(),
  } satisfies AccountEmailLookup);

  if (existingAccount?.lineUserId && existingAccount.lineUserId !== normalizedAccount.lineUserId) {
    // A rebind or an unbind — and the ONLY place either is genuinely observable, because it is a
    // comparison of two known LINE subjects rather than an inference from one being absent.
    //
    // The canonical link is retired here for exactly that reason. The sync above is additive and
    // will never retire on absence: it derives its set from an account read that can be served
    // stale, and letting a stale read retire a link is how a true LINE binding got erased from the
    // registry between the binding and the deletion that needed it.
    await retireCanonicalIdentityLink({
      accountId: normalizedAccount.id,
      kind: "line_subject",
      digest: lineIdentityDigest(existingAccount.lineUserId),
    });
    await sharedDeleteJson(lineUserLookupKey(existingAccount.lineUserId));
  }

  if (normalizedAccount.lineUserId) {
    await sharedWriteJson(lineUserLookupKey(normalizedAccount.lineUserId), {
      accountId: normalizedAccount.id,
      lineUserId: normalizedAccount.lineUserId,
      updatedAt: nowIso(),
    } satisfies AccountLineLookup);
  }

  return normalizedAccount;
}

// A session record naming an account IS a credential for that account, so writing one is governed
// exactly like writing the account. An anonymous session names nobody and needs no context.
async function putSharedSessionRecord(context: AccountWriteContext | null, session: SessionRecord) {
  const linkedAccountId = session.userId || session.principalLanding?.legacyAccountId || null;
  if (linkedAccountId) assertAccountWriteContext(context, linkedAccountId);
  await sharedWriteJson(sessionRecordKey(session.id), session);
  return session;
}

async function getSharedSessionById(id: string) {
  return sharedReadJson<SessionRecord>(sessionRecordKey(id));
}

async function deleteSharedSession(id: string) {
  await sharedDeleteJson(sessionRecordKey(id));
}

async function putSharedConsultationRecord(consultation: ConsultationRecord) {
  await sharedWriteJson(consultationRecordKey(consultation.id), consultation);
  return consultation;
}

async function getSharedConsultationById(id: string) {
  return sharedReadJson<ConsultationRecord>(consultationRecordKey(id));
}

async function getSharedPasswordResetTokenByHash(tokenHash: string) {
  return sharedReadJson<PasswordResetTokenRecord>(passwordResetTokenKey(tokenHash));
}

async function listSharedAccounts() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<AccountRecord>(`${SHARED_PREFIX}/accounts/by-id/`));
}

async function listSharedSessions() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<SessionRecord>(`${SHARED_PREFIX}/sessions/`));
}

async function listSharedConsultations() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<ConsultationRecord>(`${SHARED_PREFIX}/consultations/`));
}

async function listSharedPasswordResetTokens() {
  return sortByCreatedAtDesc(await sharedListJsonObjects<PasswordResetTokenRecord>(`${SHARED_PREFIX}/password-resets/`));
}

async function putSharedPasswordResetToken(record: PasswordResetTokenRecord) {
  await sharedWriteJson(passwordResetTokenKey(record.tokenHash), record);
  return record;
}

async function listSharedLineWebhookEvents() {
  return (await sharedListJsonObjects<LineWebhookEventRecord>(`${SHARED_PREFIX}/line-events/`)).sort((a, b) =>
    b.receivedAt.localeCompare(a.receivedAt),
  );
}

async function putSharedLineWebhookEvent(record: LineWebhookEventRecord) {
  await sharedWriteJson(lineWebhookEventKey(record.id), record);
  return record;
}

async function getSharedRecentLineWebhookSubjects() {
  return (await sharedReadJson<RecentLineWebhookSubjectRecord[]>(recentLineWebhookSubjectsKey())) || [];
}

async function putSharedRecentLineWebhookSubjects(records: RecentLineWebhookSubjectRecord[]) {
  await sharedWriteJson(recentLineWebhookSubjectsKey(), records);
  return records;
}

async function getSharedLineWebhookEventById(id: string) {
  return sharedReadJson<LineWebhookEventRecord>(lineWebhookEventKey(id));
}

function toRecentLineWebhookSubjectRecord(record: LineWebhookEventRecord): RecentLineWebhookSubjectRecord | null {
  if (!record.lineUserId) {
    return null;
  }

  return {
    eventId: record.id,
    webhookEventId: record.webhookEventId,
    lineUserId: record.lineUserId,
    accountId: record.accountId,
    sourceType: record.sourceType,
    eventType: record.eventType,
    messageType: record.messageType,
    messageText: record.messageText,
    postbackData: record.postbackData,
    eventTimestamp: record.eventTimestamp,
    receivedAt: record.receivedAt,
  };
}

function mergeRecentLineWebhookSubjectRecords(
  records: RecentLineWebhookSubjectRecord[],
  incoming: RecentLineWebhookSubjectRecord,
  limit = 20,
) {
  const next = [incoming, ...records.filter((entry) => entry.eventId !== incoming.eventId)];
  return next
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
    .slice(0, Math.max(1, limit));
}

/**
 * POR-1 — is the canonical LINE activity schema deployed here?
 *
 * Readiness, not a capability. A deployment predating `202607310001` keeps its exact previous
 * behaviour and attempts no RPC that cannot succeed; one that has the tables uses them for BOTH the
 * read and the write, and stops writing the shared array entirely.
 */
function canonicalLineActivityEnabled() {
  return resolveLineActivityMode({ schemaReady: isCanonicalLineActivitySchemaReady() }) === "canonical";
}

/**
 * LEGACY — the shared recent-LINE-subject array.
 *
 * Retained for deployments that predate the canonical tables, and for an application rollback onto
 * one. In canonical mode this is never called: a second writer to a read-modify-write document is
 * the defect, so mirroring into it "for compatibility" would reintroduce exactly what the canonical
 * model removes.
 */
async function updateRecentLineWebhookSubjectIndex(record: LineWebhookEventRecord) {
  const recentRecord = toRecentLineWebhookSubjectRecord(record);

  if (!recentRecord) {
    return;
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const existing = await getSharedRecentLineWebhookSubjects();
    await putSharedRecentLineWebhookSubjects(mergeRecentLineWebhookSubjectRecords(existing, recentRecord));
    return;
  }

  const existing = await readLocalJson(recentLineWebhookSubjectsFile);
  await writeLocalJson(recentLineWebhookSubjectsFile, mergeRecentLineWebhookSubjectRecords(existing, recentRecord));
}

async function ensureSharedStoreReady() {
  if (!shouldUseSharedStore) {
    return;
  }

  if (!sharedStoreReadyPromise) {
    sharedStoreReadyPromise = migrateLegacyFilesToSharedStore();
  }

  await sharedStoreReadyPromise;
}

async function migrateLegacyFilesToSharedStore() {
  const client = getSharedStoreClient();

  if (!client || !sharedStoreBucket) {
    return;
  }

  const existingMarker = await sharedReadJson<MigrationState>(migrationStateKey());
  if (existingMarker) {
    return;
  }

  const [existingAccounts, existingSessions, existingConsultations] = await Promise.all([
    sharedListKeys(`${SHARED_PREFIX}/accounts/by-id/`),
    sharedListKeys(`${SHARED_PREFIX}/sessions/`),
    sharedListKeys(`${SHARED_PREFIX}/consultations/`),
  ]);

  if (existingAccounts.length || existingSessions.length || existingConsultations.length) {
    await sharedWriteJson(migrationStateKey(), {
      version: MIGRATION_VERSION,
      migratedAt: nowIso(),
      source: "shared_store_bootstrap",
      accountCount: existingAccounts.length,
      sessionCount: existingSessions.length,
      consultationCount: existingConsultations.length,
    } satisfies MigrationState);
    return;
  }

  const [legacyAccounts, legacySessions, legacyConsultations] = await Promise.all([
    readLocalJson(accountsFile),
    readLocalJson(sessionsFile),
    readLocalJson(consultationsFile),
  ]);

  for (const account of legacyAccounts) {
    await withLegacyBootstrapContext(account.id, (context) => putSharedAccountRecord(context, account));
  }

  for (const session of legacySessions) {
    const linkedAccountId = session.userId || session.principalLanding?.legacyAccountId || null;
    if (linkedAccountId) {
      await withLegacyBootstrapContext(linkedAccountId, (context) =>
        putSharedSessionRecord(context, session),
      );
    } else {
      await putSharedSessionRecord(null, session);
    }
  }

  for (const consultation of legacyConsultations) {
    await putSharedConsultationRecord(consultation);
  }

  await sharedWriteJson(migrationStateKey(), {
    version: MIGRATION_VERSION,
    migratedAt: nowIso(),
    source: "legacy_file",
    accountCount: legacyAccounts.length,
    sessionCount: legacySessions.length,
    consultationCount: legacyConsultations.length,
  } satisfies MigrationState);
}

// ── POR-1: narrow identity-lifecycle primitives ─────────────────────────────
//
// Exported ONLY for the account-deletion adapter, which derives every key from stored account
// data. There is deliberately no exported list-and-delete pair and no caller-supplied key path:
// a generic object-deletion capability reachable from the app is a much larger risk than the
// deletion problem it would solve. The guard below refuses anything outside the identity prefixes
// so a future caller cannot widen this by accident.

/** Delete one identity object. Missing is success — deletion is idempotent by contract. */
export async function deleteSharedIdentityObject(key: string): Promise<void> {
  assertIdentityKey(key);
  try {
    await sharedDeleteJson(key);
  } catch (error) {
    // A missing object is the desired end state, not a failure to retry.
    const code = error instanceof Error ? error.message : "";
    if (/not.?found|NoSuchKey|404/i.test(code)) return;
    throw error;
  }
}

/**
 * POR-1 — prune one person's entries from the SHARED recent-LINE-subject index.
 *
 * This index is a single array covering every LINE subject, so it is the one account-linked object
 * that must be rewritten rather than deleted: deleting it to erase one person would erase everyone.
 *
 * Matched by FINGERPRINT — sha256 of the LINE user id — so the caller never needs the raw id it is
 * erasing, and the deletion manifest never has to keep one.
 *
 * Requires a deletion context like every other account-linked write.
 */
export async function pruneRecentLineWebhookSubjects(
  context: AccountDeletionContext,
  lineUserIdFingerprints: string[],
): Promise<number> {
  assertAccountWriteContext(context);
  if (lineUserIdFingerprints.length === 0) return 0;
  const wanted = new Set(lineUserIdFingerprints);
  const matches = (record: RecentLineWebhookSubjectRecord) =>
    wanted.has(createHash("sha256").update(record.lineUserId).digest("hex"));

  if (canonicalLineActivityEnabled()) {
    // The authoritative erasure: SUBJECT-scoped by digest, so it cannot touch anyone else, and its
    // result is a committed row count rather than an inference from a re-read.
    //
    // Subject-scoped, not event-scoped, because tombstoning the rows that exist right now protects
    // only redelivery of THOSE events. LINE decides when the next event id exists, and a brand-new
    // one would have been inserted as live activity for a person who no longer exists. The subject
    // state is terminal, so the barrier holds for deliveries this erasure never saw.
    const erased = await eraseCanonicalLineSubjects({ lineSubjectHashes: [...wanted] });

    // The frozen legacy array may still hold this person's historical entries from before the
    // cutover. Residue is residue, so it is still cleared — but the lost-update hazard is gone,
    // because in canonical mode nothing writes this object any more.
    let legacyRemoved = 0;
    if (shouldUseSharedStore) {
      await ensureSharedStoreReady();
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const records = await getSharedRecentLineWebhookSubjects();
        const stillPresent = records.filter(matches);
        if (stillPresent.length === 0) break;
        await putSharedRecentLineWebhookSubjects(records.filter((record) => !matches(record)));
        legacyRemoved += stillPresent.length;
        if (attempt === 9) throw new Error("recent_line_subject_prune_unconfirmed");
        await new Promise((resolve) => setTimeout(resolve, 1200));
      }
    } else {
      const records = await readLocalJson(recentLineWebhookSubjectsFile);
      const kept = records.filter((record) => !matches(record));
      if (kept.length !== records.length) {
        await writeLocalJson(recentLineWebhookSubjectsFile, kept);
        legacyRemoved = records.length - kept.length;
      }
    }

    return erased + legacyRemoved;
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();

    // THE STORE IS NOT READ-AFTER-WRITE CONSISTENT, AND THIS IS A READ-MODIFY-WRITE.
    //
    // A single pass is not enough. A read that returns a slightly stale copy of this shared array
    // can miss the very entry being erased — and then the write puts back a document that still
    // contains it, while the prune reports success. Measured on the isolated Preview transport: a
    // GET issued a minute after a successful overwrite still returned the previous version.
    //
    // So the prune re-reads and repeats until the entries are provably absent. The window is sized
    // from the MEASURED lag on this transport — an overwrite took 5.4 seconds to become visible on
    // this very key — with room to spare, rather than from a number that felt about right. Still
    // bounded: an erasure that cannot be proven in a few seconds deserves the retryable state the
    // caller gives it, and a loop that never gives up would hold a deletion open forever.
    let removed = 0;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const records = await getSharedRecentLineWebhookSubjects();
      const stillPresent = records.filter(matches);
      if (stillPresent.length === 0) return removed;

      await putSharedRecentLineWebhookSubjects(records.filter((record) => !matches(record)));
      removed += stillPresent.length;
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }

    // Refuse to report a clean prune we could not confirm. The caller records a retryable failure and
    // the cursor stays put, which is exactly right: nothing later depends on this having succeeded,
    // and claiming it did would be the one lie a deletion must never tell.
    throw new Error("recent_line_subject_prune_unconfirmed");
  }

  const records = await readLocalJson(recentLineWebhookSubjectsFile);
  const kept = records.filter((record) => !matches(record));
  if (kept.length === records.length) return 0;
  await writeLocalJson(recentLineWebhookSubjectsFile, kept);
  return records.length - kept.length;
}

/** Existence probe used only to VERIFY erasure before finalization. */
/**
 * Existence probe used ONLY to verify erasure — and therefore strict.
 *
 * It used to catch every error and answer `false`. A timeout, a 403, a 429, a 5xx or a malformed
 * response all became "the object is gone", which is the one wrong answer that lets a deletion
 * finalize over data it never removed. `false` now means PROVEN ABSENT and nothing else; anything
 * undetermined throws, and the saga moves to `failed_retryable` rather than declaring success.
 *
 * It also does NOT go through `sharedReadJson`, which folds HTTP 400 into `null` — convenient for
 * an ordinary read, fatal for a proof.
 */
export async function sharedIdentityObjectExists(key: string): Promise<boolean> {
  assertIdentityKey(key);

  if (sharedStoreMode === "supabase-rest") {
    const response = await fetch(`${sharedRestBase}/object/${sharedStoreBucket}/${key}`, {
      method: "GET",
      headers: sharedRestHeaders(),
      cache: "no-store",
    });
    if (response.status === 404) return false;
    if (response.ok) return true;
    if (response.status === 400) {
      // Supabase answers 400 for some missing-object shapes. Accept ONLY an explicit not-found
      // classification — a malformed request also returns 400 and must not read as absence.
      const body = await response.text().catch(() => "");
      if (/not[_ -]?found|NoSuchKey|Object not found/i.test(body)) return false;
      throw new Error("shared_store_existence_undetermined:400");
    }
    throw new Error(`shared_store_existence_undetermined:${response.status}`);
  }

  try {
    return (await sharedReadJson<unknown>(key)) !== null;
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    // Only a provider not-found is absence; everything else is undetermined.
    if (/NoSuchKey|NotFound|404/i.test(code)) return false;
    throw new Error("shared_store_existence_undetermined");
  }
}

/** The same normalization the email index is built from, so deletion targets the right digest. */
export function normalizeAccountEmail(email: string): string {
  return normalizeEmail(email);
}

export async function listAccounts(): Promise<AccountRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedAccounts();
  }

  return readLocalJson(accountsFile);
}

export async function findAccountByEmail(email: string): Promise<AccountRecord | null> {
  const normalizedEmail = normalizeEmail(email);

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedAccountByEmail(normalizedEmail);
  }

  const accounts = await listAccounts();
  return accounts.find((account) => normalizeEmail(account.email) === normalizedEmail) || null;
}

export async function findAccountById(id: string): Promise<AccountRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedAccountById(id);
  }

  const accounts = await listAccounts();
  return accounts.find((account) => account.id === id) || null;
}

export async function findAccountByLineUserId(lineUserId: string): Promise<AccountRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedAccountByLineUserId(lineUserId);
  }

  const accounts = await listAccounts();
  return accounts.find((account) => account.lineUserId === lineUserId) || null;
}

export async function createAccount(input: {
  name: string;
  email: string;
  password: string;
  city: string;
  role: AccountRole;
}) {
  const normalizedEmail = normalizeEmail(input.email);
  // The id is minted BEFORE the lease, because a lease is taken on an account id and there is no
  // other way to name an account that does not exist yet. A brand-new id has an open gate, so this
  // is not a formality: it is what stops a registration racing a deletion of the SAME id, and what
  // makes the existence check and the write one window rather than two.
  const accountId = createId("acct");

  return withAccountProvisioningLease({
    accountId,
    operation: "account_registration",
    execute: async (context) => {
      if (shouldUseSharedStore) {
        await ensureSharedStoreReady();
        const existing = await getSharedAccountByEmail(normalizedEmail);

        if (existing) {
          return { ok: false as const, reason: "email_exists" as const };
        }

        const account: AccountRecord = {
          id: accountId,
          name: input.name,
          email: normalizedEmail,
          passwordHash: hashPassword(input.password),
          city: input.city,
          role: input.role,
          createdAt: nowIso(),
          updatedAt: nowIso(),
          supportProfile: defaultSupportProfile(),
        };

        await putSharedAccountRecord(context, account);
        return { ok: true as const, account };
      }

      const accounts = await listAccounts();
      const existing = accounts.find((account) => normalizeEmail(account.email) === normalizedEmail);

      if (existing) {
        return { ok: false as const, reason: "email_exists" as const };
      }

      const account: AccountRecord = {
        id: accountId,
        name: input.name,
        email: normalizedEmail,
        passwordHash: hashPassword(input.password),
        city: input.city,
        role: input.role,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        supportProfile: defaultSupportProfile(),
      };

      accounts.unshift(account);
      await writeLocalJson(accountsFile, accounts);
      return { ok: true as const, account };
    },
  });
}

function hashPasswordForStorage(password: string) {
  return hashPassword(password);
}

/**
 * Write the primary account record.
 *
 * POR-1 — this is THE resurrection primitive. It is a read-modify-upsert of the identity itself, and
 * every account-deleting failure this package has seen ended here: a request that had read the
 * account before a deletion started, writing its stale copy afterwards.
 *
 * So it now requires a live write context, which only `accountMutationLease` can mint and which only
 * exists inside a held lease. A caller that has not taken the lease cannot call this at all, and a
 * caller that took one and then let it lapse holds a REVOKED context — which fails the same check a
 * forged one does. The lease is what makes the ordering decidable; the context is what makes the
 * lease unavoidable.
 */
export async function upsertAccountRecord(
  context: AccountWriteContext,
  account: AccountRecord,
): Promise<AccountRecord> {
  assertAccountWriteContext(context, account.id);
  const normalizedAccount = {
    ...account,
    email: normalizeEmail(account.email),
  };

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedAccountRecord(context, normalizedAccount);
    return normalizedAccount;
  }

  const accounts = await listAccounts();
  const nextAccounts = [...accounts];
  const existingIndex = nextAccounts.findIndex(
    (entry) => entry.id === normalizedAccount.id || normalizeEmail(entry.email) === normalizedAccount.email,
  );

  if (existingIndex >= 0) {
    nextAccounts[existingIndex] = normalizedAccount;
  } else {
    nextAccounts.unshift(normalizedAccount);
  }

  await writeLocalJson(accountsFile, nextAccounts);
  return normalizedAccount;
}

// POR-1 — every read-modify-write of an account runs under a mutation lease.
//
// The lease is taken BEFORE the read, deliberately. Taking it just before the write would leave the
// exact window this exists to close: read the account, a deletion runs, write the stale copy back.
export async function updateAccountPassword(
  userId: string,
  password: string,
  context?: AccountWriteContext,
): Promise<AccountRecord | null> {
  // `context` lets account recovery hold ONE window across validate → password → token retirement,
  // instead of a lease that covers only the middle step.
  if (context) return updateAccountPasswordUnderLease(context, userId, password);
  return withAccountMutationLease({
    accountId: userId,
    operation: "password_update",
    execute: (ctx) => updateAccountPasswordUnderLease(ctx, userId, password),
  });
}

async function updateAccountPasswordUnderLease(
  context: AccountWriteContext,
  userId: string,
  password: string,
): Promise<AccountRecord | null> {
  const account = await findAccountById(userId);

  if (!account) {
    return null;
  }

  const updatedAccount: AccountRecord = {
    ...account,
    passwordHash: hashPasswordForStorage(password),
    updatedAt: nowIso(),
  };

  await upsertAccountRecord(context, updatedAccount);
  return updatedAccount;
}

/**
 * POR-1 WS5 — hold or release the account.
 *
 * Returns false when the record is already gone: an erased account needs no marker, and the
 * caller must not read that as a failure to lock.
 */
export async function setAccountDeletionLock(
  context: AccountWriteContext,
  userId: string,
  locked: boolean,
): Promise<boolean> {
  assertAccountWriteContext(context, userId);
  const account = await findAccountById(userId);
  if (!account) return false;

  const next: AccountRecord = { ...account, updatedAt: nowIso() };
  if (locked) {
    next.deletionLockedAt = nowIso();
  } else {
    delete next.deletionLockedAt;
  }

  await upsertAccountRecord(context, next);
  return true;
}

/**
 * `context` is optional so a caller already inside a window extends it rather than opening a second
 * one. The canonical support-profile update is exactly that case: it saves the foundation profile and
 * then this legacy mirror, and those two writes have to be ONE window — the previous split is what
 * left the foundation half outside the fence.
 */
export async function updateSupportProfile(
  userId: string,
  patch: Partial<SupportProfile>,
  context?: AccountWriteContext,
): Promise<AccountRecord | null> {
  if (context) return updateSupportProfileUnderLease(context, userId, patch);
  return withAccountMutationLease({
    accountId: userId,
    operation: "support_profile_update",
    execute: (ctx) => updateSupportProfileUnderLease(ctx, userId, patch),
  });
}

async function updateSupportProfileUnderLease(
  context: AccountWriteContext,
  userId: string,
  patch: Partial<SupportProfile>,
): Promise<AccountRecord | null> {
  const account = await findAccountById(userId);

  if (!account) {
    return null;
  }

  const updatedAccount: AccountRecord = {
    ...account,
    updatedAt: nowIso(),
    supportProfile: {
      ...account.supportProfile,
      ...patch,
    },
  };

  await upsertAccountRecord(context, updatedAccount);
  return updatedAccount;
}

export async function bindLineIdentity(input: {
  userId: string;
  lineUserId: string;
  lineDisplayName: string;
  linePictureUrl?: string;
  lineIdTokenSubject?: string;
}): Promise<AccountRecord | null> {
  return withAccountMutationLease({
    accountId: input.userId,
    operation: "line_binding",
    execute: (context) => bindLineIdentityUnderLease(context, input),
  });
}

async function bindLineIdentityUnderLease(context: AccountWriteContext, input: {
  userId: string;
  lineUserId: string;
  lineDisplayName: string;
  linePictureUrl?: string;
  lineIdTokenSubject?: string;
}): Promise<AccountRecord | null> {
  const account = await findAccountById(input.userId);

  if (!account) {
    return null;
  }

  const existingHolder = await findAccountByLineUserId(input.lineUserId);
  if (existingHolder && existingHolder.id !== input.userId) {
    return null;
  }

  const updatedAccount: AccountRecord = {
    ...account,
    updatedAt: nowIso(),
    lineUserId: input.lineUserId,
    lineConnectedAt: nowIso(),
    linePictureUrl: input.linePictureUrl || account.linePictureUrl || "",
    lineIdTokenSubject: input.lineIdTokenSubject || input.lineUserId,
    supportProfile: {
      ...account.supportProfile,
      lineBindingStatus: "connected",
      lineDisplayName: input.lineDisplayName,
    },
  };

  await upsertAccountRecord(context, updatedAccount);
  return updatedAccount;
}

export async function listSessions(): Promise<SessionRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedSessions();
  }

  return readLocalJson(sessionsFile);
}

export async function findSessionById(id: string): Promise<SessionRecord | null> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedSessionById(id);
  }

  const sessions = await listSessions();
  return sessions.find((session) => session.id === id) || null;
}

/**
 * POR-1 — mint a session.
 *
 * An account-linked session IS a credential for that account, so creating one is governed exactly
 * like writing the account: without this, a stale request could mint a fresh live session for a
 * person whose deletion had already closed the gate.
 *
 * An anonymous session (`userId === null`) is not a credential for anyone and needs no context.
 */
export async function createSession(
  context: AccountWriteContext | null,
  userId: string | null,
): Promise<SessionRecord> {
  if (userId) assertAccountWriteContext(context, userId);
  const session: SessionRecord = {
    id: createId("sess"),
    userId,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedSessionRecord(context, session);
    return session;
  }

  const sessions = await listSessions();
  sessions.unshift(session);
  await writeLocalJson(sessionsFile, sessions);
  return session;
}

/**
 * POR-1 — INSERT a session row that does not exist yet, keeping its id.
 *
 * WHY THIS EXISTS. The session cookie is SELF-CONTAINED, and `getViewerContext` fabricates a
 * synthetic session from it when the store has no matching row. That is deliberate and it is what
 * keeps an anonymous visitor working across a store blip — but it means `ensureViewerSession()` can
 * hand back a session id the store has never seen, and `touchSession` (which updates in place) then
 * finds nothing and returns null.
 *
 * Registration used to paper over exactly that with `|| { ...session, userId: account.id }`: an
 * in-memory object shaped like a bound session, from which a cookie was then minted. The browser
 * ended up authenticated with no server-side session record at all.
 *
 * So the row is created, keeping the ID — a new id would break anonymous→register continuity, which
 * is the whole point of registering from a session that already has activity.
 *
 * DELIBERATELY NOT AN UPSERT, and `touchSession` deliberately stays update-only. An upsert on this
 * table is a resurrection primitive: session revocation deletes rows, and a stale cookie replaying
 * against an upsert would recreate the session it just lost. This inserts ONLY when absent, requires
 * a write context exactly as every other account-linked write does, and returns the existing row
 * untouched when there is one.
 */
export async function insertSessionRecordIfAbsent(
  context: AccountWriteContext | null,
  session: SessionRecord,
): Promise<SessionRecord | null> {
  const attachesAccount =
    Boolean(session.userId) ||
    Boolean(session.principalLanding && (session.principalLanding.legacyAccountId || session.principalLanding.principalId));
  if (attachesAccount) {
    assertAccountWriteContext(
      context,
      session.userId || session.principalLanding?.legacyAccountId || undefined,
    );
  }

  const existing = await findSessionById(session.id);
  if (existing) return existing;

  const record: SessionRecord = { ...session, updatedAt: nowIso() };
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedSessionRecord(context, record);
    return record;
  }

  const sessions = await listSessions();
  sessions.unshift(record);
  await writeLocalJson(sessionsFile, sessions);
  return record;
}

/**
 * POR-1 — update a session record.
 *
 * A session is account-linked state, and `touchSession` is how an account gets BOUND to one. So an
 * account-linked touch requires a live write context, exactly like an account write: a stale cookie
 * arriving after a deletion must not be able to re-create the session that names the erased person.
 *
 * An ANONYMOUS touch (no account on the session, and none being attached) needs no context. It
 * carries no identity, so there is nothing for a deletion to race with — and requiring a lease for it
 * would mean taking one on every anonymous page view.
 */
export async function touchSession(
  context: AccountWriteContext | null,
  id: string,
  userId?: string | null,
  principalLanding?: SessionPrincipalLanding | null,
): Promise<SessionRecord | null> {
  const attachesAccount =
    (typeof userId === "string" && userId.length > 0) ||
    Boolean(principalLanding && (principalLanding.legacyAccountId || principalLanding.principalId));
  if (attachesAccount) {
    // Account-linked: the context is mandatory, and it must name the account being attached.
    assertAccountWriteContext(context, userId || principalLanding?.legacyAccountId || undefined);
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const session = await getSharedSessionById(id);

    if (!session) {
      return null;
    }

    const updatedSession: SessionRecord = {
      ...session,
      userId: userId === undefined ? session.userId : userId,
      principalLanding: principalLanding === undefined ? session.principalLanding || null : principalLanding,
      updatedAt: nowIso(),
    };
    await putSharedSessionRecord(context, updatedSession);
    return updatedSession;
  }

  const sessions = await listSessions();
  const updated = sessions.map((session) =>
    session.id === id
      ? {
          ...session,
          userId: userId === undefined ? session.userId : userId,
          principalLanding: principalLanding === undefined ? session.principalLanding || null : principalLanding,
          updatedAt: nowIso(),
        }
      : session,
  );
  await writeLocalJson(sessionsFile, updated);
  return updated.find((session) => session.id === id) || null;
}

export async function deleteSession(id: string) {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await deleteSharedSession(id);
    return;
  }

  const sessions = await listSessions();
  await writeLocalJson(
    sessionsFile,
    sessions.filter((session) => session.id !== id),
  );
}

export async function listConsultations(): Promise<ConsultationRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedConsultations();
  }

  return readLocalJson(consultationsFile);
}

export async function listPasswordResetTokens(): Promise<PasswordResetTokenRecord[]> {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedPasswordResetTokens();
  }

  return readLocalJson(passwordResetTokensFile);
}

export async function listLineWebhookEvents(): Promise<LineWebhookEventRecord[]> {
  if (canonicalLineActivityEnabled()) {
    return listCanonicalLineEvents();
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return listSharedLineWebhookEvents();
  }

  return readLocalJson(lineWebhookEventsFile);
}

export async function findLineWebhookEventById(id: string): Promise<LineWebhookEventRecord | null> {
  if (canonicalLineActivityEnabled()) {
    return findCanonicalLineEventById(id);
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedLineWebhookEventById(id);
  }

  const records = await listLineWebhookEvents();
  return records.find((record) => record.id === id) || null;
}

async function upsertLineWebhookEvent(record: LineWebhookEventRecord) {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();

    // The per-event object is written in BOTH modes. It is already row-addressable — one key per
    // event, no shared document, no lost update — so it never had the defect, and keeping it is
    // what makes an application rollback safe: a rolled-back deployment still finds every event
    // where it expects it.
    await putSharedLineWebhookEvent(record);

    if (canonicalLineActivityEnabled()) {
      await recordCanonicalLineEvent(record);
      return record;
    }

    await updateRecentLineWebhookSubjectIndex(record);
    return record;
  }

  if (canonicalLineActivityEnabled()) {
    await recordCanonicalLineEvent(record);
    return record;
  }

  const records = await listLineWebhookEvents();
  const nextRecords = [...records];
  const existingIndex = nextRecords.findIndex((entry) => entry.id === record.id);

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = record;
  } else {
    nextRecords.unshift(record);
  }

  await writeLocalJson(lineWebhookEventsFile, nextRecords);
  await updateRecentLineWebhookSubjectIndex(record);
  return record;
}

export async function createLineWebhookEvent(
  input: Omit<LineWebhookEventRecord, "id" | "receivedAt"> & { id?: string },
) {
  const record: LineWebhookEventRecord = {
    ...input,
    id: input.id || createId("lineevt"),
    receivedAt: nowIso(),
  };

  await upsertLineWebhookEvent(record);
  return record;
}

export async function updateLineWebhookEventReplyState(input: {
  id: string;
  replyStatus: LineWebhookEventRecord["replyStatus"];
  replyError: string | null;
}) {
  const existing = await findLineWebhookEventById(input.id);
  if (!existing) {
    return null;
  }

  const nextRecord: LineWebhookEventRecord = {
    ...existing,
    replyStatus: input.replyStatus,
    replyError: input.replyError,
  };

  await upsertLineWebhookEvent(nextRecord);
  return nextRecord;
}

export async function updateLineWebhookEventMessageText(input: {
  id: string;
  messageText: string | null;
}) {
  const existing = await findLineWebhookEventById(input.id);
  if (!existing) {
    return null;
  }

  const nextRecord: LineWebhookEventRecord = {
    ...existing,
    messageText: input.messageText,
  };

  await upsertLineWebhookEvent(nextRecord);
  return nextRecord;
}

export async function listLineWebhookEventsForAccount(accountId: string) {
  const records = await listLineWebhookEvents();
  return records.filter((record) => record.accountId === accountId);
}

export async function listRecentLineWebhookSubjects(limit = 10): Promise<RecentLineWebhookSubjectRecord[]> {
  const effectiveLimit = Math.max(1, limit);

  if (canonicalLineActivityEnabled()) {
    // Derived from the events themselves, so it cannot drift from them — and it is read from the
    // same row-locked table the write committed to, so a fresh entry is visible immediately. That
    // is the property the object-store array could not provide at any retry count.
    return listCanonicalRecentLineSubjects(effectiveLimit);
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return (await getSharedRecentLineWebhookSubjects()).slice(0, effectiveLimit);
  }

  return (await readLocalJson(recentLineWebhookSubjectsFile)).slice(0, effectiveLimit);
}

export async function getLatestLineWebhookEventForAccount(accountId: string) {
  const records = await listLineWebhookEventsForAccount(accountId);
  return records[0] || null;
}

async function upsertPasswordResetToken(record: PasswordResetTokenRecord) {
  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedPasswordResetToken(record);
    return record;
  }

  const records = await listPasswordResetTokens();
  const nextRecords = [...records];
  const existingIndex = nextRecords.findIndex((entry) => entry.tokenHash === record.tokenHash);

  if (existingIndex >= 0) {
    nextRecords[existingIndex] = record;
  } else {
    nextRecords.unshift(record);
  }

  await writeLocalJson(passwordResetTokensFile, nextRecords);
  return record;
}

/**
 * POR-1 — issuing a password-reset token is an account-linked write.
 *
 * A live reset token is a credential: minting one for an account whose deletion has begun would hand
 * out a way back into an identity that is being erased, and the token object would then have to be
 * chased down by the erasure that had already enumerated its targets. Fenced like any other.
 */
export async function createPasswordResetToken(input: {
  accountId: string;
  email: string;
  expiresInMinutes?: number;
}) {
  if (isPlaceholderEmail(input.email)) {
    throw new Error("placeholder_email_not_resettable");
  }

  return withAccountMutationLease({
    accountId: input.accountId,
    operation: "password_reset_issue",
    execute: () => createPasswordResetTokenUnderLease(input),
  });
}

async function createPasswordResetTokenUnderLease(input: {
  accountId: string;
  email: string;
  expiresInMinutes?: number;
}) {
  const token = randomBytes(32).toString("base64url");
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + (input.expiresInMinutes || 60) * 60 * 1000).toISOString();
  const record: PasswordResetTokenRecord = {
    tokenHash: hashResetToken(token),
    accountId: input.accountId,
    email: normalizeEmail(input.email),
    createdAt,
    expiresAt,
    usedAt: null,
  };

  const existing = await listPasswordResetTokens();
  const activeForAccount = existing.filter((entry) => entry.accountId === input.accountId && entry.usedAt === null);

  for (const entry of activeForAccount) {
    await upsertPasswordResetToken({
      ...entry,
      usedAt: createdAt,
    });
  }

  await upsertPasswordResetToken(record);
  return {
    token,
    record,
  };
}

export async function getPasswordResetTokenRecord(token: string): Promise<PasswordResetTokenRecord | null> {
  const tokenHash = hashResetToken(token);

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    return getSharedPasswordResetTokenByHash(tokenHash);
  }

  const records = await listPasswordResetTokens();
  return records.find((entry) => entry.tokenHash === tokenHash) || null;
}

export async function validatePasswordResetToken(token: string) {
  const record = await getPasswordResetTokenRecord(token);

  if (!record) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  if (record.usedAt) {
    return { ok: false as const, reason: "used_token" as const };
  }

  if (record.expiresAt <= nowIso()) {
    return { ok: false as const, reason: "expired_token" as const };
  }

  const account = await findAccountById(record.accountId);

  if (isPlaceholderEmail(record.email) || (account && isPlaceholderEmail(account.email))) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  if (!account || normalizeEmail(account.email) !== record.email) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  return {
    ok: true as const,
    record,
    account,
  };
}

/**
 * POR-1 — account recovery: validate the token, rewrite the password, retire the tokens.
 *
 * The whole sequence is one window. `updateAccountPassword` takes its own lease, and that lease
 * covers only the password write — so a recovery whose token was validated before a deletion started
 * could still retire tokens against an account mid-erasure. The outer window closes that, and the
 * inner call reuses this context rather than opening a second one.
 */
export async function consumePasswordResetToken(token: string, password: string) {
  const validation = await validatePasswordResetToken(token);

  if (!validation.ok) {
    return validation;
  }

  return withAccountMutationLease({
    accountId: validation.account.id,
    operation: "account_recovery",
    execute: (context) => consumePasswordResetTokenUnderLease(context, validation.account.id, password),
  });
}

async function consumePasswordResetTokenUnderLease(
  context: AccountWriteContext,
  accountId: string,
  password: string,
) {
  const updatedAccount = await updateAccountPassword(accountId, password, context);

  if (!updatedAccount) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  const allTokens = await listPasswordResetTokens();
  const relatedActiveTokens = allTokens.filter(
    (entry) => entry.accountId === accountId && entry.usedAt === null,
  );
  const usedAt = nowIso();

  for (const entry of relatedActiveTokens) {
    await upsertPasswordResetToken({
      ...entry,
      usedAt,
    });
  }

  return {
    ok: true as const,
    account: updatedAccount,
  };
}

export async function createConsultation(input: {
  sessionId: string;
  userId: string | null;
  ownerTargetId?: string | null;
  locale: Locale;
  recommendation: AdvisorRecommendation;
  answerLabels: Record<string, string>;
}): Promise<ConsultationRecord> {
  const consultation: ConsultationRecord = {
    id: createId("consult"),
    sessionId: input.sessionId,
    userId: input.ownerTargetId === undefined ? input.userId : input.ownerTargetId,
    createdAt: nowIso(),
    locale: input.locale,
    recommendedCategory: input.recommendation.recommendedCategory,
    secondaryRecommendation: input.recommendation.secondaryRecommendation,
    summary: input.recommendation.summary,
    suggestedNextAction: input.recommendation.suggestedNextAction,
    answerLabels: input.answerLabels,
    leadSubmitted: false,
    lead: null,
  };

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    await putSharedConsultationRecord(consultation);
    return consultation;
  }

  const consultations = await listConsultations();
  consultations.unshift(consultation);
  await writeLocalJson(consultationsFile, consultations);
  return consultation;
}

export async function listConsultationsForViewer(input: {
  userId: string | null;
  userIds?: string[] | null;
  sessionId: string | null;
  locale?: Locale;
}): Promise<ConsultationRecord[]> {
  const consultations = await listConsultations();
  const ownerIds = new Set((input.userIds || []).filter(Boolean));
  if (input.userId) {
    ownerIds.add(input.userId);
  }

  return consultations.filter((entry) => {
    if (input.locale && entry.locale !== input.locale) {
      return false;
    }
    if (ownerIds.size) {
      return entry.userId ? ownerIds.has(entry.userId) : false;
    }
    if (input.sessionId) {
      return entry.sessionId === input.sessionId;
    }
    return false;
  });
}

export async function attachLeadToConsultation(input: {
  consultationId: string;
  lead: AdvisorLead;
  userId: string | null;
  ownerTargetId?: string | null;
  ownerIds?: string[] | null;
}): Promise<ConsultationRecord | null> {
  const ownerIds = new Set((input.ownerIds || []).filter(Boolean));
  if (input.userId) {
    ownerIds.add(input.userId);
  }
  if (input.ownerTargetId) {
    ownerIds.add(input.ownerTargetId);
  }

  const resolveUpdatedOwnerTarget = (entry: ConsultationRecord) => {
    if (ownerIds.size && entry.userId && !ownerIds.has(entry.userId)) {
      return null;
    }

    return input.ownerTargetId === undefined ? (input.userId ?? entry.userId) : input.ownerTargetId;
  };

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const entry = await getSharedConsultationById(input.consultationId);

    if (!entry) {
      return null;
    }

    const updatedOwnerTarget = resolveUpdatedOwnerTarget(entry);

    if (updatedOwnerTarget === null) {
      return null;
    }

    const updatedEntry: ConsultationRecord = {
      ...entry,
      userId: updatedOwnerTarget,
      leadSubmitted: true,
      lead: input.lead,
    };
    await putSharedConsultationRecord(updatedEntry);
    return updatedEntry;
  }

  const consultations = await listConsultations();
  let updatedEntry: ConsultationRecord | null = null;
  const updated = consultations.map((entry) => {
    if (entry.id !== input.consultationId) {
      return entry;
    }

    const updatedOwnerTarget = resolveUpdatedOwnerTarget(entry);

    if (updatedOwnerTarget === null) {
      updatedEntry = null;
      return entry;
    }

    updatedEntry = {
      ...entry,
      userId: updatedOwnerTarget,
      leadSubmitted: true,
      lead: input.lead,
    };
    return updatedEntry;
  });
  await writeLocalJson(consultationsFile, updated);
  return updatedEntry;
}

export async function assignSessionConsultationsToUser(
  sessionId: string,
  userId: string,
  options?: {
    ownerTargetId?: string | null;
  },
) {
  const consultations = await listConsultations();
  const matching = consultations.filter((entry) => entry.sessionId === sessionId);
  const ownerTargetId = options?.ownerTargetId || userId;

  if (shouldUseSharedStore) {
    await Promise.all(
      matching.map((entry) =>
        putSharedConsultationRecord({
          ...entry,
          userId: ownerTargetId,
        }),
      ),
    );
    return;
  }

  const updated = consultations.map((entry) => (entry.sessionId === sessionId ? { ...entry, userId: ownerTargetId } : entry));
  await writeLocalJson(consultationsFile, updated);
}

export async function findConsultationForViewer(input: {
  consultationId: string;
  userId: string | null;
  userIds?: string[] | null;
  sessionId: string | null;
}): Promise<ConsultationRecord | null> {
  const ownerIds = new Set((input.userIds || []).filter(Boolean));
  if (input.userId) {
    ownerIds.add(input.userId);
  }

  if (shouldUseSharedStore) {
    await ensureSharedStoreReady();
    const entry = await getSharedConsultationById(input.consultationId);

    if (!entry) {
      return null;
    }
    if (ownerIds.size) {
      return (entry.userId && ownerIds.has(entry.userId)) || entry.sessionId === input.sessionId ? entry : null;
    }
    return input.sessionId && entry.sessionId === input.sessionId ? entry : null;
  }

  const consultations = await listConsultations();
  return (
    consultations.find((entry) => {
      if (entry.id !== input.consultationId) {
        return false;
      }
      if (ownerIds.size) {
        return (entry.userId && ownerIds.has(entry.userId)) || entry.sessionId === input.sessionId;
      }
      return input.sessionId ? entry.sessionId === input.sessionId : false;
    }) || null
  );
}
