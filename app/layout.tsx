import "@/app/globals.css"
import { Inter } from "next/font/google"
import { type Metadata } from 'next';

import { AuthProvider } from "@/lib/auth/auth-context"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { ErrorBoundary } from '@/components/error/error-boundary'
import { Header } from '@/components/layout/header'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
	title: "AutoCRM",
	description: "Customer support ticket management system",
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<ErrorBoundary>
						<AuthProvider>
							<div className="relative min-h-screen flex flex-col">
								<Header />
								<main className="flex-1">{children}</main>
							</div>
						</AuthProvider>
					</ErrorBoundary>
				</ThemeProvider>
			</body>
		</html>
	)
}
