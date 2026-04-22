import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Reservations — White Coffee House Restaurant" },
      { name: "description", content: "Reserve a table or get in touch with White Coffee House Restaurant in Tunis." },
      { property: "og:title", content: "Contact — White Coffee House" },
      { property: "og:description", content: "Reserve a table or get in touch with our team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <Layout>
      <PageHero
        eyebrow="Get in Touch"
        title="Reserve a table or say hello"
        subtitle="We'd love to welcome you. Send us a note and we'll reply within a few hours."
      />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: MapPin, title: "Find Us", text: "Avenue Habib Bourguiba, Tunis 1000, Tunisia" },
              { icon: Phone, title: "Call Us", text: "+216 71 000 000" },
              { icon: Mail, title: "Email", text: "hello@whitecoffeehouse.tn" },
              { icon: Clock, title: "Opening Hours", text: "Mon–Thu 7:00–23:00 · Fri–Sat 7:00–01:00 · Sun 8:00–23:00" },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-5 rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-card)]">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-primary">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-3xl border border-border/60 bg-card p-8 shadow-[var(--shadow-elegant)]"
          >
            <h2 className="font-display text-3xl text-primary">Send us a message</h2>
            <div className="mt-6 grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Your name" type="text" name="name" />
                <Field label="Email" type="email" name="email" />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Date" type="date" name="date" />
                <Field label="Guests" type="number" name="guests" />
              </div>
              <Field label="Message" textarea name="message" />
              <button
                type="submit"
                className="mt-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-card)] transition-all hover:shadow-[var(--shadow-elegant)]"
              >
                {sent ? "Thank you — we'll be in touch!" : "Send Reservation"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, type = "text", name, textarea }: { label: string; type?: string; name: string; textarea?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-primary">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
        />
      ) : (
        <input
          name={name}
          type={type}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
        />
      )}
    </label>
  );
}
