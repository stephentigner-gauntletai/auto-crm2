import { createClient } from "@/lib/supabase/server";
import type { 
	TeamToolResponse, 
	BaseToolResponse,
	CreateTeamInput, 
	UpdateTeamInput,
	TeamMembershipInput
} from "../types";

export async function createTeam(
	input: CreateTeamInput,
	userId: string
): Promise<TeamToolResponse> {
	try {
		const supabase = await createClient();

		// Verify user has admin role
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", userId)
			.single();

		if (!profile || profile.role !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can create teams",
			};
		}

		const { data: team, error } = await supabase
			.from("teams")
			.insert(input)
			.select()
			.single();

		if (error) {
			return {
				success: false,
				message: "Failed to create team",
				error: error.message,
			};
		}

		return {
			success: true,
			message: "Team created successfully",
			teamId: team.id,
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function updateTeam(
	input: UpdateTeamInput,
	userId: string
): Promise<TeamToolResponse> {
	try {
		const supabase = await createClient();

		// Verify user has admin role
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", userId)
			.single();

		if (!profile || profile.role !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can update teams",
			};
		}

		const { teamId, ...updateData } = input;
		const { error } = await supabase
			.from("teams")
			.update(updateData)
			.eq("id", teamId);

		if (error) {
			return {
				success: false,
				message: "Failed to update team",
				error: error.message,
			};
		}

		return {
			success: true,
			message: "Team updated successfully",
			teamId,
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function addTeamMember(
	input: TeamMembershipInput,
	userId: string
): Promise<BaseToolResponse> {
	try {
		const supabase = await createClient();

		// Verify user has admin role
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", userId)
			.single();

		if (!profile || profile.role !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can manage team members",
			};
		}

		// Verify the target user is an agent
		const { data: targetProfile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", input.userId)
			.single();

		if (!targetProfile || targetProfile.role !== 'agent') {
			return {
				success: false,
				message: "Only agents can be added to teams",
			};
		}

		// Check if the membership already exists
		const { data: existingMembership } = await supabase
			.from("team_members")
			.select()
			.eq("team_id", input.teamId)
			.eq("user_id", input.userId)
			.single();

		if (existingMembership) {
			return {
				success: false,
				message: "User is already a member of this team",
			};
		}

		const { error } = await supabase
			.from("team_members")
			.insert(input);

		if (error) {
			return {
				success: false,
				message: "Failed to add team member",
				error: error.message,
			};
		}

		return {
			success: true,
			message: "Team member added successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function removeTeamMember(
	input: TeamMembershipInput,
	userId: string
): Promise<BaseToolResponse> {
	try {
		const supabase = await createClient();

		// Verify user has admin role
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", userId)
			.single();

		if (!profile || profile.role !== 'admin') {
			return {
				success: false,
				message: "Unauthorized: Only admins can manage team members",
			};
		}

		const { error } = await supabase
			.from("team_members")
			.delete()
			.eq("team_id", input.teamId)
			.eq("user_id", input.userId);

		if (error) {
			return {
				success: false,
				message: "Failed to remove team member",
				error: error.message,
			};
		}

		return {
			success: true,
			message: "Team member removed successfully",
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
} 