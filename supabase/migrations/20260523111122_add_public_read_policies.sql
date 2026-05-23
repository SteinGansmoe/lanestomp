grant usage on schema public to anon, authenticated;

grant select on table public.games to anon, authenticated;
grant select on table public.seasons to anon, authenticated;

alter table public.games enable row level security;

drop policy if exists "Allow public read access to games" on public.games;

create policy "Allow public read access to games"
on public.games
for select
to anon, authenticated
using (true);

alter table public.seasons enable row level security;

drop policy if exists "Allow public read access to seasons" on public.seasons;

create policy "Allow public read access to seasons"
on public.seasons
for select
to anon, authenticated
using (true);