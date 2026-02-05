'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface Draft {
  id: number;
  timestamp: string;
  title: string;
  transcript: string;
  context: string;
  metadata: {
    location: string;
    date: string;
    byline: string;
    personsInvolved?: string[];
    source?: 'ai' | 'manual' | 'file';
  };
  settings: {
    angle: string;
    style: string;
    goal: string;
  };
  body?: string;
  hashtags?: string;
  headlines?: string[];
}

interface DraftDB extends DBSchema {
  drafts: {
    key: number;
    value: Draft;
    indexes: { 'by-timestamp': string };
  };
}

interface DraftContextType {
  drafts: Draft[];
  saveDraft: (draft: Omit<Draft, 'id' | 'timestamp'> & { id?: number }) => Promise<number>;
  loadDraft: (id: number) => Promise<Draft | undefined>;
  deleteDraft: (id: number) => Promise<void>;
  refreshDrafts: () => Promise<void>;
}

const DraftContext = createContext<DraftContextType | undefined>(undefined);

const DB_NAME = 'kuli-tinta-db';
const DB_VERSION = 1;

async function getDB(): Promise<IDBPDatabase<DraftDB>> {
  return openDB<DraftDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore('drafts', { keyPath: 'id' });
      store.createIndex('by-timestamp', 'timestamp');
    },
  });
}

export function DraftProvider({ children }: { children: ReactNode }) {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const refreshDrafts = useCallback(async () => {
    try {
      const db = await getDB();
      const allDrafts = await db.getAll('drafts');
      // Sort by timestamp descending (newest first)
      allDrafts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setDrafts(allDrafts);
    } catch (error) {
      console.error('Failed to refresh drafts:', error);
    }
  }, []);

  useEffect(() => {
    refreshDrafts();
  }, [refreshDrafts]);

  const saveDraft = async (draftData: Omit<Draft, 'id' | 'timestamp'> & { id?: number }): Promise<number> => {
    const db = await getDB();
    const draftId = draftData.id || Date.now();
    const draft: Draft = {
      ...draftData,
      id: draftId,
      timestamp: new Date().toISOString(),
    };
    await db.put('drafts', draft);
    await refreshDrafts();
    return draftId;
  };

  const loadDraft = async (id: number): Promise<Draft | undefined> => {
    const db = await getDB();
    return db.get('drafts', id);
  };

  const deleteDraft = async (id: number): Promise<void> => {
    const db = await getDB();
    await db.delete('drafts', id);
    await refreshDrafts();
  };

  return (
    <DraftContext.Provider value={{ drafts, saveDraft, loadDraft, deleteDraft, refreshDrafts }}>
      {children}
    </DraftContext.Provider>
  );
}

export function useDrafts() {
  const context = useContext(DraftContext);
  if (context === undefined) {
    throw new Error('useDrafts must be used within a DraftProvider');
  }
  return context;
}
