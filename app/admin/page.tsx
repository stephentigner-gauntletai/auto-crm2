import { AdminProtectedLayout } from '@/components/auth/admin-protected-layout';
import { AdminNav } from '@/components/admin/admin-nav';

export default function AdminDashboardPage() {
	return (
		<AdminProtectedLayout>
			<div className="space-y-6 p-6 pb-16">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
					<p className="text-muted-foreground">
						Manage your organization&apos;s users, teams, and settings.
					</p>
				</div>
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="lg:w-1/5">
						<AdminNav />
					</aside>
					<div className="flex-1 lg:max-w-2xl">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{/* Dashboard cards will go here */}
						</div>
					</div>
				</div>
			</div>
		</AdminProtectedLayout>
	);
} 