'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TicketListSkeletonProps {
	count?: number;
	isCustomer?: boolean;
}

export function TicketListSkeleton({ count = 5, isCustomer }: TicketListSkeletonProps) {
	// Mobile card view skeleton
	const MobileView = () => (
		<div className="space-y-4">
			{Array.from({ length: count }).map((_, index) => (
				<Card key={index} className="p-6">
					<div className="space-y-4">
						<Skeleton className="h-5 w-2/3" />
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-5 w-24" />
							</div>
							{!isCustomer && (
								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-16" />
									<Skeleton className="h-5 w-20" />
								</div>
							)}
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-28" />
							</div>
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-4 w-24" />
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);

	// Desktop table view skeleton
	const DesktopView = () => (
		<div className="rounded-md border">
			<div className="p-4">
				<div className="space-y-3">
					<div className="flex items-center gap-4">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-24" />
						{!isCustomer && <Skeleton className="h-4 w-24" />}
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-24" />
					</div>
					{Array.from({ length: count }).map((_, index) => (
						<div key={index} className="flex items-center gap-4">
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-6 w-24" />
							{!isCustomer && <Skeleton className="h-6 w-24" />}
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-32" />
						</div>
					))}
				</div>
			</div>
		</div>
	);

	return (
		<>
			<div className="md:hidden">
				<MobileView />
			</div>
			<div className="hidden md:block">
				<DesktopView />
			</div>
		</>
	);
} 