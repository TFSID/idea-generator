import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedResponse } from "../types";

const apiKey = process.env.API_KEY;

// Define the response schema to ensure structured JSON output
const topicSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "A unique identifier for the topic" },
          category: { type: Type.STRING, description: " The specific domain category (e.g., Data Analysis, Automation, Security)" },
          title: { type: Type.STRING, description: "A catchy and professional title for the python script idea" },
          description: { type: Type.STRING, description: "A detailed description for research purposes, highlighting trends and practical application." },
          refinedPrompt: { 
            type: Type.STRING, 
            description: "A highly detailed prompt text following the R.C.T.F.M framework (Role, Context, Task, Format, Meta-Cognition) that a user can copy and paste into an AI to build the script." 
          },
          tags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 2-3 key libraries or concepts (e.g., Pandas, AI, Automation)"
          },
          complexity: { 
            type: Type.STRING, 
            enum: ["Beginner", "Intermediate", "Advanced"],
            description: "Estimated difficulty level"
          }
        },
        required: ["id", "category", "title", "description", "refinedPrompt", "tags", "complexity"]
      }
    }
  },
  required: ["topics"]
};

export const generatePythonTopics = async (input: string): Promise<GeneratedResponse> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Integrating the user's specific prompt requirement into the system instructions
  const promptContext = `
    Bertindaklah sebagai Senior Python Architect dan Researcher. 
    Tugasmu adalah menghasilkan 50 ide/topik script Python berdasarkan input pengguna: "${input}".
    
    UNTUK SETIAP TOPIK, KAMU HARUS MENGIKUTI STRUKTUR INI:
    
    1. **Description**: Harus detail, berfokus pada aspek praktis, menyoroti tren terbaru, dan menjadi bahan penelitian studi kasus yang valid.
    2. **Refined Prompt (R.C.T.F.M)**: Buatlah sebuah prompt instruksi yang SANGAT DETAIL yang bisa dicopy-paste user ke AI lain (seperti Claude/Gemini) untuk membuat kode programnya. 
       Prompt ini harus mengikuti framework R.C.T.F.M:
       - **Role (Peran)**: Tentukan persona AI (misal: Expert Backend Engineer).
       - **Context (Konteks)**: Jelaskan latar belakang masalah dan kenapa script ini dibutuhkan.
       - **Task (Tugas)**: Deskripsi langkah demi langkah implementasi, fitur spesifik, dan requirements.
       - **Format (Format)**: Struktur kode yang diinginkan (Modular, OOP, Functional).
       - **Meta-Cognition (Metakognisi)**: Instruksi agar AI berpikir dinamis (misal: "Evaluasi edge cases sebelum menulis kode", "Saranan opsi skalabilitas").
    
    Bahasa:
    - Gunakan **Bahasa Indonesia** untuk Title, Category, dan Description.
    - Gunakan **Bahasa Inggris** atau **Indonesia** yang sangat teknis untuk "Refined Prompt" agar hasil code generation lebih akurat.

    Output HARUS dalam format JSON valid sesuai schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptContext,
      config: {
        responseMimeType: "application/json",
        responseSchema: topicSchema,
        temperature: 0.7, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    return JSON.parse(text) as GeneratedResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};