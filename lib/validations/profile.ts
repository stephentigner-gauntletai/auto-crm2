import * as z from 'zod';

export const profileSchema = z.object({
	full_name: z.string().min(1, 'Full name is required'),
	email: z.string().email('Invalid email address').min(1, 'Email is required'),
	phone_number: z.string().optional(),
	email_notifications: z.boolean().default(true),
	ticket_update_notifications: z.boolean().default(true),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const passwordChangeSchema = z.object({
	current_password: z.string().min(1, 'Current password is required'),
	new_password: z.string().min(6, 'Password must be at least 6 characters'),
	confirm_password: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.new_password === data.confirm_password, {
	message: "Passwords don't match",
	path: ["confirm_password"],
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>; 