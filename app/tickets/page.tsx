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

	// Get user role
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', user?.id)
		.single();
	const isCustomer = profile?.role === 'customer';

	// Get all teams for filters (only for staff)
	const { data: teams } = !isCustomer
		? await supabase.from('teams').select('*').order('name')
		: { data: null };

	// Build query with filters
	let query = supabase.from('tickets').select(`
		*,
		team:teams(id, name),
		assignee:profiles!tickets_assigned_to_fkey(id, email, full_name),
		creator:profiles!tickets_created_by_fkey(id, email, full_name)
	`);

	// Apply role-based filters
	if (isCustomer) {
		query = query.eq('created_by', user?.id);
	}

	// Apply search filters
	if (status) {
		query = query.eq('status', status);
	}
	if (priority) {
		query = query.eq('priority', priority);
	}
	if (team_id && !isCustomer) {
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
					<h1 className="text-2xl font-bold">
						{isCustomer ? 'My Support Tickets' : 'All Tickets'}
					</h1>
					<Link
						href="/tickets/new"
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>
						{isCustomer ? 'Submit New Ticket' : 'New Ticket'}
					</Link>
				</div>
				<TicketFilters teams={teams || []} isCustomer={isCustomer} />
				<TicketListTable tickets={tickets || []} isCustomer={isCustomer} />
			</div>
		</ProtectedLayout>
	);
} 