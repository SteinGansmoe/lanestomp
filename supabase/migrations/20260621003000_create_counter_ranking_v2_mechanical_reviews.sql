create table if not exists public.counter_ranking_v2_mechanical_reviews (
  id bigint generated always as identity primary key,
  enemy_champion_id text not null references public.league_champions(id) on delete cascade,
  counter_champion_id text not null references public.league_champions(id) on delete cascade,
  role text not null,
  calculated_mechanical_score numeric(5,2) not null,
  manual_adjustment numeric(5,2) not null default 0,
  final_mechanical_score numeric(5,2) generated always as (
    least(100, greatest(0, calculated_mechanical_score + manual_adjustment))
  ) stored,
  adjustment_reason text not null default 'manual_review',
  review_status text not null default 'unreviewed',
  public_eligible boolean not null default false,
  admin_review_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint counter_ranking_v2_mechanical_review_role_check
    check (role in ('top', 'jungle', 'mid', 'adc', 'support')),
  constraint counter_ranking_v2_mechanical_review_not_self_check
    check (enemy_champion_id <> counter_champion_id),
  constraint counter_ranking_v2_mechanical_reviews_unique
    unique (enemy_champion_id, counter_champion_id, role),
  constraint counter_ranking_v2_mechanical_review_calculated_score_check
    check (calculated_mechanical_score >= 0 and calculated_mechanical_score <= 100),
  constraint counter_ranking_v2_mechanical_review_adjustment_check
    check (manual_adjustment >= -30 and manual_adjustment <= 30),
  constraint counter_ranking_v2_mechanical_review_adjustment_reason_check
    check (
      adjustment_reason in (
        'patch_buff',
        'patch_nerf',
        'meta_shift',
        'practical_difficulty',
        'data_disagreement',
        'manual_review',
        'other'
      )
    ),
  constraint counter_ranking_v2_mechanical_review_status_check
    check (
      review_status in (
        'unreviewed',
        'verified_strong_counter',
        'verified_soft_counter',
        'incorrect_suggestion',
        'high_mastery_required',
        'needs_more_data'
      )
    )
);

create index if not exists counter_ranking_v2_mechanical_reviews_enemy_final_score_idx
on public.counter_ranking_v2_mechanical_reviews (
  enemy_champion_id,
  role,
  public_eligible,
  final_mechanical_score desc
);

alter table public.counter_ranking_v2_mechanical_reviews enable row level security;

drop policy if exists "Admins can manage counter ranking v2 mechanical reviews"
on public.counter_ranking_v2_mechanical_reviews;
create policy "Admins can manage counter ranking v2 mechanical reviews"
on public.counter_ranking_v2_mechanical_reviews
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

grant select, insert, update, delete
on table public.counter_ranking_v2_mechanical_reviews
to authenticated;
