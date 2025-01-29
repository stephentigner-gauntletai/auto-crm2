import { z } from 'zod';
import { commonSchemas, messages } from '@/lib/utils/validation';

export const userSchema = z.object({
	email: commonSchemas.email,
	full_name: z.string()
		.min(1, messages.required)
		.max(100, messages.max('Full name', 100)),
	phone: commonSchemas.phone,
	role: z.enum(['admin', 'agent', 'customer']),
	team_id: z.string().uuid().optional(),
	is_active: z.boolean().default(true),
});

export const userUpdateSchema = userSchema.partial();

export const userAuthSchema = z.object({
	email: commonSchemas.email,
	password: commonSchemas.password,
});

export const userRegistrationSchema = userSchema.extend({
	password: commonSchemas.password,
	confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
	message: messages.matches('password'),
	path: ['confirmPassword'],
});

export type UserFormData = z.infer<typeof userSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type UserAuthFormData = z.infer<typeof userAuthSchema>;
export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>; 