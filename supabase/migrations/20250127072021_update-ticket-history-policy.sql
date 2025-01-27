-- Drop the existing policy
drop policy if exists "Agents can create ticket history entries" on ticket_history;

-- Create new policy that allows both agents and customers to create ticket history entries
create policy "Users can create ticket history entries"
	on ticket_history
	for insert
	to authenticated
	with check (
		-- Agents can create any ticket history entry
		((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent') or
		-- Customers can only create non-internal comments on their own tickets
		(
			((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'customer') and
			not is_internal and
			type = 'comment' and
			ticket_id in (
				select id from tickets where created_by = auth.uid()
			)
		)
	);
