import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ContentProvider } from "../lib/content";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MG Woodscare – Baumpflege & Sägewerk Leipzig" },
      {
        name: "description",
        content:
          "MG Woodscare Leipzig: professionelle Baumpflege, Baumfällung, Seilklettertechnik SKT und Sägewerk mit Trockenkammer. 15+ Jahre Erfahrung in Leipzig & Umland. Notdienst 24/7.",
      },
      { name: "keywords", content: "Baumpflege Leipzig, Baumfällung Leipzig, Seilklettertechnik SKT, Sägewerk Leipzig, Kaminholz Leipzig, Wurzelfräsung, Obstbaumverschnitt, Baumpflegedienst, Forstwirtschaft, Rückepferde" },
      { name: "author", content: "MG Woodscare" },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "MG Woodscare – Baumpflege & Sägewerk Leipzig" },
      {
        property: "og:description",
        content:
          "Professionelle Baumpflege, Baumfällung und Sägewerk aus Leipzig. 15+ Jahre Erfahrung, SKT-zertifiziert, nachhaltig & sicher.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { property: "og:site_name", content: "MG Woodscare" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "MG Woodscare – Baumpflege & Sägewerk Leipzig" },
      { name: "twitter:description", content: "Professionelle Baumpflege, Baumfällung und Sägewerk aus Leipzig. 15+ Jahre Erfahrung, SKT-zertifiziert, nachhaltig & sicher." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8c4326e6-de0d-439c-b514-b9a88b0d1bd1/id-preview-c35d1a6a--3b6f155f-8462-4b07-a7f4-4eb8fcb6e842.lovable.app-1783154340258.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8c4326e6-de0d-439c-b514-b9a88b0d1bd1/id-preview-c35d1a6a--3b6f155f-8462-4b07-a7f4-4eb8fcb6e842.lovable.app-1783154340258.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "MG Woodscare – Baumpflegedienst",
          "description": "Professionelle Baumpflege, Baumfällung, Seilklettertechnik SKT und Sägewerk mit Trockenkammer in Leipzig",
          "url": "https://www.mg-woodscare.de",
          "telephone": "+491784158214",
          "email": "hmerkel01@googlemail.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Heckenweg 16",
            "addressLocality": "Leipzig",
            "postalCode": "04349",
            "addressCountry": "DE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "51.3396",
            "longitude": "12.3713"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday"
            ],
            "opens": "08:00",
            "closes": "18:00"
          },
          "priceRange": "€€",
          "areaServed": {
            "@type": "GeoCircle",
            "geoMidpoint": {
              "@type": "GeoCoordinates",
              "latitude": "51.3396",
              "longitude": "12.3713"
            },
            "geoRadius": "50000"
          }
        })
      }
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const themeInit = `try{var t=localStorage.getItem('mgw:theme');if(t!=='light'){document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}`;
  return (
    <html lang="de">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ContentProvider>
        <Outlet />
      </ContentProvider>
    </QueryClientProvider>
  );
}

