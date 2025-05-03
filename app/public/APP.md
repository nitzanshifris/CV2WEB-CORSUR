אני מבין שאתה רוצה לקבל קוד משודרג שמתמודד עם הבעיות שזיהיתי. יחד עם זאת, שליחת כל הקוד של הפרויקט שלך בהודעה אחת אינה אפשרית עקב מגבלות גודל.

אציע גישה מודולרית יותר, שבה אציג שיפורים לחלקים המרכזיים ביותר שישפיעו על המערכת כולה. נתחיל בשיפורים העיקריים שיסייעו לייצב את ה-MVP:

## 1. איחוד שירותי ה-Template

אחד הבעיות שזיהיתי היא כפילות בשירותי ה-Template. הנה הקוד המאוחד:

```typescript
// file: src/services/template-service.ts

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Template, Block, Section } from "@/lib/template-engine";
import type { Database } from "@/types/database.types";
import sampleTemplates from "@/lib/sample-templates";

export type CustomizationOptions = {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  headingFont?: string;
  bodyFont?: string;
  layout?: string;
  spacing?: number;
  borderRadius?: number;
  showSocialIcons?: boolean;
  showContactForm?: boolean;
  showSkillBars?: boolean;
  heroStyle?: string;
  imageFilter?: string;
};

export interface ProfileData {
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
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
  };
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
    [key: string]: string | undefined;
  };
}

class TemplateService {
  private supabase = createClientComponentClient<Database>();

  /**
   * Get all available templates
   */
  async getAllTemplates(): Promise<{ id: string; name: string; description?: string }[]> {
    try {
      // First check if we have templates in the database
      const { data, error } = await this.supabase.from("templates").select("id, name, description");
      
      if (error) {
        console.warn("Error fetching templates from DB:", error);
        // Fall back to predefined templates
        return Object.entries(sampleTemplates).map(([id, template]) => ({
          id,
          name: template.name,
          description: template.description
        }));
      }
      
      if (data && data.length > 0) {
        return data;
      }
      
      // Fall back to predefined templates if no DB templates
      return Object.entries(sampleTemplates).map(([id, template]) => ({
        id,
        name: template.name,
        description: template.description
      }));
    } catch (error) {
      console.error("Error in getAllTemplates:", error);
      // Fallback to sample templates in case of error
      return Object.entries(sampleTemplates).map(([id, template]) => ({
        id,
        name: template.name,
        description: template.description
      }));
    }
  }

  /**
   * Get a template by ID
   */
  async getTemplateById(templateId: string): Promise<Template | null> {
    try {
      // First check if the templateId exists in our predefined templates
      if (templateId in sampleTemplates) {
        return sampleTemplates[templateId as keyof typeof sampleTemplates];
      }

      // If not found in predefined templates, check the database
      const { data, error } = await this.supabase
        .from("templates")
        .select("*")
        .eq("id", templateId)
        .single();

      if (error) {
        console.error(`Error fetching template with id ${templateId}:`, error);
        return null;
      }

      return data as unknown as Template;
    } catch (error) {
      console.error(`Error in getTemplateById for ${templateId}:`, error);
      return null;
    }
  }

  /**
   * Apply CV data to a template
   */
  applyDataToTemplate(template: Template, cvData: ProfileData): Template {
    // Deep clone the template to avoid modifying the original
    const newTemplate = JSON.parse(JSON.stringify(template)) as Template;

    // Process each section and block to replace placeholders with actual data
    newTemplate.sections = newTemplate.sections.map((section) => {
      section.blocks = section.blocks.map((block) => {
        return this.processBlock(block, cvData);
      });
      return section;
    });

    return newTemplate;
  }

  /**
   * Process a block to replace placeholders with actual data
   */
  private processBlock(block: Block, cvData: ProfileData): Block {
    switch (block.type) {
      case "hero":
        if (typeof block.heading === "string" && block.heading.includes("{{name}}")) {
          block.heading = block.heading.replace("{{name}}", cvData.name || "Your Name");
        }
        if (block.subheading && typeof block.subheading === "string" && block.subheading.includes("{{title}}")) {
          block.subheading = block.subheading.replace("{{title}}", cvData.title || "Your Title");
        }
        break;
      case "text":
        if (block.content && typeof block.content === "string") {
          if (block.content === "{{about}}" || block.content === "{{summary}}") {
            block.content = cvData.summary || "Your professional summary will appear here.";
          }
        }
        break;
      case "skills":
        if (block.items === "{{skills}}") {
          block.items =
            cvData.skills?.map((skill: string) => ({
              label: skill,
              value: 85, // Default value
            })) || [];
        }
        break;
      case "timeline":
        if (block.entries === "{{experience}}") {
          block.entries =
            cvData.experience?.map((exp) => ({
              title: exp.position || "Position",
              organization: exp.company || "Company",
              period: exp.duration || "Period",
              description: exp.description || "",
            })) || [];
        }
        break;
      case "contact":
        if (block.email === "{{email}}") {
          block.email = cvData.email || cvData.contact?.email || "";
        }
        if (block.phone === "{{phone}}") {
          block.phone = cvData.phone || cvData.contact?.phone || "";
        }
        break;
    }
    return block;
  }

  /**
   * Apply customization options to a template
   */
  applyCustomization(template: Template, options: CustomizationOptions): Template {
    // Deep clone the template to avoid modifying the original
    const newTemplate = JSON.parse(JSON.stringify(template)) as Template;

    // Apply styles to template
    newTemplate.styles = {
      ...newTemplate.styles,
      primaryColor: options.primaryColor,
      secondaryColor: options.secondaryColor,
      backgroundColor: options.backgroundColor,
      textColor: options.textColor,
      headingFont: options.headingFont,
      bodyFont: options.bodyFont,
      borderRadius: options.borderRadius ? `${options.borderRadius}px` : undefined,
      spacing: options.spacing,
    };

    // Apply layout changes if specified
    if (options.layout && options.layout !== "standard") {
      // Adjust section layout based on selected layout
      newTemplate.sections = newTemplate.sections.map((section) => {
        switch (options.layout) {
          case "compact":
            return { ...section, compact: true, className: "py-3" };
          case "spacious":
            return { ...section, compact: false, className: "py-8" };
          case "minimal":
            return {
              ...section,
              compact: true,
              className: "py-4 border-none",
              blocks: section.blocks.map((block) => ({ ...block, minimal: true })),
            };
          case "creative":
            return {
              ...section,
              className: "py-6 relative creative-section",
              blocks: section.blocks.map((block) => ({ ...block, creative: true })),
            };
          default:
            return section;
        }
      });
    }

    // Toggle visibility of certain blocks based on customization
    if (
      options.showSocialIcons !== undefined ||
      options.showContactForm !== undefined ||
      options.showSkillBars !== undefined
    ) {
      newTemplate.sections = newTemplate.sections.map((section) => {
        return {
          ...section,
          blocks: section.blocks.filter((block) => {
            if (block.type === "social" && options.showSocialIcons === false) return false;
            if (block.type === "contact" && options.showContactForm === false) return false;
            if (block.type === "skills" && options.showSkillBars === false) return false;
            return true;
          }),
        };
      });
    }

    // Apply hero style changes
    if (options.heroStyle) {
      const heroSection = newTemplate.sections.find((section) => 
        section.blocks.some((block) => block.type === "hero")
      );

      if (heroSection) {
        heroSection.blocks = heroSection.blocks.map((block) => {
          if (block.type === "hero") {
            return {
              ...block,
              style: options.heroStyle,
              imageFilter: options.imageFilter,
            };
          }
          return block;
        });
      }
    }

    return newTemplate;
  }

  /**
   * Save a template for a site
   */
  async saveTemplate(siteId: string, template: Template): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("sites")
        .update({
          template_data: template,
          template_id: template.id,
        })
        .eq("id", siteId);

      if (error) {
        console.error("Error saving template:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in saveTemplate:", error);
      return false;
    }
  }

  /**
   * Save customization options for a site
   */
  async saveCustomization(siteId: string, options: CustomizationOptions): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("sites")
        .update({
          custom_styles: options,
        })
        .eq("id", siteId);

      if (error) {
        console.error("Error saving customization:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in saveCustomization:", error);
      return false;
    }
  }

  /**
   * Get customization options for a site
   */
  async getCustomization(siteId: string): Promise<CustomizationOptions | null> {
    try {
      const { data, error } = await this.supabase
        .from("sites")
        .select("custom_styles")
        .eq("id", siteId)
        .single();

      if (error || !data) {
        console.error("Error fetching customization:", error);
        return null;
      }

      return data.custom_styles as CustomizationOptions;
    } catch (error) {
      console.error("Error in getCustomization:", error);
      return null;
    }
  }
}

// Export singleton instance
const templateService = new TemplateService();
export default templateService;
```

## 2. שיפור שירות ניהול השגיאות

הנה שיפור עבור שירות ניהול השגיאות:

```typescript
// file: src/lib/error-utils.ts

import * as Sentry from "@sentry/nextjs";
import { toast } from "@/components/ui/use-toast";

interface ErrorWithMessage {
  message: string;
  code?: string;
  status?: number;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // אם לא ניתן להמיר ל-JSON, החזר שגיאה כללית
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

export interface ErrorHandlingOptions {
  showToast?: boolean;
  sendToSentry?: boolean;
  context?: Record<string, any>;
  logToConsole?: boolean;
}

const defaultOptions: ErrorHandlingOptions = {
  showToast: true,
  sendToSentry: true,
  logToConsole: process.env.NODE_ENV === "development",
};

/**
 * מטפל בשגיאות באופן מרוכז
 * 
 * @param error השגיאה שנזרקה
 * @param options אפשרויות טיפול בשגיאה
 * @returns הודעת השגיאה
 */
export function handleError(error: unknown, options?: Partial<ErrorHandlingOptions>): string {
  const opts = { ...defaultOptions, ...options };
  const errorObj = toErrorWithMessage(error);
  const errorMessage = errorObj.message;

  // רישום לקונסול
  if (opts.logToConsole) {
    console.error("Error:", errorMessage, opts.context);
  }

  // שליחה לסנטרי
  if (opts.sendToSentry && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(errorObj, { 
      extra: opts.context,
      tags: {
        code: errorObj.code,
        status: errorObj.status?.toString()
      }
    });
  }

  // הצגת הודעה למשתמש
  if (opts.showToast) {
    toast({
      title: "שגיאה",
      description: errorMessage,
      variant: "destructive",
    });
  }

  return errorMessage;
}

/**
 * מטפל בשגיאות ללא הצגת הודעה למשתמש
 */
export function handleErrorSilently(error: unknown, context?: Record<string, any>): string {
  return handleError(error, { showToast: false, context });
}

/**
 * בודק אם השגיאה היא שגיאת אימות
 */
export function isAuthError(error: unknown): boolean {
  const errorObj = toErrorWithMessage(error);
  return errorObj.code === "auth/unauthorized" || errorObj.status === 401;
}

/**
 * בודק אם השגיאה היא שגיאת הרשאות
 */
export function isPermissionError(error: unknown): boolean {
  const errorObj = toErrorWithMessage(error);
  return errorObj.code === "auth/permission-denied" || errorObj.status === 403;
}

/**
 * בודק אם השגיאה היא שגיאת חיבור לשרת
 */
export function isNetworkError(error: unknown): boolean {
  const errorMessage = getErrorMessage(error).toLowerCase();
  return (
    errorMessage.includes("network") ||
    errorMessage.includes("connection") ||
    errorMessage.includes("offline")
  );
}
```

## 3. שיפור שירות ה-Database

```typescript
// file: src/services/database-service.ts

import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

export class DatabaseService {
  // Client-side Supabase client
  static getClient() {
    try {
      return createClientComponentClient<Database>();
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        logToConsole: true, 
        context: { method: "getClient" }
      });
      throw error;
    }
  }

  // Server-side Supabase client
  static getServerClient() {
    try {
      return createServerComponentClient<Database>({ cookies });
    } catch (error) {
      console.error("Error creating server client:", error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(userId: string) {
    try {
      const supabase = this.getServerClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        context: { method: "getUserProfile", userId }
      });
      return null;
    }
  }

  // Get user site
  static async getUserSite(userId: string) {
    try {
      const supabase = this.getServerClient();
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        // Check if this is a "no rows returned" error, which is expected
        // when the user doesn't have a site yet
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        context: { method: "getUserSite", userId }
      });
      return null;
    }
  }

  // Get user revisions
  static async getUserRevisions(userId: string) {
    try {
      const supabase = this.getServerClient();
      const { data, error } = await supabase
        .from("revisions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        context: { method: "getUserRevisions", userId }
      });
      return [];
    }
  }

  // Create a revision request
  static async createRevisionRequest(userId: string, siteId: string, description: string) {
    const supabase = this.getClient();
    try {
      // First, check if the user has revisions left
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("revisions_left")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error("Failed to check available revisions");
      }

      if (profile.revisions_left <= 0) {
        return { success: false, message: "No revisions left" };
      }

      // Create the revision request
      const { data, error } = await supabase
        .from("revisions")
        .insert({
          user_id: userId,
          site_id: siteId,
          description,
          status: "pending",
        })
        .select();

      if (error) throw error;

      // Decrement the revisions left
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ revisions_left: profile.revisions_left - 1 })
        .eq("id", userId);

      if (updateError) {
        // Log the error but don't fail the operation
        console.error("Error updating revisions left:", updateError);
      }

      return { success: true, data: data[0] };
    } catch (error) {
      handleError(error, { 
        context: { method: "createRevisionRequest", userId, siteId }
      });
      return { success: false, message: "Failed to create revision request" };
    }
  }

  // Get site analytics
  static async getSiteAnalytics(siteId: string, days = 7) {
    try {
      const supabase = this.getServerClient();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from("analytics")
        .select("*")
        .eq("site_id", siteId)
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        context: { method: "getSiteAnalytics", siteId, days }
      });
      return [];
    }
  }

  // Get user notifications
  static async getUserNotifications(userId: string, unreadOnly = false) {
    try {
      const supabase = this.getServerClient();
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (unreadOnly) {
        query = query.eq("read", false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        context: { method: "getUserNotifications", userId }
      });
      return [];
    }
  }

  // Mark notification as read
  static async markNotificationAsRead(notificationId: string) {
    try {
      const supabase = this.getClient();
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      handleError(error, { 
        context: { method: "markNotificationAsRead", notificationId }
      });
      return false;
    }
  }

  // Update user settings
  static async updateUserSettings(
    userId: string,
    settings: Partial<Database["public"]["Tables"]["settings"]["Update"]>
  ) {
    try {
      const supabase = this.getClient();

      // Check if settings exist for this user
      const { data: existingSettings, error: checkError } = await supabase
        .from("settings")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (checkError) {
        throw new Error("Failed to check user settings");
      }

      // If settings exist, update them; otherwise, insert new settings
      if (existingSettings) {
        const { error } = await supabase
          .from("settings")
          .update(settings)
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("settings")
          .insert({
            user_id: userId,
            ...settings,
          });

        if (error) throw error;
      }

      return { success: true };
    } catch (error) {
      handleError(error, { 
        context: { method: "updateUserSettings", userId }
      });
      return { success: false, message: "Failed to update settings" };
    }
  }
}

export default DatabaseService;
```

## 4. שיפור AuthContext

```typescript
// file: src/contexts/auth-context.tsx

"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/error-utils";
import { toast } from "@/components/ui/use-toast";
import type { Session, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: any; data?: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
  updateProfile: (data: Partial<Database["public"]["Tables"]["profiles"]["Update"]>) => Promise<{ success: boolean; error?: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setSession(session);
        setUser(session?.user ?? null);
        
        // Create profile if it doesn't exist and user is authenticated
        if (session?.user) {
          await ensureUserProfile(session.user);
        }
      } catch (error) {
        handleError(error, { 
          showToast: false, 
          context: { method: "getSession" }
        });
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Create or update profile when auth state changes and user is authenticated
      if (session?.user) {
        await ensureUserProfile(session.user);
      }
      
      // Refresh the page to ensure server-side state is updated
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const ensureUserProfile = async (user: User) => {
    try {
      // Check if profile exists
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      // If profile doesn't exist, create it
      if (error && error.code === "PGRST116") {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email || "",
          revisions_left: 2, // Default number of free revisions
          status: "active",
          payment_status: "unpaid",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          console.error("Error creating profile:", insertError);
        }
      } else if (error) {
        console.error("Error checking profile:", error);
      }
    } catch (error) {
      console.error("Error in ensureUserProfile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "התחברת בהצלחה",
        description: "ברוך הבא לחשבון שלך",
      });

      return { success: true, data };
    } catch (error) {
      handleError(error, { context: { method: "signIn" } });
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "נרשמת בהצלחה",
        description: "נשלחה אליך הודעת אימות למייל",
      });

      return { success: true, data };
    } catch (error) {
      handleError(error, { context: { method: "signUp" } });
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/login");
      
      toast({
        title: "התנתקת בהצלחה",
        description: "להתראות!",
      });
    } catch (error) {
      handleError(error, { context: { method: "signOut" } });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "נשלחה בקשה לאיפוס סיסמה",
        description: "בדוק את המייל שלך להנחיות נוספות",
      });

      return { success: true };
    } catch (error) {
      handleError(error, { context: { method: "resetPassword" } });
      return { success: false, error };
    }
  };

  const updateProfile = async (data: Partial<Database["public"]["Tables"]["profiles"]["Update"]>) => {
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "הפרופיל עודכן",
        description: "השינויים נשמרו בהצלחה",
      });

      return { success: true };
    } catch (error) {
      handleError(error, { context: { method: "updateProfile" } });
      return { success: false, error };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
```

## 5. שיפור מנגנון הגנת דפים

```typescript
// file: src/middleware.ts

import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { createIntlMiddleware } from "next-intl/server";

export const locales = ["en", "he", "fr", "es"];
const defaultLocale = "en";

// Create middleware for i18n
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
});

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if Supabase environment variables are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are missing. Authentication will not work.");

    // If accessing protected routes without Supabase config, redirect to an error page
    const authRequiredPaths = ["/dashboard", "/checkout", "/preview", "/customize"];
    if (authRequiredPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/config-error", req.url));
    }

    return res;
  }

  // Create Supabase client
  const supabase = createMiddlewareClient({ req, res });

  // Check session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Routes that require authentication
  const authRequiredPaths = ["/dashboard", "/checkout", "/preview", "/customize"];
  
  // Routes that should redirect to dashboard if logged in
  const guestOnlyPaths = ["/login", "/signup", "/reset-password"];
  
  // The current path
  const pathname = req.nextUrl.pathname;

  // Check if the path requires authentication
  const requiresAuth = authRequiredPaths.some((path) => pathname.startsWith(path));
  
  // Special case for preview with token
  const hasPreviewToken = pathname.startsWith("/preview") && req.nextUrl.searchParams.has("token");
  
  // Allow access to preview when token is present, regardless of auth status
  if (requiresAuth && hasPreviewToken) {
    return res;
  }

  // If the path requires authentication and the user is not logged in, redirect to the login page
  if (requiresAuth && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname + req.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is logged in and trying to access a guest-only page, redirect to the dashboard
  if (session && guestOnlyPaths.some(path => pathname === path)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Handle internationalization
  if (pathname.startsWith("/[locale]")) {
    return intlMiddleware(req);
  }

  return res;
}

export const config = {
  matcher: [
    // Pages that require authentication
    "/dashboard/:path*",
    "/checkout/:path*",
    "/preview/:path*",
    "/customize/:path*",
    // Authentication pages
    "/login",
    "/signup",
    "/reset-password",
    // Pages with internationalization support
    "/[locale]/:path*",
  ],
};
```

המשך שיפורים לפרויקט CV-to-Website Generator:

## 6. שיפור ומיטוב הניהול של קומפוננטות התבנית

```typescript
// file: src/lib/template-engine.tsx

import React from "react";
import { ContactBlockComponent } from "@/components/blocks/ContactBlock";
import { GalleryBlockComponent } from "@/components/blocks/GalleryBlock";
import { SkillsBlockComponent } from "@/components/blocks/SkillsBlock";
import { TimelineBlockComponent } from "@/components/blocks/TimelineBlock";
import { HeroBlockComponent } from "@/components/blocks/HeroBlock";
import { TextBlockComponent } from "@/components/blocks/TextBlock";

export interface Block {
  id: string;
  type: string;
  heading?: string;
  subheading?: string;
  content?: string;
  items?: any[];
  entries?: any[];
  email?: string;
  phone?: string;
  style?: string;
  imageFilter?: string;
  minimal?: boolean;
  creative?: boolean;
  [key: string]: any;
}

export interface Section {
  id: string;
  title?: string;
  blocks: Block[];
  compact?: boolean;
  className?: string;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  author?: string;
  version?: string;
  sections: Section[];
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
    headingFont?: string;
    bodyFont?: string;
    fontFamily?: string;
    borderRadius?: string;
    spacing?: number;
    [key: string]: string | number | undefined;
  };
  [key: string]: any;
}

export interface ContactBlock extends Block {
  email?: string;
  phone?: string;
  showForm?: boolean;
  socialLinks?: Array<{ platform: string; url: string }>;
}

export interface GalleryBlock extends Block {
  items: Array<{ image?: string; caption?: string; link?: string }>;
}

export interface HeroBlock extends Block {
  heading: string;
  subheading?: string;
  background?: string;
}

export interface SkillsBlock extends Block {
  layout?: "bar" | "grid" | "list";
  items: Array<{ label: string; value: number }>;
}

export interface TextBlock extends Block {
  heading?: string;
  content: string;
}

export interface TimelineBlock extends Block {
  entries: Array<{
    title: string;
    organization: string;
    period: string;
    description?: string;
  }>;
}

export const TemplateRenderer: React.FC<{ template: Template }> = ({ template }) => {
  // Apply theme styles to container
  const themeStyles: React.CSSProperties = {
    backgroundColor: template.styles?.backgroundColor || "#ffffff",
    color: template.styles?.textColor || "#333333",
    fontFamily: template.styles?.fontFamily || template.styles?.bodyFont || "inherit",
    "--primary-color": template.styles?.primaryColor || "#FF6E35",
    "--secondary-color": template.styles?.secondaryColor || "#99B3B6",
    "--heading-font": template.styles?.headingFont || "inherit",
    "--body-font": template.styles?.bodyFont || "inherit",
  } as React.CSSProperties;

  const renderBlock = (block: Block, key: string | number) => {
    switch (block.type) {
      case "hero":
        return <HeroBlockComponent key={key} block={block as HeroBlock} theme={template.styles} />;
      case "text":
        return <TextBlockComponent key={key} block={block as TextBlock} theme={template.styles} />;
      case "skills":
        return <SkillsBlockComponent key={key} block={block as SkillsBlock} theme={template.styles} />;
      case "timeline":
        return <TimelineBlockComponent key={key} block={block as TimelineBlock} theme={template.styles} />;
      case "gallery":
        return <GalleryBlockComponent key={key} block={block as GalleryBlock} theme={template.styles} />;
      case "contact":
        return <ContactBlockComponent key={key} block={block as ContactBlock} theme={template.styles} />;
      default:
        return (
          <div key={key} className="py-4">
            <p className="text-sm text-gray-400">
              Block type "{block.type}" not implemented
            </p>
          </div>
        );
    }
  };

  const renderSection = (section: Section, key: string | number) => {
    const sectionClassName = section.className || "py-6";
    const isCompact = section.compact || false;

    return (
      <section key={key} id={section.id} className={`template-section ${sectionClassName}`}>
        {section.title && !isCompact && (
          <h2 className="section-title text-2xl font-semibold mb-4">{section.title}</h2>
        )}
        <div className={`section-blocks ${isCompact ? "space-y-2" : "space-y-4"}`}>
          {section.blocks.map((block, index) => renderBlock(block, `${section.id}-block-${index}`))}
        </div>
      </section>
    );
  };

  return (
    <div 
      className="template-container px-4 py-8 md:px-8 md:py-12" 
      data-template-id={template.id}
      style={themeStyles}
    >
      {template.sections.map((section, index) => renderSection(section, `section-${index}`))}
    </div>
  );
};

// ייצור של קובץ HeroBlockComponent שעדיין לא קיים:

// file: src/components/blocks/HeroBlock.tsx
export const HeroBlockComponent: React.FC<{ block: HeroBlock; theme?: Template["styles"] }> = ({ block, theme }) => {
  // הגדרת סגנונות לפי סוג הכותרת הראשית
  const getHeroStyles = () => {
    const style = block.style || "centered";
    const baseStyles = {
      backgroundImage: block.background ? `url(${block.background})` : undefined,
      backgroundColor: theme?.backgroundColor || "#f8f8f6",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };

    if (block.imageFilter) {
      switch (block.imageFilter) {
        case "grayscale":
          return { ...baseStyles, filter: "grayscale(100%)" };
        case "sepia":
          return { ...baseStyles, filter: "sepia(70%)" };
        case "blur":
          return { ...baseStyles, filter: "blur(2px)" };
        case "brightness":
          return { ...baseStyles, filter: "brightness(1.2)" };
        case "contrast":
          return { ...baseStyles, filter: "contrast(1.3)" };
        default:
          return baseStyles;
      }
    }

    return baseStyles;
  };

  const getTextAlignment = () => {
    const style = block.style || "centered";
    switch (style) {
      case "left-aligned":
        return "text-left";
      case "right-aligned":
        return "text-right";
      case "split":
        return "md:text-left text-center";
      case "overlay":
      case "centered":
      default:
        return "text-center";
    }
  };

  const isOverlay = block.style === "overlay";
  const alignment = getTextAlignment();
  const heroStyles = getHeroStyles();

  return (
    <div className="hero-block relative h-80 md:h-96 rounded-lg overflow-hidden" style={heroStyles}>
      {/* Overlay effect for better text readability when using background image */}
      {isOverlay && (
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      )}

      <div className={`absolute inset-0 flex flex-col justify-center px-4 md:px-8 ${alignment}`}>
        <h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
          style={{ 
            color: isOverlay ? "#ffffff" : (theme?.textColor || "#333333"),
            fontFamily: theme?.headingFont || "inherit"
          }}
        >
          {block.heading}
        </h1>
        
        {block.subheading && (
          <h2 
            className="text-lg md:text-xl lg:text-2xl"
            style={{ 
              color: isOverlay ? "#ffffff" : (theme?.secondaryColor || "#99B3B6"),
              fontFamily: theme?.headingFont || "inherit" 
            }}
          >
            {block.subheading}
          </h2>
        )}
      </div>
    </div>
  );
};

// file: src/components/blocks/TextBlock.tsx
export const TextBlockComponent: React.FC<{ block: TextBlock; theme?: Template["styles"] }> = ({ block, theme }) => {
  return (
    <div className="text-block py-4">
      {block.heading && (
        <h3 
          className="text-xl font-semibold mb-4"
          style={{ 
            color: theme?.textColor || "#333333",
            fontFamily: theme?.headingFont || "inherit" 
          }}
        >
          {block.heading}
        </h3>
      )}
      
      <div 
        className="prose max-w-none"
        style={{ color: theme?.textColor || "#333333" }}
      >
        {typeof block.content === "string" ? (
          <p>{block.content}</p>
        ) : (
          <p>Content not available</p>
        )}
      </div>
    </div>
  );
};
```

## 7. שיפור הטיפול בקבצים ובממשק העלאת קבצי CV

```typescript
// file: src/services/file-service.ts

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { v4 as uuidv4 } from "uuid";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

export class FileService {
  private static supabase = createClientComponentClient<Database>();

  /**
   * העלאת קובץ לאחסון
   * 
   * @param file הקובץ להעלאה
   * @param path הנתיב באחסון (אופציונלי, ברירת מחדל 'uploads')
   * @returns URL של הקובץ אם ההעלאה הצליחה, אחרת null
   */
  static async uploadFile(file: File, path = "uploads"): Promise<string | null> {
    try {
      // בדיקת סוג קובץ
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type. Allowed types: PDF, JPEG, PNG, DOC, DOCX.`);
      }

      // בדיקת גודל קובץ (מקסימום 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size: 5MB.`);
      }

      // יצירת שם ייחודי לקובץ
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // העלאת הקובץ לאחסון
      const { data, error } = await this.supabase.storage
        .from("cv-files")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // קבלת URL הציבורי
      const { data: urlData } = this.supabase.storage
        .from("cv-files")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      handleError(error, {
        context: { method: "uploadFile", fileName: file.name }
      });
      return null;
    }
  }

  /**
   * מחיקת קובץ מהאחסון
   * 
   * @param url URL של הקובץ למחיקה
   * @returns אם המחיקה הצליחה
   */
  static async deleteFile(url: string): Promise<boolean> {
    try {
      // חילוץ הנתיב מה-URL
      const pathMatch = url.match(/\/cv-files\/([^?]+)/);
      if (!pathMatch || !pathMatch[1]) {
        throw new Error("Invalid file URL format");
      }
      
      const filePath = pathMatch[1];
      
      // מחיקת הקובץ
      const { error } = await this.supabase.storage
        .from("cv-files")
        .remove([filePath]);

      if (error) throw error;
      
      return true;
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "deleteFile", url }
      });
      return false;
    }
  }

  /**
   * העלאת תמונה עבור תבנית
   * 
   * @param file קובץ התמונה
   * @param templateId מזהה התבנית
   * @returns URL של הקובץ אם ההעלאה הצליחה, אחרת null
   */
  static async uploadTemplateImage(file: File, templateId: string): Promise<string | null> {
    try {
      // בדיקת סוג קובץ
      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid image type. Allowed types: JPEG, PNG, WEBP, SVG.`);
      }

      // בדיקת גודל קובץ (מקסימום 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        throw new Error(`Image too large. Maximum size: 2MB.`);
      }

      // יצירת שם ייחודי לקובץ
      const fileExt = file.name.split(".").pop();
      const fileName = `${templateId}-${uuidv4()}.${fileExt}`;
      const filePath = `templates/${fileName}`;

      // העלאת הקובץ לאחסון
      const { data, error } = await this.supabase.storage
        .from("template-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // קבלת URL הציבורי
      const { data: urlData } = this.supabase.storage
        .from("template-images")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      handleError(error, {
        context: { method: "uploadTemplateImage", fileName: file.name, templateId }
      });
      return null;
    }
  }
}

export default FileService;
```

## 8. יצירת קומפוננטת העלאת CV מאובטחת

```typescript
// file: src/components/upload/CVUploader.tsx

"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import FileService from "@/services/file-service";
import { extractCVData } from "@/services/cv-parsing-service"; // נפנה לשירות שיוצר בהמשך
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpCircle, File, X, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/database.types";

interface CVUploaderProps {
  onSuccess?: (cvData: any, cvId: string) => void;
  redirectOnSuccess?: boolean;
  className?: string;
}

export function CVUploader({ onSuccess, redirectOnSuccess = true, className }: CVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // ודא שהקובץ הוא מסוג המותר
    const allowedTypes = [
      "application/pdf", 
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrorMessage("Invalid file format. Please upload a PDF or Word document.");
      setStatus("error");
      return;
    }

    setFile(selectedFile);
    setErrorMessage(null);
    setStatus("idle");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // ודא שהקובץ הוא מסוג המותר
    const allowedTypes = [
      "application/pdf", 
      "application/msword", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    
    if (!allowedTypes.includes(droppedFile.type)) {
      setErrorMessage("Invalid file format. Please upload a PDF or Word document.");
      setStatus("error");
      return;
    }

    setFile(droppedFile);
    setErrorMessage(null);
    setStatus("idle");
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    
    try {
      setIsUploading(true);
      setStatus("uploading");
      setUploadProgress(10);

      // העלאת הקובץ לאחסון
      const fileUrl = await FileService.uploadFile(file);
      if (!fileUrl) {
        throw new Error("Failed to upload file");
      }
      
      setUploadProgress(40);
      setStatus("processing");

      // חילוץ נתונים מקובץ ה-CV
      const cvData = await extractCVData(fileUrl);
      
      setUploadProgress(70);

      // שמירת הנתונים בבסיס הנתונים
      const { data, error } = await supabase
        .from("cvs")
        .insert({
          user_id: user.id,
          file_url: fileUrl,
          data: cvData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // עדכון מספר העדכונים שנותרו
      await supabase
        .from("profiles")
        .update({ 
          cv_file_url: fileUrl,
          cv_data: cvData
        })
        .eq("id", user.id);

      setUploadProgress(100);
      setStatus("success");

      toast({
        title: "CV uploaded successfully",
        description: "Your CV has been processed and is ready for use.",
      });

      // אם יש פונקציית הצלחה, הפעל אותה
      if (onSuccess && data) {
        onSuccess(cvData, data.id);
      }

      // הפניה לדף התצוגה המקדימה
      if (redirectOnSuccess && data) {
        router.push(`/preview?cvId=${data.id}&tempId=designer`);
      }
    } catch (error: any) {
      console.error("Error uploading CV:", error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to upload and process CV");
      
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload and process your CV",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setStatus("idle");
    setUploadProgress(0);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Upload Your CV</CardTitle>
        <CardDescription>
          Upload your CV to get started with your website generation
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "idle" && !file && (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <ArrowUpCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Drag and drop your CV here
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse files
            </p>
            <p className="text-xs text-gray-400">
              Supports PDF and Word documents up to 5MB
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
          </div>
        )}

        {file && status === "idle" && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button 
              onClick={resetUpload} 
              className="text-gray-400 hover:text-gray-500"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {(status === "uploading" || status === "processing") && (
          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-gray-700">
                {status === "uploading" ? "Uploading..." : "Processing CV..."}
              </span>
              <span className="text-sm text-gray-500">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        {status === "success" && (
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-green-800">CV uploaded successfully!</p>
              <p className="text-sm text-green-600">
                Your CV has been processed and is ready for use.
              </p>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex items-center p-4 bg-red-50 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <p className="font-medium text-red-800">Upload failed</p>
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        {(status === "idle" && file) && (
          <>
            <Button variant="outline" onClick={resetUpload}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              Upload & Process
            </Button>
          </>
        )}
        
        {status === "success" && (
          <Button onClick={resetUpload} className="ml-auto">
            Upload Another CV
          </Button>
        )}
        
        {status === "error" && (
          <Button onClick={resetUpload} variant="outline" className="ml-auto">
            Try Again
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

## 9. שירות עיבוד וחילוץ נתוני CV

```typescript
// file: src/services/cv-parsing-service.ts

/**
 * שירות לעיבוד וחילוץ נתונים מתוך קבצי קורות חיים
 */

// הערה: בקוד האמיתי, ניתן להשתמש בשירותי AI כמו OpenAI או תשתיות אחרות לחילוץ מידע
// לצורך ה-MVP, נממש גרסה בסיסית שמנתחת טקסט בצורה פשוטה

import { handleError } from "@/lib/error-utils";

interface ParsedCV {
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

/**
 * חילוץ נתונים מתוך קובץ CV
 * 
 * @param fileUrl URL של קובץ ה-CV
 * @returns נתוני CV שחולצו
 */
export async function extractCVData(fileUrl: string): Promise<ParsedCV> {
  try {
    // במציאות, היינו שולחים את הקובץ לשירות ניתוח או API
    // לצורך ה-MVP, נדמה תהליך חילוץ בסיסי

    // פנייה ל-API שחילוץ טקסט
    const response = await fetch("/api/extract-cv", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to extract CV data");
    }

    const data = await response.json();
    return data.cvData;
  } catch (error) {
    handleError(error, {
      showToast: false,
      context: { method: "extractCVData", fileUrl }
    });

    // החזרת נתונים בסיסיים במקרה של שגיאה
    return {
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
  }
}

/**
 * טקסט גולמי מתוך קובץ CV
 * 
 * @param fileUrl URL של קובץ ה-CV
 * @returns טקסט שחולץ מהקובץ
 */
export async function extractRawText(fileUrl: string): Promise<string> {
  try {
    // במציאות, היינו שולחים את הקובץ לשירות ניתוח או API
    const response = await fetch("/api/extract-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to extract text from CV");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    handleError(error, {
      showToast: false,
      context: { method: "extractRawText", fileUrl }
    });
    return "Failed to extract text from the uploaded document.";
  }
}
```

## 10. שירות אימות נתוני טפסים

```typescript
// file: src/lib/form-validator.ts

import { z } from "zod";

// פונקציה כללית לאימות נתונים
export function validateData<T>(schema: z.ZodType<T>, data: unknown): { 
  success: boolean;
  data?: T; 
  errors?: Record<string, string[]>;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      
      return { success: false, errors };
    }
    
    // במקרה של שגיאה שאינה שגיאת אימות
    return { 
      success: false,
      errors: { _form: ["Validation failed"] }
    };
  }
}

// סכמות אימות שונות לכל הטפסים באפליקציה

// אימות פרטי משתמש
export const userProfileSchema = z.object({
  full_name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot be longer than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  avatar_url: z.string().url().optional().nullable(),
});

// אימות פרטי התחברות
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// אימות פרטי הרשמה
export const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

// אימות פרטי דומיין
export const domainSchema = z.object({
  domain: z.string()
    .min(3, "Domain must be at least 3 characters")
    .max(63, "Domain cannot be longer than 63 characters")
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/, 
          "Domain can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen"),
});

// אימות פרטי תשלום
export const paymentSchema = z.object({
  paymentMethod: z.string(),
  domain: z.string()
    .min(3, "Domain must be at least 3 characters")
    .max(63, "Domain cannot be longer than 63 characters")
    .regex(/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/, 
          "Domain can only contain letters, numbers, and hyphens, and cannot start or end with a hyphen"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// אימות בקשת עדכון
export const revisionSchema = z.object({
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot be longer than 500 characters"),
  site_id: z.string().uuid("Invalid site ID"),
});

// אימות הגדרות משתמש
export const userSettingsSchema = z.object({
  email_notifications: z.boolean(),
  marketing_emails: z.boolean(),
  preferences: z.record(z.any()).optional(),
});

// ייצוא הסכמות לשימוש בקומפוננטות
export const schemas = {
  userProfile: userProfileSchema,
  login: loginSchema,
  signup: signupSchema,
  domain: domainSchema,
  payment: paymentSchema,
  revision: revisionSchema,
  userSettings: userSettingsSchema,
};
```

## 11. שיפור ה-Button Component עם לוגיקת טעינה

```typescript
// file: src/components/ui/button.tsx

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const isDisabled = disabled || isLoading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

## 12. הוספת קומפוננטה להצגת סטאטוס פרויקט מונפש

```tsx
// file: src/components/ui/project-status.tsx

import React from "react";
import { Check, Clock, ArrowRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatusType = "pending" | "in_progress" | "completed" | "failed";

export interface StatusStep {
  id: string;
  title: string;
  description?: string;
  status: StatusType;
  date?: string;
}

interface ProjectStatusProps {
  steps: StatusStep[];
  className?: string;
}

export function ProjectStatus({ steps, className }: ProjectStatusProps) {
  // Find the current active step
  const activeStepIndex = steps.findIndex(step => step.status === "in_progress");
  const completedSteps = steps.filter(step => step.status === "completed").length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  // Function to get icon based on status
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-white" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-white" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-white" />;
      default:
        return <ArrowRight className="h-5 w-5 text-white" />;
    }
  };

  // Function to get color based on status
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className={cn("relative px-4 py-8", className)}>
      {/* Progress bar */}
      <div className="absolute left-0 top-12 w-full h-1 bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Steps */}
      <div className="flex justify-between relative z-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
                getStatusColor(step.status),
                step.status === "in_progress" && "animate-pulse"
              )}
            >
              {getStatusIcon(step.status)}
            </div>
            <div className="text-center">
              <div className={cn(
                "text-sm font-medium",
                step.status === "in_progress" ? "text-blue-600" : 
                step.status === "completed" ? "text-green-600" :
                step.status === "failed" ? "text-red-600" : "text-gray-500"
              )}>
                {step.title}
              </div>
              {step.description && (
                <div className="text-xs text-gray-500 mt-1 max-w-[100px] text-center">
                  {step.description}
                </div>
              )}
              {step.date && (
                <div className="text-xs text-gray-400 mt-1">
                  {step.date}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

13. יצירת שירות פריסה (Deploy Service)
typescript// file: src/services/deploy-service.ts

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

export interface DeploymentOptions {
  siteId: string;
  templateId: string;
  userId: string;
  domain?: string;
  customDomain?: string;
}

export interface DeploymentStatus {
  status: "queued" | "deploying" | "complete" | "failed";
  url?: string;
  error?: string;
}

class DeployService {
  private supabase = createClientComponentClient<Database>();

  /**
   * פריסת אתר ב-Vercel
   */
  async deploySite(options: DeploymentOptions): Promise<DeploymentStatus> {
    try {
      // בקשה ל-API להתחלת הפריסה
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Deployment failed");
      }

      const data = await response.json();

      // עדכון הסטטוס בבסיס הנתונים
      await this.updateDeploymentStatus(options.siteId, {
        status: "queued",
        deployment_id: data.deploymentId,
      });

      return {
        status: "queued",
        url: data.previewUrl,
      };
    } catch (error) {
      handleError(error, {
        context: { method: "deploySite", options }
      });

      // עדכון סטטוס הכישלון בבסיס הנתונים
      await this.updateDeploymentStatus(options.siteId, {
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
      });

      return {
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * קבלת סטטוס פריסה
   */
  async getDeploymentStatus(siteId: string): Promise<DeploymentStatus> {
    try {
      const { data, error } = await this.supabase
        .from("deployments")
        .select("*")
        .eq("site_id", siteId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (!data) {
        return { status: "failed", error: "No deployment found" };
      }

      return {
        status: data.status as "queued" | "deploying" | "complete" | "failed",
        url: data.url,
        error: data.error_message,
      };
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "getDeploymentStatus", siteId }
      });
      
      return { status: "failed", error: "Failed to fetch deployment status" };
    }
  }

  /**
   * עדכון סטטוס פריסה
   */
  private async updateDeploymentStatus(
    siteId: string,
    update: {
      status: "queued" | "deploying" | "complete" | "failed";
      deployment_id?: string;
      url?: string;
      error_message?: string;
    }
  ): Promise<void> {
    try {
      await this.supabase.from("deployments").insert({
        site_id: siteId,
        status: update.status,
        deployment_id: update.deployment_id,
        url: update.url,
        error_message: update.error_message,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating deployment status:", error);
    }
  }

  /**
   * קבלת היסטוריית פריסות
   */
  async getDeploymentHistory(siteId: string, limit = 5): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from("deployments")
        .select("*")
        .eq("site_id", siteId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "getDeploymentHistory", siteId }
      });
      
      return [];
    }
  }
}

const deployService = new DeployService();
export default deployService;
14. שירות דומיינים (Domains Service)
typescript// file: src/services/domain-service.ts

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

export interface DomainOptions {
  name: string;
  siteId: string;
  userId: string;
}

export interface DomainStatus {
  id?: string;
  name: string;
  status: "pending" | "active" | "failed" | "expired";
  expiresAt?: string;
  error?: string;
}

class DomainService {
  private supabase = createClientComponentClient<Database>();

  /**
   * בדיקת זמינות דומיין
   */
  async checkDomainAvailability(domain: string): Promise<{ 
    available: boolean; 
    price?: number;
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/domains/check?domain=${encodeURIComponent(domain)}`, {
        method: "GET",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to check domain availability");
      }

      const data = await response.json();
      return {
        available: data.available,
        price: data.price,
      };
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "checkDomainAvailability", domain }
      });
      
      return {
        available: false,
        error: error instanceof Error ? error.message : "Unknown error checking domain",
      };
    }
  }

  /**
   * רישום דומיין חדש
   */
  async registerDomain(options: DomainOptions): Promise<{ 
    success: boolean; 
    domain?: DomainStatus;
    error?: string;
  }> {
    try {
      // קריאה לשרת לרישום דומיין
      const response = await fetch("/api/domains/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register domain");
      }

      const data = await response.json();

      // עדכון בסיס הנתונים
      await this.supabase.from("domains").insert({
        name: options.name,
        user_id: options.userId,
        site_id: options.siteId,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      return {
        success: true,
        domain: {
          name: options.name,
          status: "pending",
        },
      };
    } catch (error) {
      handleError(error, {
        context: { method: "registerDomain", options }
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error registering domain",
      };
    }
  }

  /**
   * קבלת סטטוס דומיין
   */
  async getDomainStatus(domainName: string): Promise<DomainStatus | null> {
    try {
      const { data, error } = await this.supabase
        .from("domains")
        .select("*")
        .eq("name", domainName)
        .single();

      if (error) throw error;

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        status: data.status as "pending" | "active" | "failed" | "expired",
        expiresAt: data.expires_at,
        error: data.error_message,
      };
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "getDomainStatus", domainName }
      });
      
      return null;
    }
  }

  /**
   * קבלת דומיינים של משתמש
   */
  async getUserDomains(userId: string): Promise<DomainStatus[]> {
    try {
      const { data, error } = await this.supabase
        .from("domains")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return (data || []).map(domain => ({
        id: domain.id,
        name: domain.name,
        status: domain.status as "pending" | "active" | "failed" | "expired",
        expiresAt: domain.expires_at,
        error: domain.error_message,
      }));
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "getUserDomains", userId }
      });
      
      return [];
    }
  }

  /**
   * ביטול דומיין 
   * הערה: בדרך כלל לא מאפשרים ביטול לאחר רכישה, אבל אפשר לנתק אותו מהאתר
   */
  async unlinkDomain(domainId: string): Promise<boolean> {
    try {
      // ניתוק הדומיין מהאתר אבל השארתו ברישום
      const { error } = await this.supabase
        .from("domains")
        .update({ site_id: null })
        .eq("id", domainId);

      if (error) throw error;

      return true;
    } catch (error) {
      handleError(error, {
        context: { method: "unlinkDomain", domainId }
      });
      
      return false;
    }
  }
}

const domainService = new DomainService();
export default domainService;
15. שירות תשלומים Stripe
typescript// file: src/services/stripe-service.ts

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

export interface CheckoutOptions {
  siteId: string;
  userId: string;
  items: {
    priceId: string;
    quantity?: number;
  }[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

class StripeService {
  private supabase = createClientComponentClient<Database>();

  /**
   * יצירת session לתשלום
   */
  async createCheckoutSession(options: CheckoutOptions): Promise<{ url: string } | { error: string }> {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create checkout session");
      }

      const data = await response.json();
      return { url: data.url };
    } catch (error) {
      handleError(error, {
        context: { method: "createCheckoutSession", options }
      });
      
      return { error: error instanceof Error ? error.message : "Unknown error creating checkout" };
    }
  }

  /**
   * קבלת מידע על המנוי של המשתמש
   */
  async getUserSubscription(userId: string): Promise<any | null> {
    try {
      const { data, error } = await this.supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      
      return data;
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "getUserSubscription", userId }
      });
      
      return null;
    }
  }

  /**
   * קבלת היסטוריית רכישות
   */
  async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "getPaymentHistory", userId }
      });
      
      return [];
    }
  }

  /**
   * קבלת מספר העדכונים שנותרו למשתמש
   */
  async getRemainingRevisions(userId: string): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from("profiles")
        .select("revisions_left")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      return data?.revisions_left || 0;
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "getRemainingRevisions", userId }
      });
      
      return 0;
    }
  }

  /**
   * רכישת עדכון נוסף
   */
  async purchaseExtraRevision(userId: string): Promise<{ success: boolean; error?: string }> {
    const options: CheckoutOptions = {
      userId,
      siteId: "revision-purchase", // ערך מיוחד לרכישת עדכונים
      items: [
        {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_EXTRA_REVISION || 'price_extra_revision_499',
          quantity: 1
        }
      ],
      successUrl: `${window.location.origin}/dashboard?purchase=revision-success`,
      cancelUrl: `${window.location.origin}/dashboard?purchase=revision-canceled`,
      metadata: {
        type: "extra_revision",
        user_id: userId
      }
    };

    try {
      const result = await this.createCheckoutSession(options);
      
      if ('url' in result) {
        // הפניה לדף התשלום
        window.location.href = result.url;
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      handleError(error, {
        context: { method: "purchaseExtraRevision", userId }
      });
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to purchase revision" 
      };
    }
  }
}

const stripeService = new StripeService();
export default stripeService;
16. API Route לפריסת אתר בוורסל
typescript// file: src/app/api/deploy/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/error-utils";
import { v4 as uuidv4 } from "uuid";
import type { Database } from "@/types/database.types";

interface DeployRequestBody {
  siteId: string;
  templateId: string;
  userId: string;
  domain?: string;
  customDomain?: string;
}

// מחזיר HMAC signature למניעת בקשות לא מורשות
function getVercelSignature(payload: string): string {
  const crypto = require('crypto');
  const secret = process.env.VERCEL_WEBHOOK_SECRET;
  
  if (!secret) {
    console.error("VERCEL_WEBHOOK_SECRET is not defined");
    return "";
  }

  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

export async function POST(request: Request) {
  try {
    // בדיקה שכל משתני הסביבה הנדרשים קיימים
    if (!process.env.VERCEL_TOKEN || !process.env.DEPLOYMENT_URL) {
      return NextResponse.json(
        { error: "Server configuration error: Missing environment variables" },
        { status: 500 }
      );
    }

    // פענוח הבקשה
    const body: DeployRequestBody = await request.json();
    const { siteId, templateId, userId } = body;

    // וידוא שכל הנתונים הנדרשים קיימים
    if (!siteId || !templateId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: siteId, templateId, or userId" },
        { status: 400 }
      );
    }

    // התחברות לסופאבייס
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // קבלת פרטי האתר מבסיס הנתונים
    const { data: site, error: siteError } = await supabase
      .from("sites")
      .select("*")
      .eq("id", siteId)
      .single();

    if (siteError || !site) {
      return NextResponse.json(
        { error: siteError?.message || "Site not found" },
        { status: 404 }
      );
    }

    // וידוא שהמשתמש הוא בעל האתר
    if (site.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: User is not the site owner" },
        { status: 403 }
      );
    }

    // יצירת מזהה ייחודי לפריסה
    const deploymentId = uuidv4();

    // הכנת הנתונים לשליחה לוורסל
    const deploymentData = {
      deploymentId,
      siteId,
      templateId,
      userId,
      domain: body.domain,
      customDomain: body.customDomain,
      siteData: site.template_data,
      customStyles: site.custom_styles,
      timestamp: new Date().toISOString()
    };

    // חתימת הנתונים למניעת זיוף
    const payload = JSON.stringify(deploymentData);
    const signature = getVercelSignature(payload);

    // שליחת בקשת פריסה לוורסל
    const deployResponse = await fetch(process.env.DEPLOYMENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-signature": signature,
        "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`
      },
      body: payload
    });

    // בדיקה אם הבקשה הצליחה
    if (!deployResponse.ok) {
      const deployError = await deployResponse.json();
      throw new Error(deployError.error || "Deployment request failed");
    }

    const deployResult = await deployResponse.json();

    // עדכון בסיס הנתונים עם פרטי הפריסה
    await supabase.from("deployments").insert({
      id: deploymentId,
      site_id: siteId,
      user_id: userId,
      status: "queued",
      created_at: new Date().toISOString(),
      deployment_data: deploymentData
    });

    // החזרת התשובה למשתמש
    return NextResponse.json({
      success: true,
      deploymentId,
      status: "queued",
      previewUrl: deployResult.previewUrl || `https://${deploymentId}.vercel.app`
    });
  } catch (error) {
    console.error("Error deploying site:", error);
    
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
17. API Route לבדיקת זמינות דומיין
typescript// file: src/app/api/domains/check/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

// ולידציה של שם דומיין
function validateDomain(domain: string): boolean {
  // בדיקת תווים חוקיים
  const validDomainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  
  if (!validDomainPattern.test(domain)) {
    return false;
  }
  
  // וידוא אורך מתאים
  if (domain.length < 3 || domain.length > 63) {
    return false;
  }
  
  // וידוא שאין תווי הייפן בהתחלה או בסוף
  if (domain.startsWith("-") || domain.endsWith("-")) {
    return false;
  }
  
  return true;
}

export async function GET(request: Request) {
  try {
    // קבלת שם הדומיין מפרמטרי השאילתה
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");

    // וידוא שסופק שם דומיין
    if (!domain) {
      return NextResponse.json(
        { error: "Domain parameter is required" },
        { status: 400 }
      );
    }

    // בדיקת תקינות הדומיין
    if (!validateDomain(domain)) {
      return NextResponse.json(
        { 
          available: false, 
          error: "Invalid domain format. Domains must be 3-63 characters, using only letters, numbers, and hyphens (not at the start or end)." 
        },
        { status: 400 }
      );
    }

    // בדיקה שמשתני הסביבה הנדרשים קיימים
    if (!process.env.VERCEL_TOKEN) {
      return NextResponse.json(
        { error: "Server configuration error: Missing environment variables" },
        { status: 500 }
      );
    }

    // וידוא שלא מדובר בדומיין שכבר רשום במערכת
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data: existingDomain, error: dbError } = await supabase
      .from("domains")
      .select("id")
      .eq("name", domain)
      .maybeSingle();

    if (dbError) {
      console.error("Database error checking domain:", dbError);
    }

    if (existingDomain) {
      return NextResponse.json({
        available: false,
        error: "This domain is already registered in our system"
      });
    }

    // בקשה לוורסל לבדיקת זמינות הדומיין
    const fullDomain = `${domain}.cv-site.com`;
    const response = await fetch(`https://api.vercel.com/v6/domains/${fullDomain}/config`, {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
      },
    });

    // אם הדומיין כבר קיים, הוא אינו זמין
    if (response.status === 200) {
      return NextResponse.json({
        available: false,
        error: "This domain is already registered"
      });
    }

    // החזרת תשובה למשתמש
    return NextResponse.json({
      available: true,
      price: 19.90, // מחיר קבוע בשלב זה
      domain: fullDomain
    });
  } catch (error) {
    console.error("Error checking domain availability:", error);
    
    return NextResponse.json(
      { 
        available: false,
        error: getErrorMessage(error) 
      },
      { status: 500 }
    );
  }
}
18. API Route לרישום דומיין
typescript// file: src/app/api/domains/register/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

interface DomainRegistrationRequest {
  name: string;
  siteId: string;
  userId: string;
}

// ולידציה של שם דומיין
function validateDomain(domain: string): boolean {
  // בדיקת תווים חוקיים
  const validDomainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  
  if (!validDomainPattern.test(domain)) {
    return false;
  }
  
  // וידוא אורך מתאים
  if (domain.length < 3 || domain.length > 63) {
    return false;
  }
  
  // וידוא שאין תווי הייפן בהתחלה או בסוף
  if (domain.startsWith("-") || domain.endsWith("-")) {
    return false;
  }
  
  return true;
}

export async function POST(request: Request) {
  try {
    // בדיקה שמשתני הסביבה הנדרשים קיימים
    if (!process.env.VERCEL_TOKEN) {
      return NextResponse.json(
        { error: "Server configuration error: Missing environment variables" },
        { status: 500 }
      );
    }

    // פענוח הבקשה
    const body: DomainRegistrationRequest = await request.json();
    const { name, siteId, userId } = body;

    // וידוא שכל הנתונים הנדרשים קיימים
    if (!name || !siteId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: name, siteId, or userId" },
        { status: 400 }
      );
    }

    // בדיקת תקינות הדומיין
    if (!validateDomain(name)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    // התחברות לסופאבייס
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // קבלת פרטי האתר מבסיס הנתונים
    const { data: site, error: siteError } = await supabase
      .from("sites")
      .select("user_id")
      .eq("id", siteId)
      .single();

    if (siteError || !site) {
      return NextResponse.json(
        { error: siteError?.message || "Site not found" },
        { status: 404 }
      );
    }

    // וידוא שהמשתמש הוא בעל האתר
    if (site.user_id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: User is not the site owner" },
        { status: 403 }
      );
    }

    // וידוא שלא מדובר בדומיין שכבר רשום במערכת
    const { data: existingDomain, error: dbError } = await supabase
      .from("domains")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (dbError) {
      console.error("Database error checking domain:", dbError);
    }

    if (existingDomain) {
      return NextResponse.json(
        { error: "This domain is already registered in our system" },
        { status: 400 }
      );
    }

    // בקשה לוורסל לרישום הדומיין
    const fullDomain = `${name}.cv-site.com`;
    const vercelResponse = await fetch("https://api.vercel.com/v6/domains", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`
      },
      body: JSON.stringify({
        name: fullDomain,
        projectId: process.env.VERCEL_PROJECT_ID // מזהה הפרויקט בוורסל
      })
    });

    if (!vercelResponse.ok) {
      const vercelError = await vercelResponse.json();
      throw new Error(vercelError.error?.message || "Domain registration failed");
    }

    const vercelData = await vercelResponse.json();

    // חישוב תאריך תפוגה (שנה מהיום)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    // שמירת הדומיין בבסיס הנתונים
    const { data, error } = await supabase.from("domains").insert({
      name: name,
      full_domain: fullDomain,
      user_id: userId,
      site_id: siteId,
      status: "pending",
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString(),
      vercel_domain_id: vercelData.id
    }).select().single();

    if (error) {
      console.error("Error saving domain to database:", error);
      
      // ניסיון לבטל את הרישום בוורסל במקרה של כישלון
      await fetch(`https://api.vercel.com/v6/domains/${fullDomain}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${process.env.VERCEL_TOKEN}`
        }
      }).catch(e => console.error("Error removing domain from Vercel:", e));
      
      throw error;
    }

    // החזרת התשובה למשתמש
    return NextResponse.json({
      success: true,
      domain: {
        id: data.id,
        name: name,
        full_domain: fullDomain,
        status: "pending",
        expiresAt: expiresAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Error registering domain:", error);
    
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
19. API Route לטיפול בווב-הוק של Stripe
typescript// file: src/app/api/webhooks/stripe/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

// וידוא חתימת Stripe
async function verifyStripeSignature(req: Request): Promise<any> {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const signature = req.headers.get('stripe-signature') as string;
  
  if (!signature) {
    throw new Error('No Stripe signature found');
  }
  
  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return { event, rawBody: body };
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}

export async function POST(req: Request) {
  try {
    // בדיקת חתימת Stripe
    const { event } = await verifyStripeSignature(req);
    
    // התחברות לסופאבייס
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // טיפול באירועים שונים של Stripe
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // שמירת העסקה בטבלת התשלומים
        await supabase.from('payments').insert({
          user_id: session.metadata.user_id,
          payment_id: session.id,
          payment_status: 'completed',
          amount: session.amount_total / 100, // המרה מאגורות לשקלים
          currency: session.currency,
          payment_method: session.payment_method_types[0],
          created_at: new Date().toISOString(),
          metadata: {
            site_id: session.metadata.site_id,
            checkout_items: session.metadata.items
          }
        });
        
        // טיפול לפי סוג העסקה
        if (session.metadata.type === 'site_basic') {
          // עדכון סטטוס האתר ל"שולם"
          await supabase
            .from('sites')
            .update({ 
              payment_status: 'paid',
              updated_at: new Date().toISOString() 
            })
            .eq('id', session.metadata.site_id);
            
        } else if (session.metadata.type === 'extra_revision') {
          // הוספת עדכון נוסף למשתמש
          const { data, error } = await supabase
            .from('profiles')
            .select('revisions_left')
            .eq('id', session.metadata.user_id)
            .single();
            
          if (!error && data) {
            await supabase
              .from('profiles')
              .update({ 
                revisions_left: data.revisions_left + 1,
                updated_at: new Date().toISOString() 
              })
              .eq('id', session.metadata.user_id);
          }
        } else if (session.metadata.type === 'domain_basic') {
          // אם בעסקה נכלל דומיין, נרצה לשלוח בקשה לרישום הדומיין
          if (session.metadata.domain_name) {
            // קריאה פנימית לשירות רישום הדומיין
            // בהתקנה אמיתית כדאי להשתמש בתור עבודות
            const domainRegistrationData = {
              name: session.metadata.domain_name,
              siteId: session.metadata.site_id,
              userId: session.metadata.user_id
            };
            
            await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/domains/register`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(domainRegistrationData)
            });
          }
        }
        
        break;
      }
      
      case 'checkout.session.expired': {
        // טיפול בפג תוקף
        const session = event.data.object;
        await supabase.from('payments').insert({
          user_id: session.metadata.user_id,
          payment_id: session.id,
          payment_status: 'expired',
          amount: session.amount_total / 100,
          currency: session.currency,
          created_at: new Date().toISOString(),
          metadata: {
            site_id: session.metadata.site_id
          }
        });
        
        break;
      }
      
      case 'payment_intent.payment_failed': {
        // טיפול בכישלון תשלום
        const paymentIntent = event.data.object;
        await supabase.from('payments').insert({
          user_id: paymentIntent.metadata?.user_id,
          payment_id: paymentIntent.id,
          payment_status: 'failed',
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          created_at: new Date().toISOString(),
          metadata: {
            error: paymentIntent.last_payment_error?.message,
            site_id: paymentIntent.metadata?.site_id
          }
        });
        
        break;
      }
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
20. API Route לטיפול בווב-הוק של Vercel
typescript// file: src/app/api/webhooks/vercel/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

// אימות חתימת Vercel
function verifyVercelSignature(req: Request, body: string): boolean {
  const crypto = require('crypto');
  const signature = req.headers.get('x-vercel-signature') as string;
  const secret = process.env.VERCEL_WEBHOOK_SECRET;
  
  if (!signature || !secret) {
    return false;
  }
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
    
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(req: Request) {
  try {
    // קבלת תוכן הבקשה
    const body = await req.text();
    
    // אימות החתימה
    if (!verifyVercelSignature(req, body)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // פענוח הנתונים
    const webhookData = JSON.parse(body);
    const { deploymentId, status, url, error } = webhookData;
    
    if (!deploymentId) {
      return NextResponse.json({ error: 'Missing deploymentId' }, { status: 400 });
    }
    
    // התחברות לסופאבייס
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // קבלת פרטי הפריסה מבסיס הנתונים
    const { data: deployment, error: deploymentError } = await supabase
      .from('deployments')
      .select('*')
      .eq('id', deploymentId)
      .single();
      
    if (deploymentError || !deployment) {
      return NextResponse.json(
        { error: 'Deployment not found' },
        { status: 404 }
      );
    }
    
    // עדכון סטטוס הפריסה
    await supabase
      .from('deployments')
      .update({
        status: status,
        url: url,
        error_message: error,
        updated_at: new Date().toISOString()
      })
      .eq('id', deploymentId);
      
    // אם הפריסה הצליחה, עדכון האתר עם כתובת ה-URL החדשה
    if (status === 'complete' && url) {
      await supabase
        .from('sites')
        .update({
          live_url: url,
          deployment_status: 'deployed',
          updated_at: new Date().toISOString()
        })
        .eq('id', deployment.site_id);
        
      // הוספת התראה למשתמש
      await supabase
        .from('notifications')
        .insert({
          user_id: deployment.user_id,
          title: 'האתר שלך עלה לאוויר!',
          content: `האתר שלך זמין כעת בכתובת ${url}`,
          type: 'deployment_success',
          read: false,
          created_at: new Date().toISOString()
        });
    } else if (status === 'failed') {
      // עדכון סטטוס האתר במקרה של כישלון
      await supabase
        .from('sites')
        .update({
          deployment_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', deployment.site_id);
        
      // הוספת התראה למשתמש
      await supabase
        .from('notifications')
        .insert({
          user_id: deployment.user_id,
          title: 'בעיה בהעלאת האתר',
          content: `הייתה בעיה בהעלאת האתר שלך. צוות התמיכה שלנו יבדוק את הבעיה בהקדם.`,
          type: 'deployment_failure',
          read: false,
          created_at: new Date().toISOString()
        });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Vercel webhook error:', error);
    
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
21. API Route ל-Checkout
typescript// file: src/app/api/checkout/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

interface CheckoutRequestBody {
  userId: string;
  siteId: string;
  items: {
    priceId: string;
    quantity?: number;
  }[];
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export async function POST(request: Request) {
  try {
    // וידוא קיום משתני סביבה קריטיים
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Server configuration error: Missing Stripe configuration" },
        { status: 500 }
      );
    }

    // פענוח גוף הבקשה
    const body: CheckoutRequestBody = await request.json();
    const { userId, siteId, items, successUrl, cancelUrl, customerEmail, metadata } = body;

    // וידוא פרטי הבקשה
    if (!userId || !items || !items.length || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // התחברות לסופאבייס
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // וידוא קיום המשתמש
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // אתחול Stripe
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // הכנת פריטי התשלום
    const line_items = items.map(item => ({
      price: item.priceId,
      quantity: item.quantity || 1
    }));

    // יצירת session לתשלום
    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail || user.email,
      client_reference_id: userId,
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        site_id: siteId,
        items: JSON.stringify(items),
        ...metadata
      }
    });

    // החזרת URL של דף התשלום
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
22. דף התשלום (Checkout Page)
tsx// file: src/app/checkout/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import stripeService from "@/services/stripe-service";
import domainService from "@/services/domain-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { ProjectStatus, type StatusStep } from "@/components/ui/project-status";
import { handleError } from "@/lib/error-utils";
import { validateData, schemas } from "@/lib/form-validator";
import { CreditCard, Sparkles, Globe, Check, AlertCircle } from "lucide-react";

type CheckoutFormData = {
  paymentMethod: string;
  domain?: string;
  terms: boolean;
};

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    paymentMethod: "card",
    terms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean | null>(null);
  const [checkingDomain, setCheckingDomain] = useState(false);
  const [domainPrice, setDomainPrice] = useState(19.90);
  const [sitePrice, setSitePrice] = useState(14.90);
  const [totalPrice, setTotalPrice] = useState(14.90);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [processingSteps, setProcessingSteps] = useState<StatusStep[]>([
    { id: "site", title: "הכנת האתר", status: "pending" },
    { id: "payment", title: "תשלום", status: "pending" },
    { id: "domain", title: "רישום דומיין", status: "pending" },
    { id: "deploy", title: "העלאה לאוויר", status: "pending" }
  ]);

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // קבלת מזהה האתר מפרמטרי ה-URL
    const id = searchParams.get("siteId");
    if (id) {
      setSiteId(id);
      updateProcessingStep("site", "completed");
    } else {
      // אם אין מזהה אתר, חזרה לדף הבית
      router.push("/dashboard");
    }
  }, [searchParams, router]);

  // עדכון מחיר כולל
  useEffect(() => {
    let total = sitePrice;
    if (formData.domain && isDomainAvailable === true) {
      total += domainPrice;
    }
    setTotalPrice(total);
  }, [formData.domain, isDomainAvailable, sitePrice, domainPrice]);

  // טיפול בשינוי קלט
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // ניקוי שגיאות
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // איפוס זמינות דומיין בעת שינוי שם הדומיין
    if (name === "domain") {
      setIsDomainAvailable(null);
    }
  };

  // טיפול בשינוי צ'קבוקס
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, terms: checked }));
    
    // ניקוי שגיאות
    if (errors.terms) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.terms;
        return newErrors;
      });
    }
  };

  // בדיקת זמינות דומיין
  const checkDomainAvailability = async () => {
    if (!formData.domain) {
      setErrors(prev => ({ ...prev, domain: "נא להזין שם דומיין" }));
      return;
    }

    try {
      setCheckingDomain(true);
      updateProcessingStep("domain", "in_progress");
      
      const result = await domainService.checkDomainAvailability(formData.domain);
      
      if (result.available) {
        setIsDomainAvailable(true);
        setDomainPrice(result.price || 19.90);
        updateProcessingStep("domain", "completed");
        toast({
          title: "דומיין זמין",
          description: `הדומיין ${formData.domain}.cv-site.com זמין לרכישה`,
        });
      } else {
        setIsDomainAvailable(false);
        updateProcessingStep("domain", "failed");
        setErrors(prev => ({ ...prev, domain: result.error || "דומיין זה אינו זמין" }));
      }
    } catch (error) {
      handleError(error, {
        context: { method: "checkDomainAvailability", domain: formData.domain }
      });
      setIsDomainAvailable(false);
      updateProcessingStep("domain", "failed");
    } finally {
      setCheckingDomain(false);
    }
  };

  // עדכון שלב בתהליך
  const updateProcessingStep = (id: string, status: "pending" | "in_progress" | "completed" | "failed") => {
    setProcessingSteps(prev => prev.map(step => 
      step.id === id ? { ...step, status } : step
    ));
  };

  // שליחת הטופס לתשלום
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading || !user || !siteId) return;
    
    // וידוא תנאי שימוש
    if (!formData.terms) {
      setErrors(prev => ({ ...prev, terms: "יש לאשר את תנאי השימוש" }));
      return;
    }
    
    // וידוא זמינות דומיין אם הוזן
    if (formData.domain && isDomainAvailable !== true) {
      setErrors(prev => ({ ...prev, domain: "יש לבדוק זמינות דומיין תחילה" }));
      return;
    }
    
    // אימות נתונים
    const validation = validateData(schemas.payment, formData);
    
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      
      for (const [field, messages] of Object.entries(validation.errors || {})) {
        newErrors[field] = messages[0];
      }
      
      setErrors(newErrors);
      return;
    }
    
    try {
      setIsLoading(true);
      updateProcessingStep("payment", "in_progress");
      
      // הכנת פריטים לתשלום
      const items = [
        // אתר בסיסי
        {
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SITE_BASIC || 'price_site_basic_1490',
          quantity: 1
        }
      ];
      
      // הוספת דומיין אם הוזן
      if (formData.domain && isDomainAvailable === true) {
        items.push({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_DOMAIN_BASIC || 'price_domain_basic_1990',
          quantity: 1
        });
      }
      
      // יצירת metadata נוסף
      const metadata: Record<string, string> = {
        type: formData.domain ? 'site_and_domain' : 'site_basic'
      };
      
      if (formData.domain) {
        metadata.domain_name = formData.domain;
      }
      
      // יצירת checkout session
      const result = await stripeService.createCheckoutSession({
        userId: user.id,
        siteId,
        items,
        successUrl: `${window.location.origin}/dashboard?checkout=success`,
        cancelUrl: `${window.location.origin}/checkout?siteId=${siteId}&canceled=true`,
        metadata
      });
      
      if ('url' in result) {
        // הפניה לדף התשלום של Stripe
        updateProcessingStep("payment", "completed");
        window.location.href = result.url;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      handleError(error, {
        context: { method: "handleSubmit" }
      });
      updateProcessingStep("payment", "failed");
    } finally {
      setIsLoading(false);
    }
  };

  // בדיקת ביטול תשלום
  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      toast({
        title: "תשלום בוטל",
        description: "התשלום בוטל. ניתן לנסות שוב.",
        variant: "destructive",
      });
    }
  }, [searchParams]);

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">השלמת רכישה</h1>
      
      <ProjectStatus steps={processingSteps} className="mb-12" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>פרטי תשלום</CardTitle>
              <CardDescription>
                השלם את פרטי התשלום להפעלת האתר שלך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">שיטת תשלום</h3>
                    <RadioGroup
                      defaultValue="card"
                      value={formData.paymentMethod}
                      onValueChange={(value) => 
                        setFormData(prev => ({ ...prev, paymentMethod: value }))
                      }
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="card" id="payment-card" />
                        <Label htmlFor="payment-card" className="flex items-center">
                          <CreditCard className="w-4 h-4 ml-2" />
                          כרטיס אשראי
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">דומיין (אופציונלי)</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      הוסף דומיין ייחודי לאתר שלך במקום כתובת ברירת המחדל
                    </p>
                    
                    <div className="flex items-end gap-2 mb-1">
                      <div className="flex-1">
                        <Label htmlFor="domain">שם דומיין</Label>
                        <div className="flex">
                          <Input
                            id="domain"
                            name="domain"
                            value={formData.domain || ''}
                            onChange={handleInputChange}
                            placeholder="your-name"
                            className="rounded-r-none"
                          />
                          <div className="flex items-center border border-r-0 border-input px-3 rounded-l-md bg-muted text-muted-foreground">
                            .cv-site.com
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={checkDomainAvailability}
                        disabled={checkingDomain || !formData.domain}
                        className="mb-0.5"
                      >
                        {checkingDomain ? "בודק..." : "בדוק זמינות"}
                      </Button>
                    </div>
                    
                    {errors.domain && (
                      <p className="text-sm text-destructive mt-1">{errors.domain}</p>
                    )}
                    
                    {isDomainAvailable === true && (
                      <div className="flex items-center text-green-600 text-sm mt-1">
                        <Check className="w-4 h-4 ml-1" />
                        <span>הדומיין זמין!</span>
                      </div>
                    )}
                    
                    {isDomainAvailable === false && !errors.domain && (
                      <div className="flex items-center text-destructive text-sm mt-1">
                        <AlertCircle className="w-4 h-4 ml-1" />
                        <span>הדומיין אינו זמין</span>
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <Checkbox
                      id="terms"
                      checked={formData.terms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        אני מסכים/ה לתנאי השימוש ומדיניות הפרטיות
                      </Label>
                      {errors.terms && (
                        <p className="text-sm text-destructive">{errors.terms}</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => router.push(`/preview?siteId=${siteId}`)}
              >המשך פיתוח דף התשלום (Checkout Page):

```tsx
                חזרה לתצוגה מקדימה
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={isLoading}
                className="min-w-[150px]"
              >
                {isLoading ? "מעבד..." : "לתשלום"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>סיכום הזמנה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>אתר בסיסי</span>
                <span>₪{sitePrice.toFixed(2)}</span>
              </div>
              
              {formData.domain && isDomainAvailable === true && (
                <div className="flex justify-between text-sm">
                  <span>דומיין ({formData.domain}.cv-site.com)</span>
                  <span>₪{domainPrice.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>סה״כ</span>
                <span>₪{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-600 mt-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold">2 עדכונים חינם</span>
                </div>
                <p>כלולים בחבילה הבסיסית</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">תמיכה ועזרה</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                צוות התמיכה שלנו זמין לכל שאלה בדוא״ל:
                <a href="mailto:support@cv-site.com" className="block text-primary mt-1">
                  support@cv-site.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## 23. דף דשבורד (Dashboard Page)

```tsx
// file: src/app/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ProjectStatus } from "@/components/ui/project-status";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/error-utils";
import DatabaseService from "@/services/database-service";
import stripeService from "@/services/stripe-service";
import deployService from "@/services/deploy-service";
import { 
  Upload, 
  Eye, 
  Edit, 
  ExternalLink, 
  BarChart, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  PlusCircle,
  RefreshCw,
  Globe,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [userSite, setUserSite] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [revisionsLeft, setRevisionsLeft] = useState(0);
  const [siteStatus, setSiteStatus] = useState<"draft" | "pending" | "published" | "failed">("draft");
  const [revisionHistory, setRevisionHistory] = useState<any[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [pageTotalViews, setPageTotalViews] = useState(0);
  const [hasDomain, setHasDomain] = useState(false);
  const [domainStatus, setDomainStatus] = useState<"pending" | "active" | "failed" | null>(null);

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // טעינת נתוני משתמש
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // טעינת אתר המשתמש
        const site = await DatabaseService.getUserSite(user.id);
        setUserSite(site);
        
        if (site) {
          // קביעת סטטוס האתר
          if (site.live_url) {
            setSiteStatus("published");
          } else if (site.payment_status === "paid") {
            setSiteStatus("pending");
          } else {
            setSiteStatus("draft");
          }
          
          // טעינת היסטוריית עדכונים
          const revisions = await DatabaseService.getUserRevisions(user.id);
          setRevisionHistory(revisions);
          
          // טעינת נתוני אנליטיקה
          if (site.id) {
            const analytics = await DatabaseService.getSiteAnalytics(site.id, 30);
            setAnalyticsData(analytics);
            
            // חישוב סך הצפיות
            const totalViews = analytics.reduce((sum, day) => sum + (day.page_views || 0), 0);
            setPageTotalViews(totalViews);
          }
          
          // בדיקת דומיין
          if (site.domain_id) {
            setHasDomain(true);
            // טעינת סטטוס דומיין
            const domainData = await domainService.getDomainStatus(site.domain_id);
            if (domainData) {
              setDomainStatus(domainData.status as "pending" | "active" | "failed");
            }
          }
        }
        
        // טעינת מספר העדכונים שנותרו
        const remainingRevisions = await stripeService.getRemainingRevisions(user.id);
        setRevisionsLeft(remainingRevisions);
        
      } catch (error) {
        handleError(error, {
          showToast: true,
          context: { method: "loadUserData" }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);

  // טיפול בפרמטרי URL
  useEffect(() => {
    // הצגת הודעה אחרי תשלום מוצלח
    if (searchParams.get("checkout") === "success") {
      toast({
        title: "התשלום בוצע בהצלחה!",
        description: "האתר שלך בתהליך העלאה לאוויר. תוכל לעקוב אחר הסטטוס כאן.",
      });
    }
    
    // הצגת הודעה אחרי רכישת עדכון נוסף
    if (searchParams.get("purchase") === "revision-success") {
      toast({
        title: "נרכש עדכון נוסף",
        description: "העדכון הנוסף נוסף לחשבונך בהצלחה.",
      });
    }
  }, [searchParams]);

  // פונקציה להעלאת האתר לאוויר
  const handleDeploy = async () => {
    if (!user || !userSite) return;
    
    try {
      toast({
        title: "מתחיל העלאה לאוויר",
        description: "האתר שלך בתהליך העלאה. תהליך זה עשוי להימשך מספר דקות.",
      });
      
      const result = await deployService.deploySite({
        siteId: userSite.id,
        templateId: userSite.template_id,
        userId: user.id,
        domain: hasDomain ? userSite.domain_name : undefined
      });
      
      if (result.status === "queued") {
        toast({
          title: "האתר נשלח להעלאה",
          description: "האתר שלך בתור להעלאה. תוכל לעקוב אחר הסטטוס בדף זה.",
        });
        
        setSiteStatus("pending");
        
        // עדכון סטטוס האתר בבסיס הנתונים
        await DatabaseService.getUserSite(user.id);
      } else {
        throw new Error(result.error || "אירעה שגיאה בהעלאת האתר");
      }
    } catch (error) {
      handleError(error, {
        context: { method: "handleDeploy" }
      });
      setSiteStatus("failed");
    }
  };

  // פונקציה לרכישת עדכון נוסף
  const handleBuyRevision = async () => {
    if (!user) return;
    
    try {
      await stripeService.purchaseExtraRevision(user.id);
    } catch (error) {
      handleError(error, {
        context: { method: "handleBuyRevision" }
      });
    }
  };

  // אם אין משתמש, הפניה לדף ההתחברות
  if (!user) {
    router.push("/login");
    return null;
  }

  // תצוגת טעינה
  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>טוען נתונים...</p>
      </div>
    );
  }

  // אם אין אתר, הצעה ליצור אחד
  if (!userSite) {
    return (
      <div className="container max-w-4xl py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">ברוך הבא לאתר הקורות חיים שלך</h1>
          <p className="text-lg text-gray-600 mb-8">
            עדיין לא יצרת אתר קורות חיים. התחל בהעלאת קובץ קורות חיים כדי ליצור את האתר שלך.
          </p>
          <Button 
            size="lg"
            onClick={() => router.push("/upload-cv")}
            className="gap-2"
          >
            <Upload className="w-5 h-5" />
            העלאת קורות חיים
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>העלה קורות חיים</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm">
              העלה את קובץ קורות החיים שלך בפורמט PDF או Word
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>תצוגה מקדימה</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm">
              בחר את התבנית המועדפת וצפה בתצוגה מקדימה של האתר
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                <ExternalLink className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>פרסם את האתר</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm">
              השלם את התשלום והעלה את האתר שלך לאינטרנט
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {userSite.site_name || "האתר שלי"}
          </h1>
          <div className="flex items-center gap-2 text-sm">
            <div className={cn(
              "w-2 h-2 rounded-full",
              siteStatus === "published" ? "bg-green-500" :
              siteStatus === "pending" ? "bg-amber-500" :
              siteStatus === "failed" ? "bg-red-500" : "bg-gray-500"
            )}></div>
            <span>
              {siteStatus === "published" ? "מפורסם" :
               siteStatus === "pending" ? "בתהליך העלאה" :
               siteStatus === "failed" ? "נכשל בהעלאה" : "טיוטה"}
            </span>
            
            {userSite.live_url && (
              <a 
                href={userSite.live_url} 
                target="_blank"
                rel="noopener noreferrer" 
                className="text-primary hover:underline flex items-center gap-1 mr-3"
              >
                {hasDomain && domainStatus === "active" ? userSite.domain_name : userSite.live_url}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {siteStatus === "draft" && (
            <Button 
              onClick={() => router.push(`/checkout?siteId=${userSite.id}`)}
            >
              פרסם את האתר
            </Button>
          )}
          
          {siteStatus === "pending" && (
            <Button variant="outline" onClick={handleDeploy}>
              <RefreshCw className="w-4 h-4 ml-2" />
              בדוק סטטוס
            </Button>
          )}
          
          {siteStatus === "published" && (
            <Button variant="outline" onClick={handleDeploy}>
              <RefreshCw className="w-4 h-4 ml-2" />
              רענן אתר
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => router.push(`/preview?siteId=${userSite.id}`)}
          >
            <Eye className="w-4 h-4 ml-2" />
            תצוגה מקדימה
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push(`/customize?siteId=${userSite.id}`)}
          >
            <Edit className="w-4 h-4 ml-2" />
            עריכה
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="analytics">אנליטיקס</TabsTrigger>
          <TabsTrigger value="revisions">עדכונים</TabsTrigger>
          <TabsTrigger value="settings">הגדרות</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>תצוגה מקדימה</CardTitle>
              </CardHeader>
              <CardContent className="aspect-video relative overflow-hidden rounded-md border">
                {userSite.template_id && (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <Image 
                      src={`/templates/${userSite.template_id}-preview.jpg`} 
                      alt="תצוגה מקדימה של האתר"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button 
                        onClick={() => router.push(`/preview?siteId=${userSite.id}`)}
                        variant="secondary"
                      >
                        צפה במסך מלא
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between">
                <div className="text-sm text-gray-500">
                  תבנית: {userSite.template_id === "designer" ? "מעצב" : 
                          userSite.template_id === "musician" ? "מוזיקאי" : "מפתח"}
                </div>
                <Button variant="link" onClick={() => router.push(`/customize?siteId=${userSite.id}`)}>
                  שנה תבנית
                </Button>
              </CardFooter>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>סטטיסטיקות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>צפיות בדף</span>
                      <span>{pageTotalViews}</span>
                    </div>
                    <Progress value={Math.min(pageTotalViews / 2, 100)} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>עדכונים שנותרו</span>
                      <span>{revisionsLeft}</span>
                    </div>
                    <Progress value={revisionsLeft / 3 * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>פעולות מהירות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("revisions")}>
                    <RefreshCw className="w-4 h-4 ml-2" />
                    הזמן עדכון
                  </Button>
                  
                  {!hasDomain && (
                    <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/checkout?siteId=${userSite.id}&domain=true`)}>
                      <Globe className="w-4 h-4 ml-2" />
                      הוסף דומיין מותאם
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => router.push(`/customize?siteId=${userSite.id}`)}>
                    <Settings className="w-4 h-4 ml-2" />
                    התאם עיצוב
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                נתוני צפיות
              </CardTitle>
              <CardDescription>
                סטטיסטיקות ומידע על הביקורים באתר שלך
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData.length > 0 ? (
                <div className="h-[350px] relative">
                  {/* כאן יופיע גרף אנליטיקס - לצורך המצגת מוצגת רק הודעה */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-2">{pageTotalViews}</p>
                      <p className="text-gray-500">סך כל הצפיות ב-30 הימים האחרונים</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <BarChart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>אין עדיין נתונים זמינים. הנתונים יופיעו לאחר שהאתר יפורסם ויתחילו לצפות בו.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revisions">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    היסטוריית עדכונים
                  </CardTitle>
                  <CardDescription>
                    עדכונים שביקשת והסטטוס שלהם
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {revisionHistory.length > 0 ? (
                    <div className="space-y-4">
                      {revisionHistory.map((revision) => (
                        <div key={revision.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{new Date(revision.created_at).toLocaleDateString('he-IL')}</h4>
                              <p className="text-sm text-gray-500">
                                {revision.description.substring(0, 100)}
                                {revision.description.length > 100 ? '...' : ''}
                              </p>
                            </div>
                            <div className={cn(
                              "px-2 py-1 rounded-full text-xs",
                              revision.status === "completed" ? "bg-green-100 text-green-800" :
                              revision.status === "pending" ? "bg-amber-100 text-amber-800" :
                              revision.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                              revision.status === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100"
                            )}>
                              {revision.status === "completed" ? "הושלם" :
                               revision.status === "pending" ? "ממתין" :
                               revision.status === "in_progress" ? "בטיפול" :
                               revision.status === "rejected" ? "נדחה" : revision.status}
                            </div>
                          </div>
                          
                          {revision.response && (
                            <div className="mt-3 pt-3 border-t text-sm">
                              <p className="font-medium mb-1">תגובה:</p>
                              <p className="text-gray-600">{revision.response}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
                      <p>אין עדיין היסטוריית עדכונים. בקש את העדכון הראשון שלך מהטופס בצד ימין.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>בקש עדכון</CardTitle>
                  <CardDescription>
                    {revisionsLeft > 0 
                      ? `נותרו לך ${revisionsLeft} עדכונים ללא תשלום`
                      : "כל העדכונים החינמיים נוצלו"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {revisionsLeft > 0 ? (
                    <div className="space-y-4">
                      <p className="text-sm">
                        תאר את השינויים שתרצה לבצע באתר שלך, וצוות העיצוב שלנו יטפל בבקשתך בתוך 24-48 שעות.
                      </p>
                      
                      <textarea 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="תאר את העדכונים שתרצה לבצע..."
                        rows={4}
                      ></textarea>
                      
                      <Button className="w-full">
                        שלח בקשת עדכון
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <p>ניצלת את כל העדכונים החינמיים. ניתן לרכוש עדכון נוסף אחד.</p>
                      </div>
                      
                      <Button className="w-full" onClick={handleBuyRevision}>
                        <PlusCircle className="w-4 h-4 ml-2" />
                        רכוש עדכון נוסף (₪4.99)
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>מה כולל עדכון?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm">שינויי טקסט ותוכן</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm">עדכוני עיצוב ופריסה</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm">הוספת חלקים חדשים לאתר</p>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm">לא כולל החלפת תבנית (נחשב כאתר חדש)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>הגדרות אתר</CardTitle>
                  <CardDescription>
                    שנה את ההגדרות הבסיסיות של האתר שלך
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">שם האתר</Label>
                    <Input 
                      id="site-name" 
                      defaultValue={userSite.site_name || `האתר של ${user.email}`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="site-description">תיאור האתר</Label>
                    <textarea 
                      id="site-description"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      defaultValue={userSite.site_description || ""}
                      rows={3}
                    ></textarea>
                    <p className="text-xs text-gray-500">
                      תיאור זה יופיע במנועי חיפוש ובמטא-תגים של האתר
                    </p>
                  </div>
                  
                  {hasDomain && (
                    <div className="pt-4 border-t">
                      <h3 className="font-medium mb-2">פרטי דומיין</h3>
                      <div className="flex items-center p-3 rounded-md bg-muted">
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{userSite.domain_name}</span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            סטטוס: {domainStatus === "active" ? "פעיל" : 
                                   domainStatus === "pending" ? "בתהליך הפעלה" : "שגיאה"}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          רענן סטטוס
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button>שמור שינויים</Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>הגדרות חשבון</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">כתובת אימייל</Label>
                    <Input 
                      id="user-email" 
                      defaultValue={user.email || ""}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="marketing-emails" />
                      <Label htmlFor="marketing-emails">
                        קבל הודעות עדכון ושיווק מאתנו
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={() => router.push("/dashboard/account")}>
                    נהל חשבון
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>עזרה ותמיכה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    שאלות נפוצות
                  </Link>
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm">
                      צוות התמיכה שלנו זמין בדוא"ל:
                      <a href="mailto:support@cv-site.com" className="block text-primary mt-1">
                        support@cv-site.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ייבוא הנדרשים
import domainService from "@/services/domain-service";
import { Label } from "@/components/ui/label";
```

## 24. דף העלאת CV (Upload CV Page)

```tsx
// file: src/app/upload-cv/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { CVUploader } from "@/components/upload/CVUploader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

export default function UploadCVPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // פונקציה שתופעל לאחר העלאת CV בהצלחה
  const handleUploadSuccess = (cvData: any, cvId: string) => {
    toast({
      title: "CV Uploaded Successfully",
      description: "Your CV has been processed and a website template has been created.",
    });
    
    // הפניה לדף התצוגה המקדימה עם תבנית ברירת מחדל
    router.push(`/preview?cvId=${cvId}&templateId=designer`);
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    router.push("/login?redirectTo=/upload-cv");
    return null;
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">העלאת קורות חיים</h1>
        <Button 
          variant="ghost" 
          onClick={() => router.push("/dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          חזרה לדשבורד
        </Button>
      </div>
      
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            העלאת קובץ
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            יצירה באמצעות צ'אט
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <div className="max-w-xl mx-auto">
            <CVUploader onSuccess={handleUploadSuccess} redirectOnSuccess={true} />
            
            <div className="mt-12 p-6 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-4">פורמטים נתמכים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">PDF</p>
                    <p className="text-sm text-gray-500">עד 5MB</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Word</p>
                    <p className="text-sm text-gray-500">DOCX, DOC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="mt-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="p-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">יצירת אתר באמצעות צ'אט</h3>
              <p className="text-gray-500 mb-6">
                ספר לנו על הניסיון והכישורים שלך, ואנו ניצור עבורך אתר יפה.
              </p>
              <Button onClick={() => router.push("/chat-cv")}>
                התחל שיחה
              </Button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              יעיל במיוחד אם אין לך עדיין קורות חיים מוכנים או אם תרצה חוויה מותאמת אישית יותר.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ייבוא הנדרשים
import { MessageSquare, MessageCircle, FileText } from "lucide-react";
```

## 25. API Route לחילוץ טקסט מ-CV

```typescript
// file: src/app/api/extract-text/route.ts

import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getErrorMessage } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

// במציאות, היינו משתמשים ב-API חיצוני או בספרייה לחילוץ טקסט מקבצים
// לצורך ה-MVP נדמה את התהליך

export async function POST(request: Request) {
  try {
    // וידוא שהסביבה מוגדרת כראוי
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "Server configuration missing" },
        { status: 500 }
      );
    }

    // פענוח הבקשה
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "No file URL provided" },
        { status: 400 }
      );
    }

    // התחברות לסופאבייס
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // נגיש את המידע רק אם הוא שייך למשתמש הנוכחי
    // בדיקה שהקובץ קיים באחסון
    // במציאות, כאן היינו מורידים את הקובץ ומעבדים אותו

    // מאחר שזה MVP, נדמה את החילוץ עם תוכן סטטי
    // במציאות, היינו פונים לשירות עיבוד טקסט כדי לחלץ את התוכן מהקובץ
    const extractedText = `
JOHN DOE
Senior Software Developer

CONTACT
Email: john.doe@example.com
Phone: (123) 456-7890
LinkedIn: linkedin.com/in/johndoe
GitHub: github.com/johndoe

SUMMARY
Experienced full-stack developer with 8+ years of experience building scalable web applications. Proficient in React, Node.js, and cloud technologies. Passionate about clean code and user-centered design.

SKILLS
- Frontend: React, Redux, JavaScript (ES6+), TypeScript, HTML5, CSS3, Sass
- Backend: Node.js, Express, Python, Django, REST API design
- Databases: MongoDB, PostgreSQL, MySQL
- DevOps: Docker, Kubernetes, AWS, CI/CD pipelines
- Tools: Git, JIRA, Webpack, Babel

PROFESSIONAL EXPERIENCE

Senior Software Developer
Tech Solutions Inc. | Jan 2019 - Present
- Architected and developed a microservices-based platform serving 100K+ daily users
- Led a team of 5 developers to rebuild the company's flagship product, resulting in 40% improvement in performance
- Implemented automated testing strategy that reduced bugs in production by 30%
- Mentored junior developers and conducted code reviews

Software Developer
WebApps Co. | Mar 2016 - Dec 2018
- Developed responsive web applications using React and Node.js
- Created RESTful APIs consumed by mobile and web applications
- Optimized database queries, improving response times by 25%
- Participated in Agile development process with two-week sprints

Junior Developer
StartupXYZ | Jun 2014 - Feb 2016
- Built and maintained client-facing websites using JavaScript frameworks
- Collaborated with designers to implement UI/UX improvements
- Assisted in database design and management

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2010 - 2014
- GPA: 3.8/4.0
- Relevant coursework: Data Structures, Algorithms, Database Systems, Web Development

PROJECTS
Personal Portfolio Website
- Designed and developed a responsive personal portfolio using React and Gatsby
- Implemented a headless CMS for content management

E-commerce Platform
- Built a full-stack e-commerce platform with React, Node.js, and MongoDB
- Integrated payment processing and inventory management

LANGUAGES
- English (Native)
- Spanish (Intermediate)
`;

    return NextResponse.json({ text: extractedText });
  } catch (error) {
    console.error("Error extracting text:", error);
    
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
```

## 26. API Route לחילוץ נתונים מטקסט CV

```typescript
// file: src/app/api/extract-cv/route.ts

import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/error-utils";

// במציאות, היינו משתמשים ב-API חיצוני או בספרייה לחילוץ נתונים מקבצים
// לצורך ה-MVP נדמה את התהליך

export async function POST(request: Request) {
  try {
    // פענוח הבקשה
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "No file URL provided" },
        { status: 400 }
      );
    }

    // קריאה לשירות חילוץ טקסט שכבר יצרנו
    const textResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/extract-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fileUrl }),
    });

    if (!textResponse.ok) {
      const error = await textResponse.json();
      throw new Error(error.message || "Failed to extract text");
    }

    const { text } = await textResponse.json();

    // עיבוד הטקסט לחילוץ מידע מובנה
    // במציאות, כאן היינו משתמשים ב-AI או בשירות ייעודי לניתוח קורות חיים
    
    // דוגמה פשוטה לחילוץ מידע בסיסי מקורות חיים - לא אמין לחלוטין במקרה אמיתי
    const cvData = extractDataFromText(text);

    return NextResponse.json({ cvData });
  } catch (error) {
    console.error("Error extracting CV data:", error);
    
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// פונקציית עזר לחילוץ מידע מטקסט של קורות חיים
function extractDataFromText(text: string): any {
  // חילוץ שם
  const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
  const name = nameMatch ? nameMatch[1] : "Guest User";

  // חילוץ תפקיד
  const titleMatch = text.match(/^[A-Z][a-z]+ [A-Z][a-z]+\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : "Professional";

  // חילוץ מידע ליצירת קשר
  const emailMatch = text.match(/Email:\s+(.+@.+\..+)/i);
  const email = emailMatch ? emailMatch[1] : "";

  const phoneMatch = text.match(/Phone:\s+(.+)/i);
  const phone = phoneMatch ? phoneMatch[1] : "";

  // חילוץ תקציר
  const summaryMatch = text.match(/SUMMARY\s+(.+)(?=\n\n)/s);
  const summary = summaryMatch ? summaryMatch[1].trim() : "Professional summary...";

  // חילוץ כישורים
  const skills: string[] = [];
  const skillsSection = text.match(/SKILLS\s+(.+?)(?=\n\n[A-Z])/s);
  
  if (skillsSection) {
    const skillText = skillsSection[1];
    const skillItems = skillText.match(/[-•]\s+(.+)/g);
    
    if (skillItems) {
      skillItems.forEach(item => {
        const skill = item.replace(/[-•]\s+/, "").trim();
        skills.push(skill);
      });
    } else {
      skillText.split(",").forEach(skill => {
        skills.push(skill.trim());
      });
    }
  }

  // חילוץ ניסיון תעסוקתי
  const experience = [];
  const expSection = text.match(/PROFESSIONAL EXPERIENCE\s+(.+?)(?=\n\n[A-Z])/s);
  
  if (expSection) {
    const expText = expSection[1];
    const positionBlocks = expText.split(/\n\n(?=[A-Z])/);
    
    for (const block of positionBlocks) {
      const positionMatch = block.match(/^([^\n]+)\s+([^\n|]+)\s*\|\s*(.+)/);
      
      if (positionMatch) {
        const position = positionMatch[1].trim();
        const company = positionMatch[2].trim();
        const duration = positionMatch[3].trim();
        
        const descItems = block.match(/[-•]\s+(.+)/g);
        let description = "";
        
        if (descItems) {
          description = descItems.map(item => item.replace(/[-•]\s+/, "").trim()).join(". ");
        }
        
        experience.push({
          position,
          company,
          duration,
          description
        });
      }
    }
  }

  // חילוץ השכלה
  const education = [];
  const eduSection = text.match(/EDUCATION\s+(.+?)(?=\n\n[A-Z]|$)/s);
  
  if (eduSection) {
    const eduText = eduSection[1];
    const degreeMatch = eduText.match(/([^\n]+)\s+([^\n|]+)\s*\|\s*(.+)/);
    
    if (degreeMatch) {
      const degree = degreeMatch[1].trim();
      const institution = degreeMatch[2].trim();
      const year = degreeMatch[3].trim();
      
      education.push({
        degree,
        institution,
        year
      });
    }
  }

  return {
    name,
    title,
    email,
    phone,
    summary,
    skills: skills.length > 0 ? skills : ["Professional Skills", "Communication", "Technical Knowledge"],
    experience: experience.length > 0 ? experience : [
      {
        position: "Position Title",
        company: "Company Name",
        duration: "Duration",
        description: "Description of your responsibilities and achievements."
      }
    ],
    education: education.length > 0 ? education : [
      {
        degree: "Degree",
        institution: "University/Institution",
        year: "Years"
      }
    ]
  };
}
```

## 27. עמוד החלפת תבנית (Customize Page)

```tsx
// file: src/app/customize/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { handleError } from "@/lib/error-utils";
import { cn } from "@/lib/utils";
import DatabaseService from "@/services/database-service";
import templateService, { CustomizationOptions } from "@/services/template-service";
import { ArrowLeft, Layout, Palette, Type, Save, Check } from "lucide-react";

const templates = [
  {
    id: "designer",
    name: "Designer",
    description: "Clean, modern design with a creative touch",
    previewUrl: "/templates/designer-preview.jpg"
  },
  {
    id: "developer",
    name: "Developer",
    description: "Technical focused layout with code snippets",
    previewUrl: "/templates/developer-preview.jpg"
  },
  {
    id: "musician",
    name: "Musician",
    description: "Creative layout for artists and performers",
    previewUrl: "/templates/musician-preview.jpg"
  }
];

export default function CustomizePage() {
  const [siteId, setSiteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("template");
  const [selectedTemplate, setSelectedTemplate] = useState("designer");
  const [customization, setCustomization] = useState<CustomizationOptions>({
    primaryColor: "#FF6E35",
    secondaryColor: "#99B3B6",
    backgroundColor: "#FFFFFF",
    textColor: "#4F5D61",
    headingFont: "Geist Sans",
    bodyFont: "Inter",
    layout: "standard",
    spacing: 16,
    borderRadius: 8,
    showSocialIcons: true,
    showContactForm: true,
    showSkillBars: true,
    heroStyle: "centered"
  });

  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // טעינת נתוני אתר
  useEffect(() => {
    const loadSiteData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // קבלת מזהה האתר מפרמטרי ה-URL
        const id = searchParams.get("siteId");
        
        if (!id) {
          // בדיקה אם למשתמש יש אתר קיים
          const userSite = await DatabaseService.getUserSite(user.id);
          
          if (userSite) {
            setSiteId(userSite.id);
            if (userSite.template_id) {
              setSelectedTemplate(userSite.template_id);
            }
            
            // טעינת הגדרות התאמה אישית
            const customStyles = await templateService.getCustomization(userSite.id);
            if (customStyles) {
              setCustomization(prev => ({ ...prev, ...customStyles }));
            }
          } else {
            // אם למשתמש אין אתר, הפניה ליצירת אתר
            router.push("/upload-cv");
            return;
          }
        } else {
          setSiteId(id);
          
          // טעינת נתוני האתר
          const siteData = await DatabaseService.getUserSite(user.id);
          
          if (siteData && siteData.id === id) {
            if (siteData.template_id) {
              setSelectedTemplate(siteData.template_id);
            }
            
            // טעינת הגדרות התאמה אישית
            const customStyles = await templateService.getCustomization(id);
            if (customStyles) {
              setCustomization(prev => ({ ...prev, ...customStyles }));
            }
          } else {
            // אם האתר לא שייך למשתמש, הפניה לדשבורד
            toast({
              title: "Access denied",
              description: "You don't have permission to customize this site",
              variant: "destructive",
            });
            router.push("/dashboard");
            return;
          }
        }
      } catch (error) {
        handleError(error, {
          context: { method: "loadSiteData" }
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSiteData();
  }, [user, router, searchParams]);

  // שמירת השינויים
  const handleSave = async () => {
    if (!user || !siteId) return;
    
    try {
      setIsSaving(true);
      
      // שמירת התבנית שנבחרה
      await DatabaseService.updateSite(siteId, {
        template_id: selectedTemplate,
        updated_at: new Date().toISOString()
      });
      
      // שמירת הגדרות התאמה אישית
      await templateService.saveCustomization(siteId, customization);
      
      setSaveSuccess(true);
      
      toast({
        title: "Changes saved",
        description: "Your customization settings have been saved successfully",
      });
      
      // איפוס אינדיקטור ההצלחה אחרי 2 שניות
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
    } catch (error) {
      handleError(error, {
        context: { method: "handleSave" }
      });
    } finally {
      setIsSaving(false);
    }
  };

  // טיפול בשינויי קלט
  const handleInputChange = (name: keyof CustomizationOptions, value: any) => {
    setCustomization(prev => ({ ...prev, [name]: value }));
  };

  // טיפול בשינוי צבע
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleInputChange(name as keyof CustomizationOptions, value);
  };

  // טיפול בשינוי מתג
  const handleSwitchChange = (name: keyof CustomizationOptions, checked: boolean) => {
    handleInputChange(name, checked);
  };

  // תצוגת טעינה
  if (isLoading) {
    return (
      <div className="container py-12 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>טוען...</p>
      </div>
    );
  }

  // וידוא התחברות משתמש
  if (!user) {
    router.push("/login?redirectTo=/customize");
    return null;
  }

  return (
    <div className="container max-w-7xl py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">התאמת אתר</h1>
          <p className="text-gray-500">התאם את האתר שלך לצרכיך</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            חזרה לדשבורד
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push(`/preview?siteId=${siteId}`)}
          >
            תצוגה מקדימה
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[100px]"
          >
            {isSaving ? "שומר..." : saveSuccess ? (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                נשמר
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Save className="w-4 h-4" />
                שמור
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-gray-100 border rounded-lg aspect-video overflow-hidden relative">
            <Image
              src={`/templates/${selectedTemplate}-preview.jpg
              המשך פיתוח עמוד התאמת האתר (Customize Page):

```tsx
              src={`/templates/${selectedTemplate}-preview.jpg`}
              alt="Template preview"
              fill
              className="object-cover"
            />
          </div>
          
          <Tabs defaultValue="template" value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="template" className="flex items-center gap-2">
                <Layout className="w-4 h-4" />
                תבניות
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                צבעים
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                טיפוגרפיה
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="pt-4">
              <h3 className="text-lg font-medium mb-4">בחר תבנית</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map(template => (
                  <Card 
                    key={template.id} 
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary",
                      selectedTemplate === template.id && "border-primary"
                    )}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardHeader className="p-3 pb-2">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="aspect-video relative overflow-hidden rounded-md border mb-2">
                        <Image
                          src={template.previewUrl}
                          alt={`${template.name} template`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <h3 className="text-lg font-medium mt-8 mb-4">פריסה</h3>
              <RadioGroup 
                value={customization.layout || "standard"}
                onValueChange={(value) => handleInputChange("layout", value)}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div>
                  <RadioGroupItem value="standard" id="layout-standard" className="peer sr-only" />
                  <Label
                    htmlFor="layout-standard"
                    className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer peer-data-[state=checked]:border-primary hover:border-primary/50 transition-colors"
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-md overflow-hidden relative">
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/8 bg-gray-200"></div>
                      <div className="absolute top-1/3 left-1/4 w-1/2 h-1/8 bg-gray-200"></div>
                      <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/3 bg-gray-200"></div>
                    </div>
                    <span>רגיל</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="compact" id="layout-compact" className="peer sr-only" />
                  <Label
                    htmlFor="layout-compact"
                    className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer peer-data-[state=checked]:border-primary hover:border-primary/50 transition-colors"
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-md overflow-hidden relative">
                      <div className="absolute top-1/5 left-1/4 w-1/2 h-1/10 bg-gray-200"></div>
                      <div className="absolute top-1/3 left-1/4 w-1/2 h-1/10 bg-gray-200"></div>
                      <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/4 bg-gray-200"></div>
                    </div>
                    <span>קומפקטי</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="spacious" id="layout-spacious" className="peer sr-only" />
                  <Label
                    htmlFor="layout-spacious"
                    className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer peer-data-[state=checked]:border-primary hover:border-primary/50 transition-colors"
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-md overflow-hidden relative">
                      <div className="absolute top-1/6 left-1/4 w-1/2 h-1/6 bg-gray-200"></div>
                      <div className="absolute top-2/5 left-1/4 w-1/2 h-1/6 bg-gray-200"></div>
                      <div className="absolute bottom-1/6 left-1/4 w-1/2 h-1/6 bg-gray-200"></div>
                    </div>
                    <span>מרווח</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="minimal" id="layout-minimal" className="peer sr-only" />
                  <Label
                    htmlFor="layout-minimal"
                    className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer peer-data-[state=checked]:border-primary hover:border-primary/50 transition-colors"
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-md overflow-hidden relative">
                      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/10 bg-gray-200"></div>
                      <div className="absolute bottom-1/3 left-1/4 w-1/2 h-1/3 bg-gray-200"></div>
                    </div>
                    <span>מינימליסטי</span>
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="flex items-center gap-4 mt-8">
                <Label htmlFor="spacing-slider" className="min-w-24">מרווח:</Label>
                <Slider
                  id="spacing-slider"
                  min={8}
                  max={32}
                  step={4}
                  value={[customization.spacing || 16]}
                  onValueChange={(value) => handleInputChange("spacing", value[0])}
                  className="w-full max-w-sm"
                />
                <span className="text-sm">{customization.spacing}px</span>
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <Label htmlFor="radius-slider" className="min-w-24">רדיוס פינות:</Label>
                <Slider
                  id="radius-slider"
                  min={0}
                  max={16}
                  step={2}
                  value={[customization.borderRadius || 8]}
                  onValueChange={(value) => handleInputChange("borderRadius", value[0])}
                  className="w-full max-w-sm"
                />
                <span className="text-sm">{customization.borderRadius}px</span>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-medium mb-4">אלמנטים</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showSocialIcons">אייקונים חברתיים</Label>
                  <Switch
                    id="showSocialIcons"
                    checked={customization.showSocialIcons}
                    onCheckedChange={(checked) => handleSwitchChange("showSocialIcons", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showContactForm">טופס יצירת קשר</Label>
                  <Switch
                    id="showContactForm"
                    checked={customization.showContactForm}
                    onCheckedChange={(checked) => handleSwitchChange("showContactForm", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="showSkillBars">מדדי כישורים</Label>
                  <Switch
                    id="showSkillBars"
                    checked={customization.showSkillBars}
                    onCheckedChange={(checked) => handleSwitchChange("showSkillBars", checked)}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="colors" className="pt-4">
              <h3 className="text-lg font-medium mb-4">ערכת צבעים</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">צבע ראשי</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border" 
                        style={{ backgroundColor: customization.primaryColor }}
                      ></div>
                      <Input
                        id="primaryColor"
                        name="primaryColor"
                        type="color"
                        value={customization.primaryColor}
                        onChange={handleColorChange}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={customization.primaryColor}
                        onChange={handleColorChange}
                        name="primaryColor"
                        className="w-28"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">צבע משני</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border" 
                        style={{ backgroundColor: customization.secondaryColor }}
                      ></div>
                      <Input
                        id="secondaryColor"
                        name="secondaryColor"
                        type="color"
                        value={customization.secondaryColor}
                        onChange={handleColorChange}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={customization.secondaryColor}
                        onChange={handleColorChange}
                        name="secondaryColor"
                        className="w-28"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">צבע רקע</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border" 
                        style={{ backgroundColor: customization.backgroundColor }}
                      ></div>
                      <Input
                        id="backgroundColor"
                        name="backgroundColor"
                        type="color"
                        value={customization.backgroundColor}
                        onChange={handleColorChange}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={customization.backgroundColor}
                        onChange={handleColorChange}
                        name="backgroundColor"
                        className="w-28"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="textColor">צבע טקסט</Label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded border" 
                        style={{ backgroundColor: customization.textColor }}
                      ></div>
                      <Input
                        id="textColor"
                        name="textColor"
                        type="color"
                        value={customization.textColor}
                        onChange={handleColorChange}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={customization.textColor}
                        onChange={handleColorChange}
                        name="textColor"
                        className="w-28"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-8 mb-4">סגנון כותרת ראשית</h3>
              <RadioGroup 
                value={customization.heroStyle || "centered"}
                onValueChange={(value) => handleInputChange("heroStyle", value)}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem value="centered" id="hero-centered" className="peer sr-only" />
                  <Label
                    htmlFor="hero-centered"
                    className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer peer-data-[state=checked]:border-primary hover:border-primary/50 transition-colors"
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-md overflow-hidden relative">
                      <div className="absolute top-1/3 left-1/4 w-1/2 h-1/6 bg-gray-300 mx-auto"></div>
                      <div className="absolute top-1/2 left-1/3 w-1/3 h-1/8 bg-gray-200 mx-auto"></div>
                    </div>
                    <span>ממורכז</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="left-aligned" id="hero-left" className="peer sr-only" />
                  <Label
                    htmlFor="hero-left"
                    className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer peer-data-[state=checked]:border-primary hover:border-primary/50 transition-colors"
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-md overflow-hidden relative">
                      <div className="absolute top-1/3 left-1/6 w-1/2 h-1/6 bg-gray-300"></div>
                      <div className="absolute top-1/2 left-1/6 w-1/3 h-1/8 bg-gray-200"></div>
                    </div>
                    <span>מיושר לשמאל</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem value="overlay" id="hero-overlay" className="peer sr-only" />
                  <Label
                    htmlFor="hero-overlay"
                    className="flex flex-col items-center gap-2 border rounded-md p-4 cursor-pointer peer-data-[state=checked]:border-primary hover:border-primary/50 transition-colors"
                  >
                    <div className="w-full h-20 bg-gray-600 rounded-md overflow-hidden relative">
                      <div className="absolute top-1/3 left-1/4 w-1/2 h-1/6 bg-white mx-auto"></div>
                      <div className="absolute top-1/2 left-1/3 w-1/3 h-1/8 bg-gray-300 mx-auto"></div>
                    </div>
                    <span>כיסוי תמונה</span>
                  </Label>
                </div>
              </RadioGroup>
            </TabsContent>
            
            <TabsContent value="typography" className="pt-4">
              <h3 className="text-lg font-medium mb-4">פונטים</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="headingFont">פונט כותרות</Label>
                  <select
                    id="headingFont"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={customization.headingFont}
                    onChange={(e) => handleInputChange("headingFont", e.target.value)}
                  >
                    <option value="Geist Sans">Geist Sans</option>
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Playfair Display">Playfair Display</option>
                  </select>
                  <div 
                    className="mt-2 p-3 border rounded-md"
                    style={{ fontFamily: customization.headingFont }}
                  >
                    <p className="text-xl font-semibold">אבגדהוזחט 0123456789 ABCDEFGHIJK</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bodyFont">פונט טקסט</Label>
                  <select
                    id="bodyFont"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={customization.bodyFont}
                    onChange={(e) => handleInputChange("bodyFont", e.target.value)}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Source Sans Pro">Source Sans Pro</option>
                    <option value="Lora">Lora</option>
                  </select>
                  <div 
                    className="mt-2 p-3 border rounded-md"
                    style={{ fontFamily: customization.bodyFont }}
                  >
                    <p>לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>תצוגה מקדימה בזמן אמת</CardTitle>
              <CardDescription>צפה בשינויים שלך בזמן אמת</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-[9/16] relative bg-gray-50 border-t">
                <div className="absolute inset-0 flex items-center justify-center flex-col text-center p-6">
                  <p className="text-sm text-gray-500 mb-4">
                    לחץ על כפתור התצוגה המקדימה לצפייה בגרסה מלאה
                  </p>
                  <Button 
                    onClick={() => router.push(`/preview?siteId=${siteId}`)}
                    variant="outline"
                    size="sm"
                  >
                    פתח תצוגה מקדימה
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>התאמת תוכן</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-500">
                לצורך עריכת התוכן של האתר שלך, השתמש באחד מהעדכונים החינמיים שלך או עבור לדף העריכה.
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => router.push("/dashboard?tab=revisions")}
              >
                בקש עדכון תוכן
              </Button>
              <Button className="w-full mt-2">
                ערוך תוכן
              </Button>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>דומיין מותאם אישית</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-500">
                האתר שלך זמין בכתובת ברירת המחדל, אך תוכל להוסיף דומיין אישי.
              </p>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => router.push(`/checkout?siteId=${siteId}&domain=true`)}
              >
                הוסף דומיין
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

## 28. פונקציה נוספת לשירות הנתונים לעדכון אתר

```typescript
// הוספה לקובץ src/services/database-service.ts

/**
 * עדכון פרטי אתר
 */
static async updateSite(
  siteId: string, 
  updates: Partial<Database["public"]["Tables"]["sites"]["Update"]>
): Promise<boolean> {
  try {
    const supabase = this.getClient();
    const { error } = await supabase
      .from("sites")
      .update(updates)
      .eq("id", siteId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    handleError(error, { 
      context: { method: "updateSite", siteId, updates }
    });
    return false;
  }
}
```
# המלצות לחיזוק ה-Backend של האפליקציה

להלן המלצות מקיפות לחיזוק וייצוב שכבת ה-Backend של אפליקציית CV-to-Website:

## 1. אבטחה והרשאות

### שיפור מערכת ההרשאות ב-Supabase
- יישם Row Level Security (RLS) מחמיר יותר לכל הטבלאות, כולל בדיקה כפולה של זהות משתמש וקשרים בין טבלאות
- הוסף פוליסות RLS להגנה מפני CSRF ו-XSS
- הקפד על הפרדה ברורה בין הרשאות לקריאה והרשאות לכתיבה

```sql
-- דוגמה לפוליסת RLS משופרת לטבלת sites
CREATE POLICY "sites_read_policy" ON sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sites_insert_policy" ON sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sites_update_policy" ON sites
  FOR UPDATE USING (auth.uid() = user_id);

-- הוספת פוליסה להגנה מפני CSRF
CREATE POLICY "sites_csrf_policy" ON sites
  USING (request.header('X-CSRF-Token') IS NOT NULL);
```

## 2. סניטציה והגנה על קלט

### חיזוק בדיקות תקינות וסניטציה
- הוסף סניטציה לכל קלט משתמש גם בצד השרת, גם אם קיימת בדיקה בצד הלקוח
- השתמש ב-middleware מיוחד לסניטציה של פרמטרי URL ותוכן בקשות

```typescript
// file: src/middleware/input-sanitizer.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sanitizeInput } from "@/lib/security-utils";

export function sanitizeMiddleware(request: NextRequest) {
  // סניטציה של query params
  const url = new URL(request.url);
  const sanitizedParams = new URLSearchParams();
  
  url.searchParams.forEach((value, key) => {
    sanitizedParams.append(key, sanitizeInput(value));
  });
  
  // החלפת הפרמטרים המקוריים בפרמטרים המחוטאים
  url.search = sanitizedParams.toString();
  
  // המשך הטיפול בבקשה עם הפרמטרים המחוטאים
  const response = NextResponse.next({
    request: {
      ...request,
      url: url.toString(),
    },
  });
  
  return response;
}
```

## 3. אופטימיזציה ומטמון

### הוספת מטמון (Caching)
- הוסף שכבת מטמון לשאילתות נפוצות כדי להקטין את העומס על בסיס הנתונים
- השתמש ב-Redis או Memcached לשמירת נתונים בין דפים שונים ובין בקשות

```typescript
// file: src/services/cache-service.ts

import { Redis } from "@upstash/redis";
import { handleError } from "@/lib/error-utils";

class CacheService {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis({
      url: process.env.REDIS_URL || "",
      token: process.env.REDIS_TOKEN || "",
    });
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redis.get(key);
      return data as T;
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        context: { method: "cache.get", key } 
      });
      return null;
    }
  }
  
  async set(key: string, value: any, expirationSeconds = 3600): Promise<boolean> {
    try {
      await this.redis.set(key, value, { ex: expirationSeconds });
      return true;
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        context: { method: "cache.set", key } 
      });
      return false;
    }
  }
  
  async delete(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      handleError(error, { 
        showToast: false, 
        context: { method: "cache.delete", key } 
      });
      return false;
    }
  }
}

export default new CacheService();
```

## 4. מערכת תורים ועבודות רקע

### הוספת מערכת עבודות רקע
- השתמש ב-Bull או Celery להפעלת עבודות רקע עבור משימות ארוכות-טווח כמו עיבוד CV ופריסת אתרים
- הפרד את המשימות הכבדות מהמשימות הקלות לשיפור ביצועים

```typescript
// file: src/services/queue-service.ts

import Queue from "bull";
import { handleError } from "@/lib/error-utils";

// הגדרת תורים שונים למשימות שונות
const deploymentQueue = new Queue("site-deployments", process.env.REDIS_URL || "");
const cvProcessingQueue = new Queue("cv-processing", process.env.REDIS_URL || "");
const emailQueue = new Queue("email-notifications", process.env.REDIS_URL || "");

// מעבד למשימות פריסת אתר
deploymentQueue.process(async (job) => {
  const { siteId, templateId, userId } = job.data;
  
  try {
    // קוד לפריסת האתר
    console.log(`Processing deployment for site ${siteId}`);
    
    // עדכון סטטוס בבסיס הנתונים
    // ...
    
    return { success: true, url: `https://${job.id}.vercel.app` };
  } catch (error) {
    handleError(error, {
      context: { method: "deploymentQueue.process", jobId: job.id, siteId }
    });
    throw error;
  }
});

// מעבד למשימות עיבוד CV
cvProcessingQueue.process(async (job) => {
  const { fileUrl, userId } = job.data;
  
  try {
    // קוד לעיבוד CV
    console.log(`Processing CV from ${fileUrl}`);
    
    // ...
    
    return { success: true, data: { /* ... */ } };
  } catch (error) {
    handleError(error, {
      context: { method: "cvProcessingQueue.process", jobId: job.id, fileUrl }
    });
    throw error;
  }
});

// יצוא של פונקציות להוספת משימות לתור
export const queueDeployment = async (data: any) => {
  try {
    const job = await deploymentQueue.add(data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000
      }
    });
    
    return { jobId: job.id };
  } catch (error) {
    handleError(error, {
      context: { method: "queueDeployment", data }
    });
    throw error;
  }
};

export const queueCVProcessing = async (data: any) => {
  try {
    const job = await cvProcessingQueue.add(data, {
      attempts: 2,
      backoff: {
        type: "fixed",
        delay: 3000
      }
    });
    
    return { jobId: job.id };
  } catch (error) {
    handleError(error, {
      context: { method: "queueCVProcessing", data }
    });
    throw error;
  }
};

export const queueEmail = async (data: any) => {
  try {
    const job = await emailQueue.add(data, {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 2000
      }
    });
    
    return { jobId: job.id };
  } catch (error) {
    handleError(error, {
      context: { method: "queueEmail", data }
    });
    throw error;
  }
};
```

## 5. לוגים וניטור

### שיפור מערכת לוגים וניטור
- הוסף מערכת לוגים מקיפה עם רמות חומרה שונות (Sentry, LogRocket)
- הוסף מטריקות ביצועים לניטור משאבים וזמני תגובה

```typescript
// file: src/lib/monitoring.ts

import * as Sentry from "@sentry/nextjs";
import { ProfilingIntegration } from "@sentry/profiling-node";

// הגדרת סנטרי עם פרופיילינג
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 0.2,
  profilesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});

// פונקציה מרכזית ללוגים מתקדמים
export function logActivity(
  action: string, 
  data: any, 
  level: "info" | "warning" | "error" = "info",
  userId?: string
) {
  // חתימת זמן מדויקת
  const timestamp = new Date().toISOString();
  
  // הכנת אובייקט הלוג
  const logEntry = {
    action,
    timestamp,
    level,
    userId,
    ...data
  };
  
  // שליחה לקונסול בסביבת פיתוח
  if (process.env.NODE_ENV === "development") {
    console[level](JSON.stringify(logEntry, null, 2));
  }
  
  // שליחה לסנטרי
  if (level === "error") {
    Sentry.captureException(new Error(`Error in ${action}`), {
      extra: data,
      user: userId ? { id: userId } : undefined,
    });
  } else {
    Sentry.addBreadcrumb({
      category: "action",
      message: action,
      level: level === "warning" ? Sentry.Severity.Warning : Sentry.Severity.Info,
      data
    });
  }
  
  // [אופציונלי] שליחה למסד נתונים או שירות לוגים חיצוני
}

// פונקציית מדידת ביצועים
export function measurePerformance<T>(
  operationName: string, 
  operation: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  return operation()
    .then(result => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // תיעוד זמן הביצוע
      Sentry.captureMessage(`Performance: ${operationName}`, {
        level: "info",
        extra: { duration, operationName }
      });
      
      return result;
    })
    .catch(error => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // תיעוד שגיאה בביצוע
      Sentry.captureException(error, {
        extra: { duration, operationName }
      });
      
      throw error;
    });
}
```

## 6. ניהול טרנזקציות

### הוספת תמיכה בטרנזקציות בסיס נתונים
- הוסף מערכת ניהול טרנזקציות לפעולות המשנות מספר טבלאות
- הקפד על החזרת מערכת למצב יציב במקרה של שגיאה

```typescript
// file: src/services/transaction-service.ts

import { createServerComponentClient, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";

interface TransactionOperations {
  [key: string]: (supabase: any, data: any) => Promise<any>;
}

class TransactionService {
  // ביצוע פעולות מרובות בטרנזקציה אחת
  async executeTransaction(
    operations: TransactionOperations,
    data: any,
    options: { clientSide?: boolean } = {}
  ): Promise<{ success: boolean; results?: any; error?: any }> {
    // התחברות לסופאבייס בהתאם לסביבה
    const supabase = options.clientSide 
      ? createClientComponentClient<Database>()
      : createServerComponentClient<Database>({ cookies });
    
    try {
      // התחלת טרנזקציה
      // הערה: סופאבייס אינו תומך מלא ב-transactions, אז אנחנו מריצים בקשות ברצף
      // ושומרים תיעוד לצורך אפשרות ביטול
      const operationLog: Array<{ name: string; result: any }> = [];
      const results: { [key: string]: any } = {};
      
      for (const [opName, operation] of Object.entries(operations)) {
        try {
          const result = await operation(supabase, data);
          operationLog.push({ name: opName, result });
          results[opName] = result;
        } catch (error) {
          // שגיאה בפעולה - ביטול כל מה שכבר בוצע
          await this.rollback(supabase, operationLog, data);
          
          throw error;
        }
      }
      
      return { success: true, results };
    } catch (error) {
      handleError(error, {
        context: { 
          method: "executeTransaction",
          operationKeys: Object.keys(operations)
        }
      });
      
      return { success: false, error };
    }
  }
  
  // ביטול פעולות שבוצעו בטרנזקציה שנכשלה
  private async rollback(
    supabase: any,
    operationLog: Array<{ name: string; result: any }>,
    data: any
  ): Promise<void> {
    // ביצוע פעולות ביטול בסדר הפוך
    for (let i = operationLog.length - 1; i >= 0; i--) {
      const { name, result } = operationLog[i];
      
      // הפעלת פעולת ביטול בהתאם לסוג הפעולה
      if (name.startsWith("create") || name.startsWith("insert")) {
        // מחיקת רשומה שנוצרה
        const tableName = this.getTableNameFromOperation(name);
        if (tableName && result.data?.[0]?.id) {
          await supabase.from(tableName).delete().eq("id", result.data[0].id);
        }
      }
      else if (name.startsWith("update")) {
        // שחזור מצב קודם, אם נשמר
        const tableName = this.getTableNameFromOperation(name);
        const prevData = data[`prev_${name}`];
        
        if (tableName && prevData && prevData.id) {
          await supabase.from(tableName)
            .update(prevData)
            .eq("id", prevData.id);
        }
      }
      
      // פעולות מחיקה בד"כ לא דורשות biטול
    }
  }
  
  // חילוץ שם טבלה מתוך שם פעולה (לדוגמה: createUser -> users)
  private getTableNameFromOperation(operation: string): string | null {
    const opParts = operation.split(/(?=[A-Z])/);
    
    if (opParts.length < 2) return null;
    
    // הפיכת שם פעולה לשם טבלה: createUser -> users, updateSiteSettings -> site_settings
    let tableName = "";
    
    // דילוג על החלק הראשון (create/update/delete וכו')
    for (let i = 1; i < opParts.length; i++) {
      if (tableName) tableName += "_";
      tableName += opParts[i].toLowerCase();
    }
    
    // הוספת s בסוף אם לא קיים
    if (!tableName.endsWith("s")) {
      tableName += "s";
    }
    
    return tableName;
  }
}

export default new TransactionService();
```

## 7. מערכת רישיונות פרימיום

### מערכת ניהול תכונות פרימיום
- הוסף מנגנון Feature Flags להפעלה/כיבוי של תכונות מתקדמות
- בנה מערכת ניהול הרשאות לחבילות שונות (בסיסי, פרימיום, וכו')

```typescript
// file: src/services/feature-service.ts

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";
import cacheService from "./cache-service";

// הגדרת תכונות אפשריות במערכת
export enum Feature {
  BASIC_SITE = "basic_site",
  PREMIUM_TEMPLATE = "premium_template",
  CUSTOM_DOMAIN = "custom_domain",
  ANALYTICS = "analytics",
  EXTRA_REVISION = "extra_revision",
  SEO_TOOLS = "seo_tools",
  CONTACT_FORM = "contact_form",
  SOCIAL_MEDIA = "social_media",
  PORTFOLIO = "portfolio",
}

// הגדרת חבילות וכלולות בהן
export const FeaturePackages = {
  FREE: [
    Feature.BASIC_SITE
  ],
  BASIC: [
    Feature.BASIC_SITE,
    Feature.CONTACT_FORM,
    Feature.SOCIAL_MEDIA
  ],
  PREMIUM: [
    Feature.BASIC_SITE,
    Feature.PREMIUM_TEMPLATE,
    Feature.CUSTOM_DOMAIN,
    Feature.ANALYTICS,
    Feature.CONTACT_FORM,
    Feature.SOCIAL_MEDIA,
    Feature.PORTFOLIO
  ]
};

class FeatureService {
  private supabase = createClientComponentClient<Database>();

  /**
   * בדיקה אם למשתמש יש גישה לתכונה מסוימת
   */
  async hasFeatureAccess(userId: string, feature: Feature): Promise<boolean> {
    try {
      // בדיקה במטמון תחילה
      const cacheKey = `feature:${userId}:${feature}`;
      const cachedResult = await cacheService.get<boolean>(cacheKey);
      
      if (cachedResult !== null) {
        return cachedResult;
      }
      
      // קריאה לבסיס הנתונים
      const { data: profile, error } = await this.supabase
        .from("profiles")
        .select("subscription_tier, features")
        .eq("id", userId)
        .single();
        
      if (error) throw error;
      
      // בדיקת הרשאה
      let hasAccess = false;
      
      if (profile.features && profile.features[feature] === true) {
        // תכונה ספציפית מופעלת ישירות
        hasAccess = true;
      } else if (profile.subscription_tier) {
        // בדיקה לפי חבילה
        const tierFeatures = FeaturePackages[profile.subscription_tier as keyof typeof FeaturePackages];
        hasAccess = tierFeatures?.includes(feature) || false;
      }
      
      // שמירה במטמון למשך שעה
      await cacheService.set(cacheKey, hasAccess, 3600);
      
      return hasAccess;
    } catch (error) {
      handleError(error, {
        showToast: false,
        context: { method: "hasFeatureAccess", userId, feature }
      });
      
      // במקרה של שגיאה, נחזיר false כברירת מחדל
      return false;
    }
  }

  /**
   * הפעלת תכונה ספציפית למשתמש
   */
  async enableFeature(userId: string, feature: Feature): Promise<boolean> {
    try {
      // קריאה לנתונים קיימים
      const { data: profile, error } = await this.supabase
        .from("profiles")
        .select("features")
        .eq("id", userId)
        .single();
        
      if (error) throw error;
      
      // עדכון הנתונים
      const features = profile.features || {};
      features[feature] = true;
      
      const { error: updateError } = await this.supabase
        .from("profiles")
        .update({ 
          features,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
        
      if (updateError) throw updateError;
      
      // ניקוי מטמון
      await cacheService.delete(`feature:${userId}:${feature}`);
      
      return true;
    } catch (error) {
      handleError(error, {
        context: { method: "enableFeature", userId, feature }
      });
      
      return false;
    }
  }

  /**
   * ביטול תכונה ספציפית למשתמש
   */
  async disableFeature(userId: string, feature: Feature): Promise<boolean> {
    try {
      // קריאה לנתונים קיימים
      const { data: profile, error } = await this.supabase
        .from("profiles")
        .select("features")
        .eq("id", userId)
        .single();
        
      if (error) throw error;
      
      // עדכון הנתונים
      const features = profile.features || {};
      features[feature] = false;
      
      const { error: updateError } = await this.supabase
        .from("profiles")
        .update({ 
          features,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
        
      if (updateError) throw updateError;
      
      // ניקוי מטמון
      await cacheService.delete(`feature:${userId}:${feature}`);
      
      return true;
    } catch (error) {
      handleError(error, {
        context: { method: "disableFeature", userId, feature }
      });
      
      return false;
    }
  }

  /**
   * שדרוג לחבילה
   */
  async upgradeSubscription(userId: string, tier: keyof typeof FeaturePackages): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("profiles")
        .update({ 
          subscription_tier: tier,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);
        
      if (error) throw error;
      
      // ניקוי כל המטמון של התכונות
      for (const feature of Object.values(Feature)) {
        await cacheService.delete(`feature:${userId}:${feature}`);
      }
      
      return true;
    } catch (error) {
      handleError(error, {
        context: { method: "upgradeSubscription", userId, tier }
      });
      
      return false;
    }
  }
}

export default new FeatureService();
```

## 8. גיבוי ושחזור נתונים

### הוספת מנגנון גיבוי אוטומטי
- הוסף גיבוי יומי של נתוני משתמשים וקבצים קריטיים
- פתח מנגנון שחזור נתונים למקרה של אובדן

```typescript
// file: src/services/backup-service.ts

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { handleError } from "@/lib/error-utils";
import type { Database } from "@/types/database.types";
import { logActivity } from "@/lib/monitoring";

class BackupService {
  private s3Client: S3Client;
  private backupBucket: string;
  
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
    
    this.backupBucket = process.env.BACKUP_BUCKET_NAME || "cv-site-backups";
  }
  
  /**
   * גיבוי כל הנתונים והקבצים
   */
  async backupAll(): Promise<boolean> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const supabase = createServerComponentClient<Database>({ cookies });
      
      // גיבוי טבלאות
      const tables = [
        "profiles", 
        "sites", 
        "revisions", 
        "domains", 
        "deployments", 
        "payments", 
        "analytics"
      ];
      
      for (const table of tables) {
        // שליפת כל הנתונים מהטבלה
        const { data, error } = await supabase.from(table).select("*");
        
        if (error) {
          logActivity(`Backup failed for table ${table}`, { error }, "error");
          continue;
        }
        
        // שמירת הנתונים ב-S3
        await this.s3Client.send(new PutObjectCommand({
          Bucket: this.backupBucket,
          Key: `${timestamp}/tables/${table}.json`,
          Body: JSON.stringify(data, null, 2),
          ContentType: "application/json",
        }));
        
        logActivity(`Backed up table ${table}`, { rowCount: data.length }, "info");
      }
      
      // גיבוי קבצים (לדוגמה: קורות חיים)
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        throw bucketsError;
      }
      
      for (const bucket of buckets) {
        // קבלת רשימת כל הקבצים בבאקט
        const { data: files, error: filesError } = await supabase.storage.from(bucket.name).list();
        
        if (filesError) {
          logActivity(`Failed to list files in bucket ${bucket.name}`, { error: filesError }, "error");
          continue;
        }
        
        for (const file of files) {
          // הורדת הקובץ
          const { data: fileData, error: fileError } = await supabase.storage
            .from(bucket.name)
            .download(`${file.name}`);
            
          if (fileError || !fileData) {
            logActivity(
              `Failed to download file ${file.name} from bucket ${bucket.name}`, 
              { error: fileError }, 
              "error"
            );
            continue;
          }
          
          // המרת הקובץ לבאפר
          const arrayBuffer = await fileData.arrayBuffer();
          
          // העלאת הקובץ לבאקט הגיבוי
          await this.s3Client.send(new PutObjectCommand({
            Bucket: this.backupBucket,
            Key: `${timestamp}/files/${bucket.name}/${file.name}`,
            Body: Buffer.from(arrayBuffer),
            ContentType: fileData.type,
          }));
          
          logActivity(
            `Backed up file ${file.name} from bucket ${bucket.name}`, 
            { size: fileData.size }, 
            "info"
          );
        }
      }
      
      logActivity("Full backup completed", { timestamp }, "info");
      
      return true;
    } catch (error) {
      handleError(error, {
        context: { method: "backupAll" }
      });
      
      logActivity("Full backup failed", { error }, "error");
      
      return false;
    }
  }
  
  /**
   * שחזור נתונים מגיבוי
   */
  async restoreFromBackup(backupTimestamp: string): Promise<boolean> {
    // יש להטמיע קוד שחזור כאן
    // ...
    
    return true;
  }
}

export default new BackupService();
```

## 9. מערכת פרופיילינג וביצועים

### הוספת פרופיילינג ומעקב ביצועים
- הוסף פרופיילינג לפונקציות קריטיות לזיהוי צווארי בקבוק
- מדוד זמני תגובה ובנה dashboard ביצועים

```typescript
// file: src/lib/performance-profiler.ts

import { logActivity } from "@/lib/monitoring";

// ממשק להגדרת פרופיילר
interface ProfilerOptions {
  name: string;
  threshold?: number; // סף בעייתיות במילישניות
  logLevel?: "debug" | "info" | "warning";
  userId?: string;
}

// רשימת פעולות שאנחנו רוצים למדוד
export enum ProfileableOperation {
  CV_UPLOAD = "cv_upload",
  CV_PARSING = "cv_parsing",
  TEMPLATE_RENDERING = "template_rendering",
  SITE_DEPLOYMENT = "site_deployment",
  DATABASE_QUERY = "database_query",
  PAYMENT_PROCESSING = "payment_processing",
  API_REQUEST = "api_request",
}

// מטמון גלובלי לסטטיסטיקות ביצועים
const performanceStats: Record<string, {
  count: number;
  totalTime: number;
  minTime: number;
  maxTime: number;
  lastTimestamp: number;
}> = {};

// פונקציית עטיפה למדידת ביצועים
export function profileOperation<T>(
  operation: ProfileableOperation,
  options: ProfilerOptions,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  return fn()
    .then(result => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // עדכון סטטיסטיקות
      if (!performanceStats[operation]) {
        performanceStats[operation] = {
          count: 0,
          totalTime: 0,
          minTime: duration,
          maxTime: duration,
          lastTimestamp: Date.now()
        };
      } else {
        const stats = performanceStats[operation];
        stats.count += 1;
        stats.totalTime += duration;
        stats.minTime = Math.min(stats.minTime, duration);
        stats.maxTime = Math.max(stats.maxTime, duration);
        stats.lastTimestamp = Date.now();
      }
      
      // רישום לוג אם הביצועים מעל הסף
      const threshold = options.threshold || 1000; // ברירת מחדל: 1 שנייה
      
      if (duration > threshold) {
        logActivity(
          `Performance warning for ${options.name}`,
          {
            operation,
            duration,
            threshold,
            ...options
          },
          options.logLevel || "warning",
          options.userId
        );
      }
      
      return result;
    })
    .catch(error => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // רישום שגיאה עם מידע על הזמן שלקח עד השגיאה
      logActivity(
        `Error in ${options.name}`,
        {
          operation,
          duration,
          error,
          ...options
        },
        "error",
        options.userId
      );
      
      throw error;
    });
}

// פונקציה לקבלת הסטטיסטיקות העדכניות
export function getPerformanceStats(): typeof performanceStats {
  return performanceStats;
}

// פונקציה לקבלת הביצועים הממוצעים לפעולה
export function getAveragePerformance(operation: ProfileableOperation): number | null {
  const stats = performanceStats[operation];
  
  if (!stats || stats.count === 0) {
    return null;
  }
  
  return stats.totalTime / stats.count;
}

// דוגמה לשימוש:
// profileOperation(
//   ProfileableOperation.CV_PARSING,
//   { name: "Extract CV Data", threshold: 5000, userId: "user123" },
//   () => extractCVData(fileUrl)
// );
```

## 10. מנגנוני הפניה (Routing) חכמים

### שיפור מנגנוני הפניה (Routing)
- הוסף טיפול חכם במצבי שגיאה ועמודים לא קיימים
- בנה מערכת הפניות מותאמת אישית למצבי אימות וגישה

```typescript
// file: src/middleware.ts (עדכון)

import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { createIntlMiddleware } from "next-intl/server";
import { logActivity } from "@/lib/monitoring";
import { Feature, FeaturePackages } from "@/services/feature-service";

export const locales = ["en", "he", "fr", "es"];
const defaultLocale = "en";

// המסלולים שדורשים הרשאות
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/checkout",
  "/preview",
  "/customize",
];

// המסלולים שדורשים מנוי פרימיום
export const PREMIUM_ROUTES = [
  "/dashboard/analytics/advanced",
  "/dashboard/domains",
  "/dashboard/settings/premium",
];

// פעולה לבדיקת תווית של כתובת
function matchRoutePattern(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -2);
      return path === base || path.startsWith(`${base}/`);
    }
    return path === pattern;
  });
}

// פונקציה להפקת תכונות לפי כתובת
function getRequiredFeatureForRoute(path: string): Feature | null {
  if (path.startsWith('/dashboard/analytics')) {
    return Feature.ANALYTICS;
  }
  
  if (path.startsWith('/dashboard/domains') || path.includes('/domain')) {
    return Feature.CUSTOM_DOMAIN;
  }
  
  if (path.includes('/portfolio')) {
    return Feature.PORTFOLIO;
  }
  
  if (path.includes('/seo')) {
    return Feature.SEO_TOOLS;
  }
  
  return null;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  try {
    // בדיקת קיום משתני סביבה
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      logActivity(
        "Missing Supabase environment variables", 
        { path: req.nextUrl.pathname },
        "error"
      );
      
      // הפניה לדף שגיאת קונפיגורציה
      if (matchRoutePattern(req.nextUrl.pathname, PROTECTED_ROUTES)) {
        return NextResponse.redirect(new URL("/config-error", req.url));
      }
      
      return res;
    }
    
    // יצירת לקוח סופאבייס למידלוור
    const supabase = createMiddlewareClient({ req, res });
    
    // בדיקת סשן
    const { data: { session } } = await supabase.auth.getSession();
    
    const pathname = req.nextUrl.pathname;
    
    // תיעוד הגישה
    logActivity(
      "Route access", 
      { 
        path: pathname, 
        authenticated: !!session,
        userId: session?.user?.id,
        userAgent: req.headers.get("user-agent"),
        referrer: req.headers.get("referer")
      },
      "info"
    );
    
    // בדיקת מסלולים מוגנים
    const requiresAuth = matchRoutePattern(pathname, PROTECTED_ROUTES);
    
    // מקרה מיוחד לתצוגה מקדימה עם טוקן
    const hasPreviewToken = pathname.startsWith("/preview") && req.nextUrl.searchParams.has("token");
    
    // אישור גישה לתצוגה מקדימה עם טוקן, ללא קשר למצב אימות
    if (requiresAuth && hasPreviewToken) {
      return res;
    }
    
    // אם המסלול דורש אימות והמשתמש לא מחובר, הפניה לדף ההתחברות
    if (requiresAuth && !session) {
      const redirectUrl = new URL("/login", req.url);
      redirectUrl.searchParams.set("redirectTo", pathname + req.nextUrl.search);
      return NextResponse.redirect(redirectUrl);
    }
    
    // בדיקת מסלולים שדורשים הרשאות פרימיום
    const requiresPremium = matchRoutePattern(pathname, PREMIUM_ROUTES);
    
    if (requiresPremium && session) {
      // בדיקת הרשאות פרימיום
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", session.user.id)
        .single();
        
      if (error || !profile || profile.subscription_tier !== "PREMIUM") {
        // הפניה לדף שדרוג
        return NextResponse.redirect(new URL("/upgrade-required", req.url));
      }
    }
    
    // בדיקת תכונה ספציפית הנדרשת למסלול
    const requiredFeature = getRequiredFeatureForRoute(pathname);
    
    if (requiredFeature && session) {
      // בדיקת הרשאה לתכונה
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("subscription_tier, features")
        .eq("id", session.user.id)
        .single();
        
      if (error) {
        logActivity(
          "Error fetching profile for feature check",
          { error, userId: session.user.id, feature: requiredFeature },
          "error"
        );
        
        // במקרה של שגיאה, נמשיך הלאה
        return res;
      }
      
      // בדיקת הרשאה ספציפית
      let hasAccess = false;
      
      if (profile.features && profile.features[requiredFeature] === true) {
        // תכונה מופעלת ישירות
        hasAccess = true;
      } else if (profile.subscription_tier) {
        // בדיקה לפי חבילה
        const tierFeatures = FeaturePackages[profile.subscription_tier as keyof typeof FeaturePackages];
        hasAccess = tierFeatures?.includes(requiredFeature) || false;
      }
      
      if (!hasAccess) {
        // הפניה לדף שדרוג ספציפי לתכונה
        const upgradeUrl = new URL("/upgrade-required", req.url);
        upgradeUrl.searchParams.set("feature", requiredFeature);
        return NextResponse.redirect(upgradeUrl);
      }
    }
    
    // בדיקת דפי אורח בלבד כשהמשתמש כבר מחובר
    const guestOnlyPaths = ["/login", "/signup", "/reset-password"];
    
    if (session && guestOnlyPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // טיפול בבינלאומיות
    const intlMiddleware = createIntlMiddleware({
      locales,
      defaultLocale,
      localePrefix: "as-needed",
    });
    
    if (pathname.startsWith("/[locale]")) {
      return intlMiddleware(req);
    }
    
    return res;
  } catch (error) {
    logActivity(
      "Middleware error",
      { error, path: req.nextUrl.pathname },
      "error"
    );
    
    // במקרה של שגיאה במידלוור, נמשיך הלאה כדי למנוע חסימת המשתמש
    return res;
  }
}

export const config = {
  matcher: [
    // מסלולים מוגנים
    "/dashboard/:path*",
    "/checkout/:path*",
    "/preview/:path*",
    "/customize/:path*",
    // דפי אימות
    "/login",
    "/signup",
    "/reset-password",
    // דפים עם תמיכה בבינלאומיות
    "/[locale]/:path*",
  ],
};
```

כל השיפורים הללו יסייעו לחזק את שכבת ה-Backend של האפליקציה, לשפר את האבטחה, הביצועים, והיציבות, ולהבטיח חוויית משתמש טובה יותר.