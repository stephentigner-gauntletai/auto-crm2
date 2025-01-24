-- Create teams and team memberships tables
-- Teams can have multiple members, and users can be in multiple teams
-- Teams are managed by admins and can be assigned to tickets

-- Create teams table
create table teams (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	description text,
	created_by uuid references profiles(id) not null,
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
	updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create team_members junction table
create table team_members (
	team_id uuid references teams(id) on delete cascade not null,
	user_id uuid references profiles(id) on delete cascade not null,
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
	primary key (team_id, user_id)
);

-- Enable RLS
alter table teams enable row level security;
alter table team_members enable row level security;

-- Teams policies
-- Admins can do everything
create policy "Admins can do everything on teams"
	on teams
	as permissive
	for all
	to authenticated
	using (auth.jwt() ->> 'role' = 'admin')
	with check (auth.jwt() ->> 'role' = 'admin');

-- All authenticated users can view teams
create policy "Users can view teams"
	on teams
	for select
	to authenticated
	using (true);

-- Team members policies
-- Admins can manage team members
create policy "Admins can manage team members"
	on team_members
	as permissive
	for all
	to authenticated
	using (auth.jwt() ->> 'role' = 'admin')
	with check (auth.jwt() ->> 'role' = 'admin');

-- Users can view team members
create policy "Users can view team members"
	on team_members
	for select
	to authenticated
	using (true);

-- Add updated_at trigger to teams table
create trigger handle_teams_updated_at
	before update on teams
	for each row
	execute function handle_updated_at(); 