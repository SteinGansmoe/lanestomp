create extension if not exists pgcrypto with schema extensions;

create table public.planning_boards (
  id uuid primary key default gen_random_uuid(),
  season_id text not null references public.seasons(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Season plan',
  notes text,
  created_at timestamptz not null default now(),

  constraint planning_boards_user_id_season_id_key unique (user_id, season_id)
);

create table public.planning_links (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.planning_boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.planning_checklist_items (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.planning_boards(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index planning_boards_user_id_idx on public.planning_boards(user_id);
create index planning_boards_season_id_idx on public.planning_boards(season_id);
create index planning_links_board_id_idx on public.planning_links(board_id);
create index planning_checklist_items_board_id_idx on public.planning_checklist_items(board_id);

grant select, insert, update, delete on table public.planning_boards to authenticated;
grant select, insert, update, delete on table public.planning_links to authenticated;
grant select, insert, update, delete on table public.planning_checklist_items to authenticated;

alter table public.planning_boards enable row level security;
alter table public.planning_links enable row level security;
alter table public.planning_checklist_items enable row level security;

create policy "Authenticated users can manage their planning boards"
on public.planning_boards
for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Authenticated users can manage their planning links"
on public.planning_links
for all
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.planning_boards
    where planning_boards.id = planning_links.board_id
      and planning_boards.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.planning_boards
    where planning_boards.id = planning_links.board_id
      and planning_boards.user_id = auth.uid()
  )
);

create policy "Authenticated users can manage their planning checklist items"
on public.planning_checklist_items
for all
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.planning_boards
    where planning_boards.id = planning_checklist_items.board_id
      and planning_boards.user_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.planning_boards
    where planning_boards.id = planning_checklist_items.board_id
      and planning_boards.user_id = auth.uid()
  )
);
