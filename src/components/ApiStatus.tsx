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
    online: "bg-green-500",
    offline: "bg-red-500",
    checking: "bg-yellow-500",
  }[status];

  const statusText = {
    online: "API Online",
    offline: "API Offline",
    checking: "Prüfe...",
  }[status];

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <div
          className={`h-2 w-2 rounded-full ${statusColor} ${
            status === "online" ? "animate-pulse" : ""
          }`}
        />
        <span>{statusText}</span>
      </div>
      {lastCheck && (
        <span className="opacity-60">
          ({lastCheck.toLocaleTimeString()})
        </span>
      )}
    </div>
  );
}
