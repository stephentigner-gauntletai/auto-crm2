'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function LoadingPage() {
	return (
		<div className="flex min-h-[400px] w-full items-center justify-center">
			<LoadingSpinner size="lg" />
		</div>
	);
} 