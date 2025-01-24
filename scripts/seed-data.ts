import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config()

const dbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const dbServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!dbUrl || !dbServiceKey) {
	throw new Error(
		"Missing environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
	)
}

const db = createClient(dbUrl, dbServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
})

// Sample teams to create
const teams = [
	{
		name: "General Support",
		description: "Handle general customer inquiries and support requests",
	},
	{
		name: "Technical Support",
		description: "Handle technical issues and bug reports",
	},
	{
		name: "Billing Support",
		description: "Handle billing and subscription related inquiries",
	},
]

// Function to get user ID by email
async function getUserIdByEmail(email: string): Promise<string | null> {
	const { data, error } = await db
		.from("profiles")
		.select("id")
		.eq("email", email)
		.single()

	if (error) {
		console.error(`Error fetching user ID for ${email}:`, error)
		return null
	}

	return data?.id || null
}

// Function to create teams and add members
async function seedTeams() {
	console.log("🏢 Creating teams...")
	
	// Get admin user ID for created_by
	const adminId = await getUserIdByEmail("admin@example.com")
	if (!adminId) {
		throw new Error("Admin user not found. Please run seed:users first.")
	}

	// Get agent IDs for team membership
	const agent1Id = await getUserIdByEmail("agent1@example.com")
	const agent2Id = await getUserIdByEmail("agent2@example.com")
	if (!agent1Id || !agent2Id) {
		throw new Error("Agent users not found. Please run seed:users first.")
	}

	const createdTeams = []
	for (const team of teams) {
		// Check if team exists
		const { data: existingTeam } = await db
			.from("teams")
			.select()
			.eq("name", team.name)
			.single()

		let teamData
		if (existingTeam) {
			console.log(`ℹ️  Team ${team.name} already exists, skipping creation...`)
			teamData = existingTeam
		} else {
			// Create team
			const { data: newTeam, error: teamError } = await db
				.from("teams")
				.insert({ 
					name: team.name, 
					description: team.description,
					created_by: adminId
				})
				.select()
				.single()

			if (teamError) {
				console.error(`Error creating team ${team.name}:`, teamError)
				continue
			}

			console.log(`✅ Created team: ${team.name}`)
			teamData = newTeam
		}

		// Add team members (both agents to all teams for testing)
		const teamMembers = [
			{ team_id: teamData.id, user_id: agent1Id },
			{ team_id: teamData.id, user_id: agent2Id }
		]

		for (const member of teamMembers) {
			// Check if member exists
			const { data: existingMember } = await db
				.from("team_members")
				.select()
				.eq("team_id", member.team_id)
				.eq("user_id", member.user_id)
				.single()

			if (!existingMember) {
				const { error: memberError } = await db
					.from("team_members")
					.insert(member)

				if (memberError) {
					console.error(`Error adding member to team ${team.name}:`, memberError)
					continue
				}
				console.log(`✅ Added member to team: ${team.name}`)
			} else {
				console.log(`ℹ️  Member already exists in team ${team.name}, skipping...`)
			}
		}

		createdTeams.push(teamData)
	}

	return createdTeams
}

// Function to create sample tickets
async function seedTickets(createdTeams: any[]) {
	console.log("\n🎫 Creating sample tickets...")

	// Get user IDs
	const customerUserId = await getUserIdByEmail("customer@example.com")
	const agent1UserId = await getUserIdByEmail("agent1@example.com")
	const agent2UserId = await getUserIdByEmail("agent2@example.com")

	if (!customerUserId || !agent1UserId || !agent2UserId) {
		throw new Error("Required users not found. Please run seed:users first.")
	}

	const sampleTickets = [
		{
			title: "Cannot access my account",
			description: "I'm getting an error when trying to log in",
			status: "open",
			priority: "high",
			created_by: customerUserId,
			assigned_to: agent1UserId,
			team_id: createdTeams[0].id, // General Support
		},
		{
			title: "Feature request: Dark mode",
			description: "Would love to have a dark mode option",
			status: "in_progress",
			priority: "low",
			created_by: customerUserId,
			assigned_to: agent2UserId,
			team_id: createdTeams[1].id, // Technical Support
		},
		{
			title: "Billing cycle question",
			description: "When will I be charged for my subscription?",
			status: "waiting_on_customer",
			priority: "medium",
			created_by: customerUserId,
			assigned_to: agent1UserId,
			team_id: createdTeams[2].id, // Billing Support
		},
		{
			title: "App crashes on startup",
			description: "Getting a blank screen when opening the app",
			status: "open",
			priority: "high",
			created_by: customerUserId,
			assigned_to: null, // Unassigned ticket
			team_id: createdTeams[1].id, // Technical Support
		},
		{
			title: "Need to upgrade plan",
			description: "Current plan doesn't meet our needs",
			status: "resolved",
			priority: "medium",
			created_by: customerUserId,
			assigned_to: agent2UserId,
			team_id: createdTeams[2].id, // Billing Support
		},
	]

	for (const ticket of sampleTickets) {
		const { error } = await db.from("tickets").insert({
			...ticket,
			created_at: new Date().toISOString(),
		})

		if (error) {
			console.error(`Error creating ticket "${ticket.title}":`, error)
			continue
		}

		console.log(`✅ Created ticket: ${ticket.title}`)
	}
}

async function seedAll() {
	try {
		const createdTeams = await seedTeams()
		await seedTickets(createdTeams)
		console.log("\n✨ Data seeding completed!")
	} catch (error) {
		console.error("Error seeding data:", error)
		process.exit(1)
	}
}

seedAll() 