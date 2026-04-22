import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { menu } from "@/data/menu";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import { Coffee, Leaf, Clock, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "White Coffee House Restaurant — Mediterranean Coffee & Cuisine" },
      { name: "description", content: "An elegant white & blue Mediterranean coffeehouse serving artisan coffee, brunch, lunch and desserts in Tunis." },
      { property: "og:title", content: "White Coffee House Restaurant" },
      { property: "og:description", content: "Mediterranean coffee, brunch & cuisine in a sunlit white-and-blue setting." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const featured = menu.slice(0, 3);
  return (
    <Layout>
      {/* HERO */}
      <section className="relative min-h-[88vh] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="White Coffee House Mediterranean interior"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/40 to-primary/70" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col items-center justify-center px-6 text-center text-primary-foreground">
          <span className="mb-5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs uppercase tracking-[0.4em] backdrop-blur">
            Mediterranean · Est. Tunis
          </span>
          <h1 className="font-display text-5xl font-semibold leading-tight md:text-7xl">
            Where every cup feels like<br />the Mediterranean breeze
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            Artisan coffee, fresh brunch and slow afternoons — served in a serene white-and-blue sanctuary.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/menu"
              className="rounded-full bg-white px-7 py-3.5 text-sm font-medium text-primary shadow-[var(--shadow-elegant)] transition-transform hover:scale-105"
            >
              Explore the Menu
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            { icon: Coffee, title: "Artisan Coffee", text: "Single-origin beans, expertly roasted." },
            { icon: Leaf, title: "Fresh & Local", text: "Mediterranean produce, daily sourced." },
            { icon: Clock, title: "Open Daily", text: "From sunrise espresso to late-night bites." },
            { icon: Star, title: "Award-Winning", text: "Loved by locals and travelers alike." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border/60 bg-card p-7 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-xl text-primary">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
          <img src={aboutImg} alt="White coffeehouse facade" width={1280} height={1024} loading="lazy" className="rounded-2xl shadow-[var(--shadow-elegant)]" />
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-accent">Our Story</div>
            <h2 className="font-display text-4xl text-primary md:text-5xl">A Mediterranean ritual, reimagined.</h2>
            <p className="mt-5 text-muted-foreground">
              Inspired by the cobalt shores of Sidi Bou Said and the unhurried cafés of the Aegean,
              White Coffee House is a sanctuary for those who believe a great cup of coffee is the
              beginning of every great day.
            </p>
            <Link to="/about" className="mt-7 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
              Discover More
            </Link>
          </div>
        </div>
      </section>

      {/* MENU TEASER */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-accent">Tastings</div>
          <h2 className="font-display text-4xl text-primary md:text-5xl">From Our Menu</h2>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {featured.map((cat) => (
            <Link key={cat.id} to="/menu" className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={cat.image} alt={cat.title} width={1024} height={768} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-6">
                <div className="text-2xl">{cat.icon}</div>
                <h3 className="mt-2 font-display text-2xl text-primary">{cat.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/menu" className="inline-block rounded-full border border-primary px-7 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
            View Full Menu
          </Link>
        </div>
      </section>
    </Layout>
  );
}
