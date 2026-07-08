import { useEffect, useState } from "react";
import { Server, Zap } from "lucide-react";

export function SsrStatus() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 text-xs text-muted-foreground"
      title="Server-Side Rendering / Static Site Generation aktiv – die Seite wird serverseitig oder zur Build-Zeit gerendert, was SEO und Ladezeit verbessert."
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
      </span>
      <Zap className="h-3 w-3 text-primary" />
      <span className="hidden sm:inline">{mounted ? "SSG / SSR aktiv" : "SEO Rendering aktiv"}</span>
      <span className="sm:hidden">SSG/SSR</span>
      <Server className="h-3 w-3 text-primary" />
    </div>
  );
}
