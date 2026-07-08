import { useEffect, useState } from "react";
import { Search, Globe, FileText, CheckCircle, AlertCircle, XCircle, Zap } from "lucide-react";
import { routeTree } from "@/routeTree.gen";

interface RouteInfo {
  path: string;
  id: string;
}

interface SeoCheck {
  label: string;
  status: "ok" | "warn" | "error";
  message: string;
}

function collectRoutes(): RouteInfo[] {
  const routes: RouteInfo[] = [];
  const seen = new Set<string>();

  function visit(route: any) {
    if (!route) return;
    const path = route.path;
    if (path && !seen.has(path)) {
      seen.add(path);
      routes.push({ path, id: route.id });
    }
    if (route.children) {
      route.children.forEach(visit);
    }
  }

  visit(routeTree);
  return routes.sort((a, b) => a.path.localeCompare(b.path));
}

function analyzeSeo(): { checks: SeoCheck[]; score: number; meta: Record<string, string> } {
  const checks: SeoCheck[] = [];
  let points = 0;
  let maxPoints = 0;

  const head = document.head;
  const title = head.querySelector("title")?.textContent || "";
  const description = head.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const canonical = head.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
  const ogTitle = head.querySelector('meta[property="og:title"]')?.getAttribute("content") || "";
  const ogDescription = head.querySelector('meta[property="og:description"]')?.getAttribute("content") || "";
  const ogImage = head.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
  const robots = head.querySelector('meta[name="robots"]')?.getAttribute("content") || "";
  const themeColor = head.querySelector('meta[name="theme-color"]')?.getAttribute("content") || "";

  const addCheck = (label: string, condition: boolean, okMsg: string, failMsg: string, weight = 1) => {
    maxPoints += weight;
    if (condition) {
      points += weight;
      checks.push({ label, status: "ok", message: okMsg });
    } else {
      checks.push({ label, status: "error", message: failMsg });
    }
  };

  addCheck("Seitentitel", title.length > 10 && title.length < 70, `Titel vorhanden (${title.length} Zeichen)`, `Titel fehlt oder ungültig (${title.length} Zeichen)`);
  addCheck("Meta-Beschreibung", description.length > 50 && description.length < 160, `Beschreibung vorhanden (${description.length} Zeichen)`, `Beschreibung fehlt oder ungültig (${description.length} Zeichen)`);
  addCheck("Canonical-Link", canonical.startsWith("https://"), `Canonical gesetzt: ${canonical}`, `Canonical fehlt oder ungültig: ${canonical}`);
  addCheck("Open Graph Titel", ogTitle.length > 0, "OG-Titel vorhanden", "OG-Titel fehlt");
  addCheck("Open Graph Beschreibung", ogDescription.length > 0, "OG-Beschreibung vorhanden", "OG-Beschreibung fehlt");
  addCheck("Open Graph Bild", ogImage.length > 0, `OG-Bild vorhanden: ${ogImage}`, "OG-Bild fehlt");
  addCheck("Robots Meta", robots.includes("index") && robots.includes("follow"), `Robots: ${robots}`, `Robots ungünstig: ${robots}`);
  addCheck("Theme Color", themeColor.length > 0, `Theme-Color: ${themeColor}`, "Theme-Color fehlt");
  addCheck("Server-Rendering aktiv", document.getElementById("__root")?.childElementCount !== 0 || document.body.innerHTML.length > 1000, "HTML-Grundgerüst vorhanden", "HTML-Grundgerüst sehr klein");

  return {
    checks,
    score: Math.round((points / maxPoints) * 100),
    meta: { title, description, canonical, ogTitle, ogDescription, ogImage, robots, themeColor },
  };
}

export function SeoTab() {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [seo, setSeo] = useState<{ checks: SeoCheck[]; score: number; meta: Record<string, string> } | null>(null);

  useEffect(() => {
    setRoutes(collectRoutes());
    setSeo(analyzeSeo());
  }, []);

  const scoreColor = seo && seo.score >= 90 ? "text-green-500" : seo && seo.score >= 70 ? "text-yellow-500" : "text-red-500";
  const scoreBg = seo && seo.score >= 90 ? "bg-green-500" : seo && seo.score >= 70 ? "bg-yellow-500" : "bg-red-500";

  return (
    <section className="w-full rounded-3xl border border-border bg-card p-4 sm:p-8 shadow-card">
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-primary" />
        <h2 className="font-display text-xl sm:text-2xl font-semibold">SEO-Check</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Übersicht über statisch gerenderte Seiten und die aktuell erkannten Meta-Informationen.
      </p>

      {seo && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/40 p-5">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="font-medium">SEO-Score</h3>
            </div>
            <div className="mt-4 flex items-end gap-3">
              <span className={`font-display text-5xl font-bold ${scoreColor}`}>{seo.score}%</span>
              <span className="mb-1 text-sm text-muted-foreground">
                {seo.score >= 90 ? "Sehr gut" : seo.score >= 70 ? "Okay" : "Verbesserungsbedarf"}
              </span>
            </div>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full ${scoreBg} transition-all duration-500`}
                style={{ width: `${seo.score}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/40 p-5">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Gefundene Seiten</h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-primary">{routes.length}</p>
            <p className="text-sm text-muted-foreground">statisch gerenderte Routen</p>
          </div>
        </div>
      )}

      {seo && (
        <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
          <h3 className="flex items-center gap-2 font-medium">
            <FileText className="h-5 w-5 text-primary" />
            Aktuelle Meta-Informationen
          </h3>
          <dl className="mt-4 grid gap-3 text-sm">
            {Object.entries(seo.meta).map(([key, value]) => (
              <div key={key} className="grid gap-1 md:grid-cols-[140px_1fr]">
                <dt className="font-medium text-muted-foreground capitalize">{key}</dt>
                <dd className="break-all text-foreground">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {seo && (
        <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
          <h3 className="font-medium">SEO-Checks</h3>
          <div className="mt-4 grid gap-3">
            {seo.checks.map((check, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-background/60 p-3"
              >
                {check.status === "ok" && <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />}
                {check.status === "warn" && <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />}
                {check.status === "error" && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />}
                <div>
                  <p className="font-medium">{check.label}</p>
                  <p className="text-sm text-muted-foreground">{check.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {routes.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-5">
          <h3 className="font-medium">Routen</h3>
          <ul className="mt-4 grid gap-2 text-sm">
            {routes.map((route) => (
              <li key={route.id} className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2">
                <span className="font-medium text-primary">{route.path}</span>
                <span className="text-xs text-muted-foreground">({route.id})</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
