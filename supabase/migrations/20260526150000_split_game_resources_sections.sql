alter table public.game_resources
add column if not exists section text not null default 'community';

alter table public.game_resources
add column if not exists group_title text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'game_resources_section_check'
  ) then
    alter table public.game_resources
    add constraint game_resources_section_check
    check (section in ('resources', 'community'));
  end if;
end $$;

update public.game_resources
set section = 'community',
    group_title = null
where section is null
   or id in (
    'diablo-4-official-forums',
    'diablo-4-reddit',
    'diablo-4-youtube',
    'wow-official-forums',
    'wow-reddit',
    'wow-youtube',
    'lol-discord',
    'lol-reddit',
    'lol-youtube',
    'last-epoch-discord',
    'last-epoch-forums',
    'last-epoch-reddit',
    'path-of-exile-forums',
    'path-of-exile-reddit',
    'path-of-exile-youtube'
  );

insert into public.game_resources (
  id,
  game_id,
  title,
  label,
  url,
  icon,
  section,
  group_title,
  sort_order,
  is_active
)
values
  ('d4-maxroll-builds', 'diablo-4', 'Maxroll Builds', 'Leveling and endgame build guides', 'https://maxroll.gg/d4', 'builds', 'resources', 'Build prep', 10, true),
  ('d4-icy-veins-guides', 'diablo-4', 'Icy Veins Guides', 'Class guides and seasonal explainers', 'https://www.icy-veins.com/d4/', 'builds', 'resources', 'Build prep', 20, true),
  ('d4-mobalytics-builds', 'diablo-4', 'Mobalytics Builds', 'Build planner and meta snapshots', 'https://mobalytics.gg/diablo-4', 'tools', 'resources', 'Build prep', 30, true),
  ('d4-official-patch-notes', 'diablo-4', 'Official Patch Notes', 'Blizzard news and seasonal updates', 'https://diablo4.blizzard.com/news', 'patch-notes', 'resources', 'Official and tools', 40, true),
  ('d4-trade', 'diablo-4', 'Diablo.trade', 'Community trade marketplace', 'https://diablo.trade', 'trade', 'resources', 'Official and tools', 50, true),
  ('wow-wowhead', 'world-of-warcraft', 'Wowhead', 'Database, guides, and news', 'https://www.wowhead.com', 'wiki', 'resources', 'Class and dungeon guides', 10, true),
  ('wow-icy-veins', 'world-of-warcraft', 'Icy Veins WoW', 'Class builds and season guides', 'https://www.icy-veins.com/wow/', 'builds', 'resources', 'Class and dungeon guides', 20, true),
  ('wow-raider-io', 'world-of-warcraft', 'Raider.IO', 'Mythic+ rankings and routes', 'https://raider.io', 'stats', 'resources', 'Class and dungeon guides', 30, true),
  ('wow-warcraft-logs', 'world-of-warcraft', 'Warcraft Logs', 'Raid and dungeon performance logs', 'https://www.warcraftlogs.com', 'stats', 'resources', 'Progression tracking', 40, true),
  ('wow-official-news', 'world-of-warcraft', 'Official News', 'Blizzard announcements and patch notes', 'https://worldofwarcraft.blizzard.com/news', 'patch-notes', 'resources', 'Progression tracking', 50, true),
  ('lol-ugg-builds', 'league-of-legends', 'U.GG Builds', 'Champion builds and matchup data', 'https://u.gg/lol/champions', 'builds', 'resources', 'Ranked prep', 10, true),
  ('lol-opgg-stats', 'league-of-legends', 'OP.GG', 'Ranked stats and match history', 'https://www.op.gg', 'stats', 'resources', 'Ranked prep', 20, true),
  ('lol-lolalytics', 'league-of-legends', 'LoLalytics', 'Champion statistics and tier lists', 'https://lolalytics.com', 'tier-list', 'resources', 'Ranked prep', 30, true),
  ('lol-mobalytics', 'league-of-legends', 'Mobalytics LoL', 'Builds, tier lists, and coaching tools', 'https://mobalytics.gg/lol', 'tools', 'resources', 'Meta and patch tools', 40, true),
  ('lol-official-patch-notes', 'league-of-legends', 'Official Patch Notes', 'Riot patch notes and season updates', 'https://www.leagueoflegends.com/news/tags/patch-notes', 'patch-notes', 'resources', 'Meta and patch tools', 50, true),
  ('last-epoch-maxroll', 'last-epoch', 'Maxroll Last Epoch', 'Leveling, endgame, and farming guides', 'https://maxroll.gg/last-epoch', 'builds', 'resources', 'Cycle prep', 10, true),
  ('last-epoch-icy-veins', 'last-epoch', 'Icy Veins Last Epoch', 'Build guides and class explainers', 'https://www.icy-veins.com/last-epoch/', 'builds', 'resources', 'Cycle prep', 20, true),
  ('last-epoch-tools', 'last-epoch', 'Last Epoch Tools', 'Database, planner, and item lookup', 'https://www.lastepochtools.com', 'tools', 'resources', 'Cycle prep', 30, true),
  ('last-epoch-official-forums', 'last-epoch', 'Official Forums', 'Patch notes and developer updates', 'https://forum.lastepoch.com', 'patch-notes', 'resources', 'Official and calculators', 40, true),
  ('last-epoch-tunklab', 'last-epoch', 'Tunklab', 'Community calculators and tools', 'https://lastepoch.tunklab.com', 'tools', 'resources', 'Official and calculators', 50, true),
  ('poe-official-news', 'path-of-exile', 'Official News', 'League announcements and patch notes', 'https://www.pathofexile.com/news', 'patch-notes', 'resources', 'League prep', 10, true),
  ('poe-maxroll', 'path-of-exile', 'Maxroll PoE', 'League starters and endgame builds', 'https://maxroll.gg/poe', 'builds', 'resources', 'League prep', 20, true),
  ('poe-wiki', 'path-of-exile', 'PoE Wiki', 'Community-maintained mechanics wiki', 'https://www.poewiki.net', 'wiki', 'resources', 'League prep', 30, true),
  ('poe-ninja', 'path-of-exile', 'poe.ninja', 'Economy, builds, and ladder data', 'https://poe.ninja', 'stats', 'resources', 'Economy and filters', 40, true),
  ('poe-filterblade', 'path-of-exile', 'FilterBlade', 'Loot filter editor and presets', 'https://www.filterblade.xyz', 'tools', 'resources', 'Economy and filters', 50, true)
on conflict (id) do update set
  game_id = excluded.game_id,
  title = excluded.title,
  label = excluded.label,
  url = excluded.url,
  icon = excluded.icon,
  section = excluded.section,
  group_title = excluded.group_title,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
