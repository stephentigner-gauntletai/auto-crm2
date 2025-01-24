import * as z from 'zod';

export const profileSchema = z.object({
	full_name: z.string().min(1, 'Full name is required'),
	email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

export type ProfileFormData = z.infer<typeof profileSchema>; 