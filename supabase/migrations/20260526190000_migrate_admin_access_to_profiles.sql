drop policy if exists "Allow authenticated users to insert seasons" on public.seasons;
drop policy if exists "Allow authenticated users to update seasons" on public.seasons;
drop policy if exists "Authenticated users can create seasons" on public.seasons;
drop policy if exists "Authenticated users can update seasons" on public.seasons;
drop policy if exists "Authenticated users can delete seasons" on public.seasons;

create policy "Admins can create seasons"
on public.seasons
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy "Admins can update seasons"
on public.seasons
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "Admins can delete seasons"
on public.seasons
for delete
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists "Authenticated users can create games" on public.games;
drop policy if exists "Authenticated users can update games" on public.games;

create policy "Admins can create games"
on public.games
for insert
to authenticated
with check (public.is_admin(auth.uid()));

create policy "Admins can update games"
on public.games
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Authenticated users can manage game resources" on public.game_resources;

create policy "Admins can manage game resources"
on public.game_resources
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists "Authenticated users can manage timeline events" on public.timeline_events;

create policy "Admins can manage timeline events"
on public.timeline_events
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
