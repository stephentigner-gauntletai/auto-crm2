'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Database } from '@/lib/supabase/database.types';

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
	},
	{
		accessorKey: 'created_at',
		header: 'Created',
		cell: ({ row }) => {
			return new Date(row.getValue('created_at')).toLocaleDateString();
		},
	},
]; 