// Point the camera at your face, and let it pick a starting hair and skin colour.
//
// It does not draw your likeness — that needs a model this app has no business
// shipping, and the sheet says so. What it removes is the tedium of hunting two
// swatches: it reads them off a photo, applies them, and hands you back to the manual
// controls for everything else.
//
// The photo never leaves the device and is never kept. The camera writes a temp file
// and the resize writes another; both are deleted in a finally block, so an early
// return or a decode failure cannot leave an image of someone's face on disk.
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { deleteAsync } from 'expo-file-system/legacy';
import { BottomSheet } from '@/components/BottomSheet';
import { PixelButton } from '@/components/PixelButton';
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { t } from '@/i18n';
import { playSfx } from '@/lib/sfx';
import { sampleFace } from '@/lib/faceScan';
import { setAvatar } from '@/lib/avatar';

const C = colors.ink;
// 24px is plenty: the sampler wants region medians, not detail, and a small image keeps
// the JavaScript decode instant.
const SAMPLE_PX = 24;

/**
 * expo-camera and expo-image-manipulator, loaded defensively.
 *
 * These are NATIVE modules, so a binary built before they were installed throws
 * "Cannot find native module 'ExpoCamera'" the moment this file is imported — not when
 * the sheet opens. A static import therefore takes the whole app down on any older
 * build, which is exactly what an OTA update reaches: JS ships, the native side does
 * not, and every installed copy crashes on a screen that merely imports this one.
 *
 * So the requires are wrapped and their absence is a fact the UI reports. The manual
 * avatar builder never needed the camera, and it keeps working.
 */
type CameraModule = typeof import('expo-camera');
type ManipulatorModule = typeof import('expo-image-manipulator');

const native = (() => {
  try {
    return {
      camera: require('expo-camera') as CameraModule,
      manip: require('expo-image-manipulator') as ManipulatorModule,
    };
  } catch {
    return null;
  }
})();

/** Whether a face scan is possible on this binary. Read by AvatarSheet to decide
 *  whether to offer the shortcut at all — a button that cannot work is worse than an
 *  absent one. */
export const faceScanAvailable = native !== null;

export function FaceScanSheet({ visible, onClose }: { visible: boolean; onClose(): void }) {
  // Hooks must run unconditionally, so the module check gates the RENDER below rather
  // than an early return above the hooks.
  const [permission, requestPermission] = native
    ? native.camera.useCameraPermissions()
    : [null, async () => null as never];
  const cam = useRef<InstanceType<CameraModule['CameraView']> | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const scan = async () => {
    if (!native || !cam.current || busy) return;
    setBusy(true);
    setFailed(false);
    let shotUri: string | undefined;
    let smallUri: string | undefined;
    try {
      const shot = await cam.current.takePictureAsync({ quality: 0.5, skipProcessing: true });
      shotUri = shot?.uri;
      if (!shotUri) throw new Error('no picture');

      // Square-crop to the guide oval before resizing: the sampler's regions are
      // fractions of the image, so a 4:3 frame would put the cheeks off to the sides.
      const side = Math.min(shot!.width, shot!.height);
      const small = await native.manip.manipulateAsync(
        shotUri,
        [
          { crop: { originX: (shot!.width - side) / 2, originY: (shot!.height - side) / 2, width: side, height: side } },
          { resize: { width: SAMPLE_PX, height: SAMPLE_PX } },
        ],
        { base64: true, compress: 0.9, format: native.manip.SaveFormat.JPEG },
      );
      smallUri = small.uri;

      const got = small.base64 ? sampleFace(small.base64) : null;
      if (!got) {
        setFailed(true); // covered lens, no contrast, or an undecodable frame
        playSfx('wrong');
        return;
      }
      await setAvatar(got);
      playSfx('confirm');
      onClose();
    } catch {
      setFailed(true);
    } finally {
      // Delete both temp files whatever happened. The copy claims the photo is not
      // stored, so this must run on the failure paths too.
      for (const uri of [shotUri, smallUri]) {
        if (uri) await deleteAsync(uri, { idempotent: true }).catch(() => {});
      }
      setBusy(false);
    }
  };

  const granted = !!native && permission?.granted === true;
  const CameraView = native?.camera.CameraView;

  return (
    <BottomSheet visible={visible} onClose={onClose} expandable={false}>
      <View style={{ padding: 14, gap: 12 }}>
        <View>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>{t('avatar.scanTitle')}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 4, lineHeight: 15 }}>
            {t('avatar.scanBody')}
          </Text>
        </View>

        <View style={{ aspectRatio: 1, borderWidth: 3, borderColor: C, overflow: 'hidden', backgroundColor: colors.cream }}>
          {granted && CameraView ? (
            <>
              <CameraView ref={cam} style={{ flex: 1 }} facing="front" />
              {/* The guide is what makes fixed sampling geometry legitimate: line your
                  face up with it and the hair band and cheeks land where the sampler
                  looks. Without it the regions would be a guess. */}
              <View pointerEvents="none" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '62%', height: '78%', borderWidth: 3, borderColor: colors.yellow, borderRadius: 999, opacity: 0.9 }} />
              </View>
            </>
          ) : (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18 }}>
              <PixelIcon name="alert" color={colors.textSoft} size={26} sw={1.8} />
              <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, textAlign: 'center', lineHeight: 16 }}>
                {native ? t('avatar.scanNeedCamera') : t('avatar.scanNeedBuild')}
              </Text>
            </View>
          )}
        </View>

        {failed && (
          <View style={{ backgroundColor: '#FEE2E2', borderWidth: 2, borderColor: C, paddingVertical: 7, paddingHorizontal: 10 }}>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(10.5), color: C, lineHeight: 15 }}>{t('avatar.scanFailed')}</Text>
          </View>
        )}

        {!native ? null : granted ? (
          <PixelButton
            label={busy ? t('avatar.scanning') : t('avatar.scanShoot')}
            icon="target" bg={colors.mint} shadowColor={colors.mintShadow}
            fontSize={13} borderWidth={2.5} paddingV={10} disabled={busy} full
            onPress={() => void scan()}
          />
        ) : (
          <PixelButton
            label={t('avatar.scanAllow')} icon="target" bg={colors.yellow} shadowColor={colors.yellowShadow}
            fontSize={13} borderWidth={2.5} paddingV={10} full
            onPress={() => void requestPermission()}
          />
        )}

        <Pressable onPress={onClose} hitSlop={8} style={{ alignItems: 'center', paddingVertical: 4 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: colors.textSoft }}>{t('common.cancel')}</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
