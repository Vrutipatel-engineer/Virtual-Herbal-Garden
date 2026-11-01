import { createContext } from "react";

export interface FavoritesContextValue {
  favoriteIds: ReadonlySet<string>;
  isFavorite: (plantId: string) => boolean;
  toggleFavorite: (plantId: string, plantName: string) => void;
}

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);
