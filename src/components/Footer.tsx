import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const TIKTOK_URL = "https://www.tiktok.com/@white_sidibousaid";
const INSTAGRAM_URL = "https://www.instagram.com/white_sidibousaid";
const FACEBOOK_URL = "https://www.facebook.com/share/1Dx9aCAD3V/?mibextid=wwXIfr";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7.05a4.85 4.85 0 0 1-1.84-.36z" />
    </svg>
  );
}

export function Footer() {
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://whitesidibousaid.tn";
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="font-display text-2xl font-semibold text-primary">White Coffee House</div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            A Mediterranean sanctuary of coffee, cuisine and calm in the heart of Sidi Bou Said.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-border p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><Instagram size={16} /></a>
            <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-border p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><Facebook size={16} /></a>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" aria-label="TikTok" className="rounded-full border border-border p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><TikTokIcon size={16} /></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/menu" className="hover:text-primary">Menu</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link to="/reviews" className="hover:text-primary">Reviews</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Visit</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-accent" /><span>Sidi Bou Said, Tunisia</span></li>
            <li className="flex items-start gap-2"><Phone size={16} className="mt-0.5 text-accent" /><span>+216 52 873 835</span></li>
            <li className="flex items-start gap-2"><Mail size={16} className="mt-0.5 text-accent" /><span>hello@whitesidibousaid.tn</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Scan & Visit</h4>
          <div className="mt-4 inline-flex flex-col items-center rounded-2xl border border-border/60 bg-background p-3 shadow-[var(--shadow-card)]">
            <QRCodeSVG value={siteUrl} size={104} bgColor="#ffffff" fgColor="#1e3a8a" level="M" />
            <span className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">Visit our site</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} White Coffee House Restaurant · Sidi Bou Said
      </div>
    </footer>
  );
}
