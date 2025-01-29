'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Menu } from 'lucide-react';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';

export function Header() {
	const { user, signOut, profile } = useAuth();
	const isCustomer = profile?.role === 'customer';

	const NavItems = () => (
		<>
			{user ? (
				<>
					{isCustomer && (
						<>
							<Link href="/dashboard" className="text-sm font-medium">
								Dashboard
							</Link>
							<Link href="/feedback" className="text-sm font-medium">
								Share Feedback
							</Link>
						</>
					)}
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
					<Link href="/register">
						<Button variant="default" size="sm">
							Register
						</Button>
					</Link>
					<Link href="/login">
						<Button variant="ghost" size="sm">
							Login
						</Button>
					</Link>
				</>
			)}
		</>
	);

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center justify-between">
				<Link href="/" className="font-bold">
					AutoCRM
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden md:flex items-center space-x-4">
					<NavItems />
					<ThemeToggle />
				</nav>

				{/* Mobile Navigation */}
				<div className="flex items-center space-x-4 md:hidden">
					<ThemeToggle />
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent>
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
							</SheetHeader>
							<nav className="flex flex-col space-y-4 mt-4">
								<NavItems />
							</nav>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	);
} 