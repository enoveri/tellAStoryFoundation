-- Story tags for feed/detail and write flow.

create table if not exists public.story_tags (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  tag text not null,
  created_at timestamptz not null default now(),
  unique (story_id, tag)
);

create index if not exists idx_story_tags_story_id on public.story_tags(story_id);
create index if not exists idx_story_tags_tag on public.story_tags(tag);

alter table public.story_tags enable row level security;

create policy "story tags public read" on public.story_tags
  for select
  to anon, authenticated
  using (true);

create policy "story tags owner or admin insert" on public.story_tags
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.stories s
      where s.id = story_tags.story_id
        and (s.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "story tags owner or admin update" on public.story_tags
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.stories s
      where s.id = story_tags.story_id
        and (s.author_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1
      from public.stories s
      where s.id = story_tags.story_id
        and (s.author_id = auth.uid() or public.is_admin())
    )
  );

create policy "story tags owner or admin delete" on public.story_tags
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.stories s
      where s.id = story_tags.story_id
        and (s.author_id = auth.uid() or public.is_admin())
    )
  );
