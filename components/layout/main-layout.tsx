import { Header } from './header';

interface MainLayoutProps {
	children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className="relative flex min-h-screen flex-col">
			<Header />
			<main className="flex-1 container py-6">
				{children}
			</main>
		</div>
	);
} 