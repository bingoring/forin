// pixel-engine — a reusable React Native 2.5D tile-map / pixel-game kernel
// extracted from forin (5e). It owns the GENERIC primitives only — tile/coord
// math, collision + pathfinding, region detection, grid movers, the camera-
// followed movement hook, the chibi character sprite/motion system, and the
// stateless map-layer components (floor, walls, room mask, ambient NPC, emote).
//
// It has NO dependency on forin domain content: object renderers (beds, clinic
// equipment, landmarks), floor-theme catalogs, the screen chrome (HUD, fast
// travel) and the interior fixtures all live in the app and are composed on top
// of these primitives. Another project can depend on this package and supply
// its own content the same way.
//
// Consumed via the `@engine` path alias — resolved by tsconfig `paths` (Expo
// Metro reads tsconfig paths natively, the same mechanism as `@/`) and mirrored
// in jest via `moduleNameMapper`. No metro.config / watchFolders needed since the
// engine lives inside the app root. See docs 02-construction/05-map-engine.md §5e.

// pure logic (no React) — unit-testable
export * from './coords';
export * from './collision';
export * from './regions';
export * from './gridmover';
export * from './footprint';
export * from './cull';
export * from './types';

// hooks
export * from './useMovement';
export * from './useGridMover';

// character sprite + motion system
export * from './Sprite';
export * from './Face';
export * from './AnimatedFace';

// stateless map-layer components
export * from './TileFloor';
export * from './CampusGround';
export * from './Walls';
export * from './RoomMask';
export * from './EmoteBubble';
export * from './AmbientNpc';
