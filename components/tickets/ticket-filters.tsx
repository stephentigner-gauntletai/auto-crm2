'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Database } from '@/lib/database.types';

type Team = Database['public']['Tables']['teams']['Row'];

const filterSchema = z.object({
	status: z.string().optional(),
	priority: z.string().optional(),
	team_id: z.string().optional(),
});

type FormData = z.infer<typeof filterSchema>;

interface TicketFiltersProps {
	teams: Team[];
}

export function TicketFilters({ teams }: TicketFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const form = useForm<FormData>({
		resolver: zodResolver(filterSchema),
		defaultValues: {
			status: searchParams.get('status') || undefined,
			priority: searchParams.get('priority') || undefined,
			team_id: searchParams.get('team_id') || undefined,
		},
	});

	function onSubmit(data: FormData) {
		const params = new URLSearchParams();
		if (data.status) params.set('status', data.status);
		if (data.priority) params.set('priority', data.priority);
		if (data.team_id) params.set('team_id', data.team_id);
		router.push(`/tickets?${params.toString()}`);
	}

	function clearFilters() {
		form.reset();
		router.push('/tickets');
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-wrap gap-4">
				<FormField
					control={form.control}
					name="status"
					render={({ field }) => (
						<FormItem className="w-[200px]">
							<FormLabel>Status</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="All statuses" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="open">Open</SelectItem>
									<SelectItem value="in_progress">
										In Progress
									</SelectItem>
									<SelectItem value="waiting_on_customer">
										Waiting on Customer
									</SelectItem>
									<SelectItem value="resolved">
										Resolved
									</SelectItem>
									<SelectItem value="closed">Closed</SelectItem>
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="priority"
					render={({ field }) => (
						<FormItem className="w-[200px]">
							<FormLabel>Priority</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="All priorities" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="team_id"
					render={({ field }) => (
						<FormItem className="w-[200px]">
							<FormLabel>Team</FormLabel>
							<Select
								onValueChange={field.onChange}
								defaultValue={field.value}
							>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="All teams" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									{teams.map((team) => (
										<SelectItem key={team.id} value={team.id}>
											{team.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormItem>
					)}
				/>
				<div className="flex items-end gap-2">
					<Button type="submit">Apply Filters</Button>
					<Button
						type="button"
						variant="outline"
						onClick={clearFilters}
					>
						Clear
					</Button>
				</div>
			</form>
		</Form>
	);
} 