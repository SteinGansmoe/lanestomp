create table public.timeline_events (
  id text primary key,
  game_id text not null references public.games(id) on delete cascade,
  season_id text references public.seasons(id) on delete set null,
  title text not null,
  description text,
  event_date timestamptz not null,
  event_type text not null default 'event',
  is_pinned boolean not null default false,
  created_at timestamptz not null default now()
);

grant select on table public.timeline_events to anon, authenticated;
grant insert, update, delete on table public.timeline_events to authenticated;

alter table public.timeline_events enable row level security;

drop policy if exists "Allow public read access to timeline events" on public.timeline_events;

create policy "Allow public read access to timeline events"
on public.timeline_events
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated users can manage timeline events" on public.timeline_events;

create policy "Authenticated users can manage timeline events"
on public.timeline_events
for all
to authenticated
using (true)
with check (true);
