import { copyFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/* GitHub Pages nie ma przepisywania adresów po stronie serwera, więc wejście
   wprost na /polityka-cookies kończy się plikiem 404. Kopia index.html jako
   404.html sprawia, że w takiej sytuacji ładuje się aplikacja, a React Router
   odczytuje adres i pokazuje właściwą podstronę.

   .nojekyll wyłącza przetwarzanie Jekylla, które ignoruje katalogi z
   podkreśleniem na początku nazwy. */

const dist = resolve(process.cwd(), "dist");

await copyFile(resolve(dist, "index.html"), resolve(dist, "404.html"));
await writeFile(resolve(dist, ".nojekyll"), "");

console.log("postbuild: dodano 404.html i .nojekyll");
