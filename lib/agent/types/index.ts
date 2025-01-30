// Base response type for all tools
export interface BaseToolResponse {
	success: boolean;
	message: string;
	error?: string;
}

// Ticket-specific response type
export interface TicketToolResponse extends BaseToolResponse {
	ticketId?: string;
}

// User-specific response type
export interface UserToolResponse extends BaseToolResponse {
	userId?: string;
}

// Team-specific response type
export interface TeamToolResponse extends BaseToolResponse {
	teamId?: string;
}

// Ticket tool input types
export interface CreateTicketInput {
	title: string;
	description: string;
	priority?: 'low' | 'medium' | 'high' | 'urgent';
	team_id?: string;
	assigned_to?: string;
}

export interface UpdateTicketInput extends Partial<CreateTicketInput> {
	ticketId: string;
	status?: 'open' | 'in_progress' | 'waiting_on_customer' | 'resolved' | 'closed';
}

export interface AddTicketCommentInput {
	ticketId: string;
	content: string;
	isInternal?: boolean;
}

// User tool input types
export interface CreateUserInput {
	email: string;
	full_name?: string;
	role: 'agent' | 'admin' | 'customer';
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
	userId: string;
}

// Team tool input types
export interface CreateTeamInput {
	name: string;
	description?: string;
}

export interface UpdateTeamInput extends Partial<CreateTeamInput> {
	teamId: string;
}

export interface TeamMembershipInput {
	teamId: string;
	userId: string;
} 