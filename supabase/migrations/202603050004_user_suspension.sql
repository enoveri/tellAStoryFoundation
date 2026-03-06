-- Add suspension state to profiles for admin user management.

alter table public.profiles
  add column if not exists is_suspended boolean not null default false;

alter table public.profiles
  add column if not exists suspended_at timestamptz;

create index if not exists idx_profiles_is_suspended on public.profiles(is_suspended);
