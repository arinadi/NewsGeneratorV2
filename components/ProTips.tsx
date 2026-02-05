'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Lightbulb } from 'lucide-react';

const TIPS = [
    <span key="1">Gunakan tombol <b>Reset / Clear</b> di header untuk memulai lembar kerja baru yang bersih.</span>,
    <span key="2">Simpan pekerjaan Anda dengan tombol <b>Simpan Draft</b> agar tidak hilang saat refresh.</span>,
    <span key="3">Isi kolom <b>Konteks Tambahan</b> untuk memberikan latar belakang detail pada Artikel.</span>,
    <span key="4">Gunakan <b>Angle</b> yang berbeda (e.g., Profil, Investigasi) untuk variasi sudut pandang berita.</span>,
    <span key="5">Draft yang tersimpan dapat dimuat kembali lengkap dengan <b>setting dan input</b> sebelumnya.</span>,
];

export default function ProTips() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [key, setKey] = useState(0); // Used to trigger animation reset

    const nextTip = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % TIPS.length);
        setKey((prev) => prev + 1);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextTip, 60000); // 60 seconds
        return () => clearInterval(timer);
    }, [nextTip]);

    return (
        <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3 shadow-xl shrink-0 border border-slate-800 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Lightbulb className="w-16 h-16" />
            </div>

            <div className="flex items-center justify-between relative z-10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                    Pro Tip
                </h4>
                <button
                    onClick={nextTip}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                    title="Next Tip"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div key={key} className="relative z-10 min-h-[3rem] animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-sm leading-relaxed opacity-90">
                    {TIPS[currentIndex]}
                </p>
            </div>

            {/* Progress Bar (Optional visual indicator of timing) */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-slate-800 w-full">
                <div key={key} className="h-full bg-slate-600/50 w-full animate-[progress_60s_linear]" />
            </div>
            <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    );
}
