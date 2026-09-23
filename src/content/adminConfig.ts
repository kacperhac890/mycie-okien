import { envOr } from "../lib/env";

/* ==================================================================
   KONFIGURACJA PANELU

   O BEZPIECZEŃSTWIE, BEZ OWIJANIA:
   Strona jest statyczna, więc hasło sprawdzane w przeglądarce nie jest
   zabezpieczeniem. Kod panelu i tak da się przeczytać w źródłach.
   Hasło pełni rolę zamka na furtce: odsiewa przypadkowych gości.

   Prawdziwą kontrolę daje token GitHuba. Bez niego z panelu nie da się
   niczego opublikować, a token nigdy nie trafia do kodu strony:
   wpisujesz go ręcznie i zostaje wyłącznie w Twojej przeglądarce.
   ================================================================== */

/** SHA-256 domyślnego hasła `okna-admin-2026`. Zmiana: patrz README. */
const DEFAULT_PASS_HASH = "3e720a2b23987bbb4e90a42a408c045a1ca9241e6207385f4ba6078e64d62f44";

export const ADMIN_PASS_HASH = envOr(import.meta.env.VITE_ADMIN_PASS_HASH, DEFAULT_PASS_HASH);

export const REPO = {
  owner: envOr(import.meta.env.VITE_GH_OWNER, "kacperhac890"),
  name: envOr(import.meta.env.VITE_GH_REPO, "mycie-okien"),
  branch: envOr(import.meta.env.VITE_GH_BRANCH, "main"),
};

/** Ścieżki w repozytorium. */
export const CONTENT_FILE = "public/content.json";
export const MEDIA_DIR = "public/media";

/** Ścieżka zapisywana w content.json, względna wobec katalogu strony. */
export const MEDIA_PREFIX = "media";
