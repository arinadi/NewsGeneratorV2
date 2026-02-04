'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

type UrlStateValue = string | null;

interface UrlState {
    angle: UrlStateValue;
    style: UrlStateValue;
    goal: UrlStateValue;
}

const DEFAULT_STATE: UrlState = {
    angle: null,
    style: null,
    goal: null,
};

/**
 * Hook to sync form state with URL query parameters
 * Enables shareable/bookmarkable form states
 */
export function useUrlState() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isInitialized, setIsInitialized] = useState(false);

    // Read state from URL
    const readFromUrl = useCallback((): UrlState => {
        return {
            angle: searchParams.get('angle'),
            style: searchParams.get('style'),
            goal: searchParams.get('goal'),
        };
    }, [searchParams]);

    // Write state to URL
    const writeToUrl = useCallback(
        (state: Partial<UrlState>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(state).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            });

            const queryString = params.toString();
            const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

            // Use replace to avoid adding to history stack on every change
            router.replace(newUrl, { scroll: false });
        },
        [router, pathname, searchParams]
    );

    // Get current URL state
    const getUrlState = useCallback((): UrlState => {
        return readFromUrl();
    }, [readFromUrl]);

    // Set single parameter
    const setUrlParam = useCallback(
        (key: keyof UrlState, value: string | null) => {
            writeToUrl({ [key]: value });
        },
        [writeToUrl]
    );

    // Set multiple parameters at once
    const setUrlParams = useCallback(
        (params: Partial<UrlState>) => {
            writeToUrl(params);
        },
        [writeToUrl]
    );

    // Clear all URL state
    const clearUrlState = useCallback(() => {
        router.replace(pathname, { scroll: false });
    }, [router, pathname]);

    // Mark as initialized after first render
    useEffect(() => {
        setIsInitialized(true);
    }, []);

    return {
        urlState: readFromUrl(),
        setUrlParam,
        setUrlParams,
        clearUrlState,
        isInitialized,
        getUrlState,
    };
}

/**
 * Default values for form fields
 */
export const URL_STATE_DEFAULTS = {
    angle: 'straight' as const,
    style: 'formal' as const,
    goal: 'google_news' as const,
};
