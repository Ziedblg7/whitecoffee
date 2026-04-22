import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import aboutImg from "@/assets/about.jpg";
import gallery3 from "@/assets/gallery3.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — White Coffee House Restaurant" },
      { name: "description", content: "The story behind White Coffee House: a Mediterranean coffeehouse blending Tunisian warmth with Aegean elegance." },
      { property: "og:title", content: "About White Coffee House" },
      { property: "og:description", content: "A Mediterranean coffeehouse blending Tunisian warmth with Aegean elegance." },
      { property: "og:image", content: aboutImg },
      { name: "twitter:image", content: aboutImg },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Our Story"
        title="A house built on light, sea & coffee"
        subtitle="Inspired by the white villages of the Mediterranean, where time slows and conversations linger."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <img src={aboutImg} alt="Mediterranean facade" width={1280} height={1024} loading="lazy" className="rounded-2xl shadow-[var(--shadow-elegant)]" />
          <div>
            <h2 className="font-display text-4xl text-primary">A Tunisian dream, dressed in white</h2>
            <p className="mt-5 text-muted-foreground">
              White Coffee House was born from a simple desire: to create a place where the
              Mediterranean light could pour into every cup. Our founders — passionate about
              specialty coffee and Tunisian hospitality — set out to design a space that would feel
              like a quiet morning in Sidi Bou Said.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every detail, from the cobalt accents to the marble counters and the hand-glazed
              ceramics, is a tribute to the timeless beauty of the sea.
            </p>
          </div>
        </div>

        <div className="mt-24 grid items-center gap-12 md:grid-cols-2">
          <div className="md:order-2">
            <img src={gallery3} alt="Sea-view dining room" width={1024} height={1024} loading="lazy" className="rounded-2xl shadow-[var(--shadow-elegant)]" />
          </div>
          <div>
            <h2 className="font-display text-4xl text-primary">Crafted, never rushed</h2>
            <p className="mt-5 text-muted-foreground">
              We roast in small batches, bake fresh each morning and serve every plate with the
              calm of a Mediterranean afternoon. Whether you stop by for a single espresso or a
              long brunch with friends, we want you to leave feeling lighter.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { n: "12+", l: "Years of craft" },
                { n: "30k", l: "Happy guests / yr" },
                { n: "100%", l: "Fresh daily" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl border border-border/60 bg-card p-5 text-center">
                  <div className="font-display text-3xl text-primary">{s.n}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
