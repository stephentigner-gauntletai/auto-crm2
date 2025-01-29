'use client';

import {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
} from 'react';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

interface LoadingContextType {
	isLoading: boolean;
	startLoading: () => void;
	stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
	const [isLoading, setIsLoading] = useState(false);

	const startLoading = useCallback(() => {
		setIsLoading(true);
	}, []);

	const stopLoading = useCallback(() => {
		setIsLoading(false);
	}, []);

	return (
		<LoadingContext.Provider
			value={{
				isLoading,
				startLoading,
				stopLoading,
			}}
		>
			<LoadingOverlay isLoading={isLoading}>{children}</LoadingOverlay>
		</LoadingContext.Provider>
	);
}

export function useLoading() {
	const context = useContext(LoadingContext);
	if (context === undefined) {
		throw new Error('useLoading must be used within a LoadingProvider');
	}
	return context;
} 