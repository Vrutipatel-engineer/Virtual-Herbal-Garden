import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { ThemeContext, type Theme } from "./themeContext";

const storageKey = "verdant-theme";

const getInitialTheme = (): { theme: Theme; userChoice: boolean } => {
  if (typeof window === "undefined") return { theme: "light", userChoice: false };

  let storedTheme: string | null = null;
  try {
    storedTheme = window.localStorage.getItem(storageKey);
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }

  if (storedTheme === "light" || storedTheme === "dark") {
    return { theme: storedTheme, userChoice: true };
  }

  return {
    theme: window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
    userChoice: false,
  };
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const [initialTheme] = useState(getInitialTheme);
  const [theme, setTheme] = useState<Theme>(initialTheme.theme);
  const [hasUserChoice, setHasUserChoice] = useState(initialTheme.userChoice);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    themeColor?.setAttribute(
      "content",
      theme === "dark" ? "#101a16" : "#f5f2e9",
    );

  }, [theme]);

  useEffect(() => {
    if (hasUserChoice) return;

    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const syncPreference = () => setTheme(preference.matches ? "dark" : "light");
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, [hasUserChoice]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setHasUserChoice(true);
        setTheme(nextTheme);
        try {
          window.localStorage.setItem(storageKey, nextTheme);
        } catch {
          // The visual theme still works when persistence is unavailable.
        }
      },
    }),
    [theme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
