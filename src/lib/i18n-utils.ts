import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Translation {
  key: string;
  he: string;
  en: string;
}

interface TranslationOptions {
  language?: "he" | "en";
  fallback?: boolean;
}

const DEFAULT_LANGUAGE = "he";
const FALLBACK_LANGUAGE = "en";

let translations: Record<string, Translation> = {};

export async function loadTranslations(): Promise<void> {
  try {
    const { data, error } = await supabase
      .from("translations")
      .select("*");

    if (error) throw error;

    translations = data.reduce((acc, translation) => {
      acc[translation.key] = translation;
      return acc;
    }, {} as Record<string, Translation>);
  } catch (error) {
    console.error("Error loading translations:", error);
    throw error;
  }
}

export function t(
  key: string,
  options: TranslationOptions = {}
): string {
  const { language = DEFAULT_LANGUAGE, fallback = true } = options;
  const translation = translations[key];

  if (!translation) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }

  if (translation[language]) {
    return translation[language];
  }

  if (fallback && translation[FALLBACK_LANGUAGE]) {
    return translation[FALLBACK_LANGUAGE];
  }

  return key;
}

export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {},
  language: string = DEFAULT_LANGUAGE
): string {
  return new Intl.DateTimeFormat(language, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(date);
}

export function formatNumber(
  number: number,
  options: Intl.NumberFormatOptions = {},
  language: string = DEFAULT_LANGUAGE
): string {
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(number);
}

export function formatCurrency(
  amount: number,
  currency: string = "ILS",
  options: Intl.NumberFormatOptions = {},
  language: string = DEFAULT_LANGUAGE
): string {
  return new Intl.NumberFormat(language, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
}

export function getDirection(language: string = DEFAULT_LANGUAGE): "rtl" | "ltr" {
  return language === "he" ? "rtl" : "ltr";
}

export function isRTL(language: string = DEFAULT_LANGUAGE): boolean {
  return getDirection(language) === "rtl";
} 