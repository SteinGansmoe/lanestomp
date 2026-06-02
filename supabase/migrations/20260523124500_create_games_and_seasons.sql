create table public.games (
  id text primary key,
  name text not null,
  slug text not null,
  description text,
  icon_url text,
  created_at timestamptz not null default now(),

  constraint games_slug_key unique (slug)
);

create table public.seasons (
  id text primary key,
  game_id text not null references public.games(id) on delete cascade,
  name text not null,
  slug text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  description text,
  created_at timestamptz not null default now(),

  constraint seasons_game_id_slug_key unique (game_id, slug),
  constraint seasons_date_order_check check (ends_at >= starts_at)
);

alter table public.games enable row level security;
alter table public.seasons enable row level security;

create policy "Games are publicly readable"
  on public.games
  for select
  to anon, authenticated
  using (true);

create policy "Seasons are publicly readable"
  on public.seasons
  for select
  to anon, authenticated
  using (true);

comment on table public.games is
  'Public game catalog for LaneStomp.';

comment on table public.seasons is
  'Public season schedule entries associated with games.';

comment on column public.games.icon_url is
  'Public icon or image path used by the LaneStomp UI.';

-- Tiny example dataset for local reference only:
-- insert into public.games (id, name, slug, description, icon_url)
-- values ('diablo-4', 'Diablo IV', 'diablo-4', 'Seasonal ARPG tracking.', '/images/d4-icon.jpg');
--
-- insert into public.seasons (id, game_id, name, slug, starts_at, ends_at, description)
-- values (
--   'diablo-4-season-13',
--   'diablo-4',
--   'Season 13',
--   'season-13',
--   '2026-06-01T00:00:00Z',
--   '2026-08-15T00:00:00Z',
--   'Example public season record.'
-- );
