alter table public.riot_seed_candidates
add column if not exists last_successful_scan_at timestamptz,
add column if not exists latest_scan_job_id bigint
  references public.riot_scan_jobs(id)
  on delete set null,
add column if not exists last_scan_error_code text,
add column if not exists last_scan_error_at timestamptz,
add column if not exists next_retry_at timestamptz,
add column if not exists manually_rejected_at timestamptz,
add column if not exists manually_rejected_by uuid
  references auth.users(id)
  on delete set null,
add column if not exists rejection_reason text,
add column if not exists last_scan_match_ids_fetched integer,
add column if not exists last_scan_unique_matches_found integer,
add column if not exists last_scan_duplicate_matches_skipped integer,
add column if not exists last_scan_matchup_observations_inserted integer,
add column if not exists last_scan_candidate_observations_discovered integer;

update public.riot_seed_candidates
set last_successful_scan_at = last_scanned_at
where last_successful_scan_at is null
  and successful_scan_count > 0
  and last_scanned_at is not null;

update public.riot_seed_candidates
set next_eligible_scan_at = last_successful_scan_at + interval '7 days'
where next_eligible_scan_at is null
  and last_successful_scan_at is not null;

create index if not exists riot_seed_candidates_last_successful_scan_idx
on public.riot_seed_candidates (last_successful_scan_at desc);

create index if not exists riot_seed_candidates_next_scan_eligible_idx
on public.riot_seed_candidates (next_eligible_scan_at);

create index if not exists riot_seed_candidates_next_retry_idx
on public.riot_seed_candidates (next_retry_at);

create index if not exists riot_seed_candidates_manual_rejection_idx
on public.riot_seed_candidates (manually_rejected_at);

create index if not exists riot_seed_candidates_latest_scan_job_idx
on public.riot_seed_candidates (latest_scan_job_id);

comment on column public.riot_seed_candidates.last_successful_scan_at is
  'Last scan completion time that successfully contributed to the seed lifecycle.';

comment on column public.riot_seed_candidates.next_eligible_scan_at is
  'Durable next time this seed candidate can be selected after a successful scan cooldown.';

comment on column public.riot_seed_candidates.next_retry_at is
  'Durable next time this seed candidate can be retried after a failed scan.';

comment on column public.riot_seed_candidates.manually_rejected_at is
  'When an admin removed this seed candidate from the operational queue without deleting history.';

comment on column public.riot_seed_candidates.last_scan_matchup_observations_inserted is
  'Latest scan yield metric copied from the job summary for admin triage.';
