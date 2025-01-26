'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/database.types';

type Ticket = Database['public']['Tables']['tickets']['Row'];

interface TicketListTableProps {
	tickets: Ticket[];
}

export function TicketListTable({ tickets }: TicketListTableProps) {
	function getStatusColor(status: string) {
		switch (status) {
			case 'open':
				return 'bg-blue-100 text-blue-800';
			case 'in_progress':
				return 'bg-yellow-100 text-yellow-800';
			case 'waiting_on_customer':
				return 'bg-purple-100 text-purple-800';
			case 'resolved':
				return 'bg-green-100 text-green-800';
			case 'closed':
				return 'bg-gray-100 text-gray-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-yellow-100 text-yellow-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Priority</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tickets.map((ticket) => (
						<TableRow key={ticket.id}>
							<TableCell>
								<Link
									href={`/tickets/${ticket.id}`}
									className="text-blue-600 hover:text-blue-800 hover:underline"
								>
									{ticket.title}
								</Link>
							</TableCell>
							<TableCell>
								<Badge
									className={`${getStatusColor(ticket.status)} border-none`}
									variant="outline"
								>
									{ticket.status.replace(/_/g, ' ')}
								</Badge>
							</TableCell>
							<TableCell>
								<Badge
									className={`${getPriorityColor(ticket.priority)} border-none`}
									variant="outline"
								>
									{ticket.priority}
								</Badge>
							</TableCell>
							<TableCell>
								{formatDistanceToNow(new Date(ticket.created_at), {
									addSuffix: true,
								})}
							</TableCell>
							<TableCell>
								{formatDistanceToNow(new Date(ticket.updated_at), {
									addSuffix: true,
								})}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
} 