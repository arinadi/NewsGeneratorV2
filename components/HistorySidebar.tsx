'use client';

import { History } from 'lucide-react';
import { HistoryEntry } from '@/app/page';

interface HistorySidebarProps {
  history: HistoryEntry[];
  onSelectEntry: (entry: HistoryEntry) => void;
}

export default function HistorySidebar({ history, onSelectEntry }: HistorySidebarProps) {
  return (
    <aside className="lg:col-span-3 space-y-6 hidden lg:block">
      {/* History List */}
      <div className="glass rounded-2xl border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
            <History className="w-4 h-4" />
            Riwayat Draf
          </h2>
          <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-600">
            {history.length}
          </span>
        </div>
        <div className="max-h-[70vh] overflow-y-auto divide-y divide-stone-100">
          {history.length > 0 ? (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectEntry(item)}
                className="w-full text-left p-4 hover:bg-white transition-colors group"
              >
                <p className="text-xs text-stone-400 mb-1">{item.timestamp}</p>
                <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 leading-tight">
                  {item.title}
                </h3>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-stone-400 italic text-sm">
              Belum ada riwayat
            </div>
          )}
        </div>
      </div>

      {/* Pro Tip Card */}
      <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3 shadow-xl">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Pro Tip
        </h4>
        <p className="text-sm leading-relaxed opacity-90">
          Gunakan fitur <b>&quot;Get Metadata&quot;</b> untuk memastikan akurasi Byline dan Lokasi
          sesuai transkrip asli.
        </p>
      </div>
    </aside>
  );
}
