'use client';

import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
	isLoading: boolean;
	children: React.ReactNode;
	className?: string;
	spinnerSize?: 'sm' | 'default' | 'lg';
}

export function LoadingOverlay({
	isLoading,
	children,
	className,
	spinnerSize = 'default',
}: LoadingOverlayProps) {
	return (
		<div className={cn('relative', className)}>
			{children}
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
					<LoadingSpinner size={spinnerSize} />
				</div>
			)}
		</div>
	);
}