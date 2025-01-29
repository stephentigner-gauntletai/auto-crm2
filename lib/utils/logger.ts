import { isObject } from './validation';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
	level: LogLevel;
	message: string;
	timestamp: string;
	data?: unknown;
	error?: Error;
}

export interface LoggerOptions {
	enabled?: boolean;
	minLevel?: LogLevel;
	console?: boolean;
	// Add more options as needed (e.g., remote logging)
}

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

class Logger {
	private options: LoggerOptions;

	constructor(options: LoggerOptions = {}) {
		this.options = {
			enabled: process.env.NODE_ENV !== 'test',
			minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
			console: true,
			...options,
		};
	}

	private shouldLog(level: LogLevel): boolean {
		if (!this.options.enabled) return false;
		return LOG_LEVELS[level] >= LOG_LEVELS[this.options.minLevel!];
	}

	private formatMessage(entry: LogEntry): string {
		const { level, message, timestamp, data, error } = entry;
		let formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

		if (data) {
			formattedMessage += '\nData: ' + this.formatData(data);
		}

		if (error) {
			formattedMessage += `\nError: ${error.message}\nStack: ${error.stack}`;
		}

		return formattedMessage;
	}

	private formatData(data: unknown): string {
		if (data instanceof Error) {
			return `${data.message}\n${data.stack}`;
		}
		if (isObject(data)) {
			return JSON.stringify(data, null, 2);
		}
		return String(data);
	}

	private createLogEntry(level: LogLevel, message: string, data?: unknown, error?: Error): LogEntry {
		return {
			level,
			message,
			timestamp: new Date().toISOString(),
			data,
			error,
		};
	}

	private log(entry: LogEntry): void {
		if (!this.shouldLog(entry.level)) return;

		const formattedMessage = this.formatMessage(entry);

		if (this.options.console) {
			switch (entry.level) {
				case 'debug':
					console.debug(formattedMessage);
					break;
				case 'info':
					console.info(formattedMessage);
					break;
				case 'warn':
					console.warn(formattedMessage);
					break;
				case 'error':
					console.error(formattedMessage);
					break;
			}
		}

		// Add additional logging targets here (e.g., file, remote service)
	}

	debug(message: string, data?: unknown): void {
		this.log(this.createLogEntry('debug', message, data));
	}

	info(message: string, data?: unknown): void {
		this.log(this.createLogEntry('info', message, data));
	}

	warn(message: string, data?: unknown): void {
		this.log(this.createLogEntry('warn', message, data));
	}

	error(message: string, error?: Error, data?: unknown): void {
		this.log(this.createLogEntry('error', message, data, error));
	}
}

export const logger = new Logger();

// Export a default instance
export default logger; 