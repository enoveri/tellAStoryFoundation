-- TellAStory initial schema for Supabase
-- Covers stories, blogs, events, about CMS, profiles, and admin boundaries.

create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'member', 'ngo');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.testimonial_status as enum ('pending', 'approved', 'rejected');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  role public.user_role not null default 'member',
  stories_public boolean not null default true,
  show_email boolean not null default false,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  summary text,
  body text not null,
  cover_image_url text,
  status public.content_status not null default 'published',
  like_count integer not null default 0,
  comment_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.story_likes (
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete restrict,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete restrict,
  title text not null,
  slug text not null unique,
  excerpt text,
  markdown_content text not null,
  cover_image_url text,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  event_location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  cover_image_url text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_rsvps (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create table if not exists public.about_page (
  id uuid primary key default gen_random_uuid(),
  hero_title text not null,
  hero_subtitle text not null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_pillars (
  id uuid primary key default gen_random_uuid(),
  about_page_id uuid not null references public.about_page(id) on delete cascade,
  title text not null,
  body text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_team_members (
  id uuid primary key default gen_random_uuid(),
  about_page_id uuid not null references public.about_page(id) on delete cascade,
  name text not null,
  role_title text not null,
  avatar_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_gallery_assets (
  id uuid primary key default gen_random_uuid(),
  about_page_id uuid not null references public.about_page(id) on delete cascade,
  image_url text not null,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_partners (
  id uuid primary key default gen_random_uuid(),
  about_page_id uuid not null references public.about_page(id) on delete cascade,
  name text not null,
  kind text,
  logo_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_partnership_types (
  id uuid primary key default gen_random_uuid(),
  about_page_id uuid not null references public.about_page(id) on delete cascade,
  title text not null,
  body text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  body text not null,
  avatar_url text,
  status public.testimonial_status not null default 'approved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_stories_author_id on public.stories(author_id);
create index if not exists idx_stories_created_at on public.stories(created_at desc);
create index if not exists idx_stories_status on public.stories(status);

create index if not exists idx_comments_story_id on public.comments(story_id);
create index if not exists idx_comments_parent_id on public.comments(parent_id);
create index if not exists idx_comments_created_at on public.comments(created_at desc);

create index if not exists idx_blog_posts_slug on public.blog_posts(slug);
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_events_starts_at on public.events(starts_at asc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_profiles') then
    create trigger set_updated_at_profiles before update on public.profiles for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_stories') then
    create trigger set_updated_at_stories before update on public.stories for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_comments') then
    create trigger set_updated_at_comments before update on public.comments for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_blog_posts') then
    create trigger set_updated_at_blog_posts before update on public.blog_posts for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_events') then
    create trigger set_updated_at_events before update on public.events for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_about_page') then
    create trigger set_updated_at_about_page before update on public.about_page for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_about_pillars') then
    create trigger set_updated_at_about_pillars before update on public.about_pillars for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_about_team_members') then
    create trigger set_updated_at_about_team_members before update on public.about_team_members for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_about_gallery_assets') then
    create trigger set_updated_at_about_gallery_assets before update on public.about_gallery_assets for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_about_partners') then
    create trigger set_updated_at_about_partners before update on public.about_partners for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_about_partnership_types') then
    create trigger set_updated_at_about_partnership_types before update on public.about_partnership_types for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_updated_at_testimonials') then
    create trigger set_updated_at_testimonials before update on public.testimonials for each row execute function public.set_updated_at();
  end if;
end $$;

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.story_likes enable row level security;
alter table public.comments enable row level security;
alter table public.blog_posts enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.about_page enable row level security;
alter table public.about_pillars enable row level security;
alter table public.about_team_members enable row level security;
alter table public.about_gallery_assets enable row level security;
alter table public.about_partners enable row level security;
alter table public.about_partnership_types enable row level security;
alter table public.testimonials enable row level security;

-- profiles policies
create policy "profiles public read" on public.profiles
  for select
  to authenticated
  using (true);

create policy "profiles own insert" on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles own update" on public.profiles
  for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- stories policies
create policy "stories public read published" on public.stories
  for select
  to anon, authenticated
  using (status = 'published' or public.is_admin() or author_id = auth.uid());

create policy "stories authenticated insert" on public.stories
  for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "stories owner or admin update" on public.stories
  for update
  to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

create policy "stories owner or admin delete" on public.stories
  for delete
  to authenticated
  using (author_id = auth.uid() or public.is_admin());

-- story likes policies
create policy "story likes read" on public.story_likes
  for select
  to authenticated
  using (true);

create policy "story likes own insert" on public.story_likes
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "story likes own delete" on public.story_likes
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- comments policies
create policy "comments public read" on public.comments
  for select
  to anon, authenticated
  using (true);

create policy "comments own insert" on public.comments
  for insert
  to authenticated
  with check (author_id = auth.uid());

create policy "comments owner or admin update" on public.comments
  for update
  to authenticated
  using (author_id = auth.uid() or public.is_admin())
  with check (author_id = auth.uid() or public.is_admin());

create policy "comments owner or admin delete" on public.comments
  for delete
  to authenticated
  using (author_id = auth.uid() or public.is_admin());

-- blog policies
create policy "blog public read published" on public.blog_posts
  for select
  to anon, authenticated
  using (status = 'published' or public.is_admin());

create policy "blog admin insert" on public.blog_posts
  for insert
  to authenticated
  with check (public.is_admin());

create policy "blog admin update" on public.blog_posts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "blog admin delete" on public.blog_posts
  for delete
  to authenticated
  using (public.is_admin());

-- events policies
create policy "events public read" on public.events
  for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

create policy "events admin write" on public.events
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- event rsvp policies
create policy "event rsvps own or admin read" on public.event_rsvps
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "event rsvps own insert" on public.event_rsvps
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "event rsvps own delete" on public.event_rsvps
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- about cms policies
create policy "about page public read" on public.about_page
  for select
  to anon, authenticated
  using (true);

create policy "about page admin write" on public.about_page
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "about pillars public read" on public.about_pillars
  for select
  to anon, authenticated
  using (true);

create policy "about pillars admin write" on public.about_pillars
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "about team public read" on public.about_team_members
  for select
  to anon, authenticated
  using (true);

create policy "about team admin write" on public.about_team_members
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "about gallery public read" on public.about_gallery_assets
  for select
  to anon, authenticated
  using (true);

create policy "about gallery admin write" on public.about_gallery_assets
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "about partners public read" on public.about_partners
  for select
  to anon, authenticated
  using (true);

create policy "about partners admin write" on public.about_partners
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "about partnership types public read" on public.about_partnership_types
  for select
  to anon, authenticated
  using (true);

create policy "about partnership types admin write" on public.about_partnership_types
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- testimonials policies
create policy "testimonials public read approved" on public.testimonials
  for select
  to anon, authenticated
  using (status = 'approved' or public.is_admin());

create policy "testimonials admin write" on public.testimonials
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- storage buckets
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('story-media', 'story-media', true),
  ('blog-covers', 'blog-covers', true),
  ('about-media', 'about-media', true)
on conflict (id) do nothing;

create policy "public read avatars" on storage.objects
  for select to public
  using (bucket_id = 'avatars');

create policy "public read story-media" on storage.objects
  for select to public
  using (bucket_id = 'story-media');

create policy "public read blog-covers" on storage.objects
  for select to public
  using (bucket_id = 'blog-covers');

create policy "public read about-media" on storage.objects
  for select to public
  using (bucket_id = 'about-media');

create policy "authenticated upload avatars" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "authenticated update own avatars" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "authenticated delete own avatars" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "authenticated upload story-media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'story-media');

create policy "story-media owner-or-admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'story-media' and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()))
  with check (bucket_id = 'story-media' and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()));

create policy "story-media owner-or-admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'story-media' and (auth.uid()::text = (storage.foldername(name))[1] or public.is_admin()));

create policy "blog-covers admin upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'blog-covers' and public.is_admin());

create policy "blog-covers admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'blog-covers' and public.is_admin())
  with check (bucket_id = 'blog-covers' and public.is_admin());

create policy "blog-covers admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'blog-covers' and public.is_admin());

create policy "about-media admin upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'about-media' and public.is_admin());

create policy "about-media admin update" on storage.objects
  for update to authenticated
  using (bucket_id = 'about-media' and public.is_admin())
  with check (bucket_id = 'about-media' and public.is_admin());

create policy "about-media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'about-media' and public.is_admin());
