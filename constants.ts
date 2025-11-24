// Ensure VITE_LOCAL_API_ENDPOINT is treated relative to the app root (which might include base url)
// If VITE_LOCAL_API_ENDPOINT is just '/api', and we are on /subpath/, fetch('/api') goes to root domain /api.
// If we want it relative to current base, we should use 'api' (no slash) or handle base prepending.
// However, usually the proxy (in dev) and the server (in prod) are on the same origin root.
// The simplest robust way for a monolith: use 'api' (relative) so it appends to <base>/api, OR keep /api if the server routes strictly at root /api.
// Given the monolithic setup serving static files at *, and API at /api, /api is absolute on the domain.
// If VITE_BASE_URL is /app/, then index.html is at /app/. Fetching /api goes to domain.com/api.
// If Express serves /api, that's fine.
// If Express serves /app/api, then we need modification.
// For now, we assume the Monolith API is always at root /api.
// If VITE_LOCAL_API_ENDPOINT is configurable, the user can set it to /app/api if needed.

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://api-ai.tegarfirman.site/v1/generate';
export const API_KEY = import.meta.env.VITE_API_KEY || '';
export const LOCAL_API_ENDPOINT = import.meta.env.VITE_LOCAL_API_ENDPOINT || '/api';

import { GenerationMode } from './types';

interface GenerationConfigItem {
  label: string;
  description: string;
  promptTemplate: (input: string, count: number) => string;
  fields: (keyof import('./types').ScriptIdea)[];
}

export const GENERATION_CONFIG: Record<GenerationMode, GenerationConfigItem> = {
  research: {
    label: 'Research Topics',
    description: 'Find in-depth research topics with case studies.',
    promptTemplate: (input: string, count: number) => `Buatkan ${count} daftar topik penelitian dengan studi kasus yang relevan dengan "${input}". Fokus pada aspek praktis dan aplikatif, soroti tren terbaru, inovasi, dan studi kasus.

Tolong berikan deskripsi detail untuk setiap topik.

Berikan juga "refined prompt/instruction" untuk AI (seperti Claude/Gemini) menggunakan framework R.C.T.F.M (Role, Context, Task, Format, Meta-Cognition).

PENTING: Output HARUS berupa JSON Array yang valid. Jangan sertakan teks penjelasan di luar JSON. Jika model berpikir (thinking process), pastikan output akhirnya adalah JSON berikut:

[
  {
    "category": "Kategori Topik",
    "title": "Judul Topik",
    "description": "Deskripsi detail",
    "effortValue": "Estimasi kompleksitas penelitian (e.g. Tinggi/Sedang/Rendah)",
    "refinedPrompt": "Prompt detail R.C.T.F.M untuk penelitian mendalam..."
  },
  ...
]`,
    fields: ['category', 'title', 'description', 'effortValue', 'refinedPrompt']
  },
  business: {
    label: 'Research & Business',
    description: 'Topics with business analysis, monetization strategies, and implementation prompts.',
    promptTemplate: (input: string, count: number) => `Buatkan ${count} daftar topik bisnis dan penelitian dengan studi kasus yang relevan dengan "${input}". Fokus pada aspek praktis, tren terbaru, inovasi, dan potensi bisnis.

Berikan juga "refined prompt/instruction" untuk AI (seperti Claude/Gemini) menggunakan framework R.C.T.F.M (Role, Context, Task, Format, Meta-Cognition).

PENTING: Output HARUS berupa JSON Array yang valid. Jangan sertakan teks penjelasan di luar JSON. Jika model berpikir (thinking process), pastikan output akhirnya adalah JSON berikut:

[
  {
    "category": "Kategori",
    "title": "Judul Topik",
    "description": "Deskripsi detail",
    "moneyValue": "Potensi nilai finansial (e.g. Tinggi/Sedang/Rendah atau estimasi angka)",
    "effortValue": "Estimasi usaha (e.g. Tinggi/Sedang/Rendah)",
    "monetizationStrategies": "Strategi monetisasi yang spesifik",
    "refinedPrompt": "Prompt detail R.C.T.F.M untuk eksekusi bisnis..."
  },
  ...
]`,
    fields: ['category', 'title', 'description', 'moneyValue', 'effortValue', 'monetizationStrategies', 'refinedPrompt']
  },
  python: {
    label: 'Python Scripts',
    description: 'Technical Python script ideas with implementation prompts.',
    promptTemplate: (input: string, count: number) => `Buatkan ${count} ide skrip Python dengan studi kasus yang relevan dengan "${input}". Fokus pada aspek praktis, skalabilitas, dan implementasi teknis.

Berikan juga "refined prompt/instruction" untuk AI (seperti Claude/Gemini) menggunakan framework R.C.T.F.M (Role, Context, Task, Format, Meta-Cognition) untuk membuat kode programnya.

PENTING: Output HARUS berupa JSON Array yang valid. Jangan sertakan teks penjelasan di luar JSON. Jika model berpikir (thinking process), pastikan output akhirnya adalah JSON berikut:

[
  {
    "category": "Kategori",
    "title": "Judul Skrip",
    "description": "Deskripsi detail dan kegunaan",
    "moneyValue": "Potensi komersial/freelance (e.g. $$$ atau deskripsi singkat)",
    "effortValue": "Estimasi kompleksitas coding (e.g. Tinggi/Sedang/Rendah)",
    "refinedPrompt": "Prompt detail R.C.T.F.M untuk coding..."
  },
  ...
]`,
    fields: ['category', 'title', 'description', 'moneyValue', 'effortValue', 'refinedPrompt']
  }
};
