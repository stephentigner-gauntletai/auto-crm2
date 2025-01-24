'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, UsersRound } from "lucide-react"

const items = [
	{
		title: "Overview",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{
		title: "Users",
		href: "/admin/users",
		icon: Users,
	},
	{
		title: "Teams",
		href: "/admin/teams",
		icon: UsersRound,
	},
]

export function AdminNav() {
	const pathname = usePathname();

	return (
		<nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className={cn(
						'justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground',
						pathname === item.href ? 'bg-accent' : 'transparent'
					)}
				>
					{item.title}
				</Link>
			))}
		</nav>
	);
} 