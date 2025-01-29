import { PostgrestError } from '@supabase/supabase-js';

// Standard error types for the application
export type AppError = {
	code: string;
	message: string;
	details?: unknown;
};

// Error codes for different types of errors
export const ErrorCodes = {
	AUTHENTICATION: 'AUTH_ERROR',
	DATABASE: 'DB_ERROR',
	VALIDATION: 'VALIDATION_ERROR',
	NETWORK: 'NETWORK_ERROR',
	UNKNOWN: 'UNKNOWN_ERROR',
} as const;

// Convert Supabase errors to consistent app errors
export function handleSupabaseError(error: PostgrestError | null): AppError {
	if (!error) {
		return {
			code: ErrorCodes.UNKNOWN,
			message: 'An unknown error occurred',
		};
	}

	// Handle specific Supabase error codes
	switch (error.code) {
		case '23505': // unique_violation
			return {
				code: ErrorCodes.DATABASE,
				message: 'This record already exists',
				details: error.details,
			};
		case '23503': // foreign_key_violation
			return {
				code: ErrorCodes.DATABASE,
				message: 'Related record not found',
				details: error.details,
			};
		case '42P01': // undefined_table
			return {
				code: ErrorCodes.DATABASE,
				message: 'Database configuration error',
				details: error.details,
			};
		default:
			return {
				code: ErrorCodes.DATABASE,
				message: error.message,
				details: error.details,
			};
	}
}

// Convert any error to a consistent app error
export function handleError(error: unknown): AppError {
	// Handle known error types
	if (error instanceof Error) {
		if ('code' in error && typeof error.code === 'string') {
			// Handle Supabase errors
			if ('details' in error && 'hint' in error && 'message' in error) {
				return handleSupabaseError(error as PostgrestError);
			}
		}

		// Handle standard Error objects
		return {
			code: ErrorCodes.UNKNOWN,
			message: error.message,
			details: error.stack,
		};
	}

	// Handle string errors
	if (typeof error === 'string') {
		return {
			code: ErrorCodes.UNKNOWN,
			message: error,
		};
	}

	// Handle unknown error types
	return {
		code: ErrorCodes.UNKNOWN,
		message: 'An unexpected error occurred',
		details: error,
	};
}

// Get user-friendly error message
export function getErrorMessage(error: AppError): string {
	switch (error.code) {
		case ErrorCodes.AUTHENTICATION:
			return 'Please sign in to continue';
		case ErrorCodes.DATABASE:
			return error.message || 'Database operation failed';
		case ErrorCodes.VALIDATION:
			return error.message || 'Please check your input';
		case ErrorCodes.NETWORK:
			return 'Network connection error. Please try again';
		default:
			return error.message || 'An unexpected error occurred';
	}
}

// Check if error should be reported to error tracking service
export function shouldReportError(error: AppError): boolean {
	// Don't report validation or auth errors
	if (error.code === ErrorCodes.VALIDATION || error.code === ErrorCodes.AUTHENTICATION) {
		return false;
	}

	return true;
} 