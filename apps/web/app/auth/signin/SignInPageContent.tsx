// apps/web/app/auth/signin/page.tsx
'use client';

import { useAuth } from '@workspace/ui/contexts/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';

export function SignInPageContent() {
    const { status, signIn } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const callbackUrl = searchParams.get('callbackUrl') || '/';

    useEffect(() => {
        if (status === 'authenticated') {
            router.push(callbackUrl);
        }
    }, [status, router, callbackUrl]);

    const handleSignIn = async () => {
        setIsLoading(true);
        try {
            await signIn();
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProviderSignIn = async (provider: 'google' | 'apple') => {
        setIsLoading(true);
        try {
            const result = await nextAuthSignIn(provider, {
                redirect: false,
                callbackUrl,
            });
            if (result?.url) router.push(result.url);
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await nextAuthSignIn('credentials', {
                redirect: false,
                callbackUrl,
                email,
                password,
            });
            if (result?.url) router.push(result.url);
        } catch (error) {
            console.error('Sign in error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-2 border-purple-100 shadow-xl">
                <CardHeader className="text-center space-y-4">
                    <Link href="/" className="inline-flex items-center justify-center">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </Link>
                    <div>
                        <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                        <CardDescription className="text-lg mt-2">
                            Sign in to continue creating magical stories
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Button
                            // onClick={handleSignIn}
                            onClick={() => handleProviderSignIn('google')}
                            disabled={isLoading}
                            size="lg"
                            className="w-full h-12 text-base font-medium bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <svg
                                    className="mr-2 h-5 w-5"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            )}
                            Continue with Google
                        </Button>
                        <Button
                            onClick={() => handleProviderSignIn('apple')}
                            disabled={isLoading}
                            size="lg"
                            className="w-full h-12 text-base font-medium"
                            variant="outline"
                        >
                            Login with Apple
                        </Button>
                    </div>

                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-border">
                        <span className="relative z-10 bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                    <form onSubmit={handleCredentialsSignIn} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Sign In'}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/signup" className="underline">Sign up</Link>
                    </div>

                    <div className="text-center text-sm text-muted-foreground space-y-2">
                        <p>By signing in, you agree to our</p>
                        <p className="space-x-2">
                            <Link href="/terms" className="underline hover:text-primary">
                                Terms of Service
                            </Link>
                            <span>•</span>
                            <Link href="/privacy" className="underline hover:text-primary">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}