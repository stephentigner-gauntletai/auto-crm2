"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { teamUpdateSchema } from "@/lib/validations/team"
import { Database } from "@/lib/database.types"
import { Loader2, Pencil } from "lucide-react"

type Team = Database["public"]["Tables"]["teams"]["Row"]
type FormData = z.infer<typeof teamUpdateSchema>

interface EditTeamDialogProps {
	team: Team
}

export function EditTeamDialog({ team }: EditTeamDialogProps) {
	const [open, setOpen] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()

	const form = useForm<FormData>({
		resolver: zodResolver(teamUpdateSchema),
		defaultValues: {
			name: team.name,
			description: team.description,
		},
	})

	async function onSubmit(data: FormData) {
		try {
			setIsSubmitting(true)
			const supabase = createClient()
			const { error } = await supabase
				.from("teams")
				.update(data)
				.eq("id", team.id)

			if (error) {
				notify.error(error)
				return
			}

			setOpen(false)
			router.refresh()
			notify.success("Team updated successfully")
		} catch (error) {
			console.error("Error updating team:", error)
			notify.error("Failed to update team. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="sm">
					<Pencil className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Team</DialogTitle>
					<DialogDescription>
						Update the team&apos;s name and description.
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
										Saving...
									</>
								) : (
									"Save Changes"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
} 