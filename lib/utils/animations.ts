import { cn } from '@/lib/utils';

export const animations = {
	// Fade animations
	fadeIn: 'animate-in fade-in',
	fadeOut: 'animate-out fade-out',
	
	// Slide animations
	slideInFromTop: 'animate-in slide-in-from-top',
	slideOutToTop: 'animate-out slide-out-to-top',
	slideInFromBottom: 'animate-in slide-in-from-bottom',
	slideOutToBottom: 'animate-out slide-out-to-bottom',
	slideInFromLeft: 'animate-in slide-in-from-left',
	slideOutToLeft: 'animate-out slide-out-to-left',
	slideInFromRight: 'animate-in slide-in-from-right',
	slideOutToRight: 'animate-out slide-out-to-right',
	
	// Scale animations
	scaleIn: 'animate-in zoom-in',
	scaleOut: 'animate-out zoom-out',
	
	// Duration modifiers
	duration75: 'duration-75',
	duration100: 'duration-100',
	duration150: 'duration-150',
	duration200: 'duration-200',
	duration300: 'duration-300',
	duration500: 'duration-500',
	duration700: 'duration-700',
	duration1000: 'duration-1000',
	
	// Ease modifiers
	easeLinear: 'ease-linear',
	easeIn: 'ease-in',
	easeOut: 'ease-out',
	easeInOut: 'ease-in-out',
};

export function getTransitionClasses(...args: string[]) {
	return cn('transition-all', ...args);
}

// Common animation combinations
export const commonAnimations = {
	// Page transitions
	pageEnter: cn(animations.fadeIn, animations.duration300, animations.easeOut),
	pageExit: cn(animations.fadeOut, animations.duration200, animations.easeIn),
	
	// Modal/dialog transitions
	modalEnter: cn(animations.fadeIn, animations.scaleIn, animations.duration200, animations.easeOut),
	modalExit: cn(animations.fadeOut, animations.scaleOut, animations.duration150, animations.easeIn),
	
	// Dropdown/popover transitions
	dropdownEnter: cn(animations.slideInFromTop, animations.duration150, animations.easeOut),
	dropdownExit: cn(animations.slideOutToTop, animations.duration100, animations.easeIn),
	
	// List item transitions
	listItemEnter: cn(animations.fadeIn, animations.slideInFromRight, animations.duration200),
	listItemExit: cn(animations.fadeOut, animations.slideOutToLeft, animations.duration150),
	
	// Form feedback transitions
	formFeedbackEnter: cn(animations.fadeIn, animations.slideInFromTop, animations.duration200),
	formFeedbackExit: cn(animations.fadeOut, animations.slideOutToTop, animations.duration150),
}; 