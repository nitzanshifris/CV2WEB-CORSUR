-- Create sites table
create table if not exists public.sites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  domain text not null unique,
  theme text not null,
  content jsonb not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.sites enable row level security;

-- Create policies
create policy "Users can view their own sites"
  on public.sites for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sites"
  on public.sites for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own sites"
  on public.sites for update
  using (auth.uid() = user_id);

create policy "Users can delete their own sites"
  on public.sites for delete
  using (auth.uid() = user_id);

-- Create indexes
create index sites_user_id_idx on public.sites(user_id);
create index sites_domain_idx on public.sites(domain);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger to update updated_at
create trigger handle_sites_updated_at
  before update on public.sites
  for each row
  execute function public.handle_updated_at(); 