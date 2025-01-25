import { createClient } from "@/lib/supabase/server"

import { AdminProtectedLayout } from "@/components/auth/admin-protected-layout"
import { TeamList } from "@/components/admin/teams/team-list"
import { CreateTeamDialog } from "@/components/admin/teams/create-team-dialog"

export default async function TeamsPage() {
	const supabase = await createClient()

	const { data: teams, error } = await supabase
		.from("teams")
		.select("*")
		.order("created_at", { ascending: false })

	if (error) {
		console.error("Error fetching teams:", error)
		return (
			<AdminProtectedLayout>
				<div className="flex flex-col gap-4">
					<h1 className="text-2xl font-bold tracking-tight">Teams</h1>
					<div className="rounded-md bg-destructive/15 p-4">
						<p className="text-sm text-destructive">
							Error loading teams. Please try again later.
						</p>
					</div>
				</div>
			</AdminProtectedLayout>
		)
	}

	return (
		<AdminProtectedLayout>
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold tracking-tight">Teams</h1>
					<CreateTeamDialog />
				</div>
				<TeamList data={teams || []} />
			</div>
		</AdminProtectedLayout>
	)
} 