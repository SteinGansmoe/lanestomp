insert into public.games (id, name, slug, description, icon_url)
values
  (
    'diablo-4',
    'Diablo IV',
    'diablo-4',
    'Track seasonal resets, events, and endgame windows for Diablo IV.',
    '/images/d4-icon.jpg'
  ),
  (
    'world-of-warcraft',
    'World of Warcraft',
    'world-of-warcraft',
    'Track major seasonal windows for World of Warcraft.',
    '/images/WoW-icon.png'
  ),
  (
    'league-of-legends',
    'League of Legends',
    'league-of-legends',
    'Track ranked splits and season milestones for League of Legends.',
    '/images/lol-icon.png'
  ),
  (
    'last-epoch',
    'Last Epoch',
    'last-epoch',
    'Track cycle launches and end dates for Last Epoch.',
    '/images/le-icon3.png'
  ),
  (
    'path-of-exile',
    'Path of Exile',
    'path-of-exile',
    'Track challenge league launches and end dates for Path of Exile.',
    '/images/poe1-icon3.png'
  )
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  icon_url = excluded.icon_url;

insert into public.seasons (
  id,
  game_id,
  name,
  slug,
  starts_at,
  ends_at,
  description
)
values
  (
    'diablo-4-season-13',
    'diablo-4',
    'Season 13',
    'season-13',
    '2026-06-01T00:00:00Z',
    '2026-08-15T00:00:00Z',
    'Example Diablo IV season window.'
  ),
  (
    'diablo-4-season-14',
    'diablo-4',
    'Season 14',
    'season-14',
    '2026-08-16T00:00:00Z',
    '2026-11-01T00:00:00Z',
    'Example follow-up Diablo IV season window.'
  ),
  (
    'world-of-warcraft-season-4',
    'world-of-warcraft',
    'Season 4',
    'season-4',
    '2026-06-01T00:00:00Z',
    '2026-08-15T00:00:00Z',
    'Example World of Warcraft season window.'
  ),
  (
    'league-of-legends-season-16',
    'league-of-legends',
    'Season 16',
    'season-16',
    '2026-06-01T00:00:00Z',
    '2026-08-15T00:00:00Z',
    'Example League of Legends ranked split.'
  ),
  (
    'last-epoch-season-4',
    'last-epoch',
    'Season 4',
    'season-4',
    '2026-06-01T00:00:00Z',
    '2026-08-15T00:00:00Z',
    'Example Last Epoch cycle window.'
  ),
  (
    'path-of-exile-season-21',
    'path-of-exile',
    'Season 21',
    'season-21',
    '2026-06-01T00:00:00Z',
    '2026-08-15T00:00:00Z',
    'Example Path of Exile challenge league window.'
  )
on conflict (id) do update
set
  game_id = excluded.game_id,
  name = excluded.name,
  slug = excluded.slug,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  description = excluded.description;
