'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
	{
		title: 'Overview',
		href: '/admin',
	},
	{
		title: 'Users',
		href: '/admin/users',
	},
	{
		title: 'Teams',
		href: '/admin/teams',
	},
];

export function AdminNav() {
	const pathname = usePathname();

	return (
		<nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
			{navItems.map((item) => (
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