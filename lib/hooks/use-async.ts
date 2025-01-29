import { useState, useCallback } from 'react';
import { handleError, type AppError } from '@/lib/utils/error-utils';

interface AsyncState<T> {
	data: T | null;
	error: AppError | null;
	isLoading: boolean;
}

export function useAsync<T>() {
	const [state, setState] = useState<AsyncState<T>>({
		data: null,
		error: null,
		isLoading: false,
	});

	const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
		setState((prevState) => ({
			...prevState,
			isLoading: true,
			error: null,
		}));

		try {
			const data = await asyncFunction();
			setState({
				data,
				error: null,
				isLoading: false,
			});
			return data;
		} catch (error) {
			const appError = handleError(error);
			setState({
				data: null,
				error: appError,
				isLoading: false,
			});
			throw appError;
		}
	}, []);

	const reset = useCallback(() => {
		setState({
			data: null,
			error: null,
			isLoading: false,
		});
	}, []);

	return {
		...state,
		execute,
		reset,
	};
} 