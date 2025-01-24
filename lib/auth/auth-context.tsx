'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
	user: User | null;
	profile: Profile | null;
	isLoading: boolean;
}

interface AuthContextType extends AuthState {
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [state, setState] = useState<AuthState>({
		user: null,
		profile: null,
		isLoading: true,
	});

	useEffect(() => {
		const supabase = createClient();

		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session?.user) {
				// Fetch profile data
				supabase
					.from('profiles')
					.select('*')
					.eq('id', session.user.id)
					.single()
					.then(({ data: profile }) => {
						setState({
							user: session.user,
							profile,
							isLoading: false,
						});
					});
			} else {
				setState({
					user: null,
					profile: null,
					isLoading: false,
				});
			}
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session?.user) {
				const { data: profile } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', session.user.id)
					.single();

				setState({
					user: session.user,
					profile,
					isLoading: false,
				});
			} else {
				setState({
					user: null,
					profile: null,
					isLoading: false,
				});
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	const signOut = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
	};

	return (
		<AuthContext.Provider
			value={{
				...state,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
} 