export const API_ENDPOINT = 'http://localhost:8000/api/generate';

import { GenerationMode } from './types';

interface GenerationConfigItem {
  label: string;
  description: string;
}

export const GENERATION_CONFIG: Record<GenerationMode, GenerationConfigItem> = {
  research: {
    label: 'Research Topics',
    description: 'Find in-depth research topics with case studies.',
  },
  business: {
    label: 'Research & Business',
    description: 'Topics with business analysis, monetization strategies, and implementation prompts.',
  },
  python: {
    label: 'Python Scripts',
    description: 'Technical Python script ideas with implementation prompts.',
  }
};
