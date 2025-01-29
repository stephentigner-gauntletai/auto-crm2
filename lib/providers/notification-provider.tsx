'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export function NotificationProvider() {
	const { theme } = useTheme();

	return (
		<Toaster
			theme={theme as 'light' | 'dark' | 'system'}
			className="dark:hidden"
			toastOptions={{
				style: {
					background: 'var(--background)',
					color: 'var(--foreground)',
					border: '1px solid var(--border)',
				},
			}}
		/>
	);
} 