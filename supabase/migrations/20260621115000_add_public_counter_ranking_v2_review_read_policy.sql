grant select
on table public.counter_ranking_v2_mechanical_reviews
to anon, authenticated;

drop policy if exists "Public can read eligible counter ranking v2 reviews"
on public.counter_ranking_v2_mechanical_reviews;

create policy "Public can read eligible counter ranking v2 reviews"
on public.counter_ranking_v2_mechanical_reviews
for select
to anon, authenticated
using (
  public_eligible = true
  and review_status in ('verified_strong_counter', 'verified_soft_counter')
);
