// Interior exploration shell: top bar, camera-followed tile world (floor +
// objects + hotspots + player + room mask), region-transition banner, and the
// HUD. Movement/walkability come from useMovement + the pure collision module.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent, type GestureResponderEvent } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { border, colors, fonts, type as typeScale } from '@/theme/tokens';
import { TILE, coordToPx, type Coord } from '@engine';
import { regionAt } from '@engine';
import { boxInView, OBJECT_FOOTPRINT } from '@engine';
import { useMovement } from '@engine';
import { TileFloor } from '@engine';
import { Walls } from '@engine';
import { RoomMask } from '@engine';
import { HUD } from './HUD';
import { FastTravelModal } from './FastTravelModal';
import { PlayerSprite, RoleSprite, type RoleKind } from '@engine';
import { AmbientNpc } from '@engine';
import { InteriorObjectView } from './objects';
import { Tint } from './objects/structures';
import type { Interior, MapObject, Hotspot } from '@engine';

// Chibi sprites are taller than a tile (head sits above it). Width ≈ 2.2 tiles;
// height = width*80/64. Feet are centered on the tile, head overhangs upward.
const SPRITE_W = Math.round(TILE * 2.2);
const SPRITE_H = (SPRITE_W * 80) / 64;

/** Top-left px to seat a sprite's feet on the center-bottom of tile (x,y). */
function seatSprite(x: number, y: number) {
  return { left: (x + 0.5) * TILE - SPRITE_W / 2, top: (y + 1) * TILE - SPRITE_H };
}

// 2.5D depth: everything composites by its base (feet / footprint-bottom) tile y
// via zIndex, so a sprite north of (behind) a building is occluded by it and one
// to the south is drawn in front. Larger base-y = nearer the camera = higher z.
const zFor = (baseY: number) => Math.round(baseY * 10) + 10;
const objBaseY = (o: MapObject) => o.y + (typeof o.props?.h === 'number' ? (o.props.h as number) : OBJECT_FOOTPRINT[o.type]?.h ?? 1);

// Player glides between tiles (06_CHARACTER_MOTION §2: ~0.3-0.55s tween) rather
// than jumping; the camera follows the gliding position. Sub-tile offsets to
// seat the sprite's feet on a tile whose top-left pixel is (px, py).
const PLAYER_DX = TILE / 2 - SPRITE_W / 2;
const PLAYER_DY = TILE - SPRITE_H;
const GLIDE_MS = 240; // tile-to-tile glide; the walk hop/steps sync to this window

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
  // Camera zoom (5d-iv). transformOrigin is top-left so the world→screen map is
  // linear: screen = translate + scale*world. The clamp below works in scaled px;
  // tap locationX/Y stay in the world's untransformed local space (÷TILE unchanged).
  const scale = interior.scale ?? 1;

  const region = useMemo(() => regionAt(pos, interior.regions), [pos, interior.regions]);
  const npcs = useMemo(() => npcsFromObjects(interior.objects), [interior.objects]);

  // Viewport culling (5f-iii): on large maps render only what's near the camera.
  // The window is derived from the *clamped camera* (mirroring the worldStyle
  // transform), not just the player tile — otherwise near a map edge, where the
  // camera stops following, visible objects toward the edge get wrongly culled
  // (the "disappears when I get close" bug). Boxes get a "rise" allowance so tall
  // art (sprites/equipment/landmarks overhanging upward) isn't culled early.
  const view = useMemo(() => {
    if (vp.w === 0) return null;
    const sw = worldW * scale;
    const sh = worldH * scale;
    const cx = (pos.x + 0.5) * TILE * scale;
    const cy = (pos.y + 0.5) * TILE * scale;
    const tx = sw <= vp.w ? (vp.w - sw) / 2 : Math.max(vp.w - sw, Math.min(0, vp.w / 2 - cx));
    const ty = sh <= vp.h ? (vp.h - sh) / 2 : Math.max(vp.h - sh, Math.min(0, vp.h / 2 - cy));
    const m = 5; // tile margin
    return {
      x0: -tx / (TILE * scale) - m,
      x1: (-tx + vp.w) / (TILE * scale) + m,
      y0: -ty / (TILE * scale) - m,
      y1: (-ty + vp.h) / (TILE * scale) + m,
    };
  }, [pos.x, pos.y, vp.w, vp.h, scale, worldW, worldH]);
  const visObjects = useMemo(() => {
    if (!view) return interior.objects;
    return interior.objects.filter((o) => {
      const w = typeof o.props?.w === 'number' ? o.props.w : 2;
      const h = typeof o.props?.h === 'number' ? o.props.h : 2;
      const rise = o.type === 'landmark' ? 16 : 5;
      return boxInView(o.x, o.y - rise, w, h + rise, view);
    });
  }, [view, interior.objects]);
  const visHotspots = useMemo(() => (view ? interior.hotspots.filter((h) => boxInView(h.x, h.y, 1, 1, view)) : interior.hotspots), [view, interior.hotspots]);
  const visNpcs = useMemo(() => (view ? npcs.filter((n) => boxInView(n.x, n.y - 2, 2, 4, view)) : npcs), [view, npcs]);
  const visAmbient = useMemo(() => {
    const list = interior.npcs ?? [];
    if (!view) return list;
    return list.filter((s) => {
      let r = s.bound ?? (s.start ? { x: s.start.x, y: s.start.y, w: 1, h: 1 } : { x: 0, y: 0, w: 1, h: 1 });
      if (s.path && s.path.length) {
        const xs = s.path.map((p) => p.x);
        const ys = s.path.map((p) => p.y);
        r = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs) + 1, h: Math.max(...ys) - Math.min(...ys) + 1 };
      }
      return boxInView(r.x, r.y - 4, r.w, r.h + 4, view);
    });
  }, [view, interior.npcs]);

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
  const walkClock = useSharedValue(0); // re-fired 0→1 each step → 2 hops + 2 leg steps/tile
  useEffect(() => {
    pxX.value = withTiming(pos.x * TILE, { duration: GLIDE_MS, easing: Easing.linear });
    pyY.value = withTiming(pos.y * TILE, { duration: GLIDE_MS, easing: Easing.linear });
    walkClock.value = 0;
    walkClock.value = withTiming(1, { duration: GLIDE_MS, easing: Easing.linear });
  }, [pos.x, pos.y, pxX, pyY, walkClock]);

  // Camera: one transform on the world Pressable — translate (follow) then scale
  // (zoom), with transformOrigin top-left so world→screen is linear and the
  // Pressable's hit box == its content box (no oversized child to swallow taps,
  // which broke campus tap-to-walk at scale<1). RN reports locationX/Y in the
  // view's untransformed local space (0..worldW), so the tap math is ÷TILE.
  const worldStyle = useAnimatedStyle(() => {
    'worklet';
    const sw = worldW * scale;
    const sh = worldH * scale;
    const cx = (pxX.value + TILE / 2) * scale; // player center in scaled px
    const cy = (pyY.value + TILE / 2) * scale;
    const tx = sw <= vp.w ? (vp.w - sw) / 2 : Math.max(vp.w - sw, Math.min(0, vp.w / 2 - cx));
    const ty = sh <= vp.h ? (vp.h - sh) / 2 : Math.max(vp.h - sh, Math.min(0, vp.h / 2 - cy));
    return { transform: [{ translateX: tx }, { translateY: ty }, { scale }] };
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
            style={[{ position: 'absolute', width: worldW, height: worldH, transformOrigin: 'top left' }, worldStyle]}
          >
            <TileFloor cols={interior.cols} rows={interior.rows} theme={interior.floorTheme} />

            {/* room tints sit above the floor, below walls/objects */}
            {visObjects.filter((o) => o.type === 'tint').map((o) => (
              <Tint key={o.id} x={o.x} y={o.y} w={(o.props?.w as number) ?? 1} h={(o.props?.h as number) ?? 1} color={o.props?.color as string | undefined} op={o.props?.op as number | undefined} />
            ))}

            <Walls collision={interior.collision} />

            {visObjects.filter((o) => o.type !== 'tint').map((o: MapObject) => (
              <View key={o.id} pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, zIndex: zFor(objBaseY(o)) }}>
                <InteriorObjectView object={o} />
              </View>
            ))}

            {visHotspots.map((h) => {
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
                    zIndex: 9000, // markers float above the world (below the room mask)
                  }}
                >
                  <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: colors.ink }}>!</Text>
                </View>
              );
            })}

            {/* Ambient NPCs (derived from authored objects) */}
            {visNpcs.map((n) => {
              const { left, top } = seatSprite(n.x, n.y);
              return (
                <View key={n.id} pointerEvents="none" style={{ position: 'absolute', left, top, width: SPRITE_W, height: SPRITE_H, zIndex: zFor(n.y + 1) }}>
                  <RoleSprite kind={n.kind} x={n.x} y={n.y} size={SPRITE_W} />
                </View>
              );
            })}

            {/* Ambient roaming NPCs (useGridMover: patrol/wander + emotes) */}
            {visAmbient.map((spec) => (
              <AmbientNpc key={spec.id} spec={spec} size={SPRITE_W} />
            ))}

            {/* Player. Glides between tiles (camera follows); faces movement
                direction (dir); left mirrors inside the SVG group (not a
                negatively-scaled parent — that crashed in 5a). */}
            <Animated.View
              pointerEvents="none"
              style={[{ position: 'absolute', left: 0, top: 0, width: SPRITE_W, height: SPRITE_H, zIndex: zFor(pos.y + 1) }, playerStyle]}
            >
              <PlayerSprite size={SPRITE_W} expression="neutral" dir={facing} walking={walking} walkClock={walkClock} />
            </Animated.View>

            <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, zIndex: 99999 }}>
              <RoomMask bounds={region?.bounds ?? null} cols={interior.cols} rows={interior.rows} />
            </View>
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
        showZone={interior.regions.length > 0}
        showFastTravel={interior.rooms.length > 0}
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
