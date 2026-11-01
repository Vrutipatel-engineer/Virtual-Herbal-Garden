import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function ScrollManager() {
  const { pathname, search, hash } = useLocation();
  const previousPathname = useRef(pathname);

  useLayoutEffect(() => {
    const pathChanged = previousPathname.current !== pathname;
    previousPathname.current = pathname;

    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
      return;
    }

    if (pathChanged || window.scrollY !== 0) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [pathname, search, hash]);

  useEffect(() => {
    if (pathname === "/garden") return;

    const root = document.getElementById("main-content");
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canObserve = !reducedMotion && "IntersectionObserver" in window;
    let revealObserver: IntersectionObserver | null = null;
    if (canObserve) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("reveal-visible");
            revealObserver?.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
    }

    const observeReveals = (container: ParentNode) => {
      const elements = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal]"));
      if (container instanceof HTMLElement && container.matches("[data-reveal]")) {
        elements.unshift(container);
      }
      elements.forEach((element) => {
        if (element.classList.contains("reveal-ready") || element.classList.contains("reveal-visible")) return;
        if (!revealObserver) {
          element.classList.add("reveal-visible");
          return;
        }

        element.classList.add("reveal-ready");
        revealObserver.observe(element);
      });
    };

    observeReveals(root);
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeReveals(node);
        });
      });
    });
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      revealObserver?.disconnect();
    };
  }, [pathname]);

  return null;
}
