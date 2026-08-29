import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// See docs/ARCHITECTURE.md for why the frontend is a plain Vite SPA
// rather than a Next.js app.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
