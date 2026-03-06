-- Promote known owner emails to admin and keep them admin on first signup.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_role public.user_role := 'member';
begin
  if lower(coalesce(new.email, '')) in (
    'enov3ri@gmail.com',
    'mutaawe38@gmail.com'
  ) then
    next_role := 'admin';
  end if;

  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    next_role
  )
  on conflict (id) do update
    set role = excluded.role;

  return new;
end;
$$;

update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and lower(coalesce(u.email, '')) in (
    'enov3ri@gmail.com',
    'mutaawe38@gmail.com'
  );
