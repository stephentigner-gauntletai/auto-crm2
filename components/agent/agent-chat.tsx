"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BaseMessage, HumanMessage, isAIMessage } from "@langchain/core/messages";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/utils/notifications";

interface AgentChatProps {
	userId: string;
	userRole: 'agent' | 'admin';
}

interface ChatMessage {
	type: 'human' | 'ai' | 'tool';
	content: string;
	tool_calls?: any[];
}

interface ChatThread {
	id: string;
	messages: ChatMessage[];
	lastMessage: string;
	timestamp: number;
}

export function AgentChat({ userId, userRole }: AgentChatProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [threads, setThreads] = useState<ChatThread[]>([]);
	const [currentThread, setCurrentThread] = useState<string | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	// Load thread from URL if present
	useEffect(() => {
		const threadId = searchParams.get("thread");
		if (threadId) {
			setCurrentThread(threadId);
			// Load messages for this thread from storage
			const storedThreads = localStorage.getItem("agent_threads");
			if (storedThreads) {
				const threads = JSON.parse(storedThreads);
				const thread = threads.find((t: ChatThread) => t.id === threadId);
				if (thread) {
					setMessages(thread.messages);
				}
			}
		}
	}, [searchParams]);

	// Load threads from storage
	useEffect(() => {
		const storedThreads = localStorage.getItem("agent_threads");
		if (storedThreads) {
			setThreads(JSON.parse(storedThreads));
		}
	}, []);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const startNewThread = () => {
		const threadId = nanoid();
		router.push(`/agent?thread=${threadId}`);
		setCurrentThread(threadId);
		setMessages([]);
		setInput("");
	};

	const saveThread = (threadId: string, messages: ChatMessage[]) => {
		const lastMessage = messages[messages.length - 1]?.content || "";
		const thread: ChatThread = {
			id: threadId,
			messages,
			lastMessage,
			timestamp: Date.now(),
		};

		const updatedThreads = [
			thread,
			...threads.filter((t) => t.id !== threadId),
		];
		setThreads(updatedThreads);
		localStorage.setItem("agent_threads", JSON.stringify(updatedThreads));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!input.trim() || !currentThread) return;

		const userMessage: ChatMessage = { 
			type: "human",
			content: input
		};
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsLoading(true);

		try {
			const response = await fetch(`${window.location.origin}/api/agent`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: input,
					threadId: currentThread,
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Failed to get response from agent: ${errorText}`);
			}

			const reader = response.body?.getReader();
			if (!reader) {
				throw new Error("No response stream available");
			}

			const decoder = new TextDecoder();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split("\n").filter(Boolean);

				for (const line of lines) {
					const { taskName, update } = JSON.parse(line);
					if (taskName === "agent") continue;

					console.log('Received message:', update);

					const message = update as any;
					let messageContent = '';

					// Handle different message content formats
					if (typeof message.content === 'string') {
						messageContent = message.content;
					} else if (message.kwargs?.content) {
						messageContent = message.kwargs.content;
					} else if (message.content?.text) {
						messageContent = message.content.text;
					} else {
						messageContent = JSON.stringify(message.content);
					}

					console.log('Processed content:', messageContent);

					const chatMessage: ChatMessage = {
						type: message.type === "ai" ? 'ai' : 
							message.type === "human" ? 'human' : 'tool',
						content: messageContent,
					};

					if (message.type === "ai" && message.additional_kwargs?.tool_calls?.length) {
						chatMessage.tool_calls = message.additional_kwargs.tool_calls;
					}

					console.log('Final chat message:', chatMessage);
					setMessages((prev) => [...prev, chatMessage]);
				}
			}
		} catch (error) {
			console.error("Error in agent chat:", error);
			notify.error("Failed to process your request. Please try again.");
		} finally {
			setIsLoading(false);
			saveThread(currentThread, messages);
		}
	};

	return (
		<Tabs defaultValue="chat" className="h-[600px] flex flex-col">
			<TabsList>
				<TabsTrigger value="chat">Chat</TabsTrigger>
				<TabsTrigger value="history">History</TabsTrigger>
			</TabsList>
			<TabsContent value="chat" className="flex-1 flex flex-col">
				<div className="flex justify-end mb-4">
					<Button onClick={startNewThread}>New Chat</Button>
				</div>
				<ScrollArea className="flex-1 pr-4">
					<div className="space-y-4">
						{messages.map((message, i) => (
							<div
								key={i}
								className={cn(
									"p-4 rounded-lg",
									message.type === "human"
										? "bg-primary text-primary-foreground ml-8"
										: "bg-muted mr-8"
								)}
							>
								<div className="text-sm font-medium mb-1">
									{message.type === "human" ? "You" : "Assistant"}
								</div>
								<div className="text-sm whitespace-pre-wrap">
									{message.content}
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				</ScrollArea>
				<form onSubmit={handleSubmit} className="mt-4">
					<div className="flex gap-2">
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Type your message..."
							disabled={isLoading || !currentThread}
						/>
						<Button type="submit" disabled={isLoading || !currentThread}>
							Send
						</Button>
					</div>
				</form>
			</TabsContent>
			<TabsContent value="history" className="flex-1">
				<ScrollArea className="h-full">
					<div className="space-y-4">
						{threads.map((thread) => (
							<Button
								key={thread.id}
								variant="ghost"
								className="w-full justify-start"
								onClick={() =>
									router.push(`/agent?thread=${thread.id}`)
								}
							>
								<div className="text-left">
									<div className="font-medium">
										{thread.lastMessage.slice(0, 50)}
										{thread.lastMessage.length > 50 ? "..." : ""}
									</div>
									<div className="text-sm text-muted-foreground">
										{new Date(thread.timestamp).toLocaleString()}
									</div>
								</div>
							</Button>
						))}
					</div>
				</ScrollArea>
			</TabsContent>
		</Tabs>
	);
} 
