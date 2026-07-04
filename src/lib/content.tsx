import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "@/data/defaultContent";
import { api } from "./api";

const THEME_KEY = "mgw:theme";
const ADMIN_PASS_KEY = "mgw:adminPass";
const ADMIN_SESSION_KEY = "mgw:adminSession";

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
  saveToApi: (data?: SiteContent) => Promise<void>;
  loadFromApi: () => Promise<void>;
  isLoading: boolean;
  apiError: string | null;
}

const Ctx = createContext<ContentCtx | null>(null);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContentState] = useState<SiteContent>(defaultContent);
  const [theme, setTheme] = useState<Theme>("dark");
  const [adminPassword, setAdminPasswordState] = useState<string>(DEFAULT_ADMIN_PASSWORD);
  const [isAdminAuthed, setIsAdminAuthed] = useState<boolean>(false);
  const [apiMode] = useState<boolean>(true);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Lade Content immer vom externen Server
  useEffect(() => {
    const loadContent = async () => {
      try {
        const apiContent = await api.getContent<SiteContent>();
        setContentState(apiContent);
        setApiError(null);
      } catch (error) {
        console.error("Content Load Error:", error);
        setApiError("API nicht erreichbar. Daten werden aus Fallback geladen.");
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
    const storedTheme = (window.localStorage.getItem(THEME_KEY) as Theme | null) ?? "dark";
    setTheme(storedTheme);
    setAdminPasswordState(
      window.localStorage.getItem(ADMIN_PASS_KEY) ?? DEFAULT_ADMIN_PASSWORD
    );
    setIsAdminAuthed(window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "1");
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
  };

  const resetContent = () => {
    setContentState(defaultContent);
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
    // API-Mode ist immer aktiv - Admin greift immer auf externen Server zu
    console.warn("API-Mode ist immer aktiv");
  };

  const saveToApi = async (data?: SiteContent) => {
    try {
      await api.saveContent(data ?? content);
      // Nach erfolgreichem Speichern auch den lokalen State aktualisieren
      if (data) {
        setContentState(data);
      }
    } catch (error) {
      console.error("API Save Error:", error);
      throw error;
    }
  };

  const loadFromApi = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const apiContent = await api.getContent<SiteContent>();
      setContentState(apiContent);
    } catch (error) {
      console.error("API Load Error:", error);
      setApiError("API nicht erreichbar.");
      throw error;
    } finally {
      setIsLoading(false);
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
      isLoading,
      apiError,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [content, theme, adminPassword, isAdminAuthed, apiMode, isLoading, apiError]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}
