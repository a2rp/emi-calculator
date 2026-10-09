import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/emi-calculator/",
    build: { sourcemap: false },
    plugins: [react()],
});