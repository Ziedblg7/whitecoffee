import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { menu as defaultMenu, type MenuCategory, type MenuItem } from "@/data/menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
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

const STORAGE_KEY = "wch:custom-menu-items";

type CustomItems = Record<string, MenuItem[]>;

function loadCustomItems(): CustomItems {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomItems) : {};
  } catch {
    return {};
  }
}

function saveCustomItems(items: CustomItems) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    toast.error("Storage is full. Try a smaller image.");
  }
}

// Read a File, draw it to a canvas at maxSize on the long edge, return JPEG data URL.
function resizeImageToDataUrl(file: File, maxSize = 480): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode error"));
      img.onload = () => {
        const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

type MergedItem = MenuItem & { custom: boolean; customIndex?: number };
type MergedCategory = Omit<MenuCategory, "items"> & { items: MergedItem[] };

function MenuPage() {
  const [customItems, setCustomItems] = useState<CustomItems>({});
  const [formOpen, setFormOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string>(defaultMenu[0]?.id ?? "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  // When editing, track which custom item we're editing
  const [editing, setEditing] = useState<{ categoryId: string; index: number } | null>(null);
  // Pending deletion confirmation
  const [deleting, setDeleting] = useState<{ categoryId: string; index: number; name: string } | null>(null);

  useEffect(() => {
    setCustomItems(loadCustomItems());
  }, []);

  const mergedMenu: MergedCategory[] = defaultMenu.map((cat) => ({
    ...cat,
    items: [
      ...cat.items.map((i) => ({ ...i, custom: false })),
      ...(customItems[cat.id] ?? []).map((i, idx) => ({ ...i, custom: true, customIndex: idx })),
    ],
  }));

  const resetForm = () => {
    setName("");
    setPrice("");
    setImage(undefined);
    setEditing(null);
    setCategoryId(defaultMenu[0]?.id ?? "");
  };

  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    try {
      const dataUrl = await resizeImageToDataUrl(file, 480);
      setImage(dataUrl);
    } catch {
      toast.error("Couldn't read that image.");
    }
  };

  const openAdd = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (catId: string, index: number) => {
    const item = customItems[catId]?.[index];
    if (!item) return;
    setEditing({ categoryId: catId, index });
    setCategoryId(catId);
    setName(item.name);
    setPrice(String(item.price));
    setImage(item.image);
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedPrice = parseFloat(price);
    if (!trimmedName || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid name and price.");
      return;
    }

    const newItem: MenuItem = { name: trimmedName, price: parsedPrice, ...(image ? { image } : {}) };
    let next: CustomItems;
    if (editing) {
      // If category changed, remove from old then append to new
      if (editing.categoryId !== categoryId) {
        const oldList = [...(customItems[editing.categoryId] ?? [])];
        oldList.splice(editing.index, 1);
        const newList = [...(customItems[categoryId] ?? []), newItem];
        next = { ...customItems, [editing.categoryId]: oldList, [categoryId]: newList };
      } else {
        const list = [...(customItems[categoryId] ?? [])];
        list[editing.index] = newItem;
        next = { ...customItems, [categoryId]: list };
      }
      toast.success(`Updated "${trimmedName}".`);
    } else {
      next = {
        ...customItems,
        [categoryId]: [...(customItems[categoryId] ?? []), newItem],
      };
      toast.success(`Added "${trimmedName}" to the menu.`);
    }

    setCustomItems(next);
    saveCustomItems(next);
    setFormOpen(false);
    resetForm();
  };

  const confirmDelete = () => {
    if (!deleting) return;
    const list = [...(customItems[deleting.categoryId] ?? [])];
    list.splice(deleting.index, 1);
    const next = { ...customItems, [deleting.categoryId]: list };
    setCustomItems(next);
    saveCustomItems(next);
    toast.success(`Removed "${deleting.name}".`);
    setDeleting(null);
  };

  return (
    <Layout>
      <PageHero
        eyebrow="The Menu"
        title="A taste of the Mediterranean"
        subtitle="Every dish and drink is crafted with seasonal ingredients and a love of slow living."
      />

      {/* Quick category jump */}
      <div className="sticky top-16 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl md:top-20">
        <div className="mx-auto max-w-7xl">
          <div
            className="flex gap-2 overflow-x-auto px-4 py-2.5 md:flex-wrap md:justify-start md:gap-2 md:overflow-x-visible md:px-6 md:py-3"
            style={{ scrollbarWidth: "none" }}
          >
            {mergedMenu.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/70 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-11 md:px-4 md:py-2 md:text-sm"
              >
                <span aria-hidden="true">{c.icon}</span>
                <span className="whitespace-nowrap">{c.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Full grid of categories */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {mergedMenu.map((cat) => (
            <article
              key={cat.id}
              id={cat.id}
              className="scroll-mt-40 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <div className="p-6 md:p-8">
                <header className="mb-6 flex items-start gap-4 border-b border-border/60 pb-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-3xl">
                    <span aria-hidden="true">{cat.icon}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-primary md:text-3xl">{cat.title}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </header>

                <ul className="divide-y divide-border/50">
                  {cat.items.map((item) => (
                    <li
                      key={`${item.custom ? "c" : "d"}-${item.name}-${item.customIndex ?? ""}`}
                      className="flex items-center gap-3 py-3"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-border/60"
                        />
                      )}
                      <span className="flex-1 text-sm text-foreground md:text-base">{item.name}</span>
                      <span className="hidden flex-1 translate-y-[-3px] self-end border-b border-dotted border-border sm:block" />
                      <span className="shrink-0 text-right font-display text-base font-semibold text-primary md:text-lg">
                        {item.price}
                        <span className="ml-1 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">TND</span>
                      </span>
                      {item.custom && item.customIndex !== undefined && (
                        <span className="ml-1 flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEdit(cat.id, item.customIndex!)}
                            aria-label={`Edit ${item.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              setDeleting({ categoryId: cat.id, index: item.customIndex!, name: item.name })
                            }
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Floating "Add menu item" button */}
      <Dialog
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) resetForm();
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="lg"
            onClick={openAdd}
            className="fixed bottom-6 right-6 z-40 h-14 gap-2 rounded-full px-5 shadow-[var(--shadow-elegant)] md:bottom-8 md:right-8"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add item</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit menu item" : "Add a menu item"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the category, name, or price of this item."
                : "Pick a category, then enter the item name and price (in TND)."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {defaultMenu.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.icon} {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Item name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Matcha Latte"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (TND)</Label>
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 8.5"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Photo (optional)</Label>
              <div className="flex items-center gap-3">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted/40">
                  {image ? (
                    <>
                      <img src={image} alt="" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImage(undefined)}
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
                    htmlFor="item-image"
                    className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {image ? "Change photo" : "Upload photo"}
                  </Label>
                  <Input
                    id="item-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handleImageFile(f);
                      e.target.value = "";
                    }}
                  />
                  <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, up to 5 MB.</p>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save changes" : "Add to menu"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this item?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting ? `"${deleting.name}" will be removed from the menu.` : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
