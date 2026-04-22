import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import hero from "@/assets/hero.jpg";
import about from "@/assets/about.jpg";
import g1 from "@/assets/gallery1.jpg";
import g2 from "@/assets/gallery2.jpg";
import g3 from "@/assets/gallery3.jpg";
import coffee from "@/assets/coffee.jpg";
import desserts from "@/assets/desserts.jpg";
import drinks from "@/assets/drinks.jpg";
import breakfast from "@/assets/breakfast.jpg";

const images = [
  { src: hero, alt: "Bright dining room", span: "md:col-span-2 md:row-span-2" },
  { src: g1, alt: "Terrace at dusk", span: "" },
  { src: coffee, alt: "Coffee flatlay", span: "" },
  { src: about, alt: "Bougainvillea facade", span: "md:row-span-2" },
  { src: g2, alt: "Barista pouring latte art", span: "" },
  { src: desserts, alt: "Plated desserts", span: "" },
  { src: drinks, alt: "Fresh drinks by the sea", span: "md:col-span-2" },
  { src: breakfast, alt: "Brunch spread", span: "" },
  { src: g3, alt: "Sea view dining room", span: "" },
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
