import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
// One self-contained HTML file, like the real page: opens from disk, needs no server and no Node.
export default defineConfig({ plugins: [react(), viteSingleFile()] });
