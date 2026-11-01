begin;

-- Only the server's service client needs this administrative aggregate. Keep
-- the existing owner, SECURITY DEFINER mode, body, signature and STABLE result.
revoke execute on function public.get_counter_pick_unique_matchup_group_count()
  from public, anon, authenticated;
grant execute on function public.get_counter_pick_unique_matchup_group_count()
  to service_role;

-- The existing body references public.riot_matchup_observations explicitly;
-- count/least/greatest resolve through PostgreSQL's implicit pg_catalog path.
alter function public.get_counter_pick_unique_matchup_group_count()
  set search_path = '';

notify pgrst, 'reload schema';
commit;
