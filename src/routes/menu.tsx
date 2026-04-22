import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { menu } from "@/data/menu";
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

function MenuPage() {
  const [activeId, setActiveId] = useState(menu[0].id);
  const cat = menu.find((c) => c.id === activeId) ?? menu[0];

  return (
    <Layout>
      <PageHero
        eyebrow="The Menu"
        title="A taste of the Mediterranean"
        subtitle="Choose a category to explore — each section stands on its own."
      />

      {/* Category tabs */}
      <div className="sticky top-20 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3">
          {menu.map((c) => {
            const active = c.id === activeId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/70 hover:border-primary hover:text-primary"
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single active category */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <article key={cat.id} className="grid items-center gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-[var(--shadow-elegant)]">
            <img
              src={cat.image}
              alt={cat.title}
              width={1024}
              height={1024}
              className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div>
            <div className="mb-3 text-4xl">{cat.icon}</div>
            <h2 className="font-display text-4xl text-primary md:text-5xl">{cat.title}</h2>
            <p className="mt-3 text-muted-foreground">{cat.description}</p>

            <ul className="mt-8 divide-y divide-border/60 rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-card)]">
              {cat.items.map((item) => (
                <li key={item.name} className="flex items-baseline gap-4 px-6 py-4">
                  <span className="flex-1 text-base text-foreground">{item.name}</span>
                  <span className="hidden flex-1 border-b border-dashed border-border sm:block" />
                  <span className="font-display text-lg font-semibold text-primary">
                    {item.price} <span className="text-xs font-normal text-muted-foreground">TND</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>
    </Layout>
  );
}
