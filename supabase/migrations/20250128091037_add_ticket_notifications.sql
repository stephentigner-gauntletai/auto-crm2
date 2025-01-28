-- Migration: Add Ticket Notifications
-- Description: Creates a function and trigger to send notifications when tickets are updated
-- Created at: 2025-01-28 09:10:37
-- Dependencies: http extension

-- Create function to invoke edge function for ticket notifications
create or replace function notify_ticket_update()
returns trigger
security definer
language plpgsql
as $$
declare
	edge_function_url text;
begin
	-- Get the edge function URL from environment or use default
	begin
		edge_function_url := current_setting('app.settings.edge_function_base_url');
	exception when others then
		edge_function_url := 'http://localhost:54321/functions/v1';
	end;

	-- Call the edge function to send the notification
	perform
		extensions.http_post(
			url := edge_function_url || '/send-ticket-notification',
			headers := jsonb_build_object(
				'Content-Type', 'application/json',
				'Authorization', 'Bearer ' || auth.jwt()
			),
			body := jsonb_build_object(
				'type', TG_OP,
				'table', TG_TABLE_NAME,
				'record', row_to_json(NEW),
				'old_record', case when TG_OP = 'UPDATE' then row_to_json(OLD) else null end
			)
		);
	return NEW;
end;
$$;

-- Create trigger for ticket updates
create trigger on_ticket_update_notify
	after update on tickets
	for each row
	execute function notify_ticket_update();
