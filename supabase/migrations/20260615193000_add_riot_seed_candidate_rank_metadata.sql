alter table public.riot_seed_candidates
add column if not exists rank_queue_type text,
add column if not exists rank_tier text,
add column if not exists rank_division text,
add column if not exists rank_league_points integer,
add column if not exists rank_wins integer,
add column if not exists rank_losses integer,
add column if not exists rank_win_rate numeric,
add column if not exists rank_hot_streak boolean,
add column if not exists rank_veteran boolean,
add column if not exists rank_fresh_blood boolean,
add column if not exists rank_inactive boolean,
add column if not exists ranked_at timestamptz,
add column if not exists rank_last_attempted_at timestamptz,
add column if not exists rank_last_success_at timestamptz,
add column if not exists rank_next_eligible_at timestamptz,
add column if not exists rank_enrichment_status text not null default 'pending',
add column if not exists rank_enrichment_error_code text,
add column if not exists rank_enrichment_error_message text,
add column if not exists rank_enrichment_attempts integer not null default 0,
add column if not exists rank_enrichment_failures integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'riot_seed_candidates_rank_enrichment_status_check'
  ) then
    alter table public.riot_seed_candidates
    add constraint riot_seed_candidates_rank_enrichment_status_check check (
      rank_enrichment_status in (
        'pending',
        'queued',
        'running',
        'ranked',
        'unranked',
        'not_found',
        'rate_limited',
        'failed'
      )
    );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'riot_seed_candidates_rank_counts_check'
  ) then
    alter table public.riot_seed_candidates
    add constraint riot_seed_candidates_rank_counts_check check (
      (rank_league_points is null or rank_league_points >= 0)
      and (rank_wins is null or rank_wins >= 0)
      and (rank_losses is null or rank_losses >= 0)
      and (rank_win_rate is null or (rank_win_rate >= 0 and rank_win_rate <= 1))
      and rank_enrichment_attempts >= 0
      and rank_enrichment_failures >= 0
    );
  end if;
end $$;

create table if not exists public.riot_seed_candidate_rank_snapshots (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.riot_seed_candidates(id) on delete cascade,
  platform_region text not null,
  queue_type text,
  tier text,
  division text,
  league_points integer,
  wins integer,
  losses integer,
  win_rate numeric,
  hot_streak boolean,
  veteran boolean,
  fresh_blood boolean,
  inactive boolean,
  snapshot_status text not null,
  observed_at timestamptz not null default now(),
  source text not null default 'riot_api',
  created_at timestamptz not null default now(),

  constraint riot_seed_candidate_rank_snapshots_status_check check (
    snapshot_status in ('ranked', 'unranked', 'not_found')
  ),
  constraint riot_seed_candidate_rank_snapshots_counts_check check (
    (league_points is null or league_points >= 0)
    and (wins is null or wins >= 0)
    and (losses is null or losses >= 0)
    and (win_rate is null or (win_rate >= 0 and win_rate <= 1))
  )
);

create unique index if not exists riot_seed_candidate_rank_snapshots_unique_state_idx
on public.riot_seed_candidate_rank_snapshots (
  candidate_id,
  snapshot_status,
  coalesce(queue_type, ''),
  coalesce(tier, ''),
  coalesce(division, ''),
  coalesce(league_points, -1),
  coalesce(wins, -1),
  coalesce(losses, -1),
  coalesce(win_rate, -1),
  coalesce(hot_streak, false),
  coalesce(veteran, false),
  coalesce(fresh_blood, false),
  coalesce(inactive, false)
);

create index if not exists riot_seed_candidates_rank_status_idx
on public.riot_seed_candidates (rank_enrichment_status);

create index if not exists riot_seed_candidates_rank_tier_idx
on public.riot_seed_candidates (rank_tier);

create index if not exists riot_seed_candidates_rank_last_success_idx
on public.riot_seed_candidates (rank_last_success_at desc);

create index if not exists riot_seed_candidates_rank_next_eligible_idx
on public.riot_seed_candidates (rank_next_eligible_at);

create index if not exists riot_seed_candidate_rank_snapshots_candidate_idx
on public.riot_seed_candidate_rank_snapshots (candidate_id, observed_at desc);

grant select on table public.riot_seed_candidate_rank_snapshots to authenticated;
grant select, insert, update, delete on table public.riot_seed_candidate_rank_snapshots to service_role;

alter table public.riot_seed_candidate_rank_snapshots enable row level security;

drop policy if exists "Admins can read riot seed candidate rank snapshots"
on public.riot_seed_candidate_rank_snapshots;

create policy "Admins can read riot seed candidate rank snapshots"
on public.riot_seed_candidate_rank_snapshots
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage riot seed candidate rank snapshots"
on public.riot_seed_candidate_rank_snapshots;

create policy "Service role can manage riot seed candidate rank snapshots"
on public.riot_seed_candidate_rank_snapshots
for all
to service_role
using (true)
with check (true);

comment on table public.riot_seed_candidate_rank_snapshots is
  'Point-in-time Riot Ranked Solo/Duo metadata snapshots for seed candidates.';
