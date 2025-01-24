'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Database } from '@/lib/supabase/database.types';
import { RoleSelect } from './role-select';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const columns: ColumnDef<Profile>[] = [
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'full_name',
		header: 'Name',
	},
	{
		accessorKey: 'role',
		header: 'Role',
		cell: ({ row }) => {
			return <RoleSelect userId={row.original.id} currentRole={row.original.role} />;
		},
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({ row }) => {
			return new Date(row.getValue('created_at')).toLocaleDateString();
		},
	},
]; 