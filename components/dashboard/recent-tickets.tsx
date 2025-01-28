'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/database.types';

type Ticket = Database['public']['Tables']['tickets']['Row'];

interface RecentTicketsProps {
	tickets: Ticket[];
}

export function RecentTickets({ tickets }: RecentTicketsProps) {
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

	function getStatusLabel(status: string) {
		switch (status) {
			case 'waiting_on_customer':
				return 'Waiting for Your Response';
			case 'in_progress':
				return 'Being Worked On';
			default:
				return status.replace(/_/g, ' ');
		}
	}

	// Sort tickets by updated_at and take the 5 most recent
	const recentTickets = [...tickets]
		.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
		.slice(0, 5);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Tickets</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{recentTickets.map((ticket) => (
						<div
							key={ticket.id}
							className="flex items-center justify-between rounded-lg border p-4"
						>
							<div className="space-y-1">
								<Link
									href={`/tickets/${ticket.id}`}
									className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
								>
									{ticket.title}
								</Link>
								<div className="flex items-center gap-2 text-sm text-muted-foreground">
									<span>
										Updated{' '}
										{formatDistanceToNow(new Date(ticket.updated_at), {
											addSuffix: true,
										})}
									</span>
								</div>
							</div>
							<Badge
								className={`${getStatusColor(ticket.status)} border-none`}
								variant="outline"
							>
								{getStatusLabel(ticket.status)}
							</Badge>
						</div>
					))}
					{recentTickets.length === 0 && (
						<div className="text-center text-sm text-muted-foreground">
							No tickets found
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
} 