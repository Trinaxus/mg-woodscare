import { createFileRoute } from "@tanstack/react-router";
import {
  TreeDeciduous,
  Axe,
  Sprout,
  Flame,
  Warehouse,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Leaf,
  Instagram,
  type LucideIcon,
} from "lucide-react";

import heroForest from "@/assets/hero-forest.jpg";
import sawmillImg from "@/assets/sawmill.jpg";
import arboristImg from "@/assets/arborist.jpg";
import firewoodImg from "@/assets/firewood.jpg";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ScrollReveal, HeroReveal } from "@/components/ScrollReveal";
import { TeamAvatar } from "@/components/TeamAvatar";
import { InstagramFeed } from "@/components/InstagramFeed";
import { ContentBackground } from "@/components/BackgroundPattern";
import { ParallaxImage } from "@/components/ParallaxImage";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MG Woodscare – Baumpflege & Sägewerk Leipzig" },
      {
        name: "description",
        content: "Professionelle Baumpflege, Baumfällung, Seilklettertechnik SKT und Sägewerk in Leipzig. 15+ Jahre Erfahrung. Notdienst 24/7 für Leipzig & Umland.",
      },
    ],
  }),
  component: LandingPage,
});

const iconMap: Record<string, LucideIcon> = {
  TreeDeciduous,
  Axe,
  Sprout,
  Flame,
  Warehouse,
  ShieldCheck,
  Leaf,
  Horse: Sprout, // Lucide hat kein Pferd – nutzen Sprout als Naturersatz
};

function LandingPage() {
  const { content } = useContent();
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <SiteHeader />

      <main className="flex flex-1 flex-col">
      {/* HERO */}
      <section id="top" className="relative isolate overflow-hidden pt-24">
        <ParallaxImage
          src={heroForest}
          alt="Sonnenstrahlen fallen durch einen dichten Nadelwald"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-10 h-[120%] w-full object-cover object-top"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-forest" />
        <div className="mx-auto grid min-h-[85vh] max-w-7xl items-center px-6 py-24">
          <div className="max-w-3xl">
            <HeroReveal delay={0}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur">
                <Leaf className="h-3.5 w-3.5" /> {content.hero.eyebrow}
              </span>
            </HeroReveal>
            <HeroReveal delay={150}>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
                {content.hero.titleLead}{" "}
                <span className="italic text-primary">{content.hero.titleAccent}</span>{" "}
                {content.hero.titleTail}
              </h1>
            </HeroReveal>
            <HeroReveal delay={300}>
              <p className="mt-6 max-w-xl text-lg text-foreground/85 md:text-xl">
                {content.hero.subtitle}
              </p>
            </HeroReveal>
            <HeroReveal delay={450}>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="/leistungen"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
                >
                  {content.hero.ctaPrimary}
                </a>
                <a
                  href="/kontakt"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-medium backdrop-blur transition-colors hover:bg-card"
                >
                  {content.hero.ctaSecondary}
                </a>
              </div>
            </HeroReveal>
          </div>
        </div>
      </section>

      <ContentBackground className="flex-1">
      {/* STATS */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-border md:grid-cols-4 md:divide-x">
          {content.stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 100}>
              <div className="px-6 py-10 text-center">
                <div className="font-display text-4xl font-semibold text-primary md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ÜBER UNS */}
      <section id="ueber-uns" className="relative overflow-hidden border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-2 lg:items-center">
          <ScrollReveal direction="left">
            <div className="relative">
              <img
                src={arboristImg}
                alt="Baumkletterer bei der Arbeit hoch oben in einer Kiefer"
                width={1280}
                height={960}
                loading="lazy"
                className="rounded-3xl object-cover shadow-deep"
              />
              <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-border bg-card px-6 py-5 shadow-card md:block">
                <p className="font-display text-3xl text-primary">{content.ueberUns.certLabel}</p>
                <p className="text-sm text-muted-foreground">{content.ueberUns.certSub}</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={150}>
            <div>
              <span className="text-xs font-medium uppercase tracking-widest text-primary">
                Über uns
              </span>
              <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
                {content.ueberUns.title}
              </h2>
              <p className="mt-6 text-muted-foreground">{content.ueberUns.intro}</p>
              <p className="mt-4 text-muted-foreground">{content.ueberUns.intro2}</p>
              <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
                {content.ueberUns.badges.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* TEAM */}
        <div className="mx-auto max-w-7xl px-6 pb-24">
          <ScrollReveal>
            <h3 className="font-display text-2xl font-semibold">Unser Team</h3>
          </ScrollReveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.ueberUns.team.map((m, i) => (
              <ScrollReveal key={m.name} delay={i * 100}>
                <div className="h-full rounded-2xl border border-border bg-background/60 p-6">
                  <div className="flex items-center gap-4">
                    <TeamAvatar name={m.name} image={m.image} size="lg" />
                    <div className="min-w-0">
                      <p className="font-display text-xl font-semibold">{m.name}</p>
                      <span className="text-xs uppercase tracking-widest text-primary">{m.role}</span>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    {m.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SÄGEWERK / BRENNHOLZ */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-8 md:grid-cols-2">
          <ScrollReveal>
            <FeatureCard image={sawmillImg} {...content.features.sawmill} />
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <FeatureCard image={firewoodImg} {...content.features.firewood} />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Professionelle Baumpflege in Leipzig
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="mt-4 text-lg text-foreground/75">
              15+ Jahre Erfahrung, Notdienst 24/7, nachhaltige Holzverarbeitung
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="/leistungen"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                Unsere Leistungen
              </a>
              <a
                href="/referenzen"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-medium backdrop-blur transition-colors hover:bg-card"
              >
                Unsere Referenzen
              </a>
              <a
                href="/kontakt"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-medium backdrop-blur transition-colors hover:bg-card"
              >
                Kontakt aufnehmen
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <InstagramFeed />
      </ContentBackground>
      </main>

      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}

function FeatureCard({
  image,
  eyebrow,
  title,
  text,
}: {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={image}
          alt={title}
          width={1280}
          height={960}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-card/70 via-card/10 to-transparent" />
      </div>
      <div className="p-8">
        <span className="text-xs font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
        <h3 className="mt-2 font-display text-2xl font-semibold md:text-3xl">{title}</h3>
        <p className="mt-3 text-muted-foreground">{text}</p>
      </div>
    </article>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </>
  );
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-start gap-4 transition-colors hover:text-primary"
      >
        {inner}
      </a>
    );
  }
  return <div className="flex items-start gap-4">{inner}</div>;
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}
