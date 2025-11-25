export type GenerationMode = 'research' | 'business' | 'python';

export interface ScriptIdea {
  id: string;
  category: string;
  title: string;
  description: string;
  refinedPrompt?: string;
  moneyValue?: string;
  effortValue?: string;
  monetizationStrategies?: string;
}
// update
export interface ApiPayload {
  prompt: string;
  model_name: string;
  temperature: number;
  top_p: number;
  max_output_tokens: number;
  system_instruction: string;
  user_metadata: string;
}

export interface ApiResponse {
  model: string;
  output_text: string;
  finish_reason: string | null;
  usage: {
    input_tokens: number | null;
    output_tokens: number | null;
    total_tokens: number;
  };
  meta: {
    retries: number;
    key_rotations: number;
    backoff_applied: boolean;
  };
}