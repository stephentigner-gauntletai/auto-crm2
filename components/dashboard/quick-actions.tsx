'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Inbox, UserCog } from 'lucide-react';

const actions = [
	{
		title: 'Submit New Ticket',
		description: 'Create a new support request',
		href: '/tickets/submit',
		icon: PlusCircle,
		variant: 'default' as const,
	},
	{
		title: 'View All Tickets',
		description: 'See all your support requests',
		href: '/tickets',
		icon: Inbox,
		variant: 'secondary' as const,
	},
	{
		title: 'Update Profile',
		description: 'Manage your account settings',
		href: '/profile',
		icon: UserCog,
		variant: 'secondary' as const,
	},
];

export function QuickActions() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Quick Actions</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-4 md:grid-cols-3">
				{actions.map((action) => (
					<Link key={action.href} href={action.href}>
						<Button
							variant={action.variant}
							className="w-full justify-start gap-2"
						>
							<action.icon className="h-4 w-4" />
							{action.title}
						</Button>
					</Link>
				))}
			</CardContent>
		</Card>
	);
} 