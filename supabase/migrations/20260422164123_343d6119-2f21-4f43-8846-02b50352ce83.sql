-- 1. Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins can view all roles"
on public.user_roles for select
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
on public.user_roles for all
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- 2. Shared timestamp trigger function
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 3. Menu categories
create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.menu_categories enable row level security;

create policy "Categories are viewable by everyone"
on public.menu_categories for select
using (true);

create policy "Admins can insert categories"
on public.menu_categories for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update categories"
on public.menu_categories for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete categories"
on public.menu_categories for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create trigger menu_categories_updated_at
before update on public.menu_categories
for each row execute function public.update_updated_at_column();

-- 4. Menu items
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.menu_categories(id) on delete cascade not null,
  name text not null,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index menu_items_category_idx on public.menu_items(category_id);

alter table public.menu_items enable row level security;

create policy "Items are viewable by everyone"
on public.menu_items for select
using (true);

create policy "Admins can insert items"
on public.menu_items for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update items"
on public.menu_items for update
to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete items"
on public.menu_items for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create trigger menu_items_updated_at
before update on public.menu_items
for each row execute function public.update_updated_at_column();

-- 5. Storage bucket for menu images
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true);

create policy "Menu images are publicly readable"
on storage.objects for select
using (bucket_id = 'menu-images');

create policy "Admins can upload menu images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'menu-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update menu images"
on storage.objects for update
to authenticated
using (bucket_id = 'menu-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete menu images"
on storage.objects for delete
to authenticated
using (bucket_id = 'menu-images' and public.has_role(auth.uid(), 'admin'));