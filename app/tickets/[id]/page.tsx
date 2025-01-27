import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TicketDetails } from "@/components/tickets/ticket-details"
import { TicketHistory } from "@/components/tickets/ticket-history"
import { TicketCommentForm } from "@/components/tickets/ticket-comment-form"
import { ProtectedLayout } from "@/components/auth/protected-layout"

interface TicketPageProps {
	params: {
		id: string
	}
}

export default async function TicketPage({ params }: TicketPageProps) {
	const { id: ticketId } = await params;
	const supabase = await createClient()

	// Get user role
	const {
		data: { user },
	} = await supabase.auth.getUser()
	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user?.id)
		.single();
	const isCustomer = profile?.role === 'customer';
	const isStaff = profile?.role === 'agent' || profile?.role === 'admin';

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
		.eq("id", ticketId)
		.single()

	if (error || !ticket) {
		notFound()
	}

	// Check if customer has access to this ticket
	if (isCustomer && ticket.created_by !== user?.id) {
		notFound()
	}

	// Get all teams for assignment (only for staff)
	const { data: teams } = !isCustomer
		? await supabase.from("teams").select("*").order("name")
		: { data: null };

	// Get all agents for assignment (only for staff)
	const { data: agents } = !isCustomer
		? await supabase.from("profiles").select("*").eq("role", "agent").order("email")
		: { data: null };

	// Fetch ticket history with user details
	const { data: history } = await supabase
		.from("ticket_history")
		.select(
			`
			*,
			user:profiles(id, email, full_name)
			`
		)
		.eq("ticket_id", ticketId)
		.order("created_at", { ascending: false })

	return (
		<ProtectedLayout>
			<div className="space-y-8">
				<TicketDetails
					ticket={ticket}
					teams={teams || []}
					agents={agents || []}
					isCustomer={isCustomer}
				/>
				<div className="space-y-6">
					<TicketCommentForm ticketId={ticketId} isStaff={isStaff} />
					<TicketHistory history={history || []} isStaff={isStaff} ticketId={ticketId} />
				</div>
			</div>
		</ProtectedLayout>
	)
} 