'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface TicketDetailsSkeletonProps {
	isCustomer?: boolean;
}

export function TicketDetailsSkeleton({ isCustomer }: TicketDetailsSkeletonProps) {
	return (
		<div className="space-y-6">
			<div>
				<Skeleton className="h-8 w-64 mb-4" />
				<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
					<Skeleton className="h-4 w-48" />
					<div className="hidden sm:block">•</div>
					<Skeleton className="h-4 w-40" />
					{!isCustomer && (
						<>
							<div className="hidden sm:block">•</div>
							<Skeleton className="h-4 w-44" />
						</>
					)}
				</div>
			</div>

			<div className="space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-4 w-16" />
					<Skeleton className="h-10 w-full" />
				</div>

				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-48 w-full" />
				</div>

				{!isCustomer && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Skeleton className="h-4 w-16" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>

						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-32 w-full" />
						</div>

						<Skeleton className="h-10 w-28" />
					</>
				)}
			</div>
		</div>
	);
} 