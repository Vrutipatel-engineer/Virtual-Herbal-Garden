import type { ReactNode } from "react";
import { useLanguage } from "../../context/useLanguage";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: PageIntroProps) {
  const { t } = useLanguage();
  return (
    <section className="page-intro" aria-labelledby="page-title">
      <div className="container page-intro__inner">
        <p className="eyebrow">{t(eyebrow)}</p>
        <h1 id="page-title">{t(title)}</h1>
        <p className="page-intro__description">{t(description)}</p>
        {children}
      </div>
    </section>
  );
}
