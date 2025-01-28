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
	FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

export function ProfileForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const { profile, markProfileDirty } = useAuth();

	const form = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			full_name: profile?.full_name || '',
			email: profile?.email || '',
			phone_number: profile?.phone_number || '',
			email_notifications: profile?.email_notifications ?? true,
			ticket_update_notifications: profile?.ticket_update_notifications ?? true,
		},
	});

	async function onSubmit(data: ProfileFormData) {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const supabase = createClient();

			// First update auth user data
			const { error: authError } = await supabase.auth.updateUser({
				email: data.email,
				data: {
					full_name: data.full_name,
				},
			});

			if (authError) {
				throw authError;
			}

			// Then update additional profile data
			const { error: profileError } = await supabase
				.from('profiles')
				.update({
					full_name: data.full_name,
					email: data.email,
					phone_number: data.phone_number,
					email_notifications: data.email_notifications,
					ticket_update_notifications: data.ticket_update_notifications,
				})
				.eq('id', profile?.id || '');

			if (profileError) {
				throw profileError;
			}

			setSuccess('Profile updated successfully. If you changed your email, please check your inbox for a confirmation link.');
			markProfileDirty();
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
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="space-y-4">
							<h3 className="text-lg font-medium">Personal Information</h3>
							<FormField
								control={form.control}
								name="full_name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your full name"
												{...field}
												disabled={isLoading}
											/>
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
							<FormField
								control={form.control}
								name="phone_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number (Optional)</FormLabel>
										<FormControl>
											<Input
												type="tel"
												placeholder="Enter your phone number"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormDescription>
											We&apos;ll only use this for urgent support matters
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-medium">Notification Preferences</h3>
							<FormField
								control={form.control}
								name="email_notifications"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Email Notifications</FormLabel>
											<FormDescription>
												Receive email notifications about your account
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isLoading}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="ticket_update_notifications"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel>Ticket Updates</FormLabel>
											<FormDescription>
												Get notified when there are updates to your support tickets
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isLoading}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

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