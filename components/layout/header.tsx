'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export function Header() {
	const { user, signOut, profile } = useAuth();

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<Link href="/" className="font-bold">
					AutoCRM
				</Link>
				<nav className="flex flex-1 items-center justify-end space-x-4">
					{user ? (
						<>
							<Link href="/tickets" className="text-sm font-medium">
								Tickets
							</Link>
							{profile?.role === 'admin' && (
								<Link href="/admin" className="text-sm font-medium">
									Admin
								</Link>
							)}
							<Link href="/profile" className="text-sm font-medium">
								Profile
							</Link>
							<span className="text-sm text-muted-foreground">
								{profile?.email}
							</span>
							<ThemeToggle />
							<Button
								variant="ghost"
								size="sm"
								onClick={() => signOut()}
							>
								Logout
							</Button>
						</>
					) : (
						<>
							<ThemeToggle />
							<Link href="/login">
								<Button variant="ghost" size="sm">
									Login
								</Button>
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
} 