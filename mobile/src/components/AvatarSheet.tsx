// Build your portrait: hair, hair colour, skin tone, scrub colour.
//
// Four short axes rather than colour wheels. The Face renderer draws pixel plates for
// a limited palette, so an arbitrary hex reads as a mistake rather than as expression
// — and six skin tones someone can see themselves in beat a million they cannot.
//
// The face scan sits at the top rather than the bottom: it sets two of the four axes
// in one tap, so it is the shortcut, and burying a shortcut under the long way round
// is how nobody finds it. It is NOT a likeness — see lib/faceScan.ts.
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AnimatedFace, FacePlayer } from '@engine';
import { BottomSheet } from '@/components/BottomSheet';

import { FIcon } from '@/components/FIcon';
import { PixelButton } from '@/components/PixelButton';
import { colors, fonts, fs } from '@/theme/tokens';
import { t, useT } from '@/i18n';
import { playSfx } from '@/lib/sfx';
import { useAvatar } from '@/hooks/useAvatar';
import { HAIR_COLORS, HAIR_STYLES, SCRUB_COLORS, SKIN_TONES, setAvatar } from '@/lib/avatar';
import { faceScanAvailable } from '@/components/FaceScanSheet';

const C = colors.ink;

export function AvatarSheet({ visible, onClose, onScan }: { visible: boolean; onClose(): void; onScan(): void }) {
  const t = useT();
  const avatar = useAvatar();

  return (
    <BottomSheet visible={visible} onClose={onClose} size="tall">
      <View>
        {/* Live preview pinned above the controls: every tap changes this face, and a
            preview you have to scroll to is a preview nobody uses. */}
        <View style={{ backgroundColor: colors.cream, borderBottomWidth: 3, borderBottomColor: C, paddingTop: 6, paddingBottom: 12, alignItems: 'center' }}>
          <View style={{ width: 96, height: 112, backgroundColor: avatar.scrub, borderWidth: 3, borderColor: C, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
            <View style={{ position: 'absolute', left: 5, top: 5, right: 5, bottom: 5, backgroundColor: 'rgba(255,255,255,0.4)' }} />
            <AnimatedFace size={102} avatar={avatar} expression="happy" />
          </View>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C, marginTop: 9 }}>{t('avatar.title')}</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 28, gap: 16 }}>
          {/* Hidden entirely on a binary without the camera module. A shortcut that
              cannot work is worse than an absent one — it reads as a broken feature. */}
          {faceScanAvailable && (
            <PixelButton
              label={t('avatar.scanCta')} icon="target" bg={colors.blue} shadowColor={C}
              fontSize={12.5} borderWidth={2.5} paddingV={9} full
              onPress={() => { playSfx('tap'); onScan(); }}
            />
          )}

          <Axis label={t('avatar.hairStyle')}>
            {HAIR_STYLES.map((style) => (
              <Swatch
                key={style}
                selected={avatar.hairStyle === style}
                onPress={() => void setAvatar({ hairStyle: style })}
              >
                {/* Each option previews itself, drawn small with the current colours —
                    a text label like "pigtails" makes you tap to find out. */}
                <View style={{ width: 34, height: 34, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <FacePlayer size={36} avatar={{ ...avatar, hairStyle: style }} />
                </View>
              </Swatch>
            ))}
          </Axis>

          <Axis label={t('avatar.hairColor')}>
            {HAIR_COLORS.map((hair) => (
              <Swatch key={hair} selected={avatar.hair === hair} onPress={() => void setAvatar({ hair })}>
                <View style={{ width: 30, height: 30, backgroundColor: hair }} />
              </Swatch>
            ))}
          </Axis>

          <Axis label={t('avatar.skin')}>
            {SKIN_TONES.map((skin) => (
              <Swatch key={skin} selected={avatar.skin === skin} onPress={() => void setAvatar({ skin })}>
                <View style={{ width: 30, height: 30, backgroundColor: skin }} />
              </Swatch>
            ))}
          </Axis>

          <Axis label={t('avatar.scrub')}>
            {SCRUB_COLORS.map((scrub) => (
              <Swatch key={scrub} selected={avatar.scrub === scrub} onPress={() => void setAvatar({ scrub })}>
                <View style={{ width: 30, height: 30, backgroundColor: scrub }} />
              </Swatch>
            ))}
          </Axis>

          <PixelButton
            label={t('common.done')} icon="check" bg={colors.mint} shadowColor={colors.mintShadow}
            fontSize={13} borderWidth={2.5} paddingV={10} full
            onPress={() => { playSfx('confirm'); onClose(); }}
          />
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

function Axis({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C, marginBottom: 7 }}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>{children}</View>
    </View>
  );
}

function Swatch({ selected, onPress, children }: { selected: boolean; onPress(): void; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={() => { playSfx('tap'); onPress(); }}
      style={{
        borderWidth: selected ? 3 : 2, borderColor: C,
        backgroundColor: selected ? colors.yellow : '#fff',
        padding: 3, alignItems: 'center', justifyContent: 'center',
      }}
    >
      {children}
      {selected && (
        <View style={{ position: 'absolute', top: -5, right: -5, backgroundColor: colors.yellow, borderWidth: 1.5, borderColor: C, width: 14, height: 14, alignItems: 'center', justifyContent: 'center' }}>
          <FIcon name="check" size={9} />
        </View>
      )}
    </Pressable>
  );
}
