// Mock modules first
jest.mock('@/lib/utils/logger', () => ({
	logger: {
		error: jest.fn(),
	},
}));

jest.mock('@/lib/utils/error-reporting', () => ({
	reportError: jest.fn(),
}));

jest.mock('lucide-react', () => ({
	AlertTriangle: () => <div data-testid="alert-triangle-icon" />,
}));

// Then import modules
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../error-boundary';

// Get mocked functions
const mockError = jest.spyOn(jest.requireMock('@/lib/utils/logger').logger, 'error');
const mockReportError = jest.spyOn(jest.requireMock('@/lib/utils/error-reporting'), 'reportError');

describe('ErrorBoundary', () => {
	const ThrowError = () => {
		throw new Error('Test error');
	};

	beforeEach(() => {
		// Clear console.error to avoid noise in test output
		jest.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders children when there is no error', () => {
		const { container } = render(
			<ErrorBoundary>
				<div>Test content</div>
			</ErrorBoundary>
		);

		expect(container).toHaveTextContent('Test content');
	});

	it('renders error UI when there is an error', () => {
		render(
			<ErrorBoundary>
				<ThrowError />
			</ErrorBoundary>
		);

		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
		expect(screen.getByTestId('alert-triangle-icon')).toBeInTheDocument();
		expect(mockError).toHaveBeenCalled();
		expect(mockReportError).toHaveBeenCalled();
	});

	it('renders fallback UI when provided and there is an error', () => {
		render(
			<ErrorBoundary fallback={<div>Custom error UI</div>}>
				<ThrowError />
			</ErrorBoundary>
		);

		expect(screen.getByText('Custom error UI')).toBeInTheDocument();
		expect(mockError).toHaveBeenCalled();
		expect(mockReportError).toHaveBeenCalled();
	});
}); 