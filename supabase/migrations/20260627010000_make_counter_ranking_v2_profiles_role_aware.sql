alter table public.counter_ranking_v2_champion_trait_profiles
add column if not exists role text not null default 'mid';

alter table public.counter_ranking_v2_champion_vulnerability_profiles
add column if not exists role text not null default 'mid';

alter table public.counter_ranking_v2_profile_reviews
add column if not exists role text not null default 'mid';

alter table public.counter_ranking_v2_champion_trait_profiles
drop constraint if exists counter_ranking_v2_trait_profile_role_check;

alter table public.counter_ranking_v2_champion_trait_profiles
add constraint counter_ranking_v2_trait_profile_role_check
check (role in ('top', 'jungle', 'mid', 'adc', 'support'));

alter table public.counter_ranking_v2_champion_vulnerability_profiles
drop constraint if exists counter_ranking_v2_vulnerability_profile_role_check;

alter table public.counter_ranking_v2_champion_vulnerability_profiles
add constraint counter_ranking_v2_vulnerability_profile_role_check
check (role in ('top', 'jungle', 'mid', 'adc', 'support'));

alter table public.counter_ranking_v2_profile_reviews
drop constraint if exists counter_ranking_v2_profile_review_role_check;

alter table public.counter_ranking_v2_profile_reviews
add constraint counter_ranking_v2_profile_review_role_check
check (role in ('top', 'jungle', 'mid', 'adc', 'support'));

alter table public.counter_ranking_v2_champion_trait_profiles
drop constraint if exists counter_ranking_v2_champion_trait_profiles_pkey;

alter table public.counter_ranking_v2_champion_trait_profiles
add constraint counter_ranking_v2_champion_trait_profiles_pkey
primary key (champion_id, role);

alter table public.counter_ranking_v2_champion_vulnerability_profiles
drop constraint if exists counter_ranking_v2_champion_vulnerability_profiles_pkey;

alter table public.counter_ranking_v2_champion_vulnerability_profiles
add constraint counter_ranking_v2_champion_vulnerability_profiles_pkey
primary key (champion_id, role);

alter table public.counter_ranking_v2_profile_reviews
drop constraint if exists counter_ranking_v2_profile_reviews_pkey;

alter table public.counter_ranking_v2_profile_reviews
add constraint counter_ranking_v2_profile_reviews_pkey
primary key (champion_id, role);

create unique index if not exists counter_ranking_v2_trait_profile_champion_role_version_idx
on public.counter_ranking_v2_champion_trait_profiles (champion_id, role, profile_version);

create unique index if not exists counter_ranking_v2_vulnerability_profile_champion_role_version_idx
on public.counter_ranking_v2_champion_vulnerability_profiles (champion_id, role, profile_version);

