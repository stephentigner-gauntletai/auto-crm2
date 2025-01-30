import { createClient } from "@/lib/supabase/server";
import type { 
	BaseToolResponse, 
	TicketToolResponse, 
	CreateTicketInput, 
	UpdateTicketInput, 
	AddTicketCommentInput 
} from "../types";

export async function createTicket(
	input: CreateTicketInput,
	userId: string
): Promise<TicketToolResponse> {
	try {
		const supabase = await createClient();

		// Verify user has agent or admin role
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", userId)
			.single();

		if (!profile || (profile.role !== 'agent' && profile.role !== 'admin')) {
			return {
				success: false,
				message: "Unauthorized: Only agents and admins can create tickets",
			};
		}

		const { data: ticket, error } = await supabase
			.from("tickets")
			.insert({
				...input,
				created_by: userId,
				status: 'open', // Default status
			})
			.select()
			.single();

		if (error) {
			return {
				success: false,
				message: "Failed to create ticket",
				error: error.message,
			};
		}

		return {
			success: true,
			message: "Ticket created successfully",
			ticketId: ticket.id,
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function updateTicket(
	input: UpdateTicketInput,
	userId: string
): Promise<TicketToolResponse> {
	try {
		const supabase = await createClient();

		// Verify user has agent or admin role
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", userId)
			.single();

		if (!profile || (profile.role !== 'agent' && profile.role !== 'admin')) {
			return {
				success: false,
				message: "Unauthorized: Only agents and admins can update tickets",
			};
		}

		// For agents, verify they can update this ticket
		if (profile.role === 'agent') {
			const { data: ticket } = await supabase
				.from("tickets")
				.select("assigned_to, team_id")
				.eq("id", input.ticketId)
				.single();

			if (!ticket) {
				return {
					success: false,
					message: "Ticket not found",
				};
			}

			// Check if agent is assigned or part of the team
			const { data: teamMemberships } = await supabase
				.from("team_members")
				.select("team_id")
				.eq("user_id", userId);

			const canUpdate = 
				ticket.assigned_to === userId || 
				(ticket.team_id && teamMemberships?.some(tm => tm.team_id === ticket.team_id));

			if (!canUpdate) {
				return {
					success: false,
					message: "Unauthorized: You can only update tickets assigned to you or your team",
				};
			}
		}

		const { ticketId, ...updateData } = input;
		const { error } = await supabase
			.from("tickets")
			.update(updateData)
			.eq("id", ticketId);

		if (error) {
			return {
				success: false,
				message: "Failed to update ticket",
				error: error.message,
			};
		}

		return {
			success: true,
			message: "Ticket updated successfully",
			ticketId,
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function addTicketComment(
	input: AddTicketCommentInput,
	userId: string
): Promise<BaseToolResponse> {
	try {
		const supabase = await createClient();

		// Verify user has agent or admin role
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", userId)
			.single();

		if (!profile || (profile.role !== 'agent' && profile.role !== 'admin')) {
			return {
				success: false,
				message: "Unauthorized: Only agents and admins can add comments",
			};
		}

		// For agents, verify they can comment on this ticket
		if (profile.role === 'agent') {
			const { data: ticket } = await supabase
				.from("tickets")
				.select("assigned_to, team_id")
				.eq("id", input.ticketId)
				.single();

			if (!ticket) {
				return {
					success: false,
					message: "Ticket not found",
				};
			}

			// Check if agent is assigned or part of the team
			const { data: teamMemberships } = await supabase
				.from("team_members")
				.select("team_id")
				.eq("user_id", userId);

			const canComment = 
				ticket.assigned_to === userId || 
				(ticket.team_id && teamMemberships?.some(tm => tm.team_id === ticket.team_id));

			if (!canComment) {
				return {
					success: false,
					message: "Unauthorized: You can only comment on tickets assigned to you or your team",
				};
			}
		}

		const { error } = await supabase
			.from("ticket_history")
			.insert({
				ticket_id: input.ticketId,
				user_id: userId,
				content: input.content,
				type: 'comment',
				is_internal: input.isInternal || false,
			});

		if (error) {
			return {
				success: false,
				message: "Failed to add comment",
				error: error.message,
			};
		}

		return {
			success: true,
			message: "Comment added successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
} 