'use client';

import { GoogleGenAI } from '@google/genai';
import { withRateLimit } from './RateLimiter';

// Types
export interface ExtractedMetadata {
    location: string;
    date: string;
    personsInvolved: string[];
}

export interface GenerateNewsOptions {
    transcript: string;
    context?: string;
    metadata: {
        location: string;
        date: string;
        byline: string;
        personsInvolved?: string[];
    };
    angle: 'straight' | 'impact' | 'accountability' | 'human_interest';
    style: 'formal' | 'professional' | 'casual' | 'friendly' | 'authoritative' | 'conversational';
    goal: 'google_news' | 'seo_ranking' | 'viral_social' | 'informational';
}

export interface GeneratedNews {
    titles: string[];
    body: string;
    hashtags: string;
}

// Prompts
const EXTRACTION_PROMPT = `Kamu adalah asisten jurnalis Indonesia yang bertugas mengekstrak metadata faktual dari teks berita.

TUGAS: Ekstrak data faktual berikut dari SELURUH teks yang diberikan (termasuk bagian KONTEKS TAMBAHAN jika ada).

FORMAT OUTPUT (JSON only, tanpa markdown code block):
{
  "location": "Nama kota/tempat kejadian, atau kosong jika tidak disebutkan",
  "date": "Tanggal kejadian dalam format YYYY-MM-DD, atau kosong jika tidak disebutkan",
  "personsInvolved": ["Nama lengkap orang 1", "Nama lengkap orang 2"]
}

ATURAN:
1. Baca SELURUH teks termasuk bagian "KONTEKS TAMBAHAN" jika ada
2. Ekstrak nama file dan tanggal file dari konteks jika tersedia
3. Hanya ekstrak data yang EKSPLISIT disebutkan dalam teks
4. Jangan mengarang atau menyimpulkan
5. Jika tidak ada informasi, gunakan string kosong atau array kosong
6. Untuk personsInvolved, gunakan nama LENGKAP (bukan singkatan)

TEKS INPUT:
`;

const KULI_TINTA_SYSTEM = `Kamu adalah "Kuli Tinta AI", seorang editor senior berpengalaman 20 tahun di media nasional seperti Tempo dan Kompas.

IDENTITAS & GAYA:
- Menulis dalam Bahasa Indonesia Baku Jurnalistik
- Mengutamakan fakta, objektivitas, dan dampak
- Struktur: Piramida Terbalik (5W+1H di paragraf pertama)
- Nada: Tegas, lugas, tidak bertele-tele

LARANGAN KERAS (BANNED PHRASES):
❌ "Di sisi lain" 
❌ "Kesimpulannya"
❌ "Menarik untuk dicatat"
❌ "Perlu diketahui"
❌ "Seperti yang kita ketahui"
❌ "Tidak bisa dipungkiri"
❌ Kalimat pasif berlebihan
❌ Kata-kata hiperbolis tanpa bukti

PRINSIP:
1. Setiap klaim harus bisa diatribusi ke sumber dalam transkrip
2. Jika tidak ada data, JANGAN mengarang
3. Kutipan langsung menggunakan tanda petik dan atribusi jelas
4. Lead harus menjawab: Siapa, Apa, Kapan, Di mana dalam 2 kalimat pertama
`;

// STEP 1: Generate Body
function buildBodyPrompt(options: GenerateNewsOptions): string {
    const angleMap = {
        straight: 'Berita langsung - fokus pada fakta inti',
        impact: 'Berita dampak - tekankan efek pada masyarakat',
        accountability: 'Berita akuntabilitas - soroti tanggung jawab pihak terkait',
        human_interest: 'Human interest - ceritakan sisi manusiawi',
    };

    const goalMap = {
        google_news: 'Lead kuat, struktur jelas untuk Google News',
        seo_ranking: 'Keyword natural untuk SEO',
        viral_social: 'Hook kuat, emosional tapi faktual',
        informational: 'Lengkap, mendalam, edukatif',
    };

    const personsStr = options.metadata.personsInvolved?.length
        ? `Narasumber: ${options.metadata.personsInvolved.join(', ')}`
        : '';

    return `${KULI_TINTA_SYSTEM}

TUGAS: Tulis ISI BERITA (body only, tanpa judul) berdasarkan transkrip berikut.

METADATA:
- Lokasi: ${options.metadata.location || 'Tidak disebutkan'}
- Tanggal: ${options.metadata.date || 'Hari ini'}
- Byline: ${options.metadata.byline || 'Redaksi'}
${personsStr}

PARAMETER:
- Angle: ${angleMap[options.angle]}
- Style: ${options.style}
- Goal: ${goalMap[options.goal]}

TRANSKRIP/CATATAN:
${options.transcript}

${options.context ? `KONTEKS TAMBAHAN:\n${options.context}` : ''}

FORMAT OUTPUT: Tulis isi berita langsung (text only, TANPA JSON, TANPA judul).
Gunakan line break ganda untuk pemisah paragraf.
Mulai dengan lead paragraph yang menjawab 5W+1H.
`;
}

// STEP 2: Generate Title & Hashtags from Body
function buildTitleHashtagPrompt(body: string, goal: string): string {
    const goalHint: Record<string, string> = {
        google_news: 'Judul informatif untuk Google News',
        seo_ranking: 'Judul SEO-friendly dengan keyword utama',
        viral_social: 'Judul catchy yang shareable',
        informational: 'Judul deskriptif dan jelas',
    };

    return `${KULI_TINTA_SYSTEM}

TUGAS: Buat 3 JUDUL dan HASHTAG untuk artikel berikut.

GOAL: ${goalHint[goal] || goalHint.google_news}

ISI ARTIKEL:
${body}

FORMAT OUTPUT (JSON only, tanpa markdown code block):
{
  "titles": [
    "Judul utama (max 70 karakter)",
    "Judul alternatif 1",
    "Judul alternatif 2"
  ],
  "hashtags": "#Tag1 #Tag2 #Tag3 #Tag4 #Tag5"
}
`;
}

const TITLE_REGEN_PROMPT = `${KULI_TINTA_SYSTEM}

TUGAS: Buat 3 judul alternatif baru untuk artikel berikut. Judul harus:
- Informatif dan menarik
- Mengandung kata kunci utama
- Maksimal 70 karakter
- Berbeda angle satu sama lain

ARTIKEL:
`;

const BODY_REGEN_PROMPT = `${KULI_TINTA_SYSTEM}

TUGAS: Tulis ulang isi berita berikut dengan struktur dan narasi yang lebih baik.
Pertahankan semua fakta dan kutipan, tapi perbaiki:
- Struktur piramida terbalik
- Alur cerita
- Transisi antar paragraf

JUDUL YANG DIPERTAHANKAN:
`;

const HASHTAG_PROMPT = `Buat 5-7 hashtag SEO-friendly dalam Bahasa Indonesia untuk artikel berikut.
Hashtag harus relevan, trending-friendly, dan tidak terlalu generik.

FORMAT OUTPUT: #Tag1 #Tag2 #Tag3 #Tag4 #Tag5

ARTIKEL:
`;

/**
 * Extract potential name from filename (basic cleaning only)
 * Returns cleaned text for AI validation
 */
export function extractPotentialName(filename: string): string | null {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const cleanName = nameWithoutExt
        .replace(/^(interview|wawancara|transkrip|transcript|rekaman|recording)[-_\s]*/i, '')
        .replace(/[-_]/g, ' ')
        .trim();

    // Only return if it has at least 2 words
    const words = cleanName.split(/\s+/);
    if (words.length >= 2 && words.length <= 5) {
        return cleanName;
    }
    return null;
}

// Available models in order of preference (fallback order)
export const AVAILABLE_MODELS = [
    { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Preview)', tier: 'premium' },
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Preview)', tier: 'standard' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', tier: 'free' },
] as const;

export type ModelId = typeof AVAILABLE_MODELS[number]['id'];

/**
 * GeminiService - Client-side AI service with model fallback
 * Uses 2-step generation: Body first, then Titles + Hashtags
 */
export class GeminiService {
    private ai: GoogleGenAI;
    private model: ModelId;
    private static workingModel: ModelId | null = null;

    constructor(apiKey: string, model?: ModelId) {
        this.ai = new GoogleGenAI({ apiKey });
        // Use stored working model, passed model, or default
        this.model = GeminiService.workingModel || model || 'gemini-3-pro-preview';
    }

    /**
     * Get the currently active model
     */
    getModel(): ModelId {
        return this.model;
    }

    /**
     * Set the model and save as working model
     */
    setModel(model: ModelId): void {
        this.model = model;
        GeminiService.workingModel = model;
        // Persist to localStorage
        if (typeof window !== 'undefined') {
            localStorage.setItem('kuli_tinta_model', model);
        }
    }

    /**
     * Load saved model from localStorage
     */
    static loadSavedModel(): ModelId | null {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('kuli_tinta_model');
            if (saved && AVAILABLE_MODELS.some(m => m.id === saved)) {
                GeminiService.workingModel = saved as ModelId;
                return saved as ModelId;
            }
        }
        return null;
    }

    /**
     * Private helper: Generate content with rate limiting and model fallback
     */
    private async generate(contents: string): Promise<string> {
        return withRateLimit(async () => {
            // Try current model first
            const modelsToTry = [this.model, ...AVAILABLE_MODELS.map(m => m.id).filter(m => m !== this.model)];

            for (const modelId of modelsToTry) {
                try {
                    console.log(`[GeminiService] Trying model: ${modelId}`);
                    const response = await this.ai.models.generateContent({
                        model: modelId,
                        contents,
                    });

                    // If successful, save this model as working
                    if (modelId !== this.model) {
                        console.log(`[GeminiService] Fallback to ${modelId} successful, saving as default`);
                        this.setModel(modelId);
                    }

                    return response.text || '';
                } catch (error: unknown) {
                    const err = error as Error & { status?: number; message?: string };

                    // Check if quota exceeded for THIS model - try next model
                    const isQuotaExceeded = err.status === 429 ||
                        err.message?.includes('quota') ||
                        err.message?.includes('RESOURCE_EXHAUSTED');

                    if (isQuotaExceeded) {
                        console.warn(`[GeminiService] Model ${modelId} quota exceeded, trying next...`);
                        continue;
                    }

                    // For other errors, also try next model
                    console.warn(`[GeminiService] Model ${modelId} failed:`, err.message);
                    continue;
                }
            }

            throw new Error('All models failed. Please check your API key and try again.');
        });
    }

    /**
     * Extract metadata from news text
     */
    async extractMetadata(text: string): Promise<ExtractedMetadata> {
        const truncatedText = text.slice(0, 4000);

        try {
            const responseText = await this.generate(EXTRACTION_PROMPT + truncatedText);
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error('Invalid response format');

            const parsed = JSON.parse(jsonMatch[0]);
            return {
                location: parsed.location || '',
                date: parsed.date || '',
                personsInvolved: Array.isArray(parsed.personsInvolved) ? parsed.personsInvolved : [],
            };
        } catch (error) {
            console.error('[GeminiService] Extraction failed:', error);
            throw error;
        }
    }

    /**
     * Validate if a text is a valid person name using AI
     * Returns the validated name or null if not a valid person name
     */
    async validatePersonName(potentialName: string): Promise<string | null> {
        try {
            const prompt = `Apakah "${potentialName}" adalah nama orang yang valid (bukan nama tempat, organisasi, atau kata acak)?

Jawab dalam format JSON:
{
  "isValidName": true/false,
  "correctedName": "Nama yang benar jika valid, atau null"
}

Contoh nama valid: "Joko Widodo", "Budi Santoso", "Sri Mulyani"
Contoh bukan nama: "Data Penting", "Rekaman Audio", "Jakarta Pusat"`;

            const responseText = await this.generate(prompt);
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) return null;

            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.isValidName && parsed.correctedName) {
                return parsed.correctedName;
            }
            return null;
        } catch (error) {
            console.error('[GeminiService] Name validation failed:', error);
            return null;
        }
    }

    /**
     * Generate full news article using 2-step strategy
     * Step 1: Generate body from transcript + context + metadata
     * Step 2: Generate titles + hashtags from the body
     */
    async generateNews(options: GenerateNewsOptions): Promise<GeneratedNews> {
        // STEP 1: Generate Body
        console.log('[GeminiService] Step 1: Generating body...');
        const bodyPrompt = buildBodyPrompt(options);
        const body = (await this.generate(bodyPrompt)).trim();
        if (!body) throw new Error('Failed to generate body');

        // STEP 2: Generate Titles + Hashtags from Body
        console.log('[GeminiService] Step 2: Generating titles & hashtags...');
        const titlePrompt = buildTitleHashtagPrompt(body, options.goal);
        const titleText = await this.generate(titlePrompt);

        const jsonMatch = titleText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            // Fallback if JSON parsing fails
            return {
                titles: ['Judul Berita'],
                body,
                hashtags: '#Berita #Indonesia',
            };
        }

        const parsed = JSON.parse(jsonMatch[0]);
        return {
            titles: Array.isArray(parsed.titles) ? parsed.titles : ['Judul Berita'],
            body,
            hashtags: parsed.hashtags || '#Berita',
        };
    }

    /**
     * Regenerate only titles for existing article
     */
    async regenerateTitle(articleBody: string): Promise<string[]> {
        try {
            const prompt = TITLE_REGEN_PROMPT + articleBody + '\n\nFORMAT OUTPUT (JSON array only):\n["Judul 1", "Judul 2", "Judul 3"]';
            const responseText = await this.generate(prompt);
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error('Invalid response format');
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('[GeminiService] Title regeneration failed:', error);
            throw error;
        }
    }

    /**
     * Regenerate only body for existing article
     */
    async regenerateBody(title: string, currentBody: string): Promise<string> {
        try {
            const prompt = BODY_REGEN_PROMPT + title + '\n\nISI SAAT INI:\n' + currentBody + '\n\nTulis ulang isi berita (text only, tanpa JSON):';
            return await this.generate(prompt) || currentBody;
        } catch (error) {
            console.error('[GeminiService] Body regeneration failed:', error);
            throw error;
        }
    }

    /**
     * Generate hashtags for article
     */
    async generateHashtags(article: string): Promise<string> {
        try {
            return (await this.generate(HASHTAG_PROMPT + article)).trim();
        } catch (error) {
            console.error('[GeminiService] Hashtag generation failed:', error);
            throw error;
        }
    }

    /**
     * Test API connection with model fallback
     */
    async testConnection(): Promise<{ success: boolean; model: ModelId | null }> {
        const modelsToTry = [this.model, ...AVAILABLE_MODELS.map(m => m.id).filter(m => m !== this.model)];

        for (const modelId of modelsToTry) {
            try {
                console.log(`[GeminiService] Testing connection with: ${modelId}`);
                const response = await this.ai.models.generateContent({
                    model: modelId,
                    contents: 'OK',
                });

                if (response.text) {
                    // Save working model
                    if (modelId !== this.model) {
                        console.log(`[GeminiService] Found working model: ${modelId}`);
                        this.setModel(modelId);
                    }
                    return { success: true, model: modelId };
                }
            } catch (error) {
                console.warn(`[GeminiService] Model ${modelId} test failed`);
                continue;
            }
        }

        return { success: false, model: null };
    }
}

/**
 * Helper function to create service instance
 */
export function createGeminiService(apiKey: string, model?: ModelId): GeminiService {
    // Load saved model if not provided
    if (!model) {
        GeminiService.loadSavedModel();
    }
    return new GeminiService(apiKey, model);
}
