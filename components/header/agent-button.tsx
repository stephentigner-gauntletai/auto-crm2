"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MessageSquareMore } from "lucide-react";

interface AgentButtonProps {
	isStaff: boolean;
}

export function AgentButton({ isStaff }: AgentButtonProps) {
	const router = useRouter();

	if (!isStaff) return null;

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => router.push("/agent")}
			title="AI Assistant"
		>
			<MessageSquareMore className="h-5 w-5" />
		</Button>
	);
} 