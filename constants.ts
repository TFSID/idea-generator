export const API_ENDPOINT = 'https://api-ai.tegarfirman.site/v1/generate';
export const API_KEY = 'sk-e0dde619-2dd3-4018-aad1-e7f602d58534';

import { GenerationMode } from './types';

interface GenerationConfigItem {
  label: string;
  description: string;
  promptTemplate: (input: string) => string;
  fields: (keyof import('./types').ScriptIdea)[];
}

export const GENERATION_CONFIG: Record<GenerationMode, GenerationConfigItem> = {
  research: {
    label: 'Research Topics',
    description: 'Find in-depth research topics with case studies.',
    promptTemplate: (input: string) => `Buatkan 50 list topik penelitian dengan studi yang relevan dengan "${input}" yang berfokus pada aspek-aspek praktis dan aplikatif dari topik tersebut, serta menyoroti tren terbaru, inovasi, dan studi kasus yang dapat memberikan wawasan mendalam bagi pembaca yang ingin memahami dan menerapkan konsep-konsep ini dalam konteks nyata.

tolong berikan deskripsi detail dari setiap topik yang telah disediakan untuk bahan penelitian lebih lanjut

PENTING: Pastikan output Anda hanya berisi daftar item dengan format berikut tanpa teks pembuka atau penutup lain, pisahkan setiap item dengan baris kosong ganda:

Format (Output):
{{Category}}
{{Topic/Title}}
{{Description}}`,
    fields: ['category', 'title', 'description']
  },
  business: {
    label: 'Research & Business',
    description: 'Topics with business analysis, monetization strategies, and implementation prompts.',
    promptTemplate: (input: string) => `Buatkan 50 list topik penelitian dengan studi yang relevan dengan "${input}" yang berfokus pada aspek-aspek praktis dan aplikatif dari topik tersebut, serta menyoroti tren terbaru, inovasi, dan studi kasus yang dapat memberikan wawasan mendalam bagi pembaca yang ingin memahami dan menerapkan konsep-konsep ini dalam konteks nyata.

tolong berikan deskripsi detail dari setiap topik yang telah disediakan untuk bahan penelitian lebih lanjut

berikan juga refined prompt/instruction (text) untuk disesuaikan berdasarkan sesuai kebutuhan proyek dan organisasi agar dapat dimengerti oleh AI Generative Model (seperti Claude, Gemini) dengan framework  R.C.T.F.M: Role (Peran) (R), Context (Konteks) (C), Task (Tugas) (T), Format (Format) (F), dan Meta-Cognition (Metakognisi/mengubah prompt dari permintaan statis menjadi proses yang dinamis dan sadar diri.) (M).

PENTING: Pastikan output Anda hanya berisi daftar item dengan format berikut tanpa teks pembuka atau penutup lain, pisahkan setiap item dengan baris kosong ganda:

Format (Output):
{{Category}}
{{Topic/Title}}
{{Description}}
{{Money Value}}
{{Effort Value}}
{{Monetization Strategies}}
{{Refined Prompt/Instruction}}`,
    fields: ['category', 'title', 'description', 'moneyValue', 'effortValue', 'monetizationStrategies', 'refinedPrompt']
  },
  python: {
    label: 'Python Scripts',
    description: 'Technical Python script ideas with implementation prompts.',
    promptTemplate: (input: string) => `Buatkan 50 list topik untuk pembuatan python script dengan studi kasus yang relevan dengan "${input}" yang berfokus pada aspek-aspek praktis dan aplikatif dari topik tersebut, serta menyoroti tren terbaru, inovasi, dan studi kasus yang dapat memberikan wawasan mendalam bagi pembaca yang ingin memahami dan menerapkan konsep-konsep ini dalam konteks nyata.

tolong berikan deskripsi detail dari setiap topik yang telah disediakan untuk bahan penelitian lebih lanjut

berikan juga refined prompt/instruction (text) untuk detail alur pengimplementasinya, fitur yang dapat ditambahkan, dan parameter serta fungsi dengan skalabilitas tinggi yang dapat disesuaikan berdasarkan sesuai kebutuhan proyek dan organisasi agar dapat dimengerti oleh AI Generative Model (seperti Claude, Gemini) untuk membuat kode programnya dengan framework  R.C.T.F.M: Role (Peran) (R), Context (Konteks) (C), Task (Tugas) (T), Format (Format) (F), dan Meta-Cognition (Metakognisi/mengubah prompt dari permintaan statis menjadi proses yang dinamis dan sadar diri.) (M).

PENTING: Pastikan output Anda hanya berisi daftar item dengan format berikut tanpa teks pembuka atau penutup lain, pisahkan setiap item dengan baris kosong ganda:

Format (Output):
{{Category}}
{{Topic/Title}}
{{Description}}
{{Refined Prompt/Instruction}}`,
    fields: ['category', 'title', 'description', 'refinedPrompt']
  }
};