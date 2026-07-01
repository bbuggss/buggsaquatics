-- ============================================================
-- BUGGSAQUATICS — Supabase schema
-- Run this whole file once in your Supabase project's SQL editor:
-- Project → SQL Editor → New query → paste this → Run
-- ============================================================

-- ---- 1. Profiles ---------------------------------------------
-- One row per user, created automatically when someone signs up.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  bio text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new user signs up.
-- Pulls the username from the signup form (see auth.js: options.data.username).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---- 2. Forum categories ---------------------------------------
create table if not exists public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order int not null default 0
);

alter table public.forum_categories enable row level security;

create policy "Categories are publicly readable"
  on public.forum_categories for select
  using (true);

-- ---- 3. Forum threads --------------------------------------------
create table if not exists public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.forum_categories (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now()
);

alter table public.forum_threads enable row level security;

create policy "Threads are publicly readable"
  on public.forum_threads for select
  using (true);

create policy "Signed-in users can create threads"
  on public.forum_threads for insert
  with check (auth.uid() = author_id);

create policy "Authors can delete their own threads"
  on public.forum_threads for delete
  using (auth.uid() = author_id);

-- ---- 4. Forum posts (replies, including the thread's first post) --
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.forum_posts enable row level security;

create policy "Posts are publicly readable"
  on public.forum_posts for select
  using (true);

create policy "Signed-in users can post"
  on public.forum_posts for insert
  with check (auth.uid() = author_id);

create policy "Authors can delete their own posts"
  on public.forum_posts for delete
  using (auth.uid() = author_id);

-- ---- 5. Seed starter categories ------------------------------------
insert into public.forum_categories (slug, name, description, sort_order) values
  ('general',     'General Discussion',        'Anything nano-tank related that does not fit elsewhere.', 1),
  ('builds',      'Nano Tank Builds',           'Share your setup — substrate, hardscape, stocking, the works.', 2),
  ('shrimp',      'Shrimp Keeping',             'Neocaridina, caridina, breeding, and troubleshooting.', 3),
  ('plants',      'Plants & Aquascaping',       'Carpeting, epiphytes, CO2, and layout questions.', 4),
  ('fish',        'Fish & Stocking',            'Species choices, schooling numbers, compatibility.', 5),
  ('equipment',   'Equipment & DIY',            'Filters, heaters, lighting, and home-built solutions.', 6)
on conflict (slug) do nothing;
