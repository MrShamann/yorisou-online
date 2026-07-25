-- CPV1 local Supabase verification (RLS · append-only · isolation · anon-deny).
do $$
begin
  if to_regclass('public.yorisou_cpv1_observations') is null then raise notice 'FAIL: schema missing'; else raise notice 'PASS: cpv1 schema present'; end if;
end $$;
-- append-only history: UPDATE/DELETE blocked
do $$
begin
  insert into public.yorisou_cpv1_history_events (account_id, event_type, method_id, method_version, safe_detail)
    values ('cpv1_verif', 'method_completed', 'imairo-120q', 'v0.1', 'seed');
  begin update public.yorisou_cpv1_history_events set safe_detail='x' where account_id='cpv1_verif'; raise notice 'FAIL: history UPDATE allowed';
  exception when others then raise notice 'PASS: history UPDATE blocked (%)', sqlerrm; end;
  begin delete from public.yorisou_cpv1_history_events where account_id='cpv1_verif'; raise notice 'FAIL: history DELETE allowed';
  exception when others then raise notice 'PASS: history DELETE blocked (%)', sqlerrm; end;
end $$;
-- anon denied
do $$
declare leaked boolean := false;
begin
  set local role anon;
  begin perform 1 from public.yorisou_cpv1_observations limit 1; leaked := true; exception when others then null; end;
  begin perform 1 from public.yorisou_cpv1_history_events limit 1; leaked := true; exception when others then null; end;
  reset role;
  if leaked then raise notice 'FAIL: anon reached cpv1 tables'; else raise notice 'PASS: anon denied on cpv1 tables'; end if;
end $$;
-- user isolation on observations
do $$
declare own int; other int;
begin
  insert into public.yorisou_cpv1_observations (account_id, source_class, method_id, derived, evidence_class)
    values ('cpv1_userA','yorisou_original_result','imairo-120q','theme-a','method_derived'),
           ('cpv1_userB','symbolic_reflection',null,'theme-b','user_declared') on conflict do nothing;
  set local role authenticated;
  perform set_config('request.jwt.claims','{"sub":"cpv1_userA","app_account_id":"cpv1_userA"}', true);
  select count(*) into own from public.yorisou_cpv1_observations where account_id='cpv1_userA';
  select count(*) into other from public.yorisou_cpv1_observations where account_id='cpv1_userB';
  perform set_config('request.jwt.claims','', true); reset role;
  if own>=1 and other=0 then raise notice 'PASS: cpv1 user isolation (own=% other=%)', own, other;
  else raise notice 'FAIL: cpv1 isolation leaked (own=% other=%)', own, other; end if;
end $$;
-- no universal score: observations table has no score/overall column
do $$
declare n int;
begin
  select count(*) into n from information_schema.columns where table_name='yorisou_cpv1_observations' and (column_name like '%score%' or column_name like '%overall%');
  if n=0 then raise notice 'PASS: no universal-score column'; else raise notice 'FAIL: score column present'; end if;
end $$;
