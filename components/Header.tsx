'use client';

import { Newspaper, Settings2, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useApiKey } from '@/contexts/ApiKeyContext';

interface HeaderProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  onReset?: () => void;
  onStartTour?: () => void;
}

export default function Header({ showSettings, setShowSettings, onReset, onStartTour }: HeaderProps) {
  const { isConnected } = useApiKey();

  return (
    <header className="sticky top-0 z-40 glass border-b border-stone-200">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2" id="header-logo">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <Newspaper className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic font-headline">
            Kuli Tinta AI
          </h1>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-2">
            Gemini 3 Pro
          </span>
        </div>

        <div className="flex items-center gap-4">
          {onReset && (
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-wider"
              title="Reset semua data dan mulai baru"
            >
              Clear / Reset
            </button>
          )}
          {onStartTour && (
            <button
              onClick={onStartTour}
              id="header-help-btn"
              className="p-2 hover:bg-stone-100 rounded-full text-slate-400 hover:text-blue-600 transition-colors"
              title="Mulai Tour / Bantuan"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            id="header-settings"
            className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-slate-200' : 'hover:bg-stone-100'
              }`}
            aria-label="Settings"
          >
            <Settings2 className="w-5 h-5 text-slate-600" />
          </button>
          <div className="h-6 w-[1px] bg-stone-200" />
          <div className="flex items-center gap-2 text-xs font-medium">
            {isConnected ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400">
                <AlertCircle className="w-3 h-3" />
                API Key Missing
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
