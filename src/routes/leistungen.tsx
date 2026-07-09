import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TreeDeciduous,
  TreePine,
  Axe,
  Hammer,
  Wrench,
  Scissors,
  Truck,
  Droplets,
  Wind,
  Sun,
  Snowflake,
  Umbrella,
  Flame,
  Leaf,
  Sprout,
  Flower,
  Trees,
  Warehouse,
  Factory,
  Home,
  Building,
  ShieldCheck,
  Shield,
  BadgeCheck,
  HardHat,
  Ruler,
  Recycle,
  Trash2,
  type LucideIcon,
} from "lucide-react";

import arboristImg from "@/assets/arborist.jpg";
import firewoodImg from "@/assets/firewood.jpg";
import sawmillImg from "@/assets/sawmill.jpg";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollReveal, HeroReveal } from "@/components/ScrollReveal";
import { ContentBackground } from "@/components/BackgroundPattern";
import { ParallaxImage } from "@/components/ParallaxImage";
import { useContent } from "@/lib/content";
import { defaultContent } from "@/data/defaultContent";

export const Route = createFileRoute("/leistungen")({
  head: () => {
    const meta: ({ title: string } | { name: string; content: string })[] = [
      { title: "Leistungen – MG Woodscare Baumpflege & Sägewerk Leipzig" },
    ];
    if (defaultContent.seo?.leistungenDescription?.trim()) {
      meta.push({ name: "description", content: defaultContent.seo.leistungenDescription.trim() });
    }
    if (defaultContent.seo?.leistungenKeywords?.trim()) {
      meta.push({ name: "keywords", content: defaultContent.seo.leistungenKeywords.trim() });
    }
    return { meta };
  },
  component: LeistungenPage,
});

const iconMap: Record<string, LucideIcon> = {
  TreeDeciduous,
  TreePine,
  Axe,
  Hammer,
  Wrench,
  Scissors,
  Truck,
  Droplets,
  Wind,
  Sun,
  Snowflake,
  Umbrella,
  Flame,
  Leaf,
  Sprout,
  Flower,
  Trees,
  Warehouse,
  Factory,
  Home,
  Building,
  ShieldCheck,
  Shield,
  BadgeCheck,
  HardHat,
  Ruler,
  Recycle,
  Trash2,
};

function LeistungenPage() {
  const { content } = useContent();
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        {/* HERO */}
        <section className="relative isolate overflow-hidden pt-24">
          <ParallaxImage
            src={arboristImg}
            alt="Baumpfleger bei der Arbeit"
            width={1920}
            height={1280}
            className="absolute inset-0 -z-10 h-[120%] w-full object-cover object-top"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-forest" />
          <div className="mx-auto grid min-h-[50vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-3xl">
              <HeroReveal delay={0}>
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur">
                  <Leaf className="h-3.5 w-3.5" /> Unsere Leistungen
                </span>
              </HeroReveal>
              <HeroReveal delay={150}>
                <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
                  {content.leistungen.sectionTitle}
                </h1>
              </HeroReveal>
              <HeroReveal delay={300}>
                <p className="mt-6 max-w-xl text-lg text-foreground/85 md:text-xl">
                  {content.leistungen.sectionText}
                </p>
              </HeroReveal>
            </div>
          </div>
        </section>

        <ContentBackground className="flex-1">
        {/* LEISTUNGEN */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {content.leistungen.items.map((item, index) => {
                const Icon = iconMap[item.icon] || Leaf;
                return (
                  <ScrollReveal key={index} delay={(index % 6) * 100}>
                    <div className="group h-full rounded-3xl border border-border bg-card p-8 shadow-card transition-all hover:scale-[1.02] hover:shadow-lg">
                      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                      <p className="mt-3 text-foreground/75">{item.text}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <ScrollReveal>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">
                Benötigen Sie professionelle Baumpflege?
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="mt-4 text-lg text-foreground/75">
                Wir beraten Sie gerne und erstellen ein kostenloses Angebot.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={200}>
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
            </ScrollReveal>
          </div>
        </section>
        </ContentBackground>
      </main>

      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
