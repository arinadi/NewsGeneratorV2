# Kuli Tinta AI

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farinadi%2FNewsGeneratorV2)

> Professional News Generator PWA for Indonesian Journalists, powered by Gemini 3 Pro.

![Kuli Tinta AI](public/icons/icon-512.png)

## ✨ Features

- 🔐 **BYOK (Bring Your Own Key)** - API Key stored locally in browser
- 📄 **Multi-format Input** - Supports PDF, DOCX, TXT file uploads
- 🤖 **AI-Powered Generation** - 2-step prompt strategy for quality content
- 🎯 **Precision Regeneration** - Regenerate title, body, or hashtags independently
- 📰 **Newspaper-style Preview** - Professional editorial layout
- 📱 **PWA Support** - Installable on mobile and desktop
- 🔄 **Offline Capable** - Service worker caching
- 📥 **Export Options** - Copy, Download TXT, Print
- ⚡ **Rate Limiter** - Built-in protection for free tier users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

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

### Build for Production

```bash
npm run build
```

Output is in the `out/` folder. Deploy to any static hosting.

## 🌐 Deploy to Vercel

The easiest way to deploy is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farinadi%2FNewsGeneratorV2)

Or manually:

```bash
npm i -g vercel
vercel
```

## 🔧 Configuration

### API Key Setup
1. Open the app
2. Click the ⚙️ Settings icon
3. Enter your Gemini API Key
4. Click "Test Connection" to verify

### Supported File Types
| Format | Library |
|--------|---------|
| PDF | pdfjs-dist |
| DOCX | mammoth |
| TXT | Native |

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **AI**: Google Gemini 3 Pro
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **PWA**: Custom Service Worker

## 📁 Project Structure

```
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout with PWA meta
│   ├── page.tsx         # Main application
│   └── globals.css      # Tailwind styles
├── components/          # React components
│   ├── EditorPanel.tsx  # Input & metadata form
│   ├── PreviewPanel.tsx # Article preview & export
│   ├── Header.tsx       # Navigation & settings
│   └── ...
├── services/            # Business logic
│   ├── GeminiService.ts # AI integration
│   └── RateLimiter.ts   # Request queue
├── public/              # Static assets
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service worker
│   └── icons/          # PWA icons
└── vibes-coding/        # Planning docs
```

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 Credits

- [Google Gemini](https://deepmind.google/technologies/gemini/) - AI Model
- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons
