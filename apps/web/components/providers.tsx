"use client"

import * as React from "react"
import { AppSettingsProvider } from '../context/AppSettingsContext';
import { SessionProvider, useSession } from "next-auth/react";
import { AuthProvider, AuthContextType } from "@workspace/ui/contexts/auth-context";

function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const authValue: AuthContextType = {
    user: session?.user ? {
      id: session.user.email || '',
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    } : null,
    status: status === 'loading' ? 'loading' : session?.user ? 'authenticated' : 'unauthenticated',
    signIn: async () => {
      // This will be handled by next-auth signIn
      console.log('Sign in called');
    },
    signOut: async () => {
      // This will be handled by next-auth signOut
      console.log('Sign out called');
    },
  };

  return (
    <AuthProvider value={authValue}>
      {children}
    </AuthProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppSettingsProvider>
      <SessionProvider>
        <AuthProviderWrapper>
          {children}
        </AuthProviderWrapper>
      </SessionProvider>
    </AppSettingsProvider>
  )
}
