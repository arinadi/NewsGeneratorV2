'use client';

import { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Trash2, Calendar, MapPin } from 'lucide-react';
import { Draft } from '@/contexts/DraftContext';

interface HistorySidebarProps {
  drafts: Draft[];
  onSelectDraft: (draft: Draft) => void;
  onDeleteDraft: (id: number) => void;
}

export default function HistorySidebar({ drafts, onSelectDraft, onDeleteDraft }: HistorySidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <>
      {/* Mobile Collapsible Header */}
      <div className="lg:hidden col-span-1">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full glass rounded-2xl border border-stone-200 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="font-bold text-sm uppercase tracking-wider text-slate-600">
              Saved Drafts
            </span>
            <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-600">
              {drafts.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-stone-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-stone-400" />
          )}
        </button>

        {/* Mobile Expanded Content */}
        {isExpanded && (
          <div className="glass rounded-2xl border border-stone-200 mt-2 overflow-hidden">
            <div className="max-h-[40vh] overflow-y-auto divide-y divide-stone-100">
              {drafts.length > 0 ? (
                drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="w-full text-left p-4 hover:bg-white transition-colors flex justify-between items-start group"
                  >
                    <button
                      onClick={() => {
                        onSelectDraft(draft);
                        setIsExpanded(false);
                      }}
                      className="flex-1 text-left"
                    >
                      <p className="text-xs text-stone-400 mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(draft.timestamp)}
                      </p>
                      <h3 className="text-sm font-semibold line-clamp-2 leading-tight text-slate-700">
                        {draft.title || '(Tanpa Judul)'}
                      </h3>
                      {draft.metadata?.location && (
                        <p className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {draft.metadata.location}
                        </p>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Hapus draft ini?')) onDeleteDraft(draft.id);
                      }}
                      className="p-1.5 hover:bg-red-50 text-stone-300 hover:text-red-500 rounded-lg transition-colors"
                      title="Hapus Draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-stone-400 italic text-sm">
                  Belum ada draft tersimpan
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside id="tour-history-sidebar" className="lg:col-span-3 space-y-6 hidden lg:block sticky top-24 h-fit">
        {/* Draft List */}
        <div className="glass rounded-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[calc(100vh-120px)]">
          <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between shrink-0">
            <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
              <FileText className="w-4 h-4" />
              Saved Drafts
            </h2>
            <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-600">
              {drafts.length}
            </span>
          </div>
          <div className="overflow-y-auto divide-y divide-stone-100 custom-scrollbar">
            {drafts.length > 0 ? (
              drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="w-full text-left p-4 hover:bg-white transition-colors group flex gap-3 relative"
                >
                  <button
                    onClick={() => onSelectDraft(draft)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                        {formatDate(draft.timestamp)}
                      </p>
                    </div>
                    <h3 className="text-sm font-bold text-slate-700 line-clamp-2 leading-tight mb-2 group-hover:text-blue-700 transition-colors">
                      {draft.title || '(Tanpa Judul)'}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] text-stone-500">
                      {draft.metadata?.location && (
                        <span className="flex items-center gap-1 bg-stone-100 px-1.5 py-0.5 rounded">
                          <MapPin className="w-3 h-3" />
                          {draft.metadata.location}
                        </span>
                      )}
                      {draft.settings?.angle && (
                        <span className="capitalize bg-stone-100 px-1.5 py-0.5 rounded">
                          {draft.settings.angle}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Delete Action - Visible on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Hapus draft ini secara permanen?')) onDeleteDraft(draft.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-lg transition-all"
                    title="Hapus Draft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-stone-400 italic text-sm">
                Belum ada draft tersimpan.
                <br />
                <span className="text-xs opacity-70">
                  Klik "Simpan Draft" setelah generate berita.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Pro Tip Card */}
        <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3 shadow-xl shrink-0">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Pro Tip
          </h4>
          <p className="text-sm leading-relaxed opacity-90">
            Gunakan tombol <b>Reset / Clear</b> di header untuk memulai lembar kerja baru yang bersih.
          </p>
        </div>
      </aside>
    </>
  );
}

