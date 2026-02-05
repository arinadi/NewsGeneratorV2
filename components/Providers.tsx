'use client';

import { ReactNode } from 'react';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';
import { DraftProvider } from '@/contexts/DraftContext';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <ApiKeyProvider>
            <DraftProvider>
                {children}
            </DraftProvider>
        </ApiKeyProvider>
    );
}
