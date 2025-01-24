'use client';

import { useRequiredAuth } from '@/lib/auth/use-required-auth';
import { MainLayout } from '@/components/layout/main-layout';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
	const { isLoading } = useRequiredAuth();

	if (isLoading) {
		return (
			<MainLayout>
				<div>Loading...</div>
			</MainLayout>
		);
	}

	return <MainLayout>{children}</MainLayout>;
} 