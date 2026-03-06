-- Event applications with applicant details and admin visibility

create table if not exists public.event_applications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  organisation text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index if not exists idx_event_applications_event_id
  on public.event_applications(event_id);

create index if not exists idx_event_applications_user_id
  on public.event_applications(user_id);

alter table public.event_applications enable row level security;

create policy "event applications own or admin read" on public.event_applications
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "event applications own insert" on public.event_applications
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "event applications own or admin update" on public.event_applications
  for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "event applications own or admin delete" on public.event_applications
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_event_applications') then
    create trigger set_updated_at_event_applications
      before update on public.event_applications
      for each row
      execute function public.set_updated_at();
  end if;
end $$;
