import { NextResponse } from "next/server";
import { agent } from "@/lib/agent/langgraph/agent";
import { HumanMessage } from "@langchain/core/messages";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
	try {
		// Verify user is authenticated and is staff
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();

		const isStaff = profile?.role === "agent" || profile?.role === "admin";
		if (!isStaff) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		// Get request body
		const { message, threadId } = await request.json();

		// Create stream
		const stream = await agent.stream(
			[new HumanMessage(message)],
			{
				configurable: {
					thread_id: threadId,
				},
			}
		);

		// Create response stream
		const encoder = new TextEncoder();
		const customStream = new ReadableStream({
			async start(controller) {
				try {
					for await (const step of stream) {
						for (const [taskName, update] of Object.entries(step)) {
							// Skip agent task updates
							if (taskName === "agent") continue;
							controller.enqueue(
								encoder.encode(
									JSON.stringify({ taskName, update }) + "\n"
								)
							);
						}
					}
					controller.close();
				} catch (error) {
					controller.error(error);
				}
			},
		});

		// Return streaming response
		return new NextResponse(customStream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		console.error("Error in agent stream:", error);
		return new NextResponse("Internal Server Error", { status: 500 });
	}
} 