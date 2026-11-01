import type { PlantImageAsset } from "../types/images";

interface PlantImageSource {
  filename: string;
  creator: string;
  license: "CC0" | "CC BY 4.0" | "Public domain";
  file?: string;
  localFile?: string;
}

/** Individual botanical sources; all Commons images link back to their file page. */
export const plantImageSources: Record<string, PlantImageSource> = {
  tulsi: { filename: "Ocimum Tenuiflorum.jpg", creator: "Aldrina A Manashe", license: "CC0", localFile: "tulsi.jpg" },
  neem: { filename: "The Neem Tree.jpg", creator: "Elakkiya Loganayaki", license: "CC0", localFile: "neem.jpg" },
  ashwagandha: { filename: "Withania somnifera illustration.jpg", creator: "J. Sibthorp and J. E. Smith", license: "Public domain" },
  "aloe-vera": { filename: "ALOE VERA.jpg", creator: "Divya Chinnasamy", license: "CC0", localFile: "aloe-vera.jpg" },
  turmeric: { filename: "Foto 1 Alawahu (Curcuma longa).jpg", creator: "Ayuwadala", license: "CC BY 4.0" },
  brahmi: { filename: "Bacopa monnieri habit and habitat.jpg", creator: "Alex Abair", license: "CC BY 4.0" },
  amla: { filename: "Phyllanthus emblica 434861471.jpg", creator: "Karthik Thrikkadeeri", license: "CC BY 4.0" },
  lemongrass: { filename: "Serai (Cymbopogon citratus).jpg", creator: "TATANG ISKANDAR", license: "CC BY 4.0" },
  mint: { filename: "Mentha arvensis 304861403.jpg", creator: "katrin_simon", license: "CC BY 4.0" },
  giloy: { filename: "Tinospora cordifolia-5-hasthampatty-salem-India.jpg", creator: "Yercaud-elango", license: "CC BY 4.0" },
  hibiscus: { filename: "Hibiscus rosa-sinensis in Salem.jpg", creator: "Padma Chinapaiyan", license: "CC BY 4.0" },
  moringa: { filename: "Moringa oleifera plant.jpg", creator: "Komavo", license: "CC0" },
  "apple-tree": { filename: "Blooming apple tree in spring in Poland.jpg", creator: "Nigel-Z.22", license: "CC BY 4.0" },
  "ash-tree": { filename: "Fraxinus excelsior 245829075.jpg", creator: "Barry Walter", license: "CC BY 4.0", localFile: "ash-tree.jpg" },
  "cherry-tree": { filename: "20210329 Prunus cerasifera.jpg", creator: "Flocci Nivis", license: "CC BY 4.0" },
  "holly-tree": { filename: "Ilex aquifolium 161660962.jpg", creator: "Stephen James McWilliam", license: "CC BY 4.0", localFile: "holly-tree.jpg" },
  "birch-tree": { filename: "Betula pendula Church Wood.jpg", creator: "Wikimedia Commons contributor", license: "CC BY 4.0" },
  "maple-tree": { filename: "Acer platanoides 4 RF.jpg", creator: "Robert Flogaus-Faust", license: "CC BY 4.0" },
  "oak-tree": { filename: "Quercus robur RF.jpg", creator: "Robert Flogaus-Faust", license: "CC BY 4.0", localFile: "oak-tree.jpg" },
};

const commonNameFor = (id: string) => id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");

export const createPendingPlantImages = (
  id: string,
  commonName = commonNameFor(id),
): { image: PlantImageAsset; images: PlantImageAsset[] } => {
  const source = plantImageSources[id];
  const sourcePage = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(source.filename).replaceAll("%20", "_")}`;
  const imageUrl = source.localFile
    ? `/images/plants/${source.localFile}`
    : `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(source.filename)}?width=1200`;
  const credit = `Photo: ${source.creator} · ${source.license}`;
  const createAsset = (role: PlantImageAsset["role"], alt: string, aspectRatio: `${number}/${number}`): PlantImageAsset => ({
    src: imageUrl,
    alt,
    aspectRatio,
    focalPoint: { x: 50, y: 48 },
    role,
    credit,
    sourceId: sourcePage,
    status: "ready",
  });

  return {
    image: createAsset("card", `${commonName} showing its characteristic leaves, flowers, or natural form`, "4/3"),
    images: [
      createAsset("hero", `Botanical view of ${commonName}`, "16/10"),
      createAsset("garden", `${commonName} growing in its habitat`, "3/4"),
    ],
  };
};
