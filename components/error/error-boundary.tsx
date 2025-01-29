'use client';

import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { handleError, type AppError } from '@/lib/utils/error-utils';
import logger from '@/lib/utils/logger';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	error: AppError | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error: unknown): State {
		return { error: handleError(error) };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log the error to our logger service
		logger.error('Uncaught error in React component', error, {
			componentStack: errorInfo.componentStack,
		});
	}

	render() {
		const { error } = this.state;
		const { children, fallback } = this.props;

		if (error) {
			if (fallback) {
				return fallback;
			}

			return (
				<Alert variant="destructive" className="my-4">
					<AlertTriangle className="h-4 w-4" />
					<AlertTitle>Something went wrong</AlertTitle>
					<AlertDescription className="mt-2">
						{error.message}
						<div className="mt-2">
							<Button
								variant="outline"
								onClick={() => window.location.reload()}
							>
								Try Again
							</Button>
						</div>
					</AlertDescription>
				</Alert>
			);
		}

		return children;
	}
} 