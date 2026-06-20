alter table public.riot_scan_jobs
add column if not exists collection_result_consumed_at timestamptz;

create index if not exists riot_scan_jobs_collection_result_consumed_idx
on public.riot_scan_jobs (collection_job_id, collection_result_consumed_at)
where collection_job_id is not null;

comment on column public.riot_scan_jobs.collection_result_consumed_at is
  'Set when a completed child scan result has been consumed into its parent Riot collection job.';
