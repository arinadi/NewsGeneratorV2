# Agent Context & Rules: News Generator "Kuli Tinta"

> [!IMPORTANT]
> **READ THIS FIRST**: This file defines the core constraints, philosophy, and technology stack for the "Kuli Tinta AI" project. All code and plans must adhere to these rules unless explicitly overridden by the User.

## 1. Project Identity
- **Name**: News Generator "Kuli Tinta" (Gemini 3 Pro Edition)
- **Type**: Professional PWA for Journalists
- **Core Philosophy**: **Local-First, Zero-Backend, Privacy-Centric.**
- **Target Audience**: Indonesian Field Journalists & Editors.

## 2. Technology Stack (Implemented)

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Next.js 16.1.6 (App Router) | TypeScript enabled |
| Deployment | Static HTML Export | `output: 'export'` |
| Styling | Tailwind CSS 4.x | Glassmorphism theme |
| State | React Context + useState | `ApiKeyContext`, `DraftContext` |
| Storage | localStorage | API Key storage |
| AI Model | Gemini 3 Pro | `gemini-3-pro-preview` |
| AI SDK | `@google/genai` | Client-side execution |
| Parsers | `pdfjs-dist`, `mammoth` | Lazy-loaded |

## 3. Critical Constraints
1. **NO Database Servers**: No Postgres, Supabase, Firebase. Everything local.
2. **Privacy First**: API Key stays in browser localStorage only.
3. **Rate Limiting**: Free tier protection with 10 RPM queue + exponential backoff.
4. **Language**:
   - **UI/Code**: English
   - **Generated Content**: Indonesian Journalistic Standard (Bahasa Baku)
5. **Aesthetics**: Glassmorphism, Clean, "NYT meets Modern Dashboard"

## 4. Key Architecture Decisions

### 2-Step Prompt Strategy
```
Step 1: Transcript + Context + Metadata → Body
Step 2: Body → Titles + Hashtags
```
**Rationale**: Body quality is not constrained by title requirements, titles are more accurate.

### Rate Limiter Pattern
```typescript
// All AI calls go through rate limiter
await withRateLimit(() => this.ai.models.generateContent({...}));
```
**Rationale**: Prevents 429 errors on free tier (15 RPM limit).

### File Context Injection
```
File name: Interview Joko Widodo
File date: Wednesday, February 5, 2025
```
**Rationale**: Filenames often contain useful info (names, locations, dates).

## 5. File Structure
```
services/
├── GeminiService.ts    # AI integration + prompts
├── RateLimiter.ts      # Request queue + backoff

components/
├── Header.tsx          # Logo, settings, status
├── HistorySidebar.tsx  # Draft history (mobile collapsible)
├── EditorPanel.tsx     # Input, metadata, controls
├── PreviewPanel.tsx    # Output, regeneration, export
├── SettingsModal.tsx   # API key config
├── GlobalDropzone.tsx  # File drop overlay
├── FileUploadZone.tsx  # Upload button/drag zone

contexts/
├── ApiKeyContext.tsx   # API key state
├── DraftContext.tsx    # Draft state
```

## 6. Documentation Map
- **[Master Plan](./master-plan.md)**: Project Roadmap & Status
- **[Phase 1](./phase-1-plan.md)**: Foundation ✅
- **[Phase 2](./phase-2-plan.md)**: File Input & Metadata ✅
- **[Phase 3](./phase-3-plan.md)**: AI Core & Tuning ✅
- **[Phase 4](./phase-4-plan.md)**: UI Polish & PWA 🔄

## 7. Coding Standards
- **Components**: Functional, modular, TypeScript
- **Error Handling**: Graceful degradation, user feedback
- **Performance**: Lazy load heavy dependencies (PDF.js, Mammoth)
- **State Updates**: Immutable patterns with spread operator
