create or replace function public.get_counter_pick_unique_matchup_group_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint
  from (
    select
      least(champion_a, champion_b) as champion_low,
      greatest(champion_a, champion_b) as champion_high,
      role,
      patch
    from public.riot_matchup_observations
    group by
      least(champion_a, champion_b),
      greatest(champion_a, champion_b),
      role,
      patch
  ) unique_matchup_groups;
$$;

grant execute on function public.get_counter_pick_unique_matchup_group_count() to authenticated;
grant execute on function public.get_counter_pick_unique_matchup_group_count() to service_role;

comment on function public.get_counter_pick_unique_matchup_group_count() is
  'Counts unique Counter Pick matchup groups from Riot observations using sorted champion pair + role + patch. Rank bracket is intentionally excluded.';
