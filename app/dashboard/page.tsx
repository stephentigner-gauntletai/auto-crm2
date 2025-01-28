import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProtectedLayout } from '@/components/auth/protected-layout';
import { OverviewCards } from '@/components/dashboard/overview-cards';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { RecentTickets } from '@/components/dashboard/recent-tickets';

export default async function DashboardPage() {
	const supabase = await createClient();

	// Get user role
	const {
		data: { user },
	} = await supabase.auth.getUser();
	const { data: profile } = await supabase
		.from('profiles')
		.select('role')
		.eq('id', user?.id)
		.single();

	// Only customers can access this page
	if (profile?.role !== 'customer') {
		redirect('/tickets');
	}

	// Fetch user's tickets
	const { data: tickets } = await supabase
		.from('tickets')
		.select('*')
		.eq('created_by', user?.id)
		.order('updated_at', { ascending: false });

	return (
		<ProtectedLayout>
			<div className="container max-w-7xl py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Support Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back! Here&apos;s an overview of your support requests.
					</p>
				</div>

				<div className="grid gap-8">
					<OverviewCards tickets={tickets || []} />
					<QuickActions />
					<RecentTickets tickets={tickets || []} />
				</div>
			</div>
		</ProtectedLayout>
	);
} 