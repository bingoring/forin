// Interior exploration shell: top bar, camera-followed tile world (floor +
// objects + hotspots + player + room mask), region-transition banner, and the
// HUD. Movement/walkability come from useMovement + the pure collision module.
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent, type GestureResponderEvent } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { border, colors, fonts, type as typeScale, fs } from '@/theme/tokens';
import { TILE, coordToPx, type Coord } from '@engine';
import { regionAt } from '@engine';
import { boxInView, OBJECT_FOOTPRINT } from '@engine';
import { useMovement } from '@engine';
import { TileFloor } from '@engine';
import { CampusGround } from '@engine';
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

// Quest/info marker — faithful IHotspot: a pixel box with a ! (quest/urgent) or
// ? (info) glyph + hard shadow, gently bobbing up/down (the handoff "forinBob").
const HS_COLORS: Record<string, string> = { quest: '#FEF08A', urgent: '#EF4444', info: '#FFFFFF', police: '#1F2937', portal: '#A7F3D0' };
// Handoff IHotspot is 18px at ITILE=16 (≈1.1 tiles → ~36 screen px at ZOOM 2);
// keep the marker that prominent rather than the earlier undersized 24.
const HS_SIZE = 34;
type MarkerT = Hotspot & { dy?: number };
function HotspotMarker({ h }: { h: MarkerT }) {
  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [bob]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: -5 * bob.value }] }));
  const left = (h.x + 0.5) * TILE - HS_SIZE / 2;
  const top = h.y * TILE + (h.dy ?? -(HS_SIZE + 2));
  const bg = HS_COLORS[h.kind] ?? HS_COLORS.quest;
  const glyph = h.kind === 'info' ? '?' : h.kind === 'portal' ? '→' : '!';
  const fg = h.kind === 'police' ? '#FFFFFF' : colors.ink;
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', left, top, zIndex: 9000 }, style]}>
      <View
        style={{
          width: HS_SIZE,
          height: HS_SIZE,
          backgroundColor: bg,
          borderWidth: 3,
          borderColor: colors.ink,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.ink,
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 1,
          shadowRadius: 0,
        }}
      >
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(22), lineHeight: 26, color: fg }}>{glyph}</Text>
      </View>
    </Animated.View>
  );
}

// 2.5D depth: everything composites by its base (feet / footprint-bottom) tile y
// via zIndex, so a sprite north of (behind) a building is occluded by it and one
// to the south is drawn in front. Larger base-y = nearer the camera = higher z.
const zFor = (baseY: number) => Math.round(baseY * 10) + 10;
const objBaseY = (o: MapObject) => o.y + (typeof o.props?.h === 'number' ? (o.props.h as number) : OBJECT_FOOTPRINT[o.type]?.h ?? 1);
// OVERHEAD fixtures hang from the ceiling ABOVE everything (surgical light shining
// down) → fixed high z, above objects + sprites but below markers/room-mask.
// Static world layers (floor + room tints + walls + authored objects). Memoized
// on the interior so it renders ONCE per map and is fully isolated from the
// dynamic layers (ambient NPCs emote on random timers → frequent re-renders). If
// these shared a parent with the NPCs, every NPC emote reconciled the whole
// child list and RN intermittently dropped/re-layered objects on re-entry — the
// "오브젝트가 사라지거나 배치가 이상함" bug. React.memo keeps this subtree stable.
const objZ = (o: MapObject) => (OVERHEAD.has(o.type) ? OVERHEAD_Z : CEILING.has(o.type) ? 5 : zFor(objBaseY(o)));

const StaticWorld = memo(function StaticWorld({ interior }: { interior: Interior }) {
  // Depth-SORT the objects and render in that DOM order (painter's algorithm),
  // in addition to zIndex, so depth is stable regardless of RN's zIndex quirks.
  const drawn = interior.objects.filter((o) => o.type !== 'tint').slice().sort((a, b) => objZ(a) - objZ(b));
  // DEFER the object layer one frame past the floor/walls. On fast elevator
  // re-entry, mounting ~50 react-native-svg objects in the SAME frame as the
  // rest of the shell raced and the whole object layer intermittently failed to
  // paint (floor+walls fine, all equipment gone) — "오브젝트가 다 사라짐". Letting the
  // shell commit first, then mounting objects on the next frame, avoids the race.
  const [showObjs, setShowObjs] = useState(false);
  useEffect(() => {
    const r = requestAnimationFrame(() => setShowObjs(true));
    return () => cancelAnimationFrame(r);
  }, []);
  return (
    <>
      {interior.groundMap
        ? <CampusGround map={interior.groundMap} />
        : <TileFloor cols={interior.cols} rows={interior.rows} theme={interior.floorTheme} />}
      {interior.objects.filter((o) => o.type === 'tint').map((o) => (
        <Tint key={o.id} x={o.x} y={o.y} w={(o.props?.w as number) ?? 1} h={(o.props?.h as number) ?? 1} color={o.props?.color as string | undefined} op={o.props?.op as number | undefined} />
      ))}
      <Walls collision={interior.collision} />
      {showObjs && drawn.map((o) => (
        <View key={o.id} pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, zIndex: objZ(o) }}>
          <InteriorObjectView object={o} />
        </View>
      ))}
    </>
  );
});

const OVERHEAD = new Set(['surgicallight', 'phototherapy']);
// Wall/ceiling backdrops sit BEHIND the equipment in front of them → low z.
const CEILING = new Set(['orboommonitor', 'bankofmonitors', 'playmat']);
const OVERHEAD_Z = 8000;

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
  onReady,
}: {
  interior: Interior;
  deptName?: string;
  onExit?: () => void;
  onEnterScenario?: (hotspot: Hotspot) => void;
  /** Fired once the world has laid out AND drawn its first frames (camera
   *  settled at the spawn) — lets the elevator doors open on a settled map,
   *  not a mid-layout one that visibly slides/pops. */
  onReady?: () => void;
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
  // Static object/floor/wall layers now live in <StaticWorld> (memoized on the
  // interior) — see its note. View-culling of objects stays disabled: structural
  // pieces sit at room edges where culling dropped them ("missing 가림막").
  // Markers (!/?) belong to ENTITIES, not free map tiles: the authored hotspots
  // (e.g. elevators) plus any object/NPC carrying a `marker` prop. This keeps
  // markers anchored to a bed/desk/person instead of floating on empty floor.
  const allMarkers = useMemo<MarkerT[]>(() => {
    const out: MarkerT[] = interior.hotspots.map((h) => ({ ...h, dy: -(HS_SIZE + 4) }));
    for (const o of interior.objects) {
      const m = o.props?.marker;
      // floats above the object's art (beds/desks rise ~2 tiles) — clear of it
      if (typeof m === 'string') out.push({ id: `m-${o.id}`, kind: m, x: o.x, y: o.y, label: o.props?.markerLabel as string | undefined, scenarioId: o.props?.scenarioId as string | undefined, dy: -(HS_SIZE + 30) });
    }
    for (const s of interior.npcs ?? []) {
      // chibi heads rise ~1.75 tiles above the foot tile → float well above them
      if (typeof s.marker === 'string' && s.start) out.push({ id: `m-${s.id}`, kind: s.marker, x: s.start.x, y: s.start.y, label: s.markerLabel, scenarioId: s.scenarioId, dy: -(HS_SIZE + 62) });
    }
    return out;
  }, [interior.hotspots, interior.objects, interior.npcs]);
  const visHotspots = useMemo(() => (view ? allMarkers.filter((h) => boxInView(h.x, h.y - 2, 1, 3, view)) : allMarkers), [view, allMarkers]);
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

  // Action target: a marker (hotspot / object / NPC) the player stands on or is
  // adjacent to.
  const actionable = useMemo(
    () => allMarkers.find((h) => manhattan(pos, { x: h.x, y: h.y }) <= 1) ?? null,
    [pos, allMarkers],
  );

  // Glide the player pixel position toward the current tile; the camera derives
  // from it so both ease together (no instant tile jumps).
  const pxX = useSharedValue(pos.x * TILE);
  const pyY = useSharedValue(pos.y * TILE);
  // Viewport as SHARED VALUES (not captured JS state): the camera worklet must
  // read the LIVE viewport. Capturing vp.w/vp.h from React state into the
  // useAnimatedStyle closure was stale across fast remounts (elevator re-entry)
  // → the clamp used a wrong/old viewport, so the whole map rendered at the
  // wrong scroll/scale and objects appeared shifted or scrolled off ("사라짐").
  const vpW = useSharedValue(0);
  const vpH = useSharedValue(0);
  const walkClock = useSharedValue(0); // re-fired 0→1 each step → 2 hops + 2 leg steps/tile
  // SNAP the camera to the spawn on the first frame of an interior (mount or map
  // switch); GLIDE only for in-map steps afterward. Relying on the glide alone
  // meant the camera's settled position depended on withTiming completing before
  // the screenshot/paint — inconsistent across fast elevator re-entries (camera
  // sometimes settled scrolled-down). Snapping makes entry deterministic.
  const settledFor = useRef<Interior | null>(null);
  useEffect(() => {
    const firstFrame = settledFor.current !== interior;
    settledFor.current = interior;
    if (firstFrame) {
      pxX.value = pos.x * TILE;
      pyY.value = pos.y * TILE;
    } else {
      pxX.value = withTiming(pos.x * TILE, { duration: GLIDE_MS, easing: Easing.linear });
      pyY.value = withTiming(pos.y * TILE, { duration: GLIDE_MS, easing: Easing.linear });
    }
    walkClock.value = 0;
    walkClock.value = withTiming(1, { duration: GLIDE_MS, easing: Easing.linear });
  }, [pos.x, pos.y, interior, pxX, pyY, walkClock]);

  // Camera: one transform on the world Pressable — translate (follow) then scale
  // (zoom), with transformOrigin top-left so world→screen is linear and the
  // Pressable's hit box == its content box (no oversized child to swallow taps,
  // which broke campus tap-to-walk at scale<1). RN reports locationX/Y in the
  // view's untransformed local space (0..worldW), so the tap math is ÷TILE.
  const worldStyle = useAnimatedStyle(() => {
    'worklet';
    const w = vpW.value;
    const h = vpH.value;
    const sw = worldW * scale;
    const sh = worldH * scale;
    const cx = (pxX.value + TILE / 2) * scale; // player center in scaled px
    const cy = (pyY.value + TILE / 2) * scale;
    const tx = sw <= w ? (w - sw) / 2 : Math.max(w - sw, Math.min(0, w / 2 - cx));
    const ty = sh <= h ? (h - sh) / 2 : Math.max(h - sh, Math.min(0, h / 2 - cy));
    return { transform: [{ translateX: tx }, { translateY: ty }, { scale }] };
  });
  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pxX.value + PLAYER_DX }, { translateY: pyY.value + PLAYER_DY }],
  }));

  const onWorldPress = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    moveTo({ x: Math.floor(locationX / TILE), y: Math.floor(locationY / TILE) });
  };

  const readyFired = useRef(false);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setVp({ w: width, h: height });
    vpW.value = width; // live viewport for the camera worklet (see above)
    vpH.value = height;
    // Signal "map is settled" one layout + two frames after we first have a
    // viewport (worldStyle clamp + view-cull are valid only once vp.w>0; two
    // rAFs let that first correct frame actually paint). Fired once.
    if (width > 0 && !readyFired.current) {
      readyFired.current = true;
      requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10 }}
      >
        <Pressable onPress={onExit} hitSlop={10}>
          <Text style={{ fontFamily: fonts.heading, fontSize: typeScale.topBar, color: colors.ink }}>‹ 커리어</Text>
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
            {/* Static layers (floor/tints/walls/objects) — memoized + isolated
                from NPC re-renders so objects never drop on re-entry. */}
            <StaticWorld interior={interior} />

            {visHotspots.map((h) => (
              <HotspotMarker key={h.id} h={h} />
            ))}

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
