export interface AIServices {
  audio: {
    processor: any;
    model: any;
  };
  vision: {
    model: any;
  };
  classification: {
    model: any;
  };
  image: {
    model: (prompt: string) => Promise<Uint8Array>;
    inpainting: (params: {
      image: Uint8Array;
      mask: Uint8Array;
      prompt: string;
    }) => Promise<Uint8Array>;
  };
  text: {
    processor: any;
    model: any;
  };
  sentiment: {
    processor: any;
    model: any;
  };
}

export interface AIResponse {
  description?: string;
  classification?: string[];
  sentiment?: 'negative' | 'neutral' | 'positive';
  text?: string;
  image?: Uint8Array;
}
