'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
	value?: number;
	onChange: (value: number) => void;
	disabled?: boolean;
}

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
	return (
		<div className="flex gap-1">
			{[1, 2, 3, 4, 5].map((rating) => (
				<button
					key={rating}
					type="button"
					className={cn(
						'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
						disabled && 'cursor-not-allowed opacity-50'
					)}
					onClick={() => !disabled && onChange(rating)}
					disabled={disabled}
				>
					<Star
						className={cn(
							'h-6 w-6',
							rating <= (value || 0)
								? 'fill-primary text-primary'
								: 'fill-none text-muted-foreground'
						)}
					/>
					<span className="sr-only">Rate {rating} stars</span>
				</button>
			))}
		</div>
	);
} 