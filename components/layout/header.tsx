import Link from 'next/link';

export function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<Link href="/" className="font-bold">
					AutoCRM
				</Link>
				<nav className="flex flex-1 items-center justify-end space-x-4">
					<Link href="/tickets" className="text-sm font-medium">
						Tickets
					</Link>
				</nav>
			</div>
		</header>
	);
} 