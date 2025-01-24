export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string;
					full_name: string | null;
					role: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email: string;
					full_name?: string | null;
					role?: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					full_name?: string | null;
					role?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			tickets: {
				Row: {
					id: string;
					title: string;
					description: string;
					status: string;
					created_by: string;
					assigned_to: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					description: string;
					status?: string;
					created_by: string;
					assigned_to?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					description?: string;
					status?: string;
					created_by?: string;
					assigned_to?: string | null;
					created_at?: string;
					updated_at?: string;
				};
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
	};
} 