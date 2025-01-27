import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CustomerTicketForm } from "@/components/tickets/customer-ticket-form"
import { ProtectedLayout } from "@/components/auth/protected-layout"

export default async function SubmitTicketPage() {
	const supabase = await createClient()

	// Get user role
	const {
		data: { user },
	} = await supabase.auth.getUser()
	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user?.id)
		.single()

	// Only customers can access this page
	if (profile?.role !== "customer") {
		redirect("/tickets")
	}

	return (
		<ProtectedLayout>
			<div className="container max-w-3xl py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold">Submit a Support Request</h1>
					<p className="text-muted-foreground">
						Need help? Fill out the form below and our support team will assist you as soon as possible.
					</p>
				</div>
				<CustomerTicketForm />
			</div>
		</ProtectedLayout>
	)
} 