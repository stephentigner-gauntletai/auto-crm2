'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/lib/database.types';
import { MessageSquare, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

type Ticket = Database['public']['Tables']['tickets']['Row'];

interface OverviewCardsProps {
	tickets: Ticket[];
}

export function OverviewCards({ tickets }: OverviewCardsProps) {
	const totalTickets = tickets.length;
	const openTickets = tickets.filter((ticket) => ticket.status === 'open').length;
	const waitingTickets = tickets.filter(
		(ticket) => ticket.status === 'waiting_on_customer'
	).length;
	const resolvedTickets = tickets.filter(
		(ticket) => ticket.status === 'resolved' || ticket.status === 'closed'
	).length;

	const cards = [
		{
			title: 'Total Tickets',
			value: totalTickets,
			icon: MessageSquare,
			description: 'All support requests',
			className: 'border-blue-600/50 dark:border-blue-400/50',
			iconClassName: 'text-blue-600 dark:text-blue-400',
		},
		{
			title: 'Open Tickets',
			value: openTickets,
			icon: Clock,
			description: 'Awaiting support response',
			className: 'border-yellow-600/50 dark:border-yellow-400/50',
			iconClassName: 'text-yellow-600 dark:text-yellow-400',
		},
		{
			title: 'Waiting for Response',
			value: waitingTickets,
			icon: AlertCircle,
			description: 'Tickets needing your input',
			className: 'border-purple-600/50 dark:border-purple-400/50',
			iconClassName: 'text-purple-600 dark:text-purple-400',
		},
		{
			title: 'Resolved Tickets',
			value: resolvedTickets,
			icon: CheckCircle2,
			description: 'Successfully completed requests',
			className: 'border-green-600/50 dark:border-green-400/50',
			iconClassName: 'text-green-600 dark:text-green-400',
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{cards.map((card) => (
				<Card key={card.title} className={`border-2 ${card.className}`}>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">{card.title}</CardTitle>
						<card.icon className={`h-4 w-4 ${card.iconClassName}`} />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{card.value}</div>
						<p className="text-xs text-muted-foreground">{card.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
} 