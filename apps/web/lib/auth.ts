// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { BACKEND_URL } from "./constant";



// Helper function to exchange Google token for backend tokens
async function exchangeGoogleTokenForBackendTokens(idToken: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken: idToken
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to authenticate with backend');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error exchanging Google token:', error);
        throw error;
    }
}

// Helper function to exchange Apple token for backend tokens
async function exchangeAppleTokenForBackendTokens(idToken: string) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/apple`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idToken: idToken
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to authenticate with backend');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error exchanging Apple token:', error);
        throw error;
    }
}

// Helper function to refresh access token
async function refreshAccessToken(token: JWT) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.backendAccessToken}`,
            },
            body: JSON.stringify({
                refreshToken: token.backendRefreshToken,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const refreshedTokens = await response.json();

        return {
            ...token,
            backendAccessToken: refreshedTokens.tokens.accessToken,
            backendRefreshToken: refreshedTokens.tokens.refreshToken,
            backendAccessTokenExpires: Date.now() + 60 * 60 * 1000, // 1 hour
        };
    } catch (error) {
        console.error('Error refreshing access token:', error);
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: "openid email profile",
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        AppleProvider({
            clientId: process.env.APPLE_CLIENT_ID!,
            clientSecret: process.env.APPLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials) return null;
                try {
                    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: credentials.email, password: credentials.password })
                    });

                    if (!response.ok) {
                        return null;
                    }

                    const data = await response.json();
                    return {
                        ...data.user,
                        backendTokens: data.tokens
                    } as any;
                } catch (error) {
                    console.error('Credentials authorize error:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in
            if (account && user) {
                try {
                    if (account.provider === 'google') {
                        const backendAuth = await exchangeGoogleTokenForBackendTokens(account.id_token!);
                        return {
                            ...token,
                            backendAccessToken: backendAuth.tokens.accessToken,
                            backendRefreshToken: backendAuth.tokens.refreshToken,
                            backendAccessTokenExpires: Date.now() + 60 * 60 * 1000,
                            id: backendAuth.user.id,
                            name: backendAuth.user.name,
                            email: backendAuth.user.email,
                            subscription: backendAuth.user.subscription,
                            image: user.image,
                        };
                    } else if (account.provider === 'apple') {
                        const backendAuth = await exchangeAppleTokenForBackendTokens(account.id_token!);
                        return {
                            ...token,
                            backendAccessToken: backendAuth.tokens.accessToken,
                            backendRefreshToken: backendAuth.tokens.refreshToken,
                            backendAccessTokenExpires: Date.now() + 60 * 60 * 1000,
                            id: backendAuth.user.id,
                            name: backendAuth.user.name,
                            email: backendAuth.user.email,
                            subscription: backendAuth.user.subscription,
                            image: user.image,
                        };
                    } else if (account.provider === 'credentials') {
                        const credUser: any = user;
                        return {
                            ...token,
                            backendAccessToken: credUser.backendTokens.accessToken,
                            backendRefreshToken: credUser.backendTokens.refreshToken,
                            backendAccessTokenExpires: Date.now() + 60 * 60 * 1000,
                            id: credUser.id,
                            name: credUser.name,
                            email: credUser.email,
                            subscription: credUser.subscription,
                            image: credUser.image,
                        };
                    }
                } catch (error) {
                    console.error('Failed to exchange auth token for backend tokens:', error);
                    return { ...token, error: 'BackendAuthError' };
                }
            }

            // Return previous token if the access token has not expired
            if (Date.now() < (token.backendAccessTokenExpires as number)) {
                return token;
            }

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            // Send properties to the client
            if (token) {
                session.user = {
                    ...session.user,
                    // id: token.id,
                    name: token.name,
                    email: token.email,
                    image: token.picture || token.image as string,
                    // subscription: token.subscription as string,
                };
                // Add backend access token to session
                session.accessToken = token.backendAccessToken as string;
                session.error = token.error as string | undefined;
            }
            return session;
        },
        async signIn({ user, account }) {
            if (account?.provider === 'google' || account?.provider === 'apple') {
                if (!account.id_token) {
                    console.error('No ID token received from provider');
                    return false;
                }
                return true;
            }
            if (account?.provider === 'credentials') {
                return true;
            }
            return false;
        },
        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
    },
    pages: {
        signIn: '/auth/signin',
        newUser: '/auth/signup',
        error: '/auth/error',
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        },
        callbackUrl: {
            name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.callback-url`,
            options: {
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        },
        csrfToken: {
            name: `${process.env.NODE_ENV === 'production' ? '__Host-' : ''}next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};