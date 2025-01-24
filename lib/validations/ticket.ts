import * as z from "zod"

export const ticketStatusEnum = z.enum([
	"open",
	"in_progress",
	"waiting_on_customer",
	"resolved",
	"closed",
])

export const createTicketSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters" })
		.max(100, { message: "Title must be less than 100 characters" }),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters" })
		.max(5000, { message: "Description must be less than 5000 characters" }),
	status: ticketStatusEnum.default("open"),
	team_id: z.string().uuid().optional(),
	assigned_to: z.string().uuid().optional(),
})

export const updateTicketSchema = createTicketSchema.extend({
	internal_notes: z
		.string()
		.max(5000, { message: "Notes must be less than 5000 characters" })
		.optional(),
}) 