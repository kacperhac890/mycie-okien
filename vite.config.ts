import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/* GitHub Pages serwuje projekt w podkatalogu (/nazwa-repo/), a lokalny dev
   w katalogu głównym. Ścieżkę bazową ustawia workflow przez BASE_PATH. */
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
  },
});
