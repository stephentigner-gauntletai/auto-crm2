interface ErrorWithMessage {
	message: string;
	stack?: string;
	cause?: unknown;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as Record<string, unknown>).message === 'string'
	);
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
	if (isErrorWithMessage(maybeError)) return maybeError;

	try {
		return new Error(JSON.stringify(maybeError));
	} catch {
		// fallback in case there's an error stringifying the maybeError
		// like with circular references for example.
		return new Error(String(maybeError));
	}
}

export function reportError(error: unknown, context?: Record<string, unknown>) {
	const errorWithMessage = toErrorWithMessage(error);

	// In development, log to console
	if (process.env.NODE_ENV === 'development') {
		console.error('Error:', errorWithMessage);
		if (context) console.error('Context:', context);
		return;
	}

	// In production, errors will be automatically captured by Vercel
	console.error('Error:', {
		error: errorWithMessage,
		context: {
			...context,
			timestamp: new Date().toISOString(),
			stack: errorWithMessage.stack,
		},
	});
} 
