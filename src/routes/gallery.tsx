import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import interior from "@/assets/interior-hero.jpg";
import honey from "@/assets/photo-honey-pastry.jpg";
import mintTea from "@/assets/photo-mint-tea.jpg";
import pasta from "@/assets/photo-pasta.jpg";
import frenchToast from "@/assets/photo-french-toast.jpg";
import brunch from "@/assets/photo-brunch-spread.jpg";
import iced from "@/assets/photo-iced-coffees.jpg";
import bowls from "@/assets/photo-bowls.jpg";

const images = [
  { src: interior, alt: "White Coffee House interior with bougainvillea ceiling", span: "md:col-span-2 md:row-span-2" },
  { src: honey, alt: "Honey poured over kunafa", span: "" },
  { src: mintTea, alt: "Tunisian mint tea with pine nuts", span: "" },
  { src: iced, alt: "Trio of iced coffees in Mediterranean alcove", span: "md:row-span-2" },
  { src: frenchToast, alt: "French toast with berries", span: "" },
  { src: pasta, alt: "Tagliatelle with seared steak", span: "" },
  { src: brunch, alt: "Brunch spread with avocado toast and coffee", span: "md:col-span-2" },
  { src: bowls, alt: "Trio of grain bowls", span: "" },
  { src: honey, alt: "Sweet pastry detail", span: "" },
];

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — White Coffee House Restaurant" },
      { name: "description", content: "A visual journey through our Mediterranean coffeehouse, dishes and atmosphere." },
      { property: "og:title", content: "Gallery — White Coffee House" },
      { property: "og:description", content: "A visual journey through our space and cuisine." },
      { property: "og:image", content: g1 },
      { name: "twitter:image", content: g1 },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <Layout>
      <PageHero eyebrow="Gallery" title="Moments in white & blue" subtitle="A glimpse into the atmosphere we love to share." />
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid auto-rows-[220px] grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img, i) => (
            <div key={i} className={`group overflow-hidden rounded-2xl shadow-[var(--shadow-card)] ${img.span}`}>
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
