-- Create enum for feedback types
create type feedback_type as enum ('general', 'feature_request', 'bug_report', 'support_experience');

-- Create feedback table
create table feedback (
	id uuid primary key default gen_random_uuid(),
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
	updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
	user_id uuid references auth.users(id) on delete cascade not null,
	type feedback_type not null,
	title text not null,
	description text not null,
	rating integer check (rating >= 1 and rating <= 5),
	status text default 'pending' check (status in ('pending', 'reviewed', 'implemented', 'declined')),
	admin_response text,
	reviewed_at timestamp with time zone,
	reviewed_by uuid references auth.users(id) on delete set null
);

-- Enable RLS
alter table feedback enable row level security;

-- Create indexes
create index feedback_user_id_idx on feedback(user_id);
create index feedback_type_idx on feedback(type);
create index feedback_status_idx on feedback(status);

-- Create policies
-- Customers can create feedback
create policy "Customers can create feedback"
on feedback for insert
to authenticated
with check (
	exists (
		select 1 from profiles
		where id = auth.uid()
		and role = 'customer'
	)
);

-- Customers can view their own feedback
create policy "Customers can view their own feedback"
on feedback for select
to authenticated
using (
	auth.uid() = user_id
);

-- Staff can view all feedback
create policy "Staff can view all feedback"
on feedback for select
to authenticated
using (
	exists (
		select 1 from profiles
		where id = auth.uid()
		and role in ('admin', 'agent')
	)
);

-- Only admins can update feedback status and response
create policy "Admins can update feedback"
on feedback for update
to authenticated
using (
	exists (
		select 1 from profiles
		where id = auth.uid()
		and role = 'admin'
	)
)
with check (
	exists (
		select 1 from profiles
		where id = auth.uid()
		and role = 'admin'
	)
);

-- Create trigger to update updated_at
create trigger update_feedback_updated_at
	before update on feedback
	for each row
	execute function update_updated_at_column();
