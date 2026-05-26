grant usage on schema public to service_role;

grant select, insert, update, delete
on table public.league_champions
to service_role;