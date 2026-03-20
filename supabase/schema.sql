-- ============================================================
-- Nation Card — Supabase Schema
-- Esegui questo script nel SQL Editor di Supabase
-- ============================================================

-- 1. Locali convenzionati
create table if not exists venues (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  category    text default 'Food & Drink',
  discount    text,
  address     text,
  lat         float,
  lng         float,
  image_url   text,
  cta_url     text,
  cta_label   text,
  created_at  timestamptz default now()
);

-- 2. Proposte locali dalla community
create table if not exists proposed_venues (
  id            uuid primary key default gen_random_uuid(),
  first_name    text,
  last_name     text,
  student_class text,
  category      text,
  venue_name    text,
  reason        text,
  created_at    timestamptz default now()
);

-- 3. Report adesioni tessere (dai rappresentanti di classe)
create table if not exists class_representative_reports (
  id               uuid primary key default gen_random_uuid(),
  first_name       text,
  last_name        text,
  student_class    text,
  adhesions_count  int default 0,
  notes            text,
  created_at       timestamptz default now()
);

-- ── Row Level Security (RLS) ──────────────────────────────────
-- Tutti possono leggere i locali (pubblico)
alter table venues enable row level security;
create policy "venues_public_read" on venues for select using (true);
create policy "venues_anon_insert" on venues for insert with check (true);
create policy "venues_anon_update" on venues for update using (true);
create policy "venues_anon_delete" on venues for delete using (true);

-- Proposed venues: chiunque può inserire e leggere
alter table proposed_venues enable row level security;
create policy "proposed_venues_public_read"   on proposed_venues for select using (true);
create policy "proposed_venues_public_insert" on proposed_venues for insert with check (true);
create policy "proposed_venues_anon_delete"   on proposed_venues for delete using (true);

-- Class rep reports: chiunque può inserire e leggere
alter table class_representative_reports enable row level security;
create policy "class_reports_public_read"   on class_representative_reports for select using (true);
create policy "class_reports_public_insert" on class_representative_reports for insert with check (true);
create policy "class_reports_anon_delete"   on class_representative_reports for delete using (true);

-- ── Indici utili ──────────────────────────────────────────────
create index if not exists idx_venues_category   on venues(category);
create index if not exists idx_venues_name       on venues(name);
create index if not exists idx_reports_class     on class_representative_reports(student_class);
create index if not exists idx_proposals_created on proposed_venues(created_at desc);
