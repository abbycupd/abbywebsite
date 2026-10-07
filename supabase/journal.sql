-- ============================================================================
-- Journal / Notes CMS schema for abbybrennan.co.uk
--
-- Paste this whole file into the Supabase SQL editor (Dashboard → SQL Editor
-- → New query) and run it once on a fresh project. It is safe to re-run
-- (everything uses IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS), so if
-- you tweak something and re-paste the whole file it won't duplicate objects.
--
-- After running this, see README.md → "Configure your admin account" for the
-- one manual step required to make your own login an administrator.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. journal_posts
-- ----------------------------------------------------------------------------

create table if not exists public.journal_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  slug text not null,
  excerpt text not null default '',
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  cover_image text,
  tags text[] not null default '{}',
  meta_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journal_posts_slug_not_blank check (char_length(trim(slug)) > 0)
);

-- Slugs must be unique across every post, draft or published.
create unique index if not exists journal_posts_slug_key on public.journal_posts (slug);

-- Public listing/detail queries filter on status and sort by published_at.
create index if not exists journal_posts_status_published_at_idx
  on public.journal_posts (status, published_at desc);

-- Keep updated_at accurate on every write, without the app having to set it.
create or replace function public.set_journal_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists journal_posts_set_updated_at on public.journal_posts;
create trigger journal_posts_set_updated_at
  before update on public.journal_posts
  for each row
  execute function public.set_journal_posts_updated_at();

-- ----------------------------------------------------------------------------
-- 2. profiles + admin allowlist
--
-- One row per auth user. `is_admin` is FALSE for everyone by default — the
-- only way to become an admin is the manual SQL step documented in the
-- README, run by you in the Supabase SQL editor (which connects as a
-- superuser and bypasses RLS). Nothing in the app itself can set this flag.
-- ----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Every new auth user automatically gets a (non-admin) profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Helper used by every RLS policy below. SECURITY DEFINER + a fixed
-- search_path so it can read `profiles` regardless of the caller's own
-- row-level permissions, without being tricked by a search_path attack.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ----------------------------------------------------------------------------
-- 3. Row Level Security
-- ----------------------------------------------------------------------------

alter table public.journal_posts enable row level security;
alter table public.profiles enable row level security;

-- journal_posts: anyone (including logged-out visitors) can read published
-- posts only. The admin can read everything, including drafts, so the admin
-- dashboard and the draft-preview screen work.
drop policy if exists "Public can read published posts" on public.journal_posts;
create policy "Public can read published posts"
  on public.journal_posts
  for select
  using (status = 'published');

drop policy if exists "Admin can read all posts" on public.journal_posts;
create policy "Admin can read all posts"
  on public.journal_posts
  for select
  using (public.is_admin());

drop policy if exists "Admin can insert posts" on public.journal_posts;
create policy "Admin can insert posts"
  on public.journal_posts
  for insert
  with check (public.is_admin());

drop policy if exists "Admin can update posts" on public.journal_posts;
create policy "Admin can update posts"
  on public.journal_posts
  for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admin can delete posts" on public.journal_posts;
create policy "Admin can delete posts"
  on public.journal_posts
  for delete
  using (public.is_admin());

-- profiles: everyone can read their own row (so the admin app can check
-- "am I the admin?"), nobody can read anyone else's, and nobody can write to
-- this table from the client at all — is_admin is only ever changed by you,
-- manually, in the SQL editor.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- ----------------------------------------------------------------------------
-- 4. Storage: cover images + inline article images
--
-- Creates a public bucket called "journal-images". Public = anyone can view
-- the images (necessary, since they're embedded in a public blog post), but
-- only the admin can upload, replace, or delete anything in it.
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('journal-images', 'journal-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view journal images" on storage.objects;
create policy "Public can view journal images"
  on storage.objects
  for select
  using (bucket_id = 'journal-images');

drop policy if exists "Admin can upload journal images" on storage.objects;
create policy "Admin can upload journal images"
  on storage.objects
  for insert
  with check (bucket_id = 'journal-images' and public.is_admin());

drop policy if exists "Admin can update journal images" on storage.objects;
create policy "Admin can update journal images"
  on storage.objects
  for update
  using (bucket_id = 'journal-images' and public.is_admin())
  with check (bucket_id = 'journal-images' and public.is_admin());

drop policy if exists "Admin can delete journal images" on storage.objects;
create policy "Admin can delete journal images"
  on storage.objects
  for delete
  using (bucket_id = 'journal-images' and public.is_admin());
