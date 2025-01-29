import { z } from 'zod';
import { commonSchemas, messages } from '@/lib/utils/validation';

export const teamSchema = z.object({
	name: z.string()
		.min(1, messages.required)
		.max(100, messages.max('Team name', 100)),
	description: z.string()
		.max(500, messages.max('Description', 500))
		.nullable()
		.optional(),
	created_by: z.string().uuid(),
});

export const teamUpdateSchema = teamSchema.partial();

export const teamMemberSchema = z.object({
	team_id: z.string().uuid(),
	user_id: z.string().uuid(),
	role: z.enum(['leader', 'member']),
	joined_at: z.date().default(() => new Date()),
});

export const teamInviteSchema = z.object({
	team_id: z.string().uuid(),
	email: commonSchemas.email,
	role: z.enum(['leader', 'member']),
	expires_at: z.date().optional(),
});

export type TeamFormData = z.infer<typeof teamSchema>;
export type TeamUpdateFormData = z.infer<typeof teamUpdateSchema>;
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
export type TeamInviteFormData = z.infer<typeof teamInviteSchema>; 