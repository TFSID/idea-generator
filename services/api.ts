import { API_ENDPOINT, API_KEY, GENERATION_PROMPT_TEMPLATE } from '../constants';
import { ScriptIdea, ApiPayload, ApiResponse } from '../types';

export const generateIdeas = async (input: string): Promise<ScriptIdea[]> => {
  const fullPrompt = GENERATION_PROMPT_TEMPLATE(input);

  const payload: ApiPayload = {
    prompt: fullPrompt,
    model_name: "gemini-flash-latest",
    temperature: 1,
    top_p: 0.95,
    max_output_tokens: 65536,
    system_instruction: "You are a helpful AI assistant specialized in generating technical Python project ideas. You must adhere strictly to the requested output format.",
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
    return parseResponse(text);

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};

const parseResponse = (text: string): ScriptIdea[] => {
  // 1. Split by double newlines to separate items
  // The model might use slightly different spacing, so we regex for 2 or more newlines
  const rawItems = text.split(/\n\s*\n/);
  
  const parsedItems: ScriptIdea[] = [];

  rawItems.forEach((item, index) => {
    // Clean up the item string
    const cleanItem = item.trim();
    if (!cleanItem) return;

    // We expect 4 parts. 
    // Let's split by newline.
    const lines = cleanItem.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // Sometimes description or prompt spans multiple lines. 
    // The user format uses {{ }} wrappers strictly? 
    // Let's assume the format is adhered to:
    // {{Category}}
    // {{Title}}
    // {{Desc}}
    // {{Prompt}}
    
    // Robust parsing: Extract content between {{ and }}
    // Or just take lines if braces aren't there (fallback)
    
    let category = '';
    let title = '';
    let description = '';
    let refinedPrompt = '';

    // Regex approach is safer given multiline possibilities in description/prompt
    // But typically the simple format requests put them in blocks.
    
    // Let's try to identify blocks by the {{ }} markers if present
    const matches = cleanItem.match(/{{(.*?)}}/gs);
    
    if (matches && matches.length >= 4) {
        // Remove the braces and trim
        category = matches[0].replace(/{{|}}/g, '').trim();
        title = matches[1].replace(/{{|}}/g, '').trim();
        description = matches[2].replace(/{{|}}/g, '').trim();
        // Refined prompt is the rest, potentially.
        // The 4th match is likely the prompt.
        refinedPrompt = matches[3].replace(/{{|}}/g, '').trim();
    } else {
        // Fallback: Line based.
        // Assuming the first line is category, second is title.
        // It's risky to assume line counts for desc/prompt without markers.
        // Given the strict prompt, we hope for markers.
        if (lines.length >= 4) {
             category = lines[0].replace(/^{{|}}$/g, '');
             title = lines[1].replace(/^{{|}}$/g, '');
             description = lines[2].replace(/^{{|}}$/g, '');
             refinedPrompt = lines.slice(3).join('\n').replace(/^{{|}}$/g, '');
        }
    }

    if (title && description) {
        parsedItems.push({
            id: `idea-${index}-${Date.now()}`,
            category,
            title,
            description,
            refinedPrompt
        });
    }
  });

  return parsedItems;
};