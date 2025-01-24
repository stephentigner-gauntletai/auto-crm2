import * as z from "zod"

const teamSchema = z.object({
	name: z
		.string()
		.min(2, { message: "Team name must be at least 2 characters" })
		.max(50, { message: "Team name must be less than 50 characters" }),
	description: z
		.string()
		.max(500, { message: "Description must be less than 500 characters" })
		.optional(),
})

export const createTeamSchema = teamSchema
export const editTeamSchema = teamSchema 