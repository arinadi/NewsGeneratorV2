# Kuli Tinta AI

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farinadi%2FNewsGeneratorV2)

> **Professional News Generator PWA for Indonesian Journalists.**
> Powered by Google Gemini 3 Pro (Preview) with resilient multi-model fallback.

![Kuli Tinta AI](public/icons/icon-512.png)

## ✨ Core Features

### 🤖 Resilient AI Engine
- **Multi-Model Intelligence**: Automatically switches between **Gemini 3 Pro**, **Gemini 3 Flash**, and **Gemini 2.5 Flash** to handle rate limits (429 errors) and quotas.
- **2-Step Generation Strategy**: Generates article body first for context, then follows up with precision titles and hashtags.
- **Context-Aware Extraction**: Automatically identifies **Location**, **Date**, and **Persons Involved** from transcripts and uploaded files.

### 📝 Smart Editor & Drafts
- **Auto-Save & Restore**: 'Smart Drafts' automatically save your progress. Restore full state instantly—including input files, context, and settings.
- **Interactive Editing**: Double-click any generated title or paragraph to edit inline.
- **Workspace Management**: Easily clear your workspace or manage saved drafts from the sidebar.

### 🚀 Production Ready
- **Interactive Tour**: Built-in onboarding guide using `driver.js` for new users.
- **PWA Support**: Installable on mobile/desktop with offline service worker caching.
- **BYOK (Bring Your Own Key)**: API Key stored securely in your browser's local storage.
- **Multi-format Input**: Drag-and-drop support for PDF, DOCX, and TXT files.
- **Rate Limiter**: Built-in queue system to manage free tier API usage (10 RPM).

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router, Static Export)
- **AI**: Google GenAI SDK (Gemini 3 Pro / Flash)
- **State & Storage**: React Context + IndexedDB (`idb`)
- **Styling**: Tailwind CSS 4
- **UI Components**: Lucide React, Sonner (Toast)
- **UX/Onboarding**: Driver.js
- **File Processing**: pdfjs-dist, mammoth

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

  [![Get Gemini API Key](https://img.shields.io/badge/Get%20Gemini%20API%20Key-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com/apikey)

### Installation

```bash
# Clone the repository
git clone https://github.com/arinadi/NewsGeneratorV2.git
cd NewsGeneratorV2

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### API Key & Models
1. Click the **⚙️ Settings** icon.
2. Enter your **Gemini API Key**.
3. **Model Selection**: The app defaults to *Gemini 3 Pro*. You can manually select a model or let the auto-fallback system handle it.
4. Click "Test Connection" to verify.

### Build for Production

```bash
npm run build
```
Output is in the `out/` folder. Ready for Vercel, Netlify, or any static host.

## 📁 Project Structure

```
├── app/                  # Next.js App Router & Layouts
├── components/          
│   ├── EditorPanel.tsx   # Input form & file handling
│   ├── PreviewPanel.tsx  # Article display & inline editing
│   ├── HistorySidebar.tsx # Saved Drafts management
│   ├── TourGuide.tsx     # Onboarding tour logic
│   └── ...
├── services/            
│   ├── GeminiService.ts  # AI integration & Fallback logic
│   ├── DraftService.ts   # IndexedDB Draft management
│   └── RateLimiter.ts    # Request queueing
├── public/               # Manifest, Icons, SW
└── vibes-coding/         # Implementation plans & docs
```

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Credits

- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI Model
- [Next.js](https://nextjs.org/) - React Framework
- [Vercel](https://vercel.com) - Deployment
