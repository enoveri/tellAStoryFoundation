-- Support multiple images per story with ordering and RLS policies.

create table if not exists public.story_images (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_story_images_story_id on public.story_images(story_id);
create index if not exists idx_story_images_story_sort_order on public.story_images(story_id, sort_order);

alter table public.story_images enable row level security;

create policy "story images read published" on public.story_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.stories s
      where s.id = story_images.story_id
        and (
          s.status = 'published'
          or s.author_id = auth.uid()
          or public.is_admin()
        )
    )
  );

create policy "story images owner or admin insert" on public.story_images
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.stories s
      where s.id = story_images.story_id
        and (s.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "story images owner or admin update" on public.story_images
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.stories s
      where s.id = story_images.story_id
        and (s.author_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1
      from public.stories s
      where s.id = story_images.story_id
        and (s.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "story images owner or admin delete" on public.story_images
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.stories s
      where s.id = story_images.story_id
        and (s.author_id = auth.uid() or public.is_admin())
    )
  );
