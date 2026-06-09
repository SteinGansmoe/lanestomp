create or replace function public.sync_profile_email_on_auth_user_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles
    set email = new.email
    where id = new.id;
  end if;

  return new;
end;
$$;

revoke all on function public.sync_profile_email_on_auth_user_update() from public;

drop trigger if exists on_auth_user_email_updated on auth.users;

create trigger on_auth_user_email_updated
after update of email on auth.users
for each row execute function public.sync_profile_email_on_auth_user_update();

comment on function public.sync_profile_email_on_auth_user_update() is
  'Keeps public.profiles.email in sync after a verified Supabase Auth email change.';
