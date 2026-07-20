import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Leaf } from "lucide-react";

import heroForest from "@/assets/hero-forest.jpg";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ContentBackground } from "@/components/BackgroundPattern";
import { ParallaxImage } from "@/components/ParallaxImage";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt – MG Woodscare Baumpflege & Sägewerk Leipzig" },
      {
        name: "description",
        content: "Kontaktieren Sie MG Woodscare für professionelle Baumpflege in Leipzig. Telefon, E-Mail, Adresse und Kontaktformular. Notdienst 24/7.",
      },
      { name: "keywords", content: "Baumpflege Kontakt Leipzig, Baumpflege Telefon, Notdienst Baumpflege, Kontaktformular" },
    ],
  }),
  component: KontaktPage,
});

function KontaktPage() {
  const { content } = useContent();
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative isolate overflow-hidden pt-24">
          <ParallaxImage
            src={content.kontakt.image || heroForest}
            alt="Waldlandschaft"
            width={1920}
            height={1280}
            className="absolute inset-0 -z-10 h-[120%] w-full object-cover object-top"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-forest" />
          <div className="mx-auto grid min-h-[50vh] max-w-7xl items-center px-6 py-24">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary backdrop-blur">
                <Leaf className="h-3.5 w-3.5" /> Kontakt
              </span>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-balance md:text-7xl">
                {content.kontakt.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-foreground/85 md:text-xl">
                {content.kontakt.text}
              </p>
            </div>
          </div>
        </section>

        <ContentBackground>
        {/* ABLAUF */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">
              {content.kontakt.processTitle}
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {content.kontakt.processSteps.map((step) => (
                <div key={step.number} className="relative rounded-3xl border border-border bg-card p-6 shadow-card">
                  <div className="font-display text-4xl font-semibold text-primary/40">
                    {step.number}
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm text-foreground/75 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* KONTAKT INFO */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">Telefon</h3>
                <a
                  href={`tel:${content.kontakt.phone}`}
                  className="mt-3 block text-foreground/75 transition-colors hover:text-primary"
                >
                  {content.kontakt.phone}
                </a>
                <p className="mt-2 text-sm text-muted-foreground">Notdienst 24/7</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">E-Mail</h3>
                <a
                  href={`mailto:${content.kontakt.email}`}
                  className="mt-3 block text-foreground/75 transition-colors hover:text-primary"
                >
                  {content.kontakt.email}
                </a>
                <p className="mt-2 text-sm text-muted-foreground">Antwort innerhalb 24h</p>
              </div>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">Standort</h3>
                <p className="mt-3 text-foreground/75">{content.kontakt.address}</p>
                <p className="mt-2 text-sm text-muted-foreground">Leipzig & Umland</p>
              </div>
            </div>
          </div>
        </section>

        {/* GOOGLE MAPS */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <h2 className="font-display text-3xl font-semibold text-center md:text-4xl">
              Unser Standort
            </h2>
            <p className="mt-4 text-center text-lg text-foreground/75">
              {content.kontakt.address}
            </p>
            <div className="mt-8 overflow-hidden rounded-3xl border border-border shadow-card">
              <div className="relative">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(content.kontakt.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="450"
                  style={{ border: 0, filter: 'sepia(0.3) hue-rotate(10deg) saturate(0.8) brightness(0.95)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="MG Woodscare Standort"
                />
              </div>
            </div>
          </div>
        </section>

        {/* KONTAKTFORMULAR */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-3xl px-6 py-20">
            <h2 className="font-display text-3xl font-semibold text-center md:text-4xl">
              Nachricht senden
            </h2>
            <form className="mt-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Name</label>
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="Ihr Name"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">E-Mail</label>
                  <input
                    type="email"
                    className="w-full rounded-2xl border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
                    placeholder="ihre@email.de"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Betreff</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="Ihr Anliegen"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Nachricht</label>
                <textarea
                  rows={5}
                  className="w-full rounded-2xl border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
                  placeholder="Ihre Nachricht..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Nachricht senden
              </button>
              <p className="text-center text-xs text-muted-foreground">
                Dieses Formular ist eine Demo – Nachrichten werden derzeit nicht versendet.
              </p>
            </form>
          </div>
        </section>

        {/* CTA */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 py-20 text-center">
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Dringende Anliegen?
            </h2>
            <p className="mt-4 text-lg text-foreground/75">
              Unser Notdienst ist 24/7 für Sie erreichbar.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${content.kontakt.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]"
              >
                <Phone className="h-4 w-4" /> {content.kontakt.phone}
              </a>
              <a
                href={`mailto:${content.kontakt.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 font-medium backdrop-blur transition-colors hover:bg-card"
              >
                <Mail className="h-4 w-4" /> {content.kontakt.email}
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
