-- A09: owner-authorized metadata inspection in the independently verified project.
-- No corpus data, aggregate execution, JWTs or administrative records are read.
begin transaction read only;

select current_database() as database_name, current_user as inspector,
       current_setting('server_version') as server_version;
-- If history is missing/inaccessible, stop and ROLLBACK; never repair history here.
select to_regclass('supabase_migrations.schema_migrations') as migration_history;
with expected(version) as (values
  ('20260614183000'), ('20260617194500'), ('20261031223000')
)
select e.version, h.version is not null as applied
from expected e left join supabase_migrations.schema_migrations h using (version)
order by e.version;

-- All signatures, including unexpected overloads or same-name user-schema copies.
select n.nspname, p.oid::regprocedure as signature,
       pg_get_function_identity_arguments(p.oid) as arguments,
       pg_get_function_result(p.oid) as result,
       pg_get_userbyid(p.proowner) as owner, p.prosecdef, p.provolatile,
       p.proconfig, p.proacl,
       md5(replace(p.prosrc, E'\r\n', E'\n')) as normalized_body_md5,
       has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
       has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute,
       has_function_privilege('service_role',p.oid,'EXECUTE') as service_execute,
       exists (select 1 from aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a
               where a.grantee=0 and a.privilege_type='EXECUTE') as public_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where p.proname='get_counter_pick_unique_matchup_group_count'
order by n.nspname,p.oid::regprocedure::text;

select n.nspname,p.oid::regprocedure as signature,
       case when a.grantee=0 then 'PUBLIC' else pg_get_userbyid(a.grantee) end as grantee,
       pg_get_userbyid(a.grantor) as grantor,a.privilege_type,a.is_grantable
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
cross join lateral aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a
where p.proname='get_counter_pick_unique_matchup_group_count';

-- Effective EXECUTE above includes inheritance/PUBLIC. Admin identities use the
-- authenticated SQL role too; their direct RPC access must also be false afterward.
with recursive memberships(root,member,granted_role) as (
  select r.rolname,m.member,m.roleid from pg_roles r
  join pg_auth_members m on m.member=r.oid
  where r.rolname in ('anon','authenticated','service_role',current_user)
     or r.oid in (select proowner from pg_proc where proname='get_counter_pick_unique_matchup_group_count')
  union
  select m.root,a.member,a.roleid from memberships m
  join pg_auth_members a on a.member=m.granted_role
)
select root,pg_get_userbyid(member) as member,
       pg_get_userbyid(granted_role) as granted_role from memberships;
select rolname,rolsuper,rolinherit,rolbypassrls,rolcanlogin from pg_roles
where rolname in ('anon','authenticated','service_role',current_user)
   or oid in (select proowner from pg_proc
              where proname='get_counter_pick_unique_matchup_group_count');

select c.relname,pg_get_userbyid(c.relowner) as owner,
       c.relrowsecurity,c.relforcerowsecurity,c.relacl
from pg_class c where c.oid='public.riot_matchup_observations'::regclass;
select schemaname,tablename,policyname,permissive,roles,cmd,qual,with_check
from pg_policies where schemaname='public' and tablename='riot_matchup_observations';
with roles_to_check as (
  select oid,rolname from pg_roles where rolname in ('anon','authenticated','service_role',current_user)
     or oid in (select proowner from pg_proc
                where proname='get_counter_pick_unique_matchup_group_count')
)
select r.rolname,p.privilege,
       has_table_privilege(r.oid,'public.riot_matchup_observations',p.privilege) as effective_table_privilege
from roles_to_check r cross join (values ('SELECT'),('INSERT'),('UPDATE'),('DELETE')) p(privilege);
with roles_to_check as (
  select oid,rolname from pg_roles where rolname in ('anon','authenticated','service_role')
     or oid in (select proowner from pg_proc
                where proname='get_counter_pick_unique_matchup_group_count')
)
select r.rolname,a.attname,a.attacl,
       has_column_privilege(r.oid,a.attrelid,a.attnum,'SELECT') as effective_select
from roles_to_check r cross join pg_attribute a
where a.attrelid='public.riot_matchup_observations'::regclass
  and a.attnum>0 and not a.attisdropped;
select r.rolname,has_schema_privilege(r.oid,'public','USAGE') as public_usage,
       has_schema_privilege(r.oid,'public','CREATE') as public_create
from pg_roles r where r.rolname in ('anon','authenticated','service_role')
   or r.oid in (select proowner from pg_proc
                where proname='get_counter_pick_unique_matchup_group_count');

-- Inventory dependencies in both directions and indirect entry points. SQL
-- string bodies/dynamic SQL need manual review; catalogs do not track them all.
select pg_describe_object(d.classid,d.objid,d.objsubid) as dependent,
       pg_describe_object(d.refclassid,d.refobjid,d.refobjsubid) as referenced,d.deptype
from pg_depend d where
  (d.classid='pg_proc'::regclass and d.objid in
    (select oid from pg_proc where proname='get_counter_pick_unique_matchup_group_count'))
  or (d.refclassid='pg_proc'::regclass and d.refobjid in
    (select oid from pg_proc where proname='get_counter_pick_unique_matchup_group_count'))
  or (d.refclassid='pg_class'::regclass and d.refobjid='public.riot_matchup_observations'::regclass);
select n.nspname,p.oid::regprocedure as signature,pg_get_userbyid(p.proowner) as owner,
       p.prosecdef,p.proconfig,p.proacl,
       has_function_privilege('anon',p.oid,'EXECUTE') as anon_execute,
       has_function_privilege('authenticated',p.oid,'EXECUTE') as authenticated_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
where n.nspname not in ('pg_catalog','information_schema') and n.nspname not like 'pg_%'
  and (p.prosrc ilike '%get_counter_pick_unique_matchup_group_count%'
       or p.prosrc ilike '%riot_matchup_observations%');
with recursive paths(oid) as (
  select 'public.riot_matchup_observations'::regclass::oid
  union
  select rw.ev_class from paths p join pg_depend d
    on d.refobjid=p.oid and d.refclassid='pg_class'::regclass
    and d.classid='pg_rewrite'::regclass
  join pg_rewrite rw on rw.oid=d.objid
)
select n.nspname,c.relname,c.relkind,c.reloptions,c.relacl,
       pg_get_userbyid(c.relowner) as owner
from paths p join pg_class c on c.oid=p.oid join pg_namespace n on n.oid=c.relnamespace
where c.relkind in ('v','m');
select pg_get_userbyid(defaclrole) as owner,defaclnamespace::regnamespace as schema,
       defaclobjtype,defaclacl from pg_default_acl;
commit;
