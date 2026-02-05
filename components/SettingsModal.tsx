'use client';

import { useState, useEffect } from 'react';
import { Settings2, Cpu } from 'lucide-react';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { AVAILABLE_MODELS, ModelId, GeminiService } from '@/services/GeminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { apiKey, setApiKey } = useApiKey();
  const [selectedModel, setSelectedModel] = useState<ModelId>('gemini-3-pro-preview');

  // Load saved model on mount
  useEffect(() => {
    const saved = GeminiService.loadSavedModel();
    if (saved) {
      setSelectedModel(saved);
    }
  }, []);

  const handleModelChange = (model: ModelId) => {
    setSelectedModel(model);
    // Save to localStorage
    localStorage.setItem('kuli_tinta_model', model);
    // Update static working model
    GeminiService.loadSavedModel();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl space-y-6 z-10">
        <div className="space-y-2">
          <h2
            id="settings-title"
            className="text-2xl font-bold flex items-center gap-2 italic tracking-tighter uppercase font-headline"
          >
            <Settings2 className="w-6 h-6" />
            Konfigurasi
          </h2>
          <p className="text-sm text-stone-600">
            Masukkan Gemini API Key Anda. Data disimpan secara lokal di browser Anda.
          </p>
        </div>

        <div className="space-y-4">
          {/* API Key Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-stone-100/50 mb-1">
              <label
                htmlFor="api-key-input"
                className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1"
              >
                Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 font-medium hover:underline flex items-center gap-1"
              >
                Dapatkan Key &rarr;
              </a>
            </div>
            <input
              id="api-key-input"
              type="password"
              placeholder="Paste your API key here..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-800"
            />
          </div>

          {/* Model Selector */}
          <div className="space-y-2">
            <label
              htmlFor="model-select"
              className="text-[10px] font-bold uppercase tracking-widest text-stone-500 ml-1 flex items-center gap-1"
            >
              <Cpu className="w-3 h-3" />
              Model AI
            </label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => handleModelChange(e.target.value as ModelId)}
              className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer text-slate-800"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.tier})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-stone-500 ml-1">
              Jika model gagal, akan otomatis fallback ke model berikutnya.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-[10px] font-bold text-amber-800 uppercase mb-1">
              Keamanan Data
            </p>
            <p className="text-[11px] text-amber-900 opacity-90 leading-relaxed">
              Key ini hanya tersimpan di Local Storage perangkat Anda dan tidak pernah dikirim
              ke server pihak ketiga selain Google.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all"
        >
          SIMPAN & TUTUP
        </button>
      </div>
    </div>
  );
}
