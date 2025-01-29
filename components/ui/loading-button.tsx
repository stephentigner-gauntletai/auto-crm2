'use client';

import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface LoadingButtonProps extends ButtonProps {
	isLoading?: boolean;
	loadingText?: string;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
	({ children, isLoading, loadingText, disabled, ...props }, ref) => {
		return (
			<Button
				ref={ref}
				disabled={isLoading || disabled}
				{...props}
			>
				{isLoading ? (
					<>
						<LoadingSpinner size="sm" className="mr-2" />
						{loadingText || children}
					</>
				) : (
					children
				)}
			</Button>
		);
	}
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton }; 