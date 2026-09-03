import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { GardenPage } from "./pages/GardenPage";
import { HomePage } from "./pages/HomePage";
import { MyGardenPage } from "./pages/MyGardenPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PlantDetailPage } from "./pages/PlantDetailPage";
import { PlantsPage } from "./pages/PlantsPage";
import { RegionsPage } from "./pages/RegionsPage";
import { ResourcesPage } from "./pages/ResourcesPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="plants" element={<PlantsPage />} />
        <Route path="plants/:id" element={<PlantDetailPage />} />
        <Route path="garden" element={<GardenPage />} />
        <Route path="my-garden" element={<MyGardenPage />} />
        <Route path="regions" element={<RegionsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
