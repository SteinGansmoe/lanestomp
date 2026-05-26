create table if not exists public.league_champions (
  id text primary key,
  riot_key text not null unique,
  name text not null,
  title text not null,
  image_url text not null,
  tags text[] not null default '{}',
  version text not null,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists league_champions_name_idx
on public.league_champions (name);

create index if not exists league_champions_tags_idx
on public.league_champions using gin (tags);

grant select on table public.league_champions to anon, authenticated;
grant insert, update, delete on table public.league_champions to authenticated;

alter table public.league_champions enable row level security;

drop policy if exists "League champions are publicly readable" on public.league_champions;

create policy "League champions are publicly readable"
on public.league_champions
for select
to anon, authenticated
using (true);

drop policy if exists "Admins can manage league champions" on public.league_champions;

create policy "Admins can manage league champions"
on public.league_champions
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

comment on table public.league_champions is
  'Cached League of Legends champion metadata imported from Riot Data Dragon.';
