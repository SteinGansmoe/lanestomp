-- A08: run as the owner-approved metadata inspector in the intended project.
-- READ ONLY: no feedback contents, auth records, credentials or RPC execution.
-- An admin is an application identity under authenticated, not a SQL admin role.
-- Same database grants; admin SELECT/UPDATE authorization is established by RLS.
begin transaction read only;

select current_database() as database_name, current_user as inspection_role,
       current_setting('server_version') as server_version;

-- Stop if migration history is absent/inaccessible; do not infer applied history.
select to_regclass('supabase_migrations.schema_migrations') as migration_history;
with expected(version) as (values
  ('20260602164000'), ('20260613093000'), ('20260613103000'),
  ('20261030193000'), ('20261030193100'), ('20261031193000')
)
select e.version, h.version is not null as applied
from expected e left join supabase_migrations.schema_migrations h using (version)
order by e.version;

select rolname, rolsuper, rolinherit, rolbypassrls, rolcanlogin
from pg_catalog.pg_roles
where rolname in ('anon', 'authenticated', 'service_role', 'postgres', current_user);

with recursive memberships(root, member, granted_role) as (
  select r.rolname, m.member, m.roleid
  from pg_catalog.pg_roles r join pg_catalog.pg_auth_members m on m.member=r.oid
  where r.rolname in ('anon', 'authenticated', 'service_role', 'postgres')
  union
  select m.root, a.member, a.roleid
  from memberships m join pg_catalog.pg_auth_members a on a.member=m.granted_role
)
select root, pg_catalog.pg_get_userbyid(member) as member,
       pg_catalog.pg_get_userbyid(granted_role) as granted_role
from memberships order by root, member, granted_role;

select c.relname, c.relkind, pg_catalog.pg_get_userbyid(c.relowner) as owner,
       c.relrowsecurity, c.relforcerowsecurity, c.relacl
from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
where n.nspname='public' and c.relname in
  ('matchup_feedback', 'matchup_feedback_counts', 'league_matchups', 'league_champions', 'profiles');

-- has_*_privilege includes inherited/PUBLIC grants, not RLS row visibility.
with identities(label, db_role) as (values
  ('anonymous', 'anon'), ('ordinary authenticated', 'authenticated'),
  ('admin (authenticated; inspect RLS)', 'authenticated'), ('service', 'service_role')
)
select i.label, c.relname, p.privilege,
       has_table_privilege(i.db_role, c.oid, p.privilege) as effective_table_privilege
from identities i cross join pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid=c.relnamespace
cross join (values ('SELECT'), ('INSERT'), ('UPDATE'), ('DELETE'), ('TRUNCATE'), ('REFERENCES'), ('TRIGGER')) p(privilege)
where n.nspname='public' and c.relname in ('matchup_feedback', 'matchup_feedback_counts')
order by i.label, c.relname, p.privilege;

with identities(label, db_role) as (values
  ('anonymous', 'anon'), ('ordinary authenticated', 'authenticated'),
  ('admin (authenticated; inspect RLS)', 'authenticated'), ('service', 'service_role')
)
select i.label, c.relname, a.attname, p.privilege,
       has_column_privilege(i.db_role, c.oid, a.attnum, p.privilege) as effective_column_privilege,
       a.attacl
from identities i cross join pg_catalog.pg_class c
join pg_catalog.pg_namespace n on n.oid=c.relnamespace
join pg_catalog.pg_attribute a on a.attrelid=c.oid and a.attnum>0 and not a.attisdropped
cross join (values ('SELECT'), ('INSERT'), ('UPDATE'), ('REFERENCES')) p(privilege)
where n.nspname='public' and c.relname in ('matchup_feedback', 'matchup_feedback_counts')
order by i.label, c.relname, a.attnum, p.privilege;

-- Explicit PUBLIC/role table grants (column grants are shown above as attacl).
select c.relname, case when acl.grantee=0 then 'PUBLIC'
       else pg_catalog.pg_get_userbyid(acl.grantee) end as grantee,
       acl.privilege_type, acl.is_grantable
from pg_catalog.pg_class c join pg_catalog.pg_namespace n on n.oid=c.relnamespace
cross join lateral aclexplode(coalesce(c.relacl, acldefault('r',c.relowner))) acl
where n.nspname='public' and c.relname in ('matchup_feedback','matchup_feedback_counts');

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_catalog.pg_policies where schemaname='public'
and tablename in ('matchup_feedback','matchup_feedback_counts','league_matchups','profiles');

-- Include overloads, text references and catalog dependencies across user schemas.
-- Dynamic SQL may evade both text and dependency scans; this is an inventory,
-- not proof that no other access path exists. No function bodies are returned.
with routines as (
  select p.*, n.nspname from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid=p.pronamespace
  where n.nspname not in ('pg_catalog','information_schema')
    and n.nspname not like 'pg_toast%' and n.nspname not like 'pg_temp%'
    and (p.proname ilike '%feedback%' or p.prosrc ilike '%matchup_feedback%'
      or (n.nspname='public' and p.proname='is_admin')
      or (n.nspname='auth' and p.proname='uid')
      or exists (select 1 from pg_catalog.pg_depend d
        where d.classid='pg_proc'::regclass and d.objid=p.oid
        and d.refclassid='pg_class'::regclass
        and d.refobjid in ('public.matchup_feedback'::regclass,'public.matchup_feedback_counts'::regclass)))
)
select p.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as arguments,
       pg_get_function_result(p.oid) as result, pg_get_userbyid(p.proowner) as owner,
       p.prosecdef, p.proconfig, p.proacl,
       has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
       has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute,
       has_function_privilege('service_role',p.oid,'EXECUTE') as service_execute,
       has_function_privilege('postgres',p.oid,'EXECUTE') as postgres_execute,
       exists (select 1 from aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a
               where a.grantee=0 and a.privilege_type='EXECUTE') as public_execute
from routines p order by p.nspname,p.proname,arguments;

-- Owner's underlying privileges: do not assume a hosted postgres is superuser.
select r.rolname, c.relname,
       has_table_privilege(r.oid,c.oid,'SELECT') as can_select,
       has_table_privilege(r.oid,c.oid,'INSERT') as can_insert,
       has_table_privilege(r.oid,c.oid,'UPDATE') as can_update,
       has_table_privilege(r.oid,c.oid,'DELETE') as can_delete,
       pg_get_userbyid(c.relowner) as table_owner, c.relforcerowsecurity
from pg_roles r cross join pg_class c join pg_namespace n on n.oid=c.relnamespace
where r.rolname='postgres' and n.nspname='public'
and c.relname in ('matchup_feedback','matchup_feedback_counts','league_matchups','league_champions','profiles');

select r.rolname, n.nspname, has_schema_privilege(r.oid,n.oid,'USAGE') as can_use_schema,
       has_schema_privilege(r.oid,n.oid,'CREATE') as can_create_in_schema
from pg_roles r cross join pg_namespace n
where r.rolname in ('postgres','anon','authenticated','service_role') and n.nspname in ('public','auth');

select r.rolname,
       has_sequence_privilege(r.oid,pg_get_serial_sequence('public.matchup_feedback','id'),'USAGE') as feedback_id_sequence_usage
from pg_roles r where r.rolname in ('postgres','anon','authenticated','service_role');

select c.relname,a.attname,format_type(a.atttypid,a.atttypmod) as data_type,
       a.attnotnull,a.attidentity,pg_get_expr(d.adbin,d.adrelid) as default_expression
from pg_class c join pg_namespace n on n.oid=c.relnamespace
join pg_attribute a on a.attrelid=c.oid and a.attnum>0 and not a.attisdropped
left join pg_attrdef d on d.adrelid=c.oid and d.adnum=a.attnum
where n.nspname='public' and c.relname in
  ('matchup_feedback','matchup_feedback_counts','league_matchups','league_champions')
order by c.relname,a.attnum;

select c.relname, t.tgname, t.tgenabled, t.tgfoid::regprocedure as function,
       pg_get_triggerdef(t.oid) as definition
from pg_trigger t join pg_class c on c.oid=t.tgrelid
where not t.tgisinternal and t.tgrelid in
  ('public.matchup_feedback'::regclass,'public.matchup_feedback_counts'::regclass);
select conrelid::regclass as relation, conname, contype, convalidated,
       pg_get_constraintdef(oid) as definition
from pg_constraint where conrelid in
  ('public.matchup_feedback'::regclass,'public.matchup_feedback_counts'::regclass);
select schemaname, tablename, indexname, indexdef from pg_indexes
where schemaname='public' and tablename in ('matchup_feedback','matchup_feedback_counts');

-- Direct dependencies in both directions, including RPC calls/types/sequences.
select pg_describe_object(d.classid,d.objid,d.objsubid) as dependent,
       pg_describe_object(d.refclassid,d.refobjid,d.refobjsubid) as referenced, d.deptype
from pg_depend d
where (d.refclassid='pg_class'::regclass and d.refobjid in
       ('public.matchup_feedback'::regclass,'public.matchup_feedback_counts'::regclass))
   or (d.classid='pg_proc'::regclass and d.objid in
       (select oid from pg_proc where pronamespace='public'::regnamespace
        and proname in ('submit_matchup_feedback','refresh_matchup_feedback_counts','handle_matchup_feedback_counts')));

-- Recursive dependent views can create additional public access paths.
with recursive paths(oid) as (
  select 'public.matchup_feedback'::regclass::oid
  union select 'public.matchup_feedback_counts'::regclass::oid
  union
  select rw.ev_class from paths p
  join pg_depend d on d.refobjid=p.oid and d.refclassid='pg_class'::regclass
    and d.classid='pg_rewrite'::regclass
  join pg_rewrite rw on rw.oid=d.objid
)
select n.nspname,c.relname,c.relkind,c.reloptions,c.relacl,pg_get_userbyid(c.relowner) as owner
from paths p join pg_class c on c.oid=p.oid join pg_namespace n on n.oid=c.relnamespace
where c.relkind in ('v','m');

select pg_get_userbyid(defaclrole) as owner, defaclnamespace::regnamespace as schema,
       defaclobjtype, defaclacl from pg_default_acl;
commit;
