import { handleError } from "@/lib/error-utils";

export interface ParsedCV {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string[];
  experience?: Array<{
    company: string;
    position: string;
    duration: string;
    description?: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
}

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = 1000;

async function retry<T>(
  fn: () => Promise<T>,
  retryCount: number = DEFAULT_RETRY_COUNT,
  retryDelay: number = DEFAULT_RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retryCount === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    return retry(fn, retryCount - 1, retryDelay);
  }
}

const DEFAULT_CV_DATA: ParsedCV = {
  name: "Guest User",
  title: "Professional",
  summary: "Please edit this template with your information.",
  skills: ["Professional Skills", "Communication", "Teamwork"],
  experience: [
    {
      company: "Company Name",
      position: "Position Title",
      duration: "2020 - Present",
      description: "Description of your responsibilities and achievements."
    }
  ],
  education: [
    {
      institution: "University Name",
      degree: "Degree Title",
      year: "2015 - 2019"
    }
  ]
};

export async function extractCVData(fileUrl: string): Promise<ParsedCV> {
  try {
    const response = await retry(async () => {
      const res = await fetch("/api/extract-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to extract CV data");
      }

      return res;
    });

    const data = await response.json();
    return data.cvData;
  } catch (error) {
    handleError(error, {
      showToast: false,
      context: { 
        method: "extractCVData", 
        fileUrl,
        retryCount: DEFAULT_RETRY_COUNT
      }
    });

    return DEFAULT_CV_DATA;
  }
}

export async function extractRawText(fileUrl: string): Promise<string> {
  try {
    const response = await retry(async () => {
      const res = await fetch("/api/extract-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to extract text from CV");
      }

      return res;
    });

    const data = await response.json();
    return data.text;
  } catch (error) {
    handleError(error, {
      showToast: false,
      context: { 
        method: "extractRawText", 
        fileUrl,
        retryCount: DEFAULT_RETRY_COUNT
      }
    });
    return "Failed to extract text from the uploaded document.";
  }
} 