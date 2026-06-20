alter table public.counter_pick_stats
add column if not exists rank_bracket text not null default 'all';

alter table public.counter_pick_stats
drop constraint if exists counter_pick_stats_unique_matchup;

alter table public.counter_pick_stats
add constraint counter_pick_stats_unique_aggregate
unique (
  enemy_champion_id,
  counter_champion_id,
  role,
  patch,
  rank_bracket
);