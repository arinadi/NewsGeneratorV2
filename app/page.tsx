'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import HistorySidebar from '@/components/HistorySidebar';
import EditorPanel from '@/components/EditorPanel';
import PreviewPanel from '@/components/PreviewPanel';
import SettingsModal from '@/components/SettingsModal';
import GlobalDropzone from '@/components/GlobalDropzone';
import { ApiKeyProvider } from '@/contexts/ApiKeyContext';
import { DraftProvider } from '@/contexts/DraftContext';

// Constants
export const ANGLES = ['straight', 'impact', 'accountability', 'human_interest'] as const;
export const STYLES = ['formal', 'professional', 'casual', 'friendly', 'authoritative', 'conversational'] as const;
export const GOALS = ['google_news', 'seo_ranking', 'viral_social', 'informational'] as const;

export type Angle = typeof ANGLES[number];
export type Style = typeof STYLES[number];
export type Goal = typeof GOALS[number];

export interface Metadata {
  location: string;
  date: string;
  byline: string;
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
    },
  });

  const [settings, setSettings] = useState<Settings>({
    angle: 'straight',
    style: 'professional',
    goal: 'google_news',
  });

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

  const handleGetMetadata = useCallback(() => {
    if (!input.transcript && !input.context) return;
    setIsExtractingMeta(true);

    // Simulating AI extraction - will be replaced with real Gemini call in Phase 3
    setTimeout(() => {
      const mockMeta: Metadata = {
        location: 'Jakarta Pusat',
        date: new Date().toISOString().split('T')[0],
        byline: 'Budi Santoso',
      };
      setInput((prev) => ({ ...prev, metadata: mockMeta }));
      setIsExtractingMeta(false);
    }, 1500);
  }, [input.transcript, input.context]);

  const generateNews = useCallback((apiKey: string) => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    setIsGenerating(true);

    // Simulating Gemini 3 Pro Call - will be replaced with real API call in Phase 3
    setTimeout(() => {
      const mockResult: GeneratedResult = {
        titles: [
          'Langkah Strategis Pemerintah dalam Menangani Inflasi Global',
          'Inflasi 2024: Mengapa Dompet Kita Terasa Lebih Tipis?',
          'Dibalik Angka: Cerita Rakyat Menghadapi Kenaikan Harga',
        ],
        body: 'Jakarta - Pemerintah secara resmi mengumumkan serangkaian langkah strategis untuk memitigasi dampak inflasi global yang diperkirakan akan memuncak pada kuartal ketiga tahun ini. Dalam keterangannya hari ini, juru bicara menyampaikan bahwa koordinasi antar-lembaga menjadi kunci utama dalam menjaga daya beli masyarakat.\n\n"Kami tidak hanya melihat angka, kami melihat piring makan masyarakat," ujar salah satu narasumber dalam wawancara eksklusif tersebut. Kebijakan ini mencakup subsidi energi yang lebih tepat sasaran serta penguatan rantai pasok pangan lokal dari daerah produsen ke pasar-pasar induk di kota besar.',
        hashtags: '#BeritaTerkini #EkonomiIndonesia #Inflasi2024 #KuliTintaAI',
      };
      setResult(mockResult);
      saveToHistory(mockResult);
      setIsGenerating(false);
    }, 2000);
  }, [saveToHistory]);

  const loadFromHistory = useCallback((entry: HistoryEntry) => {
    setResult(entry.content);
    setSettings(entry.settings);
    setInput((prev) => ({ ...prev, metadata: entry.metadata }));
  }, []);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  }, []);

  // Handle file dropped from global dropzone
  const handleFileDropped = useCallback(async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      if (extension === 'txt') {
        const text = await file.text();
        setInput((prev) => ({ ...prev, transcript: text }));
      } else if (extension === 'pdf') {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: { str?: string }) => item.str || '')
            .join(' ');
          fullText += pageText + '\n\n';
        }
        
        setInput((prev) => ({ ...prev, transcript: fullText.trim() }));
      } else if (extension === 'docx') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setInput((prev) => ({ ...prev, transcript: result.value }));
      }
    } catch (error) {
      console.error('Failed to process dropped file:', error);
    }
  }, []);

  return (
    <ApiKeyProvider>
      <DraftProvider>
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
                onGetMetadata={handleGetMetadata}
                onGenerate={generateNews}
              />

              {/* Output Preview (5 Cols) */}
              <PreviewPanel
                result={result}
                metadata={input.metadata}
                onCopy={copyToClipboard}
              />
            </main>

            {/* Settings Modal */}
            <SettingsModal
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </GlobalDropzone>
      </DraftProvider>
    </ApiKeyProvider>
  );
}
