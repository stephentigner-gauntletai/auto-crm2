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
			{items.map((item) => {
				const Icon = item.icon;
				return (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							'flex items-center gap-3 justify-start px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent hover:text-accent-foreground',
							'transition-colors duration-200',
							pathname === item.href ? 'bg-accent' : 'transparent'
						)}
					>
						<Icon className="h-4 w-4" />
						<span className="hidden sm:inline">{item.title}</span>
						<span className="sm:hidden" aria-hidden="true">
							<span className="sr-only">{item.title}</span>
							{item.title[0]}
						</span>
					</Link>
				);
			})}
		</nav>
	);
} 