import { createClient } from "@/lib/supabase/server";
import type { 
	UserToolResponse, 
	CreateUserInput, 
	UpdateUserInput 
} from "../types";

export async function createUser(
	input: CreateUserInput,
	userId: string
): Promise<UserToolResponse> {
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
				message: "Unauthorized: Only admins can create users",
			};
		}

		// Create the user in auth
		const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
			email: input.email,
			email_confirm: true,
			user_metadata: {
				role: input.role,
			},
		});

		if (authError || !authUser.user) {
			return {
				success: false,
				message: "Failed to create user in auth system",
				error: authError?.message,
			};
		}

		// Create the user profile
		const { error: profileError } = await supabase
			.from("profiles")
			.insert({
				id: authUser.user.id,
				email: input.email,
				full_name: input.full_name,
				role: input.role,
			});

		if (profileError) {
			// TODO: Should clean up auth user if profile creation fails
			return {
				success: false,
				message: "Failed to create user profile",
				error: profileError.message,
			};
		}

		return {
			success: true,
			message: "User created successfully",
			userId: authUser.user.id,
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

export async function updateUser(
	input: UpdateUserInput,
	userId: string
): Promise<UserToolResponse> {
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
				message: "Unauthorized: Only admins can update users",
			};
		}

		// Update user metadata if role is changing
		if (input.role) {
			const { error: authError } = await supabase.auth.admin.updateUserById(
				input.userId,
				{
					user_metadata: {
						role: input.role,
					},
				}
			);

			if (authError) {
				return {
					success: false,
					message: "Failed to update user role",
					error: authError.message,
				};
			}
		}

		// Update profile
		const { userId: targetUserId, ...updateData } = input;
		const { error: profileError } = await supabase
			.from("profiles")
			.update(updateData)
			.eq("id", targetUserId);

		if (profileError) {
			return {
				success: false,
				message: "Failed to update user profile",
				error: profileError.message,
			};
		}

		return {
			success: true,
			message: "User updated successfully",
			userId: targetUserId,
		};
	} catch (error) {
		return {
			success: false,
			message: "An unexpected error occurred",
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
} 