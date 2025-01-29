import { z } from 'zod';

// Common validation patterns
export const patterns = {
	phone: /^\+?[1-9]\d{1,14}$/, // E.164 format
	password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
	username: /^[a-zA-Z0-9_-]{3,20}$/, // 3-20 chars, letters, numbers, underscore, hyphen
};

// Common validation messages
export const messages = {
	required: 'This field is required',
	email: 'Please enter a valid email address',
	phone: 'Please enter a valid phone number',
	password: 'Password must be at least 8 characters and include uppercase, lowercase, and numbers',
	username: 'Username must be 3-20 characters and can include letters, numbers, underscore, and hyphen',
	min: (field: string, length: number) => `${field} must be at least ${length} characters`,
	max: (field: string, length: number) => `${field} must be no more than ${length} characters`,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	matches: (field: string) => `Passwords must match`,
};

// Common validation schemas
export const commonSchemas = {
	email: z.string().email(messages.email),
	phone: z.string().regex(patterns.phone, messages.phone).optional(),
	password: z.string().regex(patterns.password, messages.password),
	username: z.string().regex(patterns.username, messages.username),
	nonEmptyString: z.string().min(1, messages.required),
};

// Validation helper functions
export function validateEmail(email: string): boolean {
	return commonSchemas.email.safeParse(email).success;
}

export function validatePassword(password: string): boolean {
	return commonSchemas.password.safeParse(password).success;
}

export function validatePhone(phone: string): boolean {
	return commonSchemas.phone.safeParse(phone).success;
}

// Type validation helpers
export function isString(value: unknown): value is string {
	return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
	return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

export function isObject(value: unknown): value is object {
	return typeof value === 'object' && value !== null;
}

export function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

// Sanitization helpers
export function sanitizeString(value: string): string {
	return value.trim();
}

export function sanitizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

export function sanitizePhone(phone: string): string {
	return phone.replace(/[^\d+]/g, '');
}

// Error formatting
export function formatZodError(error: z.ZodError): Record<string, string> {
	const errors: Record<string, string> = {};
	error.errors.forEach((err) => {
		const path = err.path.join('.');
		errors[path] = err.message;
	});
	return errors;
} 