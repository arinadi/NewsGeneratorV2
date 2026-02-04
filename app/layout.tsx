import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kuli Tinta AI - News Generator',
  description: 'Professional PWA for Indonesian Journalists powered by Gemini 3 Pro',
  keywords: ['news generator', 'AI', 'journalism', 'Indonesia', 'Gemini'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-paper text-slate-900 font-sans selection:bg-stone-300 antialiased">
        {children}
      </body>
    </html>
  );
}
