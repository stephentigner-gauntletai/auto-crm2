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
import { createTicketSchema } from "@/lib/validations/ticket"

type FormData = z.infer<typeof createTicketSchema>

export function CustomerTicketForm() {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const form = useForm<FormData>({
		resolver: zodResolver(createTicketSchema),
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
			const { data: { user } } = await supabase.auth.getUser()
			if (!user) {
				throw new Error("User not authenticated")
			}

			const { error } = await supabase.from("tickets").insert({
				...data,
				created_by: user.id,
			})

			if (error) throw error

			form.reset()
			router.push("/tickets")
			router.refresh()
		} catch (error) {
			console.error("Error creating ticket:", error)
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