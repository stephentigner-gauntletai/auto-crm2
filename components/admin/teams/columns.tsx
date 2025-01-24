import { ColumnDef } from "@tanstack/react-table"
import { Database } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"

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
] 