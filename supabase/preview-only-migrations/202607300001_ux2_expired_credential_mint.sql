-- UX-2 / CPC-1 — PREVIEW_ONLY. Allow the service-role attempt-start RPC to mint an
-- ALREADY-EXPIRED attempt (ttl 0).
--
-- The original clamp `greatest(1, p_ttl_hours)` silently promoted ttl 0 to one hour, which made
-- a genuinely expired credential unmintable: the expired-credential acceptance property could
-- only ever run against a still-valid attempt and therefore proved nothing. TTL 0 now means
-- "expired at creation" for the service-role caller.
--
-- No public boundary changes: the RPC remains service-role-only SECURITY DEFINER, the
-- application never passes a TTL (the 72h default is unchanged), and negative values clamp to 0.
create or replace function public.yorisou_attempt_start(
  p_method_id       text,
  p_method_version  text,
  p_required_count  integer,
  p_claim_token_hash text,
  p_entry_source    text default null,
  p_ttl_hours       integer default 72
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if p_claim_token_hash is null or length(p_claim_token_hash) < 32 then
    raise exception 'attempt_claim_token_required';
  end if;
  insert into public.yorisou_assessment_attempts
    (method_id, method_version, required_count, claim_token_hash, entry_source, expires_at)
  values
    (p_method_id, p_method_version, p_required_count, p_claim_token_hash, p_entry_source,
     now() + make_interval(hours => greatest(0, coalesce(p_ttl_hours, 72))))
  returning id into v_id;
  return v_id;
end;
$$;
