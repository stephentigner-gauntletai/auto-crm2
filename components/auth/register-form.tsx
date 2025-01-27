'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';

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
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			full_name: '',
		},
	});

	async function onSubmit(data: RegisterFormData) {
		setIsLoading(true);
		setError(null);

		try {
			const supabase = createClient();
			
			// Sign up the user
			const { error: signUpError } = await supabase.auth.signUp({
				email: data.email,
				password: data.password,
				options: {
					data: {
						full_name: data.full_name,
					},
				},
			});

			if (signUpError) {
				throw signUpError;
			}

			// The profile will be created automatically via database trigger
			router.push('/tickets');
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred during registration');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1">
				<div className="flex items-center justify-between">
					<CardTitle className="text-2xl">Create an Account</CardTitle>
					<ThemeToggle />
				</div>
				<p className="text-sm text-muted-foreground">
					Enter your information to create a customer account
				</p>
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="Create a password"
											{...field}
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && <div className="text-sm text-destructive">{error}</div>}
						<Button type="submit" className="w-full" disabled={isLoading}>
							{isLoading ? 'Creating Account...' : 'Create Account'}
						</Button>
						<div className="text-center text-sm">
							Already have an account?{' '}
							<Link href="/login" className="text-primary hover:underline">
								Login
							</Link>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
} 