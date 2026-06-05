do $$
declare
  constraint_record record;
  index_record record;
begin
  for constraint_record in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'league_matchups'
      and con.contype = 'u'
      and (
        select array_agg(attr.attname::text order by key.ordinal)
        from unnest(con.conkey) with ordinality as key(attnum, ordinal)
        join pg_attribute attr
          on attr.attrelid = rel.oid
         and attr.attnum = key.attnum
      ) = array['champion_a_id', 'champion_b_id']::text[]
  loop
    execute format(
      'alter table public.league_matchups drop constraint if exists %I',
      constraint_record.conname
    );
  end loop;

  for index_record in
    select idx.relname
    from pg_index ind
    join pg_class idx on idx.oid = ind.indexrelid
    join pg_class rel on rel.oid = ind.indrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    left join pg_constraint con on con.conindid = ind.indexrelid
    where nsp.nspname = 'public'
      and rel.relname = 'league_matchups'
      and ind.indisunique
      and not ind.indisprimary
      and con.oid is null
      and pg_get_indexdef(ind.indexrelid) ilike '%(champion_a_id, champion_b_id)%'
      and pg_get_indexdef(ind.indexrelid) not ilike '%role%'
  loop
    execute format('drop index if exists public.%I', index_record.relname);
  end loop;

  if not exists (
    select 1
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'league_matchups'
      and con.contype = 'u'
      and (
        select array_agg(attr.attname::text order by key.ordinal)
        from unnest(con.conkey) with ordinality as key(attnum, ordinal)
        join pg_attribute attr
          on attr.attrelid = rel.oid
         and attr.attnum = key.attnum
      ) = array['champion_a_id', 'champion_b_id', 'role']::text[]
  ) then
    alter table public.league_matchups
    add constraint league_matchups_unique_champion_role
    unique (champion_a_id, champion_b_id, role);
  end if;
end $$;
