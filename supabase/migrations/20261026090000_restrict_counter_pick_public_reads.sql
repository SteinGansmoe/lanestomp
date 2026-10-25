begin;

-- The browser previously read these tables directly through Supabase REST.
-- Closing the Next.js route alone would leave that public data endpoint open.
drop policy if exists "Counter pick stats are publicly readable"
  on public.counter_pick_stats;
drop policy if exists "Counter pick match statistics are publicly readable"
  on public.league_counter_pick_match_statistics;
drop policy if exists "Reviewed league counter picks are publicly readable"
  on public.league_counter_picks;
drop policy if exists "Public can read eligible counter ranking v2 reviews"
  on public.counter_ranking_v2_mechanical_reviews;

revoke select on table public.counter_pick_stats,
  public.league_counter_pick_match_statistics,
  public.league_counter_picks,
  public.counter_ranking_v2_mechanical_reviews from anon;

-- Existing authenticated admin management policies already cover the latter two tables.
create policy "Admins can read stored counter pick stats"
  on public.counter_pick_stats for select to authenticated
  using (public.is_admin(auth.uid()));
create policy "Admins can read stored counter pick match statistics"
  on public.league_counter_pick_match_statistics for select to authenticated
  using (public.is_admin(auth.uid()));

-- No rows, schema, write policies, or public Matchup Guide policies are changed.
commit;
