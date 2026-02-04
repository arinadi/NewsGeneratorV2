'use client';

import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Draft interface
export interface Draft {
    id: string;
    title: string;
    body: string;
    hashtags: string;
    metadata: {
        location: string;
        date: string;
        byline: string;
    };
    createdAt: number;
    updatedAt: number;
}

// Database schema
interface KuliTintaDB extends DBSchema {
    drafts: {
        key: string;
        value: Draft;
        indexes: { 'by-updated': number };
    };
}

const DB_NAME = 'kuli-tinta-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<KuliTintaDB> | null = null;

/**
 * Get database instance (singleton)
 */
async function getDB(): Promise<IDBPDatabase<KuliTintaDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<KuliTintaDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Create drafts store if it doesn't exist
            if (!db.objectStoreNames.contains('drafts')) {
                const store = db.createObjectStore('drafts', { keyPath: 'id' });
                store.createIndex('by-updated', 'updatedAt');
            }
        },
    });

    return dbInstance;
}

/**
 * DraftService - Persistent storage for drafts using IndexedDB
 */
export const DraftService = {
    /**
     * Save a new draft or update existing one
     */
    async save(draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Draft> {
        const db = await getDB();
        const now = Date.now();

        const fullDraft: Draft = {
            id: draft.id || `draft-${now}`,
            title: draft.title,
            body: draft.body,
            hashtags: draft.hashtags,
            metadata: draft.metadata,
            createdAt: draft.id ? (await this.get(draft.id))?.createdAt || now : now,
            updatedAt: now,
        };

        await db.put('drafts', fullDraft);
        return fullDraft;
    },

    /**
     * Get a draft by ID
     */
    async get(id: string): Promise<Draft | undefined> {
        const db = await getDB();
        return db.get('drafts', id);
    },

    /**
     * Get all drafts, sorted by most recently updated
     */
    async getAll(): Promise<Draft[]> {
        const db = await getDB();
        const drafts = await db.getAllFromIndex('drafts', 'by-updated');
        return drafts.reverse(); // Most recent first
    },

    /**
     * Delete a draft by ID
     */
    async delete(id: string): Promise<void> {
        const db = await getDB();
        await db.delete('drafts', id);
    },

    /**
     * Clear all drafts
     */
    async clear(): Promise<void> {
        const db = await getDB();
        await db.clear('drafts');
    },

    /**
     * Get draft count
     */
    async count(): Promise<number> {
        const db = await getDB();
        return db.count('drafts');
    },
};
