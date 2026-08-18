// One curriculum's steps, opened from a floor row.
//
// This is the v19 "chapter timeline" moved into a sheet. It used to sit inline
// under a segmented tab, which meant the screen showed the current chapter's steps
// and a separate 25-row roadmap of the same chapters in a different vocabulary.
// Now the hierarchy is the roadmap and this is the leaf.
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { STEP_META, type StepKind } from '@/data/campus';
import type { Curriculum } from '@/api/client';
import { ProgressBar, Shadowed } from './parts';

const C = colors.ink;

export function StepSheet({ curriculum, onClose, onOpen }: {
  curriculum: Curriculum | null;
  onClose(): void;
  onOpen(scenarioID?: string): void;
}) {
  return (
    <BottomSheet visible={!!curriculum} onClose={onClose} expandable>
      {curriculum && (
        <View>
          <View style={{ backgroundColor: colors.cream, borderBottomWidth: 3, borderBottomColor: C, paddingTop: 4, paddingHorizontal: 14, paddingBottom: 11 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft }}>{curriculum.where}</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C, marginTop: 2 }}>{curriculum.name}</Text>
              </View>
              <Pressable onPress={onClose} hitSlop={8} style={{ width: 24, height: 24, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <PixelIcon name="x" color={C} size={12} sw={2} />
              </Pressable>
            </View>
            <View style={{ marginTop: 9 }}>
              <ProgressBar done={curriculum.done} total={curriculum.total} />
            </View>
          </View>

          <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 28 }}>
            <View style={{ paddingLeft: 16 }}>
              <View style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 3, backgroundColor: C + '22' }} />
              {(curriculum.steps ?? []).map((s, i) => {
                const meta = STEP_META[s.kind as StepKind] ?? STEP_META.dlg;
                const optional = s.state === 'optional'; // bonus quiz — playable, never gating
                const locked = s.state === 'lock';
                const bg = s.state === 'done' ? '#fff'
                  : s.state === 'now' ? meta.bg
                    : optional ? colors.lilac + '2A' : C + '11';
                const dot = s.state === 'done' ? colors.mintShadow
                  : s.state === 'now' ? colors.yellowDeep
                    : optional ? '#A78BFA' : C + '33';
                const row = (
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: bg, borderWidth: 2.5, borderColor: locked ? C + '55' : C, paddingVertical: 9, paddingHorizontal: 9, opacity: locked ? 0.55 : 1 }}>
                    <PixelIcon name={locked ? 'lock' : meta.icon} color={locked ? colors.textFaint : C} size={14} sw={1.8} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontFamily: fonts.body, fontSize: fs(11.5), color: C, lineHeight: 15 }}>{s.name}</Text>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: colors.textSoft, marginTop: 2 }}>{meta.label}{optional ? ' · 선택' : ''}</Text>
                    </View>
                    {s.state === 'done' && <PixelIcon name="check" color={colors.mintShadow} size={13} sw={2.2} />}
                    {s.state === 'now' && (
                      <View style={{ backgroundColor: C, paddingVertical: 2, paddingHorizontal: 6 }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.cream }}>NOW</Text>
                      </View>
                    )}
                  </View>
                );
                return (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                    <View style={{ position: 'absolute', left: -14, width: 11, height: 11, borderRadius: 6, backgroundColor: dot, borderWidth: 2, borderColor: C }} />
                    {locked
                      ? row
                      : <Pressable style={{ flex: 1, flexDirection: 'row' }} onPress={() => onOpen(s.scenarioId)}>{row}</Pressable>}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
    </BottomSheet>
  );
}
