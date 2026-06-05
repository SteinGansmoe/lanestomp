alter table public.league_matchups
drop constraint if exists league_matchups_generation_status_check;

alter table public.league_matchups
add constraint league_matchups_generation_status_check
check (generation_status in ('draft', 'failed', 'reviewed'));
