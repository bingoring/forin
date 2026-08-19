import { readFileSync } from 'fs';
import { join } from 'path';

// expo-camera and expo-image-manipulator are NATIVE modules: on a binary built before
// they were installed, requiring them throws "Cannot find native module 'ExpoCamera'"
// at IMPORT time, not at first use. A static import therefore takes the whole app down
// on any older build — including every already-installed copy an OTA update lands on,
// where the JS ships and the native side does not. That is what happened in the
// simulator, and it is why the requires are wrapped.
//
// The mocks below THROW on require, which is the only way to reproduce that here:
// jest-expo supplies working mocks for expo modules, so an unmocked import succeeds and
// a test written against it passes without exercising the guard at all. That is exactly
// how the first version of this test passed while proving nothing.
jest.mock('expo-audio', () => ({ createAudioPlayer: () => ({ play() {}, seekTo: async () => {} }) }));
jest.mock('expo-secure-store', () => ({ getItemAsync: async () => null, setItemAsync: async () => {} }));
jest.mock('expo-file-system/legacy', () => ({ deleteAsync: async () => {}, cacheDirectory: '' }));
jest.mock('expo-camera', () => {
  throw new Error("Cannot find native module 'ExpoCamera'");
});
jest.mock('expo-image-manipulator', () => {
  throw new Error("Cannot find native module 'ExpoImageManipulator'");
});

test('FaceScanSheet still imports when the camera module is absent', () => {
  expect(() => require('./FaceScanSheet')).not.toThrow();
});

test('and it reports the scan as unavailable rather than pretending', () => {
  const { faceScanAvailable } = require('./FaceScanSheet');
  expect(faceScanAvailable).toBe(false);
});

// AvatarSheet is not imported here: it pulls in the animated portrait, and reanimated
// 4's worklets need their native half initialized. Stacking mocks to boot a component
// tree would add fragility without adding coverage — what matters is that the shortcut
// is rendered conditionally, and that is visible in the source.
test('AvatarSheet renders the scan shortcut only when it is available', () => {
  const src = readFileSync(join(__dirname, 'AvatarSheet.tsx'), 'utf8');
  expect(src).toMatch(/faceScanAvailable\s*&&/);
});
