"use client"

import { useState, useEffect, useCallback } from "react"
import { Database } from "@/lib/database.types"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Loader2, UserMinus, UserPlus } from "lucide-react"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface ManageTeamMembersDialogProps {
	teamId: string
	children: React.ReactNode
}

export function ManageTeamMembersDialog({
	teamId,
	children,
}: ManageTeamMembersDialogProps) {
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(true)
	const [members, setMembers] = useState<Profile[]>([])
	const [nonMembers, setNonMembers] = useState<Profile[]>([])

	const loadUsers = useCallback(async () => {
		try {
			setLoading(true)
			const supabase = createClient()

			// Get current team members
			const { data: teamMembers } = await supabase
				.from("team_members")
				.select("user_id")
				.eq("team_id", teamId)

			const memberIds = teamMembers?.map((m) => m.user_id) || []

			// Get all users
			const { data: allUsers } = await supabase
				.from("profiles")
				.select("*")
				.order("email")

			if (allUsers) {
				setMembers(allUsers.filter((u) => memberIds.includes(u.id)))
				setNonMembers(allUsers.filter((u) => !memberIds.includes(u.id)))
			}
		} catch (error) {
			console.error("Error loading users:", error)
		} finally {
			setLoading(false)
		}
	}, [teamId])

	useEffect(() => {
		if (open) {
			loadUsers()
		}
	}, [open, loadUsers])

	async function addMember(userId: string) {
		try {
			const supabase = createClient()
			const { error } = await supabase
				.from("team_members")
				.insert({ team_id: teamId, user_id: userId })

			if (error) throw error

			const user = nonMembers.find((u) => u.id === userId)
			if (user) {
				setMembers([...members, user])
				setNonMembers(nonMembers.filter((u) => u.id !== userId))
			}
		} catch (error) {
			console.error("Error adding team member:", error)
		}
	}

	async function removeMember(userId: string) {
		try {
			const supabase = createClient()
			const { error } = await supabase
				.from("team_members")
				.delete()
				.eq("team_id", teamId)
				.eq("user_id", userId)

			if (error) throw error

			const user = members.find((u) => u.id === userId)
			if (user) {
				setNonMembers([...nonMembers, user])
				setMembers(members.filter((u) => u.id !== userId))
			}
		} catch (error) {
			console.error("Error removing team member:", error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Manage Team Members</DialogTitle>
					<DialogDescription>
						Add or remove members from this team.
					</DialogDescription>
				</DialogHeader>

				{loading ? (
					<div className="flex items-center justify-center p-8">
						<Loader2 className="h-8 w-8 animate-spin" />
					</div>
				) : (
					<div className="grid gap-6">
						<div>
							<h3 className="mb-2 text-sm font-medium">
								Team Members
							</h3>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Email</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{members.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={3}
													className="h-24 text-center"
												>
													No team members.
												</TableCell>
											</TableRow>
										) : (
											members.map((user) => (
												<TableRow key={user.id}>
													<TableCell>
														{user.email}
													</TableCell>
													<TableCell>
														{user.full_name}
													</TableCell>
													<TableCell>
														<Button
															variant="ghost"
															size="sm"
															onClick={() =>
																removeMember(
																	user.id
																)
															}
														>
															<UserMinus className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</div>

						<div>
							<h3 className="mb-2 text-sm font-medium">
								Available Users
							</h3>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Email</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{nonMembers.length === 0 ? (
											<TableRow>
												<TableCell
													colSpan={3}
													className="h-24 text-center"
												>
													No available users.
												</TableCell>
											</TableRow>
										) : (
											nonMembers.map((user) => (
												<TableRow key={user.id}>
													<TableCell>
														{user.email}
													</TableCell>
													<TableCell>
														{user.full_name}
													</TableCell>
													<TableCell>
														<Button
															variant="ghost"
															size="sm"
															onClick={() =>
																addMember(
																	user.id
																)
															}
														>
															<UserPlus className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
} 