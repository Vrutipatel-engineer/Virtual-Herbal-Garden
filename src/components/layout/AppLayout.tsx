import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { ScrollManager } from "./ScrollManager";
import { AppErrorBoundary } from "../common/AppErrorBoundary";

export function AppLayout() {
  return (
    <div className="app-shell">
      <ScrollManager />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <AppErrorBoundary>
          <Outlet />
        </AppErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
