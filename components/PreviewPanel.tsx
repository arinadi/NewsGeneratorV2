'use client';

import { useState, useRef, useEffect } from 'react';
import { Newspaper, Copy, Download, Printer, RefreshCw, Save, Loader2, Check, Pencil, X } from 'lucide-react';
import { GeneratedResult, Metadata } from '@/lib/types';

interface PreviewPanelProps {
  result: GeneratedResult | null;
  metadata: Metadata;
  onCopy: (text: string) => void;
  onRegenTitles?: () => Promise<void>;
  onRegenBody?: () => Promise<void>;
  onRegenHashtags?: () => Promise<void>;
  onSaveDraft?: () => Promise<void>;
  isSavingDraft?: boolean;
  onUpdateResult?: (result: GeneratedResult) => void;
}

export default function PreviewPanel({
  result,
  metadata,
  onCopy,
  onRegenTitles,
  onRegenBody,
  onRegenHashtags,
  onSaveDraft,
  isSavingDraft = false,
  onUpdateResult,
}: PreviewPanelProps) {
  const [isRegenTitles, setIsRegenTitles] = useState(false);
  const [isRegenBody, setIsRegenBody] = useState(false);
  const [isRegenHashtags, setIsRegenHashtags] = useState(false);
  const [copyState, setCopyState] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      setIsEditing(true);
    }
    lastTap.current = now;
  };

  // Handle click outside to close editor (save)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && isEditing) {
        setIsEditing(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing]);

  const handleCopyFeedback = (section: string) => {
    setCopyState(section);
    setTimeout(() => setCopyState(null), 2000);
  };

  // ... (handlers) ...

  // NEW: Save Draft Handler with feedback
  const [saveFeedback, setSaveFeedback] = useState(false);
  const handleSaveClick = async () => {
    if (onSaveDraft) {
      await onSaveDraft();
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 3000);
    }
  };

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

  // Build export text with all titles and location/date
  const buildExportText = () => {
    const locationDate = `${metadata.location || 'Indonesia'} • ${metadata.date || new Date().toISOString().split('T')[0]}`;
    const allTitles = result.titles.map((t, i) => `${i + 1}. ${t}`).join('\n');
    return `${allTitles}\n\n${locationDate}\n\n${result.body}\n\n${result.hashtags}`;
  };

  const handleCopyAll = () => {
    onCopy(buildExportText());
    handleCopyFeedback('all');
  };

  const handleCopyTitles = () => {
    onCopy(result.titles.map((t, i) => `${i + 1}. ${t}`).join('\n'));
    handleCopyFeedback('titles');
  };

  const handleCopyBody = () => {
    onCopy(result.body);
    handleCopyFeedback('body');
  };

  const handleCopyHashtags = () => {
    onCopy(result.hashtags);
    handleCopyFeedback('hashtags');
  };

  const handleDownload = () => {
    const fullText = buildExportText();
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = result.titles[0]
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 50);
    a.download = `${safeTitle || 'artikel'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="tour-preview-panel" className="lg:col-span-5 relative" ref={containerRef}>
      <div className="bg-paper-light border border-stone-300 shadow-2xl rounded-sm p-5 sm:p-12 min-h-screen relative overflow-hidden print:shadow-none print:border-none">
        {/* Newspaper Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "url('/textures/paper-fibers.png')",
          }}
        />

        {/* Header Koran */}
        <div className="border-b-4 border-slate-900 pb-3 sm:pb-4 mb-6 sm:mb-8 flex justify-between items-end print:border-b-2">
          <div className="flex-1">
            <h2 className="font-headline text-2xl sm:text-3xl font-black italic tracking-tighter">
              REDAKSI AI
            </h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
              {metadata.location} • {metadata.date}
            </p>
          </div>
          <div className="flex gap-2 mb-1 print:hidden">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded transition-all duration-300 ${isEditing
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-stone-100 text-stone-400'
                }`}
              title={isEditing ? 'Close Editor' : 'Edit Text'}
            >
              {isEditing ? (
                <X className="w-4 h-4" />
              ) : (
                <Pencil className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleCopyAll}
              className={`p-2 rounded transition-all duration-300 ${copyState === 'all'
                ? 'bg-green-100 text-green-600'
                : 'hover:bg-stone-100 text-stone-400'
                }`}
              title="Copy to clipboard"
            >
              {copyState === 'all' ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
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
            <h3 className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5" id="headline-choices-label">
              HEADLINE CHOICES
            </h3>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handleCopyTitles}
                className={`text-[10px] font-bold flex items-center gap-1 transition-all duration-300 ${copyState === 'titles'
                  ? 'text-green-600'
                  : 'text-stone-500 hover:text-stone-700'
                  }`}
                title="Copy all titles"
              >
                {copyState === 'titles' ? (
                  <>
                    <Check className="w-3 h-3" />
                    COPIED!
                  </>
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={handleRegenTitles}
                disabled={isRegenTitles}
                className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors disabled:opacity-50"
              >
                {isRegenTitles ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                {isRegenTitles ? 'GENERATING...' : 'REGEN'}
              </button>
            </div>
          </div>
          {result.titles.map((t, idx) => (
            <div
              key={idx}
              className={`relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${idx === 0
                ? 'before:bg-red-600'
                : 'before:bg-stone-200 opacity-60'
                }`}
            >
              {isEditing ? (
                <input
                  type="text"
                  aria-labelledby="headline-choices-label"
                  value={t}
                  onChange={(e) => {
                    if (onUpdateResult) {
                      const newTitles = [...result.titles];
                      newTitles[idx] = e.target.value;
                      onUpdateResult({ ...result, titles: newTitles });
                    }
                  }}
                  className={`w-full bg-transparent border-b border-stone-300 focus:border-blue-500 outline-none font-headline leading-tight mb-1 ${idx === 0
                    ? 'text-2xl sm:text-3xl font-bold text-slate-900'
                    : 'text-lg sm:text-xl font-semibold text-slate-600'
                    }`}
                />
              ) : (
                <h3
                  onDoubleClick={() => setIsEditing(true)}
                  onTouchEnd={handleDoubleTap}
                  className={`font-headline leading-tight mb-1 cursor-text ${idx === 0
                    ? 'text-2xl sm:text-3xl font-bold text-slate-900'
                    : 'text-lg sm:text-xl font-semibold text-slate-600'
                    }`}
                  title="Double click (or double tap) to edit"
                >
                  {t}
                </h3>
              )}
            </div>
          ))}
        </div>

        {/* Byline */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8 py-3 border-y border-stone-200">
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
          <div className="absolute right-0 -top-6 flex items-center gap-2 print:hidden">
            <button
              onClick={handleCopyBody}
              className={`text-[10px] font-bold flex items-center gap-1 transition-all duration-300 ${copyState === 'body'
                ? 'text-green-600'
                : 'text-stone-500 hover:text-stone-700'
                }`}
              title="Copy body"
            >
              {copyState === 'body' ? (
                <>
                  <Check className="w-3 h-3" />
                  COPIED!
                </>
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
            <button
              onClick={handleRegenBody}
              disabled={isRegenBody}
              className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors disabled:opacity-50"
            >
              {isRegenBody ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {isRegenBody ? 'REWRITING...' : 'REGEN'}
            </button>
          </div>
          <div className="prose prose-stone max-w-none">
            {isEditing ? (
              <textarea
                value={result.body}
                onChange={(e) => {
                  if (onUpdateResult) {
                    onUpdateResult({ ...result, body: e.target.value });
                  }
                }}
                className="w-full h-[600px] p-4 bg-stone-50 border border-stone-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base sm:text-lg leading-relaxed font-serif text-slate-800 whitespace-pre-wrap resize-y"
              />
            ) : (
              <p
                onDoubleClick={() => setIsEditing(true)}
                onTouchEnd={handleDoubleTap}
                className="text-base sm:text-lg leading-relaxed font-serif text-slate-800 whitespace-pre-wrap drop-cap cursor-text"
                title="Double click (or double tap) to edit"
              >
                {result.body}
              </p>
            )}
          </div>
        </div>

        {/* Hashtags */}
        <div className="mt-12 pt-6 border-t border-stone-200 group/hash print:hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-stone-400 uppercase">Hashtags</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHashtags}
                className={`text-[10px] font-bold flex items-center gap-1 transition-all duration-300 ${copyState === 'hashtags'
                  ? 'text-green-600'
                  : 'text-stone-500 hover:text-stone-700'
                  }`}
                title="Copy hashtags"
              >
                {copyState === 'hashtags' ? (
                  <>
                    <Check className="w-3 h-3" />
                    COPIED!
                  </>
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
              <button
                onClick={handleRegenHashtags}
                disabled={isRegenHashtags}
                className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors disabled:opacity-50"
              >
                {isRegenHashtags ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                {isRegenHashtags ? 'REGEN' : 'REGEN'}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.hashtags.split(' ').map((tag) => (
              <span
                key={tag}
                className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Save to Draft */}
          <div className="mt-12 flex justify-center print:hidden">
            <button
              onClick={handleSaveClick}
              disabled={isSavingDraft || saveFeedback}
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all px-6 py-3 rounded-xl border ${saveFeedback
                ? 'bg-green-50 border-green-200 text-green-600'
                : 'border-transparent text-stone-400 hover:text-slate-900 hover:bg-stone-50'
                }`}
            >
              {isSavingDraft ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : saveFeedback ? (
                <Check className="w-3 h-3" />
              ) : (
                <Save className="w-3 h-3" />
              )}
              {isSavingDraft ? 'MENYIMPAN...' : saveFeedback ? 'TERSIMPAN' : 'SIMPAN DRAFT'}
            </button>
          </div>
        </div>
      </div>

      {/* Print View (Hidden on screen, visible on print) */}
      <div className="hidden print:block p-8 font-serif text-black bg-white">
        {/* Titles */}
        <div className="mb-8 space-y-4 border-b-2 border-black pb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-stone-500">Opsi Judul</h2>
          {result.titles.map((t, i) => (
            <h1 key={i} className="text-xl font-bold uppercase mb-2 leading-tight">
              {i + 1}. {t}
            </h1>
          ))}
        </div>

        {/* Metadata Line */}
        <p className="font-bold uppercase tracking-[0.2em] mb-8 text-sm text-slate-700">
          {metadata.location || 'Indonesia'} • {metadata.date || new Date().toISOString().split('T')[0]}
        </p>

        {/* Body */}
        <div className="whitespace-pre-wrap text-justify leading-relaxed mb-8 text-lg">
          {result.body}
        </div>

        {/* Hashtags */}
        <div className="text-sm font-bold italic text-slate-600">
          {result.hashtags}
        </div>
      </div>
    </section>
  );
}
