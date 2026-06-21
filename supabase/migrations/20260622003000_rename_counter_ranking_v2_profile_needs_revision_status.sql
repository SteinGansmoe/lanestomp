update public.counter_ranking_v2_profile_reviews
set status = 'needs_revision'
where status = 'needs_review';

alter table public.counter_ranking_v2_profile_reviews
drop constraint if exists counter_ranking_v2_profile_review_status_check;

alter table public.counter_ranking_v2_profile_reviews
add constraint counter_ranking_v2_profile_review_status_check
check (status in ('draft', 'needs_revision', 'reviewed'));
