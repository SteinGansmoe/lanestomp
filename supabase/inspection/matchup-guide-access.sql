-- Owner-reviewed, read-only inspection. Returns schema/security metadata only.
-- Run before deployment and again afterward; do not paste guide data or tokens.
begin transaction read only;

select c.relname, c.relkind, c.relrowsecurity, c.relforcerowsecurity,
       pg_get_userbyid(c.relowner) as owner, c.reloptions, c.relacl
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('league_matchups', 'public_league_matchups');

select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies where schemaname = 'public' and tablename = 'league_matchups';

select * from information_schema.table_privileges
where table_schema = 'public'
  and table_name in ('league_matchups', 'public_league_matchups');
select * from information_schema.column_privileges
where table_schema = 'public'
  and table_name in ('league_matchups', 'public_league_matchups');

-- Effective grants also account for role inheritance. RLS still applies.
select r.rolname, c.relname, a.attname,
       has_column_privilege(r.oid, c.oid, a.attnum, 'SELECT') as can_select_column
from pg_roles r cross join pg_class c
join pg_namespace n on n.oid = c.relnamespace
join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
where r.rolname in ('anon', 'authenticated', 'service_role')
  and n.nspname = 'public'
  and c.relname in ('league_matchups', 'public_league_matchups');

-- All dependent views, including views built on views. Inspect any extra path.
with recursive dependent_relations as (
  select 'public.league_matchups'::regclass::oid as oid
  union
  select rw.ev_class
  from dependent_relations base
  join pg_depend d on d.refobjid = base.oid and d.classid = 'pg_rewrite'::regclass
  join pg_rewrite rw on rw.oid = d.objid
)
select n.nspname, c.relname, pg_get_userbyid(c.relowner) as owner,
       c.reloptions, c.relacl, pg_get_viewdef(c.oid, true) as definition
from dependent_relations d join pg_class c on c.oid = d.oid
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('v', 'm');

-- Include dynamically referenced routines (not all have pg_depend entries).
select n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) as arguments,
       p.prosecdef, pg_get_userbyid(p.proowner) as owner, p.proacl,
       pg_get_functiondef(p.oid) as definition
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.prokind = 'f'
  and (p.prosrc ilike '%league_matchups%' or p.proname = 'is_admin');

select pg_get_userbyid(defaclrole) as owner, defaclnamespace::regnamespace,
       defaclobjtype, defaclacl
from pg_default_acl;

-- is_admin trusts profiles.role. Review effective grants together with policies.
select has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE')
       as authenticated_can_update_role;
select policyname, cmd, roles, qual, with_check
from pg_policies where schemaname = 'public' and tablename = 'profiles';
commit;
