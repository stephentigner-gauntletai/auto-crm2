import { createClient } from '@/lib/supabase/server';
import { TicketListTable } from '@/components/tickets/ticket-list-table';
import { MainLayout } from '@/components/layout/main-layout';

export default async function TicketsPage() {
	const supabase = await createClient();
	const { data: tickets, error } = await supabase.from('tickets').select('*');

	if (error) {
		return (
			<MainLayout>
				<div className="text-destructive">Error loading tickets: {error.message}</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Tickets</h1>
				<TicketListTable tickets={tickets} />
			</div>
		</MainLayout>
	);
} 