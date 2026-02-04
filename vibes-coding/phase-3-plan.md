# Phase 3: "Kuli Tinta AI" Core Engine

> **Parent**: [Master Plan](./master-plan.md)
> **Status**: ✅ COMPLETE
> **Context**: [Agent Rules](./agent.md)

## Goals
Implement the Gemini 3 Pro integration and fine-tune the journalistic persona for the Indonesian market.

## Completed Tasks

### ✅ Gemini 3 Pro Implementation
- [x] Install SDK: `npm install @google/genai`
- [x] Initialize `GoogleGenAI` with API Key from Context
- [x] Implement `GeminiService` class:
  - [x] Method: `generateNews(options)` - 2-step generation
  - [x] Method: `extractMetadata(text)` - JSON extraction
  - [x] Method: `regenerateTitle(body)` - Title only
  - [x] Method: `regenerateBody(title, body)` - Body only
  - [x] Method: `generateHashtags(article)` - SEO hashtags
  - [x] Method: `testConnection()` - API validation

### ✅ Rate Limiter (Free Tier Protection)
- [x] Create `RateLimiter.ts` service
- [x] Request queue with 10 RPM (buffer from 15 RPM free tier)
- [x] Minimum interval enforcement between requests
- [x] Exponential backoff for 429/5xx errors (2s → 4s → 8s)
- [x] Max 3 retries before throwing error
- [x] All API calls wrapped with `withRateLimit()`

### ✅ 2-Step Prompt Strategy (Improvement)
- [x] **Step 1**: Generate body from transcript + context + metadata
  - Focus on content quality without title constraints
  - Full Kuli Tinta persona applied
- [x] **Step 2**: Generate titles + hashtags from the body
  - More accurate titles based on actual content
  - Relevant hashtags from final body

### ✅ The Master Prompt (Kuli Tinta Persona)
- [x] System Instruction implemented:
  - **Role**: Senior Editor 20 years experience (Tempo/Kompas style)
  - **Tone**: Formal, Objective, Impactful (Bahasa Baku Jurnalistik)
  - **Structure**: Inverted Pyramid (5W+1H in lead paragraph)
- [x] Negative Constraints (Banned Phrases):
  - ❌ "Di sisi lain" (On the other hand)
  - ❌ "Kesimpulannya" (In conclusion)
  - ❌ "Menarik untuk dicatat" (It's interesting to note)
  - ❌ "Perlu diketahui" (It should be known)
  - ❌ "Seperti yang kita ketahui" (As we know)
  - ❌ "Tidak bisa dipungkiri" (It cannot be denied)
  - ❌ Excessive passive voice
  - ❌ Hyperbolic words without evidence
- [x] Principles:
  - Every claim must be attributed to source
  - If no data available, DO NOT fabricate
  - Direct quotes with quotation marks and clear attribution

### ✅ Precision Regeneration Logic
- [x] **Title Generator**: `regenerateTitle()` - 3 alternative titles
- [x] **Body Generator**: `regenerateBody()` - rewrite with same facts
- [x] **Hashtag Generator**: `generateHashtags()` - 5-7 SEO tags
- [x] Loading states for each regeneration action in UI
- [x] Independent button handlers in PreviewPanel