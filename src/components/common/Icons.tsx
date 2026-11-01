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

export const SearchIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const HeartIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M20.8 5.8a5.4 5.4 0 0 0-7.7 0L12 6.9l-1.1-1.1a5.4 5.4 0 0 0-7.7 7.7L12 22l8.8-8.5a5.4 5.4 0 0 0 0-7.7Z" />
  </svg>
);

export const MapPinIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const FilterIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

export const BookIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
    <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z" />
  </svg>
);

export const CompassIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
  </svg>
);

export const SeedlingIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M12 22V10" />
    <path d="M7.5 14C4 14 2 11.5 2 8c3.5 0 6 2 6 5.5" />
    <path d="M12 10c0-4 2.7-6.5 7-6.5 0 4-2.5 6.5-7 6.5Z" />
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg {...sharedProps} {...props}>
    <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
