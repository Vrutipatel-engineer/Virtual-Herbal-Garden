import { useState, type CSSProperties } from "react";
import { LeafIcon } from "../common/Icons";
import type { PlantImageAsset } from "../../types/images";
import { getObjectPosition, isImageReady } from "../../utils/plantImages";
import { useLanguage } from "../../context/useLanguage";

interface PlantImageProps {
  image: PlantImageAsset;
  plantName: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  allowRetry?: boolean;
}

type ImageStyle = CSSProperties & {
  "--image-aspect": string;
  "--image-position": string;
};

export function PlantImage({
  image,
  plantName,
  className = "",
  sizes = "(max-width: 44rem) 100vw, (max-width: 72rem) 50vw, 33vw",
  priority = false,
  allowRetry = false,
}: PlantImageProps) {
  const { language, t } = useLanguage();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const failed = image.src !== null && failedSrc === image.src;
  const loaded = image.src !== null && loadedSrc === image.src;
  const ready = isImageReady(image) && !failed;
  const alt = language === "hi"
    ? image.role === "garden"
      ? `${plantName} अपने प्राकृतिक आवास में`
      : image.role === "hero"
        ? `${plantName} का वनस्पति चित्र`
        : `${plantName} का पौधा`
    : image.alt;
  const style: ImageStyle = {
    "--image-aspect": image.aspectRatio?.replace("/", " / ") ?? "4 / 3",
    "--image-position": getObjectPosition(image),
  };

  return (
    <div
      className={`plant-image${loaded ? " plant-image--loaded" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      data-image-status={ready ? "ready" : "placeholder"}
    >
      {ready ? (
        <img
          key={retryCount}
          src={image.src}
          alt={alt}
          width={image.width}
          height={image.height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={() => setLoadedSrc(image.src)}
          onError={() => setFailedSrc(image.src)}
        />
      ) : (
        <div className="plant-image__fallback" role="group" aria-label={failed ? `${plantName} ${t("plant image unavailable")}` : alt}>
          <span className="plant-image__botanical-mark" aria-hidden="true">
            <LeafIcon />
          </span>
          <span className="plant-image__initial" aria-hidden="true">
            {plantName.slice(0, 1)}
          </span>
          <span className="plant-image__pending" aria-hidden="true">
            {failed ? t("Image unavailable") : t("Botanical image pending")}
          </span>
          {failed && allowRetry ? (
            <button
              className="plant-image__retry"
              type="button"
              onClick={() => {
                setLoadedSrc(null);
                setFailedSrc(null);
                setRetryCount((count) => count + 1);
              }}
            >
              {t("Try image again")}
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
