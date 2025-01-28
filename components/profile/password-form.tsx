'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { passwordChangeSchema, type PasswordChangeFormData } from '@/lib/validations/profile';

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

export function PasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const form = useForm<PasswordChangeFormData>({
		resolver: zodResolver(passwordChangeSchema),
		defaultValues: {
			current_password: '',
			new_password: '',
			confirm_password: '',
		},
	});

	async function onSubmit(data: PasswordChangeFormData) {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const supabase = createClient();
			const { error } = await supabase.auth.updateUser({
				password: data.new_password,
			});

			if (error) {
				throw error;
			}

			// Update last_password_change timestamp
			const { error: updateError } = await supabase
				.from('profiles')
				.update({
					last_password_change: new Date().toISOString(),
				})
				.eq('id', (await supabase.auth.getUser()).data.user?.id || '');

			if (updateError) {
				console.error('Error updating last_password_change:', updateError);
			}

			setSuccess('Password updated successfully');
			form.reset();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred while updating password');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Change Password</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="current_password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Current Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your current password"
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
							name="new_password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter your new password"
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
							name="confirm_password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm New Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Confirm your new password"
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
							{isLoading ? 'Updating...' : 'Update Password'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
} 