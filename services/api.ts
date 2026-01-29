import { API_ENDPOINT } from '../constants';
import { ScriptIdea, GenerationMode } from '../types';

export const generateIdeas = async (input: string, mode: GenerationMode = 'python'): Promise<ScriptIdea[]> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input_text: input,
        mode: mode
      })
    });

    if (!response.ok) {
        throw new Error(`Backend API Error: ${response.status} ${response.statusText}`);
    }

    const ideas: ScriptIdea[] = await response.json();
    return ideas;

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};