# pixel-engine

A reusable React Native 2.5D tile-map / pixel-game **kernel**, extracted from
forin (2-5 increment 5e). It owns only the generic primitives; all forin domain
content composes on top of it.

Imported through the `@engine` path alias (tsconfig `paths` + jest
`moduleNameMapper`; Expo Metro resolves the alias at bundle time the same way it
resolves `@/`).

```ts
import { useMovement, TileFloor, PlayerSprite, objectCollision } from '@engine';
import { regionAt } from '@engine/regions'; // deep import for pure-logic-only consumers (e.g. unit tests)
```

## What's in the engine (generic, no forin dependency)

| Module | Responsibility |
|---|---|
| `coords` | tile↔px math (ITILE·ZOOM·TILE), directions, bounds clamp — **pure** |
| `collision` | walls+bounds → blocked set, `canEnter`, BFS `findPath` — **pure** |
| `regions` | point→region resolution — **pure** |
| `gridmover` | patrol/wander stepping logic — **pure** |
| `footprint` | object footprint → blocked rects (`objectCollision`) — **pure** |
| `types` | `Interior`/`MapObject`/`NpcSpec`/`Region`/`Room`/`Hotspot` data shapes |
| `useMovement` | player movement state (D-pad + tap-to-walk + step timer) |
| `useGridMover` | ambient-NPC patrol/wander + emote ticker |
| `Sprite` / `Face` | chibi character sprite + walk/idle motion system |
| `TileFloor` `Walls` `RoomMask` `AmbientNpc` `EmoteBubble` | stateless map-layer components |

## What stays in the app (forin content / composition)

The engine deliberately does **not** know about: the object renderers
(`map/objects/*` — beds, clinic equipment, landmarks), the interior fixtures
(`map/fixtures/*`, `map/clinic.ts`), the screen chrome (`map/HUD`,
`map/FastTravelModal`), or the screen composition (`map/InteriorScreen`). Another
project reuses the engine by supplying its own content the same way forin does.

The dependency inversion is by **composition**, not injection: app screens call
engine hooks/components and render their own object/theme content alongside them.
`InteriorScreen` is forin's composition of these primitives; a new project writes
its own.

## Location note (packages/ promotion)

This kernel lives at `mobile/src/engine/` rather than `packages/pixel-engine/`.
The repo has no root workspace and a single `node_modules` (in `mobile/`), so a
runtime package outside the app root can't resolve `react`/`react-native` for
either `tsc` or Metro without workspace tooling. Keeping it under `src/` gives the
clean, forin-decoupled, barrel-exported boundary with zero extra build config.
Promoting it to a published `packages/pixel-engine` is a follow-up that requires
npm workspaces + a root `node_modules` (or a built/published package).
