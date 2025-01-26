-- Drop existing policies
drop policy if exists "Agents can view all ticket history" on ticket_history;
drop policy if exists "Agents can create ticket history entries" on ticket_history;
drop policy if exists "Customers can view their ticket history" on ticket_history;

-- Create new policies that include both admins and agents
create policy "Staff can view all ticket history"
	on ticket_history
	for select
	to authenticated
	using (
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent') or
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
	);

create policy "Staff can create ticket history entries"
	on ticket_history
	for insert
	to authenticated
	with check (
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent') or
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
	);

-- Keep the customer policy unchanged but recreate it
create policy "Customers can view their ticket history"
	on ticket_history
	for select
	to authenticated
	using (
		not is_internal and
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'customer') and
		ticket_id in (
			select id from tickets where created_by = auth.uid()
		)
	);
