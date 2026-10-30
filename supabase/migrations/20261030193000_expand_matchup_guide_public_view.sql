begin;

-- EXPAND: compatible with old base-table readers. No storage grants or RLS change.
-- Deliberately owner-evaluated so this view survives later storage restrictions.
-- The explicit predicate and column allowlist ARE this view's public boundary.
-- security_barrier prevents caller predicates running ahead of this filter.
create view public.public_league_matchups
with (security_barrier = true, security_invoker = false)
as
select
  id,
  champion_a_id,
  champion_b_id,
  role,
  overview,
  early_game,
  trading_pattern,
  power_spikes,
  danger_windows,
  win_conditions,
  difficulty_rating,
  confidence_level,
  generation_status,
  updated_at
from public.league_matchups
where generation_status = 'reviewed';

alter view public.public_league_matchups owner to postgres;
-- Supabase default privileges can include write grants on new views.
revoke all on table public.public_league_matchups from public, anon, authenticated;
grant select on table public.public_league_matchups to anon, authenticated;

comment on view public.public_league_matchups is
  'Read-only public guide projection. Only reviewed rows and approved public fields; never add internal fields or remove the publication predicate.';

notify pgrst, 'reload schema';
commit;
