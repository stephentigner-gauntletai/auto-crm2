-- Create an enum for ticket history entry types
create type ticket_history_type as enum ('comment', 'status_change', 'assignment_change', 'team_change', 'priority_change', 'edit');

-- Create ticket history table
create table ticket_history (
	id uuid primary key default gen_random_uuid(),
	ticket_id uuid references tickets(id) not null,
	user_id uuid references profiles(id) not null,
	type ticket_history_type not null,
	content text,
	old_value text,
	new_value text,
	is_internal boolean default false,
	created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table ticket_history enable row level security;

-- Admins can do everything
create policy "Admins can do everything on ticket_history"
	on ticket_history
	as permissive
	for all
	to authenticated
	using (auth.jwt() ->> 'role' = 'admin')
	with check (auth.jwt() ->> 'role' = 'admin');

-- Agents can view all ticket history
create policy "Agents can view all ticket history"
	on ticket_history
	for select
	to authenticated
	using ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent');

-- Agents can create ticket history entries
create policy "Agents can create ticket history entries"
	on ticket_history
	for insert
	to authenticated
	with check ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'agent');

-- Customers can view non-internal ticket history for their own tickets
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

-- Create function to automatically add history entries when tickets are updated
create or replace function handle_ticket_update()
returns trigger as $$
declare
	history_type ticket_history_type;
	old_value text;
	new_value text;
begin
	-- Determine the type of change
	if OLD.status != NEW.status then
		history_type := 'status_change'::ticket_history_type;
		old_value := OLD.status;
		new_value := NEW.status;
	elsif OLD.assigned_to is distinct from NEW.assigned_to then
		history_type := 'assignment_change'::ticket_history_type;
		old_value := (select email from profiles where id = OLD.assigned_to);
		new_value := (select email from profiles where id = NEW.assigned_to);
	elsif OLD.team_id is distinct from NEW.team_id then
		history_type := 'team_change'::ticket_history_type;
		old_value := (select name from teams where id = OLD.team_id);
		new_value := (select name from teams where id = NEW.team_id);
	elsif OLD.priority != NEW.priority then
		history_type := 'priority_change'::ticket_history_type;
		old_value := OLD.priority;
		new_value := NEW.priority;
	else
		history_type := 'edit'::ticket_history_type;
		-- For general edits, we don't track old/new values
	end if;

	-- Insert history entry
	insert into ticket_history (
		ticket_id,
		user_id,
		type,
		old_value,
		new_value,
		is_internal
	)
	values (
		NEW.id,
		auth.uid(),
		history_type,
		old_value,
		new_value,
		false
	);

	return NEW;
end;
$$ language plpgsql security definer;

-- Create trigger for ticket updates
create trigger on_ticket_update
	after update on tickets
	for each row
	execute function handle_ticket_update();
