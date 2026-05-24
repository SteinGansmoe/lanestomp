grant insert, update on table public.games to authenticated;

alter table public.games enable row level security;

drop policy if exists "Authenticated users can create games" on public.games;

create policy "Authenticated users can create games"
on public.games
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update games" on public.games;

create policy "Authenticated users can update games"
on public.games
for update
to authenticated
using (true)
with check (true);
