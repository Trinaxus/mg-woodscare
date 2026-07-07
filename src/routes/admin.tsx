import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Download, Upload, LogOut, RotateCcw, Save, KeyRound, Cloud } from "lucide-react";

import { SiteFooter } from "@/components/SiteChrome";
import { ThemeToggle } from "@/components/ThemeToggle";
import { api } from "@/lib/api";
import { useContent, DEFAULT_ADMIN_PASSWORD } from "@/lib/content";
import { defaultContent, type SiteContent } from "@/data/defaultContent";
import logo from "@/assets/logo_005.png";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin – MG Woodscare" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  { id: "brand", label: "Marke" },
  { id: "hero", label: "Hero" },
  { id: "stats", label: "Zahlen" },
  { id: "leistungen", label: "Leistungen" },
  { id: "ueberUns", label: "Über uns / Team" },
  { id: "features", label: "Sägewerk / Brennholz" },
  { id: "referenzen", label: "Referenzen" },
  { id: "kontakt", label: "Kontakt" },
  { id: "instagram", label: "Instagram" },
  { id: "impressum", label: "Impressum" },
  { id: "datenschutz", label: "Datenschutz" },
  { id: "einstellungen", label: "Einstellungen" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AdminPage() {
  const { isAdminAuthed } = useContent();
  if (!isAdminAuthed) return <LoginScreen />;
  return <AdminDashboard />;
}

function LoginScreen() {
  const { loginAdmin, adminPassword } = useContent();
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loginAdmin(pass)) setError("Falsches Passwort.");
        }}
        className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-card"
      >
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="MG Woodscare Logo"
            className="h-10 w-10 rounded-full object-cover shadow-glow"
          />
          <div>
            <p className="font-display text-2xl font-semibold">MG Woodscare · Admin</p>
            <p className="text-xs text-muted-foreground">Content-Verwaltung</p>
          </div>
        </div>
        <label className="mt-8 block">
          <span className="mb-2 block text-sm font-medium">Passwort</span>
          <input
            type="password"
            autoFocus
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setError(null);
            }}
            className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </label>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          <KeyRound className="h-4 w-4" /> Anmelden
        </button>
        {adminPassword === DEFAULT_ADMIN_PASSWORD && (
          <p className="mt-4 text-xs text-muted-foreground">
            Standard-Passwort: <code className="rounded bg-muted px-1.5 py-0.5">{DEFAULT_ADMIN_PASSWORD}</code>{" "}
            – bitte nach erstem Login unter „Einstellungen" ändern.
          </p>
        )}
        <div className="mt-6 flex justify-between text-xs">
          <Link to="/" className="text-muted-foreground hover:text-primary">
            ← Zur Website
          </Link>
        </div>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const { content, resetContent, logoutAdmin, apiMode, saveToApi, loadFromApi } = useContent();
  const [draft, setDraft] = useState<SiteContent>(content);
  const [tab, setTab] = useState<TabId>("hero");
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingTeamIndex, setUploadingTeamIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
  };

  const uploadTeamImage = async (index: number, file: File) => {
    setUploadingTeamIndex(index);
    try {
      const response = await api.uploadImage(file, "team");
      const team = [...draft.ueberUns.team];
      team[index] = { ...team[index], image: response.url };
      update("ueberUns", { ...draft.ueberUns, team });
      setNotice("Team-Bild hochgeladen.");
    } catch (error) {
      setNotice("Fehler beim Hochladen des Bildes.");
    } finally {
      setUploadingTeamIndex(null);
      setTimeout(() => setNotice(null), 2500);
    }
  };

  const save = async () => {
    setLoading(true);
    try {
      await saveToApi(draft);
      setNotice("Per API gespeichert!");
      setDirty(false);
      setTimeout(() => setNotice(null), 2500);
    } catch (error) {
      setNotice("Fehler beim Speichern!");
      setTimeout(() => setNotice(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const doExport = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mgw-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as SiteContent;
        setDraft({ ...defaultContent, ...parsed });
        setDirty(true);
        setNotice("Import erfolgreich – bitte Speichern klicken.");
      } catch {
        setNotice("Import fehlgeschlagen: ungültiges JSON.");
      }
      setTimeout(() => setNotice(null), 3500);
    };
    reader.readAsText(file);
  };

  const reset = () => {
    if (!confirm("Alle Inhalte auf Standardwerte zurücksetzen?")) return;
    resetContent();
    setDraft(defaultContent);
    setDirty(false);
    setNotice("Auf Standard zurückgesetzt.");
    setTimeout(() => setNotice(null), 2500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <img
                src={logo}
                alt="MG Woodscare Logo"
                className="h-12 w-12 rounded-full object-cover shadow-glow"
              />
            </Link>
            <div>
              <p className="font-display text-lg font-semibold leading-none">Admin</p>
              <p className="text-xs text-muted-foreground">MG Woodscare Content</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {notice && (
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
                {notice}
              </span>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) doImport(f);
                e.target.value = "";
              }}
            />
            <ToolbarBtn onClick={() => fileRef.current?.click()} icon={Upload} label="Importieren" />
            <ToolbarBtn onClick={doExport} icon={Download} label="Exportieren" />
            <ToolbarBtn onClick={reset} icon={RotateCcw} label="Zurücksetzen" />
            <span className="inline-flex items-center gap-2 rounded-full border border-primary bg-primary/10 px-3 py-2 text-xs font-medium text-primary">
              <Cloud className="h-3.5 w-3.5" /> API-Modus (aktiv)
            </span>
            <ThemeToggle />
            <button
              onClick={save}
              disabled={!dirty}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition disabled:opacity-40"
            >
              <Save className="h-4 w-4" /> Speichern
            </button>
            <ToolbarBtn onClick={logoutAdmin} icon={LogOut} label="Logout" />
            <Link
              to="/"
              className="rounded-full border border-border px-4 py-2 text-sm hover:border-primary/60"
            >
              Vorschau ↗
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-10">
        {tab === "brand" && (
          <Card title="Marke">
            <TextField label="Name" value={draft.brand.name} onChange={(v) => update("brand", { ...draft.brand, name: v })} />
            <TextField label="Akzent-Name" value={draft.brand.accentName} onChange={(v) => update("brand", { ...draft.brand, accentName: v })} />
            <TextField label="Tagline" value={draft.brand.tagline} onChange={(v) => update("brand", { ...draft.brand, tagline: v })} />
            <TextField label="Standort" value={draft.brand.location} onChange={(v) => update("brand", { ...draft.brand, location: v })} />
          </Card>
        )}

        {tab === "hero" && (
          <Card title="Hero-Bereich">
            <TextField label="Eyebrow / kleine Zeile" value={draft.hero.eyebrow} onChange={(v) => update("hero", { ...draft.hero, eyebrow: v })} />
            <TextField label="Titel – Anfang" value={draft.hero.titleLead} onChange={(v) => update("hero", { ...draft.hero, titleLead: v })} />
            <TextField label="Titel – Akzentwort" value={draft.hero.titleAccent} onChange={(v) => update("hero", { ...draft.hero, titleAccent: v })} />
            <TextField label="Titel – Ende" value={draft.hero.titleTail} onChange={(v) => update("hero", { ...draft.hero, titleTail: v })} />
            <TextArea label="Untertitel" value={draft.hero.subtitle} onChange={(v) => update("hero", { ...draft.hero, subtitle: v })} />
            <TextField label="Button primär" value={draft.hero.ctaPrimary} onChange={(v) => update("hero", { ...draft.hero, ctaPrimary: v })} />
            <TextField label="Button sekundär" value={draft.hero.ctaSecondary} onChange={(v) => update("hero", { ...draft.hero, ctaSecondary: v })} />
          </Card>
        )}

        {tab === "stats" && (
          <Card title="Kennzahlen">
            <ListEditor
              items={draft.stats}
              onChange={(items) => update("stats", items)}
              blank={{ value: "", label: "" }}
              render={(item, set) => (
                <div className="grid gap-3 md:grid-cols-2">
                  <TextField label="Wert" value={item.value} onChange={(v) => set({ ...item, value: v })} />
                  <TextField label="Label" value={item.label} onChange={(v) => set({ ...item, label: v })} />
                </div>
              )}
            />
          </Card>
        )}

        {tab === "leistungen" && (
          <Card title="Leistungen">
            <TextField label="Abschnittstitel" value={draft.leistungen.sectionTitle} onChange={(v) => update("leistungen", { ...draft.leistungen, sectionTitle: v })} />
            <TextArea label="Abschnittstext" value={draft.leistungen.sectionText} onChange={(v) => update("leistungen", { ...draft.leistungen, sectionText: v })} />
            <div className="mt-6 h-px bg-border" />
            <p className="mt-6 text-sm font-medium">Einzelne Leistungen</p>
            <ListEditor
              items={draft.leistungen.items}
              onChange={(items) => update("leistungen", { ...draft.leistungen, items })}
              blank={{ icon: "Leaf", title: "", text: "" }}
              render={(item, set) => (
                <div className="grid gap-3">
                  <div className="grid gap-3 md:grid-cols-[160px_1fr]">
                    <TextField label="Icon" value={item.icon} onChange={(v) => set({ ...item, icon: v })} placeholder="z.B. TreeDeciduous" />
                    <TextField label="Titel" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                  </div>
                  <TextArea label="Text" value={item.text} onChange={(v) => set({ ...item, text: v })} />
                </div>
              )}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Verfügbare Icons: TreeDeciduous, Axe, Sprout, Flame, Warehouse, ShieldCheck, Leaf
            </p>
          </Card>
        )}

        {tab === "ueberUns" && (
          <Card title="Über uns & Team">
            <TextField label="Titel" value={draft.ueberUns.title} onChange={(v) => update("ueberUns", { ...draft.ueberUns, title: v })} />
            <TextArea label="Einleitung" value={draft.ueberUns.intro} onChange={(v) => update("ueberUns", { ...draft.ueberUns, intro: v })} />
            <TextArea label="Einleitung 2" value={draft.ueberUns.intro2} onChange={(v) => update("ueberUns", { ...draft.ueberUns, intro2: v })} />
            <TextField label="Zertifikat-Label" value={draft.ueberUns.certLabel} onChange={(v) => update("ueberUns", { ...draft.ueberUns, certLabel: v })} />
            <TextField label="Zertifikat-Untertext" value={draft.ueberUns.certSub} onChange={(v) => update("ueberUns", { ...draft.ueberUns, certSub: v })} />

            <p className="mt-6 text-sm font-medium">Qualifikations-Badges</p>
            <ListEditor
              items={draft.ueberUns.badges.map((b) => ({ v: b }))}
              onChange={(items) => update("ueberUns", { ...draft.ueberUns, badges: items.map((i) => i.v) })}
              blank={{ v: "" }}
              render={(item, set) => (
                <TextField label="Badge" value={item.v} onChange={(v) => set({ v })} />
              )}
            />

            <p className="mt-6 text-sm font-medium">Team-Mitglieder</p>
            <ListEditor
              items={draft.ueberUns.team}
              onChange={(items) => update("ueberUns", { ...draft.ueberUns, team: items })}
              blank={{ name: "", role: "", image: "", bullets: [] }}
              render={(item, set, index) => (
                <div className="grid gap-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <TextField label="Name" value={item.name} onChange={(v) => set({ ...item, name: v })} />
                    <TextField label="Rolle" value={item.role} onChange={(v) => set({ ...item, role: v })} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-full object-cover border border-border"
                      />
                    ) : (
                      <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
                        {item.name ? item.name.split(/\s+/).pop()?.charAt(0).toUpperCase() : "?"}
                      </div>
                    )}
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:bg-card">
                      <Upload className="h-4 w-4" />
                      {uploadingTeamIndex === index ? "Lade..." : "Bild wählen"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={uploadingTeamIndex === index}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file && index !== undefined) uploadTeamImage(index, file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {item.image && (
                      <button
                        type="button"
                        onClick={() => set({ ...item, image: "" })}
                        className="text-sm text-destructive hover:underline"
                      >
                        Bild entfernen
                      </button>
                    )}
                  </div>
                  <TextArea
                    label="Punkte (eine pro Zeile)"
                    value={item.bullets.join("\n")}
                    onChange={(v) => set({ ...item, bullets: v.split("\n").filter(Boolean) })}
                  />
                </div>
              )}
            />
          </Card>
        )}

        {tab === "features" && (
          <Card title="Sägewerk & Brennholz">
            <p className="text-sm font-medium">Sägewerk</p>
            <TextField label="Eyebrow" value={draft.features.sawmill.eyebrow} onChange={(v) => update("features", { ...draft.features, sawmill: { ...draft.features.sawmill, eyebrow: v } })} />
            <TextField label="Titel" value={draft.features.sawmill.title} onChange={(v) => update("features", { ...draft.features, sawmill: { ...draft.features.sawmill, title: v } })} />
            <TextArea label="Text" value={draft.features.sawmill.text} onChange={(v) => update("features", { ...draft.features, sawmill: { ...draft.features.sawmill, text: v } })} />
            <div className="my-6 h-px bg-border" />
            <p className="text-sm font-medium">Brennholz</p>
            <TextField label="Eyebrow" value={draft.features.firewood.eyebrow} onChange={(v) => update("features", { ...draft.features, firewood: { ...draft.features.firewood, eyebrow: v } })} />
            <TextField label="Titel" value={draft.features.firewood.title} onChange={(v) => update("features", { ...draft.features, firewood: { ...draft.features.firewood, title: v } })} />
            <TextArea label="Text" value={draft.features.firewood.text} onChange={(v) => update("features", { ...draft.features, firewood: { ...draft.features.firewood, text: v } })} />
          </Card>
        )}

        {tab === "referenzen" && (
          <Card title="Referenzen">
            <TextField label="Titel" value={draft.referenzen.title} onChange={(v) => update("referenzen", { ...draft.referenzen, title: v })} />
            <ListEditor
              items={draft.referenzen.items}
              onChange={(items) => update("referenzen", { ...draft.referenzen, items })}
              blank={{ title: "", text: "" }}
              render={(item, set) => (
                <div className="flex flex-col gap-3 w-full">
                  <TextField label="Titel" value={item.title} onChange={(v) => set({ ...item, title: v })} />
                  <TextArea label="Text" value={item.text} onChange={(v) => set({ ...item, text: v })} />
                </div>
              )}
            />
          </Card>
        )}

        {tab === "kontakt" && (
          <Card title="Kontakt">
            <TextField label="Titel" value={draft.kontakt.title} onChange={(v) => update("kontakt", { ...draft.kontakt, title: v })} />
            <TextArea label="Einleitungstext" value={draft.kontakt.text} onChange={(v) => update("kontakt", { ...draft.kontakt, text: v })} />
            <TextField label="Telefon" value={draft.kontakt.phone} onChange={(v) => update("kontakt", { ...draft.kontakt, phone: v })} />
            <TextField label="E-Mail" value={draft.kontakt.email} onChange={(v) => update("kontakt", { ...draft.kontakt, email: v })} />
            <TextField label="Adresse" value={draft.kontakt.address} onChange={(v) => update("kontakt", { ...draft.kontakt, address: v })} />
            <TextField label="Inhaber-Zeile" value={draft.kontakt.ownerLine} onChange={(v) => update("kontakt", { ...draft.kontakt, ownerLine: v })} />
          </Card>
        )}

        {tab === "instagram" && (
          <Card title="Instagram">
            <TextField label="Handle (mit @)" value={draft.instagram.handle} onChange={(v) => update("instagram", { ...draft.instagram, handle: v })} />
            <TextField label="Profil-URL" value={draft.instagram.url} onChange={(v) => update("instagram", { ...draft.instagram, url: v })} />
            <TextField label="Button-Label" value={draft.instagram.label} onChange={(v) => update("instagram", { ...draft.instagram, label: v })} />
            <p className="mt-4 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              Ein Live-Feed von Instagram benötigt die Instagram Graph API mit einem Access-Token.
              Aktuell verlinken wir auf das Profil und zeigen den Handle. Um echte Posts anzuzeigen,
              ergänze den entsprechenden Endpoint in deiner externen API und binde die Daten hier ein.
            </p>
          </Card>
        )}

        {tab === "impressum" && (
          <Card title="Impressum">
            <div className="grid gap-3 md:grid-cols-2">
              <TextField label="Firma" value={draft.impressum.company} onChange={(v) => update("impressum", { ...draft.impressum, company: v })} />
              <TextField label="Inhaber" value={draft.impressum.owner} onChange={(v) => update("impressum", { ...draft.impressum, owner: v })} />
              <TextField label="Straße" value={draft.impressum.street} onChange={(v) => update("impressum", { ...draft.impressum, street: v })} />
              <TextField label="PLZ + Ort" value={draft.impressum.city} onChange={(v) => update("impressum", { ...draft.impressum, city: v })} />
              <TextField label="Telefon" value={draft.impressum.phone} onChange={(v) => update("impressum", { ...draft.impressum, phone: v })} />
              <TextField label="E-Mail" value={draft.impressum.email} onChange={(v) => update("impressum", { ...draft.impressum, email: v })} />
              <TextField label="Registergericht" value={draft.impressum.registerCourt} onChange={(v) => update("impressum", { ...draft.impressum, registerCourt: v })} />
              <TextField label="Registernummer" value={draft.impressum.registerNumber} onChange={(v) => update("impressum", { ...draft.impressum, registerNumber: v })} />
              <TextField label="USt-ID" value={draft.impressum.vatId} onChange={(v) => update("impressum", { ...draft.impressum, vatId: v })} />
            </div>
            <TextArea label="Haftung für Inhalte" value={draft.impressum.haftungInhalte} onChange={(v) => update("impressum", { ...draft.impressum, haftungInhalte: v })} rows={6} />
            <TextArea label="Haftung für Links" value={draft.impressum.haftungLinks} onChange={(v) => update("impressum", { ...draft.impressum, haftungLinks: v })} rows={6} />
            <TextArea label="Urheberrecht" value={draft.impressum.urheberrecht} onChange={(v) => update("impressum", { ...draft.impressum, urheberrecht: v })} rows={6} />
          </Card>
        )}

        {tab === "datenschutz" && (
          <Card title="Datenschutz">
            <TextArea label="Einleitung" value={draft.datenschutz.intro} onChange={(v) => update("datenschutz", { ...draft.datenschutz, intro: v })} rows={5} />
            <TextArea label="Verantwortlich" value={draft.datenschutz.verantwortlich} onChange={(v) => update("datenschutz", { ...draft.datenschutz, verantwortlich: v })} />
            <TextArea label="Server-Logfiles" value={draft.datenschutz.serverLog} onChange={(v) => update("datenschutz", { ...draft.datenschutz, serverLog: v })} rows={5} />
            <TextArea label="Kontaktformular" value={draft.datenschutz.kontaktformular} onChange={(v) => update("datenschutz", { ...draft.datenschutz, kontaktformular: v })} rows={4} />
            <TextArea label="Cookies" value={draft.datenschutz.cookies} onChange={(v) => update("datenschutz", { ...draft.datenschutz, cookies: v })} rows={4} />
            <TextArea label="Ihre Rechte" value={draft.datenschutz.rechte} onChange={(v) => update("datenschutz", { ...draft.datenschutz, rechte: v })} rows={5} />
            <TextArea label="Datenschutz-Ansprechpartner" value={draft.datenschutz.kontaktStelle} onChange={(v) => update("datenschutz", { ...draft.datenschutz, kontaktStelle: v })} />
          </Card>
        )}

        {tab === "einstellungen" && <SettingsTab draft={draft} update={update} />}
      </main>
      <SiteFooter />
    </div>
  );
}

function SettingsTab({
  draft,
  update,
}: {
  draft: SiteContent;
  update: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void;
}) {
  const { adminPassword, setAdminPassword } = useContent();
  const [next, setNext] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [uploadingBg, setUploadingBg] = useState(false);

  const uploadBackground = async (file: File) => {
    setUploadingBg(true);
    try {
      const response = await api.uploadImage(file, "bg");
      update("background", { ...draft.background, pattern: response.url });
      setMsg("Hintergrund-Pattern hochgeladen.");
    } catch (error) {
      setMsg("Fehler beim Hochladen des Hintergrunds.");
    } finally {
      setUploadingBg(false);
      setTimeout(() => setMsg(null), 2500);
    }
  };

  return (
    <Card title="Einstellungen">
      <p className="text-sm font-medium">Hintergrund-Pattern</p>
      <p className="text-sm text-muted-foreground">
        Lade ein nahtlos kachelndes Bild hoch. Es wird im Hintergrund der Seite wiederholt.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        {draft.background?.pattern ? (
          <div
            className="h-24 w-24 rounded-2xl border border-border bg-cover bg-center"
            style={{ backgroundImage: `url(${draft.background.pattern})` }}
          />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded-2xl border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
            Kein Bild
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium transition-colors hover:bg-card">
          <Upload className="h-4 w-4" />
          {uploadingBg ? "Lade..." : "Pattern wählen"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={uploadingBg}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadBackground(file);
              e.target.value = "";
            }}
          />
        </label>
        {draft.background?.pattern && (
          <button
            type="button"
            onClick={() => update("background", { ...(draft.background || {}), pattern: "" })}
            className="text-sm text-destructive hover:underline"
          >
            Pattern entfernen
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Overlay-Farbe
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={draft.background?.color || "#0f172a"}
              onChange={(e) => update("background", { ...(draft.background || {}), color: e.target.value })}
              className="h-10 w-16 cursor-pointer rounded-xl border border-border bg-transparent"
            />
            <span className="text-sm font-mono text-muted-foreground">
              {draft.background?.color || "Standard (Theme)"}
            </span>
            {draft.background?.color && (
              <button
                type="button"
                onClick={() => update("background", { ...(draft.background || {}), color: "" })}
                className="text-sm text-destructive hover:underline"
              >
                Standard
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Pattern-Deckkraft: {Math.round((draft.background?.opacity ?? 0.08) * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round((draft.background?.opacity ?? 0.08) * 100)}
            onChange={(e) =>
              update("background", {
                ...(draft.background || {}),
                opacity: parseInt(e.target.value, 10) / 100,
              })
            }
            className="h-10 w-full accent-primary"
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-card/50 p-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Vorschau</p>
        <div
          className="mt-3 h-40 w-full rounded-xl border border-border"
          style={{
            backgroundImage: draft.background?.pattern ? `url(${draft.background.pattern})` : "none",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            backgroundPosition: "top left",
            opacity: draft.background?.pattern ? (draft.background?.opacity ?? 0.08) : 1,
            backgroundColor: draft.background?.color || "var(--background)",
          }}
        />
      </div>

      <div className="my-6 h-px bg-border" />

      <p className="text-sm font-medium">Header- & Footer-Haarlinie</p>
      <p className="text-sm text-muted-foreground">
        Farbe, Deckkraft und Dicke der feinen Linie unter dem Header und über dem Footer.
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Farbe
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={draft.hairline?.color || "#22c55e"}
              onChange={(e) => update("hairline", { ...(draft.hairline || {}), color: e.target.value })}
              className="h-10 w-16 cursor-pointer rounded-xl border border-border bg-transparent"
            />
            <span className="text-sm font-mono text-muted-foreground">
              {draft.hairline?.color || "Standard (Primary)"}
            </span>
            {draft.hairline?.color && (
              <button
                type="button"
                onClick={() => update("hairline", { ...(draft.hairline || {}), color: "" })}
                className="text-sm text-destructive hover:underline"
              >
                Standard
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Deckkraft: {Math.round((draft.hairline?.opacity ?? 1) * 100)}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round((draft.hairline?.opacity ?? 1) * 100)}
            onChange={(e) =>
              update("hairline", {
                ...(draft.hairline || {}),
                opacity: parseInt(e.target.value, 10) / 100,
              })
            }
            className="h-10 w-full accent-primary"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Dicke: {draft.hairline?.thickness ?? 0.5}px
          </label>
          <input
            type="range"
            min={1}
            max={30}
            value={Math.round((draft.hairline?.thickness ?? 0.5) * 10)}
            onChange={(e) =>
              update("hairline", {
                ...(draft.hairline || {}),
                thickness: parseInt(e.target.value, 10) / 10,
              })
            }
            className="h-10 w-full accent-primary"
          />
        </div>
      </div>

      <div className="my-6 h-px bg-border" />

      <p className="text-sm text-muted-foreground">
        Aktuelles Passwort: <code className="rounded bg-muted px-1.5 py-0.5">{adminPassword}</code>
      </p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <TextField label="Neues Passwort" value={next} onChange={setNext} placeholder="mind. 6 Zeichen" />
        <TextField label="Bestätigen" value={confirmed} onChange={setConfirmed} />
      </div>
      <button
        onClick={() => {
          if (next.length < 6) return setMsg("Mindestens 6 Zeichen.");
          if (next !== confirmed) return setMsg("Passwörter stimmen nicht überein.");
          setAdminPassword(next);
          setNext("");
          setConfirmed("");
          setMsg("Passwort aktualisiert.");
        }}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
      >
        Passwort ändern
      </button>
      {msg && <p className="mt-3 text-sm text-primary">{msg}</p>}

      <div className="mt-10 rounded-xl border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Hinweis zur Persistenz</p>
        <p className="mt-2">
          Alle Inhalte werden über die externe Backend-API auf dem Server gespeichert
          (<code>content.json</code>). Es gibt keine lokale Speicherung im Browser mehr. Beim
          Speichern wird automatisch ein Backup der vorherigen Version auf dem Server angelegt.
          Überprüfe bei Problemen den API-Status und die Berechtigungen auf dem Server.
        </p>
      </div>
    </Card>
  );
}

function ToolbarBtn({
  onClick,
  icon: Icon,
  label,
}: {
  onClick: () => void;
  icon: typeof Save;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="w-full rounded-3xl border border-border bg-card p-4 sm:p-8 shadow-card">
      <h2 className="font-display text-xl sm:text-2xl font-semibold">{title}</h2>
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function ListEditor<T>({
  items,
  onChange,
  render,
  blank,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, set: (next: T) => void, index: number) => React.ReactNode;
  blank: T;
}) {
  const setAt = (i: number, next: T) => {
    const copy = [...items];
    copy[i] = next;
    onChange(copy);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, structuredClone(blank)]);
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const copy = [...items];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
  };
  return (
    <div className="mt-3 grid gap-3 w-full">
      {items.map((item, i) => (
        <div key={i} className="w-full rounded-2xl border border-border bg-background/50 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">#{i + 1}</span>
            <div className="flex gap-1 text-xs shrink-0">
              <button onClick={() => move(i, -1)} className="rounded-full px-2 py-1 hover:bg-muted">↑</button>
              <button onClick={() => move(i, 1)} className="rounded-full px-2 py-1 hover:bg-muted">↓</button>
              <button onClick={() => remove(i)} className="rounded-full px-2 py-1 text-destructive hover:bg-destructive/10">Löschen</button>
            </div>
          </div>
          {render(item, (next) => setAt(i, next), i)}
        </div>
      ))}
      <button
        onClick={add}
        className="rounded-2xl border border-dashed border-border py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        + Eintrag hinzufügen
      </button>
    </div>
  );
}
