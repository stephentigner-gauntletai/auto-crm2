-- Drop existing status constraint
alter table tickets drop constraint valid_status;

-- Add new fields
alter table tickets 
	add column team_id uuid references teams(id),
	add column internal_notes text;

-- Update status constraint with new values
alter table tickets 
	add constraint valid_status 
	check (status in ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed')); 