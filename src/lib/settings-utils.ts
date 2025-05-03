import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserSettings {
  theme: "light" | "dark" | "system";
  language: "he" | "en";
  notifications: {
    email: boolean;
    push: boolean;
  };
  preferences: {
    showTutorial: boolean;
    autoSave: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: "system",
  language: "he",
  notifications: {
    email: true,
    push: true,
  },
  preferences: {
    showTutorial: true,
    autoSave: true,
  },
};

export async function getUserSettings(userId: string): Promise<UserSettings> {
  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return {
      ...DEFAULT_SETTINGS,
      ...data?.settings,
    };
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<UserSettings> {
  try {
    const currentSettings = await getUserSettings(userId);
    const newSettings = { ...currentSettings, ...settings };

    const { data, error } = await supabase
      .from("settings")
      .upsert({
        user_id: userId,
        settings: newSettings,
      })
      .select()
      .single();

    if (error) throw error;

    return data.settings;
  } catch (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
}

export function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(theme: UserSettings["theme"]) {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;
  const systemTheme = getSystemTheme();

  if (theme === "system") {
    root.classList.remove("light", "dark");
    root.classList.add(systemTheme);
  } else {
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }
} 