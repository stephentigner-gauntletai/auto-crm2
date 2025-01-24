'use client';

import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/auth-context';

const roles = ['admin', 'agent', 'customer'] as const;
type Role = (typeof roles)[number];

interface RoleSelectProps {
	userId: string;
	currentRole: string;
}

export function RoleSelect({ userId, currentRole }: RoleSelectProps) {
	const [role, setRole] = useState<Role>(currentRole as Role);
	const [isLoading, setIsLoading] = useState(false);
	const { profile } = useAuth();

	// Prevent admins from changing their own role
	const isDisabled = userId === profile?.id;

	async function handleRoleChange(newRole: Role) {
		setIsLoading(true);
		try {
			const supabase = createClient();
			const { error } = await supabase
				.from('profiles')
				.update({ role: newRole })
				.eq('id', userId);

			if (error) throw error;
			setRole(newRole);
		} catch (error) {
			console.error('Error updating role:', error);
			// Reset to previous role on error
			setRole(currentRole as Role);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Select
			value={role}
			onValueChange={handleRoleChange}
			disabled={isDisabled || isLoading}
		>
			<SelectTrigger className="w-32">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{roles.map((role) => (
					<SelectItem key={role} value={role}>
						{role.charAt(0).toUpperCase() + role.slice(1)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
} 