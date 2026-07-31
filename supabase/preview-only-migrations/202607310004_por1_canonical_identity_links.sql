-- ═════════════════════════════════════════════════════════════════════════════
-- POR-1 — CANONICAL IDENTITY LINKS.
--
-- WHY THIS EXISTS.
--
-- `buildDeletionManifest` opens with ONE read:
--
--     const account = await findAccountById(accountId);            ← accountIdentityDeletion.ts:145
--
-- and then derives the entire destructive identity scope from that single object — the LINE lookup
-- key, the LINE event ids, the subject fingerprints, the email lookup key. A stale copy therefore
-- NARROWS the manifest, and what the manifest never names is never erased and never missed.
--
-- That is not a hypothetical. On 2026-07-31 a LINE binding completed at 06:01:25, the deletion was
-- requested at 06:01:27.952 — two seconds LATER, so there was no race and nothing for the mutation
-- fence to refuse — and the manifest froze at 06:01:39.958 with no LINE scope at all. The lookup
-- object `accounts/by-line-user/<sha256>` survived the erasure: a live LINE login route to an erased
-- account. Measured over 20 controlled overwrite rounds, the store itself was durable and consistent
-- every time (its own listing reported the new object immediately, and a cache-busted read returned
-- it in ~1s) while the runtime's read URL kept returning the OLD version for more than 25 seconds,
-- served with `cf-cache-status: HIT`.
--
-- So the object store is a MIRROR whose read path is not a reliable statement about what is true
-- right now. An identity relationship — "this account owns this email", "this account owns this LINE
-- subject" — must not be discovered from it at the one moment when getting it wrong is irreversible.
--
-- WHAT THIS IS.
--
-- The strongly consistent, row-addressable record of which account owns which identity, in the
-- database, written inside the same governed mutation that binds or creates the identity. It is the
-- SERIALIZATION POINT: a LINE binding is not complete until the link is committed here, and a
-- deletion derives its destructive scope from here rather than from a mirror.
--
-- WHAT IT DELIBERATELY IS NOT.
--
--   • Not a cache of the account object. It holds no name, no password, no profile, no session.
--   • Not a second source of truth for the object keys. It stores the DIGESTS the keys are built
--     from, so the key is derived the same way by every reader and there is no second derivation to
--     drift.
--   • Not an authorization to write. Identity writes still run under the account mutation fence and
--     the mutation lease; this records WHAT is owned, the fence decides WHETHER a write may happen.
--
-- WHAT IT STORES, AND WHAT IT REFUSES TO STORE.
--
-- Digests, canonical ids and timestamps. No raw email address and no raw LINE user id — both object
-- key families are already addressed by `sha256(value)`, so the digest is sufficient to derive the
-- key and the raw value is never needed to erase. A CHECK constraint refuses any digest containing
-- `@` or whitespace, so a future caller cannot quietly start writing addresses into this table.
--
-- THE INVARIANT THE OBJECT STORE COULD NEVER ENFORCE.
--
-- A partial unique index makes "at most one ACTIVE account owns a given identity" a property of the
-- database rather than a property of whichever writer read last. Two accounts claiming one LINE
-- subject is now impossible, not merely unlikely.
-- ═════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. The registry.
--
--    A surrogate key, not (owner, kind, digest). Erasure must leave a CONTENT-FREE tombstone, and a
--    tombstone cannot be keyed by the content it exists to have removed.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.yorisou_canonical_identity_links (
  link_id           uuid primary key default gen_random_uuid(),

  -- Null once erased. The account id is an identifier of a person who asked to be forgotten.
  owner_account_id  text,

  -- sha256(owner_account_id). Survives erasure so a deletion can still prove "zero active links for
  -- this owner" and an operator can still audit, without holding the identifier itself.
  owner_fingerprint text not null,

  link_kind         text not null,

  -- The digest the object key is built from (email / LINE subject), or the canonical id for a
  -- foundation record. Null once erased.
  link_digest       text,

  link_state        text not null default 'active',
  contract_version  text not null default 'por1-v1',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  erased_at         timestamptz
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'yorisou_identity_link_kind_check') then
    alter table public.yorisou_canonical_identity_links
      add constraint yorisou_identity_link_kind_check
      check (link_kind in ('email','line_subject','user_profile','auth_identity','provisioning'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'yorisou_identity_link_state_check') then
    alter table public.yorisou_canonical_identity_links
      add constraint yorisou_identity_link_state_check
      check (link_state in ('active','erased'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'yorisou_identity_link_owner_digest_check') then
    alter table public.yorisou_canonical_identity_links
      add constraint yorisou_identity_link_owner_digest_check
      check (owner_fingerprint ~ '^[0-9a-f]{64}$');
  end if;

  -- An ACTIVE row names its owner and its identity. Both, or it is not a link.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_identity_link_active_shape_check') then
    alter table public.yorisou_canonical_identity_links
      add constraint yorisou_identity_link_active_shape_check
      check (link_state <> 'active' or (owner_account_id is not null and link_digest is not null));
  end if;

  -- An ERASED row is CONTENT-FREE. Enforced here rather than trusted to the erase function, because
  -- a tombstone that still carries the digest is not a tombstone — it is the same record with a flag
  -- on it, and the flag is one careless `where` clause away from being ignored.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_identity_link_erased_shape_check') then
    alter table public.yorisou_canonical_identity_links
      add constraint yorisou_identity_link_erased_shape_check
      check (
        link_state <> 'erased'
        or (owner_account_id is null and link_digest is null and erased_at is not null)
      );
  end if;

  -- The hashed families are addressed by sha256 in the object key, so anything else is a caller
  -- writing the raw value into a column that must never hold one.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_identity_link_hashed_kind_check') then
    alter table public.yorisou_canonical_identity_links
      add constraint yorisou_identity_link_hashed_kind_check
      check (
        link_digest is null
        or link_kind not in ('email','line_subject')
        or link_digest ~ '^[0-9a-f]{64}$'
      );
  end if;

  -- The canonical-id families are opaque ids, bounded, and may not look like an address. This is the
  -- constraint that stops "we only had the email handy" from becoming a PII leak in six months.
  if not exists (select 1 from pg_constraint where conname = 'yorisou_identity_link_opaque_kind_check') then
    alter table public.yorisou_canonical_identity_links
      add constraint yorisou_identity_link_opaque_kind_check
      check (
        link_digest is null
        or link_kind in ('email','line_subject')
        or (char_length(link_digest) between 1 and 200
            and link_digest !~ '@'
            and link_digest !~ '\s')
      );
  end if;
end $$;

-- THE INVARIANT. One active owner per identity, enforced by the database.
--
-- Partial, so erased tombstones never collide with each other or block a later re-registration of
-- the same address by a different person.
create unique index if not exists yorisou_identity_link_active_unique
  on public.yorisou_canonical_identity_links (link_kind, link_digest)
  where link_state = 'active';

create index if not exists yorisou_identity_link_owner_idx
  on public.yorisou_canonical_identity_links (owner_account_id)
  where link_state = 'active';

create index if not exists yorisou_identity_link_fingerprint_idx
  on public.yorisou_canonical_identity_links (owner_fingerprint);

alter table public.yorisou_canonical_identity_links enable row level security;
alter table public.yorisou_canonical_identity_links force row level security;

do $$
begin
  revoke all on table public.yorisou_canonical_identity_links from public;
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table public.yorisou_canonical_identity_links from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table public.yorisou_canonical_identity_links from authenticated';
  end if;
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant select on table public.yorisou_canonical_identity_links to service_role';
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. SYNC — the serialization point.
--
--    `p_links` is the COMPLETE set of identity links the account should hold after this mutation,
--    not a delta. That is deliberate and it is the contract: the caller that writes the account
--    record already knows the account's email and LINE subject, so it can state the whole truth, and
--    a delta API would make "unbind LINE" a second call somebody eventually forgets to make.
--
--    Absent links are RETIRED, not deleted, so an unbind leaves a content-free tombstone rather than
--    a silent gap.
--
--    A digest actively owned by a DIFFERENT account raises. It does not steal and it does not
--    silently skip: two accounts resolving one LINE subject is the condition that makes a login route
--    ambiguous, and an ambiguous login route is exactly the harm this table exists to prevent.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_identity_links_sync(
  p_owner_account_id  text,
  p_owner_fingerprint text,
  p_links             jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_link       jsonb;
  v_kind       text;
  v_digest     text;
  v_other      text;
  v_added      integer := 0;
  v_retired    integer := 0;
  v_unchanged  integer := 0;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'identity_link_owner_required';
  end if;
  if p_owner_fingerprint is null or p_owner_fingerprint !~ '^[0-9a-f]{64}$' then
    raise exception 'identity_link_owner_fingerprint_must_be_sha256_hex';
  end if;
  if p_links is null or jsonb_typeof(p_links) <> 'array' then
    raise exception 'identity_link_set_must_be_array';
  end if;

  -- Lock this owner's rows FIRST. Every conflict decision below is made under it, so two concurrent
  -- mutations of the same account serialize here rather than both reading "no conflict" and both
  -- inserting.
  perform 1 from public.yorisou_canonical_identity_links
   where owner_account_id = p_owner_account_id and link_state = 'active'
   for update;

  -- Validate the whole set BEFORE writing any of it. A partially applied identity set is a state no
  -- reader has a name for.
  for v_link in select * from jsonb_array_elements(p_links) loop
    v_kind   := v_link->>'kind';
    v_digest := v_link->>'digest';
    if v_kind is null or v_digest is null then
      raise exception 'identity_link_entry_requires_kind_and_digest';
    end if;
    if v_kind not in ('email','line_subject','user_profile','auth_identity','provisioning') then
      raise exception 'identity_link_kind_unknown:%', v_kind;
    end if;
    if v_kind in ('email','line_subject') and v_digest !~ '^[0-9a-f]{64}$' then
      raise exception 'identity_link_digest_must_be_sha256_hex:%', v_kind;
    end if;

    select owner_account_id into v_other
      from public.yorisou_canonical_identity_links
     where link_kind = v_kind and link_digest = v_digest and link_state = 'active'
     for update;
    if v_other is not null and v_other <> p_owner_account_id then
      raise exception 'identity_link_conflict:%', v_kind;
    end if;
  end loop;

  -- Retire what this owner holds and the incoming set does not name.
  update public.yorisou_canonical_identity_links
     set link_state = 'erased', owner_account_id = null, link_digest = null,
         erased_at = now(), updated_at = now()
   where owner_account_id = p_owner_account_id
     and link_state = 'active'
     and not exists (
       select 1 from jsonb_array_elements(p_links) e
        where e->>'kind' = link_kind and e->>'digest' = link_digest
     );
  get diagnostics v_retired = row_count;

  -- Add what is new. `on conflict do nothing` against the partial unique index makes a repeated sync
  -- of an unchanged identity set a no-op rather than an error — this runs on EVERY account write.
  for v_link in select * from jsonb_array_elements(p_links) loop
    v_kind   := v_link->>'kind';
    v_digest := v_link->>'digest';
    if exists (
      select 1 from public.yorisou_canonical_identity_links
       where link_kind = v_kind and link_digest = v_digest
         and link_state = 'active' and owner_account_id = p_owner_account_id
    ) then
      v_unchanged := v_unchanged + 1;
      continue;
    end if;
    insert into public.yorisou_canonical_identity_links
      (owner_account_id, owner_fingerprint, link_kind, link_digest)
    values (p_owner_account_id, p_owner_fingerprint, v_kind, v_digest);
    v_added := v_added + 1;
  end loop;

  return jsonb_build_object(
    'added', v_added, 'retired', v_retired, 'unchanged', v_unchanged,
    'active', (select count(*) from public.yorisou_canonical_identity_links
                where owner_account_id = p_owner_account_id and link_state = 'active')
  );
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. READ — what the manifest builder asks instead of asking a mirror.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_identity_links_for_owner(
  p_owner_account_id text
) returns table (link_kind text, link_digest text)
language sql stable security definer set search_path = public as $$
  select link_kind, link_digest
    from public.yorisou_canonical_identity_links
   where owner_account_id = p_owner_account_id and link_state = 'active'
   order by link_kind, link_digest;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. RESOLVE — who actively owns this identity?
--
--    The question a login asks. Verification asks it too, to prove that a deleted person's LINE
--    subject resolves to nobody — a check that does NOT depend on the manifest having named it.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_identity_link_owner(
  p_link_kind   text,
  p_link_digest text
) returns text language sql stable security definer set search_path = public as $$
  select owner_account_id
    from public.yorisou_canonical_identity_links
   where link_kind = p_link_kind and link_digest = p_link_digest and link_state = 'active'
   limit 1;
$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ERASE — content-free, and terminal.
--
--    Takes the owner's rows under a lock and leaves tombstones the CHECK constraint proves are
--    empty. Returns the count erased so a deletion can record what it did rather than assume.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_identity_links_erase(
  p_owner_account_id text
) returns integer language plpgsql security definer set search_path = public as $$
declare
  v_erased integer := 0;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'identity_link_owner_required';
  end if;

  perform 1 from public.yorisou_canonical_identity_links
   where owner_account_id = p_owner_account_id for update;

  update public.yorisou_canonical_identity_links
     set link_state = 'erased', owner_account_id = null, link_digest = null,
         erased_at = coalesce(erased_at, now()), updated_at = now()
   where owner_account_id = p_owner_account_id and link_state = 'active';
  get diagnostics v_erased = row_count;

  return v_erased;
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. RESIDUE — the independent check.
--
--    Counted from the same rows the erase wrote, addressed by the owner FINGERPRINT, which survives
--    erasure precisely so this question can still be asked after the identifier is gone. It does not
--    consult the manifest, which is the entire point: a manifest omission must not be able to make a
--    family invisible to verification.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_identity_links_residue(
  p_owner_fingerprint text
) returns integer language sql stable security definer set search_path = public as $$
  select count(*)::integer
    from public.yorisou_canonical_identity_links
   where owner_fingerprint = p_owner_fingerprint and link_state = 'active';
$$;

do $$
declare
  v_missing text;
begin
  select string_agg(want, ', ') into v_missing
    from unnest(array[
      'yorisou_identity_links_sync',
      'yorisou_identity_links_for_owner',
      'yorisou_identity_link_owner',
      'yorisou_identity_links_erase',
      'yorisou_identity_links_residue'
    ]) want
   where not exists (
     select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
      where n.nspname = 'public' and p.proname = want
   );
  if v_missing is not null then
    raise exception 'POR-1: canonical identity-link functions missing: %', v_missing;
  end if;

  if not exists (
    select 1 from pg_class c join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public' and c.relname = 'yorisou_canonical_identity_links'
       and c.relrowsecurity and c.relforcerowsecurity
  ) then
    raise exception 'POR-1: RLS is not enabled AND forced on yorisou_canonical_identity_links';
  end if;

  -- The invariant this table exists for. Asserted, not assumed: without the partial unique index the
  -- whole design degrades to "the last writer wins", which is what the object store already did.
  if not exists (
    select 1 from pg_indexes
     where schemaname = 'public' and indexname = 'yorisou_identity_link_active_unique'
  ) then
    raise exception 'POR-1: the active identity-link uniqueness index is missing';
  end if;
end $$;
