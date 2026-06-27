alter table public.counter_ranking_v2_mechanical_reviews
drop constraint if exists counter_ranking_v2_mechanical_review_status_check;

alter table public.counter_ranking_v2_mechanical_reviews
add constraint counter_ranking_v2_mechanical_review_status_check
check (
  review_status in (
    'unreviewed',
    'verified_strong_counter',
    'verified_soft_counter',
    'not_a_counter',
    'incorrect_suggestion',
    'high_mastery_required',
    'needs_more_data'
  )
);
