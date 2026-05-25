grant delete on table public.seasons to authenticated;

alter table public.seasons enable row level security;

drop policy if exists "Authenticated users can delete seasons" on public.seasons;

create policy "Authenticated users can delete seasons"
on public.seasons
for delete
to authenticated
using (true);
