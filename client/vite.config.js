import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../server/src/client", // Dossier de sortie personnalisé
    emptyOutDir: true,
  },
});
