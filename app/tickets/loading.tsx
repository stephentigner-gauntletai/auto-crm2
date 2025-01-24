import { MainLayout } from '@/components/layout/main-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<MainLayout>
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Tickets</h1>
				<div className="rounded-md border">
					<div className="p-4 space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				</div>
			</div>
		</MainLayout>
	);
} 