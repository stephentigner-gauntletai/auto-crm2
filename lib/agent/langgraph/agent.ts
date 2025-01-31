import { type BaseMessageLike } from "@langchain/core/messages";
import { entrypoint, addMessages, MemorySaver, getPreviousState } from "@langchain/langgraph";
import { callModel, callTool } from "./tasks";

// Initialize memory saver for thread-level persistence
const checkpointer = new MemorySaver();

export const agent = entrypoint({
	name: "agent",
	checkpointer,
}, async (messages: BaseMessageLike[]) => {
	// Get previous messages from the thread if they exist
	const previous = getPreviousState<BaseMessageLike[]>() ?? [];
	let currentMessages = addMessages(previous, messages);
	let llmResponse = await callModel(currentMessages);

	while (true) {
		if (!llmResponse.tool_calls?.length) {
			break;
		}

		// Execute tools
		const toolResults = await Promise.all(
			llmResponse.tool_calls.map((toolCall) => {
				return callTool(toolCall);
			})
		);

		// Append to message list
		currentMessages = addMessages(currentMessages, [llmResponse, ...toolResults]);

		// Call model again
		llmResponse = await callModel(currentMessages);
	}

	// Append final response for storage
	currentMessages = addMessages(currentMessages, llmResponse);

	return entrypoint.final({
		value: llmResponse,
		save: currentMessages,
	});
}); 