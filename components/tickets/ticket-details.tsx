"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { ticketSchema, ticketUpdateSchema } from "@/lib/validations/ticket"
import { Database } from "@/lib/database.types"

type Team = Database["public"]["Tables"]["teams"]["Row"]
type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type Ticket = Database["public"]["Tables"]["tickets"]["Row"] & {
	team: Pick<Team, "id" | "name"> | null
	assignee: Pick<Profile, "id" | "email" | "full_name"> | null
	creator: Pick<Profile, "id" | "email" | "full_name"> | null
}
type FormData = z.infer<typeof ticketUpdateSchema>
type TicketStatus = z.infer<typeof ticketSchema.shape.status>

interface TicketDetailsProps {
	ticket: Ticket
	teams: Team[]
	agents: Profile[]
	isCustomer?: boolean
}

export function TicketDetails({ ticket, teams, agents, isCustomer }: TicketDetailsProps) {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const form = useForm<FormData>({
		resolver: zodResolver(ticketUpdateSchema),
		defaultValues: {
			title: ticket.title,
			description: ticket.description,
			status: ticket.status as TicketStatus,
			priority: ticket.priority as 'low' | 'medium' | 'high' | 'urgent',
			team_id: ticket.team_id,
			assigned_to: ticket.assigned_to,
			internal_notes: ticket.internal_notes || '',
		},
	})

	async function onSubmit(data: FormData) {
		try {
			setLoading(true)
			const supabase = createClient()
			const { error } = await supabase
				.from("tickets")
				.update(data)
				.eq("id", ticket.id)

			if (error) throw error

			router.refresh()
		} catch (error) {
			console.error("Error updating ticket:", error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">
					{isCustomer ? 'Support Ticket Details' : 'Ticket Details'}
				</h1>
				<div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
					<p>
						Created by{" "}
						{ticket.creator?.full_name || ticket.creator?.email}{" "}
						{formatDistanceToNow(new Date(ticket.created_at), {
							addSuffix: true,
						})}
					</p>
					<p className="hidden sm:block">•</p>
					<p>
						Last updated{" "}
						{formatDistanceToNow(new Date(ticket.updated_at), {
							addSuffix: true,
						})}
					</p>
					{!isCustomer && ticket.assignee && (
						<>
							<p className="hidden sm:block">•</p>
							<p>
								Assigned to{" "}
								{ticket.assignee.full_name || ticket.assignee.email}
							</p>
						</>
					)}
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-6"
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input {...field} disabled={isCustomer} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<RichTextEditor
										value={field.value || ''}
										onChange={field.onChange}
										editable={!isCustomer}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{!isCustomer && (
						<>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select status" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="open">Open</SelectItem>
													<SelectItem value="in_progress">In Progress</SelectItem>
													<SelectItem value="resolved">Resolved</SelectItem>
													<SelectItem value="closed">Closed</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="priority"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Priority</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select priority" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="low">Low</SelectItem>
													<SelectItem value="medium">Medium</SelectItem>
													<SelectItem value="high">High</SelectItem>
													<SelectItem value="urgent">Urgent</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="team_id"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Assign to Team</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value || undefined}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a team" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{teams.map((team) => (
														<SelectItem
															key={team.id}
															value={team.id}
														>
															{team.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="assigned_to"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Assign to Agent</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value || undefined}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select an agent" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{agents.map((agent) => (
														<SelectItem
															key={agent.id}
															value={agent.id}
														>
															{agent.full_name || agent.email}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="internal_notes"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Internal Notes</FormLabel>
										<FormControl>
											<RichTextEditor
												value={field.value || ''}
												onChange={field.onChange}
												editable={!isCustomer}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}
					<Button type="submit" disabled={loading || isCustomer}>
						{loading ? 'Saving...' : 'Save Changes'}
					</Button>
				</form>
			</Form>
		</div>
	)
} 