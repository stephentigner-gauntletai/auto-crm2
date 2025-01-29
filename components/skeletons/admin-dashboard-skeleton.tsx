'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AdminDashboardSkeleton() {
	return (
		<div className="space-y-6 p-4 md:p-6 pb-16">
			<div className="space-y-0.5">
				<Skeleton className="h-8 w-48 mb-2" />
				<Skeleton className="h-4 w-96" />
			</div>

			<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside className="-mx-4 lg:w-1/5 lg:mx-0">
					<div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
						{Array.from({ length: 3 }).map((_, index) => (
							<div
								key={index}
								className="flex items-center gap-3 px-3 py-2"
							>
								<Skeleton className="h-4 w-4" />
								<Skeleton className="hidden sm:block h-4 w-20" />
								<Skeleton className="sm:hidden h-4 w-4" />
							</div>
						))}
					</div>
				</aside>

				<div className="flex-1 lg:max-w-2xl">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 3 }).map((_, index) => (
							<Card key={index} className="p-6">
								<div className="flex flex-row items-center justify-between space-y-0 pb-2">
									<Skeleton className="h-4 w-24" />
									<Skeleton className="h-4 w-4" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-8 w-16" />
									<Skeleton className="h-3 w-32" />
								</div>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
} 