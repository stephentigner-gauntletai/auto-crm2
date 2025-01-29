import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testEnvironment: 'jest-environment-jsdom',
	moduleNameMapper: {
		// Handle module aliases (if you're using them in tsconfig.json)
		'^@/(.*)$': '<rootDir>/$1',
		// Mock CSS modules
		'\\.css$': 'identity-obj-proxy',
	},
	transform: {
		'^.+\\.(t|j)sx?$': '@swc/jest',
	},
	testPathIgnorePatterns: ['/node_modules/', '/.next/'],
	collectCoverageFrom: [
		'**/*.{js,jsx,ts,tsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/.next/**',
	],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config); 