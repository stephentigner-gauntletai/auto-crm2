import "@/app/globals.css"
import { Inter } from "next/font/google"
import { type Metadata } from 'next';

import { AuthProvider } from "@/lib/auth/auth-context"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { LoadingProvider } from "@/lib/providers/loading-provider"
import { ErrorBoundary } from '@/components/error/error-boundary'

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
						<LoadingProvider>
							<AuthProvider>{children}</AuthProvider>
						</LoadingProvider>
					</ErrorBoundary>
				</ThemeProvider>
			</body>
		</html>
	)
}
