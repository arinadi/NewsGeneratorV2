# Master Plan: News Generator "Kuli Tinta AI"

> **Status**: ✅ Phase 1-3 Complete | Phase 4 In Progress
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

### 🔄 [Phase 4: Premium UI & PWA](./phase-4-plan.md)
- Glassmorphism & Newspaper Aesthetic (Done)
- Mobile Responsive Design (Done)
- PWA Manifest & Offline Support (Pending)
- Export Options (Clipboard ✅, Print ✅, Download Pending)

## 5. Key Improvements Made

### Rate Limiter (Free Tier Protection)
- Request queue with 10 RPM limit
- Exponential backoff (2s → 4s → 8s)
- Auto-retry up to 3x

### 2-Step Prompt Strategy
- Step 1: Generate body from transcript + context
- Step 2: Generate title + hashtags from body
- Results are more accurate and consistent

### File Context Extraction
- Cleaned filename automatically added to context
- File date (lastModified) included in Indonesian locale
- AI can extract useful info from filename (names, locations, etc.)