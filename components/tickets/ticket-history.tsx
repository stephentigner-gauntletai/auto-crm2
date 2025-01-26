'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, RefreshCw, Users, Building2, ArrowUpDown } from 'lucide-react';
import { Database } from '@/lib/database.types';
import { createClient } from '@/lib/supabase/client';

type TicketHistory = Database['public']['Tables']['ticket_history']['Row'] & {
	user: Pick<Database['public']['Tables']['profiles']['Row'], 'id' | 'email' | 'full_name'>;
};

interface TicketHistoryProps {
	history: TicketHistory[];
	isAgent: boolean;
	ticketId: string;
}

export function TicketHistory({ history: initialHistory, isAgent, ticketId }: TicketHistoryProps) {
	const [history, setHistory] = useState<TicketHistory[]>(initialHistory);

	useEffect(() => {
		const supabase = createClient();

		// Subscribe to new ticket history entries
		const channel = supabase
			.channel('ticket_history_changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'ticket_history',
					filter: `ticket_id=eq.${ticketId}`,
				},
				async (payload) => {
					// Fetch the complete history entry with user details
					const { data } = await supabase
						.from('ticket_history')
						.select('*, user:profiles(id, email, full_name)')
						.eq('id', payload.new.id)
						.single();

					if (data) {
						setHistory((current) => [data as TicketHistory, ...current]);
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [ticketId]);

	// Filter out internal entries for non-agents
	const visibleHistory = isAgent ? history : history.filter((entry) => !entry.is_internal);

	return (
		<div className="space-y-4">
			<h2 className="text-lg font-semibold">Ticket History</h2>
			<div className="space-y-4">
				{visibleHistory.map((entry) => (
					<div key={entry.id} className="flex gap-4 text-sm">
						<div className="flex-none">
							{entry.type === 'comment' && <MessageSquare className="h-5 w-5 text-blue-500" />}
							{entry.type === 'status_change' && <RefreshCw className="h-5 w-5 text-yellow-500" />}
							{entry.type === 'assignment_change' && <Users className="h-5 w-5 text-purple-500" />}
							{entry.type === 'team_change' && <Building2 className="h-5 w-5 text-green-500" />}
							{entry.type === 'priority_change' && <ArrowUpDown className="h-5 w-5 text-red-500" />}
						</div>
						<div className="flex-1 space-y-1">
							<div className="flex items-center gap-2">
								<span className="font-medium">
									{entry.user.full_name || entry.user.email}
								</span>
								<span className="text-muted-foreground">
									{formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
								</span>
								{entry.is_internal && (
									<span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800">
										Internal
									</span>
								)}
							</div>
							{entry.type === 'comment' ? (
								<div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: entry.content || '' }} />
							) : (
								<div>
									{entry.type === 'status_change' && (
										<p>Changed status from <span className="font-medium">{entry.old_value}</span> to <span className="font-medium">{entry.new_value}</span></p>
									)}
									{entry.type === 'assignment_change' && (
										<p>Reassigned from <span className="font-medium">{entry.old_value || 'Unassigned'}</span> to <span className="font-medium">{entry.new_value || 'Unassigned'}</span></p>
									)}
									{entry.type === 'team_change' && (
										<p>Moved from <span className="font-medium">{entry.old_value || 'No team'}</span> to <span className="font-medium">{entry.new_value || 'No team'}</span></p>
									)}
									{entry.type === 'priority_change' && (
										<p>Changed priority from <span className="font-medium">{entry.old_value}</span> to <span className="font-medium">{entry.new_value}</span></p>
									)}
									{entry.type === 'edit' && <p>Updated ticket details</p>}
								</div>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
} 