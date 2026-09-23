-- GestorFlow GF-4: initial persistent schema and security baseline.
-- Demo data stays client-side; this schema is for authenticated persistent accounts.

-- Harden future objects in the exposed public schema.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke all on functions from public, anon, authenticated, service_role;

-- The dashboard's automatic-RLS option created this event-trigger helper.
-- Keep the event trigger working, but do not expose the SECURITY DEFINER
-- helper as a callable Data API RPC.
revoke all on function public.rls_auto_enable()
  from public, anon, authenticated, service_role;

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid()
    references auth.users(id) on delete cascade,
  name text not null,
  phone text not null default '',
  email text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint customers_name_length
    check (char_length(btrim(name)) between 2 and 100),
  constraint customers_phone_length
    check (char_length(phone) <= 30),
  constraint customers_email_length
    check (char_length(email) <= 320),
  constraint customers_notes_length
    check (char_length(notes) <= 500),
  constraint customers_id_owner_unique
    unique (id, owner_id)
);

create table public.work_orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid(),
  customer_id uuid not null,
  order_number bigint generated always as identity (start with 1001),
  order_code text generated always as ('OS-' || order_number::text) stored,
  title text not null,
  description text not null default '',
  value_cents bigint not null default 0,
  status text not null default 'new',
  service_date date not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint work_orders_customer_owner_fk
    foreign key (customer_id, owner_id)
    references public.customers(id, owner_id)
    on delete cascade,
  constraint work_orders_order_code_unique
    unique (order_code),
  constraint work_orders_title_length
    check (char_length(btrim(title)) between 1 and 120),
  constraint work_orders_description_length
    check (char_length(description) <= 1000),
  constraint work_orders_value_nonnegative
    check (value_cents >= 0),
  constraint work_orders_status_valid
    check (status in ('new', 'in_progress', 'waiting', 'completed')),
  constraint work_orders_notes_length
    check (char_length(notes) <= 1000)
);

-- Automatic RLS is enabled for public tables by the project-level event trigger.
-- Keep these explicit as defense-in-depth and as documentation in the migration.
alter table public.customers enable row level security;
alter table public.work_orders enable row level security;

-- Only signed-in users need Data API access in persistent mode.
revoke all on table public.customers from anon, authenticated;
revoke all on table public.work_orders from anon, authenticated;
revoke all on sequence public.work_orders_order_number_seq from anon, authenticated;

grant select, insert, update on table public.customers to authenticated;
grant select, insert, update on table public.work_orders to authenticated;
grant usage on sequence public.work_orders_order_number_seq to authenticated;

create policy customers_select_own
  on public.customers
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy customers_insert_own
  on public.customers
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy customers_update_own
  on public.customers
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy work_orders_select_own
  on public.work_orders
  for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy work_orders_insert_own
  on public.work_orders
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy work_orders_update_own
  on public.work_orders
  for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create index customers_owner_id_idx
  on public.customers(owner_id);

create index work_orders_owner_id_idx
  on public.work_orders(owner_id);

create index work_orders_customer_owner_idx
  on public.work_orders(customer_id, owner_id);

create index work_orders_owner_status_idx
  on public.work_orders(owner_id, status);

create index work_orders_owner_service_date_idx
  on public.work_orders(owner_id, service_date desc);

create or replace function public.gestorflow_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.gestorflow_set_updated_at()
  from public, anon, authenticated, service_role;

create trigger customers_set_updated_at
before update on public.customers
for each row
execute function public.gestorflow_set_updated_at();

create trigger work_orders_set_updated_at
before update on public.work_orders
for each row
execute function public.gestorflow_set_updated_at();

comment on table public.customers is
  'Persistent GestorFlow customers owned by authenticated users. Demo data remains client-side.';

comment on table public.work_orders is
  'Persistent GestorFlow work orders owned by authenticated users. value_cents stores BRL amounts as integer cents.';
