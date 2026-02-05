'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Header from '@/components/Header';
import HistorySidebar from '@/components/HistorySidebar';
import EditorPanel from '@/components/EditorPanel';
import PreviewPanel from '@/components/PreviewPanel';
import SettingsModal from '@/components/SettingsModal';
import GlobalDropzone from '@/components/GlobalDropzone';
import { ApiKeyProvider, useApiKey } from '@/contexts/ApiKeyContext';
import { DraftProvider, useDrafts } from '@/contexts/DraftContext';
import { createGeminiService } from '@/services/GeminiService';

// Constants
export const ANGLES = ['straight', 'impact', 'accountability', 'human_interest'] as const;
export const STYLES = ['formal', 'professional', 'casual', 'friendly', 'authoritative', 'conversational'] as const;
export const GOALS = ['google_news', 'seo_ranking', 'viral_social', 'informational'] as const;

export type Angle = typeof ANGLES[number];
export type Style = typeof STYLES[number];
export type Goal = typeof GOALS[number];

export type MetadataSource = 'ai' | 'manual' | 'file';

export interface Metadata {
  location: string;
  date: string;
  byline: string;
  personsInvolved: string[];
  source: MetadataSource;
}

export interface InputState {
  transcript: string;
  context: string;
  metadata: Metadata;
}

export interface Settings {
  angle: Angle;
  style: Style;
  goal: Goal;
}

export interface GeneratedResult {
  titles: string[];
  body: string;
  hashtags: string;
}

export interface HistoryEntry {
  id: number;
  timestamp: string;
  title: string;
  content: GeneratedResult;
  settings: Settings;
  metadata: Metadata;
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtractingMeta, setIsExtractingMeta] = useState(false);

  const [input, setInput] = useState<InputState>({
    transcript: '',
    context: '',
    metadata: {
      location: '',
      date: new Date().toISOString().split('T')[0],
      byline: '',
      personsInvolved: [],
      source: 'manual',
    },
  });
  const [metadataError, setMetadataError] = useState<string | null>(null);

  // Initialize settings from URL params or defaults
  const [settings, setSettings] = useState<Settings>(() => ({
    angle: (searchParams.get('angle') as Angle) || 'straight',
    style: (searchParams.get('style') as Style) || 'professional',
    goal: (searchParams.get('goal') as Goal) || 'google_news',
  }));

  // Sync settings changes to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (settings.angle !== 'straight') params.set('angle', settings.angle);
    if (settings.style !== 'professional') params.set('style', settings.style);
    if (settings.goal !== 'google_news') params.set('goal', settings.goal);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [settings, router, pathname]);

  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('kuli_tinta_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  const saveToHistory = useCallback((newResult: GeneratedResult) => {
    const entry: HistoryEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      title: newResult.titles[0],
      content: newResult,
      settings: { ...settings },
      metadata: { ...input.metadata },
    };
    const updatedHistory = [entry, ...history.slice(0, 19)];
    setHistory(updatedHistory);
    localStorage.setItem('kuli_tinta_history', JSON.stringify(updatedHistory));
  }, [history, settings, input.metadata]);

  const handleGetMetadata = useCallback(async (apiKey: string) => {
    if (!input.transcript && !input.context) return;
    if (!apiKey) {
      setMetadataError('API Key diperlukan. Silakan atur di Settings.');
      return;
    }

    setIsExtractingMeta(true);
    setMetadataError(null);

    try {
      const gemini = createGeminiService(apiKey);
      // Combine transcript AND context for better metadata extraction
      const textToAnalyze = [input.transcript, input.context].filter(Boolean).join('\n\n---\nKONTEKS TAMBAHAN:\n');
      const extracted = await gemini.extractMetadata(textToAnalyze);

      setInput((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          location: extracted.location || prev.metadata.location,
          date: extracted.date || prev.metadata.date,
          personsInvolved: extracted.personsInvolved,
          source: 'ai',
        },
      }));
    } catch (error) {
      console.error('Metadata extraction failed:', error);
      setMetadataError('Gagal mengekstrak metadata. Silakan coba lagi.');
    } finally {
      setIsExtractingMeta(false);
    }
  }, [input.transcript, input.context]);

  const [generateError, setGenerateError] = useState<string | null>(null);

  const generateNews = useCallback(async (apiKey: string) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    if (!input.transcript) {
      setGenerateError('Masukkan transkrip terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const gemini = createGeminiService(apiKey);
      const generated = await gemini.generateNews({
        transcript: input.transcript,
        context: input.context,
        metadata: {
          location: input.metadata.location,
          date: input.metadata.date,
          byline: input.metadata.byline,
          personsInvolved: input.metadata.personsInvolved,
        },
        angle: settings.angle,
        style: settings.style,
        goal: settings.goal,
      });

      const newResult: GeneratedResult = {
        titles: generated.titles,
        body: generated.body,
        hashtags: generated.hashtags,
      };

      setResult(newResult);
      saveToHistory(newResult);
    } catch (error) {
      console.error('News generation failed:', error);
      setGenerateError('Gagal generate berita. Periksa API key dan coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  }, [input, settings, saveToHistory]);

  const loadFromHistory = useCallback((entry: HistoryEntry) => {
    setResult(entry.content);
    setSettings(entry.settings);
    setInput((prev) => ({ ...prev, metadata: entry.metadata }));
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  }, []);

  // Precision regeneration handlers
  const handleRegenTitles = useCallback(async () => {
    if (!result) return;
    const apiKey = localStorage.getItem('kuli_tinta_api_key');
    if (!apiKey) return;

    const gemini = createGeminiService(apiKey);
    const newTitles = await gemini.regenerateTitle(result.body);
    setResult({ ...result, titles: newTitles });
  }, [result]);

  const handleRegenBody = useCallback(async () => {
    if (!result) return;
    const apiKey = localStorage.getItem('kuli_tinta_api_key');
    if (!apiKey) return;

    const gemini = createGeminiService(apiKey);
    const newBody = await gemini.regenerateBody(result.titles[0], result.body);
    setResult({ ...result, body: newBody });
  }, [result]);

  const handleRegenHashtags = useCallback(async () => {
    if (!result) return;
    const apiKey = localStorage.getItem('kuli_tinta_api_key');
    if (!apiKey) return;

    const gemini = createGeminiService(apiKey);
    const article = `${result.titles[0]}\n\n${result.body}`;
    const newHashtags = await gemini.generateHashtags(article);
    setResult({ ...result, hashtags: newHashtags });
  }, [result]);

  const handleUpdateResult = useCallback((newResult: GeneratedResult) => {
    setResult(newResult);
  }, []);

  // Handle save draft
  const { saveDraft } = useDrafts();
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const handleSaveDraft = useCallback(async () => {
    if (!result) return;

    setIsSavingDraft(true);
    try {
      await saveDraft({
        title: result.titles[0],
        transcript: input.transcript,
        context: input.context,
        metadata: input.metadata,
        settings: settings,
      });
      // Fallback alert if toast not available or for confirmation
      alert('Draft berhasil disimpan!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Gagal menyimpan draft via IndexedDB');
    } finally {
      setIsSavingDraft(false);
    }
  }, [result, input, settings, saveDraft]);

  // Handle file dropped from global dropzone
  const handleFileDropped = useCallback(async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    // Extract cleaned filename to add as context (may contain names, locations, dates)
    const cleanedFilename = file.name
      .replace(/\.[^/.]+$/, '')  // remove extension
      .replace(/[-_]/g, ' ')     // replace separators with spaces
      .trim();

    // Extract file date metadata (last modified)
    const fileDate = new Date(file.lastModified);
    const fileDateStr = fileDate.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    try {
      let extractedText = '';

      if (extension === 'txt') {
        extractedText = await file.text();
      } else if (extension === 'pdf') {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = (textContent.items as Array<{ str?: string }>)
            .map((item) => item.str || '')
            .join(' ');
          fullText += pageText + '\n\n';
        }
        extractedText = fullText.trim();
      } else if (extension === 'docx') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      }

      if (extractedText) {
        // Build file context with name and date
        const fileContext = `Nama file: ${cleanedFilename}\nTanggal file: ${fileDateStr}`;

        setInput((prev) => ({
          ...prev,
          transcript: extractedText,
          context: prev.context
            ? `${prev.context}\n\n${fileContext}`
            : fileContext,
        }));
      }
    } catch (error) {
      console.error('Failed to process dropped file:', error);
    }
  }, []);

  return (
    <GlobalDropzone onFileDropped={handleFileDropped}>
      <div className="min-h-screen bg-paper">
        <Header
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />

        <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - History (3 Cols) */}
          <HistorySidebar
            history={history}
            onSelectEntry={loadFromHistory}
          />

          {/* Input & Editor Area (4 Cols) */}
          <EditorPanel
            input={input}
            setInput={setInput}
            settings={settings}
            setSettings={setSettings}
            isExtractingMeta={isExtractingMeta}
            isGenerating={isGenerating}
            metadataError={metadataError}
            onGetMetadata={handleGetMetadata}
            onGenerate={generateNews}
          />

          {/* Output Preview (5 Cols) */}
          <PreviewPanel
            result={result}
            metadata={input.metadata}
            onCopy={copyToClipboard}
            onRegenTitles={handleRegenTitles}
            onRegenBody={handleRegenBody}
            onRegenHashtags={handleRegenHashtags}
            onSaveDraft={handleSaveDraft}
            isSavingDraft={isSavingDraft}
            onUpdateResult={handleUpdateResult}
          />
        </main>

        {/* Settings Modal */}
        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    </GlobalDropzone>
  );
}
