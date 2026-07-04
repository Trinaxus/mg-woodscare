import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Phone, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ApiStatus } from "./ApiStatus";
import { useContent } from "@/lib/content";
import logo from "@/assets/logo_005.png";

const nav = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/#ueber-uns", label: "Über uns" },
  { href: "/referenzen", label: "Referenzen" },
  { href: "/kontakt", label: "Kontakt" },
];

export function SiteHeader() {
  const { content } = useContent();
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold">
          <img
            src={logo}
            alt="MG Woodscare Logo"
            className="h-20 w-20 rounded-full object-cover shadow-glow"
          />
          <span>
            {content.brand.name} <span className="text-primary">{content.brand.accentName}</span>
          </span>
        </Link>
        <nav className="hidden gap-8 text-sm text-muted-foreground md:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="transition-colors hover:text-primary">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={content.instagram.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="hidden h-9 w-9 place-items-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/60 hover:text-primary sm:grid"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <a
            href="/kontakt"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Phone className="h-4 w-4" /> Angebot
          </a>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { content } = useContent();
  const [showLogoModal, setShowLogoModal] = useState(false);
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => setShowLogoModal(true)}
            className="rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Logo in Originalgröße anzeigen"
          >
            <img
              src={logo}
              alt="MG Woodscare Logo"
              className="h-8 w-8 rounded-full object-cover shadow-glow"
            />
          </button>
          <span>
            © {new Date().getFullYear()} {content.brand.name} {content.brand.accentName} – Baumpflege
            & Sägewerk Leipzig
          </span>
        </div>

        {showLogoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setShowLogoModal(false)}
          >
            <div className="relative max-h-[90vh] max-w-[90vw]">
              <button
                onClick={() => setShowLogoModal(false)}
                className="absolute -right-3 -top-3 grid h-8 w-8 place-items-center rounded-full bg-background text-foreground shadow-lg transition-colors hover:bg-primary hover:text-primary-foreground"
                aria-label="Schließen"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={logo}
                alt="MG Woodscare Logo"
                className="max-h-[85vh] max-w-[85vw] rounded-2xl object-contain shadow-2xl"
              />
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <a
            href={content.instagram.url}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <Link to="/impressum" className="hover:text-primary">
            Impressum
          </Link>
          <Link to="/datenschutz" className="hover:text-primary">
            Datenschutz
          </Link>
          <Link to="/admin" className="hover:text-primary">
            Admin
          </Link>
          <ApiStatus />
        </div>
      </div>
    </footer>
  );
}
