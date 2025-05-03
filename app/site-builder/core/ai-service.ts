import { AI_CONFIG, initializeAIServices } from "./ai-config"

let aiServices: Awaited<ReturnType<typeof initializeAIServices>> | null = null

export async function getAIServices() {
  if (!aiServices) {
    aiServices = await initializeAIServices()
  }
  return aiServices
}

export async function processAudio(audioBlob: Blob) {
  const services = await getAIServices()
  const arrayBuffer = await audioBlob.arrayBuffer()
  const audioData = new Uint8Array(arrayBuffer)

  const inputs = await services.audio.processor({
    text: "What does this audio say?",
    audios: [audioData],
    return_tensors: "pt",
    padding: true
  })

  const generateIds = await services.audio.model.generate(
    inputs.input_ids.to("cuda"),
    { max_length: 256 }
  )

  const response = await services.audio.processor.batch_decode(
    generateIds,
    { skip_special_tokens: true, clean_up_tokenization_spaces: false }
  )

  return response[0]
}

export async function processImage(imageBlob: Blob) {
  const services = await getAIServices()
  const arrayBuffer = await imageBlob.arrayBuffer()
  const imageData = new Uint8Array(arrayBuffer)

  // Process with vision model
  const visionResponse = await services.vision.model.chat({
    msgs: [{ role: "user", content: [imageData, "Describe this image"] }]
  })

  // Classify with MobileNet
  const classification = await services.classification.model.classify(imageData)

  return {
    description: visionResponse,
    classification: classification
  }
}

export async function generateImage(prompt: string) {
  const services = await getAIServices()
  const image = await services.image.model(prompt)
  return image
}

export async function inpaintImage(imageBlob: Blob, maskBlob: Blob, prompt: string) {
  const services = await getAIServices()
  const imageArrayBuffer = await imageBlob.arrayBuffer()
  const maskArrayBuffer = await maskBlob.arrayBuffer()
  
  const image = new Uint8Array(imageArrayBuffer)
  const mask = new Uint8Array(maskArrayBuffer)

  const result = await services.image.inpainting({
    image,
    mask,
    prompt
  })

  return result
}

export async function processText(prompt: string) {
  const services = await getAIServices()
  const inputs = await services.text.processor({
    text: `Instruct: ${prompt}\nOutput:`,
    return_tensors: "pt",
    padding: true
  })

  const generateIds = await services.text.model.generate(
    inputs.input_ids.to("cuda"),
    { max_length: 256 }
  )

  const response = await services.text.processor.batch_decode(
    generateIds,
    { skip_special_tokens: true, clean_up_tokenization_spaces: false }
  )

  return response[0]
}

export async function analyzeSentiment(text: string) {
  const services = await getAIServices()
  const inputs = await services.sentiment.processor(text, {
    return_tensors: "pt",
    padding: true,
    truncation: true
  })

  const outputs = await services.sentiment.model(**inputs)
  const logits = outputs.logits
  const predictedClass = logits.argmax(-1).item()
  const sentimentLabels = ["negative", "neutral", "positive"]
  
  return sentimentLabels[predictedClass]
} 