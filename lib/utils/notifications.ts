import { toast } from 'sonner';
import { type AppError } from '@/lib/utils/error-utils';
import type { MouseEvent } from 'react';

interface NotifyOptions {
	description?: string;
	duration?: number;
}

type ActionHandler = (event: MouseEvent<HTMLButtonElement>) => void;

interface NotifyActionOptions {
	icon?: React.ReactNode;
	description?: string;
	action?: {
		label: string;
		onClick: ActionHandler;
	};
	cancel?: {
		label: string;
		onClick: ActionHandler;
	};
	duration?: number;
}

export const notify = {
	success: (message: string, options?: NotifyOptions) => {
		toast.success(message, {
			duration: options?.duration || 5000,
			description: options?.description,
		});
	},

	error: (error: AppError | Error | string, options?: NotifyOptions) => {
		const message = typeof error === 'string' ? error : error.message;
		toast.error(message, {
			duration: options?.duration || 8000,
			description: options?.description,
		});
	},

	info: (message: string, options?: NotifyOptions) => {
		toast.info(message, {
			duration: options?.duration || 5000,
			description: options?.description,
		});
	},

	warning: (message: string, options?: NotifyOptions) => {
		toast.warning(message, {
			duration: options?.duration || 6000,
			description: options?.description,
		});
	},

	promise: async <T>(
		promise: Promise<T>,
		{
			loading = 'Loading...',
			success = 'Success!',
			error = 'Something went wrong',
		}: {
			loading?: string;
			success?: string;
			error?: string;
		} = {}
	) => {
		return toast.promise(promise, {
			loading,
			success,
			error,
		});
	},

	custom: (message: string, options: NotifyActionOptions = {}) => {
		const { icon, description, action, cancel, duration = 5000 } = options;

		toast(message, {
			icon,
			description,
			duration,
			action: action
				? {
						label: action.label,
						onClick: action.onClick,
				  }
				: undefined,
			cancel: cancel
				? {
						label: cancel.label,
						onClick: cancel.onClick,
				  }
				: undefined,
		});
	},
}; 