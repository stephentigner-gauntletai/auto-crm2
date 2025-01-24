-- Add priority field to tickets
alter table tickets add column priority text not null default 'medium';

-- Add priority constraint
alter table tickets add constraint valid_priority 
	check (priority in ('low', 'medium', 'high'));
