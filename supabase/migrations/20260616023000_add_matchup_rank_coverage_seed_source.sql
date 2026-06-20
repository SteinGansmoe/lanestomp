alter table public.riot_seed_candidates
drop constraint if exists riot_seed_candidates_source_check;

alter table public.riot_seed_candidates
add constraint riot_seed_candidates_source_check check (
  source in (
    'match_discovery',
    'riot_id_resolver',
    'manual',
    'ladder_import',
    'matchup_rank_coverage'
  )
);
