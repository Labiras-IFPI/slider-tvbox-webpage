import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://labirasifpi.github.io/slider-tvbox-webpage/",
  plugins: [react()],
});
