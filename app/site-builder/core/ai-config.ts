import { AutoProcessor, AutoModelForCausalLM, AutoTokenizer } from "@xenova/transformers"
import { AutoModelForSequenceClassification } from "@xenova/transformers"

export const AI_CONFIG = {
  audio: {
    model: "Qwen/Qwen2-Audio-7B",
    processor: "Qwen/Qwen2-Audio-7B",
    type: "audio-text"
  },
  vision: {
    model: "openbmb/MiniCPM-o-2_6",
    type: "vision-text"
  },
  image: {
    model: "stable-diffusion-v1-5/stable-diffusion-v1-5",
    inpainting: "stable-diffusion-v1-5/stable-diffusion-inpainting",
    type: "text-image"
  },
  classification: {
    model: "timm/mobilenetv3_small_100.lamb_in1k",
    type: "image-classification"
  },
  text: {
    model: "microsoft/phi-2",
    type: "causal"
  },
  sentiment: {
    model: "google-bert/bert-base-uncased",
    type: "sequence-classification"
  }
}

export async function initializeAIServices() {
  try {
    // Initialize audio model
    const audioProcessor = await AutoProcessor.from_pretrained(AI_CONFIG.audio.processor)
    const audioModel = await AutoModelForCausalLM.from_pretrained(
      AI_CONFIG.audio.model,
      { trust_remote_code: true }
    )

    // Initialize vision model
    const visionModel = await MiniCPM.from_pretrained(AI_CONFIG.vision.model)

    // Initialize image generation models
    const imageModel = await StableDiffusionPipeline.from_pretrained(AI_CONFIG.image.model)
    const inpaintingModel = await StableDiffusionPipeline.from_pretrained(AI_CONFIG.image.inpainting)

    // Initialize classification model
    const classificationModel = await MobileNetV3.from_pretrained(AI_CONFIG.classification.model)

    // Initialize Phi-2 for text generation
    const textModel = await AutoModelForCausalLM.from_pretrained(
      AI_CONFIG.text.model,
      { trust_remote_code: true }
    )
    const textProcessor = await AutoTokenizer.from_pretrained(
      AI_CONFIG.text.model,
      { trust_remote_code: true }
    )

    // Initialize BERT for sentiment analysis
    const sentimentModel = await AutoModelForSequenceClassification.from_pretrained(
      AI_CONFIG.sentiment.model,
      { trust_remote_code: true }
    )
    const sentimentProcessor = await AutoTokenizer.from_pretrained(
      AI_CONFIG.sentiment.model
    )

    return {
      audio: { processor: audioProcessor, model: audioModel },
      vision: { model: visionModel },
      image: { model: imageModel, inpainting: inpaintingModel },
      classification: { model: classificationModel },
      text: {
        model: textModel,
        processor: textProcessor
      },
      sentiment: {
        model: sentimentModel,
        processor: sentimentProcessor
      }
    }
  } catch (error) {
    console.error("Error initializing AI services:", error)
    throw error
  }
} 