// Pure state machine for the pronunciation loop route (one route, 6 screen
// states — frontend-components.md §4). Mirrors the transition diagram in
// business-logic-model.md §3; the one addition beyond that diagram (result's
// MIC_DENIED edge) is commented at its own entry below.
//
// This file is deliberately free of side effects: requesting mic permission,
// running the 10s countdown, and calling POST /pronunciation all happen in
// the route component (app/pronunciation/[sentenceKey].tsx), which dispatches
// the OUTCOME as an event. That split is what makes "scoring cannot be
// cancelled" and "10s always lands in scoring" testable without mounting a
// screen or mocking expo-audio.
//
// Lives under src/lib/, not src/app/pronunciation/: expo-router's
// require.context collects every .ts file under src/app/ as a route module
// and (in dev + sync import mode) require()s each one eagerly to validate its
// exports. A file with a top-level `describe(...)` (this one's .test.ts) or
// without a default export (this one) breaks that scan — see task-8-report.md
// §"이번 라운드" for how that surfaced.
export type PronState = 'idle' | 'recording' | 'scoring' | 'result' | 'permissionDenied' | 'noSpeech';

export type PronEventType =
  | 'START_RECORDING' // mic permission already granted
  | 'MIC_DENIED' // permission request came back denied
  | 'PERMISSION_GRANTED' // learner granted it (e.g. after a Settings round trip)
  | 'STOP' // learner pressed the stop button
  | 'TIMEOUT' // business-rules R6: 10s auto-stop
  | 'CANCEL' // back out of recording; a no-op once scoring has started
  | 'SUCCESS' // POST /pronunciation resolved with a score
  | 'NO_SPEECH' // 422 no_speech_detected
  | 'ERROR' // 5xx / network failure
  | 'RETRY' // result → record again (caller re-POSTs, server bumps attemptNo)
  | 'NEXT' // result → caller's next sentence (new route params, not this FSM's job)
  | 'DISMISS'; // clear the noSpeech banner without trying again

export type PronEvent = { type: PronEventType };

type Table = { [S in PronState]?: Partial<Record<PronEventType, PronState>> };

// Every arrow in business-logic-model.md §3, plus the noSpeech/permissionDenied
// split that frontend-components.md §4 requires as distinct renderable states
// (rather than folding "no speech" silently back into idle).
const TRANSITIONS: Table = {
  idle: {
    START_RECORDING: 'recording',
    MIC_DENIED: 'permissionDenied',
  },
  recording: {
    STOP: 'scoring',
    TIMEOUT: 'scoring',
    CANCEL: 'idle',
  },
  scoring: {
    SUCCESS: 'result',
    NO_SPEECH: 'noSpeech',
    ERROR: 'noSpeech',
    // CANCEL is intentionally absent: falls through to "state unchanged"
    // below. The request already went out (business-logic-model §3) — there
    // is nothing a cancel could undo, so scoring has no cancel button either.
  },
  result: {
    RETRY: 'recording',
    NEXT: 'idle',
    // "다시 녹음" re-checks mic permission before it re-starts the recorder
    // (retry can't assume permission granted at first record still holds —
    // it can be revoked from Settings between attempts). If it comes back
    // denied, land on the same permission screen idle would.
    MIC_DENIED: 'permissionDenied',
  },
  permissionDenied: {
    PERMISSION_GRANTED: 'idle', // back to idle, not straight into recording —
    // the learner presses record again themselves.
  },
  noSpeech: {
    // Renders like idle plus a banner (frontend-components §4) and accepts
    // the same recording controls.
    START_RECORDING: 'recording',
    MIC_DENIED: 'permissionDenied',
    DISMISS: 'idle',
  },
};

/** Pure transition function. An event the current state doesn't list is a
 *  no-op — the caller doesn't have to guard every dispatch against "is this
 *  even valid right now", which is exactly what keeps CANCEL harmless once
 *  scoring is underway. */
export function next(state: PronState, event: PronEvent): PronState {
  return TRANSITIONS[state]?.[event.type] ?? state;
}

export const initialPronState: PronState = 'idle';
