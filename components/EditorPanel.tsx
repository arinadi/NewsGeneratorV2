'use client';

import {
  FileText,
  Settings2,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { InputState, Settings, ANGLES, STYLES, GOALS } from '@/app/page';
import FileUploadZone from './FileUploadZone';

interface EditorPanelProps {
  input: InputState;
  setInput: (input: InputState | ((prev: InputState) => InputState)) => void;
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  isGenerating: boolean;
  onGenerate: (apiKey: string) => void;
  onFileDropped?: (file: File) => Promise<void>;
}

export default function EditorPanel({
  input,
  setInput,
  settings,
  setSettings,
  isGenerating,
  onGenerate,
  onFileDropped,
}: EditorPanelProps) {
  const { apiKey } = useApiKey();

  return (
    <section id="tour-editor-panel" className="lg:col-span-4 space-y-6">
      {/* Main Inputs */}
      <div id="tour-input-area" className="space-y-4">
        {/* File Upload Zone */}
        <FileUploadZone
          onTextExtracted={(text) => setInput({ ...input, transcript: text })}
          onFileSelected={onFileDropped}
          className="mb-2"
        />

        {/* Transcript Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Transkrip / Raw Text
            </span>
            {input.transcript && (
              <span className="text-[10px] text-stone-400">
                {input.transcript.length.toLocaleString()} karakter
              </span>
            )}
          </div>
          <textarea
            className="w-full p-4 h-48 text-sm focus:outline-none resize-none bg-transparent"
            placeholder="Paste hasil transkrip Whisper atau catatan wawancara di sini..."
            value={input.transcript}
            onChange={(e) => setInput({ ...input, transcript: e.target.value })}
          />
        </div>

        {/* Context Input */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
              <Settings2 className="w-3 h-3" />
              Konteks Tambahan
            </span>
          </div>
          <textarea
            className="w-full p-4 h-24 text-sm focus:outline-none resize-none bg-transparent"
            placeholder="Paste undangan WA, siaran pers, atau info tambahan..."
            value={input.context}
            onChange={(e) => setInput({ ...input, context: e.target.value })}
          />
        </div>
      </div>


      {/* Article Settings Group */}
      <div id="tour-article-settings" className="space-y-4">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase ml-1">
              Angle
            </label>
            <select
              value={settings.angle}
              onChange={(e) =>
                setSettings({ ...settings, angle: e.target.value as typeof settings.angle })
              }
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/10 capitalize"
            >
              {ANGLES.map((a) => (
                <option key={a} value={a}>
                  {a.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-500 uppercase ml-1">
              Style
            </label>
            <select
              value={settings.style}
              onChange={(e) =>
                setSettings({ ...settings, style: e.target.value as typeof settings.style })
              }
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/10 capitalize"
            >
              {STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Goal Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-500 uppercase ml-1">
            Goal
          </label>
          <select
            value={settings.goal}
            onChange={(e) =>
              setSettings({ ...settings, goal: e.target.value as typeof settings.goal })
            }
            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/10 capitalize"
          >
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {g.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        id="tour-generate-btn"
        onClick={() => onGenerate(apiKey)}
        disabled={isGenerating || !input.transcript}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" />
            MENYUSUN BERITA...
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 fill-white" />
            GENERATE ARTICLE
          </>
        )}
      </button>
    </section>
  );
}
