import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@fontsource-variable/manrope";
import "./styles/index.css";
import App from "./App";
import { ContentProvider } from "./content/ContentProvider";

const root = document.getElementById("root");
if (!root) throw new Error("Brak elementu #root w index.html");

createRoot(root).render(
  <StrictMode>
    {/* basename = ścieżka bazowa z Vite, dzięki temu trasy działają
        zarówno lokalnie, jak i w podkatalogu GitHub Pages. */}
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>,
);
