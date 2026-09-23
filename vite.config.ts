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
    rollupOptions: {
      output: {
        /* Stałe nazwy plików zamiast nazw z hashem.

           GitHub Pages serwuje KAŻDY plik z Cache-Control: max-age=600,
           także te z hashem, więc hashowanie nic tu nie daje, a szkodzi:
           przez 10 minut po wdrożeniu przeglądarka może mieć w pamięci
           stary index.html wskazujący na plik, który po przebudowie już
           nie istnieje. Efektem jest 404 na skrypcie i pusta strona.

           Przy stałych nazwach stary index.html trafia zawsze w istniejący
           plik. Najgorsze, co się może zdarzyć, to zasoby sprzed 10 minut. */
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
