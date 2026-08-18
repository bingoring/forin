// Fast-travel: pick a room to warp the player to its anchor tile.
import { Modal, Pressable, Text, View } from 'react-native';
import { border, colors, fonts, type as typeScale } from '@/theme/tokens';
import type { Room } from '@engine';
import { PixelIcon, iconFor } from '@/components/PixelIcon';

export function FastTravelModal({
  visible,
  rooms,
  onSelect,
  onClose,
}: {
  visible: boolean;
  rooms: Room[];
  onSelect: (room: Room) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(22,17,14,0.55)', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      >
        <Pressable
          onPress={() => {}}
          style={{ width: '100%', maxWidth: 360, backgroundColor: colors.paper, borderColor: colors.ink, borderWidth: border.modal, padding: 18, gap: 14 }}
        >
          <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.screenHeading, color: colors.ink }}>빠른 이동</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {rooms.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => onSelect(r)}
                style={{
                  flexBasis: '47%',
                  flexGrow: 1,
                  backgroundColor: r.color ?? colors.cream,
                  borderColor: colors.ink,
                  borderWidth: border.card,
                  padding: 12,
                  gap: 2,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  {rowIcon(r.icon)}
                  <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.body, color: colors.ink }}>{r.name}</Text>
                </View>
                {!!r.sub && (
                  <Text style={{ fontFamily: fonts.body, fontSize: typeScale.caption, color: colors.text }}>{r.sub}</Text>
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Same bridge as the elevator's floor list: fixture emoji -> line icon, with a
// visible fallback rather than a blank when a mapping is missing.
function rowIcon(emoji?: string) {
  if (!emoji) return null;
  const name = iconFor(emoji);
  if (!name) {
    if (__DEV__) console.warn(`[map] no PixelIcon mapping for row emoji ${emoji} — add it to EMOJI_ICON`);
    return <Text style={{ fontSize: typeScale.body }}>{emoji}</Text>;
  }
  return <PixelIcon name={name} color={colors.ink} size={16} sw={1.8} />;
}
