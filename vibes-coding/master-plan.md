# Master Plan: News Generator "Kuli Tinta AI"

> **Status**: Ready for Phase 1 Implementation
> **Context**: [Agent Rules](./agent.md)

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

## 3. Tech Stack
- **Framework**: Next.js (Static HTML Export)
- **AI Engine**: Gemini 3 Pro (via Client-side API calls)
- **Parsing**: PDF.js (PDF), Mammoth.js (DOCX)
- **Storage**: IndexedDB (Drafts, History, API Key)
- **Styling**: Tailwind CSS + Glassmorphism UI
- **Deployment**: Vercel (Static Hosting)

## 4. Development Roadmap

### [Phase 1: Foundation & Data Persistence](./phase-1-plan.md)
- Next.js Setup & Tailwind Configuration.
- Secure "BYOK" API Key Management.
- IndexedDB Integration for Draft History.

### [Phase 2: Multi-source Input & Metadata](./phase-2-plan.md)
- File Uploaders (PDF, DOCX, TXT).
- Client-side Text Extraction.
- AI Metadata Extraction (Who, What, Where, When).

### [Phase 3: AI Core & Tuning](./phase-3-plan.md)
- Gemini 3 Pro Integration.
- "Kuli Tinta" Persona & Prompt Engineering.
- Precision Regeneration (Title-only, Body-only).

### [Phase 4: Premium UI & PWA](./phase-4-plan.md)
- Glassmorphism & Newspaper Aesthetic.
- PWA Manifest & Offline Support.
- Export Options (Clipboard, TXT, PDF).