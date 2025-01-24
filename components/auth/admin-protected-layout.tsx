'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/main-layout';

export function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
	const { profile, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && (!profile || profile.role !== 'admin')) {
			router.push('/');
		}
	}, [profile, isLoading, router]);

	if (isLoading) {
		return (
			<MainLayout>
				<div>Loading...</div>
			</MainLayout>
		);
	}

	if (!profile || profile.role !== 'admin') {
		return null;
	}

	return <MainLayout>{children}</MainLayout>;
} 