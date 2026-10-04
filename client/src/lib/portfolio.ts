import { createClient } from "@supabase/supabase-js";

export type LivePortfolioPage = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  published: boolean;
  updated_at: string;
};

export type LivePortfolioElement = {
  id: string;
  page_id: string;
  element_type: "text" | "image" | "button" | "divider" | string;
  x: number;
  y: number;
  width: number;
  height: number;
  z_index: number;
  content: Record<string, unknown>;
  styles: Record<string, unknown>;
};

const url = import.meta.env.VITE_SUPABASE_URL || "https://tgufcpgrbsaxccbkmvhx.supabase.co";
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRndWZjcGdyYnNheGNjYmttdmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODU4MDcsImV4cCI6MjEwMjk2MTgwN30.2WlPv_c3Y99n0rd5sFOn0B0xIVI2jxoRFA26gKunmMs";

export const portfolioSupabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

export function portfolioImageUrl(element: LivePortfolioElement) {
  const content = element.content;
  const publicUrl = typeof content.publicUrl === "string" ? content.publicUrl : "";
  if (publicUrl) return publicUrl;
  const storagePath = typeof content.storagePath === "string" ? content.storagePath : "";
  if (storagePath) return portfolioSupabase.storage.from("portfolio-media").getPublicUrl(storagePath).data.publicUrl;
  return typeof content.src === "string" ? content.src : "";
}

export async function loadPublishedPortfolio() {
  const { data: page, error: pageError } = await portfolioSupabase
    .from("portfolio_pages")
    .select("id,slug,title,description,published,updated_at")
    .eq("slug", "home")
    .eq("published", true)
    .limit(1)
    .maybeSingle();
  if (pageError || !page) return { page: null, elements: [], error: pageError?.message || "portfolio-not-published" };
  const { data: elements, error: elementError } = await portfolioSupabase
    .from("portfolio_elements")
    .select("id,page_id,element_type,x,y,width,height,z_index,content,styles")
    .eq("page_id", page.id)
    .order("z_index", { ascending: true });
  return { page: page as LivePortfolioPage, elements: (elements || []) as LivePortfolioElement[], error: elementError?.message || "" };
}
