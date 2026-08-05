// POR-1 — the canonical identity-link ROLLOUT RULE, as a pure function.
//
// The registry lives in a Preview-only migration, so a deployment that predates it must not attempt
// an RPC that cannot succeed. Same rollout-ordering problem the mutation fence and the provisioning
// saga hit, where requiring a Preview-only RPC turned the Production-lineage CI databases red.
//
// WHAT READINESS GATES, AND WHAT IT MUST NEVER GATE.
//
// Readiness gates the AUTHORITY of the registry: whether the deletion manifest may derive its
// destructive scope from strongly consistent rows instead of from a mirror read.
//
// It does NOT gate the independence of verification. `verifyIdentityErasure` iterating the manifest
// — so that a family the manifest omitted is never looked at and can be reported clean — is a defect
// in every mode, with or without this table. Gating that repair on a schema flag would mean the
// unready deployment kept reporting clean over surviving identity, which is the exact failure this
// package is here to close.
//
// No `server-only`: the rule is pure, and the permanent tests exercise this module rather than a
// paraphrase of it.

export type IdentityLinkMode = "canonical_registry" | "record_derived";

/**
 * `record_derived`      — no registry. The manifest's identity scope comes from the account object
 *   alone, exactly as before. This is the mode that can NARROW a manifest when the read is stale,
 *   and it is retained only so a deployment can precede its migration, never as a resting state.
 * `canonical_registry`  — the table exists. Destructive scope is the UNION of the strongly
 *   consistent links and whatever the record happened to show, so a stale read can only ever WIDEN
 *   the scope. Narrowing is the unsafe direction and the union is what removes it.
 */
export function resolveIdentityLinkMode(input: { schemaReady: boolean }): IdentityLinkMode {
  return input.schemaReady ? "canonical_registry" : "record_derived";
}

/**
 * Readiness is its own environment variable, not a fifth capability.
 *
 * The four `YORISOU_POR1_*` capabilities are product switches an operator flips to stop a
 * misbehaving feature. This is infrastructure: whether a schema exists. Conflating them would mean
 * kill-switching a product capability also silently returned account deletion to deriving its
 * destructive scope from a cache.
 */
export function isCanonicalIdentityLinksSchemaReady(): boolean {
  const raw = process.env.YORISOU_POR1_CANONICAL_IDENTITY_LINKS_SCHEMA_READY;
  if (typeof raw !== "string") return false;
  return raw.trim().toLowerCase() === "on";
}

/** The kinds the registry recognises. Closed, and ordered for stable reporting. */
export const IDENTITY_LINK_KINDS = [
  "email",
  "line_subject",
  "user_profile",
  "auth_identity",
  "provisioning",
] as const;

export type IdentityLinkKind = (typeof IDENTITY_LINK_KINDS)[number];

export type IdentityLink = { kind: IdentityLinkKind; digest: string };

/**
 * The two hashed families are addressed by `sha256(value)` in their object keys, so the digest is
 * sufficient to derive the key and the raw value is never needed to erase.
 *
 * Checked in the application as well as by the database CHECK. The database constraint is the
 * guarantee; this is the thing that produces a bounded error at the call site instead of a raw
 * Postgres message travelling back through an API response.
 */
export function isWellFormedIdentityLink(link: IdentityLink): boolean {
  if (!IDENTITY_LINK_KINDS.includes(link.kind)) return false;
  if (!link.digest) return false;
  if (link.kind === "email" || link.kind === "line_subject") {
    return /^[0-9a-f]{64}$/.test(link.digest);
  }
  // An opaque canonical id. Refused if it looks like an address or carries whitespace — the shapes
  // a careless caller reaches for when the digest is not immediately to hand.
  return link.digest.length <= 200 && !link.digest.includes("@") && !/\s/.test(link.digest);
}

/**
 * Every lookup key a frozen manifest names, from whichever fields it carries.
 *
 * ONE derivation, shared by the erasure and by the verification. The defect that left an orphaned
 * LINE lookup was not that those two disagreed — it was that they agreed perfectly, on a manifest
 * that had left the key out. A single function means a future change cannot repair one and forget
 * the other.
 *
 * The two singular fields are folded in so a manifest frozen before `identityLookupKeys` existed is
 * erased and verified exactly as it was; a resumed deletion must not change meaning underneath a
 * manifest that was frozen by an earlier deployment.
 *
 * Pure, and here rather than in the server-only deletion module, so the permanent tests exercise
 * this function itself instead of a paraphrase of it.
 */
export function identityLookupKeysFromManifest(manifest: {
  emailLookupKey?: string | null;
  lineLookupKey?: string | null;
  identityLookupKeys?: string[];
}): string[] {
  return [
    ...new Set<string>(
      [
        ...(manifest.identityLookupKeys ?? []),
        manifest.emailLookupKey,
        manifest.lineLookupKey,
      ].filter((key): key is string => Boolean(key)),
    ),
  ];
}
