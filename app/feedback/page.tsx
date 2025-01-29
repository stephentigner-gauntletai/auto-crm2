import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProtectedLayout } from '@/components/auth/protected-layout';
import { FeedbackForm } from '@/components/feedback/feedback-form';

export default async function FeedbackPage() {
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

	return (
		<ProtectedLayout>
			<div className="container max-w-3xl py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Share Your Feedback</h1>
					<p className="text-muted-foreground">
						We value your input! Help us improve our service by sharing your thoughts,
						suggestions, or reporting any issues you&apos;ve encountered.
					</p>
				</div>
				<FeedbackForm />
			</div>
		</ProtectedLayout>
	);
} 