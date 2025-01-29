import '@testing-library/jest-dom';

// Extend Jest matchers
declare global {
	namespace jest {
		interface Matchers<R> {
			toBeInTheDocument(): R;
		}
	}
}

// Mock next/navigation
jest.mock('next/navigation', () => {
	const useRouter = jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		prefetch: jest.fn(),
		back: jest.fn(),
	}));

	const useSearchParams = jest.fn(() => ({
		get: jest.fn(),
		set: jest.fn(),
	}));

	const usePathname = jest.fn(() => '');

	return { useRouter, useSearchParams, usePathname };
});

// Mock next-themes
jest.mock('next-themes', () => ({
	useTheme: jest.fn(() => ({
		theme: 'light',
		setTheme: jest.fn(),
	})),
})); 