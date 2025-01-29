import { MainLayout } from '@/components/layout/main-layout';
import { TicketListSkeleton } from '@/components/skeletons/ticket-list-skeleton';

export default function Loading() {
	return (
		<MainLayout>
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Tickets</h1>
				<TicketListSkeleton />
			</div>
		</MainLayout>
	);
} 