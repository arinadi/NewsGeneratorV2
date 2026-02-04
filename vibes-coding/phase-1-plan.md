# Phase 1: Foundation & Data Persistence

> **Parent**: [Master Plan](./master-plan.md)
> **Status**: ✅ COMPLETE
> **Context**: [Agent Rules](./agent.md)

## Goals
Establish a secure, static environment that handles API keys and project history without a backend.

## Technical Specifications
- **Framework**: Next.js 16.1.6 (App Router), `output: 'export'`
- **Styling**: Tailwind CSS (Stone/Slate/Paper palette + Glassmorphism)
- **Storage**: `localStorage` for API Key, `IndexedDB` for drafts
- **Fonts**: Inter (body), system serif (headlines)

## Completed Tasks

### ✅ Project Initialization
- [x] Initialize Next.js project with TypeScript
- [x] Configure `next.config.ts` for Static Export (`output: 'export'`)
- [x] Setup Tailwind CSS with Newspaper Design System
- [x] Create component architecture:
  - `Header.tsx` - Logo, settings, connection status
  - `HistorySidebar.tsx` - Draft history with mobile collapsible
  - `EditorPanel.tsx` - Transcript input, metadata, generation controls
  - `PreviewPanel.tsx` - Generated article display with actions
  - `SettingsModal.tsx` - API key configuration
  - `GlobalDropzone.tsx` - Full-page file drop support
- [x] Install `lucide-react` icons

### ✅ BYOK (Bring Your Own Key) Security
- [x] Implement Settings Modal with API key input
- [x] Create `ApiKeyContext` to manage key state globally
- [x] Save API Key to `localStorage` (key: `kuli_tinta_api_key`)
- [x] Implement "Test Connection" with real Gemini API call
- [x] Connection status indicator in Header (green/red badge)

### ✅ IndexedDB Integration (The History Sidebar)
- [x] Install `idb` library
- [x] Define IDB Schema in `DraftContext.tsx`
- [x] Implement CRUD operations (save, load, list, delete)
- [x] Create Sidebar Component to list saved drafts
- [x] History persisted across browser sessions

### ✅ URL State Synchronization
- [x] Sync settings (angle, style, goal) to URL query parameters
- [x] Read initial settings from URL on page load
- [x] Use Suspense boundary for searchParams hydration
- [x] Non-default settings only added to URL (clean URLs)

## Files Created

| File | Description |
|------|-------------|
| `contexts/DraftContext.tsx` | IndexedDB CRUD for drafts |
| `services/DraftService.ts` | Alternative draft service |
| `hooks/useUrlState.ts` | URL state sync hook |