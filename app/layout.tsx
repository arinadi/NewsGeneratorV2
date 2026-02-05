import type { Metadata, Viewport } from 'next';
import './globals.css';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Kuli Tinta AI - News Generator',
  description: 'Professional PWA for Indonesian Journalists powered by Gemini 3 Pro',
  keywords: ['news generator', 'AI', 'journalism', 'Indonesia', 'Gemini'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kuli Tinta',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#1e293b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-paper text-slate-900 font-sans selection:bg-stone-300 antialiased">
        <Providers>
          <ServiceWorkerRegistration />
          {children}
        </Providers>
      </body>
    </html>
  );
}
