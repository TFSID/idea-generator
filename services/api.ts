import { API_ENDPOINT, API_KEY, GENERATION_CONFIG } from '../constants';
import { ScriptIdea, ApiPayload, ApiResponse, GenerationMode } from '../types';

export const generateIdeas = async (input: string, mode: GenerationMode = 'python'): Promise<ScriptIdea[]> => {
  const config = GENERATION_CONFIG[mode];
  const fullPrompt = config.promptTemplate(input);

  const payload: ApiPayload = {
    prompt: fullPrompt,
    model_name: "gemini-flash-latest",
    temperature: 1,
    top_p: 0.95,
    max_output_tokens: 65536,
    system_instruction: "You are a helpful AI assistant specialized in generating structured ideas. You must adhere strictly to the requested output format.",
    user_metadata: ""
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`External API Error: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    const text = data.output_text;

    if (!text) {
        throw new Error("No output text returned from the model.");
    }
    return parseResponse(text, mode);

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};

const parseResponse = (text: string, mode: GenerationMode): ScriptIdea[] => {
  const config = GENERATION_CONFIG[mode];
  const expectedFields = config.fields;

  // Split by double newlines to separate items
  const rawItems = text.split(/\n\s*\n/);
  
  const parsedItems: ScriptIdea[] = [];

  rawItems.forEach((item, index) => {
    const cleanItem = item.trim();
    if (!cleanItem) return;

    // Robust parsing: Extract content between {{ and }}
    const matches = cleanItem.match(/{{(.*?)}}/gs);
    
    // We create a partial idea object
    const idea: any = {
        id: `idea-${mode}-${index}-${Date.now()}`
    };

    if (matches && matches.length >= expectedFields.length) {
        // Map matches to fields defined in config
        expectedFields.forEach((field, i) => {
            if (matches[i]) {
                idea[field] = matches[i].replace(/{{|}}/g, '').trim();
            }
        });
    } else {
        // Fallback: Split by lines if braces aren't perfect, though less reliable
        // We really rely on the model following the prompt instructions here.
        // For now, if we don't get enough matches, we might skip or try a best guess.
        // Let's try best guess only if we have at least Title/Category/Desc (3 items)
        const lines = cleanItem.split('\n').filter(l => l.trim().length > 0);
        if (lines.length >= 3) {
             // Simplistic fallback for unknown structure failure
             idea.category = lines[0]?.replace(/{{|}}/g, '') || 'General';
             idea.title = lines[1]?.replace(/{{|}}/g, '') || 'Untitled';
             idea.description = lines[2]?.replace(/{{|}}/g, '') || '';
             // Can't reliably guess the others
        } else {
            return; // Skip malformed item
        }
    }

    // Ensure mandatory fields exist
    if (idea.title && idea.description) {
        parsedItems.push(idea as ScriptIdea);
    }
  });

  return parsedItems;
};