// Room focus mask — DISABLED for handoff parity. The design renders the whole
// floor fully lit; dimming non-current rooms made the big blueprint wards read
// as "empty". Kept as a no-op (callers unchanged) so a *subtle* focus could be
// reintroduced later without touching InteriorScreen.
import type { Bounds } from './coords';

export function RoomMask(_props: { bounds: Bounds | null; cols: number; rows: number }) {
  return null;
}
