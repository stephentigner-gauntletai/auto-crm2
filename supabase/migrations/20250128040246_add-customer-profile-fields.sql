-- Add new fields to profiles table for enhanced customer profile management

-- Add phone number field
alter table profiles
add column phone_number text;

-- Add notification preferences
alter table profiles
add column email_notifications boolean default true,
add column ticket_update_notifications boolean default true;

-- Add last password change timestamp
alter table profiles
add column last_password_change timestamp with time zone;

-- Update the updated_at timestamp when profile is modified
create or replace function update_updated_at_column()
returns trigger as $$
begin
	new.updated_at = timezone('utc'::text, now());
	return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
	before update on profiles
	for each row
	execute function update_updated_at_column();
