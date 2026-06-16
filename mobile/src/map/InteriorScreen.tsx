// Interior exploration shell: top bar, camera-followed tile world (floor +
// objects + hotspots + player + room mask), region-transition banner, and the
// HUD. Movement/walkability come from useMovement + the pure collision module.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent, type GestureResponderEvent } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { border, colors, fonts, type as typeScale } from '@/theme/tokens';
import { TILE, coordToPx, type Coord } from './coords';
import { regionAt } from './regions';
import { useMovement } from './useMovement';
import { TileFloor } from './TileFloor';
import { Walls } from './Walls';
import { RoomMask } from './RoomMask';
import { HUD } from './HUD';
import { FastTravelModal } from './FastTravelModal';
import { PlayerSprite, RoleSprite, type RoleKind } from '@/characters/Sprite';
import { InteriorObjectView } from './objects';
import type { Interior, MapObject, Hotspot } from './types';

// Chibi sprites are taller than a tile (head sits above it). Width ≈ 2.2 tiles;
// height = width*80/64. Feet are centered on the tile, head overhangs upward.
const SPRITE_W = Math.round(TILE * 2.2);
const SPRITE_H = (SPRITE_W * 80) / 64;

/** Top-left px to seat a sprite's feet on the center-bottom of tile (x,y). */
function seatSprite(x: number, y: number) {
  return { left: (x + 0.5) * TILE - SPRITE_W / 2, top: (y + 1) * TILE - SPRITE_H };
}

// Player glides between tiles (06_CHARACTER_MOTION §2: ~0.3-0.55s tween) rather
// than jumping; the camera follows the gliding position. Sub-tile offsets to
// seat the sprite's feet on a tile whose top-left pixel is (px, py).
const PLAYER_DX = TILE / 2 - SPRITE_W / 2;
const PLAYER_DY = TILE - SPRITE_H;
const GLIDE_MS = 300; // tile-to-tile glide (≈ the walk-cadence / stride)

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Derive ambient NPCs from authored objects so the room feels alive without a
// separate content type yet: a nurse standing behind the reception desk. (Beds
// draw their own sleeping occupant, so no patient NPC is added there.)
function npcsFromObjects(objects: MapObject[]): { id: string; x: number; y: number; kind: RoleKind }[] {
  const out: { id: string; x: number; y: number; kind: RoleKind }[] = [];
  for (const o of objects) {
    if (o.type === 'reception') out.push({ id: `npc-${o.id}`, x: o.x, y: o.y - 1, kind: 'nurse' });
  }
  return out;
}

function manhattan(a: Coord, b: Coord) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function InteriorScreen({
  interior,
  deptName,
  onExit,
  onEnterScenario,
}: {
  interior: Interior;
  deptName?: string;
  onExit?: () => void;
  onEnterScenario?: (hotspot: Hotspot) => void;
}) {
  const { pos, facing, walking, moveDir, moveTo, warpTo } = useMovement(interior);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [ftOpen, setFtOpen] = useState(false);

  const worldW = interior.cols * TILE;
  const worldH = interior.rows * TILE;

  const region = useMemo(() => regionAt(pos, interior.regions), [pos, interior.regions]);
  const npcs = useMemo(() => npcsFromObjects(interior.objects), [interior.objects]);

  // Transient "➜ region" banner on region change.
  const [banner, setBanner] = useState<string | null>(null);
  const prevRegion = useRef<string | null>(null);
  useEffect(() => {
    const id = region?.id ?? null;
    if (id && id !== prevRegion.current) {
      setBanner(`➜ ${region!.name}`);
      const t = setTimeout(() => setBanner(null), 1100);
      prevRegion.current = id;
      return () => clearTimeout(t);
    }
    prevRegion.current = id;
  }, [region]);

  // Action target: a hotspot the player stands on or is adjacent to.
  const actionable = useMemo(
    () => interior.hotspots.find((h) => manhattan(pos, { x: h.x, y: h.y }) <= 1) ?? null,
    [pos, interior.hotspots],
  );

  // Glide the player pixel position toward the current tile; the camera derives
  // from it so both ease together (no instant tile jumps).
  const pxX = useSharedValue(pos.x * TILE);
  const pyY = useSharedValue(pos.y * TILE);
  useEffect(() => {
    pxX.value = withTiming(pos.x * TILE, { duration: GLIDE_MS, easing: Easing.linear });
    pyY.value = withTiming(pos.y * TILE, { duration: GLIDE_MS, easing: Easing.linear });
  }, [pos.x, pos.y, pxX, pyY]);

  const worldStyle = useAnimatedStyle(() => {
    'worklet';
    const cx = pxX.value + TILE / 2;
    const cy = pyY.value + TILE / 2;
    const tx = worldW <= vp.w ? (vp.w - worldW) / 2 : Math.max(vp.w - worldW, Math.min(0, vp.w / 2 - cx));
    const ty = worldH <= vp.h ? (vp.h - worldH) / 2 : Math.max(vp.h - worldH, Math.min(0, vp.h / 2 - cy));
    return { transform: [{ translateX: tx }, { translateY: ty }] };
  });
  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pxX.value + PLAYER_DX }, { translateY: pyY.value + PLAYER_DY }],
  }));

  const onWorldPress = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    moveTo({ x: Math.floor(locationX / TILE), y: Math.floor(locationY / TILE) });
  };

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setVp({ w: width, h: height });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}
      >
        <Pressable onPress={onExit} hitSlop={10}>
          <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.topBar, color: colors.ink }}>‹ 캠퍼스</Text>
        </Pressable>
        <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.topBar, color: colors.ink }}>
          {deptName ?? interior.deptId}
        </Text>
        <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.topBar, color: colors.red }}>♥♥♥</Text>
      </View>

      {/* Camera viewport */}
      <View onLayout={onLayout} style={{ flex: 1, overflow: 'hidden', backgroundColor: colors.ink }}>
        {vp.w > 0 && (
          <AnimatedPressable
            onPress={onWorldPress}
            style={[{ position: 'absolute', width: worldW, height: worldH }, worldStyle]}
          >
            <TileFloor cols={interior.cols} rows={interior.rows} theme={interior.floorTheme} />
            <Walls collision={interior.collision} />

            {interior.objects.map((o: MapObject) => (
              <InteriorObjectView key={o.id} object={o} />
            ))}

            {interior.hotspots.map((h) => {
              const { left, top } = coordToPx(h);
              return (
                <View
                  key={h.id}
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left: left + TILE / 2 - 9,
                    top: top - 6,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    backgroundColor: colors.yellowDeep,
                    borderColor: colors.ink,
                    borderWidth: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.ink }}>!</Text>
                </View>
              );
            })}

            {/* Ambient NPCs (derived from authored objects) */}
            {npcs.map((n) => {
              const { left, top } = seatSprite(n.x, n.y);
              return (
                <View key={n.id} pointerEvents="none" style={{ position: 'absolute', left, top, width: SPRITE_W, height: SPRITE_H }}>
                  <RoleSprite kind={n.kind} x={n.x} y={n.y} size={SPRITE_W} />
                </View>
              );
            })}

            {/* Player. Glides between tiles (camera follows); faces movement
                direction (dir); left mirrors inside the SVG group (not a
                negatively-scaled parent — that crashed in 5a). */}
            <Animated.View
              pointerEvents="none"
              style={[{ position: 'absolute', left: 0, top: 0, width: SPRITE_W, height: SPRITE_H }, playerStyle]}
            >
              <PlayerSprite size={SPRITE_W} expression="neutral" dir={facing} walking={walking} />
            </Animated.View>

            <RoomMask bounds={region?.bounds ?? null} cols={interior.cols} rows={interior.rows} />
          </AnimatedPressable>
        )}

        {/* Region transition banner */}
        {banner && (
          <View style={{ position: 'absolute', top: 16, alignSelf: 'center', backgroundColor: colors.paper, borderColor: colors.ink, borderWidth: border.card, paddingVertical: 6, paddingHorizontal: 14 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.body, color: colors.ink }}>{banner}</Text>
          </View>
        )}
      </View>

      <HUD
        zoneName={region?.name ?? null}
        actionLabel={actionable?.label ?? null}
        onMove={moveDir}
        onAction={() => actionable && onEnterScenario?.(actionable)}
        onFastTravel={() => setFtOpen(true)}
      />

      <FastTravelModal
        visible={ftOpen}
        rooms={interior.rooms}
        onSelect={(room) => {
          setFtOpen(false);
          warpTo({ x: room.x, y: room.y });
        }}
        onClose={() => setFtOpen(false)}
      />
    </SafeAreaView>
  );
}
