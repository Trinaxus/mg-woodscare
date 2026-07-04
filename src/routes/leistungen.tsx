import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TreeDeciduous,
  Axe,
  Sprout,
  Flame,
  Warehouse,
  ShieldCheck,
  Leaf,
  type LucideIcon,
} from "lucide-react";

import arboristImg from "@/assets/arborist.jpg";
import firewoodImg from "@/assets/firewood.jpg";
import sawmillImg from "@/assets/sawmill.jpg";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/leistungen")({
  head: () => ({
    meta: [
      { title: "Leistungen – MG Woodscare Baumpflege & Sägewerk Leipzig" },
      {
        name: "description",
        content: "Professionelle Baumpflege, Baumfällung, Seilklettertechnik SKT, Wurzelfräsung und Sägewerk in Leipzig. 15+ Jahre Erfahrung für Leipzig & Umland.",
      },
      { name: "keywords", content: "Baumpflege Leipzig, Baumfällung, Seilklettertechnik SKT, Wurzelfräsung, Sägewerk, Holzverarbeitung" },
    ],
  }),
  component: LeistungenPage,
});

const iconMap: Record<string, LucideIcon> = {
  TreeDeciduous,
  Axe,
  Sprout,
  Flame,
  Warehouse,
  ShieldCheck,
  Leaf,
};

function LeistungenPage() {
  const { content } = useContent();
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden pt-24">
          <img
            src={arboristImg}
            alt="Baumpfleger bei der Arbeit"
            width={1920}
            height={1280}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-forest" />
          <div className="mx-auto grid min-h-[50vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur">
                <Leaf className="h-3.5 w-3.5" /> Unsere Leistungen
              </span>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
                {content.leistungen.sectionTitle}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-foreground/85 md:text-xl">
                {content.leistungen.sectionText}
              </p>
            </div>
          </div>
        </section>

        {/* LEISTUNGEN */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {content.leistungen.items.map((item, index) => {
                const Icon = iconMap[item.icon] || Leaf;
                return (
                  <div
                    key={index}
                    className="group rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                    <p className="mt-3 text-foreground/75">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Benötigen Sie professionelle Baumpflege?
            </h2>
            <p className="mt-4 text-lg text-foreground/75">
              Wir beraten Sie gerne und erstellen ein kostenloses Angebot.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                Kontakt aufnehmen
              </a>
              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-medium backdrop-blur transition-colors hover:bg-card"
              >
                Zurück zur Startseite
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
