import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      ignored: ["**/artifacts/**", "**/assets-3d/**"],
    },
  },
  preview: {
    port: 4173,
  },
});
