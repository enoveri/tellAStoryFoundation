-- Add saved stories and comment likes.

create table if not exists public.saved_stories (
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);

create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

create index if not exists idx_saved_stories_user_id on public.saved_stories(user_id);
create index if not exists idx_comment_likes_comment_id on public.comment_likes(comment_id);

alter table public.saved_stories enable row level security;
alter table public.comment_likes enable row level security;

create policy "saved stories own read" on public.saved_stories
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "saved stories own insert" on public.saved_stories
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "saved stories own delete" on public.saved_stories
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "comment likes read" on public.comment_likes
  for select
  to authenticated
  using (true);

create policy "comment likes own insert" on public.comment_likes
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "comment likes own delete" on public.comment_likes
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());
