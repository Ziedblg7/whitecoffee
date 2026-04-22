import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function MenuPage() {
  const [customItems, setCustomItems] = useState<CustomItems>({});
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string>(defaultMenu[0]?.id ?? "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    setCustomItems(loadCustomItems());
  }, []);

  const mergedMenu: MenuCategory[] = defaultMenu.map((cat) => ({
    ...cat,
    items: [...cat.items, ...(customItems[cat.id] ?? [])],
  }));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedPrice = parseFloat(price);
    if (!trimmedName || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid name and price.");
      return;
    }
    const next: CustomItems = {
      ...customItems,
      [categoryId]: [...(customItems[categoryId] ?? []), { name: trimmedName, price: parsedPrice }],
    };
    setCustomItems(next);
    saveCustomItems(next);
    toast.success(`Added "${trimmedName}" to the menu.`);
    setName("");
    setPrice("");
    setOpen(false);
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
                    <li key={item.name} className="flex items-baseline gap-3 py-3">
                      <span className="flex-1 text-sm text-foreground md:text-base">{item.name}</span>
                      <span className="hidden flex-1 translate-y-[-3px] border-b border-dotted border-border sm:block" />
                      <span className="shrink-0 text-right font-display text-base font-semibold text-primary md:text-lg">
                        {item.price}
                        <span className="ml-1 text-[10px] font-normal uppercase tracking-wider text-muted-foreground">TND</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Floating "Add menu item" button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 z-40 h-14 gap-2 rounded-full px-5 shadow-[var(--shadow-elegant)] md:bottom-8 md:right-8"
          >
            <Plus className="h-5 w-5" />
            <span className="font-medium">Add item</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add a menu item</DialogTitle>
            <DialogDescription>
              Pick a category, then enter the item name and price (in TND).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
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
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add to menu</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
