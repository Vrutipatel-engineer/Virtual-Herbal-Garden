import type { EducationalResource } from "../types/content";

export const educationalResources: EducationalResource[] = [
  {
    id: "medicinal-plants-introduction",
    title: "An Introduction to Medicinal Plants",
    description: "Understand how communities document plant knowledge and why traditional use is not the same as clinical evidence.",
    category: "Foundations",
    readingTime: 7,
    featured: true,
    sections: [
      {
        heading: "Begin with careful questions",
        paragraphs: [
          "A medicinal plant is a plant whose use has been recorded in a health or healing tradition. That description tells us where knowledge has been documented; it does not, by itself, establish that a plant is effective or safe for a particular person.",
          "When you encounter a plant record, ask what part of the plant is discussed, who documented the use, where it was used, and whether the information describes tradition, laboratory research, or clinical evidence.",
        ],
      },
      {
        heading: "Keep kinds of evidence distinct",
        paragraphs: [
          "Community knowledge, historical texts, botanical identification, laboratory studies, and clinical research answer different questions. A finding in one setting should not be presented as proof of an outcome in another.",
          "Good documentation names uncertainty, preserves cultural context, and avoids turning an educational description into a treatment recommendation.",
        ],
      },
      {
        heading: "Use plant information responsibly",
        paragraphs: [
          "Correct identification matters: common names can refer to different species, and related plants can have different properties. Never rely on a photograph or a single feature to decide that a wild plant is safe to use.",
          "This guide is for learning, not diagnosis or treatment. For health questions, seek advice from a qualified healthcare professional who knows your circumstances.",
        ],
      },
    ],
  },
  {
    id: "botanical-terms",
    title: "Botanical Terms, Made Clear",
    description: "A practical guide to leaves, stems, roots, flowers, habits, and the language used to describe them.",
    category: "Botany",
    readingTime: 9,
    featured: true,
    sections: [
      {
        heading: "Describe what you can observe",
        paragraphs: [
          "Botanical terminology gives people a shared way to describe plant form. Instead of saying that a leaf is unusual, a description can record its shape, edge, arrangement, surface, and attachment to the stem.",
          "Precise words make observations easier to compare. They do not replace a complete identification, which may depend on several structures and expert references.",
        ],
      },
      {
        heading: "A small field vocabulary",
        paragraphs: [
          "A leaf blade is the broad, usually flat part of a leaf. Its margin is the edge; a petiole is the stalk that connects a leaf blade to a stem. Leaves may be arranged alternately, opposite one another, or in a whorl around a stem.",
          "A flower is a reproductive structure. Sepals, petals, stamens, and carpels are parts that may help describe it. Their size, number, arrangement, and form can be useful identification details.",
        ],
      },
      {
        heading: "Record details consistently",
        paragraphs: [
          "Write down the feature, where it appears, and how it was observed. For example, note whether leaves occur in pairs along a stem, rather than relying only on a broad label such as leafy.",
          "Terminology can vary between references. When a term is unfamiliar, check a botanical glossary and compare its definition with a labelled diagram.",
        ],
      },
    ],
  },
  {
    id: "plant-identification-basics",
    title: "Plant Identification Basics",
    description: "Learn a careful observation process using form, leaf arrangement, flowers, habitat, and season.",
    category: "Identification",
    readingTime: 8,
    featured: true,
    sections: [
      {
        heading: "Observe more than one feature",
        paragraphs: [
          "Plant identification is a process of comparing several observations, not matching a single leaf to a picture. Look at the whole growth form, stem, leaves, flowers or fruits when present, and the surrounding habitat.",
          "Some features change with age or season. Record what is visible and what is missing so that a later observer can understand the limits of the identification.",
        ],
      },
      {
        heading: "Make a useful field record",
        paragraphs: [
          "Note the date, location at an appropriate level of detail, habitat, plant height, branching pattern, leaf arrangement, and any flowers or fruits. Photograph the whole plant as well as close views of identifying structures, without damaging it.",
          "Compare the record with a regional flora, herbarium collection, or other trusted botanical reference. Check whether the description fits multiple features before settling on a name.",
        ],
      },
      {
        heading: "Know when to stop",
        paragraphs: [
          "If key features are absent or references disagree, keep the identification broad and mark it as uncertain. A qualified botanist or local expert can help resolve difficult cases.",
          "Never use an uncertain identification to decide whether a plant is edible or medicinal. Similar-looking species can differ, and visual recognition alone cannot establish safety.",
        ],
      },
    ],
  },
  {
    id: "cultivation-foundations",
    title: "Cultivation Foundations",
    description: "Start with light, soil, water, climate, and propagation before choosing plants for a garden.",
    category: "Cultivation",
    readingTime: 10,
    featured: false,
    sections: [
      {
        heading: "Match a plant to its setting",
        paragraphs: [
          "Start with the conditions a plant is adapted to: light, temperature, rainfall, soil texture, drainage, and available space. A plant suited to a dry, sunny slope may struggle in a cool, waterlogged bed.",
          "Observe the site over time. A garden corner can receive very different light in the morning, midday, and across the seasons.",
        ],
      },
      {
        heading: "Build soil and water habits",
        paragraphs: [
          "Healthy soil structure supports roots and water movement. Learn the texture and drainage of the planting area before changing it, and use locally appropriate organic matter where it is suitable.",
          "Water needs depend on species, weather, soil, and plant age. Check the soil and the plant rather than following one fixed schedule for every bed.",
        ],
      },
      {
        heading: "Plan for long-term care",
        paragraphs: [
          "Leave room for a plant's mature size, airflow, access, and nearby species. Prefer locally appropriate plants and avoid introducing species that may become invasive in the region.",
          "Use reliable horticultural guidance for pruning, propagation, and pest management. Follow local rules and protect people, wildlife, and waterways when choosing any garden treatment.",
        ],
      },
    ],
  },
  {
    id: "understanding-families",
    title: "Understanding Plant Families",
    description: "See how shared flower, fruit, and leaf traits help botanists organize plant relationships.",
    category: "Botany",
    readingTime: 11,
    featured: false,
    sections: [
      {
        heading: "What a plant family represents",
        paragraphs: [
          "Plant families are groups within a scientific classification system. They help organize species that share patterns of ancestry and often have useful similarities in flowers, fruits, leaves, or other structures.",
          "A family name is a broad clue, not a complete description of every member. Species within one family can occupy different habitats and have very different forms.",
        ],
      },
      {
        heading: "Compare structures, not just names",
        paragraphs: [
          "Botanists use combinations of characters to compare plants. Flower structure, fruit type, leaf arrangement, and other details can help distinguish families, but no single visible trait is guaranteed to apply to every species.",
          "Scientific names show how a plant is placed in a hierarchy, from family to genus and species. Common names are useful locally but can vary between languages and regions.",
        ],
      },
      {
        heading: "Use classification as a guide",
        paragraphs: [
          "Knowing a family can help you find related plants and references. Confirm the current classification in a trusted botanical source, because scientific understanding and naming can change as evidence develops.",
          "Classification does not establish that related plants are interchangeable, edible, or safe to use. Treat each species as its own subject of study.",
        ],
      },
    ],
  },
  {
    id: "responsible-herbal-knowledge",
    title: "Using Herbal Knowledge Responsibly",
    description: "Learn the difference between cultural documentation, household practice, and qualified medical guidance.",
    category: "Responsible use",
    readingTime: 6,
    featured: false,
    sections: [
      {
        heading: "Describe knowledge in context",
        paragraphs: [
          "Herbal knowledge can be cultural, historical, household, ecological, or scientific. Record who shared or published an account, the community and place it concerns, and the limits of what the source can support.",
          "Respect community ownership and attribution. A short summary should not detach a practice from its cultural setting or imply that one account represents every person or tradition.",
        ],
      },
      {
        heading: "Separate learning from health advice",
        paragraphs: [
          "Traditional use, laboratory findings, and clinical evidence are not interchangeable. Explain which kind of information is being discussed and avoid claims that promise prevention, diagnosis, or treatment.",
          "Plant identity, preparation, dose, interactions, and individual health circumstances can affect risk. This educational site does not provide instructions for using plants as medicine.",
        ],
      },
      {
        heading: "Choose care and respect",
        paragraphs: [
          "Do not ingest or apply a wild plant based on an online description or image. For health questions, talk with a qualified healthcare professional; for identification, consult an appropriate botanical expert.",
          "When sharing plant knowledge, protect sensitive locations, follow access and conservation rules, and acknowledge the people and sources whose work made the information possible.",
        ],
      },
    ],
  },
];
