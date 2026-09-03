// An in-place sort dropdown — the options open right under the trigger, not up from
// the bottom of the screen.
//
// The speak list's sort used to raise a BottomSheet: tapping "점수 낮은순 ∨" slid a
// panel up from the bottom edge, which for a three-item sort read as heavier than the
// choice. The learner asked for the options to drop down from the control itself. So
// this measures the trigger and floats the list at that spot inside
// a transparent Modal — the Modal is only there to layer the popover above the list and
// to catch the outside tap that closes it; nothing about it slides or dims the screen.
import { useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbCheck, NbPaper, nbText } from '@/components/nb/NbUI';
import { nb } from '@/theme/nb';

export type InlineOption<T extends string> = { value: T; label: string };

// Where the popover sits before the trigger has been measured — top-right, under the
// status bar, which is where this control lives in every screen that uses it. The
// measure that follows the tap almost always lands first, so this is the fallback for
// the one frame (or the test) where it has not.
const DEFAULT_ANCHOR = { top: 96, right: 20 };

export function NbInlineSelect<T extends string>({ value, options, onSelect, title }: {
  value: T;
  options: InlineOption<T>[];
  onSelect: (v: T) => void;
  /** Accessibility label for the trigger — the control has no visible heading. */
  title: string;
}) {
  const [open, setOpen] = useState(false);
  // Where to float the popover: measured from the trigger in window coordinates so the
  // list lands under it wherever the header has scrolled to. Right edge is anchored to
  // the trigger's right edge (the trigger sits at the row's right end), so the card
  // grows leftward and never runs off the screen. Opening does NOT wait on the measure:
  // the menu shows on tap and the measure only refines its position, so a device that
  // is slow to report layout still opens the menu rather than swallowing the tap.
  const [anchor, setAnchor] = useState<{ top: number; right: number }>(DEFAULT_ANCHOR);
  const trigger = useRef<View>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  const openMenu = () => {
    setOpen(true);
    trigger.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ top: y + h + 4, right: Dimensions.get('window').width - (x + w) });
    });
  };

  return (
    <>
      {/* The trigger: current ordering + the chevron the handoff draws as ∨ (an NbIcon,
          not the character — the app's glyph ratchet bans a bare ∨). */}
      <Pressable
        ref={trigger}
        onPress={openMenu}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={styles.trigger}
      >
        <Text numberOfLines={1} style={nbText.hand(13.5, nb.ink)}>{current?.label}</Text>
        <NbIcon name="chevronDown" size={13} color={nb.soft} />
      </Pressable>

      {open && (
        <Modal visible transparent animationType="none" statusBarTranslucent onRequestClose={() => setOpen(false)}>
          {/* Full-screen catcher: a tap anywhere but the card dismisses. No scrim colour —
              the screen underneath stays lit, which is what "drops down in place" means. */}
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} accessibilityLabel="close">
            <View style={[styles.popover, { top: anchor.top, right: anchor.right }]}>
              <NbPaper rot={-0.4} style={styles.card}>
                {options.map((o, i) => {
                  const on = o.value === value;
                  return (
                    <Pressable
                      key={o.value}
                      onPress={() => { setOpen(false); if (o.value !== value) onSelect(o.value); }}
                      style={[styles.option, i > 0 && styles.optionDivider]}
                    >
                      <Text style={[nbText.hand(15, on ? nb.ink : nb.soft), { flex: 1, minWidth: 0 }]}>{o.label}</Text>
                      {on && <NbCheck done />}
                    </Pressable>
                  );
                })}
              </NbPaper>
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
  popover: { position: 'absolute', minWidth: 132 },
  card: { paddingVertical: 4, paddingHorizontal: 4 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 11 },
  // A 1pt rule between rows — the notebook's own divider, not a heavy separator.
  optionDivider: { borderTopWidth: 1, borderTopColor: nb.paperEdge },
});
