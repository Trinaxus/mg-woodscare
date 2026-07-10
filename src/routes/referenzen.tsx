import { createFileRoute, Link } from "@tanstack/react-router";
import { Leaf, BadgeCheck } from "lucide-react";

import heroForest from "@/assets/hero-forest.jpg";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ContentBackground } from "@/components/BackgroundPattern";
import { ParallaxImage } from "@/components/ParallaxImage";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/referenzen")({
  head: () => ({
    meta: [
      { title: "Referenzen – MG Woodscare Baumpflege & Sägewerk Leipzig" },
      {
        name: "description",
        content: "Erfolgreiche Baumpflege-Projekte in Leipzig und Umgebung. Kundenreferenzen und zufriedene Kunden aus 15+ Jahren Erfahrung.",
      },
      { name: "keywords", content: "Baumpflege Referenzen Leipzig, Kundenbewertungen, Baumpflege Projekte, zufriedene Kunden" },
    ],
  }),
  component: ReferenzenPage,
});

function ReferenzenPage() {
  const { content } = useContent();
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden pt-24">
          <ParallaxImage
            src={content.referenzen.image || heroForest}
            alt="Waldlandschaft"
            width={1920}
            height={1280}
            className="absolute inset-0 -z-10 h-[120%] w-full object-cover object-top"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-forest" />
          <div className="mx-auto grid min-h-[50vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur">
                <Leaf className="h-3.5 w-3.5" /> Referenzen
              </span>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
                {content.referenzen.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-foreground/85 md:text-xl">
                Erfolgreiche Projekte in Leipzig und Umgebung aus über 15 Jahren Erfahrung.
              </p>
            </div>
          </div>
        </section>

        <ContentBackground>
        {/* REFERENZEN */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {content.referenzen.items.map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="absolute -right-10 top-5 rotate-45 bg-primary px-12 py-1 text-center text-xs font-semibold text-primary-foreground shadow-sm">
                    <span className="inline-flex items-center gap-1">
                      <BadgeCheck className="h-3 w-3" /> Top
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{item.title}</h3>
                  <p className="mt-3 text-foreground/75">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Werden Sie unser nächster zufriedener Kunde
            </h2>
            <p className="mt-4 text-lg text-foreground/75">
              Kontaktieren Sie uns für ein kostenloses Angebot.
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
        </ContentBackground>
      </main>

      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
