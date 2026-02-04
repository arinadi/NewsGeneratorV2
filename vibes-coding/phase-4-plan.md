# Phase 4: Premium Aesthetic & Distribution

> **Parent**: [Master Plan](./master-plan.md)
> **Context**: [Agent Rules](./agent.md)

## Goals
Transform the tool into a professional-feeling application and ensure it works as a PWA.

## Tasks

### Premium Newspaper Aesthetic
- [ ] Implement "Glassmorphism" UI System:
    - [ ] Frosted glass sidebars (`backdrop-blur`).
    - [ ] Subtle borders (`border-white/10`).
- [ ] Typography System:
    - [ ] **Headlines**: _Playfair Display_ (Serif).
    - [ ] **Body**: _Inter_ or _Roboto_ (Sans-serif).
- [ ] Layout Implementation:
    - [ ] CSS Grid Layout (Sidebar | Main Editor | Tools).
    - [ ] Mobile-Responsive constraints (Stack on <768px).

### PWA Configuration
- [ ] Generate `manifest.json` (Name, Icons, Start URL).
- [ ] Configure `next-pwa` or native Service Workers.
- [ ] App Shell Caching: Ensure UI loads instantly offline.
- [ ] Offline Fallback: Show "You are offline" mode if API calls fail.

### Export & Distribution Logic
- [ ] **Copy to Clipboard**:
    - [ ] Format: "Title\n\nBody..."
    - [ ] Toast Notification: "Copied to clipboard".
- [ ] **Download TXT**:
    - [ ] Generate simple `.txt` blob.
- [ ] **Print Mode**:
    - [ ] `@media print` CSS.
    - [ ] Hide Sidebar/Buttons.
    - [ ] Format as official document (Serif font, high contrast).

### Final Deployment
- [ ] Run `npm run build` (Static Export check).
- [ ] Vercel Deployment Setup.
- [ ] Mobile Testing (iOS Safari / Android Chrome).