// Which destinations the onboarding can offer for real.
//
// The server decides, because it is the one that knows whether authored learning
// phrases exist in a country's language — the AI conversation follows the profile's
// target language through the prompt and would happily hold a German consultation,
// but every example sentence a learner is asked to say is authored, and today they
// are all English. Offering Germany on top of that teaches the wrong phrases.
//
// Hydrated at boot from GET /config/economy, the one response the app fetches on
// every launch before login. Same pattern as ECON in data/economy.ts.
const ready: string[] = ['us']; // bundled fallback: what shipped when this was written

export function readyDestinations(): string[] {
  return ready;
}

export function isDestinationReady(code: string): boolean {
  return ready.includes(code);
}

/** Overwrite in place from the server. Silent on failure — the fallback above keeps
 *  the onboarding usable offline, and it errs toward the destination we know works. */
export function hydrateDestinations(codes: unknown): void {
  if (!Array.isArray(codes) || codes.length === 0) return;
  const next = codes.filter((c): c is string => typeof c === 'string');
  if (next.length === 0) return;
  ready.length = 0;
  ready.push(...next);
}
