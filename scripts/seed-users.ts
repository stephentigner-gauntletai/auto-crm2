import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error(
		"Missing environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
	)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
})

const testUsers = [
	{
		email: "admin@example.com",
		password: "admin123!@#",
		full_name: "System Admin",
		role: "admin",
	},
	{
		email: "agent1@example.com",
		password: "agent123!@#",
		full_name: "Test Agent 1",
		role: "agent",
	},
	{
		email: "agent2@example.com",
		password: "agent123!@#",
		full_name: "Test Agent 2",
		role: "agent",
	},
	{
		email: "customer@example.com",
		password: "customer123!@#",
		full_name: "Test Customer",
		role: "customer",
	},
]

async function seedUsers() {
	try {
		console.log("🌱 Starting user seeding...")

		for (const user of testUsers) {
			// Create the user in Supabase Auth
			const { data: authData, error: authError } = await supabase.auth.admin
				.createUser({
					email: user.email,
					password: user.password,
					email_confirm: true,
					user_metadata: {
						full_name: user.full_name,
						role: user.role,
					},
				})

			if (authError) {
				if (authError.message.includes("already exists")) {
					console.log(`⚠️  User ${user.email} already exists, skipping...`)
					continue
				}
				throw authError
			}

			console.log(`✅ Created user: ${user.email}`)
		}

		console.log("✨ User seeding completed!")
		console.log("\nTest accounts created:")
		testUsers.forEach((user) => {
			console.log(`
Email: ${user.email}
Password: ${user.password}
Role: ${user.role}
---`)
		})
	} catch (error) {
		console.error("Error seeding users:", error)
		process.exit(1)
	}
}

seedUsers() 