import { supabase } from "@/integrations/supabase/client";

export interface DbMenuItem {
  id: string;
  category_id: string;
  name: string;
  price: number;
  image_url: string | null;
  sort_order: number;
}

export interface DbMenuCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  image_url: string | null;
  sort_order: number;
  items: DbMenuItem[];
}

export async function fetchMenu(): Promise<DbMenuCategory[]> {
  const [{ data: cats, error: ce }, { data: items, error: ie }] = await Promise.all([
    supabase.from("menu_categories").select("*").order("sort_order"),
    supabase.from("menu_items").select("*").order("sort_order"),
  ]);
  if (ce) throw ce;
  if (ie) throw ie;
  return (cats ?? []).map((c) => ({
    ...c,
    price: undefined,
    items: (items ?? []).filter((i) => i.category_id === c.id).map((i) => ({ ...i, price: Number(i.price) })),
  })) as DbMenuCategory[];
}

export async function uploadMenuImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `uploads/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("menu-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
  return data.publicUrl;
}
