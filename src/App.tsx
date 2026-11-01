import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { HomePage } from "./pages/HomePage";
import { MyGardenPage } from "./pages/MyGardenPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RegionsPage } from "./pages/RegionsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { LoadingSkeleton } from "./components/common/LoadingSkeleton";

const GardenPage = lazy(() =>
  import("./pages/GardenPage").then((module) => ({ default: module.GardenPage })),
);
const PlantsPage = lazy(() =>
  import("./pages/PlantsPage").then((module) => ({ default: module.PlantsPage })),
);
const PlantDetailPage = lazy(() =>
  import("./pages/PlantDetailPage").then((module) => ({ default: module.PlantDetailPage })),
);
const ResourceDetailPage = lazy(() =>
  import("./pages/ResourceDetailPage").then((module) => ({ default: module.ResourceDetailPage })),
);

function GardenRouteLoading() {
  return (
    <div className="route-loading route-loading--garden" role="status" aria-live="polite">
      <span className="garden-loading__mark" aria-hidden="true" />
      <span>Preparing the garden…</span>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route
          path="plants"
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <PlantsPage />
            </Suspense>
          }
        />
        <Route
          path="plants/:id"
          element={
            <Suspense fallback={<LoadingSkeleton variant="detail" label="Loading plant profile" />}>
              <PlantDetailPage />
            </Suspense>
          }
        />
        <Route
          path="garden"
          element={
            <Suspense fallback={<GardenRouteLoading />}>
              <GardenPage />
            </Suspense>
          }
        />
        <Route path="my-garden" element={<MyGardenPage />} />
        <Route path="regions" element={<RegionsPage />} />
        <Route
          path="resources/:id"
          element={
            <Suspense fallback={<LoadingSkeleton variant="detail" label="Loading learning guide" />}>
              <ResourceDetailPage />
            </Suspense>
          }
        />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
