grant insert, update on table public.seasons to authenticated;

create policy "Allow authenticated users to insert seasons"
on public.seasons
for insert
to authenticated
with check (true);

create policy "Allow authenticated users to update seasons"
on public.seasons
for update
to authenticated
using (true)
with check (true);

-- Temporary: authenticated users act as admins until public registration/roles are implemented.