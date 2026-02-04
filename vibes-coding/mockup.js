import React, { useState, useEffect, useCallback } from 'react';
import { 
  Newspaper, 
  History, 
  Settings2, 
  FileText, 
  Upload, 
  RefreshCw, 
  Copy, 
  Download, 
  Printer, 
  Save, 
  Trash2, 
  Zap, 
  MapPin, 
  Calendar, 
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// --- Constants ---
const ANGLES = ['straight', 'impact', 'accountability', 'human_interest'];
const STYLES = ['formal', 'professional', 'casual', 'friendly', 'authoritative', 'conversational'];
const GOALS = ['google_news', 'seo_ranking', 'viral_social', 'informational'];

const App = () => {
  // --- State ---
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExtractingMeta, setIsExtractingMeta] = useState(false);
  
  const [input, setInput] = useState({
    transcript: '',
    context: '',
    metadata: {
      location: '',
      date: new Date().toISOString().split('T')[0],
      byline: ''
    }
  });

  const [settings, setSettings] = useState({
    angle: 'straight',
    style: 'professional',
    goal: 'google_news'
  });

  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // --- Effects ---
  useEffect(() => {
    const savedKey = localStorage.getItem('kuli_tinta_api_key');
    if (savedKey) setApiKey(savedKey);
    
    const savedHistory = JSON.parse(localStorage.getItem('kuli_tinta_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const saveToHistory = (newResult) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      title: newResult.titles[0],
      content: newResult,
      settings: { ...settings },
      metadata: { ...input.metadata }
    };
    const updatedHistory = [entry, ...history.slice(0, 19)];
    setHistory(updatedHistory);
    localStorage.setItem('kuli_tinta_history', JSON.stringify(updatedHistory));
  };

  // --- Handlers ---
  const handleGetMetadata = () => {
    if (!input.transcript && !input.context) return;
    setIsExtractingMeta(true);
    
    // Simulating AI extraction logic
    setTimeout(() => {
      const mockMeta = {
        location: "Jakarta Pusat",
        date: new Date().toISOString().split('T')[0],
        byline: "Budi Santoso"
      };
      setInput(prev => ({ ...prev, metadata: mockMeta }));
      setIsExtractingMeta(false);
    }, 1500);
  };

  const generateNews = () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    setIsGenerating(true);
    
    // Simulating Gemini 3 Pro Call
    setTimeout(() => {
      const mockResult = {
        titles: [
          "Langkah Strategis Pemerintah dalam Menangani Inflasi Global",
          "Inflasi 2024: Mengapa Dompet Kita Terasa Lebih Tipis?",
          "Dibalik Angka: Cerita Rakyat Menghadapi Kenaikan Harga"
        ],
        body: "Jakarta - Pemerintah secara resmi mengumumkan serangkaian langkah strategis untuk memitigasi dampak inflasi global yang diperkirakan akan memuncak pada kuartal ketiga tahun ini. Dalam keterangannya hari ini, juru bicara menyampaikan bahwa koordinasi antar-lembaga menjadi kunci utama dalam menjaga daya beli masyarakat.\n\n\"Kami tidak hanya melihat angka, kami melihat piring makan masyarakat,\" ujar salah satu narasumber dalam wawancara eksklusif tersebut. Kebijakan ini mencakup subsidi energi yang lebih tepat sasaran serta penguatan rantai pasok pangan lokal dari daerah produsen ke pasar-pasar induk di kota besar.",
        hashtags: "#BeritaTerkini #EkonomiIndonesia #Inflasi2024 #KuliTintaAI"
      };
      setResult(mockResult);
      saveToHistory(mockResult);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // In a real app, show a toast notification here
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-slate-900 font-sans selection:bg-stone-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 p-1.5 rounded-lg">
            <Newspaper className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tighter uppercase italic">Kuli Tinta AI</h1>
          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase ml-2">Gemini 3 Pro</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-colors ${showSettings ? 'bg-slate-200' : 'hover:bg-stone-100'}`}
          >
            <Settings2 className="w-5 h-5 text-slate-600" />
          </button>
          <div className="h-6 w-[1px] bg-stone-200" />
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            {apiKey ? (
              <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3 h-3" /> Connected</span>
            ) : (
              <span className="flex items-center gap-1 text-red-400"><AlertCircle className="w-3 h-3" /> API Key Missing</span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar - History (3 Cols) */}
        <aside className="lg:col-span-3 space-y-6 hidden lg:block">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-600">
                <History className="w-4 h-4" /> Riwayat Draf
              </h2>
              <span className="text-[10px] bg-stone-200 px-1.5 py-0.5 rounded text-stone-600">{history.length}</span>
            </div>
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-stone-100">
              {history.length > 0 ? history.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setResult(item.content)}
                  className="w-full text-left p-4 hover:bg-white transition-colors group"
                >
                  <p className="text-xs text-stone-400 mb-1">{item.timestamp}</p>
                  <h3 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 leading-tight">{item.title}</h3>
                </button>
              )) : (
                <div className="p-8 text-center text-stone-400 italic text-sm">Belum ada riwayat</div>
              )}
            </div>
          </div>

          {/* Quick Stats/Tips */}
          <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Pro Tip</h4>
            <p className="text-sm leading-relaxed opacity-90">Gunakan fitur <b>"Get Metadata"</b> untuk memastikan akurasi Byline dan Lokasi sesuai transkrip asli.</p>
          </div>
        </aside>

        {/* Input & Editor Area (5 Cols) */}
        <section className="lg:col-span-4 space-y-6">
          {/* Metadata Grid */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Metadata</h3>
              <button 
                onClick={handleGetMetadata}
                disabled={isExtractingMeta}
                className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-all flex items-center gap-1 disabled:opacity-50"
              >
                <Zap className={`w-3 h-3 ${isExtractingMeta ? 'animate-pulse' : ''}`} /> 
                {isExtractingMeta ? 'SCANNING...' : 'GET METADATA'}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-300" />
                <input 
                  type="text" 
                  placeholder="Lokasi Kejadian..."
                  value={input.metadata.location}
                  onChange={(e) => setInput({...input, metadata: {...input.metadata, location: e.target.value}})}
                  className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-stone-300" />
                  <input 
                    type="date" 
                    value={input.metadata.date}
                    onChange={(e) => setInput({...input, metadata: {...input.metadata, date: e.target.value}})}
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-300" />
                  <input 
                    type="text" 
                    placeholder="Byline..."
                    value={input.metadata.byline}
                    onChange={(e) => setInput({...input, metadata: {...input.metadata, byline: e.target.value}})}
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Inputs */}
          <div className="space-y-4">
             <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-4 py-2 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Transkrip / Raw Text
                  </span>
                  <button className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1">
                    <Upload className="w-3 h-3" /> UPLOAD FILE
                  </button>
                </div>
                <textarea 
                  className="w-full p-4 h-48 text-sm focus:outline-none resize-none bg-transparent"
                  placeholder="Paste hasil transkrip Whisper atau catatan wawancara di sini..."
                  value={input.transcript}
                  onChange={(e) => setInput({...input, transcript: e.target.value})}
                ></textarea>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-1">
                    <Settings2 className="w-3 h-3" /> Konteks Tambahan
                  </span>
                </div>
                <textarea 
                  className="w-full p-4 h-24 text-sm focus:outline-none resize-none bg-transparent"
                  placeholder="Paste undangan WA, siaran pers, atau info tambahan..."
                  value={input.context}
                  onChange={(e) => setInput({...input, context: e.target.value})}
                ></textarea>
             </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase ml-1">Angle</label>
              <select 
                value={settings.angle}
                onChange={(e) => setSettings({...settings, angle: e.target.value})}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/10 capitalize"
              >
                {ANGLES.map(a => <option key={a} value={a}>{a.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 uppercase ml-1">Style</label>
              <select 
                value={settings.style}
                onChange={(e) => setSettings({...settings, style: e.target.value})}
                className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-500/10 capitalize"
              >
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button 
            onClick={generateNews}
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

        {/* Output Preview (5 Cols) */}
        <section className="lg:col-span-5 relative">
          {!result ? (
            <div className="h-full min-h-[500px] border-2 border-dashed border-stone-300 rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="bg-stone-200 p-4 rounded-full">
                <Newspaper className="w-12 h-12 text-stone-400" />
              </div>
              <div>
                <h3 className="text-stone-500 font-bold uppercase tracking-widest mb-1 text-sm">Pratinjau Redaksi</h3>
                <p className="text-stone-400 text-sm max-w-xs">Isi data di sebelah kiri dan tekan Generate untuk mulai menyusun berita.</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#fffcf5] border border-stone-300 shadow-2xl rounded-sm p-8 sm:p-12 min-h-screen relative overflow-hidden">
              {/* Newspaper Texture Overlays */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
              
              {/* Header Koran */}
              <div className="border-b-4 border-slate-900 pb-4 mb-8 flex justify-between items-end">
                <div className="flex-1">
                  <h4 className="font-serif text-3xl font-black italic tracking-tighter">RED AKSI AI</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{input.metadata.location} • {input.metadata.date}</p>
                </div>
                <div className="flex gap-2 mb-1">
                  <button className="p-2 hover:bg-stone-100 rounded text-stone-400"><Copy className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-stone-100 rounded text-stone-400"><Download className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-stone-100 rounded text-stone-400"><Printer className="w-4 h-4" /></button>
                </div>
              </div>

              {/* Judul Opsi */}
              <div className="space-y-6 mb-10 group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5">HEADLINE CHOICES</span>
                  <button className="text-[10px] font-bold text-blue-600 flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity">
                    <RefreshCw className="w-3 h-3" /> REGEN TITLES
                  </button>
                </div>
                {result.titles.map((t, idx) => (
                  <div key={idx} className={`relative pl-6 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${idx === 0 ? 'before:bg-red-600' : 'before:bg-stone-200 opacity-60'}`}>
                    <h2 className={`font-serif leading-tight mb-1 ${idx === 0 ? 'text-3xl font-bold text-slate-900' : 'text-xl font-semibold text-slate-600'}`}>
                      {t}
                    </h2>
                  </div>
                ))}
              </div>

              {/* Byline */}
              <div className="flex items-center gap-3 mb-8 py-3 border-y border-stone-200">
                <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center font-bold text-stone-500 text-xs">
                  {input.metadata.byline ? input.metadata.byline[0] : 'K'}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Oleh Jurnalis</p>
                  <p className="text-xs font-bold text-slate-800">{input.metadata.byline || "Redaksi Kuli Tinta"}</p>
                </div>
              </div>

              {/* Body */}
              <div className="relative group/body">
                <button className="absolute -right-4 -top-6 text-[10px] font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover/body:opacity-100 transition-opacity">
                  <RefreshCw className="w-3 h-3" /> REGEN BODY
                </button>
                <div className="prose prose-stone max-w-none">
                  <p className="text-lg leading-relaxed font-serif text-slate-800 whitespace-pre-wrap first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                    {result.body}
                  </p>
                </div>
              </div>

              {/* Hashtags */}
              <div className="mt-12 pt-6 border-t border-stone-200 flex flex-wrap gap-2 group/hash">
                <button className="w-full mb-2 text-[10px] font-bold text-blue-600 flex items-center gap-1 opacity-0 group-hover/hash:opacity-100 transition-opacity">
                  <RefreshCw className="w-3 h-3" /> REGEN HASHTAGS
                </button>
                {result.hashtags.split(' ').map(tag => (
                  <span key={tag} className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                 <button className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
                    <Save className="w-3 h-3" /> Simpan ke Cloud
                 </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowSettings(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold flex items-center gap-2 italic tracking-tighter uppercase">
                <Settings2 className="w-6 h-6" /> Konfigurasi
              </h2>
              <p className="text-sm text-stone-500">Masukkan Gemini API Key Anda. Data disimpan secara lokal di browser Anda.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Gemini API Key</label>
                <input 
                  type="password"
                  placeholder="Paste your API key here..."
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    localStorage.setItem('kuli_tinta_api_key', e.target.value);
                  }}
                  className="w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-[10px] font-bold text-amber-700 uppercase mb-1">Keamanan Data</p>
                <p className="text-[11px] text-amber-800 opacity-80 leading-relaxed">Key ini hanya tersimpan di Local Storage perangkat Anda dan tidak pernah dikirim ke server pihak ketiga selain Google.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-all"
            >
              SIMPAN & TUTUP
            </button>
          </div>
        </div>
      )}

      {/* Mobile Actions Overlay */}
      <div className="fixed bottom-6 right-6 lg:hidden flex flex-col gap-3">
        <button className="bg-slate-900 text-white p-4 rounded-full shadow-2xl">
          <Zap className="w-6 h-6 fill-white" />
        </button>
      </div>
    </div>
  );
};

export default App;