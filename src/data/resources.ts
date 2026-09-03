import type { EducationalResource } from "../types/content";

export const educationalResources: EducationalResource[] = [
  {
    id: "medicinal-plants-introduction",
    title: "An Introduction to Medicinal Plants",
    description: "Understand how communities document plant knowledge and why traditional use is not the same as clinical evidence.",
    category: "Foundations",
    readingTime: 7,
    featured: true,
  },
  {
    id: "botanical-terms",
    title: "Botanical Terms, Made Clear",
    description: "A practical guide to leaves, stems, roots, flowers, habits, and the language used to describe them.",
    category: "Botany",
    readingTime: 9,
    featured: true,
  },
  {
    id: "plant-identification-basics",
    title: "Plant Identification Basics",
    description: "Learn a careful observation process using form, leaf arrangement, flowers, habitat, and season.",
    category: "Identification",
    readingTime: 8,
    featured: true,
  },
  {
    id: "cultivation-foundations",
    title: "Cultivation Foundations",
    description: "Start with light, soil, water, climate, and propagation before choosing plants for a garden.",
    category: "Cultivation",
    readingTime: 10,
    featured: false,
  },
  {
    id: "understanding-families",
    title: "Understanding Plant Families",
    description: "See how shared flower, fruit, and leaf traits help botanists organize plant relationships.",
    category: "Botany",
    readingTime: 11,
    featured: false,
  },
  {
    id: "responsible-herbal-knowledge",
    title: "Using Herbal Knowledge Responsibly",
    description: "Learn the difference between cultural documentation, household practice, and qualified medical guidance.",
    category: "Responsible use",
    readingTime: 6,
    featured: false,
  },
];
