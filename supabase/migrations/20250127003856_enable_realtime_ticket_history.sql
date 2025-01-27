-- Enable real-time for ticket_history table
-- Description: This migration enables real-time functionality for the ticket_history table
-- to support live updates in the UI when new history entries are added.

alter table ticket_history replica identity full;
alter publication supabase_realtime add table ticket_history;
