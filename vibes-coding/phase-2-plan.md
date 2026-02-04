# Phase 2: Multimodal Input & Smart Metadata

> **Parent**: [Master Plan](./master-plan.md)
> **Context**: [Agent Rules](./agent.md)

## Goals
Enable journalists to upload any file and automatically extract factual metadata without server-side processing.

## Tasks

### File Parsing Engine
- [ ] Create `FileUploadZone` component (Drag & Drop).
- [ ] Implement `FileParserFactory` pattern.
- [ ] **TXT Handler**: Implement strict stream/string reading.
- [ ] **PDF Handler**:
    - [ ] Install `pdfjs-dist`.
    - [ ] Configure Web Worker for PDF parsing to avoid UI freeze.
    - [ ] Extract text layer only (ignore images).
- [ ] **DOCX Handler**:
    - [ ] Install `mammoth`.
    - [ ] Convert DOCX to raw text (preserve paragraph breaks).

### The "Get Metadata" Feature
- [ ] Create `MetadataService` for Gemini API interactions.
- [ ] Implement `extractMetadata(text)` function.
- [ ] Design Meta-extraction Prompt:
  ```text
  Context: Journalist helper.
  Task: Extract strictly factual data.
  Input: {TruncatedText}
  Output JSON: {
    "location": "City/Place or empty",
    "date": "Date of event or empty",
    "persons_involved": ["Name 1", "Name 2"]
  }
  ```

### Metadata UI Components
- [ ] Create `MetadataForm` (Location, Date, Byline inputs).
- [ ] Bind "Auto-fill" button to `MetadataService`.
- [ ] Add "Manual Override" capability (User edits AI suggestions).
- [ ] Add "Source" badge (e.g., "Extracted from PDF" vs "Manual Input").