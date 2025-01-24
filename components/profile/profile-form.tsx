'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { profileSchema, type ProfileFormData } from '@/lib/validations/profile';
import { useAuth } from '@/lib/auth/auth-context';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ProfileForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const { profile } = useAuth();

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			full_name: profile?.full_name || '',
			email: profile?.email || '',
		},
	});

	async function onSubmit(data: ProfileFormData) {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const supabase = createClient();
			const { error } = await supabase
				.from('profiles')
				.update({
					full_name: data.full_name,
					email: data.email,
				})
				.eq('id', profile?.id);

			if (error) {
				throw error;
			}

			setSuccess('Profile updated successfully');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Settings</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="full_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Full Name</FormLabel>
									<FormControl>
										<Input placeholder="Enter your full name" {...field} disabled={isLoading} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Enter your email"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && <div className="text-sm text-destructive">{error}</div>}
						{success && <div className="text-sm text-green-600">{success}</div>}
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Saving...' : 'Save Changes'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
} 