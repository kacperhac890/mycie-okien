import { useState } from "react";
import type { FormEvent } from "react";
import { Lock } from "lucide-react";
import { ADMIN_PASS_HASH } from "../../content/adminConfig";
import { Button } from "../ui/Button";
import { FieldError, TextField } from "../ui/Field";

async function sha256(text: string) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function AdminLock({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(undefined);

    try {
      if (!crypto?.subtle) {
        throw new Error("Przeglądarka nie udostępnia funkcji szyfrujących.");
      }
      /* Gdyby skrót hasła był pusty albo uszkodzony, żadne hasło nie
         zadziała. Lepiej powiedzieć to wprost niż udawać, że użytkownik
         się pomylił. */
      if (!/^[a-f0-9]{64}$/i.test(ADMIN_PASS_HASH)) {
        throw new Error(
          "Błąd konfiguracji: brak poprawnego skrótu hasła. Sprawdź zmienną VITE_ADMIN_PASS_HASH.",
        );
      }
      const hash = await sha256(value);
      if (hash === ADMIN_PASS_HASH) onUnlock();
      else setError("Nieprawidłowe hasło.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nie udało się sprawdzić hasła.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-5 py-16">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-card border border-line bg-surface p-7 shadow-raise"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-control bg-accent-soft text-accent">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </span>

        <h1 className="mt-5 text-2xl font-bold tracking-[-0.025em] text-ink">Panel treści</h1>
        <p className="body-text mt-2 text-[0.875rem]">
          Edycja opinii, zdjęć i realizacji. Do opublikowania zmian potrzebny jest osobny token
          GitHuba.
        </p>

        <div className="mt-6">
          <TextField
            label="Hasło"
            type="password"
            autoComplete="current-password"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <FieldError>{error}</FieldError>
        </div>

        <Button type="submit" size="lg" full className="mt-5" disabled={busy || !value}>
          {busy ? "Sprawdzam" : "Wejdź"}
        </Button>

        <p className="mt-5 text-[0.75rem] leading-relaxed text-ink-faint">
          Hasło działa tylko po stronie przeglądarki i chroni przed przypadkowym wejściem, a nie
          przed kimś, kto zna się na rzeczy. Zmian na stronie nie da się zapisać bez tokenu
          GitHuba.
        </p>
      </form>
    </div>
  );
}
