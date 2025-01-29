import { z } from 'zod';
import { messages } from '@/lib/utils/validation';

export const ticketSchema = z.object({
	title: z.string()
		.min(1, messages.required)
		.max(255, messages.max('Title', 255)),
	description: z.string()
		.min(1, messages.required)
		.max(10000, messages.max('Description', 10000)),
	status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
	priority: z.enum(['low', 'medium', 'high', 'urgent']),
	category: z.string().min(1, messages.required),
	assignee_id: z.string().uuid().optional(),
	team_id: z.string().uuid(),
	customer_id: z.string().uuid(),
});

export const ticketUpdateSchema = ticketSchema.partial();

export const ticketCommentSchema = z.object({
	ticket_id: z.string().uuid(),
	content: z.string()
		.min(1, messages.required)
		.max(5000, messages.max('Comment', 5000)),
	is_internal: z.boolean().default(false),
});

export type TicketFormData = z.infer<typeof ticketSchema>;
export type TicketUpdateFormData = z.infer<typeof ticketUpdateSchema>;
export type TicketCommentFormData = z.infer<typeof ticketCommentSchema>; 