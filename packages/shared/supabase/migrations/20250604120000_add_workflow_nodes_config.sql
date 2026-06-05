alter table public.workflow_nodes
  add column if not exists config jsonb not null default '{}'::jsonb;
