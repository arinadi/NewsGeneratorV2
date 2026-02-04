# Master Plan: News Generator "Kuli Tinta AI"

> **Status**: ✅ ALL PHASES COMPLETE
> **Context**: [Agent Rules](./agent.md)
> **Last Updated**: 2026-02-05

## 1. Project Overview
A professional-grade News Generator PWA designed for Indonesian journalists and editors. It prioritizes factual integrity, speed, and data privacy by operating as a Full Static Local application.

### Key Objectives
- **Privacy & Security**: API Keys and Draft History stay on the user's device (Local Storage/IndexedDB).
- **Cost Efficiency**: Serverless deployment (Vercel) with no backend costs.
- **Quality**: Leveraging Gemini 3 Pro's reasoning to produce human-like, non-hallucinatory news.
- **UX**: A premium newspaper aesthetic optimized for professional workflows.

## 2. Personas & Problem Solving
- **Field Journalist**: Solves the "messy transcript" problem. Rapidly converts Whisper outputs into structured drafts.
- **Editor**: Solves the "AI-cliché" and "hallucination" problem. Ensures every word is grounded in source material.
- **Software Developer**: Solves the "maintenance/cost" problem. No database to manage; zero-runtime backend.

## 3. Tech Stack (Implemented)
| Component | Technology | Status |
|-----------|------------|--------|
| Framework | Next.js 16.1.6 (App Router) | ✅ |
| AI Engine | Gemini 3 Pro (`gemini-3-pro-preview`) | ✅ |
| AI SDK | `@google/genai` | ✅ |
| Parsing | PDF.js, Mammoth.js | ✅ |
| Storage | localStorage (API Key) | ✅ |
| Styling | Tailwind CSS + Glassmorphism | ✅ |
| PWA | Service Worker + Manifest | ✅ |
| Deployment | Vercel (Static Export) | ✅ |

## 4. Development Roadmap

### ✅ [Phase 1: Foundation & Data Persistence](./phase-1-plan.md)
- Next.js Setup & Tailwind Configuration
- Secure "BYOK" API Key Management
- Component Architecture (Header, Sidebar, Editor, Preview)

### ✅ [Phase 2: Multi-source Input & Metadata](./phase-2-plan.md)
- File Uploaders (PDF, DOCX, TXT) with Global Dropzone
- Client-side Text Extraction
- AI Metadata Extraction + File Context (filename, file date)

### ✅ [Phase 3: AI Core & Tuning](./phase-3-plan.md)
- Gemini 3 Pro Integration with Rate Limiting
- "Kuli Tinta" Persona & 2-Step Prompt Strategy
- Precision Regeneration (Title, Body, Hashtags)

### ✅ [Phase 4: Premium UI & PWA](./phase-4-plan.md)
- Glassmorphism & Newspaper Aesthetic
- PWA with Service Worker & Offline Support
- Export Options (Clipboard, Download TXT, Print)

## 5. Key Features Summary

### AI Generation
- 2-Step Prompt Strategy (Body → Title+Hashtags)
- Kuli Tinta Persona (Senior Editor style)
- Rate Limiter (10 RPM + exponential backoff)

### File Handling
- Drag & Drop anywhere on page
- PDF, DOCX, TXT support
- Auto-extract filename and date to context

### Export
- Copy to Clipboard
- Download as TXT (title-based filename)
- Print Mode

### PWA
- Installable on mobile/desktop
- Offline UI caching
- App icons and theme color