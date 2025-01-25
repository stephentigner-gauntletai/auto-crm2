"use client"

import { useState } from "react"
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	SortingState,
	getSortedRowModel,
} from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { Users } from "lucide-react"

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Database } from "@/lib/database.types"
import { ManageTeamMembersDialog } from "./manage-team-members-dialog"
import { EditTeamDialog } from "./edit-team-dialog"

type Team = Database["public"]["Tables"]["teams"]["Row"]

const columns: ColumnDef<Team>[] = [
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

interface DataTableProps {
	data: Team[]
}

export function TeamList({ data }: DataTableProps) {
	const [sorting, setSorting] = useState<SortingState>([])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
		},
	})

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								)
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								No teams found.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	)
} 