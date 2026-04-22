import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Star } from "lucide-react";

const reviews = [
  { name: "Leïla B.", role: "Tunis", rating: 5, text: "The most beautiful coffeehouse in Tunis. The mint tea, the marble tables, the light — pure poetry." },
  { name: "Marco R.", role: "Visitor from Italy", rating: 5, text: "Their espresso rivals what I drink in Milan. And the avocado toast? Best I've had in North Africa." },
  { name: "Sarra K.", role: "Food blogger", rating: 5, text: "An aesthetic dream. Every corner is photographable, but the food and service stand on their own." },
  { name: "Yassine H.", role: "Local regular", rating: 5, text: "I come every Saturday morning for the Tunisian breakfast. It feels like home, but more elegant." },
  { name: "Amélie D.", role: "Visitor from Paris", rating: 5, text: "A serene escape. The pastries are delicate, the staff warm. I left already missing it." },
  { name: "Karim S.", role: "Architect", rating: 5, text: "The white-and-blue palette is executed with so much restraint. A masterclass in Mediterranean design." },
];

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — White Coffee House Restaurant" },
      { name: "description", content: "What our guests say about their experience at White Coffee House Restaurant." },
      { property: "og:title", content: "Guest Reviews — White Coffee House" },
      { property: "og:description", content: "Stories and ratings from our beloved guests." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Loved by Guests"
        title="Words from our visitors"
        subtitle="Real stories from the wonderful people who share our tables."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex items-center justify-center gap-3">
          <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={22} className="fill-accent text-accent" />)}</div>
          <span className="font-display text-2xl text-primary">4.9 / 5</span>
          <span className="text-sm text-muted-foreground">· 1,200+ reviews</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.name} className="flex flex-col rounded-2xl border border-border/60 bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
              <div className="mb-4 flex">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="flex-1 italic text-foreground/80">"{r.text}"</p>
              <div className="mt-6 border-t border-border/60 pt-4">
                <div className="font-display text-lg text-primary">{r.name}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{r.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
