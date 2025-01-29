import { MainLayout } from '@/components/layout/main-layout';
import { TicketDetailsSkeleton } from '@/components/skeletons/ticket-details-skeleton';

export default function Loading() {
	return (
		<MainLayout>
			<TicketDetailsSkeleton />
		</MainLayout>
	);
} 