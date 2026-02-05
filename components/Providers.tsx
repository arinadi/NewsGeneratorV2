'use client';

import { ReactNode } from 'react';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';
import { DraftProvider } from '@/contexts/DraftContext';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ApiKeyProvider>
            <DraftProvider>
                {children}
                <Toaster position="top-center" richColors />
            </DraftProvider>
        </ApiKeyProvider>
    );
}
