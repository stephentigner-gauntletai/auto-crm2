'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { feedbackSchema, type FeedbackFormData } from '@/lib/validations/feedback';

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
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/feedback/star-rating';

export function FeedbackForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const router = useRouter();

	const form = useForm<FeedbackFormData>({
		resolver: zodResolver(feedbackSchema),
		defaultValues: {
			type: 'general',
			title: '',
			description: '',
			rating: undefined,
		},
	});

	async function onSubmit(data: FeedbackFormData) {
		setIsLoading(true);
		setError(null);
		setSuccess(null);

		try {
			const supabase = createClient();

			// Get the current user's ID
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				throw new Error('User not authenticated');
			}

			const { error: submitError } = await supabase
				.from('feedback')
				.insert({
					...data,
					user_id: user.id,
				});

			if (submitError) throw submitError;

			setSuccess('Thank you for your feedback! We appreciate your input.');
			form.reset();
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred while submitting feedback');
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Submit Feedback</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Feedback Type</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select feedback type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="general">
												General Feedback
											</SelectItem>
											<SelectItem value="feature_request">
												Feature Request
											</SelectItem>
											<SelectItem value="bug_report">
												Bug Report
											</SelectItem>
											<SelectItem value="support_experience">
												Support Experience
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input
											placeholder="Brief summary of your feedback"
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
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<RichTextEditor
											value={field.value}
											onChange={field.onChange}
											placeholder="Please provide detailed feedback..."
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="rating"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Rating (Optional)</FormLabel>
									<FormDescription>
										How would you rate your experience?
									</FormDescription>
									<FormControl>
										<StarRating
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && <div className="text-sm text-destructive">{error}</div>}
						{success && <div className="text-sm text-green-600">{success}</div>}
						<Button type="submit" disabled={isLoading}>
							{isLoading ? 'Submitting...' : 'Submit Feedback'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
} 