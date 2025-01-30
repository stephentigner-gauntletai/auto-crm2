import { createTicket, updateTicket, addTicketComment } from "./tools/ticket-tools";
import { createUser, updateUser } from "./tools/user-tools";
import { createTeam, updateTeam, addTeamMember, removeTeamMember } from "./tools/team-tools";
import type {
	CreateTicketInput,
	UpdateTicketInput,
	AddTicketCommentInput,
	CreateUserInput,
	UpdateUserInput,
	CreateTeamInput,
	UpdateTeamInput,
	TeamMembershipInput,
} from "./types";

export class CRMAgent {
	private userId: string;
	private userRole: 'agent' | 'admin';

	constructor(userId: string, userRole: 'agent' | 'admin') {
		this.userId = userId;
		this.userRole = userRole;
	}

	// Ticket Management Tools
	async createTicket(input: CreateTicketInput) {
		return createTicket(input, this.userId);
	}

	async updateTicket(input: UpdateTicketInput) {
		return updateTicket(input, this.userId);
	}

	async addTicketComment(input: AddTicketCommentInput) {
		return addTicketComment(input, this.userId);
	}

	// User Management Tools (Admin Only)
	async createUser(input: CreateUserInput) {
		if (this.userRole !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can manage users",
			};
		}
		return createUser(input, this.userId);
	}

	async updateUser(input: UpdateUserInput) {
		if (this.userRole !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can manage users",
			};
		}
		return updateUser(input, this.userId);
	}

	// Team Management Tools (Admin Only)
	async createTeam(input: CreateTeamInput) {
		if (this.userRole !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can manage teams",
			};
		}
		return createTeam(input, this.userId);
	}

	async updateTeam(input: UpdateTeamInput) {
		if (this.userRole !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can manage teams",
			};
		}
		return updateTeam(input, this.userId);
	}

	async addTeamMember(input: TeamMembershipInput) {
		if (this.userRole !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can manage team members",
			};
		}
		return addTeamMember(input, this.userId);
	}

	async removeTeamMember(input: TeamMembershipInput) {
		if (this.userRole !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can manage team members",
			};
		}
		return removeTeamMember(input, this.userId);
	}
} 