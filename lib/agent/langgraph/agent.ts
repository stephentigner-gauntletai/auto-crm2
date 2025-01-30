import { type BaseMessageLike } from "@langchain/core/messages";
import { entrypoint, addMessages } from "@langchain/langgraph";
import { callModel, callTool } from "./tasks";

export const agent = entrypoint({
	name: "agent",
}, async (messages: BaseMessageLike[]) => {
	let currentMessages = messages;
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

	return llmResponse;
}); 