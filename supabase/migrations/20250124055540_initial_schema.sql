-- Migration: Initial schema setup for AutoCRM
-- Creates core tables: profiles and tickets
-- Establishes relationships and RLS policies
-- Note: auth.users table is automatically created by Supabase Auth

-- Create profiles table that extends auth.users
create table profiles (
	id uuid references auth.users on delete cascade primary key,
	email text not null,
	full_name text,
	role text not null default 'customer',
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
	updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
	
	constraint valid_role check (role in ('admin', 'agent', 'customer'))
);

-- Create tickets table
create table tickets (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	description text not null,
	status text not null default 'new',
	created_by uuid references profiles(id) not null,
	assigned_to uuid references profiles(id),
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
	updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
	
	constraint valid_status check (status in ('new', 'open', 'pending', 'resolved', 'closed'))
);

-- Enable RLS
alter table profiles enable row level security;
alter table tickets enable row level security;

-- Profiles policies
-- Admins can do everything
create policy "Admins can do everything on profiles"
	on profiles
	as permissive
	for all
	to authenticated
	using (auth.jwt() ->> 'role' = 'admin')
	with check (auth.jwt() ->> 'role' = 'admin');

-- Users can read all profiles
create policy "Users can view all profiles"
	on profiles
	for select
	to authenticated
	using (true);

-- Users can update their own profile
create policy "Users can update own profile"
	on profiles
	for update
	to authenticated
	using (auth.uid() = id)
	with check (auth.uid() = id);

-- Tickets policies
-- Admins full access
create policy "Admins can do everything on tickets"
	on tickets
	as permissive
	for all
	to authenticated
	using (auth.jwt() ->> 'role' = 'admin')
	with check (auth.jwt() ->> 'role' = 'admin');

-- Agents can view and update all tickets
create policy "Agents can view all tickets"
	on tickets
	for select
	to authenticated
	using (auth.jwt() ->> 'role' = 'agent');

create policy "Agents can update tickets"
	on tickets
	for update
	to authenticated
	using (auth.jwt() ->> 'role' = 'agent')
	with check (auth.jwt() ->> 'role' = 'agent');

-- Customers can view their own tickets
create policy "Customers can view own tickets"
	on tickets
	for select
	to authenticated
	using (auth.uid() = created_by and auth.jwt() ->> 'role' = 'customer');

-- Customers can create tickets
create policy "Customers can create tickets"
	on tickets
	for insert
	to authenticated
	with check (
		auth.uid() = created_by 
		and auth.jwt() ->> 'role' = 'customer'
		and assigned_to is null
	);

-- Create updated_at trigger function
create or replace function handle_updated_at()
returns trigger as $$
begin
	new.updated_at = timezone('utc'::text, now());
	return new;
end;
$$ language plpgsql;

-- Add updated_at triggers
create trigger handle_profiles_updated_at
	before update on profiles
	for each row
	execute function handle_updated_at();

create trigger handle_tickets_updated_at
	before update on tickets
	for each row
	execute function handle_updated_at();

-- Create function to handle new user creation
create or replace function public.handle_new_user_profile()
returns trigger as $$
begin
	insert into public.profiles (id, email, full_name, role)
	values (
		new.id,
		new.email,
		new.raw_user_meta_data->>'full_name',
		coalesce(new.raw_user_meta_data->>'role', 'customer')
	);
	return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_user_profile(); 