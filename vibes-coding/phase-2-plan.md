# Phase 2: Multimodal Input & Smart Metadata

> **Parent**: [Master Plan](./master-plan.md)
> **Status**: ✅ COMPLETE
> **Context**: [Agent Rules](./agent.md)

## Goals
Enable journalists to upload any file and automatically extract factual metadata without server-side processing.

## Completed Tasks

### ✅ File Parsing Engine
- [x] Create `FileUploadZone` component (Drag & Drop)
- [x] Create `GlobalDropzone` for full-page file drop support
- [x] **TXT Handler**: Direct text reading
- [x] **PDF Handler**:
  - [x] Install `pdfjs-dist`
  - [x] Configure CDN Worker for PDF parsing
  - [x] Extract text layer from all pages
- [x] **DOCX Handler**:
  - [x] Install `mammoth`
  - [x] Convert DOCX to raw text

### ✅ The "Get Metadata" Feature
- [x] Implement `GeminiService.extractMetadata(text)` function
- [x] Meta-extraction Prompt with JSON output:
  ```json
  {
    "location": "City/place name",
    "date": "YYYY-MM-DD",
    "personsInvolved": ["Name 1", "Name 2"]
  }
  ```
- [x] Rate-limited API calls to avoid free tier limits

### ✅ File Context Extraction (Improvement)
- [x] Extract cleaned filename and add to context
- [x] Extract file date (lastModified) in Indonesian locale
- [x] Context format example:
  ```
  File name: Interview Joko Widodo Jakarta
  File date: Wednesday, February 5, 2025
  ```

### ✅ Metadata UI Components
- [x] Metadata fields in EditorPanel (Location, Date, Byline, Persons)
- [x] "GET METADATA" button bound to GeminiService
- [x] Manual override capability (user can edit AI suggestions)
- [x] Source badge showing metadata origin ('ai', 'manual', 'file')