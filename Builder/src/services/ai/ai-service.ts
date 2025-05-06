import { AIResponse, AIServices } from './types';

export class AIService {
  private services: AIServices;

  constructor(services: AIServices) {
    this.services = services;
  }

  async processAudio(audioBlob: Blob): Promise<AIResponse> {
    try {
      const audioData = await audioBlob.arrayBuffer();
      const audioFeatures = await this.services.audio.processor(audioData);
      const text = await this.services.audio.model(audioFeatures);
      return { text };
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    }
  }

  async processImage(imageBlob: Blob): Promise<AIResponse> {
    try {
      const imageData = await imageBlob.arrayBuffer();
      const imageFeatures = await this.services.vision.model(imageData);
      const description = await this.services.classification.model(imageFeatures);
      return { description };
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }

  async generateImage(prompt: string): Promise<AIResponse> {
    try {
      const image = await this.services.image.model(prompt);
      return { image };
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  async inpaintImage(params: {
    image: Uint8Array;
    mask: Uint8Array;
    prompt: string;
  }): Promise<AIResponse> {
    try {
      const image = await this.services.image.inpainting(params);
      return { image };
    } catch (error) {
      console.error('Error inpainting image:', error);
      throw error;
    }
  }

  async processText(prompt: string): Promise<AIResponse> {
    try {
      const textFeatures = await this.services.text.processor(prompt);
      const text = await this.services.text.model(textFeatures);
      return { text };
    } catch (error) {
      console.error('Error processing text:', error);
      throw error;
    }
  }

  async analyzeSentiment(text: string): Promise<AIResponse> {
    try {
      const textFeatures = await this.services.sentiment.processor(text);
      const sentiment = await this.services.sentiment.model(textFeatures);
      return { sentiment };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  }
}
