import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from '@/lib/utils/logger';

export async function apiLogger(request: NextRequest) {
	const startTime = Date.now();
	const requestId = crypto.randomUUID();

	// Log the request
	logger.info(`API Request ${requestId}`, {
		method: request.method,
		url: request.url,
		headers: Object.fromEntries(request.headers),
	});

	try {
		const response = await NextResponse.next();
		const duration = Date.now() - startTime;

		// Log the response
		logger.info(`API Response ${requestId}`, {
			status: response.status,
			duration: `${duration}ms`,
			headers: Object.fromEntries(response.headers),
		});

		return response;
	} catch (error) {
		const duration = Date.now() - startTime;

		// Log the error
		logger.error(
			`API Error ${requestId}`,
			error instanceof Error ? error : new Error('Unknown error'),
			{
				duration: `${duration}ms`,
			}
		);

		throw error;
	}
}

export const config = {
	matcher: '/api/:path*',
}; 