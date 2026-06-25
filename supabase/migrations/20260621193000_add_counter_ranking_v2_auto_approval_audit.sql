alter table public.counter_ranking_v2_mechanical_reviews
add column if not exists generated_at timestamptz,
add column if not exists generated_by text;

alter table public.counter_ranking_v2_mechanical_reviews
drop constraint if exists counter_ranking_v2_mechanical_review_adjustment_reason_check;

alter table public.counter_ranking_v2_mechanical_reviews
add constraint counter_ranking_v2_mechanical_review_adjustment_reason_check
check (
  adjustment_reason in (
    'auto_generated',
    'patch_buff',
    'patch_nerf',
    'meta_shift',
    'practical_difficulty',
    'data_disagreement',
    'manual_review',
    'other'
  )
);
