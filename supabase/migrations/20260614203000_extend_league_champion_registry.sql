alter table public.league_champions
add column if not exists riot_data_key text,
add column if not exists slug text,
add column if not exists image_filename text,
add column if not exists is_active boolean not null default true;

update public.league_champions
set
  riot_data_key = coalesce(riot_data_key, id),
  slug = coalesce(
    slug,
    lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-+|-+$)', '', 'g'))
  ),
  image_filename = coalesce(image_filename, id || '.png'),
  is_active = coalesce(is_active, true)
where riot_data_key is null
  or slug is null
  or image_filename is null
  or is_active is null;

create unique index if not exists league_champions_riot_data_key_idx
on public.league_champions (riot_data_key)
where riot_data_key is not null;

create unique index if not exists league_champions_slug_idx
on public.league_champions (slug)
where slug is not null;

create index if not exists league_champions_is_active_idx
on public.league_champions (is_active);

create table if not exists public.league_champion_registry_sync_state (
  id text primary key default 'league_champions',
  source_version text,
  source_champion_count integer not null default 0,
  last_sync_started_at timestamptz,
  last_sync_completed_at timestamptz,
  last_sync_status text not null default 'never_run',
  last_sync_inserted integer not null default 0,
  last_sync_updated integer not null default 0,
  last_sync_unchanged integer not null default 0,
  last_sync_deactivated integer not null default 0,
  last_sync_failed integer not null default 0,
  last_sync_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint league_champion_registry_sync_state_singleton_check check (id = 'league_champions'),
  constraint league_champion_registry_sync_state_status_check check (
    last_sync_status in ('never_run', 'running', 'success', 'failed')
  )
);

grant select on table public.league_champion_registry_sync_state to authenticated;
grant select, insert, update, delete on table public.league_champion_registry_sync_state to service_role;

alter table public.league_champion_registry_sync_state enable row level security;

drop policy if exists "Admins can read league champion registry sync state"
on public.league_champion_registry_sync_state;

create policy "Admins can read league champion registry sync state"
on public.league_champion_registry_sync_state
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Service role can manage league champion registry sync state"
on public.league_champion_registry_sync_state;

create policy "Service role can manage league champion registry sync state"
on public.league_champion_registry_sync_state
for all
to service_role
using (true)
with check (true);

drop trigger if exists set_league_champion_registry_sync_state_updated_at
on public.league_champion_registry_sync_state;

create trigger set_league_champion_registry_sync_state_updated_at
before update on public.league_champion_registry_sync_state
for each row execute function public.set_current_timestamp_updated_at();

insert into public.league_champion_registry_sync_state (id)
values ('league_champions')
on conflict (id) do nothing;

comment on column public.league_champions.id is
  'LaneStomp canonical champion identifier. Currently matches Riot Data Dragon champion id and remains the FK target.';

comment on column public.league_champions.riot_data_key is
  'Riot Data Dragon champion object key. Source-managed by the champion registry sync.';

comment on column public.league_champions.riot_key is
  'Riot/Data Dragon numeric champion key stored as text. Source-managed by the champion registry sync.';

comment on column public.league_champions.slug is
  'URL-safe champion slug generated from the Data Dragon display name.';

comment on table public.league_champion_registry_sync_state is
  'Singleton metadata row for the server-side League champion registry sync.';
