-- Product Catalog Hierarchy
-- Category → Sub-category → Vertical

-- =========================================================
-- 1. SUB-CATEGORIES
-- =========================================================

create table if not exists public.sub_categories (
  id uuid not null default gen_random_uuid(),
  category_id uuid not null,
  name text not null,
  slug text not null,
  created_at timestamp with time zone not null default now(),

  constraint sub_categories_pkey primary key (id),

  constraint sub_categories_category_id_fkey
    foreign key (category_id)
    references public.categories (id)
    on delete cascade,

  constraint sub_categories_category_name_key
    unique (category_id, name),

  constraint sub_categories_category_slug_key
    unique (category_id, slug)
);

create index if not exists idx_sub_categories_category
  on public.sub_categories using btree (category_id);


-- =========================================================
-- 2. VERTICALS
-- =========================================================

create table if not exists public.verticals (
  id uuid not null default gen_random_uuid(),
  sub_category_id uuid not null,
  name text not null,
  slug text not null,
  created_at timestamp with time zone not null default now(),

  constraint verticals_pkey primary key (id),

  constraint verticals_sub_category_id_fkey
    foreign key (sub_category_id)
    references public.sub_categories (id)
    on delete cascade,

  constraint verticals_sub_category_name_key
    unique (sub_category_id, name),

  constraint verticals_sub_category_slug_key
    unique (sub_category_id, slug)
);

create index if not exists idx_verticals_sub_category
  on public.verticals using btree (sub_category_id);


-- =========================================================
-- 3. ADD HIERARCHY REFERENCES TO PRODUCTS
-- =========================================================

alter table public.products
  add column if not exists sub_category_id uuid null;

alter table public.products
  add column if not exists vertical_id uuid null;


alter table public.products
  add constraint products_sub_category_id_fkey
    foreign key (sub_category_id)
    references public.sub_categories (id)
    on delete set null;


alter table public.products
  add constraint products_vertical_id_fkey
    foreign key (vertical_id)
    references public.verticals (id)
    on delete set null;


create index if not exists idx_products_sub_category
  on public.products using btree (sub_category_id);

create index if not exists idx_products_vertical
  on public.products using btree (vertical_id);


-- =========================================================
-- 4. ENABLE RLS ON NEW TABLES
-- =========================================================

alter table public.sub_categories enable row level security;
alter table public.verticals enable row level security;


-- =========================================================
-- 5. PUBLIC READ ACCESS
-- =========================================================

create policy "Anyone can view sub_categories"
on public.sub_categories
for select
to anon, authenticated
using (true);


create policy "Anyone can view verticals"
on public.verticals
for select
to anon, authenticated
using (true);

-- =========================================================
-- 6. ADMIN WRITE ACCESS
-- =========================================================

create policy "Admins can insert sub_categories"
on public.sub_categories
for insert
to authenticated
with check (
  (auth.jwt() ->> 'email') = any (
    array[
      'akhildevshali@gmail.com',
      'hemant2182@gmail.com'
    ]
  )
);

create policy "Admins can update sub_categories"
on public.sub_categories
for update
to authenticated
using (
  (auth.jwt() ->> 'email') = any (
    array[
      'akhildevshali@gmail.com',
      'hemant2182@gmail.com'
    ]
  )
)
with check (
  (auth.jwt() ->> 'email') = any (
    array[
      'akhildevshali@gmail.com',
      'hemant2182@gmail.com'
    ]
  )
);

create policy "Admins can delete sub_categories"
on public.sub_categories
for delete
to authenticated
using (
  (auth.jwt() ->> 'email') = any (
    array[
      'akhildevshali@gmail.com',
      'hemant2182@gmail.com'
    ]
  )
);


create policy "Admins can insert verticals"
on public.verticals
for insert
to authenticated
with check (
  (auth.jwt() ->> 'email') = any (
    array[
      'akhildevshali@gmail.com',
      'hemant2182@gmail.com'
    ]
  )
);

create policy "Admins can update verticals"
on public.verticals
for update
to authenticated
using (
  (auth.jwt() ->> 'email') = any (
    array[
      'akhildevshali@gmail.com',
      'hemant2182@gmail.com'
    ]
  )
)
with check (
  (auth.jwt() ->> 'email') = any (
    array[
      'akhildevshali@gmail.com',
      'hemant2182@gmail.com'
    ]
  )
);

create policy "Admins can delete verticals"
on public.verticals
for delete
to authenticated
using (
  (auth.jwt() ->> 'email') = any (
    array[
      'akhildevshali@gmail.com',
      'hemant2182@gmail.com'
    ]
  )
);