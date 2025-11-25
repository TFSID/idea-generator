import { API_ENDPOINT, API_KEY, LOCAL_API_ENDPOINT, GENERATION_CONFIG } from '../constants';
import { ScriptIdea, ApiPayload, ApiResponse, GenerationMode } from '../types';
// update
export const generateIdeas = async (input: string, mode: GenerationMode = 'python', count: number = 10): Promise<ScriptIdea[]> => {
  const config = GENERATION_CONFIG[mode];
  const fullPrompt = config.promptTemplate(input, count);

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

    // Parse the generated ideas
    const ideas = parseResponse(text, mode);

    // Save ideas to local backend
    if (ideas.length > 0) {
        try {
            await saveIdeasToLocal(ideas);
        } catch (saveError) {
            console.error("Failed to save ideas to local database:", saveError);
            // We don't throw here, as we still want to show the results to the user
        }
    }

    return ideas;

  } catch (error) {
    console.error("Generation failed:", error);
    throw error;
  }
};

const saveIdeasToLocal = async (ideas: ScriptIdea[]) => {
    try {
        const response = await fetch(`${LOCAL_API_ENDPOINT}/validate-and-save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ideas })
        });

        if (!response.ok) {
            console.error('Error saving to local DB:', response.statusText);
        } else {
            const result = await response.json();
            console.log('Saved to local DB:', result);
        }
    } catch (err) {
        console.error('Error contacting local DB:', err);
    }
};

const parseResponse = (text: string, mode: GenerationMode): ScriptIdea[] => {
  const parsedItems: ScriptIdea[] = [];

  try {
      // Find JSON Array in the text (to ignore "Thinking" blocks or other text)
      // We look for [ ... ] structure.
      const jsonStart = text.indexOf('[');
      const jsonEnd = text.lastIndexOf(']');

      let cleanText = text;

      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanText = text.substring(jsonStart, jsonEnd + 1);
      }

      const jsonItems = JSON.parse(cleanText);

      if (Array.isArray(jsonItems)) {
          jsonItems.forEach((item, index) => {
              const idea: ScriptIdea = {
                  id: `idea-${mode}-${Date.now()}-${index}`,
                  category: item.category || 'General',
                  title: item.title || 'Untitled',
                  description: item.description || '',
                  moneyValue: item.moneyValue,
                  effortValue: item.effortValue,
                  monetizationStrategies: item.monetizationStrategies,
                  refinedPrompt: item.refinedPrompt
              };

              if (idea.title && idea.description) {
                  parsedItems.push(idea);
              }
          });
      }
  } catch (e) {
      console.warn("JSON parsing failed, falling back to legacy parsing.", e);
      // Fallback to legacy parsing if JSON fails (e.g. model ignored instructions)
      return parseLegacyResponse(text, mode);
  }

  return parsedItems;
};

const parseLegacyResponse = (text: string, mode: GenerationMode): ScriptIdea[] => {
  const config = GENERATION_CONFIG[mode];
  const expectedFields = config.fields;
  const rawItems = text.split(/\n\s*\n/);
  const parsedItems: ScriptIdea[] = [];

  rawItems.forEach((item, index) => {
    // Clean up the item string
    const cleanItem = item.trim();
    if (!cleanItem) return;
    const matches = cleanItem.match(/{{(.*?)}}/gs);
    const idea: any = {
        id: `idea-${mode}-${index}-${Date.now()}`
    };

    if (matches && matches.length >= expectedFields.length) {
        expectedFields.forEach((field, i) => {
            if (matches[i]) {
                idea[field] = matches[i].replace(/{{|}}/g, '').trim();
            }
        });
    } else {
        const lines = cleanItem.split('\n').filter(l => l.trim().length > 0);
        if (lines.length >= 3) {
             idea.category = lines[0]?.replace(/{{|}}/g, '') || 'General';
             idea.title = lines[1]?.replace(/{{|}}/g, '') || 'Untitled';
             idea.description = lines[2]?.replace(/{{|}}/g, '') || '';
        } else {
            return;
        }
    }

    if (idea.title && idea.description) {
        parsedItems.push(idea as ScriptIdea);
    }
  });

  return parsedItems;
};
