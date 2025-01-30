import {
	type BaseMessageLike,
	AIMessage,
	ToolMessage,
} from "@langchain/core/messages";
import { type ToolCall } from "@langchain/core/messages/tool";
import { task } from "@langchain/langgraph";
import { model, tools } from "./tools";

// Create a map of tools by name for easy lookup
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));

// Task to call the model with the current messages
export const callModel = task(
	"callModel",
	async (messages: BaseMessageLike[]) => {
		const response = await model.bindTools(tools).invoke(messages);
		return response;
	}
);

// Task to execute a tool call and return the result as a tool message
export const callTool = task(
	"callTool",
	async (toolCall: ToolCall): Promise<ToolMessage> => {
		const tool = toolsByName[toolCall.name];
		if (!tool) {
			throw new Error(`Tool ${toolCall.name} not found`);
		}
		// Use the tool's invoke method directly which will handle the proper typing
		return tool.invoke(toolCall);
	}
); 