import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AgentChat } from "@/components/agent/agent-chat";
import { initializeTools } from "@/lib/agent/langgraph/tools";
import { ProtectedLayout } from "@/components/auth/protected-layout";

export default async function AgentPage() {
	const supabase = await createClient();

	// Get user and verify they are staff
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	const isStaff = profile?.role === 'agent' || profile?.role === 'admin';
	if (!isStaff) {
		redirect("/");
	}

	// Initialize tools on the server side
	await initializeTools(user.id, profile.role);

	return (
		<ProtectedLayout>
			<div className="container max-w-4xl py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">AI Assistant</h1>
					<p className="text-muted-foreground">
						Chat with your AI assistant to help manage tickets, users, and teams.
					</p>
				</div>
				<AgentChat userId={user.id} userRole={profile.role} />
			</div>
		</ProtectedLayout>
	);
} 