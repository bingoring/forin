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
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';
import { useT } from '@/i18n';
import { playSfx } from '@/lib/sfx';
import { useAvatar } from '@/hooks/useAvatar';
import { HAIR_COLORS, HAIR_STYLES, SCRUB_COLORS, SKIN_TONES, setAvatar } from '@/lib/avatar';
import { faceScanAvailable } from '@/components/FaceScanSheet';


export function AvatarSheet({ visible, onClose, onScan }: { visible: boolean; onClose(): void; onScan(): void }) {
  const t = useT();
  const avatar = useAvatar();

  return (
    <BottomSheet visible={visible} onClose={onClose} size="tall">
      <View>
        {/* Live preview pinned above the controls: every tap changes this face, and a
            preview you have to scroll to is a preview nobody uses. */}
        {/* The live preview, pinned above the controls: every tap changes this face, and
            a preview you have to scroll to is a preview nobody uses. It is a POLAROID
            here — a sprite cannot sit directly on paper, and the print's white margin is
            what lets it. */}
        <View style={{ borderBottomWidth: 1.5, borderBottomColor: nb.paperEdge, paddingTop: 4, paddingBottom: 13, alignItems: 'center' }}>
          <NbPaper rot={-1.5} style={{ paddingTop: 5, paddingHorizontal: 5, paddingBottom: 5 }}>
            <View style={{ width: 96, height: 112, backgroundColor: avatar.scrub, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
              <View style={{ position: 'absolute', left: 5, top: 5, right: 5, bottom: 5, backgroundColor: 'rgba(255,255,255,0.4)' }} />
              <AnimatedFace size={102} avatar={avatar} expression="happy" />
            </View>
          </NbPaper>
          <Text style={[nbText.hand(19), { marginTop: 9 }]}>{t('avatar.title')}</Text>
        </View>

        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 28, gap: 16 }}>
          {/* Hidden entirely on a binary without the camera module. A shortcut that
              cannot work is worse than an absent one — it reads as a broken feature. */}
          {faceScanAvailable && (
            <NbButton variant="paper" full icon="magnify" onPress={() => { playSfx('tap'); onScan(); }}>
              {t('avatar.scanCta')}
            </NbButton>
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

          <NbButton variant="ink" size="lg" full icon="check" iconColor={nb.paper} onPress={() => { playSfx('confirm'); onClose(); }}>
            {t('common.done')}
          </NbButton>
        </ScrollView>
      </View>
    </BottomSheet>
  );
}

function Axis({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text numberOfLines={1} style={[nbText.hand(16), { marginBottom: 7 }]}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>{children}</View>
    </View>
  );
}

function Swatch({ selected, onPress, children }: { selected: boolean; onPress(): void; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={() => { playSfx('tap'); onPress(); }}
      style={{
        // The chosen swatch takes the gold ring the app uses everywhere for "this is the
        // one you chose", and a ticked corner as a second, redundant cue.
        borderWidth: selected ? 2 : 1.3,
        borderColor: selected ? '#C99A1E' : nb.paperEdge,
        backgroundColor: selected ? 'rgba(249,227,123,.45)' : nb.paper,
        padding: 3, alignItems: 'center', justifyContent: 'center',
      }}
    >
      {children}
      {selected && (
        <View style={{ position: 'absolute', top: -6, right: -6, backgroundColor: nb.paper, borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
          <NbIcon name="check" size={13} color={nb.green} />
        </View>
      )}
    </Pressable>
  );
}
