import { AdminProtectedLayout } from '@/components/auth/admin-protected-layout';
import { AdminDashboardSkeleton } from '@/components/skeletons/admin-dashboard-skeleton';

export default function Loading() {
	return (
		<AdminProtectedLayout>
			<AdminDashboardSkeleton />
		</AdminProtectedLayout>
	);
} 