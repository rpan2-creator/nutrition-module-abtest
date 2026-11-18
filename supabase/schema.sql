-- Tables for the A/B study (self-explanation). Separate from the earlier study's tables.
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.

create table if not exists public.ab_participants (
  id uuid primary key,
  created_at timestamptz not null default now(),
  condition text not null check (condition in ('A', 'B')),
  test_order text not null check (test_order in ('AB', 'BA')),
  background text,
  consent boolean not null default false,
  user_agent text,
  pre_correct int,
  pre_total int,
  post_correct int,
  post_total int,
  pre_completed_at timestamptz,
  learn_completed_at timestamptz,
  post_completed_at timestamptz
);

create table if not exists public.ab_events (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  client_ts timestamptz,
  participant_id uuid not null references public.ab_participants(id) on delete cascade,
  condition text,
  phase text not null,
  screen text not null,
  event_type text not null,
  item_id text,
  kc text,
  response jsonb,
  correct boolean,
  attempt int,
  duration_ms int,
  meta jsonb
);

create index if not exists ab_events_participant_idx on public.ab_events (participant_id, client_ts);
create index if not exists ab_events_item_idx on public.ab_events (item_id);

-- Only the server (service role key) reads and writes. No public access.
alter table public.ab_participants enable row level security;
alter table public.ab_events enable row level security;
