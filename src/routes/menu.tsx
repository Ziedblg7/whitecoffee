import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, LogIn, LogOut, Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchMenu, uploadMenuImage, type DbMenuCategory, type DbMenuItem } from "@/lib/menu-api";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import coffeeImg from "@/assets/photo-iced-coffees.jpg";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — White Coffee House Restaurant" },
      { name: "description", content: "Discover our full menu: artisan coffee, fresh juices, brunch, lunch, desserts and late-night snacks." },
      { property: "og:title", content: "Our Menu — White Coffee House" },
      { property: "og:description", content: "Artisan coffee, fresh brunch and Mediterranean cuisine." },
      { property: "og:image", content: coffeeImg },
      { name: "twitter:image", content: coffeeImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MenuPage,
});

type ItemDraft = {
  id?: string;
  category_id: string;
  name: string;
  price: string;
  image_url: string | null;
};

type CategoryDraft = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image_url: string | null;
};

function emptyItemDraft(catId: string): ItemDraft {
  return { category_id: catId, name: "", price: "", image_url: null };
}

function emptyCategoryDraft(): CategoryDraft {
  return { slug: "", name: "", description: "", icon: "", image_url: null };
}

function MenuPage() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin } = useIsAdmin(user?.id);

  const [menu, setMenu] = useState<DbMenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Item dialog state
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemDraft, setItemDraft] = useState<ItemDraft | null>(null);
  const [itemSaving, setItemSaving] = useState(false);

  // Category dialog state
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [catDraft, setCatDraft] = useState<CategoryDraft | null>(null);
  const [catSaving, setCatSaving] = useState(false);

  // Delete confirmations
  const [deleteItem, setDeleteItem] = useState<DbMenuItem | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<DbMenuCategory | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setMenu(await fetchMenu());
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't load menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  // ---------- Image helpers ----------
  const handleImagePick = async (
    file: File,
    apply: (url: string) => void,
  ) => {
    if (!file.type.startsWith("image/")) return toast.error("Pick an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5 MB.");
    try {
      const url = await uploadMenuImage(file);
      apply(url);
      toast.success("Image uploaded.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    }
  };

  // ---------- Item save / delete ----------
  const openAddItem = (catId: string) => {
    setItemDraft(emptyItemDraft(catId));
    setItemDialogOpen(true);
  };
  const openEditItem = (item: DbMenuItem) => {
    setItemDraft({
      id: item.id,
      category_id: item.category_id,
      name: item.name,
      price: String(item.price),
      image_url: item.image_url,
    });
    setItemDialogOpen(true);
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDraft) return;
    const name = itemDraft.name.trim();
    const price = parseFloat(itemDraft.price);
    if (!name || Number.isNaN(price) || price < 0) {
      return toast.error("Name and price are required.");
    }
    setItemSaving(true);
    try {
      if (itemDraft.id) {
        const { error } = await supabase
          .from("menu_items")
          .update({ name, price, category_id: itemDraft.category_id, image_url: itemDraft.image_url })
          .eq("id", itemDraft.id);
        if (error) throw error;
        toast.success("Item updated.");
      } else {
        const maxSort =
          Math.max(
            0,
            ...menu
              .find((c) => c.id === itemDraft.category_id)
              ?.items.map((i) => i.sort_order) ?? [0],
          ) + 1;
        const { error } = await supabase.from("menu_items").insert({
          name,
          price,
          category_id: itemDraft.category_id,
          image_url: itemDraft.image_url,
          sort_order: maxSort,
        });
        if (error) throw error;
        toast.success("Item added.");
      }
      setItemDialogOpen(false);
      setItemDraft(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setItemSaving(false);
    }
  };

  const confirmDeleteItem = async () => {
    if (!deleteItem) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", deleteItem.id);
    if (error) return toast.error(error.message);
    toast.success("Item removed.");
    setDeleteItem(null);
    await load();
  };

  // ---------- Category save / delete ----------
  const openAddCategory = () => {
    setCatDraft(emptyCategoryDraft());
    setCatDialogOpen(true);
  };
  const openEditCategory = (cat: DbMenuCategory) => {
    setCatDraft({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      description: cat.description ?? "",
      icon: cat.icon ?? "",
      image_url: cat.image_url,
    });
    setCatDialogOpen(true);
  };

  const saveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catDraft) return;
    const name = catDraft.name.trim();
    const slug = catDraft.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    if (!name || !slug) return toast.error("Name and slug are required.");
    setCatSaving(true);
    try {
      const payload = {
        name,
        slug,
        description: catDraft.description.trim() || null,
        icon: catDraft.icon.trim() || null,
        image_url: catDraft.image_url,
      };
      if (catDraft.id) {
        const { error } = await supabase.from("menu_categories").update(payload).eq("id", catDraft.id);
        if (error) throw error;
        toast.success("Category updated.");
      } else {
        const maxSort = Math.max(0, ...menu.map((c) => c.sort_order)) + 1;
        const { error } = await supabase
          .from("menu_categories")
          .insert({ ...payload, sort_order: maxSort });
        if (error) throw error;
        toast.success("Category added.");
      }
      setCatDialogOpen(false);
      setCatDraft(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setCatSaving(false);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!deleteCategory) return;
    const { error } = await supabase.from("menu_categories").delete().eq("id", deleteCategory.id);
    if (error) return toast.error(error.message);
    toast.success("Category removed.");
    setDeleteCategory(null);
    await load();
  };

  return (
    <Layout>
      <PageHero
        eyebrow="The Menu"
        title="A taste of the Mediterranean"
        subtitle="Every dish and drink is crafted with seasonal ingredients and a love of slow living."
      />

      {/* Admin status bar */}
      {!authLoading && (
        <div className="border-b border-border/60 bg-muted/30">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-2 text-xs text-muted-foreground">
            {isAdmin ? (
              <>
                <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin mode — edit any item or category
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => supabase.auth.signOut()}
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </Button>
              </>
            ) : (
              <>
                <span>Manager? Sign in to edit the menu.</span>
                <Button asChild size="sm" variant="ghost" className="h-7 gap-1.5 text-xs">
                  <Link to="/admin">
                    <LogIn className="h-3.5 w-3.5" /> Admin sign in
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick category jump */}
      <div className="sticky top-16 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl md:top-20">
        <div className="mx-auto max-w-7xl">
          <div
            className="flex gap-2 overflow-x-auto px-4 py-2.5 md:flex-wrap md:justify-start md:gap-2 md:overflow-x-visible md:px-6 md:py-3"
            style={{ scrollbarWidth: "none" }}
          >
            {menu.map((c) => (
              <a
                key={c.id}
                href={`#${c.slug}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-11 md:px-4 md:py-2 md:text-sm"
              >
                {c.icon && <span aria-hidden="true">{c.icon}</span>}
                <span className="whitespace-nowrap">{c.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Categories grid */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading menu…</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {menu.map((cat) => (
              <article
                key={cat.id}
                id={cat.slug}
                className="scroll-mt-40 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)]"
              >
                {cat.image_url && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <header className="mb-6 flex items-start gap-4 border-b border-border/60 pb-5">
                    {cat.icon && (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-3xl">
                        <span aria-hidden="true">{cat.icon}</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-2xl text-primary md:text-3xl">{cat.name}</h2>
                      {cat.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                      )}
                    </div>
                    {isAdmin && (
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                          onClick={() => openEditCategory(cat)}
                          aria-label={`Edit category ${cat.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteCategory(cat)}
                          aria-label={`Delete category ${cat.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </header>

                  <ul className="divide-y divide-border/50">
                    {cat.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 py-3">
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt=""
                            loading="lazy"
                            className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-border/60"
                          />
                        )}
                        <span className="flex-1 text-sm text-foreground md:text-base">{item.name}</span>
                        <span className="hidden flex-1 translate-y-[-3px] self-end border-b border-dotted border-border sm:block" />
                        <span className="shrink-0 text-right font-display text-base font-semibold text-primary md:text-lg">
                          {item.price}
                          <span className="ml-1 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">
                            TND
                          </span>
                        </span>
                        {isAdmin && (
                          <span className="ml-1 flex shrink-0 items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-primary"
                              onClick={() => openEditItem(item)}
                              aria-label={`Edit ${item.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteItem(item)}
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-5 w-full gap-2"
                      onClick={() => openAddItem(cat.id)}
                    >
                      <Plus className="h-4 w-4" /> Add item
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Floating "Add category" button (admin only) */}
      {isAdmin && (
        <Button
          size="lg"
          onClick={openAddCategory}
          className="fixed bottom-6 right-6 z-40 h-14 gap-2 rounded-full px-5 shadow-[var(--shadow-elegant)] md:bottom-8 md:right-8"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add category</span>
        </Button>
      )}

      {/* Item dialog */}
      <Dialog
        open={itemDialogOpen}
        onOpenChange={(o) => {
          setItemDialogOpen(o);
          if (!o) setItemDraft(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{itemDraft?.id ? "Edit item" : "Add item"}</DialogTitle>
            <DialogDescription>Set the category, name, price, and an optional photo.</DialogDescription>
          </DialogHeader>
          {itemDraft && (
            <form onSubmit={saveItem} className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={itemDraft.category_id}
                  onValueChange={(v) => setItemDraft({ ...itemDraft, category_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {menu.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.icon} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-name">Name</Label>
                <Input
                  id="item-name"
                  value={itemDraft.name}
                  onChange={(e) => setItemDraft({ ...itemDraft, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (TND)</Label>
                <Input
                  id="item-price"
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min="0"
                  value={itemDraft.price}
                  onChange={(e) => setItemDraft({ ...itemDraft, price: e.target.value })}
                  required
                />
              </div>
              <ImageField
                value={itemDraft.image_url}
                onChange={(url) => setItemDraft({ ...itemDraft, image_url: url })}
                onPick={(file) => handleImagePick(file, (url) => setItemDraft({ ...itemDraft, image_url: url }))}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setItemDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={itemSaving}>
                  {itemSaving ? "Saving…" : itemDraft.id ? "Save changes" : "Add item"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Category dialog */}
      <Dialog
        open={catDialogOpen}
        onOpenChange={(o) => {
          setCatDialogOpen(o);
          if (!o) setCatDraft(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{catDraft?.id ? "Edit category" : "Add category"}</DialogTitle>
            <DialogDescription>Set the title, icon (emoji), description, and a hero photo.</DialogDescription>
          </DialogHeader>
          {catDraft && (
            <form onSubmit={saveCategory} className="space-y-4">
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Name</Label>
                  <Input
                    id="cat-name"
                    value={catDraft.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setCatDraft({
                        ...catDraft,
                        name,
                        slug: catDraft.slug || name.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                      });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-icon">Icon</Label>
                  <Input
                    id="cat-icon"
                    className="w-20 text-center text-lg"
                    placeholder="☕"
                    value={catDraft.icon}
                    onChange={(e) => setCatDraft({ ...catDraft, icon: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-slug">Slug (URL anchor)</Label>
                <Input
                  id="cat-slug"
                  value={catDraft.slug}
                  onChange={(e) => setCatDraft({ ...catDraft, slug: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-desc">Description</Label>
                <Textarea
                  id="cat-desc"
                  rows={2}
                  value={catDraft.description}
                  onChange={(e) => setCatDraft({ ...catDraft, description: e.target.value })}
                />
              </div>
              <ImageField
                label="Hero image"
                value={catDraft.image_url}
                onChange={(url) => setCatDraft({ ...catDraft, image_url: url })}
                onPick={(file) => handleImagePick(file, (url) => setCatDraft({ ...catDraft, image_url: url }))}
              />
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setCatDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={catSaving}>
                  {catSaving ? "Saving…" : catDraft.id ? "Save changes" : "Add category"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete item confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={(o) => !o && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this item?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteItem ? `"${deleteItem.name}" will be permanently removed.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteItem}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete category confirmation */}
      <AlertDialog open={!!deleteCategory} onOpenChange={(o) => !o && setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this category?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCategory
                ? `"${deleteCategory.name}" and all ${deleteCategory.items.length} of its items will be permanently removed.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteCategory}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}

// Small reusable image picker for both dialogs
function ImageField({
  value,
  onChange,
  onPick,
  label = "Photo",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  onPick: (file: File) => void;
  label?: string;
}) {
  const inputId = `image-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40">
          {value ? (
            <>
              <img src={value} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(null)}
                aria-label="Remove image"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow ring-1 ring-border transition hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="flex-1">
          <Label
            htmlFor={inputId}
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {value ? "Change photo" : "Upload photo"}
          </Label>
          <Input
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
              e.target.value = "";
            }}
          />
          <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, up to 5 MB.</p>
        </div>
      </div>
    </div>
  );
}
