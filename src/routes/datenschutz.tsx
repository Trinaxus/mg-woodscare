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

function AutoLinkText({ text, phone, email }: { text: string; phone?: string; email?: string }) {
  if (!text) return null;
  let html = text;
  if (phone?.trim()) {
    const escaped = phone.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(escaped, "g"), `<a href="tel:${phone}" class="text-primary hover:underline">${phone}</a>`);
  }
  if (email?.trim()) {
    const escaped = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(new RegExp(escaped, "g"), `<a href="mailto:${email}" class="text-primary hover:underline">${email}</a>`);
  }
  // eslint-disable-next-line react/no-danger
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function DatenschutzPage() {
  const { content } = useContent();
  const d = content.datenschutz;
  const phone = content.kontakt?.phone || "";
  const email = content.kontakt?.email || "";
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
              <AutoLinkText text={d.intro} phone={phone} email={email} />
            </Section>
            <Section title="Verantwortlich">
              <AutoLinkText text={d.verantwortlich} phone={phone} email={email} />
            </Section>
            <Section title="Hosting">
              <AutoLinkText text={d.hosting} phone={phone} email={email} />
            </Section>
            <Section title="Server-Logfiles">
              <AutoLinkText text={d.serverLog} phone={phone} email={email} />
            </Section>
            <Section title="Kontaktformular & E-Mail">
              <AutoLinkText text={d.kontaktformular} phone={phone} email={email} />
            </Section>
            <Section title="Cookies">
              <AutoLinkText text={d.cookies} phone={phone} email={email} />
            </Section>
            <Section title="Ihre Rechte">
              <AutoLinkText text={d.rechte} phone={phone} email={email} />
            </Section>
            <Section title="Datenschutz-Ansprechpartner">
              <AutoLinkText text={d.kontaktStelle} phone={phone} email={email} />
            </Section>
          </div>
        </ContentBackground>
      </main>
      <SiteFooter />
      <ScrollToTop />
    </div>
  );
}
