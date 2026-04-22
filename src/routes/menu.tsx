import { createFileRoute } from "@tanstack/react-router";
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
  return (
    <Layout>
      <PageHero
        eyebrow="The Menu"
        title="A taste of the Mediterranean"
        subtitle="Every dish and drink is crafted with seasonal ingredients and a love of slow living."
      />

      {/* Quick category jump */}
      <div className="sticky top-20 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2 px-4 py-3 md:justify-start md:px-6">
          {menu.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span aria-hidden="true">{c.icon}</span>
              <span className="whitespace-nowrap">{c.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Full grid of categories */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {menu.map((cat) => (
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
    </Layout>
  );
}
