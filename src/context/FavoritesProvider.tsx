import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { plantById } from "../data";
import { FavoritesContext } from "./favoritesContext";

const storageKey = "verdant-favorites";

const parseStoredFavorites = (storedValue: unknown) => {
  let parsed: unknown = storedValue;
  if (typeof storedValue === "string") {
    try {
      parsed = JSON.parse(storedValue);
    } catch {
      return new Set<string>();
    }
  }

  return new Set(
    Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string" && plantById.has(value))
      : [],
  );
};

const getStoredFavorites = () => {
  if (typeof window === "undefined") return new Set<string>();

  try {
    return parseStoredFavorites(window.localStorage.getItem(storageKey) ?? "[]");
  } catch {
    return new Set<string>();
  }
};

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favoriteIds, setFavoriteIds] = useState(getStoredFavorites);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify([...favoriteIds]));
    } catch {
      // Favoriting remains available for the session if storage is restricted.
    }
  }, [favoriteIds]);

  useEffect(() => {
    const syncFavorites = (event: StorageEvent) => {
      if (event.key !== storageKey && event.key !== null) return;
      setFavoriteIds(parseStoredFavorites(event.newValue ?? "[]"));
    };

    window.addEventListener("storage", syncFavorites);
    return () => window.removeEventListener("storage", syncFavorites);
  }, []);

  const toggleFavorite = useCallback((plantId: string, plantName: string) => {
    setAnnouncement(
      favoriteIds.has(plantId)
        ? `${plantName} removed from My Garden.`
        : `${plantName} saved to My Garden.`,
    );
    setFavoriteIds((currentIds) => {
      const nextIds = new Set(currentIds);
      if (nextIds.has(plantId)) nextIds.delete(plantId);
      else nextIds.add(plantId);
      return nextIds;
    });
  }, [favoriteIds]);

  const value = useMemo(
    () => ({
      favoriteIds,
      isFavorite: (plantId: string) => favoriteIds.has(plantId),
      toggleFavorite,
    }),
    [favoriteIds, toggleFavorite],
  );

  return (
    <FavoritesContext value={value}>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      {children}
    </FavoritesContext>
  );
}
