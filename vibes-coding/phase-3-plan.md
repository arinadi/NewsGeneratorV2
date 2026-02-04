# Phase 3: "Kuli Tinta AI" Core Engine

> **Parent**: [Master Plan](./master-plan.md)
> **Context**: [Agent Rules](./agent.md)

## Goals
Implement the Gemini 3 Pro integration and fine-tune the journalistic persona for the Indonesian market.

## Tasks

### Gemini 3 Pro Implementation
- [ ] Install SDK: `npm install @google/generative-ai`.
- [ ] Initialize `GenerativeModel` with API Key from Context.
- [ ] Implement `GeminiService` class:
    - [ ] Method: `generateNews(prompt, options)`.
    - [ ] Method: `streamNews(prompt)` (for typing effect).
- [ ] Implement Exponential Backoff for 429/500 errors.

### The Master Prompt (Kuli Tinta Persona)
- [ ] Construct the System Instruction:
    - **Role**: Senior Editor at Tempo/Kompas.
    - **Tone**: Formal, Objective, Impactful (Bahasa Baku).
    - **Input Data**: User's Draft + Extracted Metadata + uploaded file text.
- [ ] Implement Dynamic Constraints:
    - [ ] **Negative Constraints**: "No 'Di sisi lain', 'Kesimpulannya', 'Menarik untuk dicatat'."
    - [ ] **Thinking Mode**: Enforce internal chain-of-thought for fact-checking before output.

### Precision Regeneration Logic
- [ ] Implement "Partial Updates" State Management.
- [ ] **Title Generator**: Rewrite only the H1.
- [ ] **Body Generator**: Rewrite the article body without changing the title.
- [ ] **Hashtag Generator**: Generate SEO-friendly tags based on the final text.

### Token Management
- [ ] Implement Token Counting (approx. 4 chars = 1 token).
- [ ] Strategy for Large Documents (>1M tokens):
    - [ ] Chunking logic (Split by chapters/headings).
    - [ ] Rolling summary approach if needed (though Gemini 1.5/3 Pro handles large context well).