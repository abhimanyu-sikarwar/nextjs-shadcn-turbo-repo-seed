// packages/ui/src/contexts/auth-context.tsx
'use client';

import React, { createContext, useContext } from 'react';

export interface AuthUser {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export interface AuthContextType {
    user: AuthUser | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export interface AuthProviderProps {
    children: React.ReactNode;
    value: AuthContextType;
}

export function AuthProvider({ children, value }: AuthProviderProps) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}