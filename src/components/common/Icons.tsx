import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const sharedProps: IconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const LeafIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M20.5 3.5C12 3.8 5.6 7.2 4.4 13.2c-.7 3.4 1.8 6.1 5.2 5.4 6-1.2 9.4-7.6 10.9-15.1Z" />
    <path d="M4 21c2.7-6.2 6.8-10.2 12.5-12.3" />
  </svg>
);

export const MenuIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const CloseIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const SunIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

export const MoonIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
  </svg>
);

export const ArrowIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
