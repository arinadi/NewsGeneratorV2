'use client';

import { useState } from 'react';
import { Newspaper, Copy, Download, Printer, RefreshCw, Save, Loader2 } from 'lucide-react';
import { GeneratedResult, Metadata } from '@/app/page';

interface PreviewPanelProps {
  result: GeneratedResult | null;
  metadata: Metadata;
  onCopy: (text: string) => void;
  onRegenTitles?: () => Promise<void>;
  onRegenBody?: () => Promise<void>;
  onRegenHashtags?: () => Promise<void>;
}

export default function PreviewPanel({
  result,
  metadata,
  onCopy,
  onRegenTitles,
  onRegenBody,
  onRegenHashtags,
}: PreviewPanelProps) {
  const [isRegenTitles, setIsRegenTitles] = useState(false);
  const [isRegenBody, setIsRegenBody] = useState(false);
  const [isRegenHashtags, setIsRegenHashtags] = useState(false);

  const handleRegenTitles = async () => {
    if (!onRegenTitles) return;
    setIsRegenTitles(true);
    try {
      await onRegenTitles();
    } finally {
      setIsRegenTitles(false);
    }
  };

  const handleRegenBody = async () => {
    if (!onRegenBody) return;
    setIsRegenBody(true);
    try {
      await onRegenBody();
    } finally {
      setIsRegenBody(false);
    }
  };

  const handleRegenHashtags = async () => {
    if (!onRegenHashtags) return;
    setIsRegenHashtags(true);
    try {
      await onRegenHashtags();
    } finally {
      setIsRegenHashtags(false);
    }
  };
  if (!result) {
    return (
      <section className="lg:col-span-5 relative">
        <div className="h-full min-h-[500px] border-2 border-dashed border-stone-300 rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="bg-stone-200 p-4 rounded-full">
            <Newspaper className="w-12 h-12 text-stone-400" />
          </div>
          <div>
            <h3 className="text-stone-500 font-bold uppercase tracking-widest mb-1 text-sm">
              Pratinjau Redaksi
            </h3>
            <p className="text-stone-400 text-sm max-w-xs">
              Isi data di sebelah kiri dan tekan Generate untuk mulai menyusun berita.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const handleCopyAll = () => {
    const fullText = `${result.titles[0]}\n\n${result.body}\n\n${result.hashtags}`;
    onCopy(fullText);
  };

  const handleDownload = () => {
    const fullText = `${result.titles[0]}\n\n${result.body}\n\n${result.hashtags}`;
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `artikel-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="lg:col-span-5 relative">
      <div className="bg-paper-light border border-stone-300 shadow-2xl rounded-sm p-8 sm:p-12 min-h-screen relative overflow-hidden print:shadow-none print:border-none">
        {/* Newspaper Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
          }}
        />

        {/* Header Koran */}
        <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end print:border-b-2">
          <div className="flex-1">
            <h4 className="font-headline text-3xl font-black italic tracking-tighter">
              REDAKSI AI
            </h4>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              {metadata.location} • {metadata.date}
            </p>
          </div>
          <div className="flex gap-2 mb-1 print:hidden">
            <button
              onClick={handleCopyAll}
              className="p-2 hover:bg-stone-100 rounded text-stone-400 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-stone-100 rounded text-stone-400 transition-colors"
              title="Download as TXT"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-stone-100 rounded text-stone-400 transition-colors"
              title="Print"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Judul Opsi */}
        <div className="space-y-6 mb-10 group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5">
              HEADLINE CHOICES
            </span>
            <button
              onClick={handleRegenTitles}
              disabled={isRegenTitles}
              className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors print:hidden disabled:opacity-50"
            >
              {isRegenTitles ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {isRegenTitles ? 'GENERATING...' : 'REGEN TITLES'}
            </button>
          </div>
          {result.titles.map((t, idx) => (
            <div
              key={idx}
              className={`relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${idx === 0
                  ? 'before:bg-red-600'
                  : 'before:bg-stone-200 opacity-60'
                }`}
            >
              <h2
                className={`font-headline leading-tight mb-1 ${idx === 0
                    ? 'text-3xl font-bold text-slate-900'
                    : 'text-xl font-semibold text-slate-600'
                  }`}
              >
                {t}
              </h2>
            </div>
          ))}
        </div>

        {/* Byline */}
        <div className="flex items-center gap-3 mb-8 py-3 border-y border-stone-200">
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 text-xs">
            {metadata.byline ? metadata.byline[0].toUpperCase() : 'K'}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Oleh Jurnalis
            </p>
            <p className="text-xs font-bold text-slate-800">
              {metadata.byline || 'Redaksi Kuli Tinta'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="relative group/body">
          <button
            onClick={handleRegenBody}
            disabled={isRegenBody}
            className="absolute -right-4 -top-6 text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors print:hidden disabled:opacity-50"
          >
            {isRegenBody ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {isRegenBody ? 'REWRITING...' : 'REGEN BODY'}
          </button>
          <div className="prose prose-stone max-w-none">
            <p className="text-lg leading-relaxed font-serif text-slate-800 whitespace-pre-wrap drop-cap">
              {result.body}
            </p>
          </div>
        </div>

        {/* Hashtags */}
        <div className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap gap-2 group/hash print:hidden">
          <button
            onClick={handleRegenHashtags}
            disabled={isRegenHashtags}
            className="w-full mb-2 text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors disabled:opacity-50"
          >
            {isRegenHashtags ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {isRegenHashtags ? 'GENERATING...' : 'REGEN HASHTAGS'}
          </button>
          {result.hashtags.split(' ').map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Save to Cloud (placeholder) */}
        <div className="mt-12 flex justify-center print:hidden">
          <button className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
            <Save className="w-3 h-3" />
            Simpan ke Cloud
          </button>
        </div>
      </div>
    </section>
  );
}
