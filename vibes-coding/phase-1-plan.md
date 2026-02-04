# Phase 1: Foundation & Data Persistence

> **Parent**: [Master Plan](./master-plan.md)
> **Context**: [Agent Rules](./agent.md)

## Goals
Establish a secure, static environment that handles API keys and project history without a backend.

## Technical Specifications
- **Framework**: Next.js (App Router), `output: 'export'`.
- **Styling**: Tailwind CSS (Zinc/Stone/Paper palette).
- **Storage**: `idb` (IndexedDB Wrapper) for drafts; `localStorage` for keys.

## Tasks

### Project Initialization
- [ ] Initialize Next.js project with TypeScript.
- [ ] Configure `next.config.js` for Static Export.
- [ ] Setup Tailwind CSS with "Newspaper" Design System (Fonts: Playfair Display, Inter).
- [ ] **Migrate Mockup**:
    - [ ] Copy `mockup.js` logic to `app/page.tsx` (ensure Client Component).
    - [ ] Install `lucide-react` icons.
    - [ ] Verify UI matches the `mockup.js` design exactly.
- [ ] Create basic Layout Shell (Sidebar + Main Content Area).

### BYOK (Bring Your Own Key) Security
- [ ] Implement Settings Modal/Panel.
- [ ] Create `ApiKeyContext` to manage key state.
- [ ] Save API Key to `localStorage` (AES encryption optional but recommended).
- [ ] Implement "Test Connection" button calling Google Gemini API (Get Models).

### IndexedDB Integration (The History Sidebar)
- [ ] Install `idb` library.
- [ ] Define IDB Schema: `db.createObjectStore('drafts', { keyPath: 'id' })`.
- [ ] Implement `DraftService` (save, load, list, delete).
- [ ] Create Sidebar Component to list saved drafts (Title + Timestamp).
- [ ] Implement Auto-save hook (debounced 30s).

### URL State Synchronization
- [ ] Create custom hook `useUrlState`.
- [ ] Sync form fields (Tone, Angle, Goal) to URL query parameters.