import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Phone, X, Menu, Facebook, Youtube, Linkedin, MessageCircle, Music2 } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { ApiStatus } from "./ApiStatus";
import { SsrStatus } from "./SsrStatus";
import { useContent } from "@/lib/content";
import logo from "@/assets/logo_005.png";

const socialIcons: Record<string, typeof Instagram> = {
  facebook: Facebook,
  instagram: Instagram,
  whatsapp: MessageCircle,
  youtube: Youtube,
  tiktok: Music2,
  linkedin: Linkedin,
};

function SocialLinks({ className = "" }: { className?: string }) {
  const { content } = useContent();
  const entries = Object.entries(content.social || {})
    .filter(([key]) => socialIcons[key])
    .filter(([, url]) => typeof url === "string" && url.trim() !== "");
  if (entries.length === 0) return null;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {entries.map(([key, url]) => {
        const Icon = socialIcons[key];
        return (
          <a
            key={key}
            href={url as string}
            target="_blank"
            rel="noreferrer"
            aria-label={key}
            title={key}
            className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}

export function SocialSchema() {
  const { content } = useContent();
  const socialUrls = Object.values(content.social || {}).filter((url) => typeof url === "string" && url.trim() !== "");
  if (socialUrls.length === 0) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: `${content.brand.name} ${content.brand.accentName}`.trim() || "MG Woodscare",
    url: "https://www.mg-woodscare.de/",
    sameAs: socialUrls,
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

const nav = [
  { to: "/leistungen", label: "Leistungen" },
  { to: "/#ueber-uns", label: "Über uns", hash: "ueber-uns" },
  { to: "/referenzen", label: "Referenzen" },
  { to: "/kontakt", label: "Kontakt" },
];

function handleHashScroll(hash: string) {
  setTimeout(() => {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, 50);
}

export function SiteHeader() {
  const { content } = useContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const hairlineColor = content.hairline?.color || "hsl(var(--primary))";
  const hairlineOpacity = content.hairline?.opacity ?? 1;
  const hairlineThickness = content.hairline?.thickness ?? 0.5;
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div
        className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
        style={{
          height: `${hairlineThickness}px`,
          backgroundImage: `linear-gradient(to right, transparent, ${hairlineColor}, transparent)`,
          opacity: hairlineOpacity,
        }}
      />
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
          {nav.map((n) =>
            n.hash ? (
              <Link
                key={n.to}
                to="/"
                onClick={() => handleHashScroll(n.hash)}
                className="transition-colors hover:text-primary"
              >
                {n.label}
              </Link>
            ) : (
              <Link key={n.to} to={n.to} className="transition-colors hover:text-primary">
                {n.label}
              </Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <SocialLinks className="hidden sm:flex" />
          <ThemeToggle />
          <Link
            to="/kontakt"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <Phone className="h-4 w-4" /> Angebot
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/60 hover:text-primary md:hidden"
            aria-label="Menü öffnen"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xl md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-4 right-4 top-24 rounded-3xl border border-border bg-card/95 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-end">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                aria-label="Menü schließen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="mt-2 grid grid-cols-2 gap-3">
              {nav.map((n) =>
                n.hash ? (
                  <Link
                    key={n.to}
                    to="/"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleHashScroll(n.hash);
                    }}
                    className="rounded-2xl border border-border bg-card/50 px-4 py-5 text-center text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {n.label}
                  </Link>
                ) : (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl border border-border bg-card/50 px-4 py-5 text-center text-sm font-semibold uppercase tracking-wider text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    {n.label}
                  </Link>
                )
              )}
              <Link
                to="/kontakt"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <Phone className="h-4 w-4" /> Angebot
              </Link>
            </nav>
            <div className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-card/50 p-4">
              <span className="text-sm font-medium">Erscheinungsbild</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { content } = useContent();
  const [showLogoModal, setShowLogoModal] = useState(false);
  const hairlineColor = content.hairline?.color || "hsl(var(--primary))";
  const hairlineOpacity = content.hairline?.opacity ?? 1;
  const hairlineThickness = content.hairline?.thickness ?? 0.5;
  return (
    <footer className="relative bg-background">
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: `${hairlineThickness}px`,
          backgroundImage: `linear-gradient(to right, transparent, ${hairlineColor}, transparent)`,
          opacity: hairlineOpacity,
        }}
      />
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
          <SocialLinks />
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
          <SsrStatus />
        </div>
      </div>
    </footer>
  );
}
