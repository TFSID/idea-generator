export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'https://api-ai.tegarfirman.site/v1/generate';
export const API_KEY = import.meta.env.VITE_API_KEY || '';
export const LOCAL_API_ENDPOINT = import.meta.env.VITE_LOCAL_API_ENDPOINT || 'http://localhost:3001/api';

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

PENTING: Output HARUS dalam format JSON Array murni tanpa teks lain (seperti Markdown, code block, atau pembuka/penutup). Gunakan format ini untuk setiap item:

[
  {
    "category": "Kategori Topik",
    "title": "Judul Topik",
    "description": "Deskripsi detail"
  },
  ...
]`,
    fields: ['category', 'title', 'description']
  },
  business: {
    label: 'Research & Business',
    description: 'Topics with business analysis, monetization strategies, and implementation prompts.',
    promptTemplate: (input: string, count: number) => `Buatkan ${count} daftar topik bisnis dan penelitian dengan studi kasus yang relevan dengan "${input}". Fokus pada aspek praktis, tren terbaru, inovasi, dan potensi bisnis.

Berikan juga "refined prompt/instruction" untuk AI (seperti Claude/Gemini) menggunakan framework R.C.T.F.M (Role, Context, Task, Format, Meta-Cognition).

PENTING: Output HARUS dalam format JSON Array murni tanpa teks lain (seperti Markdown, code block, atau pembuka/penutup). Gunakan format ini untuk setiap item:

[
  {
    "category": "Kategori",
    "title": "Judul Topik",
    "description": "Deskripsi detail",
    "moneyValue": "Potensi nilai finansial",
    "effortValue": "Estimasi usaha",
    "monetizationStrategies": "Strategi monetisasi",
    "refinedPrompt": "Prompt detail R.C.T.F.M..."
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

PENTING: Output HARUS dalam format JSON Array murni tanpa teks lain (seperti Markdown, code block, atau pembuka/penutup). Gunakan format ini untuk setiap item:

[
  {
    "category": "Kategori",
    "title": "Judul Skrip",
    "description": "Deskripsi detail dan kegunaan",
    "refinedPrompt": "Prompt detail R.C.T.F.M untuk coding..."
  },
  ...
]`,
    fields: ['category', 'title', 'description', 'refinedPrompt']
  }
};