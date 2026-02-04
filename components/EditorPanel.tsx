'use client';

import {
  FileText,
  Settings2,
  MapPin,
  Calendar,
  User,
  Users,
  Zap,
  RefreshCw,
  Sparkles,
  PenLine,
} from 'lucide-react';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { InputState, Settings, ANGLES, STYLES, GOALS } from '@/app/page';
import FileUploadZone from './FileUploadZone';

interface EditorPanelProps {
  input: InputState;
  setInput: (input: InputState | ((prev: InputState) => InputState)) => void;
  settings: Settings;
  setSettings: (settings: Settings | ((prev: Settings) => Settings)) => void;
  isExtractingMeta: boolean;
  isGenerating: boolean;
  metadataError?: string | null;
  onGetMetadata: (apiKey: string) => void;
  onGenerate: (apiKey: string) => void;
}

export default function EditorPanel({
  input,
  setInput,
  settings,
  setSettings,
  isExtractingMeta,
  isGenerating,
  metadataError,
  onGetMetadata,
  onGenerate,
}: EditorPanelProps) {
  const { apiKey } = useApiKey();

  const handleMetadataChange = (field: string, value: string) => {
    setInput({
      ...input,
      metadata: { ...input.metadata, [field]: value, source: 'manual' },
    });
  };

  return (
    <section className="lg:col-span-4 space-y-6">
      {/* Main Inputs */}
      <div className="space-y-4">
        {/* File Upload Zone */}
        <FileUploadZone
          onTextExtracted={(text) => setInput({ ...input, transcript: text })}
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

      {/* Metadata Grid - Now below Context */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Metadata
            </h3>
            {/* Source Badge */}
            {input.metadata.source === 'ai' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold bg-purple-100 text-purple-700 rounded-full">
                <Sparkles className="w-2.5 h-2.5" />
                AI
              </span>
            )}
            {input.metadata.source === 'manual' && input.metadata.location && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold bg-stone-100 text-stone-600 rounded-full">
                <PenLine className="w-2.5 h-2.5" />
                Manual
              </span>
            )}
          </div>
          <button
            onClick={() => onGetMetadata(apiKey)}
            disabled={isExtractingMeta || (!input.transcript && !input.context)}
            className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-all flex items-center gap-1 disabled:opacity-50"
          >
            <Zap className={`w-3 h-3 ${isExtractingMeta ? 'animate-pulse' : ''}`} />
            {isExtractingMeta ? 'SCANNING...' : 'GET METADATA'}
          </button>
        </div>

        {/* Error Message */}
        {metadataError && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {metadataError}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3">
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-300" />
            <input
              type="text"
              placeholder="Lokasi Kejadian..."
              value={input.metadata.location}
              onChange={(e) => handleMetadataChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-stone-300" />
              <input
                type="date"
                value={input.metadata.date}
                onChange={(e) => handleMetadataChange('date', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-300" />
              <input
                type="text"
                placeholder="Byline..."
                value={input.metadata.byline}
                onChange={(e) => handleMetadataChange('byline', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Persons Involved */}
          {input.metadata.personsInvolved && input.metadata.personsInvolved.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-[10px] font-bold text-stone-400 uppercase">Narasumber</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {input.metadata.personsInvolved.map((person, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-100"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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

      {/* Generate Button */}
      <button
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
