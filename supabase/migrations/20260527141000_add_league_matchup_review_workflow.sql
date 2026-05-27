alter table public.league_matchups
add column if not exists generation_status text not null default 'draft',
add column if not exists generated_at timestamptz,
add column if not exists reviewed_at timestamptz,
add column if not exists reviewed_by uuid references public.profiles(id) on delete set null,
add column if not exists admin_notes text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'league_matchups_generation_status_check'
  ) then
    alter table public.league_matchups
    add constraint league_matchups_generation_status_check
    check (generation_status in ('draft', 'reviewed'));
  end if;
end $$;

create index if not exists league_matchups_generation_status_idx
on public.league_matchups (generation_status);
