'use client';

import { Newspaper, Settings2, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { useApiKey } from '@/contexts/ApiKeyContext';
import { AVAILABLE_MODELS } from '@/services/GeminiService';

interface HeaderProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  onStartTour?: () => void;
}

export default function Header({ showSettings, setShowSettings, onStartTour }: HeaderProps) {
  const { isConnected, modelId } = useApiKey();

  const currentModel = AVAILABLE_MODELS.find(m => m.id === modelId);

  return (
    <header className="sticky top-0 z-40 glass border-b border-stone-200">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2" id="header-logo">
          <div className="bg-slate-900 p-1.5 rounded-lg shrink-0">
            <Newspaper className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tighter uppercase italic font-headline truncate max-w-[120px] md:max-w-none">
            Kuli Tinta AI
          </h1>
          {currentModel && (
            <span className="hidden sm:inline-block bg-slate-100 text-slate-600 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-1 md:ml-2 border border-stone-200">
              {currentModel.name.replace(' (Preview)', '')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
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
          <div className="h-6 w-[1px] bg-stone-200 hidden xs:block" />
          <div className="flex items-center gap-2 text-[10px] md:text-xs font-medium">
            {isConnected ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-3 h-3" />
                <span className="hidden sm:inline">Connected</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-400">
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">API Key Missing</span>
                <span className="sm:hidden">Missing Key</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
