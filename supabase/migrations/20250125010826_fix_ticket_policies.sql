-- Drop existing ticket policies
drop policy if exists "Admins can do everything on tickets" on tickets;
drop policy if exists "Agents can view assigned and team tickets" on tickets;
drop policy if exists "Agents can update assigned and team tickets" on tickets;
drop policy if exists "Agents can create tickets" on tickets;
drop policy if exists "Customers can view own tickets" on tickets;
drop policy if exists "Customers can create tickets" on tickets;

-- Create new policies
-- Admins full access
create policy "Admins can do everything on tickets"
	on tickets
	as permissive
	for all
	to authenticated
	using ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
	with check ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin');

-- Agents can view tickets they are assigned to or that belong to their teams
create policy "Agents can view assigned and team tickets"
	on tickets
	for select
	to authenticated
	using (
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent') and (
			assigned_to = auth.uid() or
			team_id in (
				select team_id 
				from team_members 
				where user_id = auth.uid()
			)
		)
	);

-- Agents can update tickets they are assigned to or that belong to their teams
create policy "Agents can update assigned and team tickets"
	on tickets
	for update
	to authenticated
	using (
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent') and (
			assigned_to = auth.uid() or
			team_id in (
				select team_id 
				from team_members 
				where user_id = auth.uid()
			)
		)
	)
	with check (
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent') and (
			assigned_to = auth.uid() or
			team_id in (
				select team_id 
				from team_members 
				where user_id = auth.uid()
			)
		)
	);

-- Agents can create tickets
create policy "Agents can create tickets"
	on tickets
	for insert
	to authenticated
	with check ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent');

-- Customers can view their own tickets
create policy "Customers can view own tickets"
	on tickets
	for select
	to authenticated
	using (
		auth.uid() = created_by and 
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'customer')
	);

-- Customers can create tickets
create policy "Customers can create tickets"
	on tickets
	for insert
	to authenticated
	with check (
		auth.uid() = created_by and 
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'customer') and
		assigned_to is null
	);
