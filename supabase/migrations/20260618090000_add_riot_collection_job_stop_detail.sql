alter table public.riot_collection_jobs
add column if not exists stop_detail text;

comment on column public.riot_collection_jobs.stop_detail is
  'Human-readable collection stop detail, including ladder discovery diagnostics where available.';
