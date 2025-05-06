export const AI_CONFIG = {
  audio: {
    processor: {
      model: 'whisper-1',
      language: 'en',
    },
    model: {
      model: 'gpt-4',
      temperature: 0.7,
    },
  },
  vision: {
    model: {
      model: 'gpt-4-vision-preview',
      max_tokens: 300,
    },
  },
  classification: {
    model: {
      model: 'gpt-4',
      temperature: 0.3,
    },
  },
  image: {
    model: {
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
      style: 'natural',
    },
    inpainting: {
      model: 'dall-e-2',
      size: '1024x1024',
    },
  },
  text: {
    processor: {
      model: 'gpt-4',
      temperature: 0.7,
    },
    model: {
      model: 'gpt-4',
      temperature: 0.7,
    },
  },
  sentiment: {
    processor: {
      model: 'gpt-4',
      temperature: 0.3,
    },
    model: {
      model: 'gpt-4',
      temperature: 0.3,
    },
  },
} as const;

export const API_ENDPOINTS = {
  audio: '/api/ai/audio',
  vision: '/api/ai/vision',
  classification: '/api/ai/classification',
  image: '/api/ai/image',
  text: '/api/ai/text',
  sentiment: '/api/ai/sentiment',
} as const;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
} as const;
