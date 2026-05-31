alter table public.profiles
  add column if not exists username text;

alter table public.profiles
  add column if not exists updated_at timestamptz not null default now();

update public.profiles
set
  username = 'user_' || left(replace(id::text, '-', ''), 12),
  updated_at = now()
where username is null;

alter table public.profiles
  alter column username set not null;

alter table public.profiles
  drop constraint if exists profiles_username_format_check;

alter table public.profiles
  add constraint profiles_username_format_check
  check (username ~ '^[A-Za-z0-9_]{3,24}$');

create unique index if not exists profiles_username_lower_unique
  on public.profiles (lower(username));

create or replace function public.set_profiles_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_profiles_updated_at();

grant update (username) on table public.profiles to authenticated;

drop policy if exists "Users can update own profile username" on public.profiles;

create policy "Users can update own profile username"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.is_username_available(
  candidate_username text,
  current_user_id uuid default null
)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select candidate_username ~ '^[A-Za-z0-9_]{3,24}$'
    and not exists (
      select 1
      from public.profiles
      where lower(username) = lower(candidate_username)
        and (current_user_id is null or id <> current_user_id)
    );
$$;

revoke all on function public.is_username_available(text, uuid) from public;
grant execute on function public.is_username_available(text, uuid) to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    case
      when (new.raw_user_meta_data ->> 'username') ~ '^[A-Za-z0-9_]{3,24}$'
        then new.raw_user_meta_data ->> 'username'
      else 'user_' || left(replace(new.id::text, '-', ''), 12)
    end
  )
  on conflict (id) do update
    set
      email = excluded.email,
      username = coalesce(public.profiles.username, excluded.username);

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

comment on column public.profiles.username is
  'SeasonTracker display username. Separate from Riot Game Name, tag, or region.';

comment on column public.profiles.updated_at is
  'Last profile update timestamp.';
