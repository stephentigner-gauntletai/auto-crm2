import { createClient } from '@/lib/supabase/server';
import { AdminProtectedLayout } from '@/components/auth/admin-protected-layout';
import { UserList } from '@/components/admin/users/user-list';
import { columns } from '@/components/admin/users/columns';

export default async function UsersPage() {
	const supabase = await createClient();
	const { data: users, error } = await supabase.from('profiles').select('*');

	if (error) {
		return (
			<AdminProtectedLayout>
				<div className="text-destructive">Error loading users: {error.message}</div>
			</AdminProtectedLayout>
		);
	}

	return (
		<AdminProtectedLayout>
			<div className="space-y-6 p-6 pb-16">
				<div className="space-y-0.5">
					<h2 className="text-2xl font-bold tracking-tight">Users</h2>
					<p className="text-muted-foreground">Manage your organization&apos;s users.</p>
				</div>
				<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<div className="flex-1">
						<UserList columns={columns} data={users} />
					</div>
				</div>
			</div>
		</AdminProtectedLayout>
	);
} 