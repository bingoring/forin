// On-screen controls: ZONE badge + fast-travel, a D-pad, and the A (action)
// button. A is enabled only when the player is on/next to an interactable; its
// label shows what A will do.
import { Pressable, Text, View } from 'react-native';
import { border, colors, fonts, type as typeScale } from '@/theme/tokens';
import type { Dir } from '@engine';
import { PixelIcon } from '@/components/PixelIcon';

const PAD = 52; // D-pad button size

// The D-pad wants filled triangles, not chevrons — `play` is the only solid
// wedge in the icon set, so rotate it for the other three directions rather
// than authoring three near-duplicates.
const ROT: Record<'up' | 'down' | 'left' | 'right', string> = {
  right: '0deg', down: '90deg', left: '180deg', up: '270deg',
};

function PadBtn({ dir, onPress, col, row }: { dir: 'up' | 'down' | 'left' | 'right'; onPress: () => void; col: number; row: number }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: 'absolute',
        left: col * PAD,
        top: row * PAD,
        width: PAD,
        height: PAD,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.cream,
        borderColor: colors.ink,
        borderWidth: border.card,
      }}
    >
      <View style={{ transform: [{ rotate: ROT[dir] }] }}>
        <PixelIcon name="play" color={colors.ink} size={18} sw={1.8} />
      </View>
    </Pressable>
  );
}

function Badge({ label, bg, onPress }: { label: string; bg: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: bg, borderColor: colors.ink, borderWidth: border.thin, paddingVertical: 4, paddingHorizontal: 10 }}
    >
      <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.caption, color: colors.ink, letterSpacing: 0.4 }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function HUD({
  zoneName,
  actionLabel,
  onMove,
  onAction,
  onFastTravel,
  showZone = true,
  showFastTravel = true,
}: {
  zoneName: string | null;
  actionLabel: string | null;
  onMove: (dir: Dir) => void;
  onAction: () => void;
  onFastTravel: () => void;
  showZone?: boolean; // hide on outdoor maps with no regions (e.g. campus)
  showFastTravel?: boolean; // hide on maps with no rooms (e.g. campus)
}) {
  const canAct = !!actionLabel;
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 10, gap: 12 }}>
      {(showZone || showFastTravel) && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {showZone ? <Badge label={`ZONE · ${zoneName ?? '복도'}`} bg={colors.mint} /> : <View />}
          {showFastTravel ? <Badge label="↟ 빠른이동" bg={colors.yellow} onPress={onFastTravel} /> : <View />}
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* D-pad cross */}
        <View style={{ width: PAD * 3, height: PAD * 3 }}>
          <PadBtn dir="up" col={1} row={0} onPress={() => onMove('up')} />
          <PadBtn dir="left" col={0} row={1} onPress={() => onMove('left')} />
          <PadBtn dir="right" col={2} row={1} onPress={() => onMove('right')} />
          <PadBtn dir="down" col={1} row={2} onPress={() => onMove('down')} />
        </View>

        {/* A button */}
        <View style={{ alignItems: 'center', gap: 4 }}>
          {canAct && (
            <Text style={{ fontFamily: fonts.body, fontSize: typeScale.caption, color: colors.text }} numberOfLines={1}>
              {actionLabel}
            </Text>
          )}
          <Pressable
            onPress={canAct ? onAction : undefined}
            disabled={!canAct}
            style={{
              width: 66,
              height: 66,
              borderRadius: 33,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: canAct ? colors.peachDeep : colors.cream,
              borderColor: canAct ? colors.ink : colors.textFaint,
              borderWidth: border.card,
            }}
          >
            <Text style={{ fontFamily: fonts.heading, fontSize: 24, color: canAct ? colors.ink : colors.textFaint }}>A</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
