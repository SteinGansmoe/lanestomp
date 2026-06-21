alter table public.counter_ranking_v2_champion_trait_profiles
add column if not exists mastery_requirement text,
add column if not exists identity_summary text,
add column if not exists known_strengths jsonb not null default '[]'::jsonb,
add column if not exists updated_by uuid references auth.users(id) on delete set null;

alter table public.counter_ranking_v2_champion_vulnerability_profiles
add column if not exists known_weaknesses jsonb not null default '[]'::jsonb,
add column if not exists updated_by uuid references auth.users(id) on delete set null;

alter table public.counter_ranking_v2_champion_trait_profiles
drop constraint if exists counter_ranking_v2_trait_profile_mastery_requirement_check;

alter table public.counter_ranking_v2_champion_trait_profiles
add constraint counter_ranking_v2_trait_profile_mastery_requirement_check
check (
  mastery_requirement is null
  or mastery_requirement in ('low', 'moderate', 'high', 'very_high')
);

alter table public.counter_ranking_v2_champion_trait_profiles
drop constraint if exists counter_ranking_v2_trait_profile_known_strengths_check;

alter table public.counter_ranking_v2_champion_trait_profiles
add constraint counter_ranking_v2_trait_profile_known_strengths_check
check (jsonb_typeof(known_strengths) = 'array');

alter table public.counter_ranking_v2_champion_vulnerability_profiles
drop constraint if exists counter_ranking_v2_vulnerability_profile_known_weaknesses_check;

alter table public.counter_ranking_v2_champion_vulnerability_profiles
add constraint counter_ranking_v2_vulnerability_profile_known_weaknesses_check
check (jsonb_typeof(known_weaknesses) = 'array');
