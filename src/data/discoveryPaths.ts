import type { DiscoveryPath } from "../types/content";

export const discoveryPaths: DiscoveryPath[] = [
  {
    id: "aromatic-plants",
    prompt: "Show me aromatic plants",
    title: "Follow the fragrance",
    description: "Explore herbs and grasses recognized by their distinctive natural aromas.",
    filters: { category: "Aromatic" },
    accent: "leaf",
  },
  {
    id: "home-garden-herbs",
    prompt: "What grows in a home garden?",
    title: "Begin close to home",
    description: "Find approachable herbs commonly cultivated in household garden settings.",
    filters: { type: "Herb", habitat: "Home garden" },
    accent: "mist",
  },
  {
    id: "western-ghats",
    prompt: "Take me to the Western Ghats",
    title: "Explore a rain-rich range",
    description: "Meet plants represented in one of India's most celebrated biodiversity regions.",
    filters: { region: "western-ghats" },
    accent: "earth",
  },
  {
    id: "humid-climate",
    prompt: "Find plants for humid climates",
    title: "Discover moisture-loving forms",
    description: "Browse plants associated with warm air, regular rain, and damp habitats.",
    filters: { climate: "Humid" },
    accent: "mist",
  },
  {
    id: "skin-care-traditions",
    prompt: "Explore traditional skin care",
    title: "Learn through cultural context",
    description: "See plants documented in topical household and ceremonial traditions.",
    filters: { use: "Skin care" },
    accent: "earth",
  },
  {
    id: "useful-trees",
    prompt: "Show me useful trees",
    title: "Explore useful trees",
    description: "Discover trees valued for food, shade, and wildlife habitat across different landscapes.",
    filters: { type: "Tree" },
    accent: "leaf",
  },
];
