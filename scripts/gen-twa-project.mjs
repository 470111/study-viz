/**
 * Generates the Trusted Web Activity project without Bubblewrap CLI interactive prompts.
 * Same data path as `bubblewrap init` (uses @bubblewrap/core).
 */

import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  BufferedLog,
  ConsoleLog,
  TwaGenerator,
  TwaManifest,
} from '@bubblewrap/core';

const ROOT = dirname(fileURLToPath(import.meta.url));
const STUDY_ROOT = dirname(ROOT);

const WEB_MANIFEST =
  process.env.STUDY_VIZ_WEB_MANIFEST ??
  'https://470111.github.io/study-viz/manifest.webmanifest';

/** Android package IDs cannot start an identifier segment with a digit (`470111`). */
const PACKAGE_ID =
  process.env.TWA_PACKAGE_ID ?? 'io.github.pages470111.studyviz';

const TWADIR = join(STUDY_ROOT, 'twa');

function sha1(buf) {
  return crypto.createHash('sha1').update(buf).digest('hex');
}

const twa = await TwaManifest.fromWebManifest(WEB_MANIFEST);
twa.packageId = PACKAGE_ID;
twa.generatorApp = 'bubblewrap';

twa.launcherName = twa.launcherName.slice(0, 12);

// origin is only the host; GitHub Pages needs the path (e.g. /study-viz/icon-512.png).
twa.iconUrl = new URL('icon-512.png', WEB_MANIFEST).href;

twa.signingKey.path = join(TWADIR, 'android.keystore');

const err = twa.validate();
if (err) {
  console.error(`Invalid TWA manifest: ${err}`);
  process.exit(1);
}

await fs.rm(TWADIR, { recursive: true, force: true });
await fs.mkdir(TWADIR, { recursive: true });

const log = new BufferedLog(new ConsoleLog('gen'));
const gen = new TwaGenerator();

await gen.createTwaProject(TWADIR, twa, log);

const manifestPath = join(TWADIR, 'twa-manifest.json');
await twa.saveToFile(manifestPath);

const jsonBuf = await fs.readFile(manifestPath);
await fs.writeFile(join(TWADIR, 'manifest-checksum.txt'), sha1(jsonBuf), 'utf8');

log.flush();
console.log('TWA project written to', TWADIR);
