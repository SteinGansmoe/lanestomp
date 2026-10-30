-- CONTRACT: kept outside supabase/migrations to prevent premature db push.
-- Stage ONLY after the view-based application is live and verified.
begin;

do $$
begin
  if to_regclass('public.public_league_matchups') is null then
    raise exception 'Expand the public guide view before contracting storage access.';
  end if;
end $$;

-- The base table is the administrative API. RLS still allows authenticated
-- administrators to SELECT/INSERT/UPDATE/DELETE through the existing policy.
alter table public.league_matchups enable row level security;
drop policy if exists "League matchups are publicly readable" on public.league_matchups;
revoke all on table public.league_matchups from public, anon;

-- Authenticated users share a database role with administrators. Keep their
-- existing table privileges, but require an admin identity even if another
-- permissive policy is introduced later.
create policy "Only admins can access league matchup storage"
on public.league_matchups as restrictive
for all to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- The expanded public projection keeps its owner permissions and public SELECT grants.
notify pgrst, 'reload schema';
commit;
