import { HeartIcon } from "../common/Icons";
import { useFavorites } from "../../hooks/useFavorites";
import { useLanguage } from "../../context/useLanguage";

interface FavoriteButtonProps {
  plantId: string;
  plantName: string;
  className?: string;
}

export function FavoriteButton({
  plantId,
  plantName,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { language, t } = useLanguage();
  const saved = isFavorite(plantId);
  const localizedPlantName = t(plantName);

  return (
    <button
      className={`favorite-button${saved ? " favorite-button--saved" : ""}${className ? ` ${className}` : ""}`}
      type="button"
      aria-label={saved ? `${t("Remove")} ${localizedPlantName} ${t("from My Garden")}` : `${t("Save")} ${localizedPlantName} ${t("to My Garden")}`}
      aria-pressed={saved}
      title={saved ? t("Remove from My Garden") : t("Save to My Garden")}
      onClick={() => toggleFavorite(plantId, language === "hi" ? t(plantName) : plantName)}
    >
      <HeartIcon fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
