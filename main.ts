// Leonida Legend — the GTA VI trophy guide, handed in.
// Node 22, standard library only. No network, no build step: the guide is
// plain static files in app/ and its screenshots in screenshots/.
// This program copies both into the output directory and writes
// /output/dossier.json with the kit's vendored library, so the judge can
// read the entry's screenshots and source outline. Run it twice and both
// runs write the same bytes.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory this file lives in.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function countEntries(dir) {
  let total = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    total += 1;
    if (entry.isDirectory()) total += countEntries(join(dir, entry.name));
  }
  return total;
}

function fail(message) {
  console.error('main.ts: ' + message);
  process.exit(1);
}

// The entry needs its guide and at least one screenshot to hand in.
const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');
if (!existsSync(join(appDir, 'index.html'))) fail('app/index.html is missing');
if (!existsSync(join(appDir, 'data', 'trophies.json'))) fail('app/data/trophies.json is missing');
if (!existsSync(shotsDir) || readdirSync(shotsDir).filter((f) => statSync(join(shotsDir, f)).isFile()).length === 0) {
  fail('screenshots/ holds no screenshots');
}

// Start from a clean output directory so a second run writes identical bytes.
// Never remove the output directory itself: on the grader it is a mount point
// on a read-only root filesystem, so removing it fails with EACCES. Create it,
// then clear only its contents.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}
cpSync(appDir, join(outDir, 'app'), { recursive: true });
cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

// The scorer's own caps: dossier text, screenshots, and the app's size limits.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log(
  'handed in ' + countEntries(join(outDir, 'app')) + ' app entries and '
  + readdirSync(join(outDir, 'screenshots')).length + ' screenshots; dossier.json is '
  + Buffer.byteLength(dossier) + ' bytes',
);
