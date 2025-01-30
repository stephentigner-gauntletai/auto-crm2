import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { CRMAgent } from "../index";

// Initialize the model
export const model = new ChatOpenAI({
	modelName: "gpt-4-turbo-preview",
	temperature: 0,
});

// Create a CRM agent instance - this will be initialized with actual values when used
let crmAgent: CRMAgent;

export function initializeTools(userId: string, userRole: 'agent' | 'admin') {
	crmAgent = new CRMAgent(userId, userRole);
	return tools;
}

// Ticket Management Tools
const createTicketSchema = z.object({
	title: z.string().describe("The title of the ticket"),
	description: z.string().describe("Detailed description of the ticket"),
	priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
		.describe("Priority level of the ticket"),
	team_id: z.string().optional().describe("ID of the team to assign the ticket to"),
	assigned_to: z.string().optional().describe("ID of the agent to assign the ticket to"),
});

export const createTicketTool = tool(
	async ({ 
		title,
		description,
		priority,
		team_id,
		assigned_to,
	}: z.infer<typeof createTicketSchema>) => {
		const result = await crmAgent.createTicket({
			title,
			description,
			priority,
			team_id,
			assigned_to,
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `Ticket created successfully with ID: ${result.ticketId}`;
	},
	{
		name: "createTicket",
		description: "Create a new support ticket",
		schema: createTicketSchema,
	}
);

const updateTicketSchema = z.object({
	ticketId: z.string().describe("ID of the ticket to update"),
	title: z.string().optional().describe("New title for the ticket"),
	description: z.string().optional().describe("New description for the ticket"),
	status: z.enum(['open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed'])
		.optional().describe("New status for the ticket"),
	priority: z.enum(['low', 'medium', 'high', 'urgent'])
		.optional().describe("New priority level for the ticket"),
	team_id: z.string().optional().describe("New team assignment"),
	assigned_to: z.string().optional().describe("New agent assignment"),
});

export const updateTicketTool = tool(
	async ({ 
		ticketId,
		title,
		description,
		status,
		priority,
		team_id,
		assigned_to,
	}: z.infer<typeof updateTicketSchema>) => {
		const result = await crmAgent.updateTicket({
			ticketId,
			...(title && { title }),
			...(description && { description }),
			...(status && { status }),
			...(priority && { priority }),
			...(team_id && { team_id }),
			...(assigned_to && { assigned_to }),
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `Ticket ${ticketId} updated successfully`;
	},
	{
		name: "updateTicket",
		description: "Update an existing support ticket",
		schema: updateTicketSchema,
	}
);

const addTicketCommentSchema = z.object({
	ticketId: z.string().describe("ID of the ticket to comment on"),
	content: z.string().describe("Content of the comment"),
	isInternal: z.boolean().optional()
		.describe("Whether this is an internal note (only visible to staff)"),
});

export const addTicketCommentTool = tool(
	async ({ 
		ticketId,
		content,
		isInternal,
	}: z.infer<typeof addTicketCommentSchema>) => {
		const result = await crmAgent.addTicketComment({
			ticketId,
			content,
			isInternal,
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `Comment added successfully to ticket ${ticketId}`;
	},
	{
		name: "addTicketComment",
		description: "Add a comment to a ticket, optionally marking it as internal",
		schema: addTicketCommentSchema,
	}
);

// User Management Tools (Admin Only)
const createUserSchema = z.object({
	email: z.string().email().describe("Email address for the new user"),
	full_name: z.string().optional().describe("Full name of the user"),
	role: z.enum(['agent', 'admin', 'customer']).describe("Role for the new user"),
});

export const createUserTool = tool(
	async ({ 
		email,
		full_name,
		role,
	}: z.infer<typeof createUserSchema>) => {
		const result = await crmAgent.createUser({
			email,
			full_name,
			role,
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `User created successfully with ID: ${result.userId}`;
	},
	{
		name: "createUser",
		description: "Create a new user (admin only)",
		schema: createUserSchema,
	}
);

const updateUserSchema = z.object({
	userId: z.string().describe("ID of the user to update"),
	email: z.string().email().optional().describe("New email address"),
	full_name: z.string().optional().describe("New full name"),
	role: z.enum(['agent', 'admin', 'customer']).optional().describe("New role"),
});

export const updateUserTool = tool(
	async ({ 
		userId,
		email,
		full_name,
		role,
	}: z.infer<typeof updateUserSchema>) => {
		const result = await crmAgent.updateUser({
			userId,
			...(email && { email }),
			...(full_name && { full_name }),
			...(role && { role }),
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `User ${userId} updated successfully`;
	},
	{
		name: "updateUser",
		description: "Update an existing user (admin only)",
		schema: updateUserSchema,
	}
);

// Team Management Tools (Admin Only)
const createTeamSchema = z.object({
	name: z.string().describe("Name of the new team"),
	description: z.string().optional().describe("Description of the team"),
});

export const createTeamTool = tool(
	async ({ 
		name,
		description,
	}: z.infer<typeof createTeamSchema>) => {
		const result = await crmAgent.createTeam({
			name,
			description,
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `Team created successfully with ID: ${result.teamId}`;
	},
	{
		name: "createTeam",
		description: "Create a new team (admin only)",
		schema: createTeamSchema,
	}
);

const updateTeamSchema = z.object({
	teamId: z.string().describe("ID of the team to update"),
	name: z.string().optional().describe("New name for the team"),
	description: z.string().optional().describe("New description for the team"),
});

export const updateTeamTool = tool(
	async ({ 
		teamId,
		name,
		description,
	}: z.infer<typeof updateTeamSchema>) => {
		const result = await crmAgent.updateTeam({
			teamId,
			...(name && { name }),
			...(description && { description }),
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `Team ${teamId} updated successfully`;
	},
	{
		name: "updateTeam",
		description: "Update an existing team (admin only)",
		schema: updateTeamSchema,
	}
);

const teamMembershipSchema = z.object({
	teamId: z.string().describe("ID of the team"),
	userId: z.string().describe("ID of the agent to add/remove from the team"),
});

export const addTeamMemberTool = tool(
	async ({ 
		teamId,
		userId,
	}: z.infer<typeof teamMembershipSchema>) => {
		const result = await crmAgent.addTeamMember({
			teamId,
			userId,
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `User ${userId} added to team ${teamId} successfully`;
	},
	{
		name: "addTeamMember",
		description: "Add an agent to a team (admin only)",
		schema: teamMembershipSchema,
	}
);

export const removeTeamMemberTool = tool(
	async ({ 
		teamId,
		userId,
	}: z.infer<typeof teamMembershipSchema>) => {
		const result = await crmAgent.removeTeamMember({
			teamId,
			userId,
		});

		if (!result.success) {
			throw new Error(result.message);
		}

		return `User ${userId} removed from team ${teamId} successfully`;
	},
	{
		name: "removeTeamMember",
		description: "Remove an agent from a team (admin only)",
		schema: teamMembershipSchema,
	}
);

// Export all tools as an array
export const tools = [
	createTicketTool,
	updateTicketTool,
	addTicketCommentTool,
	createUserTool,
	updateUserTool,
	createTeamTool,
	updateTeamTool,
	addTeamMemberTool,
	removeTeamMemberTool,
]; 