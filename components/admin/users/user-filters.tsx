'use client';

import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface UserFiltersProps {
	search: string;
	role: string;
	onSearchChange: (value: string) => void;
	onRoleChange: (value: string) => void;
}

const roles = ['all', 'admin', 'agent', 'customer'] as const;

export function UserFilters({ search, role, onSearchChange, onRoleChange }: UserFiltersProps) {
	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-medium mb-2">Search</h3>
				<Input
					placeholder="Search by name or email"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
				/>
			</div>
			<div>
				<h3 className="text-sm font-medium mb-2">Role</h3>
				<Select value={role} onValueChange={onRoleChange}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{roles.map((role) => (
							<SelectItem key={role} value={role}>
								{role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
} 