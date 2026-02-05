'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useDrafts } from '@/contexts/DraftContext';
import { InputState, Settings } from '@/lib/types';

interface AutoSaveOptions {
  input: InputState;
  settings: Settings;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave({
  input,
  settings,
  debounceMs = 30000, // 30 seconds default
  enabled = true,
}: AutoSaveOptions) {
  const { saveDraft } = useDrafts();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  const save = useCallback(async () => {
    // Only save if there's content
    if (!input.transcript && !input.context) return;

    // Create a hash of current content to avoid duplicate saves
    const contentHash = JSON.stringify({ input, settings });
    if (contentHash === lastSavedRef.current) return;

    try {
      await saveDraft({
        title: input.transcript.slice(0, 50) || 'Untitled Draft',
        transcript: input.transcript,
        context: input.context,
        metadata: input.metadata,
        settings: settings,
      });
      lastSavedRef.current = contentHash;
      console.log('[AutoSave] Draft saved at', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('[AutoSave] Failed to save draft:', error);
    }
  }, [input, settings, saveDraft]);

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(save, debounceMs);

    // Cleanup on unmount or dependency change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [input, settings, save, debounceMs, enabled]);

  return { saveNow: save };
}
