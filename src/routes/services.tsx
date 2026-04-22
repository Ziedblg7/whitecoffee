import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import {
  Sun,
  ShoppingBag,
  Utensils,
  Coffee,
  Cake,
  Laptop,
  CalendarCheck,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Features — White Coffee House Restaurant" },
      { name: "description", content: "Outdoor seating, takeaway & delivery, dine-in, great coffee & tea, desserts, laptop-friendly and reservations accepted." },
      { property: "og:title", content: "Services & Features — White Coffee House" },
      { property: "og:description", content: "Everything we offer at White Coffee House, Sidi Bou Said." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Sun, title: "Outdoor Seating", text: "A sunlit terrace with a glass canopy — enjoy the Tunisian sun all year round." },
  { icon: ShoppingBag, title: "Takeaway & Delivery", text: "Your favorite plates and drinks, ready to go or delivered to your door." },
  { icon: Utensils, title: "Dine-In", text: "Cozy booths, marble tables and a private dining room for an unforgettable meal." },
  { icon: Coffee, title: "Coffee & Tea Selection", text: "An exceptional selection of single-origin coffees and Mediterranean teas." },
  { icon: Cake, title: "Desserts", text: "House-made cakes, tiramisu, cheesecake and waffles crafted daily." },
  { icon: Laptop, title: "Laptop-Friendly", text: "Fast Wi-Fi, quiet corners and endless coffee — perfect for a productive day." },
  { icon: CalendarCheck, title: "Reservations Accepted", text: "Reserve your table in advance — call us at +216 52 873 835." },
];

function ServicesPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="What We Offer"
        title="Services & Features"
        subtitle="Everything thoughtfully prepared so your visit feels effortless from the first sip to the last bite."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-2xl border border-border/60 bg-card p-8 shadow-[var(--shadow-card)] transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-elegant)]">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon size={26} />
              </div>
              <h3 className="font-display text-2xl text-primary">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
