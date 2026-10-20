-- Server-only billing state. Clients must never directly grant entitlements.
-- Apply after migrations 0001–0003. A payment provider webhook is the sole
-- trusted author of subscription status; checkout requests may save only customer IDs.
create table if not exists public.billing_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null default 'free' check (plan in ('free', 'junior')),
  status text not null default 'none' check (status in ('none', 'incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused')),
  current_period_end timestamptz,
  updated_at timestamptz not null default now()
);
create table if not exists public.billing_events (
  event_id text primary key,
  processed_at timestamptz not null default now()
);
create index if not exists billing_accounts_customer_idx on public.billing_accounts(stripe_customer_id);
alter table public.billing_accounts enable row level security;
alter table public.billing_events enable row level security;
revoke all on public.billing_accounts from anon, authenticated;
revoke all on public.billing_events from anon, authenticated;
grant select, insert, update on public.billing_accounts to service_role;
grant select, insert on public.billing_events to service_role;
-- RLS has deliberately NO user-readable policies. Access through authenticated server routes only.
