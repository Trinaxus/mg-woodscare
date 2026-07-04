import { Moon, Sun } from "lucide-react";
import { useContent } from "@/lib/content";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useContent();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Zu Hellmodus wechseln" : "Zu Dunkelmodus wechseln"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/60 hover:text-primary ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
