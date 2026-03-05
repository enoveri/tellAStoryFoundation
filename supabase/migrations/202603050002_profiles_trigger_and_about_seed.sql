-- Auto-create profiles from auth signup and seed About content defaults.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    'member'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

with seeded_page as (
  insert into public.about_page (hero_title, hero_subtitle)
  select
    'Creating Change Through Stories',
    'A non-profit using storytelling to inspire, heal, and transform communities everywhere.'
  where not exists (select 1 from public.about_page)
  returning id
), target_page as (
  select id from seeded_page
  union all
  select id from public.about_page limit 1
)
insert into public.about_pillars (about_page_id, title, body, sort_order)
select
  tp.id,
  x.title,
  x.body,
  x.sort_order
from target_page tp
cross join (
  values
    ('Our Mission', 'Tell A Story Foundation creates safe spaces where individuals share their lived experiences — turning personal journeys into community power.', 1),
    ('Community First', 'We believe every voice matters. Our platform connects storytellers across communities, fostering empathy, healing, and mutual support.', 2),
    ('Story as Tool', 'We use storytelling as a tool for advocacy, mental health, and social change — because stories shift hearts before systems do.', 3),
    ('Global Reach', 'Operating from Africa and reaching the world, we amplify voices that are rarely heard and celebrate the diversity of human experience.', 4)
) as x(title, body, sort_order)
where not exists (
  select 1 from public.about_pillars p where p.about_page_id = tp.id
);

with target_page as (
  select id from public.about_page limit 1
)
insert into public.about_team_members (about_page_id, name, role_title, avatar_url, sort_order)
select
  tp.id,
  x.name,
  x.role_title,
  x.avatar_url,
  x.sort_order
from target_page tp
cross join (
  values
    ('Amara Nwosu', 'Founder & Executive Director', 'https://i.pravatar.cc/150?img=47', 1),
    ('Kelvin Osei', 'Head of Community', 'https://i.pravatar.cc/150?img=12', 2),
    ('Maya Patel', 'Content & Blog Lead', 'https://i.pravatar.cc/150?img=32', 3)
) as x(name, role_title, avatar_url, sort_order)
where not exists (
  select 1 from public.about_team_members tm where tm.about_page_id = tp.id
);

with target_page as (
  select id from public.about_page limit 1
)
insert into public.about_gallery_assets (about_page_id, image_url, alt_text, sort_order)
select
  tp.id,
  x.image_url,
  x.alt_text,
  x.sort_order
from target_page tp
cross join (
  values
    ('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop', 'Community gathering', 1),
    ('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&h=300&fit=crop', 'Children reading', 2),
    ('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop', 'Workshop session', 3),
    ('https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop', 'Story circle', 4),
    ('https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&h=300&fit=crop', 'Outdoor event', 5),
    ('https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop', 'Safe space workshop', 6)
) as x(image_url, alt_text, sort_order)
where not exists (
  select 1 from public.about_gallery_assets g where g.about_page_id = tp.id
);

with target_page as (
  select id from public.about_page limit 1
)
insert into public.about_partners (about_page_id, name, kind, logo_url, sort_order)
select
  tp.id,
  x.name,
  x.kind,
  x.logo_url,
  x.sort_order
from target_page tp
cross join (
  values
    ('Ubuntu Education Fund', 'NGO Partner', 'https://i.pravatar.cc/80?img=1', 1),
    ('Africa Storytelling Lab', 'Creative Partner', 'https://i.pravatar.cc/80?img=2', 2),
    ('Youth Voices Initiative', 'Community Partner', 'https://i.pravatar.cc/80?img=3', 3),
    ('Healing Words Trust', 'Wellness Partner', 'https://i.pravatar.cc/80?img=4', 4)
) as x(name, kind, logo_url, sort_order)
where not exists (
  select 1 from public.about_partners p where p.about_page_id = tp.id
);

with target_page as (
  select id from public.about_page limit 1
)
insert into public.about_partnership_types (about_page_id, title, body, sort_order)
select
  tp.id,
  x.title,
  x.body,
  x.sort_order
from target_page tp
cross join (
  values
    ('NGO & Community', 'Co-host story circles, workshops, and safe-space events in your community.', 1),
    ('Corporate Sponsor', 'Fund programmes, sponsor events, and align your brand with human-centred storytelling.', 2),
    ('Academic Partner', 'Collaborate on research, curriculum, and storytelling-as-therapy programmes.', 3),
    ('Media & Content', 'Amplify our stories through your platforms and reach wider audiences together.', 4)
) as x(title, body, sort_order)
where not exists (
  select 1 from public.about_partnership_types pt where pt.about_page_id = tp.id
);
