import { AdminProtectedLayout } from '@/components/auth/admin-protected-layout';
import { AdminNav } from '@/components/admin/admin-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UsersRound, Ticket } from 'lucide-react';
import { commonAnimations, animations } from '@/lib/utils/animations';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
	return (
		<AdminProtectedLayout>
			<div className={cn("space-y-6 p-4 md:p-6 pb-16", commonAnimations.pageEnter)}>
				<div className={cn("space-y-0.5", animations.fadeIn, animations.duration300)}>
					<h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
					<p className="text-muted-foreground">
						Manage your organization&apos;s users, teams, and settings.
					</p>
				</div>
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className={cn("-mx-4 lg:w-1/5 lg:mx-0", animations.slideInFromLeft, animations.duration500)}>
						<AdminNav />
					</aside>
					<div className="flex-1 lg:max-w-2xl">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							<Card className={cn(animations.fadeIn, animations.duration300, "delay-150")}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Total Users
									</CardTitle>
									<Users className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">123</div>
									<p className="text-xs text-muted-foreground">
										+5 from last month
									</p>
								</CardContent>
							</Card>
							<Card className={cn(animations.fadeIn, animations.duration300, "delay-300")}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Active Teams
									</CardTitle>
									<UsersRound className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">12</div>
									<p className="text-xs text-muted-foreground">
										+2 from last month
									</p>
								</CardContent>
							</Card>
							<Card className={cn(animations.fadeIn, animations.duration300, "delay-500")}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Open Tickets
									</CardTitle>
									<Ticket className="h-4 w-4 text-muted-foreground" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">45</div>
									<p className="text-xs text-muted-foreground">
										-12% from last week
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</AdminProtectedLayout>
	);
} 