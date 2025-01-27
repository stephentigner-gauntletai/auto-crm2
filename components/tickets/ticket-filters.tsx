'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Database } from '@/lib/database.types';

type Team = Database['public']['Tables']['teams']['Row'];

interface TicketFiltersProps {
	teams: Team[];
	isCustomer?: boolean;
}

export function TicketFilters({ teams, isCustomer }: TicketFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const updateFilter = (key: string, value: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) {
			params.set(key, value);
		} else {
			params.delete(key);
		}
		router.push(`/tickets?${params.toString()}`);
	};

	return (
		<div className="flex gap-4">
			<Select
				defaultValue={searchParams.get('status') || ''}
				onValueChange={(value) => updateFilter('status', value)}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Filter by status" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="">All Statuses</SelectItem>
					<SelectItem value="open">Open</SelectItem>
					<SelectItem value="in_progress">In Progress</SelectItem>
					<SelectItem value="waiting_on_customer">Waiting on Customer</SelectItem>
					<SelectItem value="resolved">Resolved</SelectItem>
					<SelectItem value="closed">Closed</SelectItem>
				</SelectContent>
			</Select>
			{!isCustomer && (
				<Select
					defaultValue={searchParams.get('team_id') || ''}
					onValueChange={(value) => updateFilter('team_id', value)}
				>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by team" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="">All Teams</SelectItem>
						{teams.map((team) => (
							<SelectItem key={team.id} value={team.id}>
								{team.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
		</div>
	);
} 