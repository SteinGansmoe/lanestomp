create extension if not exists pgcrypto;

create table if not exists public.riot_matchup_observations (
  id uuid primary key default gen_random_uuid(),
  match_id text not null,
  patch text not null,
  queue_id integer not null,
  role text not null,
  champion_a text not null references public.league_champions(id) on update cascade on delete cascade,
  champion_b text not null references public.league_champions(id) on update cascade on delete cascade,
  winner_champion text not null references public.league_champions(id) on update cascade on delete cascade,
  champion_a_won boolean not null,
  champion_a_puuid text,
  champion_b_puuid text,
  champion_a_tier text,
  champion_b_tier text,
  rank_bracket text,
  scan_job_id bigint references public.riot_scan_jobs(id) on delete set null,
  game_start_at timestamptz,
  game_duration_seconds integer,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  seen_count integer not null default 1,
  created_at timestamptz not null default now(),

  constraint riot_matchup_observations_role_check check (
    role in ('top', 'jungle', 'mid', 'adc', 'support')
  ),
  constraint riot_matchup_observations_no_self_matchup_check check (
    champion_a <> champion_b
  ),
  constraint riot_matchup_observations_winner_check check (
    winner_champion in (champion_a, champion_b)
  ),
  constraint riot_matchup_observations_seen_count_check check (
    seen_count >= 1
  ),
  constraint riot_matchup_observations_game_duration_check check (
    game_duration_seconds is null
    or game_duration_seconds >= 0
  ),
  constraint riot_matchup_observations_unique_match_role unique (
    match_id,
    role
  )
);

create index if not exists riot_matchup_observations_patch_role_idx
on public.riot_matchup_observations (patch, role);

create index if not exists riot_matchup_observations_pair_role_patch_idx
on public.riot_matchup_observations (champion_a, champion_b, role, patch);

create index if not exists riot_matchup_observations_winner_idx
on public.riot_matchup_observations (winner_champion);

create index if not exists riot_matchup_observations_rank_bracket_idx
on public.riot_matchup_observations (rank_bracket);

create index if not exists riot_matchup_observations_scan_job_id_idx
on public.riot_matchup_observations (scan_job_id);

grant select on table public.riot_matchup_observations to authenticated;
grant select, insert, update, delete on table public.riot_matchup_observations to service_role;

alter table public.riot_matchup_observations enable row level security;

drop policy if exists "Admins can read riot matchup observations"
on public.riot_matchup_observations;

create policy "Admins can read riot matchup observations"
on public.riot_matchup_observations
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage riot matchup observations"
on public.riot_matchup_observations;

create policy "Service role can manage riot matchup observations"
on public.riot_matchup_observations
for all
to service_role
using (true)
with check (true);

comment on table public.riot_matchup_observations is
  'Durable, deduplicated Riot match role observations used as the source of truth for counter_pick_stats. Uniqueness is match_id + role because one ranked match has one matchup per role.';
