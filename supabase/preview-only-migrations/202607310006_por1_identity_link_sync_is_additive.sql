-- ═════════════════════════════════════════════════════════════════════════════
-- POR-1 — the identity-link sync is ADDITIVE. A mirror read may not retire a link.
--
-- FORWARD-ONLY. `202607310004` and `202607310005` are applied and are not amended.
--
-- THE DEFECT THIS FIXES WAS INTRODUCED BY 202607310004 ITSELF, and it is the same mistake the
-- registry exists to correct, made one layer up.
--
-- `yorisou_identity_links_sync` took "the COMPLETE set of links this account should hold" and
-- retired anything absent from it. That contract is only safe if the caller genuinely knows the
-- whole truth. It does not:
--
--     putSharedAccountRecord(account)                 <- `account` came from an OBJECT READ
--       -> identityLinksForAccount(account)           <- derives the set from that read
--       -> sync(..., links)                           <- retires whatever the read did not show
--
-- and that read is the one measured, on this transport, returning the OLD version of an object for
-- more than 25 seconds with `cf-cache-status: HIT`. So a stale account record — one written before a
-- LINE binding — produced a link set with no LINE subject, and the sync dutifully ERASED the
-- strongly consistent record of a binding that had really happened.
--
-- Observed, not theorised. Hosted run 09:40 froze a manifest with `canonicalIdentityLinkCount = 1`
-- and one union key, for an account that had been LINE-bound; the run twenty minutes earlier froze
-- `2` and two union keys and named the LINE lookup correctly. The difference was which copy of the
-- account object the writer happened to read.
--
-- The whole design rests on ONE rule — a stale read may only ever WIDEN, never narrow. The manifest
-- obeyed it. The writer did not, and a writer that can narrow the authority is worse than no
-- authority at all, because everything downstream now trusts it.
--
-- SO: sync ADDS and never retires. A retirement is a deliberate act with its own entry point, called
-- from the one place that can actually observe an unbind — the account writer comparing the PREVIOUS
-- record's LINE subject with the new one, which is a comparison of two known values rather than an
-- inference from an absence.
-- ═════════════════════════════════════════════════════════════════════════════

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

  -- NO RETIREMENT HERE. Deliberately. See the header: the caller's link set comes from a read that
  -- can be stale, and retiring on absence lets that stale read destroy a true record.
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
    begin
      insert into public.yorisou_canonical_identity_links
        (owner_account_id, owner_fingerprint, link_kind, link_digest)
      values (p_owner_account_id, p_owner_fingerprint, v_kind, v_digest);
      v_added := v_added + 1;
    exception when unique_violation then
      select owner_account_id into v_other
        from public.yorisou_canonical_identity_links
       where link_kind = v_kind and link_digest = v_digest and link_state = 'active';
      if v_other is distinct from p_owner_account_id then
        raise exception 'identity_link_conflict:%', v_kind;
      end if;
      v_unchanged := v_unchanged + 1;
    end;
  end loop;

  return jsonb_build_object(
    'added', v_added, 'retired', 0, 'unchanged', v_unchanged,
    'active', (select count(*) from public.yorisou_canonical_identity_links
                where owner_account_id = p_owner_account_id and link_state = 'active')
  );
end $$;

-- ─────────────────────────────────────────────────────────────────────────────
-- RETIRE — the deliberate act, naming exactly what is being given up.
--
-- Called only where an unbind is genuinely OBSERVED: the account writer comparing the previous
-- record's LINE subject against the new one. That is a comparison of two known values, not an
-- inference from an absence, so a stale read cannot trigger it by accident — a stale previous record
-- simply names a subject that is no longer active, and retiring an already-retired link is a no-op.
--
-- Scoped to the owner. Retiring a link the caller does not own would be a way to cut someone else
-- off from their own login, so it is refused rather than silently ignored.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.yorisou_identity_links_retire(
  p_owner_account_id text,
  p_link_kind        text,
  p_link_digest      text
) returns integer language plpgsql security definer set search_path = public as $$
declare
  v_owner   text;
  v_retired integer := 0;
begin
  if p_owner_account_id is null or char_length(p_owner_account_id) = 0 then
    raise exception 'identity_link_owner_required';
  end if;
  if p_link_kind is null or p_link_digest is null then
    raise exception 'identity_link_entry_requires_kind_and_digest';
  end if;

  select owner_account_id into v_owner
    from public.yorisou_canonical_identity_links
   where link_kind = p_link_kind and link_digest = p_link_digest and link_state = 'active'
   for update;

  if v_owner is null then return 0; end if;          -- already retired, or never held
  if v_owner <> p_owner_account_id then
    raise exception 'identity_link_conflict:%', p_link_kind;
  end if;

  update public.yorisou_canonical_identity_links
     set link_state = 'erased', owner_account_id = null, link_digest = null,
         erased_at = now(), updated_at = now()
   where link_kind = p_link_kind and link_digest = p_link_digest
     and link_state = 'active' and owner_account_id = p_owner_account_id;
  get diagnostics v_retired = row_count;
  return v_retired;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = 'yorisou_identity_links_retire'
  ) then
    raise exception 'POR-1: yorisou_identity_links_retire is missing';
  end if;

  -- The whole point of this migration: sync must no longer contain a retirement. Asserted against
  -- the live definition, because a later `create or replace` that reinstated it would silently
  -- return the registry to being destroyable by a cached read.
  if position('link_state = ''erased''' in pg_get_functiondef(
       (select p.oid from pg_proc p join pg_namespace n on n.oid = p.pronamespace
         where n.nspname = 'public' and p.proname = 'yorisou_identity_links_sync' limit 1))) > 0 then
    raise exception 'POR-1: yorisou_identity_links_sync still retires links — a stale read can erase a true one';
  end if;
end $$;
