'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { notify } from '@/lib/utils/notifications';

const commentSchema = z.object({
	content: z.string().min(1, 'Comment cannot be empty'),
	is_internal: z.boolean().default(false),
});

type FormData = z.infer<typeof commentSchema>;

interface TicketCommentFormProps {
	ticketId: string;
	isStaff: boolean;
}

export function TicketCommentForm({ ticketId, isStaff }: TicketCommentFormProps) {
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(commentSchema),
		defaultValues: {
			content: '',
			is_internal: false,
		},
	});

	async function onSubmit(data: FormData) {
		try {
			setLoading(true);
			const supabase = createClient();

			// Get the current user's ID
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError) {
				notify.error("Authentication error. Please try again.");
				return;
			}
			if (!user) {
				notify.error("You must be logged in to add comments.");
				return;
			}

			const { error } = await supabase
				.from('ticket_history')
				.insert({
					ticket_id: ticketId,
					user_id: user.id,
					type: 'comment',
					content: data.content,
					is_internal: isStaff ? data.is_internal : false,
				});

			if (error) {
				notify.error(error);
				return;
			}

			form.reset();
			router.refresh();
			notify.success("Comment added successfully");
		} catch (error) {
			console.error('Error adding comment:', error);
			notify.error("Failed to add comment. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<RichTextEditor
									value={field.value}
									onChange={field.onChange}
									placeholder="Add a comment..."
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{isStaff && (
					<div className="flex items-center space-x-2">
						<FormField
							control={form.control}
							name="is_internal"
							render={({ field }) => (
								<FormItem className="flex items-center space-x-2">
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
									<Label>Internal note (only visible to staff)</Label>
								</FormItem>
							)}
						/>
					</div>
				)}
				<div className="flex justify-end">
					<Button type="submit" disabled={loading}>
						{loading ? 'Adding Comment...' : 'Add Comment'}
					</Button>
				</div>
			</form>
		</Form>
	);
} 