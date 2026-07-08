import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function ApiStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "checking">("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    try {
      setStatus("checking");
      await api.getContent();
      setStatus("online");
      setLastCheck(new Date());
    } catch (error) {
      console.error("API Status Check Failed:", error);
      setStatus("offline");
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000); // Alle 30 Sekunden prüfen
    return () => clearInterval(interval);
  }, []);

  const statusColor = {
    online: "bg-primary",
    offline: "bg-red-500",
    checking: "bg-yellow-500",
  }[status];

  const statusText = {
    online: "API Online",
    offline: "API Offline",
    checking: "Prüfe...",
  }[status];

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="relative flex h-2.5 w-2.5">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${statusColor} opacity-75`} />
        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${statusColor}`} />
      </span>
      <span className="hidden sm:inline">{statusText}</span>
      <span className="sm:hidden">{status === "online" ? "API" : status === "offline" ? "API" : "..."}</span>
      {lastCheck && (
        <span className="opacity-60">
          ({lastCheck.toLocaleTimeString()})
        </span>
      )}
    </div>
  );
}
