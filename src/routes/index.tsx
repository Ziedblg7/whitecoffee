import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import heroImg from "@/assets/interior-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "White Coffee House Restaurant — Mediterranean Coffee & Cuisine" },
      { name: "description", content: "An elegant white & blue Mediterranean coffeehouse serving artisan coffee, brunch, lunch and desserts in Sidi Bou Said." },
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
  return (
    <Layout fullscreen>
      <section className="relative h-[calc(100vh-5rem)] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="White Coffee House Mediterranean interior"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/45 to-primary/75" />
        <div className="relative mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-6 text-center text-primary-foreground">
          <span className="mb-5 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.4em] backdrop-blur md:text-xs">
            Sidi Bou Said · Tunisia
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight md:text-7xl">
            Where every cup feels like<br />the Mediterranean breeze
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
            Artisan coffee, fresh brunch and slow afternoons — served in a serene white-and-blue sanctuary.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-10 md:gap-4">
            <Link
              to="/menu"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-primary shadow-[var(--shadow-elegant)] transition-transform hover:scale-105 md:px-7 md:py-3.5"
            >
              Explore the Menu
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20 md:px-7 md:py-3.5"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
