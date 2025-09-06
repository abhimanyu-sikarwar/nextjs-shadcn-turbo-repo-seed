// apps/web/app/auth/signin/page.tsx
'use client';

import { Suspense } from 'react';
import { SignInPageContent } from './SignInPageContent';

export default function SignInPage() {
    return (
        <Suspense fallback={null}>
            <SignInPageContent />
        </Suspense>
    );
}