import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { TicketListTable } from '@/components/tickets/ticket-list-table';
import { TicketFilters } from '@/components/tickets/ticket-filters';
import { ProtectedLayout } from '@/components/auth/protected-layout';

interface TicketsPageProps {
	searchParams: {
		status?: string;
		priority?: string;
		team_id?: string;
	};
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
	const supabase = await createClient();
	const { status, priority, team_id } = await searchParams;

	// Get all teams for filters
	const { data: teams } = await supabase.from('teams').select('*').order('name');

	// Build query with filters
	let query = supabase.from('tickets').select('*');

	if (status) {
		query = query.eq('status', status);
	}
	if (priority) {
		query = query.eq('priority', priority);
	}
	if (team_id) {
		query = query.eq('team_id', team_id);
	}

	// Execute query
	const { data: tickets, error } = await query;

	if (error) {
		return (
			<ProtectedLayout>
				<div className="text-destructive">Error loading tickets: {error.message}</div>
			</ProtectedLayout>
		);
	}

	return (
		<ProtectedLayout>
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">Tickets</h1>
					<Link
						href="/tickets/new"
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>
						New Ticket
					</Link>
				</div>
				<TicketFilters teams={teams || []} />
				<TicketListTable tickets={tickets} />
			</div>
		</ProtectedLayout>
	);
} 