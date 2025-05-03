import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AnalyticsData {
  page_views: number;
  unique_visitors: number;
  average_time_on_page: number;
  bounce_rate: number;
  top_pages: Array<{
    path: string;
    views: number;
  }>;
  traffic_sources: Array<{
    source: string;
    count: number;
  }>;
  devices: Array<{
    type: string;
    count: number;
  }>;
}

interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  path?: string;
  source?: string;
  device?: string;
}

export async function getSiteAnalytics(
  siteId: string,
  filters: AnalyticsFilters = {}
): Promise<AnalyticsData> {
  try {
    let query = supabase
      .from("analytics")
      .select("*")
      .eq("site_id", siteId);

    if (filters.startDate) {
      query = query.gte("created_at", filters.startDate);
    }

    if (filters.endDate) {
      query = query.lte("created_at", filters.endDate);
    }

    if (filters.path) {
      query = query.eq("path", filters.path);
    }

    if (filters.source) {
      query = query.eq("source", filters.source);
    }

    if (filters.device) {
      query = query.eq("device", filters.device);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Process and aggregate the data
    const analyticsData: AnalyticsData = {
      page_views: 0,
      unique_visitors: 0,
      average_time_on_page: 0,
      bounce_rate: 0,
      top_pages: [],
      traffic_sources: [],
      devices: [],
    };

    if (!data || data.length === 0) {
      return analyticsData;
    }

    // Calculate basic metrics
    analyticsData.page_views = data.length;
    analyticsData.unique_visitors = new Set(data.map((d) => d.visitor_id)).size;

    // Calculate average time on page
    const totalTime = data.reduce((sum, d) => sum + (d.time_on_page || 0), 0);
    analyticsData.average_time_on_page = totalTime / data.length;

    // Calculate bounce rate
    const singlePageVisits = data.filter((d) => d.is_bounce).length;
    analyticsData.bounce_rate = (singlePageVisits / data.length) * 100;

    // Calculate top pages
    const pageViews = data.reduce((acc, d) => {
      acc[d.path] = (acc[d.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    analyticsData.top_pages = Object.entries(pageViews)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Calculate traffic sources
    const sources = data.reduce((acc, d) => {
      acc[d.source] = (acc[d.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    analyticsData.traffic_sources = Object.entries(sources)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count);

    // Calculate device types
    const devices = data.reduce((acc, d) => {
      acc[d.device] = (acc[d.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    analyticsData.devices = Object.entries(devices)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);

    return analyticsData;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}

export async function trackPageView(
  siteId: string,
  data: {
    path: string;
    visitor_id: string;
    source: string;
    device: string;
    time_on_page?: number;
    is_bounce?: boolean;
  }
): Promise<void> {
  try {
    const { error } = await supabase.from("analytics").insert({
      site_id: siteId,
      ...data,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error tracking page view:", error);
    throw error;
  }
} 