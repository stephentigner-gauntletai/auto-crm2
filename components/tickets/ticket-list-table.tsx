'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { commonAnimations, animations } from '@/lib/utils/animations';
import { cn } from '@/lib/utils';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

type Ticket = Database['public']['Tables']['tickets']['Row'];

interface TicketListTableProps {
	tickets: Ticket[];
	isCustomer?: boolean;
	currentPage: number;
	totalPages: number;
	pageSize: number;
}

export function TicketListTable({ tickets, isCustomer, currentPage, totalPages, pageSize }: TicketListTableProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	function handlePageChange(page: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		router.push(`/tickets?${params.toString()}`);
	}

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
		if (!isCustomer) return status.replace(/_/g, ' ');
		
		switch (status) {
			case 'waiting_on_customer':
				return 'Waiting for Your Response';
			case 'in_progress':
				return 'Being Worked On';
			default:
				return status.replace(/_/g, ' ');
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

	// Mobile card view
	const MobileView = () => (
		<div className="space-y-4">
			{tickets.map((ticket, index) => (
				<Card 
					key={ticket.id}
					className={cn(
						commonAnimations.listItemEnter,
						`delay-${Math.min(index * 100, 500)}`
					)}
				>
					<CardHeader>
						<CardTitle>
							<Link
								href={`/tickets/${ticket.id}`}
								className="text-blue-600 hover:text-blue-800 hover:underline"
							>
								{ticket.title}
							</Link>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Status</span>
							<Badge
								className={`${getStatusColor(ticket.status)} border-none`}
								variant="outline"
							>
								{getStatusLabel(ticket.status)}
							</Badge>
						</div>
						{!isCustomer && (
							<div className="flex items-center justify-between">
								<span className="text-sm text-muted-foreground">Priority</span>
								<Badge
									className={`${getPriorityColor(ticket.priority)} border-none`}
									variant="outline"
								>
									{ticket.priority}
								</Badge>
							</div>
						)}
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Created</span>
							<span className="text-sm">
								{formatDistanceToNow(new Date(ticket.created_at), {
									addSuffix: true,
								})}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Updated</span>
							<span className="text-sm">
								{formatDistanceToNow(new Date(ticket.updated_at), {
									addSuffix: true,
								})}
							</span>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);

	// Desktop table view
	const DesktopView = () => (
		<div className={cn("rounded-md border", animations.fadeIn, animations.duration300)}>
			<Table>
				<TableHeader>
					<TableRow className={cn(animations.fadeIn, animations.duration300)}>
						<TableHead>Title</TableHead>
						<TableHead>Status</TableHead>
						{!isCustomer && <TableHead>Priority</TableHead>}
						<TableHead>Created</TableHead>
						<TableHead>Updated</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tickets.map((ticket, index) => (
						<TableRow 
							key={ticket.id}
							className={cn(
								commonAnimations.listItemEnter,
								`delay-${Math.min(index * 100, 500)}`
							)}
						>
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
									{getStatusLabel(ticket.status)}
								</Badge>
							</TableCell>
							{!isCustomer && (
								<TableCell>
									<Badge
										className={`${getPriorityColor(ticket.priority)} border-none`}
										variant="outline"
									>
										{ticket.priority}
									</Badge>
								</TableCell>
							)}
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

	const PaginationControls = () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious 
						href="#"
						onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.preventDefault();
							if (currentPage > 1) handlePageChange(currentPage - 1);
						}}
					/>
				</PaginationItem>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
					<PaginationItem key={page}>
						<PaginationLink
							href="#"
							onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
								e.preventDefault();
								handlePageChange(page);
							}}
							isActive={page === currentPage}
						>
							{page}
						</PaginationLink>
					</PaginationItem>
				))}
				<PaginationItem>
					<PaginationNext 
						href="#"
						onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
							e.preventDefault();
							if (currentPage < totalPages) handlePageChange(currentPage + 1);
						}}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);

	return (
		<div className="space-y-4">
			<div className={cn("md:hidden", commonAnimations.pageEnter)}>
				<MobileView />
			</div>
			<div className={cn("hidden md:block", commonAnimations.pageEnter)}>
				<DesktopView />
			</div>
			{totalPages > 1 && (
				<div className="flex justify-center mt-4">
					<PaginationControls />
				</div>
			)}
		</div>
	);
} 