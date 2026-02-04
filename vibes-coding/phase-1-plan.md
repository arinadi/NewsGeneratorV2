# Phase 1: Foundation & Data Persistence

> **Parent**: [Master Plan](./master-plan.md)
> **Status**: ✅ COMPLETE
> **Context**: [Agent Rules](./agent.md)

## Goals
Establish a secure, static environment that handles API keys and project history without a backend.

## Technical Specifications
- **Framework**: Next.js 16.1.6 (App Router), `output: 'export'`
- **Styling**: Tailwind CSS (Stone/Slate/Paper palette + Glassmorphism)
- **Storage**: `localStorage` for API Key
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

### ✅ History Sidebar
- [x] In-memory history state (simplified from IndexedDB)
- [x] Sidebar component to list saved drafts
- [x] Mobile-responsive collapsible design
- [x] Load draft on click functionality

### ⏭️ Deferred
- [ ] URL State Synchronization (deferred - not critical for MVP)
- [ ] IndexedDB for persistent history (using in-memory for now)