import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

// Create a rate limit counter using the Edge Runtime
const rateLimit = {
	tokenCount: new Map<string, number>(),
	lastReset: new Map<string, number>(),
};

function getRateLimit(identifier: string, isAuthRoute: boolean) {
	const now = Date.now();
	const window = isAuthRoute ? 30000 : 10000; // 30 seconds or 10 seconds
	const limit = isAuthRoute ? 5 : 10; // 5 requests or 10 requests

	// Reset counter if window has passed
	const lastReset = rateLimit.lastReset.get(identifier) ?? 0;
	if (now - lastReset > window) {
		rateLimit.tokenCount.set(identifier, 0);
		rateLimit.lastReset.set(identifier, now);
	}

	// Get current count
	const currentCount = rateLimit.tokenCount.get(identifier) ?? 0;
	
	// Increment count
	rateLimit.tokenCount.set(identifier, currentCount + 1);

	return {
		limit,
		remaining: Math.max(0, limit - (currentCount + 1)),
		success: currentCount < limit,
		reset: lastReset + window,
	};
}

export async function middleware(request: NextRequest) {
	// Skip rate limiting for static files and images
	if (request.nextUrl.pathname.startsWith('/_next') || 
		request.nextUrl.pathname.startsWith('/static') ||
		request.nextUrl.pathname === '/favicon.ico') {
		return await updateSession(request);
	}

	try {
		const ip = request.headers.get('x-forwarded-for') ?? 
			request.headers.get('x-real-ip') ?? 
			'127.0.0.1';

		// Use different rate limits based on the route
		const isAuthRoute = request.nextUrl.pathname.startsWith('/auth');
		const identifier = `${ip}:${request.nextUrl.pathname}`;
		
		const result = getRateLimit(identifier, isAuthRoute);

		if (!result.success) {
			return new NextResponse('Too Many Requests', {
				status: 429,
				headers: {
					'X-RateLimit-Limit': result.limit.toString(),
					'X-RateLimit-Remaining': result.remaining.toString(),
					'X-RateLimit-Reset': result.reset.toString(),
					'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
				},
			});
		}

		const response = await updateSession(request);

		// Add rate limit headers to the response
		response.headers.set('X-RateLimit-Limit', result.limit.toString());
		response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
		response.headers.set('X-RateLimit-Reset', result.reset.toString());

		return response;
	} catch (error) {
		// If rate limiting fails, still allow the request but log the error
		console.error('Rate limiting error:', error);
		return await updateSession(request);
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico).*)',
	],
	runtime: 'edge',
}; 