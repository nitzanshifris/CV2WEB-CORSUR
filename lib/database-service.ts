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