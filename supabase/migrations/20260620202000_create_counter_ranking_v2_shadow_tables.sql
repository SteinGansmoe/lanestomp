create table if not exists public.counter_ranking_v2_champion_trait_profiles (
  champion_id text primary key references public.league_champions(id) on delete cascade,
  profile_version integer not null default 1,
  strengths jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint counter_ranking_v2_trait_profile_version_check check (profile_version > 0),
  constraint counter_ranking_v2_trait_profile_strengths_check check (jsonb_typeof(strengths) = 'array')
);

create table if not exists public.counter_ranking_v2_champion_vulnerability_profiles (
  champion_id text primary key references public.league_champions(id) on delete cascade,
  profile_version integer not null default 1,
  vulnerabilities jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint counter_ranking_v2_vulnerability_profile_version_check check (profile_version > 0),
  constraint counter_ranking_v2_vulnerability_profile_vulnerabilities_check
    check (jsonb_typeof(vulnerabilities) = 'array')
);

create table if not exists public.counter_ranking_v2_profile_reviews (
  champion_id text primary key references public.league_champions(id) on delete cascade,
  trait_profile_version integer not null default 1,
  vulnerability_profile_version integer not null default 1,
  status text not null default 'draft',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint counter_ranking_v2_profile_review_status_check
    check (status in ('draft', 'needs_review', 'reviewed')),
  constraint counter_ranking_v2_profile_review_trait_version_check
    check (trait_profile_version > 0),
  constraint counter_ranking_v2_profile_review_vulnerability_version_check
    check (vulnerability_profile_version > 0)
);

create table if not exists public.counter_ranking_v2_mechanical_fit_results (
  id bigint generated always as identity primary key,
  candidate_champion_id text not null references public.league_champions(id) on delete cascade,
  enemy_champion_id text not null references public.league_champions(id) on delete cascade,
  role text,
  score numeric(5,2) not null,
  raw_score numeric(10,4) not null,
  max_raw_score numeric(10,4) not null,
  factors jsonb not null default '[]'::jsonb,
  candidate_profile_version integer not null default 1,
  enemy_profile_version integer not null default 1,
  calculated_at timestamptz not null default now(),

  constraint counter_ranking_v2_mechanical_score_check check (score >= 0 and score <= 100),
  constraint counter_ranking_v2_mechanical_raw_score_check check (raw_score >= 0),
  constraint counter_ranking_v2_mechanical_max_raw_score_check check (max_raw_score >= 0),
  constraint counter_ranking_v2_mechanical_factors_check check (jsonb_typeof(factors) = 'array'),
  constraint counter_ranking_v2_mechanical_role_check
    check (role is null or role in ('top', 'jungle', 'mid', 'adc', 'support')),
  constraint counter_ranking_v2_mechanical_not_self_check
    check (candidate_champion_id <> enemy_champion_id),
  constraint counter_ranking_v2_mechanical_candidate_version_check
    check (candidate_profile_version > 0),
  constraint counter_ranking_v2_mechanical_enemy_version_check
    check (enemy_profile_version > 0)
);

create unique index if not exists counter_ranking_v2_mechanical_fit_unique_idx
on public.counter_ranking_v2_mechanical_fit_results (
  candidate_champion_id,
  enemy_champion_id,
  coalesce(role, 'all'),
  candidate_profile_version,
  enemy_profile_version
);

create index if not exists counter_ranking_v2_mechanical_fit_enemy_score_idx
on public.counter_ranking_v2_mechanical_fit_results (enemy_champion_id, role, score desc);

alter table public.counter_ranking_v2_champion_trait_profiles enable row level security;
alter table public.counter_ranking_v2_champion_vulnerability_profiles enable row level security;
alter table public.counter_ranking_v2_profile_reviews enable row level security;
alter table public.counter_ranking_v2_mechanical_fit_results enable row level security;

drop policy if exists "Admins can manage counter ranking v2 trait profiles"
on public.counter_ranking_v2_champion_trait_profiles;
create policy "Admins can manage counter ranking v2 trait profiles"
on public.counter_ranking_v2_champion_trait_profiles
for all
to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin));

drop policy if exists "Admins can manage counter ranking v2 vulnerability profiles"
on public.counter_ranking_v2_champion_vulnerability_profiles;
create policy "Admins can manage counter ranking v2 vulnerability profiles"
on public.counter_ranking_v2_champion_vulnerability_profiles
for all
to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin));

drop policy if exists "Admins can manage counter ranking v2 profile reviews"
on public.counter_ranking_v2_profile_reviews;
create policy "Admins can manage counter ranking v2 profile reviews"
on public.counter_ranking_v2_profile_reviews
for all
to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin));

drop policy if exists "Admins can manage counter ranking v2 mechanical fit results"
on public.counter_ranking_v2_mechanical_fit_results;
create policy "Admins can manage counter ranking v2 mechanical fit results"
on public.counter_ranking_v2_mechanical_fit_results
for all
to authenticated
using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin))
with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.is_admin));

grant select, insert, update, delete
on table
  public.counter_ranking_v2_champion_trait_profiles,
  public.counter_ranking_v2_champion_vulnerability_profiles,
  public.counter_ranking_v2_profile_reviews,
  public.counter_ranking_v2_mechanical_fit_results
to authenticated;
