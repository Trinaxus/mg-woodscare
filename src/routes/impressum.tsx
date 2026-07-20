import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ContentBackground } from "@/components/BackgroundPattern";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum – MG Woodscare Baumpflegedienst Leipzig" },
      { name: "description", content: "Impressum von MG Woodscare Baumpflegedienst Leipzig. Rechtliche Angaben gemäß § 5 TMG: Heiko Merkel, Heckenweg 16, 04349 Leipzig." },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: ImpressumPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold text-primary">{title}</h2>
      <div className="mt-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function ImpressumPage() {
  const { content } = useContent();
  const i = content.impressum;
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <ContentBackground className="flex-1 pb-24 pt-40">
          <div className="mx-auto max-w-3xl px-6">
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              Rechtliches
            </span>
            <h1 className="mt-3 font-display text-5xl font-semibold">Impressum</h1>

            <Section title="Angaben gemäß § 5 TMG">
              <p>{i.owner}</p>
              <p>{i.company}</p>
              <p>{i.street}</p>
              <p>{i.city}</p>
            </Section>

            <Section title="Kontakt">
              <p>
                Telefon:{" "}
                <a href={`tel:${i.phone}`} className="hover:text-primary">
                  {i.phone}
                </a>
              </p>
              <p>
                E-Mail:{" "}
                <a href={`mailto:${i.email}`} className="hover:text-primary">
                  {i.email}
                </a>
              </p>
            </Section>

            <Section title="Registereintrag">
              <p>{i.register}</p>
              <p>Registergericht: {i.registerCourt}</p>
              <p>Registernummer: {i.registerNumber}</p>
            </Section>

            <Section title="Umsatzsteuer-ID">
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
              <p className="font-medium text-foreground">{i.vatId}</p>
            </Section>

            <Section title="Haftung für Inhalte">
              <p>{i.haftungInhalte}</p>
            </Section>

            <Section title="Haftung für Links">
              <p>{i.haftungLinks}</p>
            </Section>

            <Section title="Urheberrecht">
              <p>{i.urheberrecht}</p>
            </Section>

            <p className="mt-16 text-xs text-muted-foreground">Quelle: e-recht24.de</p>
          </div>
        </ContentBackground>
      </main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
