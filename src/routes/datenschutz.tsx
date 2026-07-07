import { createFileRoute } from "@tanstack/react-router";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ContentBackground } from "@/components/BackgroundPattern";
import { useContent } from "@/lib/content";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung – MG Woodscare Baumpflegedienst Leipzig" },
      { name: "description", content: "Datenschutzerklärung von MG Woodscare Baumpflegedienst Leipzig. Informationen zur Datenverarbeitung, Server-Logfiles, Kontaktformular und Ihre Rechte." },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: DatenschutzPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold text-primary">{title}</h2>
      <div className="mt-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function DatenschutzPage() {
  const { content } = useContent();
  const d = content.datenschutz;
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <ContentBackground className="flex-1 pb-24 pt-40">
          <div className="mx-auto max-w-3xl px-6">
            <span className="text-xs font-medium uppercase tracking-widest text-primary">
              Rechtliches
            </span>
            <h1 className="mt-3 font-display text-5xl font-semibold">Datenschutz&shy;erklärung</h1>

            <Section title="Allgemeines">
              <p>{d.intro}</p>
            </Section>
            <Section title="Verantwortlich">
              <p>{d.verantwortlich}</p>
            </Section>
            <Section title="Server-Logfiles">
              <p>{d.serverLog}</p>
            </Section>
            <Section title="Kontaktformular & E-Mail">
              <p>{d.kontaktformular}</p>
            </Section>
            <Section title="Cookies">
              <p>{d.cookies}</p>
            </Section>
            <Section title="Ihre Rechte">
              <p>{d.rechte}</p>
            </Section>
            <Section title="Datenschutz-Ansprechpartner">
              <p>{d.kontaktStelle}</p>
            </Section>
          </div>
        </ContentBackground>
      </main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
