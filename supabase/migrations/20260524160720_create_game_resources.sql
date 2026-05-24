create table public.game_resources (
  id text primary key,
  game_id text not null references public.games(id) on delete cascade,
  title text not null,
  label text not null,
  url text not null,
  icon text not null default 'forum',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

grant select on table public.game_resources to anon, authenticated;
grant insert, update, delete on table public.game_resources to authenticated;

alter table public.game_resources enable row level security;

drop policy if exists "Allow public read access to active game resources" on public.game_resources;

create policy "Allow public read access to active game resources"
on public.game_resources
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Authenticated users can manage game resources" on public.game_resources;

create policy "Authenticated users can manage game resources"
on public.game_resources
for all
to authenticated
using (true)
with check (true);

insert into public.game_resources (
  id,
  game_id,
  title,
  label,
  url,
  icon,
  sort_order,
  is_active
)
values
  ('diablo-4-official-forums', 'diablo-4', 'Official Forums', 'Forum', 'https://us.forums.blizzard.com/en/d4', 'forum', 10, true),
  ('diablo-4-reddit', 'diablo-4', 'Diablo IV Reddit', 'Reddit', 'https://www.reddit.com/r/diablo4', 'reddit', 20, true),
  ('diablo-4-youtube', 'diablo-4', 'Diablo YouTube', 'YouTube', 'https://www.youtube.com/@Diablo', 'video', 30, true),
  ('wow-official-forums', 'world-of-warcraft', 'Official Forums', 'Forum', 'https://us.forums.blizzard.com/en/wow', 'forum', 10, true),
  ('wow-reddit', 'world-of-warcraft', 'World of Warcraft Reddit', 'Reddit', 'https://www.reddit.com/r/wow', 'reddit', 20, true),
  ('wow-youtube', 'world-of-warcraft', 'Warcraft YouTube', 'YouTube', 'https://www.youtube.com/@Warcraft', 'video', 30, true),
  ('lol-discord', 'league-of-legends', 'League of Legends Discord', 'Discord', 'https://discord.com/invite/leagueoflegends', 'discord', 10, true),
  ('lol-reddit', 'league-of-legends', 'League of Legends Reddit', 'Reddit', 'https://www.reddit.com/r/leagueoflegends', 'reddit', 20, true),
  ('lol-youtube', 'league-of-legends', 'League YouTube', 'YouTube', 'https://www.youtube.com/@leagueoflegends', 'video', 30, true),
  ('last-epoch-discord', 'last-epoch', 'Last Epoch Discord', 'Discord', 'https://discord.com/invite/lastepoch', 'discord', 10, true),
  ('last-epoch-forums', 'last-epoch', 'Official Forums', 'Forum', 'https://forum.lastepoch.com', 'forum', 20, true),
  ('last-epoch-reddit', 'last-epoch', 'Last Epoch Reddit', 'Reddit', 'https://www.reddit.com/r/LastEpoch', 'reddit', 30, true),
  ('path-of-exile-forums', 'path-of-exile', 'Official Forums', 'Forum', 'https://www.pathofexile.com/forum', 'forum', 10, true),
  ('path-of-exile-reddit', 'path-of-exile', 'Path of Exile Reddit', 'Reddit', 'https://www.reddit.com/r/pathofexile', 'reddit', 20, true),
  ('path-of-exile-youtube', 'path-of-exile', 'Path of Exile YouTube', 'YouTube', 'https://www.youtube.com/@grindinggear', 'video', 30, true);
