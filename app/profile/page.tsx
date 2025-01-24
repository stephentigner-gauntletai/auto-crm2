import { ProtectedLayout } from '@/components/auth/protected-layout';
import { ProfileForm } from '@/components/profile/profile-form';

export default function ProfilePage() {
	return (
		<ProtectedLayout>
			<div className="space-y-4">
				<h1 className="text-2xl font-bold">Profile</h1>
				<ProfileForm />
			</div>
		</ProtectedLayout>
	);
} 