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
	FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { createClient } from "@/lib/supabase/client"
import { ticketSchema } from "@/lib/validations/ticket"
import { notify } from "@/lib/utils/notifications"

// Create a subset of ticketSchema for customer ticket creation
const customerTicketSchema = ticketSchema.pick({
	title: true,
	description: true,
}).extend({
	status: z.literal("open").default("open"),
})

type FormData = z.infer<typeof customerTicketSchema>

export function CustomerTicketForm() {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const form = useForm<FormData>({
		resolver: zodResolver(customerTicketSchema),
		defaultValues: {
			title: "",
			description: "",
			status: "open",
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
				notify.error("You must be logged in to submit a ticket.");
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

			notify.success("Support request submitted successfully");
			form.reset()
			router.push("/tickets")
			router.refresh()
		} catch (error) {
			console.error("Error creating ticket:", error)
			notify.error("Failed to submit support request. Please try again.");
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
							<FormLabel>What&apos;s the issue?</FormLabel>
							<FormDescription>
								Give your support request a clear, brief title
							</FormDescription>
							<FormControl>
								<Input
									placeholder="e.g., 'Cannot access my account' or 'Need help with billing'"
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
							<FormLabel>Describe your issue in detail</FormLabel>
							<FormDescription>
								Please provide as much relevant information as possible to help us assist you better
							</FormDescription>
							<FormControl>
								<RichTextEditor
									value={field.value}
									onChange={field.onChange}
									placeholder="Include any relevant details, steps to reproduce the issue, or error messages you're seeing..."
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-end">
					<Button type="submit" disabled={loading}>
						{loading ? "Submitting..." : "Submit Support Request"}
					</Button>
				</div>
			</form>
		</Form>
	)
} 