"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { notify } from "@/lib/utils/notifications"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { teamSchema } from "@/lib/validations/team"

type FormData = z.infer<typeof teamSchema>

export function CreateTeamDialog() {
	const [open, setOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()
	const supabase = createClient()

	const form = useForm<FormData>({
		resolver: zodResolver(teamSchema),
		defaultValues: {
			name: "",
			description: null,
			created_by: "",
		},
	})

	async function onSubmit(data: FormData) {
		try {
			setIsSubmitting(true)
			const { data: { user }, error: userError } = await supabase.auth.getUser()
			if (userError) {
				notify.error("Failed to get user information. Please try again.")
				return
			}
			if (!user) {
				notify.error("No user found. Please sign in again.")
				return
			}

			const { error } = await supabase.from("teams").insert({
				...data,
				created_by: user.id,
			})

			if (error) {
				notify.error(error)
				return
			}

			setOpen(false)
			form.reset()
			router.refresh()
			notify.success("Team created successfully")
		} catch (error) {
			console.error("Error creating team:", error)
			notify.error("Failed to create team. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Create Team</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create Team</DialogTitle>
					<DialogDescription>
						Create a new team to organize users and manage access.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter team name"
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
										<Textarea
											placeholder="Enter team description (optional)"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button 
								type="submit"
								disabled={isSubmitting}
							>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Creating...
									</>
								) : (
									"Create"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
} 