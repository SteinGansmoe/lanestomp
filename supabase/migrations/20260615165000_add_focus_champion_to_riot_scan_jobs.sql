alter table public.riot_scan_jobs
add column if not exists focus_champion_id text
references public.league_champions(id)
on update cascade
on delete set null;

create index if not exists riot_scan_jobs_focus_champion_id_idx
on public.riot_scan_jobs (focus_champion_id);

comment on column public.riot_scan_jobs.focus_champion_id is
  'Optional canonical champion id used to focus discovery results while preserving canonical matchup observation storage.';
