#!/usr/bin/env node
// Publish an EAS Update, with the one check that `eas update` does not do for you.
//
// This exists because of a shipped outage. `eas update --environment production`
// resolves EXPO_PUBLIC_* from the EAS *environment* variable store — which is empty
// for this project. The build profiles in eas.json carry those values instead, and
// `eas update` never reads them. So the export ran with EXPO_PUBLIC_API_URL undefined,
// api/client.ts fell back to its dev default, and the published bundle pointed every
// device at http://localhost:8080. The update succeeded, the CLI said "Published!",
// and the app came up with every tab empty.
//
// Two things follow, and both are the point of this script:
//
//  1. eas.json is the single source of truth for the env. It is read here and exported
//     into the bundler's environment, so an OTA carries exactly what a build of the
//     same profile would.
//  2. The bundle is exported first, INSPECTED, and only then published — with
//     `--input-dir`, so the bytes that were checked are the bytes that ship. Checking
//     after publishing would only tell us which outage we already caused.
//
// Usage: node scripts/ota.mjs <profile> "<message>"   (profile = eas.json build profile)
import { execFileSync } from 'node:child_process';
import { readFileSync, rmSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const [profile, message] = process.argv.slice(2);
if (!profile || !message) {
  console.error('usage: node scripts/ota.mjs <profile> "<message>"');
  process.exit(2);
}

const easJson = JSON.parse(readFileSync(new URL('../eas.json', import.meta.url), 'utf8'));
const build = easJson.build?.[profile];
if (!build) {
  console.error(`eas.json has no build profile "${profile}". Profiles: ${Object.keys(easJson.build ?? {}).join(', ')}`);
  process.exit(2);
}
const env = build.env ?? {};
// A profile that carries no API URL cannot be published safely by this script: there
// would be nothing to check the bundle against, which is the state that caused the
// outage in the first place.
const apiURL = env.EXPO_PUBLIC_API_URL;
if (!apiURL) {
  console.error(`build.${profile}.env has no EXPO_PUBLIC_API_URL — refusing to publish an unverifiable bundle.`);
  process.exit(2);
}
// The channel the update goes to. Named by the profile, per eas.json.
const channel = build.channel ?? profile;

// OUTSIDE the project, and that is not a tidiness preference. `.gitignore` is a
// fingerprint source (`bareGitIgnore`), so adding an ignore entry for an export
// directory changes the runtime version — and an update published under a runtime
// version no installed build has is delivered to nobody. Writing to the OS temp dir
// needs no ignore entry, so it cannot move the fingerprint.
const OUT = join(tmpdir(), 'forin-ota-export');
rmSync(OUT, { recursive: true, force: true });

const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', env: { ...process.env, ...env } });

// `--clear` is load-bearing, not hygiene. Metro caches the TRANSFORMED module, and
// EXPO_PUBLIC_* values are inlined during transform — so an export whose env differs
// from the last one silently reuses the old inlined value. That is how a run with the
// API URL correctly set still produced a bundle pointing at localhost.
console.log(`\n▸ exporting ${profile} (API ${apiURL})`);
run('npx', ['expo', 'export', '--clear', '--platform', 'all', '--output-dir', OUT]);

// ── the check ──────────────────────────────────────────────────────────────
// Hermes bytecode, so this is a byte search over the whole export rather than a
// parse. Crude on purpose: the question is only whether the string made it in.
function bundles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return bundles(p);
    return /\.(hbc|js)$/.test(e.name) && statSync(p).size > 0 ? [p] : [];
  });
}
const found = bundles(OUT);
if (found.length === 0) {
  console.error(`no bundles under ${OUT} — nothing was exported.`);
  process.exit(1);
}

const host = new URL(apiURL).host;
const problems = [];
// Per PLATFORM, not per file: an export splits into an entry bundle plus runtime and
// route chunks, and only one of them holds the API URL. Requiring every chunk to carry
// it fails on the chunks that never could.
const carriesHost = new Set();
for (const file of found) {
  const bytes = readFileSync(file);
  const platform = /static\/js\/([^/]+)\//.exec(file)?.[1] ?? 'unknown';
  if (bytes.includes(host)) carriesHost.add(platform);
  // api/client.ts's dev fallback. Its presence means EXPO_PUBLIC_API_URL was undefined
  // when this bundle was built — the exact outage this script exists to prevent.
  if (bytes.includes('localhost:8080')) problems.push(`${file}: contains the localhost fallback`);
}
// The two platforms an EAS Update actually reaches. Web is exported alongside them and
// is not part of the update.
for (const platform of ['ios', 'android']) {
  if (!carriesHost.has(platform)) problems.push(`${platform}: no bundle contains ${host}`);
}
if (problems.length > 0) {
  console.error('\n✕ bundle check failed — NOT publishing:\n  ' + problems.join('\n  '));
  process.exit(1);
}
console.log(`\n✓ ios + android point at ${host}; no bundle carries the localhost fallback`);

// ── publish the checked bytes ──────────────────────────────────────────────
console.log(`\n▸ publishing to channel "${channel}"`);
run('npx', ['eas-cli@latest', 'update',
  '--branch', channel,
  '--environment', profile,
  '--input-dir', OUT,
  '--message', message,
  '--non-interactive']);
