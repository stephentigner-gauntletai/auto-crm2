import * as z from 'zod';

export const feedbackTypeEnum = z.enum([
	'general',
	'feature_request',
	'bug_report',
	'support_experience',
]);

export const feedbackSchema = z.object({
	type: feedbackTypeEnum,
	title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
	description: z.string().min(1, 'Description is required'),
	rating: z.number().min(1).max(5).optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

export const feedbackStatusEnum = z.enum([
	'pending',
	'reviewed',
	'implemented',
	'declined',
]);

export type FeedbackType = z.infer<typeof feedbackTypeEnum>;
export type FeedbackStatus = z.infer<typeof feedbackStatusEnum>; 