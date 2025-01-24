import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TicketDetails } from "@/components/tickets/ticket-details"

interface TicketPageProps {
	params: {
		id: string
	}
}

export default async function TicketPage({ params }: TicketPageProps) {
	const supabase = await createClient()

	// Fetch ticket with related data
	const { data: ticket, error } = await supabase
		.from("tickets")
		.select(
			`
			*,
			team:teams(id, name),
			assignee:profiles!tickets_assigned_to_fkey(id, email, full_name),
			creator:profiles!tickets_created_by_fkey(id, email, full_name)
			`
		)
		.eq("id", params.id)
		.single()

	if (error || !ticket) {
		notFound()
	}

	// Get all teams for assignment
	const { data: teams } = await supabase
		.from("teams")
		.select("*")
		.order("name")

	// Get all agents for assignment
	const { data: agents } = await supabase
		.from("profiles")
		.select("*")
		.eq("role", "agent")
		.order("email")

	return (
		<div className="container py-8">
			<TicketDetails
				ticket={ticket}
				teams={teams || []}
				agents={agents || []}
			/>
		</div>
	)
} 