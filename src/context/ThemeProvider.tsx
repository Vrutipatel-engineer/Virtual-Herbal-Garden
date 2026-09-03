import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { ThemeContext, type Theme } from "./themeContext";

const storageKey = "verdant-theme";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "light";

  try {
    const storedTheme = window.localStorage.getItem(storageKey);
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    themeColor?.setAttribute(
      "content",
      theme === "dark" ? "#101a16" : "#f4f1e8",
    );

    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // The visual theme still works when persistence is unavailable.
    }
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((currentTheme) =>
          currentTheme === "light" ? "dark" : "light",
        ),
    }),
    [theme],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
