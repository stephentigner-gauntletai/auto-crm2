import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { createClient } from "@/lib/supabase/server";
import { ChatOpenAI } from "@langchain/openai";
import { CRMAgent } from "../index";

// Initialize the model
const model = new ChatOpenAI({
	modelName: "gpt-4-turbo-preview",
	temperature: 0,
});

let crmAgent: CRMAgent;

// Define schemas
const createTicketSchema = z.object({
	title: z.string().describe("The title of the ticket"),
	description: z.string().describe("The description of the ticket"),
	priority: z.enum(["low", "medium", "high"]).describe("The priority level of the ticket"),
	team_id: z.string().optional().describe("The ID of the team to assign the ticket to"),
	assigned_to: z.string().optional().describe("The ID of the user to assign the ticket to"),
});

const updateTicketSchema = z.object({
	ticketId: z.string().describe("The ID of the ticket to update"),
	title: z.string().optional().describe("New title for the ticket"),
	description: z.string().optional().describe("New description for the ticket"),
	status: z.enum(["open", "in_progress", "resolved", "closed"]).optional()
		.describe("New status for the ticket"),
	priority: z.enum(["low", "medium", "high"]).optional()
		.describe("New priority level for the ticket"),
	team_id: z.string().optional().describe("New team assignment for the ticket"),
	assigned_to: z.string().optional().describe("New user assignment for the ticket"),
});

const addTicketCommentSchema = z.object({
	ticketId: z.string().describe("The ID of the ticket to comment on"),
	content: z.string().describe("The content of the comment"),
	isInternal: z.boolean().optional().describe("Whether this is an internal comment"),
});

// Declare all tools individually
export const createTicketTool = new DynamicStructuredTool({
	name: "createTicket",
	description: "Create a new ticket",
	schema: createTicketSchema,
	func: async ({ title, description, priority, team_id, assigned_to }) => {
		return await crmAgent.createTicket({
			title,
			description,
			priority,
			team_id,
			assigned_to,
		});
	},
});

export const updateTicketTool = new DynamicStructuredTool({
	name: "updateTicket",
	description: "Update an existing ticket",
	schema: updateTicketSchema,
	func: async ({ ticketId, title, description, status, priority, team_id, assigned_to }) => {
		return await crmAgent.updateTicket({
			ticketId,
			...(title && { title }),
			...(description && { description }),
			...(status && { status }),
			...(priority && { priority }),
			...(team_id && { team_id }),
			...(assigned_to && { assigned_to }),
		});
	},
});

export const addTicketCommentTool = new DynamicStructuredTool({
	name: "addTicketComment",
	description: "Add a comment to a ticket, optionally marking it as internal",
	schema: addTicketCommentSchema,
	func: async ({ ticketId, content, isInternal }) => {
		return await crmAgent.addTicketComment({
			ticketId,
			content,
			isInternal,
		});
	},
});

// User Management Tools (Admin Only)
const createUserSchema = z.object({
	email: z.string().email().describe("Email address for the new user"),
	full_name: z.string().optional().describe("Full name of the user"),
	role: z.enum(['agent', 'admin', 'customer']).describe("Role for the new user"),
});

export const createUserTool = new DynamicStructuredTool({
	name: "createUser",
	description: "Create a new user (admin only)",
	schema: createUserSchema,
	func: async ({ email, full_name, role }) => {
		return await crmAgent.createUser({
			email,
			full_name,
			role,
		});
	},
});

const updateUserSchema = z.object({
	userId: z.string().describe("ID of the user to update"),
	email: z.string().email().optional().describe("New email address"),
	full_name: z.string().optional().describe("New full name"),
	role: z.enum(['agent', 'admin', 'customer']).optional().describe("New role"),
});

export const updateUserTool = new DynamicStructuredTool({
	name: "updateUser",
	description: "Update an existing user (admin only)",
	schema: updateUserSchema,
	func: async ({ userId, email, full_name, role }) => {
		return await crmAgent.updateUser({
			userId,
			...(email && { email }),
			...(full_name && { full_name }),
			...(role && { role }),
		});
	},
});

// Team Management Tools (Admin Only)
const createTeamSchema = z.object({
	name: z.string().describe("Name of the new team"),
	description: z.string().optional().describe("Description of the team"),
});

export const createTeamTool = new DynamicStructuredTool({
	name: "createTeam",
	description: "Create a new team (admin only)",
	schema: createTeamSchema,
	func: async ({ name, description }) => {
		return await crmAgent.createTeam({
			name,
			description,
		});
	},
});

const updateTeamSchema = z.object({
	teamId: z.string().describe("ID of the team to update"),
	name: z.string().optional().describe("New name for the team"),
	description: z.string().optional().describe("New description for the team"),
});

export const updateTeamTool = new DynamicStructuredTool({
	name: "updateTeam",
	description: "Update an existing team (admin only)",
	schema: updateTeamSchema,
	func: async ({ teamId, name, description }) => {
		return await crmAgent.updateTeam({
			teamId,
			...(name && { name }),
			...(description && { description }),
		});
	},
});

const teamMembershipSchema = z.object({
	teamId: z.string().describe("ID of the team"),
	userId: z.string().describe("ID of the agent to add/remove from the team"),
});

export const addTeamMemberTool = new DynamicStructuredTool({
	name: "addTeamMember",
	description: "Add an agent to a team (admin only)",
	schema: teamMembershipSchema,
	func: async ({ teamId, userId }) => {
		return await crmAgent.addTeamMember({
			teamId,
			userId,
		});
	},
});

export const removeTeamMemberTool = new DynamicStructuredTool({
	name: "removeTeamMember",
	description: "Remove an agent from a team (admin only)",
	schema: teamMembershipSchema,
	func: async ({ teamId, userId }) => {
		return await crmAgent.removeTeamMember({
			teamId,
			userId,
		});
	},
});

// Ticket Search Tool
export const findTicketsByTitleTool = new DynamicStructuredTool({
	name: "findTicketsByTitle",
	description: "Find tickets that match a given title. Use this to help users identify which ticket they want to work with.",
	schema: z.object({
		title: z.string().describe("The title or partial title to search for"),
	}),
	func: async ({ title }) => {
		const supabase = await createClient();
		const { data: tickets, error } = await supabase
			.from("tickets")
			.select("id, title, status, priority, created_at")
			.ilike("title", `%${title}%`)
			.order("created_at", { ascending: false });

		if (error) {
			throw new Error(`Error finding tickets: ${error.message}`);
		}

		if (!tickets || tickets.length === 0) {
			return "No tickets found matching that title.";
		}

		return tickets.map(ticket => 
			`Ticket ID: ${ticket.id} | Title: ${ticket.title} | Status: ${ticket.status} | Priority: ${ticket.priority}`
		).join("\n");
	},
});

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
	findTicketsByTitleTool,
];

export async function initializeTools(userId: string, userRole: 'agent' | 'admin') {
	crmAgent = new CRMAgent(userId, userRole);
	return tools;
} 