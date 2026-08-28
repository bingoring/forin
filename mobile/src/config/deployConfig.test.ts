// Cross-file invariants between app.json and eas.json. The 9-B final review
// flagged that nothing in this repo checks these — they're only enforced by a
// human remembering to keep three copies of the Kakao key in sync, or by
// ota.yml's jq guard, which only runs when someone dispatches an OTA. This
// pulls the same class of check to push time (jest runs on every push/PR),
// where a config drift is far cheaper to catch than after a broken build ships.
// (Imported directly rather than via fs/path: `resolveJsonModule` is already on
// in expo's base tsconfig, and it keeps this test free of a Node-types dependency
// that the rest of this RN project doesn't otherwise need.)
import appJson from '../../app.json';
import easJson from '../../eas.json';

const REQUIRED_ENV_KEYS = [
  'EXPO_PUBLIC_API_URL',
  'EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID',
  'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
  'EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY',
] as const;

const BUILD_PROFILES = ['preview', 'production'] as const;

function kakaoPluginConfig(): { nativeAppKey: string } {
  const entry = (appJson.expo.plugins as unknown[]).find(
    (p): p is [string, { nativeAppKey: string }] => Array.isArray(p) && p[0] === '@react-native-kakao/core'
  );
  if (!entry) throw new Error('@react-native-kakao/core plugin entry not found in app.json — did the plugin get renamed/removed?');
  return entry[1];
}

describe('app.json / eas.json cross-file invariants', () => {
  test('Kakao native app key is identical across app.json plugin config + both eas.json build profiles', () => {
    const fromAppJson = kakaoPluginConfig().nativeAppKey;
    const fromPreview = easJson.build.preview.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;
    const fromProduction = easJson.build.production.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY;

    expect(fromPreview).toBe(fromAppJson);
    expect(fromProduction).toBe(fromAppJson);
  });

  test.each(BUILD_PROFILES)('%s build profile declares all 4 EXPO_PUBLIC_* keys, non-blank', (profile) => {
    const env = easJson.build[profile]?.env ?? {};
    for (const key of REQUIRED_ENV_KEYS) {
      expect(typeof env[key]).toBe('string');
      expect((env[key] as string).trim().length).toBeGreaterThan(0);
    }
  });

  test('app.json updates.url points at the same EAS project as extra.eas.projectId', () => {
    const projectId: string = appJson.expo.extra.eas.projectId;
    const updatesUrl: string = appJson.expo.updates.url;
    expect(updatesUrl.endsWith(`/${projectId}`)).toBe(true);
  });

  test.each(BUILD_PROFILES)('%s channel name equals its build profile name', (profile) => {
    expect(easJson.build[profile].channel).toBe(profile);
  });

  // eas-cli documents ascAppId as digits-only, max 30 — but `eas config` does
  // NOT enforce it: probed with "680158239a" and the config loaded clean while
  // an unknown key in the same block was rejected. So a typo'd App Store
  // Connect ID passes every local check and only surfaces when a real
  // `eas submit` reaches Apple, after a full build has already been spent.
  test('submit.production.ios.ascAppId is digits-only and within length', () => {
    const ascAppId: string = easJson.submit.production.ios.ascAppId;
    expect(ascAppId).toMatch(/^\d+$/);
    expect(ascAppId.length).toBeLessThanOrEqual(30);
  });

  // `eas build --profile X` reads build.X while `eas submit --profile X` reads
  // submit.X. A submit profile with no build twin means the binary being
  // submitted was configured by a different profile than the one named.
  test('every submit profile has a build profile of the same name', () => {
    for (const name of Object.keys(easJson.submit)) {
      expect(Object.keys(easJson.build)).toContain(name);
    }
  });
});

// ── OTA has exactly one door ──────────────────────────────────────────────
//
// `.github/workflows/ota.yml` is the sanctioned path: it injects EXPO_PUBLIC_* from
// eas.json, re-runs tsc and the test suite, gates on the fingerprint actually being
// reachable by an installed build, and requires a reviewer. package.json's `ota` script
// is a stub whose only job is to say so.
//
// That stub was already here and it did not stop a local publish, because nothing
// stopped a NEW script from being added beside it. One was — and the two publishes it
// made went out without the type-check, without the approval, and one of them with a
// changed fingerprint, so it reached zero devices while reporting success. The
// reachability gate in ota.yml is precisely the check that would have refused it.
//
// fs/path here, unlike the imports above: the point is to see every file, including
// ones that do not exist yet.
describe('eas update is only reachable through ota.yml', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { readdirSync, readFileSync, statSync } = require('fs') as typeof import('fs');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { join } = require('path') as typeof import('path');

  const REPO = join(__dirname, '..', '..', '..');
  const SKIP = new Set(['node_modules', '.git', '.expo', 'dist', 'ios', 'android', '.github']);

  function files(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      if (SKIP.has(e.name)) return [];
      const p = join(dir, e.name);
      if (e.isDirectory()) return files(p);
      return /\.(mjs|cjs|js|ts|tsx|sh|ya?ml|json)$/.test(e.name) && statSync(p).size < 400_000 ? [p] : [];
    });
  }

  test('no script or workflow outside .github publishes an update', () => {
    const offenders: string[] = [];
    for (const file of files(REPO)) {
      const src = readFileSync(file, 'utf8');
      // `eas update` / `eas-cli update` / `eas-cli@x update` as an actual invocation.
      // The package.json stub is allowed to NAME it — that string is the warning.
      // Two files are allowed to contain the phrase without invoking it: the
      // package.json stub, whose whole content is the warning, and this test, which
      // has to spell out what it is looking for.
      if (file === __filename || file.endsWith(join('mobile', 'package.json'))) continue;
      // Both call shapes. The first version of this pattern required whitespace
      // between the binary and the subcommand, which matched a shell line
      // (`npx eas-cli@21.8.0 update …`) and missed an argv array
      // (`['eas-cli@latest', 'update', …]`) — the exact form the script this guard
      // exists to prevent actually used, so the guard passed while the offender sat
      // two directories away.
      if (/eas(-cli)?(@[\w.]+)?['"`]?[\s,]+['"`]?update\b/.test(src)) {
        offenders.push(file.slice(REPO.length + 1));
      }
    }
    expect(offenders).toEqual([]);
  });

  test('the package.json stub still refuses and still points at the workflow', () => {
    const script = (appJson as unknown as Record<string, never>) && require('../../package.json').scripts?.ota as string;
    expect(script).toBeDefined();
    expect(script).toMatch(/exit 1/);
    expect(script).toMatch(/ota\.yml/);
  });
});
