create extension if not exists pgcrypto;

create table if not exists public.riot_seed_candidates (
  id uuid primary key default gen_random_uuid(),
  puuid text not null,
  platform_region text not null,
  regional_routing text not null,
  source text not null default 'match_discovery',
  status text not null default 'candidate',
  first_seen_match_id text,
  first_seen_scan_job_id bigint references public.riot_scan_jobs(id) on delete set null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  observed_games integer not null default 0,
  estimated_primary_role text,
  estimated_secondary_role text,
  primary_role_share numeric,
  secondary_role_share numeric,
  primary_champion text references public.league_champions(id) on update cascade on delete set null,
  primary_champion_role text,
  primary_champion_games integer not null default 0,
  primary_champion_share numeric,
  role_distribution jsonb not null default '{}'::jsonb,
  top_champions jsonb not null default '[]'::jsonb,
  last_profiled_at timestamptz,
  last_scanned_at timestamptz,
  next_eligible_scan_at timestamptz,
  times_scanned integer not null default 0,
  successful_scan_count integer not null default 0,
  failed_scan_count integer not null default 0,
  consecutive_scan_failures integer not null default 0,
  latest_match_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint riot_seed_candidates_unique_platform_puuid unique (
    platform_region,
    puuid
  ),
  constraint riot_seed_candidates_source_check check (
    source in ('match_discovery', 'riot_id_resolver', 'manual', 'ladder_import')
  ),
  constraint riot_seed_candidates_status_check check (
    status in ('candidate', 'approved', 'queued', 'active', 'cooldown', 'ignored', 'failed')
  ),
  constraint riot_seed_candidates_primary_role_check check (
    estimated_primary_role is null
    or estimated_primary_role in ('top', 'jungle', 'mid', 'adc', 'support')
  ),
  constraint riot_seed_candidates_secondary_role_check check (
    estimated_secondary_role is null
    or estimated_secondary_role in ('top', 'jungle', 'mid', 'adc', 'support')
  ),
  constraint riot_seed_candidates_primary_champion_role_check check (
    primary_champion_role is null
    or primary_champion_role in ('top', 'jungle', 'mid', 'adc', 'support')
  ),
  constraint riot_seed_candidates_observed_games_check check (observed_games >= 0),
  constraint riot_seed_candidates_scan_counts_check check (
    times_scanned >= 0
    and successful_scan_count >= 0
    and failed_scan_count >= 0
    and consecutive_scan_failures >= 0
  ),
  constraint riot_seed_candidates_role_share_check check (
    (primary_role_share is null or (primary_role_share >= 0 and primary_role_share <= 1))
    and (secondary_role_share is null or (secondary_role_share >= 0 and secondary_role_share <= 1))
  ),
  constraint riot_seed_candidates_champion_share_check check (
    primary_champion_share is null
    or (primary_champion_share >= 0 and primary_champion_share <= 1)
  )
);

create table if not exists public.riot_seed_candidate_observations (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.riot_seed_candidates(id) on delete cascade,
  match_id text not null,
  platform_region text not null,
  regional_routing text not null,
  patch text not null,
  queue_id integer not null,
  role text not null,
  champion text not null references public.league_champions(id) on update cascade on delete cascade,
  won boolean not null,
  game_start_at timestamptz,
  game_duration_seconds integer,
  scan_job_id bigint references public.riot_scan_jobs(id) on delete set null,
  created_at timestamptz not null default now(),

  constraint riot_seed_candidate_observations_unique_candidate_match unique (
    candidate_id,
    match_id
  ),
  constraint riot_seed_candidate_observations_role_check check (
    role in ('top', 'jungle', 'mid', 'adc', 'support')
  ),
  constraint riot_seed_candidate_observations_game_duration_check check (
    game_duration_seconds is null
    or game_duration_seconds >= 0
  )
);

create index if not exists riot_seed_candidates_platform_region_idx
on public.riot_seed_candidates (platform_region);

create index if not exists riot_seed_candidates_status_idx
on public.riot_seed_candidates (status);

create index if not exists riot_seed_candidates_primary_role_idx
on public.riot_seed_candidates (estimated_primary_role);

create index if not exists riot_seed_candidates_primary_champion_idx
on public.riot_seed_candidates (primary_champion);

create index if not exists riot_seed_candidates_source_idx
on public.riot_seed_candidates (source);

create index if not exists riot_seed_candidates_last_seen_idx
on public.riot_seed_candidates (last_seen_at desc);

create index if not exists riot_seed_candidate_observations_candidate_id_idx
on public.riot_seed_candidate_observations (candidate_id);

create index if not exists riot_seed_candidate_observations_candidate_role_idx
on public.riot_seed_candidate_observations (candidate_id, role);

create index if not exists riot_seed_candidate_observations_candidate_champion_idx
on public.riot_seed_candidate_observations (candidate_id, champion);

create index if not exists riot_seed_candidate_observations_candidate_role_champion_idx
on public.riot_seed_candidate_observations (candidate_id, role, champion);

create index if not exists riot_seed_candidate_observations_patch_idx
on public.riot_seed_candidate_observations (patch);

create index if not exists riot_seed_candidate_observations_game_start_at_idx
on public.riot_seed_candidate_observations (game_start_at desc);

create index if not exists riot_seed_candidate_observations_scan_job_id_idx
on public.riot_seed_candidate_observations (scan_job_id);

grant select on table public.riot_seed_candidates to authenticated;
grant select on table public.riot_seed_candidate_observations to authenticated;
grant select, insert, update, delete on table public.riot_seed_candidates to service_role;
grant select, insert, update, delete on table public.riot_seed_candidate_observations to service_role;

alter table public.riot_seed_candidates enable row level security;
alter table public.riot_seed_candidate_observations enable row level security;

drop policy if exists "Admins can read riot seed candidates"
on public.riot_seed_candidates;

create policy "Admins can read riot seed candidates"
on public.riot_seed_candidates
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage riot seed candidates"
on public.riot_seed_candidates;

create policy "Service role can manage riot seed candidates"
on public.riot_seed_candidates
for all
to service_role
using (true)
with check (true);

drop policy if exists "Admins can read riot seed candidate observations"
on public.riot_seed_candidate_observations;

create policy "Admins can read riot seed candidate observations"
on public.riot_seed_candidate_observations
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage riot seed candidate observations"
on public.riot_seed_candidate_observations;

create policy "Service role can manage riot seed candidate observations"
on public.riot_seed_candidate_observations
for all
to service_role
using (true)
with check (true);

drop trigger if exists set_riot_seed_candidates_updated_at
on public.riot_seed_candidates;

create trigger set_riot_seed_candidates_updated_at
before update on public.riot_seed_candidates
for each row execute function public.set_current_timestamp_updated_at();

comment on table public.riot_seed_candidates is
  'Admin-only durable Riot player seed pool. One candidate per platform region and PUUID.';

comment on table public.riot_seed_candidate_observations is
  'Durable per-match participant appearances used to rebuild Riot seed candidate profiles.';
