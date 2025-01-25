-- Drop existing team policies
drop policy if exists "Admins can do everything on teams" on teams;
drop policy if exists "Users can view teams" on teams;

-- Create new policies with correct role access
-- Admins can do everything
create policy "Admins can do everything on teams"
	on teams
	as permissive
	for all
	to authenticated
	using ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
	with check ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

-- All authenticated users can view teams
create policy "Users can view teams"
	on teams
	for select
	to authenticated
	using (true);

-- Drop existing team members policies
drop policy if exists "Admins can manage team members" on team_members;
drop policy if exists "Users can view team members" on team_members;

-- Create new team members policies with correct role access
-- Admins can manage team members
create policy "Admins can manage team members"
	on team_members
	as permissive
	for all
	to authenticated
	using ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
	with check ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

-- Users can view team members
create policy "Users can view team members"
	on team_members
	for select
	to authenticated
	using (true);
