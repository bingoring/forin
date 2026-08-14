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
