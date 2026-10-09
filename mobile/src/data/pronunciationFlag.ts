// Whether this deploy can actually score speech.
//
// The server knows: pronunciation is graded by Azure, and a deploy without
// AZURE_SPEECH_KEY cannot do it at all. business-rules §5 says the entry points must
// then be ABSENT, not present-and-failing — a mic button that records ten seconds and
// answers 502 is worse than no button.
//
// Hydrated at boot from GET /config/economy, same as readyDestinations.
//
// Defaults to ON, and stays on when the flag never arrives (network failure, an older
// server that does not send it). business-rules fixes no default for that case; ON is
// today's behaviour, and the failure it risks — a dead button on a deploy with no key —
// is one the 502 path already handles, whereas defaulting OFF would hide pronunciation
// from every learner whose first request happened to time out. The key being absent is a
// deploy fault, a dropped request is routine.
import { useSyncExternalStore } from 'react';

let enabled = true;
const listeners = new Set<() => void>();

export function isPronunciationEnabled(): boolean {
  return enabled;
}

/** Overwrite from the server. Only a real boolean counts — anything else (missing,
 *  null, a string) leaves the current value alone. */
export function hydratePronunciationEnabled(flag: unknown): void {
  if (typeof flag !== 'boolean' || flag === enabled) return;
  enabled = flag;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

/** The one gate every pronunciation entry point reads. Reactive, because the flag lands
 *  after first paint (boot fetch) and a screen already on display must drop its button. */
export function usePronunciationEnabled(): boolean {
  return useSyncExternalStore(subscribe, isPronunciationEnabled, isPronunciationEnabled);
}

/** Test seam: back to the shipped default. */
export function resetPronunciationEnabled(): void {
  enabled = true;
  listeners.forEach((l) => l());
}
