import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
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
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = menu.findIndex((c) => c.id === activeId);
  const cat = menu[activeIndex] ?? menu[0];

  const focusTab = (index: number) => {
    const next = (index + menu.length) % menu.length;
    setActiveId(menu[next].id);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(menu.length - 1);
        break;
    }
  };

  return (
    <Layout>
      <PageHero
        eyebrow="The Menu"
        title="A taste of the Mediterranean"
        subtitle="Choose a category to explore — each section stands on its own."
      />

      {/* Category tabs — wraps onto multiple rows; no horizontal swipe */}
      <div className="sticky top-20 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div
          role="tablist"
          aria-label="Menu categories"
          aria-orientation="horizontal"
          className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 overflow-hidden overscroll-x-none px-4 py-3 md:justify-start md:px-6 [touch-action:pan-y]"
        >
          {menu.map((c, i) => {
            const active = c.id === activeId;
            return (
              <button
                key={c.id}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`tab-${c.id}`}
                aria-selected={active}
                aria-controls={`panel-${c.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => setActiveId(c.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`flex min-h-12 touch-manipulation items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-accent ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-card)]"
                    : "border-border bg-card text-foreground/70 hover:border-primary hover:text-primary active:bg-primary-soft"
                }`}
              >
                <span aria-hidden="true" className="text-base">{c.icon}</span>
                <span className="whitespace-nowrap">{c.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Single active category */}
      <section
        className="mx-auto max-w-7xl px-6 py-16 md:py-20"
        role="tabpanel"
        id={`panel-${cat.id}`}
        aria-labelledby={`tab-${cat.id}`}
      >
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
