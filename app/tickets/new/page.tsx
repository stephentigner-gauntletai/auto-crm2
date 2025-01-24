import { createClient } from "@/lib/supabase/server"
import { CreateTicketForm } from "@/components/tickets/create-ticket-form"

export default async function NewTicketPage() {
	const supabase = await createClient()

	// Get all teams
	const { data: teams } = await supabase
		.from("teams")
		.select("*")
		.order("name")

	// Get all agents (users with agent role)
	const { data: agents } = await supabase
		.from("profiles")
		.select("*")
		.eq("role", "agent")
		.order("email")

	return (
		<div className="container max-w-3xl py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold">Create New Ticket</h1>
				<p className="text-muted-foreground">
					Create a new support ticket and assign it to a team or agent.
				</p>
			</div>
			<CreateTicketForm teams={teams || []} agents={agents || []} />
		</div>
	)
} 