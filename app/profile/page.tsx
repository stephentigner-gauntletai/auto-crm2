import { ProtectedLayout } from '@/components/auth/protected-layout';
import { ProfileForm } from '@/components/profile/profile-form';
import { PasswordForm } from '@/components/profile/password-form';

export default function ProfilePage() {
	return (
		<ProtectedLayout>
			<div className="container max-w-4xl py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Profile Settings</h1>
					<p className="text-muted-foreground">
						Manage your account settings and preferences
					</p>
				</div>
				<div className="grid gap-8">
					<ProfileForm />
					<PasswordForm />
				</div>
			</div>
		</ProtectedLayout>
	);
} 