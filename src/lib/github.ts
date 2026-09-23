import { REPO } from "../content/adminConfig";

/* ==================================================================
   ZAPIS DO REPOZYTORIUM PRZEZ API GITHUBA

   Panel publikuje zmiany, zapisując pliki w repozytorium. Push do main
   uruchamia workflow, który przebudowuje i wdraża stronę, więc zmiany
   są widoczne dla odwiedzających po około minucie.

   Token podaje użytkownik w panelu i trzymany jest tylko po stronie
   przeglądarki. Nigdy nie zapisujemy go w repozytorium ani w kodzie.
   Potrzebne uprawnienie: "Contents: Read and write" (token drobnoziarnisty)
   albo zakres `repo` (token klasyczny).
   ================================================================== */

const API = "https://api.github.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function repoUrl(path: string) {
  return `${API}/repos/${REPO.owner}/${REPO.name}/contents/${path}`;
}

export function utf8ToBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

async function readError(res: Response) {
  try {
    const body = (await res.json()) as { message?: string };
    return body.message ?? `${res.status} ${res.statusText}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

/** Sprawdza, czy token działa i czy ma prawo zapisu w tym repozytorium. */
export async function checkToken(token: string) {
  const res = await fetch(`${API}/repos/${REPO.owner}/${REPO.name}`, { headers: headers(token) });
  if (!res.ok) throw new Error(await readError(res));
  const repo = (await res.json()) as { permissions?: { push?: boolean }; full_name?: string };
  if (!repo.permissions?.push) {
    throw new Error("Token nie ma uprawnienia do zapisu w tym repozytorium.");
  }
  return repo.full_name ?? `${REPO.owner}/${REPO.name}`;
}

/** Zwraca sha istniejącego pliku albo null, gdy pliku jeszcze nie ma. */
async function fileSha(path: string, token: string): Promise<string | null> {
  const res = await fetch(`${repoUrl(path)}?ref=${REPO.branch}`, { headers: headers(token) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await readError(res));
  const body = (await res.json()) as { sha?: string };
  return body.sha ?? null;
}

/** Tworzy albo aktualizuje plik w repozytorium. */
export async function putFile(options: {
  path: string;
  base64: string;
  message: string;
  token: string;
}) {
  const sha = await fileSha(options.path, options.token);

  const res = await fetch(repoUrl(options.path), {
    method: "PUT",
    headers: { ...headers(options.token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: options.message,
      content: options.base64,
      branch: REPO.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) throw new Error(await readError(res));
}

/** Rozkłada data URL na część base64 i rozszerzenie pliku. */
export function parseDataUrl(dataUrl: string) {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(dataUrl);
  if (!match) return null;
  const [, mime, base64] = match;
  const ext = mime.split("/")[1].replace("jpeg", "jpg").replace("svg+xml", "svg");
  return { base64, ext };
}

export const actionsUrl = `https://github.com/${REPO.owner}/${REPO.name}/actions`;
