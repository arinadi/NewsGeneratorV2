# Agent Context & Rules: News Generator "Kuli Tinta"

> [!IMPORTANT]
> **READ THIS FIRST**: This file defines the core constraints, philosophy, and technology stack for the "Kuli Tinta AI" project. All code and plans must adhere to these rules unless explicitly overridden by the User.

## 1. Project Identity
- **Name**: News Generator "Kuli Tinta" (Gemini 3 Pro Edition)
- **Type**: Professional PWA for Journalists
- **Core Philosophy**: **Local-First, Zero-Backend, Privacy-Centric.**
- **Target Audience**: Indonesian Field Journalists & Editors.

## 2. Technology Stack (Strict)
- **Framework**: Next.js 14+ (App Router)
- **Deployment**: `output: 'export'` (Static HTML). **NO Node.js Runtime**.
- **Styling**: Tailwind CSS (Newspaper/Editorial Theme: Zinc, Stone, Serif fonts).
- **State/Storage**:
  - `localStorage`: Settings, API Keys (Encrypted).
  - `IndexedDB`: Drafts, History, Large Text Blobs.
- **AI Integration**:
  - **Model**: Gemini 3 Pro (via Google Generative AI SDK).
  - **Execution**: Client-side only. BYOK (Bring Your Own Key).
- **Parsers**: `pdfjs-dist` (PDF), `mammoth` (DOCX).

## 3. Critical Constraints
1.  **NO Database Servers**: Do not suggest Postgres, Supabase, or Firebase unless specifically asked for "Cloud Sync". Default is Local.
2.  **Privacy First**: The API Key must NEVER touch our servers (because there are none). It stays in the browser.
3.  **Language**:
    - **UI/Code Comments**: English or Indonesian (User preference).
    - **Generated News Content**: **Strictly Indonesian (Bahasa Baku/Jurnalistik)**.
4.  **Aesthetics**: Glassmorphism, Clean, "New York Times" meets "Modern Dashboard".

## 4. Documentation Map
- **[Master Plan](./master-plan.md)**: Project Roadmap & Status.
- **[Mockup Source](./mockup.js)**: **CRITICAL REFERENCE**. The "North Star" for UI/UX design.
- **[Phase 1](./phase-1-plan.md)**: Foundation, Settings, Local Storage.
- **[Phase 2](./phase-2-plan.md)**: File Inputs (PDF/DOCX) & Metadata.
- **[Phase 3](./phase-3-plan.md)**: AI Logic, Prompts, & Persona.
- **[Phase 4](./phase-4-plan.md)**: UI Polish, PWA, Export.

## 5. Coding Standards
- **Components**: Functional, modular, typed (TypeScript preferred if enabled, else distinct JS).
- **Error Handling**: Graceful degradation. If AI fails, allow manual entry.
- **Performance**: Lazy load heavy parsers (PDF.js).
