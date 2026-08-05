-- POR-1 M2 — populate every Production account-owner-linked family for one synthetic principal.
--
-- WHY THIS IS INTROSPECTIVE RATHER THAN 26 HAND-WRITTEN INSERTS.
--
-- The claim this fixture has to support is "the deletion plan erases every owner-linked family".
-- Twenty-six bespoke INSERT statements would prove that for the twenty-six families someone
-- remembered on the day they wrote them. The whole point of the checked-in Production family
-- contract is that a NEW owner-linked table must not be able to become invisible — so the fixture
-- reads the same catalogue the contract does, and a family added tomorrow is seeded tomorrow.
--
-- WHAT IT MUST NEVER DO: fabricate consent, fabricate canonical identity, or write anything that a
-- product path would treat as a person's decision. It writes structurally valid rows for erasure
-- accounting, nothing more. Every value is deterministic and reserved.
--
-- HOW A COLUMN GETS ITS VALUE.
--
--   owner column      → the principal being seeded
--   foreign key       → a row already seeded in the parent table, else the row is skipped and
--                       REPORTED (never silently omitted — a silently skipped family reads exactly
--                       like a family that was erased)
--   CHECK-constrained → a literal lifted from the constraint itself, so enum-shaped columns get a
--                       value the table actually permits instead of a guess that fails at 3am
--   otherwise         → a deterministic value by type
--
-- Usage:  psql -v principal=por1a -v ON_ERROR_STOP=1 -f this.sql

\set QUIET on
\if :{?principal}
\else
  \echo 'principal is required: psql -v principal=por1a ...'
  \quit
\endif

create schema if not exists por1_fixture;

-- psql's :'var' interpolation does NOT reach inside a dollar-quoted body — the body is opaque text
-- to psql. So the principal is handed to the block through a session setting instead.
select set_config('por1.principal', :'principal', false);

-- Records what was seeded, so the erasure proof can be per-table rather than aggregate.
create table if not exists por1_fixture.seeded (
  principal      text not null,
  table_name     text not null,
  owner_column   text not null,
  seeded_rows    int  not null,
  skipped_reason text,
  primary key (principal, table_name)
);

do $por1$
declare
  v_principal text := current_setting('por1.principal');
  v_owner_cols text[] := array['owner_account_id', 'actor_account_id', 'reporter_account_id', 'blocker_account_id'];
  r_table record;
  r_col record;
  v_cols text[];
  v_vals text[];
  v_value text;
  v_check text;
  v_literal text;
  v_parent_table text;
  v_parent_col text;
  v_parent_value text;
  v_sql text;
  v_seeded int;
  v_skip text;
  v_pass int;
  v_progress boolean;
  v_done text[] := array[]::text[];
begin
  -- Several passes: a child table can only be seeded once its parent has a row, and the FK graph is
  -- not known ahead of time. Bounded, and what does not settle is reported rather than retried
  -- forever.
  for v_pass in 1..6 loop
    v_progress := false;

    for r_table in
      select c.oid, c.relname
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
       where n.nspname = 'public' and c.relkind = 'r'
         and c.relname like 'yorisou%'
         and not (c.relname = any (v_done))
         -- A table with a DECLARED OVERRIDE is not the generic seeder's to touch. Letting both run
         -- is how Principal B's recommendation action ended up attached to Principal A's item: the
         -- generic pass found a parent row that existed, and had no way to know it belonged to
         -- someone else.
         and not exists (
           select 1 from por1_fixture.override_registry o where o.table_name = c.relname
         )
       -- EVERY yorisou table, not only the owner-linked ones. An owner-linked child with a NOT NULL
       -- foreign key to a table that carries no owner column (yorisou_recommendation_actions ->
       -- yorisou_recommendation_items) can never be seeded if the parent is out of scope — and the
       -- first version of this skipped those two silently, then reported "0 failed".
       order by c.relname
    loop
      v_cols := array[]::text[];
      v_vals := array[]::text[];
      v_skip := null;

      for r_col in
        select a.attname,
               format_type(a.atttypid, a.atttypmod) as coltype,
               a.attnotnull,
               a.attidentity,
               a.attgenerated,
               pg_get_expr(d.adbin, d.adrelid) as coldefault
          from pg_attribute a
          left join pg_attrdef d on d.adrelid = a.attrelid and d.adnum = a.attnum
         where a.attrelid = r_table.oid and a.attnum > 0 and not a.attisdropped
         order by a.attnum
      loop
        -- Identity and generated columns are the database's to fill.
        continue when r_col.attidentity <> '' or r_col.attgenerated <> '';

        v_value := null;

        -- 1. The owner. This is the entire reason the row exists.
        if r_col.attname = any (v_owner_cols) then
          v_value := quote_literal(v_principal);

        else
          -- 2. A foreign key: reuse a row already seeded in the parent.
          select rc.relname, att.attname
            into v_parent_table, v_parent_col
            from pg_constraint con
            join pg_class rc on rc.oid = con.confrelid
            join pg_attribute att on att.attrelid = con.confrelid and att.attnum = con.confkey[1]
           where con.conrelid = r_table.oid and con.contype = 'f'
             and array_length(con.conkey, 1) = 1
             and con.conkey[1] = (select a2.attnum from pg_attribute a2
                                   where a2.attrelid = r_table.oid and a2.attname = r_col.attname)
           limit 1;

          if v_parent_table is not null then
            -- Reset FIRST. Without this the variable keeps the PREVIOUS column's parent key when a
            -- lookup finds nothing, and that stale value is then written into an unrelated foreign
            -- key. It regressed five families before it was spotted.
            v_parent_value := null;
            begin
              -- PREFER A PARENT ROW BELONGING TO THIS PRINCIPAL. Taking `order by 1 limit 1`
              -- unconditionally hands both principals the SAME parent, which collides on any
              -- unique FK column (yorisou_ai_reflections.run_id is unique) and — worse — would
              -- attach one person's child row to another person's parent, quietly making the
              -- erasure accounting wrong in the one direction that matters.
              if exists (
                select 1 from pg_attribute pa
                 where pa.attrelid = ('public.' || quote_ident(v_parent_table))::regclass
                   and pa.attname = any (v_owner_cols) and pa.attnum > 0 and not pa.attisdropped
              ) then
                execute format(
                  'select %I::text from public.%I where %I = %L order by 1 limit 1',
                  v_parent_col, v_parent_table,
                  (select pa.attname from pg_attribute pa
                    where pa.attrelid = ('public.' || quote_ident(v_parent_table))::regclass
                      and pa.attname = any (v_owner_cols) and pa.attnum > 0 and not pa.attisdropped
                    limit 1),
                  v_principal
                ) into v_parent_value;
              end if;
              if v_parent_value is null then
                execute format(
                  'select %I::text from public.%I order by 1 limit 1', v_parent_col, v_parent_table
                ) into v_parent_value;
              end if;
            exception when others then
              v_parent_value := null;
            end;

            if v_parent_value is not null then
              v_value := quote_literal(v_parent_value) || '::' || r_col.coltype;
            elsif r_col.attnotnull then
              v_skip := format('needs a row in %s first', v_parent_table);
              exit;
            else
              v_value := 'null';
            end if;
            v_parent_table := null;
            v_parent_col := null;
          end if;
        end if;

        -- 3. Nothing decided yet, and the column is optional with a default: leave it to the
        --    default, which is what the product would get.
        if v_value is null and not r_col.attnotnull and r_col.coldefault is not null then
          continue;
        end if;

        if v_value is null then
          -- 4. A CHECK constraint naming this column is the only reliable source of a legal value.
          --    Guessing 'active' and hoping is how a fixture fails on the twelfth table.
          --
          --    THE CONSTRAINT'S SHAPE IS CLASSIFIED BEFORE ANYTHING IS LIFTED OUT OF IT. The first
          --    version of this took the first quoted literal from every constraint, which is right
          --    for `status in ('active','completed')` and badly wrong for a REGEX check — in
          --    `input_hash ~ '^[a-f0-9]{64}$'` the first quoted literal IS THE PATTERN. Four
          --    families failed to seed on exactly that.
          select pg_get_constraintdef(con.oid) into v_check
            from pg_constraint con
           where con.conrelid = r_table.oid and con.contype = 'c'
             and pg_get_constraintdef(con.oid) ~ ('\m' || r_col.attname || '\M')
           -- No "must contain a quote" filter. Requiring one found every enum check and silently
           -- skipped every NUMERIC RANGE check, because `CHECK ((estimated_cost_cents <= 100))`
           -- contains no literal at all — so the bound was never read and the generated value
           -- overshot it.
           order by length(pg_get_constraintdef(con.oid))
           limit 1;

          v_literal := null;
          if v_check is not null then
            if v_check like '%~%' then
              -- A REGEX check. Synthesize a value the pattern accepts.
              if v_check ~ '\[a-f0-9\]|\[0-9a-f\]' then
                -- A hex digest of the demanded length.
                v_literal := left(encode(digest(v_principal || r_col.attname, 'sha256'), 'hex'),
                                  coalesce(((regexp_match(v_check, '\{([0-9]+)\}'))[1])::int, 64));
              elsif v_check ~ '\^/' then
                -- `^/(saved|private-state)(/|$)` — the first alternative, which is a path the
                -- application itself would produce.
                v_literal := '/' || coalesce((regexp_match(v_check, '\^/\(([a-z-]+)'))[1],
                                             (regexp_match(v_check, '\^/([a-z-]+)'))[1],
                                             'saved');
              end if;
            else
              -- An equality / IN / ANY check: the first quoted literal is a permitted value.
              v_literal := (regexp_match(v_check, '''([^'']+)'''))[1];
            end if;
          end if;

          v_value := case
            when r_col.coltype in ('text', 'character varying') and v_literal is not null
              then quote_literal(v_literal)
            when r_col.coltype in ('text', 'character varying')
              then quote_literal('por1-fixture-' || r_col.attname)
            when r_col.coltype = 'uuid' then 'gen_random_uuid()'
            when r_col.coltype like 'timestamp%' then 'now()'
            when r_col.coltype = 'date' then 'current_date'
            -- Derived from the principal, not a constant. Two principals seeding the same table
            -- with the same integer collide on any unique (parent, ordinal) constraint — which is
            -- what yorisou_experience_revisions(experience_id, revision_number) does.
            --
            -- Clamped to any `between X and Y` the constraint declares: `estimated_cost_cents
            -- between 0 and 100` rejected the unclamped value, and inventing a wider range than
            -- the schema allows is not a fixture problem to solve by widening the schema.
            when r_col.coltype in ('integer', 'bigint', 'smallint')
              then (
                case
                  -- pg_get_constraintdef renders BETWEEN as `>= lo AND <= hi`, so the upper bound
                  -- is read from the rendered form rather than from the source text.
                  when v_check is not null and v_check ~ '<= [0-9]+' then
                    (abs(hashtext(v_principal || r_col.attname))
                      % greatest(((regexp_match(v_check, '<= ([0-9]+)'))[1])::int, 1))
                  else abs(hashtext(v_principal || r_col.attname)) % 1000 + 1
                end
              )::text
            when r_col.coltype in ('numeric', 'double precision', 'real') then '1'
            when r_col.coltype = 'boolean' then 'false'
            when r_col.coltype = 'jsonb' then '''{}''::jsonb'
            when r_col.coltype = 'json' then '''{}''::json'
            when r_col.coltype = 'text[]' then 'array[]::text[]'
            else null
          end;

          -- An unfillable NOT NULL column is reported. A fixture that quietly skips a family is
          -- indistinguishable, later, from a family that was correctly erased.
          if v_value is null then
            if r_col.attnotnull and r_col.coldefault is null then
              v_skip := format('unsupported NOT NULL column %s %s', r_col.attname, r_col.coltype);
              exit;
            end if;
            continue;
          end if;
        end if;

        v_cols := v_cols || quote_ident(r_col.attname);
        v_vals := v_vals || v_value;
      end loop;

      if v_skip is not null then
        -- Remembered, so a table that never settles is REPORTED at the end rather than vanishing.
        -- A silently skipped family and a correctly erased family look identical afterwards.
        insert into por1_fixture.seeded (principal, table_name, owner_column, seeded_rows, skipped_reason)
        select v_principal, r_table.relname,
               coalesce((select a.attname from pg_attribute a
                 where a.attrelid = r_table.oid and a.attname = any (v_owner_cols) limit 1), ''),
               0, v_skip
        on conflict (principal, table_name) do update set skipped_reason = excluded.skipped_reason
         where por1_fixture.seeded.seeded_rows = 0;
        continue; -- try again on a later pass, once the parent exists
      end if;

      v_sql := format('insert into public.%I (%s) values (%s)',
                      r_table.relname, array_to_string(v_cols, ', '), array_to_string(v_vals, ', '));
      begin
        execute v_sql;
        v_seeded := 1;
        v_done := v_done || r_table.relname;
        v_progress := true;
        -- Coverage is recorded only for OWNER-LINKED tables; the others are seeded purely so their
        -- children can exist, and counting them would inflate the coverage claim.
        continue when not exists (select 1 from pg_attribute a
                                   where a.attrelid = r_table.oid and a.attname = any (v_owner_cols)
                                     and a.attnum > 0 and not a.attisdropped);
        insert into por1_fixture.seeded (principal, table_name, owner_column, seeded_rows)
        select v_principal, r_table.relname,
               (select a.attname from pg_attribute a
                 where a.attrelid = r_table.oid and a.attname = any (v_owner_cols) limit 1),
               v_seeded
        on conflict (principal, table_name) do update set seeded_rows = excluded.seeded_rows,
                                                          skipped_reason = null;
      exception when others then
        -- Recorded for EVERY table, owner-linked or not. Suppressing the non-owner-linked ones hid
        -- the actual blocker one level down: two owner-linked families could not be seeded because
        -- yorisou_recommendation_items had no row, and the reason IT had no row was not reported.
        insert into por1_fixture.seeded (principal, table_name, owner_column, seeded_rows, skipped_reason)
        select v_principal, r_table.relname,
               coalesce((select a.attname from pg_attribute a
                 where a.attrelid = r_table.oid and a.attname = any (v_owner_cols) limit 1), ''),
               0, left(sqlerrm, 200)
        on conflict (principal, table_name) do update set skipped_reason = excluded.skipped_reason;
      end;
    end loop;

    exit when not v_progress;
  end loop;
end
$por1$;

\set QUIET off
