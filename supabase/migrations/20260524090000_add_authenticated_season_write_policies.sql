grant insert, update on table public.seasons to authenticated;

alter table public.seasons enable row level security;

drop policy if exists "Authenticated users can create seasons" on public.seasons;

create policy "Authenticated users can create seasons"
on public.seasons
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update seasons" on public.seasons;

create policy "Authenticated users can update seasons"
on public.seasons
for update
to authenticated
using (true)
with check (true);
