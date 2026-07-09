import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContent, ContentProvider } from "@/lib/content";
import { SocialSchema } from "@/components/SiteChrome";
import "@/styles.css";

const queryClient = new QueryClient();

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Seite nicht gefunden</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Die Seite, die du suchst, existiert nicht oder wurde verschoben.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Diese Seite konnte nicht geladen werden
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Etwas ist auf unserer Seite schiefgelaufen. Du kannst es erneut versuchen oder zur Startseite gehen.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Erneut versuchen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Zur Startseite
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MG Woodscare - Baumpflege & Sägewerk Leipzig" },
      {
        name: "description",
        content:
          "MG Woodscare Leipzig: professionelle Baumpflege, Baumfällung und Sägewerk mit Trockenkammer. Wir sind eins mit der Natur.",
      },
      {
        name: "keywords",
        content: "Baumpflege, Baumfällung, Sägewerk, Trockenkammer, Leipzig, Holz, Brennholz, Gartenpflege, MG Woodscare",
      },
      { name: "author", content: "MG Woodscare" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#0f172a" },
      { property: "og:title", content: "MG Woodscare - Baumpflege & Sägewerk Leipzig" },
      {
        property: "og:description",
        content:
          "Professionelle Baumpflege, sichere Baumfällung und regionales Sägewerk mit Trockenkammer im Herzen von Leipzig.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.mg-woodscare.de/" },
      { property: "og:image", content: "https://www.mg-woodscare.de/assets/logo_005.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "de_DE" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MG Woodscare - Baumpflege & Sägewerk Leipzig" },
      {
        name: "twitter:description",
        content:
          "Professionelle Baumpflege, sichere Baumfällung und regionales Sägewerk mit Trockenkammer im Herzen von Leipzig.",
      },
      { name: "twitter:image", content: "https://www.mg-woodscare.de/assets/logo_005.png" },
    ],
    links: [
      { rel: "canonical", href: "https://www.mg-woodscare.de/" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <AppContent />
    </RootDocument>
  );
}

function AppContent() {
  const { isLoading, apiError } = useContent();
  const [showLoader, setShowLoader] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Theme initialisieren
    try {
      const t = localStorage.getItem("mgw:theme");
      if (t !== "light") {
        document.documentElement.classList.add("dark");
      }
    } catch (e) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Max. 3 Sekunden Lade-Screen anzeigen, damit App nicht hängt
  useEffect(() => {
    if (!isLoading) {
      setShowLoader(false);
      return;
    }
    const timer = setTimeout(() => setShowLoader(false), 3000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (showLoader && isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-lg font-medium text-foreground">Lade Inhalte...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {apiError && (
        <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
          {apiError}
        </div>
      )}
      <Outlet />
    </>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de" className="dark">
      <head>
        <HeadContent />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem("mgw:theme");
                  if (theme === "light") {
                    document.documentElement.classList.remove("dark");
                  } else {
                    document.documentElement.classList.add("dark");
                  }
                } catch (e) {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ContentProvider>
            <SocialSchema />
            {children}
          </ContentProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

