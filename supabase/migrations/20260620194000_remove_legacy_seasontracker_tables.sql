do $$
declare
  legacy_table text;
  legacy_tables text[] := array[
    'planning_checklist_items',
    'planning_links',
    'planning_boards',
    'timeline_events',
    'game_resources',
    'seasons',
    'games'
  ];
  legacy_count bigint;
begin
  foreach legacy_table in array legacy_tables loop
    if to_regclass(format('public.%I', legacy_table)) is not null then
      execute format('select count(*) from public.%I', legacy_table) into legacy_count;
      raise notice 'Legacy SeasonTracker table %.% contains % rows before drop.',
        'public',
        legacy_table,
        legacy_count;
    end if;
  end loop;
end $$;

do $$
begin
  if to_regclass('public.planning_checklist_items') is not null then
    drop policy if exists "Authenticated users can manage their planning checklist items"
      on public.planning_checklist_items;
  end if;

  if to_regclass('public.planning_links') is not null then
    drop policy if exists "Authenticated users can manage their planning links"
      on public.planning_links;
  end if;

  if to_regclass('public.planning_boards') is not null then
    drop policy if exists "Authenticated users can manage their planning boards"
      on public.planning_boards;
  end if;

  if to_regclass('public.timeline_events') is not null then
    drop policy if exists "Allow public read access to timeline events"
      on public.timeline_events;
    drop policy if exists "Authenticated users can manage timeline events"
      on public.timeline_events;
    drop policy if exists "Admins can manage timeline events"
      on public.timeline_events;
  end if;

  if to_regclass('public.game_resources') is not null then
    drop policy if exists "Allow public read access to active game resources"
      on public.game_resources;
    drop policy if exists "Authenticated users can manage game resources"
      on public.game_resources;
    drop policy if exists "Admins can manage game resources"
      on public.game_resources;
  end if;

  if to_regclass('public.seasons') is not null then
    drop policy if exists "Seasons are publicly readable"
      on public.seasons;
    drop policy if exists "Allow public read access to seasons"
      on public.seasons;
    drop policy if exists "Allow authenticated users to insert seasons"
      on public.seasons;
    drop policy if exists "Allow authenticated users to update seasons"
      on public.seasons;
    drop policy if exists "Authenticated users can create seasons"
      on public.seasons;
    drop policy if exists "Authenticated users can update seasons"
      on public.seasons;
    drop policy if exists "Authenticated users can delete seasons"
      on public.seasons;
    drop policy if exists "Admins can create seasons"
      on public.seasons;
    drop policy if exists "Admins can update seasons"
      on public.seasons;
    drop policy if exists "Admins can delete seasons"
      on public.seasons;
  end if;

  if to_regclass('public.games') is not null then
    drop policy if exists "Games are publicly readable"
      on public.games;
    drop policy if exists "Allow public read access to games"
      on public.games;
    drop policy if exists "Authenticated users can create games"
      on public.games;
    drop policy if exists "Authenticated users can update games"
      on public.games;
    drop policy if exists "Admins can create games"
      on public.games;
    drop policy if exists "Admins can update games"
      on public.games;
  end if;
end $$;

drop table if exists public.planning_checklist_items;
drop table if exists public.planning_links;
drop table if exists public.planning_boards;
drop table if exists public.timeline_events;
drop table if exists public.game_resources;
drop table if exists public.seasons;
drop table if exists public.games;
