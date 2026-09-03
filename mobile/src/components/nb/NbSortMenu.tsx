// A sort control that is NOT a tab row.
//
// The review lab has ONE tab row — 교정 노트 / 말하기 / 모범답안 — and the speak and
// model-answer sections each carried a SECOND NbIndexTabs for their sort order. Two tab
// rows stacked read as one nested tab bar: the learner could not tell "which section am
// I in" from "how is this list ordered". The handoff draws the sort as an inline
// dropdown at the end of the search line (말하기: "점수 낮은순 ∨"), which is what this is.
//
// The list of orderings lives in a sheet rather than cycling on tap: a two-way toggle
// hides the option you are not on, so a learner who has never seen "개선 필요" cannot
// discover it. The sheet shows every ordering with the current one marked.
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomSheet } from '@/components/BottomSheet';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbCheck, NbPaper, nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';

export type SortOption<T extends string> = { value: T; label: string };

export function NbSortMenu<T extends string>({ value, options, onSelect, title }: {
  value: T;
  options: SortOption<T>[];
  onSelect: (v: T) => void;
  /** The sheet's heading — "정렬" by default is set by the caller's catalog. */
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <>
      {/* The trigger: the current ordering, with the chevron the handoff draws as ∨.
          An NbIcon, not the character, because the app's glyph ratchet bans a bare ∨. */}
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={styles.trigger}
      >
        <Text numberOfLines={1} style={nbText.hand(13.5, nb.ink)}>{current?.label}</Text>
        <NbIcon name="chevronDown" size={13} color={nb.soft} />
      </Pressable>

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={[nbText.hand(20), { marginBottom: 10 }]}>{title}</Text>
          {options.map((o) => {
            const on = o.value === value;
            return (
              <Pressable
                key={o.value}
                onPress={() => { onSelect(o.value); setOpen(false); }}
                style={{ marginBottom: 8 }}
              >
                <NbPaper
                  rot={on ? -0.5 : 0.4}
                  bg={on ? 'rgba(168,217,151,.35)' : undefined}
                  style={[styles.option, on ? { borderColor: nb.green, borderWidth: 1.8 } : null]}
                >
                  <Text style={[nbText.hand(16), { flex: 1, minWidth: 0 }]}>{o.label}</Text>
                  <NbCheck done={on} />
                </NbPaper>
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 13 },
});
