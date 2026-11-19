// Leonida Trophy Guide — the entrypoint that hands the guide in.
//
// The guide itself is plain static files under app/ (index.html, CSS, JS and
// app/data/trophies.json with the 55 official trophies and their guides), and
// the screenshots under screenshots/ are real renders of that app. This program
// copies both into the grader's output directory and writes dossier.json with
// the vendored make.fun library, exactly as the scorer rebuilds it.
//
// Runs on Node 22 with the standard library only; no install step, no network.
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });

const shotsDir = join(outDir, 'screenshots');
mkdirSync(shotsDir, { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), shotsDir, { recursive: true });
}

// Caps the scorer enforces on /output (see the kit's RULES.txt, "The gate"):
// at most 4 screenshots of 256 KiB each, at most 993 files / 48 MiB in app/,
// and the dossier text capped at 160 KiB. buildDossier refuses anything over.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
