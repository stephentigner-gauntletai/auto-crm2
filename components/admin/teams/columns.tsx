import { ColumnDef } from "@tanstack/react-table"
import { Database } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { ManageTeamMembersDialog } from "./manage-team-members-dialog"
import { EditTeamDialog } from "./edit-team-dialog"

type Team = Database["public"]["Tables"]["teams"]["Row"]

export const columns: ColumnDef<Team>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "description",
		header: "Description",
	},
	{
		accessorKey: "created_at",
		header: "Created",
		cell: ({ row }) => {
			const date = new Date(row.getValue("created_at"))
			return formatDistanceToNow(date, { addSuffix: true })
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const team = row.original

			return (
				<div className="flex items-center gap-2">
					<EditTeamDialog team={team} />
					<ManageTeamMembersDialog teamId={team.id}>
						<Button variant="outline" size="sm">
							<Users className="mr-2 h-4 w-4" />
							Manage Members
						</Button>
					</ManageTeamMembersDialog>
				</div>
			)
		},
	},
] 