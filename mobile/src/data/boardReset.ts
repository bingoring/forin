// How long today's board is still today's.
//
// The header used to show `새로고침 ⏱ 14:32` — the wall clock at the moment the screen
// rendered, in a raised white box that looked like a button. It answered nothing: it was
// not the time of anything in particular, it did not move, and pressing it did nothing.
//
// The board is a per-user daily pool that resets at local midnight, so the number worth
// showing is how much of today is left. That one moves on its own, which is also why it
// stops reading as a broken clock.

/** Milliseconds from `now` until the next local midnight. */
export function msUntilReset(now: Date): number {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return next.getTime() - now.getTime();
}

/** Key + params for the remaining time, so the caller can just hand it to t(). */
export function resetLabel(now: Date): { key: string; params?: Record<string, number> } {
  const total = Math.max(0, msUntilReset(now));
  const mins = Math.floor(total / 60_000);
  if (mins < 1) return { key: 'board.resetSoon' };
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  // Hours are dropped rather than shown as "0시간 40분": a zero that is always there for
  // the last hour of the day is noise in a chip this small.
  return h > 0 ? { key: 'board.resetHM', params: { h, m } } : { key: 'board.resetM', params: { m } };
}
