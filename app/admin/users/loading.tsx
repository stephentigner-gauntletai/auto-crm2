import { AdminProtectedLayout } from '@/components/auth/admin-protected-layout';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<AdminProtectedLayout>
			<div className="space-y-6 p-6 pb-16">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Users</h2>
					<p className="text-muted-foreground">Manage your organization&apos;s users.</p>
				</div>
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="lg:w-1/5">
						{/* We'll add filters here later */}
					</aside>
					<div className="flex-1">
						<div className="rounded-md border">
							<div className="p-4 space-y-4">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</AdminProtectedLayout>
	);
} 