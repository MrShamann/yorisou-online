-- ═════════════════════════════════════════════════════════════════════════════
-- POR-1 — a same-owner identity-link race is a NO-OP, not a crash.
--
-- FORWARD-ONLY. `202607310004` is already applied to Preview and is not amended: an applied
-- migration is immutable, and a `create or replace function` in a later file is how this project
-- changes behaviour without rewriting history.
--
-- WHAT WENT WRONG, AND HOW IT WAS FOUND.
--
-- Found by RUNNING the hosted concurrency train, not by inspection. The second deletion executor
-- answered **500**, and the runtime log said `assessment_persistence_failed:400` — the signature of
-- a raise whose code is not in the bounded allowlist.
--
-- The raise was `23505`, the partial unique index, and the writer that hit it was not an attacker:
--
--     every account write calls `yorisou_identity_links_sync`
--       -> a person with several requests in flight has two syncs for ONE account in flight
--       -> both run the `exists` pre-check and both see nothing, because the other's insert is
--          uncommitted and therefore invisible to it
--       -> both insert the same (kind, digest)
--       -> the loser dies on the unique index with a raw Postgres error
--
-- The pre-check cannot fix this by itself. `select ... for update` locks a row that does not exist
-- yet, so there is nothing to serialize on until one of the inserts creates the index entry. The
-- index IS the serialization point; the code simply was not listening to it.
--
-- WHY THE FIX IS NOT `on conflict do nothing`.
--
-- Because the two outcomes it would merge are not the same fact. If the row that won belongs to THIS
-- account, the caller got what it asked for and the correct answer is silence. If it belongs to a
-- DIFFERENT account, that is the identity conflict this table exists to make impossible, and
-- swallowing it would be the fail-open version of the whole design.
--
-- So the violation is caught and then INTERPRETED, under the lock the winner now holds.
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
      -- The index serialized us. Ask WHO won before deciding what that means.
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
    'added', v_added, 'retired', v_retired, 'unchanged', v_unchanged,
    'active', (select count(*) from public.yorisou_canonical_identity_links
                where owner_account_id = p_owner_account_id and link_state = 'active')
  );
end $$;

do $$
begin
  if not exists (
    select 1 from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.proname = 'yorisou_identity_links_sync'
  ) then
    raise exception 'POR-1: yorisou_identity_links_sync is missing after the same-owner-race repair';
  end if;

  -- The index this repair listens to must still exist. If a future change drops it, the
  -- `unique_violation` branch becomes unreachable and two accounts can own one identity again —
  -- silently, because nothing would raise.
  if not exists (
    select 1 from pg_indexes
     where schemaname = 'public' and indexname = 'yorisou_identity_link_active_unique'
  ) then
    raise exception 'POR-1: the active identity-link uniqueness index is missing';
  end if;
end $$;
