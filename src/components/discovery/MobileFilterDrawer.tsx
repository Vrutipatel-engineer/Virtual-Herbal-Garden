import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "../common/Icons";
import { useLanguage } from "../../context/useLanguage";

interface MobileFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function MobileFilterDrawer({
  open,
  onClose,
  children,
}: MobileFilterDrawerProps) {
  const { t } = useLanguage();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="filter-drawer" role="presentation">
      <button
        className="filter-drawer__backdrop"
        type="button"
        aria-label={t("Close filters")}
        onClick={onClose}
      />
      <div
        className="filter-drawer__panel"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-drawer-title"
      >
        <div className="filter-drawer__header">
          <div>
            <p className="eyebrow">{t("Refine the collection")}</p>
            <h2 id="filter-drawer-title">{t("Filters")}</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label={t("Close filters")}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="filter-drawer__content">{children}</div>
        <button className="button button--primary filter-drawer__done" type="button" onClick={onClose}>
          {t("Show results")}
        </button>
      </div>
    </div>
  );
}
