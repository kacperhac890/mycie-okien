import { useState } from "react";
import { CheckCircle2, Download, ExternalLink, KeyRound, Loader2, Upload } from "lucide-react";
import { REPO } from "../../content/adminConfig";
import { publishContent } from "../../content/publish";
import type { PublishProgress } from "../../content/publish";
import { actionsUrl, checkToken, newTokenUrl } from "../../lib/github";
import { draftSizeKb } from "../../content/store";
import type { SiteContent } from "../../content/types";
import { Button } from "../ui/Button";
import { FieldError, TextField } from "../ui/Field";

const TOKEN_KEY = "admin-gh-token";

function readToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

type Props = {
  draft: SiteContent;
  dirty: boolean;
  onPublished: (content: SiteContent) => void;
};

export function PublishPanel({ draft, dirty, onPublished }: Props) {
  const [token, setToken] = useState(readToken);
  const [remember, setRemember] = useState(() => readToken().length > 0);
  const [status, setStatus] = useState<"idle" | "checking" | "publishing" | "done">("idle");
  const [progress, setProgress] = useState<PublishProgress | null>(null);
  const [error, setError] = useState<string>();
  const [checked, setChecked] = useState<string>();

  function persistToken(value: string, keep: boolean) {
    try {
      if (keep && value) window.localStorage.setItem(TOKEN_KEY, value);
      else window.localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* brak storage nie blokuje publikacji */
    }
  }

  async function verify() {
    setError(undefined);
    setChecked(undefined);
    setStatus("checking");
    try {
      const name = await checkToken(token.trim());
      setChecked(name);
      persistToken(token.trim(), remember);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Nie udało się sprawdzić tokenu.");
    } finally {
      setStatus("idle");
    }
  }

  async function publish() {
    setError(undefined);
    setStatus("publishing");
    setProgress(null);
    try {
      const published = await publishContent(draft, token.trim(), setProgress);
      persistToken(token.trim(), remember);
      onPublished(published);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publikacja się nie powiodła.");
      setStatus("idle");
    }
  }

  function downloadJson() {
    const blob = new Blob([`${JSON.stringify(draft, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  const busy = status === "checking" || status === "publishing";
  const sizeKb = draftSizeKb(draft);

  return (
    <div className="max-w-[46rem]">
      <h2 className="text-xl font-bold tracking-[-0.02em] text-ink">Publikacja</h2>
      <p className="body-text mt-2 max-w-[60ch] text-[0.875rem]">
        Publikacja zapisuje zmiany w repozytorium <strong>{REPO.owner}/{REPO.name}</strong>. Push do
        gałęzi <code>{REPO.branch}</code> uruchamia przebudowę strony, więc zmiany są widoczne dla
        odwiedzających po około minucie.
      </p>

      <div className="mt-6 rounded-card border border-line bg-surface p-5">
        <h3 className="flex items-center gap-2 text-[0.9375rem] font-bold text-ink">
          <KeyRound className="h-4 w-4 text-accent" aria-hidden="true" />
          Token GitHuba
        </h3>
        <p className="body-text mt-2 text-[0.8125rem]">
          Token zostaje wyłącznie w Twojej przeglądarce. Nie trafia do kodu strony ani do
          repozytorium, więc nikt poza Tobą go nie zobaczy.
        </p>

        <a
          href={newTokenUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-pill bg-accent-soft px-4 py-2.5 text-[0.875rem] font-semibold text-accent transition-colors hover:bg-accent/15"
        >
          Utwórz token na GitHubie
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>

        <p className="mt-3 text-[0.75rem] leading-relaxed text-ink-faint">
          Link otwiera formularz z zaznaczonym zakresem <code>public_repo</code>. Ustaw termin
          ważności, kliknij „Generate token" i skopiuj wynik tutaj. Alternatywa: token
          drobnoziarnisty z uprawnieniem <strong>Contents: Read and write</strong> tylko do tego
          repozytorium.
        </p>

        <div className="mt-4">
          <TextField
            label="Token"
            type="password"
            autoComplete="off"
            spellCheck={false}
            placeholder="github_pat_..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-[0.8125rem] font-medium text-ink">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => {
              setRemember(e.target.checked);
              persistToken(token.trim(), e.target.checked);
            }}
            className="h-5 w-5 shrink-0 rounded-[6px] border-2 border-line-strong accent-accent"
          />
          Zapamiętaj token w tej przeglądarce
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" onClick={verify} disabled={!token || busy}>
            {status === "checking" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sprawdzam
              </>
            ) : (
              "Sprawdź token"
            )}
          </Button>

          {checked ? (
            <span className="inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-success">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Dostęp do {checked} potwierdzony
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5 rounded-card border border-line bg-surface p-5">
        <h3 className="text-[0.9375rem] font-bold text-ink">Wyślij zmiany</h3>
        <p className="body-text mt-2 text-[0.8125rem]">
          {dirty
            ? `Masz niezapisane zmiany. Rozmiar szkicu: ${sizeKb} kB.`
            : "Brak zmian do opublikowania."}
        </p>

        {progress ? (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[0.8125rem] font-semibold text-ink">
              <span>{progress.step}</span>
              <span className="tabular-nums">
                {progress.done} / {progress.total}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-line">
              <div
                className="h-full rounded-pill bg-accent transition-[width] duration-300"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : null}

        {status === "done" ? (
          <p className="mt-4 flex flex-wrap items-center gap-2 rounded-control border border-line bg-surface-inset px-4 py-3 text-[0.875rem] text-ink">
            <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
            Zapisane. Strona przebuduje się automatycznie.
            <a
              href={actionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-accent underline underline-offset-2"
            >
              Podgląd wdrożenia
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </p>
        ) : null}

        <FieldError>{error}</FieldError>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={publish} disabled={!token || !dirty || busy}>
            {status === "publishing" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Publikuję
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" aria-hidden="true" />
                Opublikuj zmiany
              </>
            )}
          </Button>

          <Button type="button" variant="secondary" onClick={downloadJson}>
            <Download className="h-4 w-4" aria-hidden="true" />
            Pobierz content.json
          </Button>
        </div>

        <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-faint">
          Nie chcesz używać tokenu? Pobierz plik i wgraj go ręcznie do repozytorium jako{" "}
          <code>public/content.json</code>. Efekt jest identyczny.
        </p>
      </div>
    </div>
  );
}
