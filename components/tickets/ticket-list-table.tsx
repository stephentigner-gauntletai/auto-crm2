'use client';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Database } from '@/lib/supabase/database.types';

type Ticket = Database['public']['Tables']['tickets']['Row'];

interface TicketListTableProps {
	tickets: Ticket[];
}

export function TicketListTable({ tickets }: TicketListTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tickets.map((ticket) => (
						<TableRow key={ticket.id}>
							<TableCell>{ticket.title}</TableCell>
							<TableCell>{ticket.status}</TableCell>
							<TableCell>{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
							<TableCell>{new Date(ticket.updated_at).toLocaleDateString()}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
} 