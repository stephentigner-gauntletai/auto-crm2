import { createClient } from '@/lib/supabase/server';
import { TicketListTable } from '@/components/tickets/ticket-list-table';
import { ProtectedLayout } from '@/components/auth/protected-layout';

export default async function TicketsPage() {
	const supabase = await createClient();
	const { data: tickets, error } = await supabase.from('tickets').select('*');

	if (error) {
		return (
			<ProtectedLayout>
				<div className="text-destructive">Error loading tickets: {error.message}</div>
			</ProtectedLayout>
		);
	}

	return (
		<ProtectedLayout>
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Tickets</h1>
				<TicketListTable tickets={tickets} />
			</div>
		</ProtectedLayout>
	);
} 