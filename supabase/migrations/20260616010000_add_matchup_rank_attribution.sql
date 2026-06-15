alter table public.riot_matchup_observations
add column if not exists rank_attribution_method text not null default 'unknown',
add column if not exists champion_a_rank_tier text,
add column if not exists champion_a_rank_division text,
add column if not exists champion_a_rank_score numeric,
add column if not exists champion_a_rank_snapshot_id uuid
  references public.riot_seed_candidate_rank_snapshots(id)
  on delete set null,
add column if not exists champion_b_rank_tier text,
add column if not exists champion_b_rank_division text,
add column if not exists champion_b_rank_score numeric,
add column if not exists champion_b_rank_snapshot_id uuid
  references public.riot_seed_candidate_rank_snapshots(id)
  on delete set null,
add column if not exists average_rank_score numeric,
add column if not exists rank_snapshot_distance_seconds_a bigint,
add column if not exists rank_snapshot_distance_seconds_b bigint,
add column if not exists rank_attributed_at timestamptz;

update public.riot_matchup_observations
set rank_bracket = 'unknown'
where rank_bracket is null;

alter table public.riot_matchup_observations
alter column rank_bracket set default 'unknown',
alter column rank_bracket set not null;

alter table public.riot_matchup_observations
drop constraint if exists riot_matchup_observations_rank_bracket_check;

alter table public.riot_matchup_observations
add constraint riot_matchup_observations_rank_bracket_check check (
  rank_bracket in (
    'iron-silver',
    'gold-emerald',
    'diamond',
    'master-plus',
    'unknown'
  )
);

alter table public.riot_matchup_observations
drop constraint if exists riot_matchup_observations_rank_attribution_method_check;

alter table public.riot_matchup_observations
add constraint riot_matchup_observations_rank_attribution_method_check check (
  rank_attribution_method in (
    'two-player-average',
    'single-player',
    'unknown'
  )
);

alter table public.riot_matchup_observations
drop constraint if exists riot_matchup_observations_rank_attribution_state_check;

alter table public.riot_matchup_observations
add constraint riot_matchup_observations_rank_attribution_state_check check (
  (
    rank_attribution_method = 'two-player-average'
    and rank_bracket <> 'unknown'
    and champion_a_rank_score is not null
    and champion_b_rank_score is not null
    and average_rank_score is not null
  )
  or (
    rank_attribution_method = 'single-player'
    and rank_bracket <> 'unknown'
    and (
      (champion_a_rank_score is not null and champion_b_rank_score is null)
      or (champion_a_rank_score is null and champion_b_rank_score is not null)
    )
    and average_rank_score is null
  )
  or (
    rank_attribution_method = 'unknown'
    and rank_bracket = 'unknown'
    and champion_a_rank_score is null
    and champion_b_rank_score is null
    and average_rank_score is null
  )
);

alter table public.counter_pick_stats
drop constraint if exists counter_pick_stats_rank_bracket_check;

alter table public.counter_pick_stats
add constraint counter_pick_stats_rank_bracket_check check (
  rank_bracket in (
    'all',
    'iron-silver',
    'gold-emerald',
    'diamond',
    'master-plus',
    'unknown'
  )
);

create index if not exists riot_matchup_observations_rank_method_idx
on public.riot_matchup_observations (rank_attribution_method);

create index if not exists riot_matchup_observations_rank_attributed_at_idx
on public.riot_matchup_observations (rank_attributed_at);

create index if not exists riot_matchup_observations_champion_a_puuid_idx
on public.riot_matchup_observations (champion_a_puuid);

create index if not exists riot_matchup_observations_champion_b_puuid_idx
on public.riot_matchup_observations (champion_b_puuid);

comment on column public.riot_matchup_observations.rank_bracket is
  'Rank bracket attributed from the matchup participants. Aggregate rows use all for every observation.';

comment on column public.riot_matchup_observations.rank_attribution_method is
  'How the matchup rank bracket was assigned: two-player-average, single-player, or unknown.';
