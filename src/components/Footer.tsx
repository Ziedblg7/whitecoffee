import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-semibold text-primary">White Coffee House</div>
          <p className="mt-3 text-sm text-muted-foreground">
            A Mediterranean sanctuary of coffee, cuisine and calm.
          </p>
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
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-accent" /> Avenue Habib Bourguiba, Tunis</li>
            <li className="flex items-start gap-2"><Phone size={16} className="mt-0.5 text-accent" /> +216 71 000 000</li>
            <li className="flex items-start gap-2"><Mail size={16} className="mt-0.5 text-accent" /> hello@whitecoffeehouse.tn</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-primary">Hours</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Mon – Thu · 7:00 – 23:00</li>
            <li>Fri – Sat · 7:00 – 01:00</li>
            <li>Sunday · 8:00 – 23:00</li>
          </ul>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full border border-border p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><Instagram size={16} /></a>
            <a href="#" aria-label="Facebook" className="rounded-full border border-border p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"><Facebook size={16} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} White Coffee House Restaurant. All rights reserved.
      </div>
    </footer>
  );
}
