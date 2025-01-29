"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { ticketSchema } from "@/lib/validations/ticket"
import { notify } from "@/lib/utils/notifications"
import { Database } from "@/lib/database.types"

type Team = Database["public"]["Tables"]["teams"]["Row"]
type Profile = Database["public"]["Tables"]["profiles"]["Row"]

// Create a subset of ticketSchema for staff ticket creation
const staffTicketSchema = ticketSchema.pick({
	title: true,
	description: true,
	team_id: true,
	assigned_to: true,
}).extend({
	status: z.literal("open").default("open"),
})

type FormData = z.infer<typeof staffTicketSchema>

interface CreateTicketFormProps {
	teams: Team[]
	agents: Profile[]
}

export function CreateTicketForm({ teams, agents }: CreateTicketFormProps) {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const form = useForm<FormData>({
		resolver: zodResolver(staffTicketSchema),
		defaultValues: {
			title: "",
			description: "",
			status: "open",
			team_id: null,
			assigned_to: null,
		},
	})

	async function onSubmit(data: FormData) {
		try {
			setLoading(true)
			const supabase = createClient()

			// Get the current user's ID
			const { data: { user }, error: userError } = await supabase.auth.getUser()
			if (userError) {
				notify.error("Authentication error. Please try again.");
				return;
			}
			if (!user) {
				notify.error("You must be logged in to create a ticket.");
				return;
			}

			const { error } = await supabase.from("tickets").insert({
				...data,
				created_by: user.id,
			})

			if (error) {
				notify.error(error);
				return;
			}

			notify.success("Ticket created successfully");
			form.reset()
			router.push("/tickets")
			router.refresh()
		} catch (error) {
			console.error("Error creating ticket:", error)
			notify.error("Failed to create ticket. Please try again.");
		} finally {
			setLoading(false)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input
									placeholder="Enter ticket title"
									{...field}
								/>
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
									value={field.value}
									onChange={field.onChange}
									placeholder="Enter ticket description"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="grid grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="team_id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Assign to Team</FormLabel>
								<Select
									onValueChange={field.onChange}
									value={field.value || undefined}
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
									value={field.value || undefined}
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
												{agent.full_name ||
													agent.email}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex justify-end">
					<Button type="submit" disabled={loading}>
						{loading ? "Creating..." : "Create Ticket"}
					</Button>
				</div>
			</form>
		</Form>
	)
} 