import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "@/data/defaultContent";
import { api } from "./api";

const STORAGE_KEY = "mgw:content";
const THEME_KEY = "mgw:theme";
const ADMIN_PASS_KEY = "mgw:adminPass";
const ADMIN_SESSION_KEY = "mgw:adminSession";
const API_MODE_KEY = "mgw:apiMode";

export const DEFAULT_ADMIN_PASSWORD = "waldmeister";

type Theme = "light" | "dark";

interface ContentCtx {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
  resetContent: () => void;
  theme: Theme;
  toggleTheme: () => void;
  adminPassword: string;
  setAdminPassword: (p: string) => void;
  isAdminAuthed: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  apiMode: boolean;
  toggleApiMode: () => void;
  saveToApi: () => Promise<void>;
  loadFromApi: () => Promise<void>;
}

const Ctx = createContext<ContentCtx | null>(null);

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return { ...(fallback as object), ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(defaultContent);
  const [theme, setTheme] = useState<Theme>("dark");
  const [adminPassword, setAdminPasswordState] = useState<string>(DEFAULT_ADMIN_PASSWORD);
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);
  const [apiMode, setApiMode] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage (client only)
  useEffect(() => {
    setContentState(loadJSON<SiteContent>(STORAGE_KEY, defaultContent));
    const storedTheme = (window.localStorage.getItem(THEME_KEY) as Theme | null) ?? "dark";
    setTheme(storedTheme);
    setAdminPasswordState(
      window.localStorage.getItem(ADMIN_PASS_KEY) ?? DEFAULT_ADMIN_PASSWORD
    );
    setIsAdminAuthed(window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
    setApiMode(window.localStorage.getItem(API_MODE_KEY) === "true");
    setHydrated(true);
  }, []);

  // Apply theme to <html>
  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  const setContent = (c: SiteContent) => {
    setContentState(c);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    }
  };

  const resetContent = () => {
    setContentState(defaultContent);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  };

  const setAdminPassword = (p: string) => {
    setAdminPasswordState(p);
    if (typeof window !== "undefined") window.localStorage.setItem(ADMIN_PASS_KEY, p);
  };

  const loginAdmin = (pass: string) => {
    if (pass === adminPassword) {
      setIsAdminAuthed(true);
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthed(false);
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const toggleApiMode = () => {
    const newMode = !apiMode;
    setApiMode(newMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(API_MODE_KEY, String(newMode));
    }
  };

  const saveToApi = async () => {
    try {
      await api.saveContent(content);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      }
    } catch (error) {
      console.error("API Save Error:", error);
      throw error;
    }
  };

  const loadFromApi = async () => {
    try {
      const apiContent = await api.getContent<SiteContent>();
      setContentState(apiContent);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apiContent));
      }
    } catch (error) {
      console.error("API Load Error:", error);
      throw error;
    }
  };

  const value = useMemo<ContentCtx>(
    () => ({
      content,
      setContent,
      resetContent,
      theme,
      toggleTheme,
      adminPassword,
      setAdminPassword,
      isAdminAuthed,
      loginAdmin,
      logoutAdmin,
      apiMode,
      toggleApiMode,
      saveToApi,
      loadFromApi,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content, theme, adminPassword, isAdminAuthed, apiMode]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
