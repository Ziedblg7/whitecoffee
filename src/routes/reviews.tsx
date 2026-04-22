import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Star, Award, ThumbsUp } from "lucide-react";

interface Review {
  name: string;
  badge?: string;
  meal: string;
  price?: string;
  rating: number;
  text: string;
  food: number;
  service: number;
  atmosphere: number;
  extras?: string[];
}

const reviews: Review[] = [
  {
    name: "Meriem Mediouni",
    meal: "Brunch",
    rating: 5,
    text: "Une belle expérience, un menu varié, les plats sont délicieux et joliment présentés mais surtout un service irréprochable et un cadre très calme comme d'habitude. Je recommande fortement surtout pour les brunchs.",
    food: 5, service: 5, atmosphere: 5,
    extras: [
      "Noise level: Very quiet",
      "Seating: Indoor · Outdoor terrace · Booth · Private dining room",
    ],
  },
  {
    name: "Guillermo Lopez Andres",
    meal: "Lunch",
    price: "TND 20–30",
    rating: 5,
    text: "Un très bel endroit où l'on se sent bien dès l'arrivée. La carte propose une grande variété de choix pour le petit-déjeuner, le déjeuner et le dîner, et on peut même y suivre les matchs de foot. L'équipe se distingue par sa gentillesse et son professionnalisme, avec une mention spéciale pour Ramzy, toujours attentif et souriant. L'atmosphère est cosy et chaleureuse, et la terrasse vitrée permet de rester au chaud tout en profitant du soleil pendant l'hiver tunisien. Une adresse que je recommande.",
    food: 5, service: 5, atmosphere: 5,
    extras: [
      "Noise level: Quiet, easy to talk",
      "Seating: Indoor · Outdoor terrace · Booth · Counter",
      "Vegetarian options: Available",
      "Parking: Plenty of parking",
    ],
  },
  {
    name: "Benoit Trojet",
    badge: "Local Guide",
    meal: "Brunch",
    rating: 5,
    text: "Un endroit incontournable pour un très bon brunch. Le service est impeccable et attentionné. Les prix sont corrects. Je recommande vivement cette adresse.",
    food: 5, service: 5, atmosphere: 5,
  },
  {
    name: "Hala Hadjab",
    meal: "Brunch",
    price: "TND 20–30",
    rating: 5,
    text: "Un lieu d'une grande douceur, où l'atmosphère chaleureuse vous accueille immédiatement. La carte, variée et bien pensée, convient aussi bien aux petits-déjeuners qu'aux dîners. L'équipe fait preuve d'un professionnalisme discret, et Hamdi se distingue par une attention délicate et un service impeccable. Les canapés, d'un confort rare, invitent à prolonger le moment. Une adresse que l'on retient volontiers.",
    food: 5, service: 5, atmosphere: 5,
    extras: [
      "Reservations not required",
      "Noise level: Quiet, easy to talk",
    ],
  },
];

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews — White Coffee House Restaurant" },
      { name: "description", content: "What our guests say about their experience at White Coffee House Restaurant in Sidi Bou Said." },
      { property: "og:title", content: "Guest Reviews — White Coffee House" },
      { property: "og:description", content: "Stories and ratings from our beloved guests." },
    ],
  }),
  component: ReviewsPage,
});

function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <div className="flex">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={size} className="fill-accent text-accent" />
      ))}
    </div>
  );
}

function ReviewsPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="Loved by Guests"
        title="Words from our visitors"
        subtitle="Real stories from the wonderful people who share our tables."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-border/60 bg-card p-7 text-center shadow-[var(--shadow-card)]">
            <div className="flex justify-center"><Stars n={5} size={22} /></div>
            <div className="mt-3 font-display text-3xl text-primary">5.0 / 5</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Average rating</div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-primary p-7 text-center text-primary-foreground shadow-[var(--shadow-elegant)]">
            <ThumbsUp size={28} className="mx-auto" />
            <div className="mt-3 font-display text-4xl">90%</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-primary-foreground/80">Recommended</div>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card p-7 text-center shadow-[var(--shadow-card)]">
            <div className="font-display text-4xl text-primary">231</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Guest opinions</div>
          </div>
        </div>

        <div className="grid gap-7 md:grid-cols-2">
          {reviews.map((r) => (
            <article key={r.name} className="flex flex-col rounded-3xl border border-border/60 bg-card p-7 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)]">
              <header className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl text-primary">{r.name}</h3>
                    {r.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        <Award size={10} /> {r.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {r.meal}{r.price ? ` · ${r.price}` : ""}
                  </div>
                </div>
                <Stars n={r.rating} />
              </header>

              <p className="mt-5 italic text-foreground/80">"{r.text}"</p>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-4 text-xs">
                <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">Food: {r.food}</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">Service: {r.service}</span>
                <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">Atmosphere: {r.atmosphere}</span>
              </div>

              {r.extras && (
                <ul className="mt-4 space-y-1 text-xs text-muted-foreground">
                  {r.extras.map((e) => (
                    <li key={e}>· {e}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}
