import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { Coffee, Utensils, Cake, Users, Wifi, Music } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — White Coffee House Restaurant" },
      { name: "description", content: "Dine in, takeaway, private events, catering and co-working space at White Coffee House." },
      { property: "og:title", content: "Services — White Coffee House" },
      { property: "og:description", content: "Dine-in, events, catering and a serene space to work." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  { icon: Coffee, title: "Dine-In Experience", text: "Enjoy a serene Mediterranean atmosphere with attentive service from morning to midnight." },
  { icon: Utensils, title: "Brunch & Lunch", text: "Daily fresh menus blending Tunisian flavors with continental favorites." },
  { icon: Cake, title: "Private Events", text: "Birthdays, engagements, and celebrations hosted in our intimate dining room." },
  { icon: Users, title: "Catering Service", text: "We bring our menu to your office, wedding or special gathering." },
  { icon: Wifi, title: "Co-Working Friendly", text: "Fast Wi-Fi, quiet corners and endless coffee — perfect for a productive day." },
  { icon: Music, title: "Live Music Nights", text: "Acoustic sets every Friday and Saturday from sunset to late." },
];

function ServicesPage() {
  return (
    <Layout>
      <PageHero
        eyebrow="What We Offer"
        title="Services crafted around you"
        subtitle="From a quick espresso on the run to a full-evening celebration — we're here to host you beautifully."
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
