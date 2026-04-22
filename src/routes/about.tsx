import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import aboutImg from "@/assets/about.jpg";
import gallery3 from "@/assets/gallery3.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — White Coffee House Restaurant · Sidi Bou Said" },
      { name: "description", content: "A refined and cozy dining experience in the heart of Sidi Bou Said — breakfast, lunch, brunch and dinner in a warm, trendy atmosphere." },
      { property: "og:title", content: "About White Coffee House" },
      { property: "og:description", content: "A refined and cozy dining experience in the heart of Sidi Bou Said." },
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
        subtitle="A refined and cozy dining experience in the heart of Sidi Bou Said."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <img src={aboutImg} alt="Mediterranean facade in Sidi Bou Said" width={1280} height={1024} loading="lazy" className="rounded-2xl shadow-[var(--shadow-elegant)]" />
          <div>
            <h2 className="font-display text-4xl text-primary">A Tunisian dream, dressed in white</h2>
            <p className="mt-5 text-muted-foreground">
              White Coffee House Restaurant offers a refined and cozy dining experience in the heart
              of Sidi Bou Said. From breakfast to dinner — including lunch and afternoon treats —
              enjoy delicious moments with friends and family in a warm and trendy atmosphere.
            </p>
            <p className="mt-4 text-muted-foreground">
              Every detail, from the cobalt accents to the marble counters and the hand-glazed
              ceramics, is a tribute to the timeless beauty of the Mediterranean.
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
