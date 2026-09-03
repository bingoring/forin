// The conversation a learner can share to the lounge, handed from the screen that
// held it to the screen that posts it.
//
// Why a module store and not route params: the turns are the whole conversation —
// six lines of English, plus roles — and a URL is not where that belongs (deep-link
// params truncate at `#`, as the elevator's colour taught us). Why not the server:
// there is no endpoint that returns a FINISHED session's transcript, and adding one
// to move data the client already has in memory would be a round trip to fetch what
// it just said.
//
// The store holds ONE conversation, the last one that offered itself, and it is
// consumed once: after the post is written the draft is cleared, so opening 글쓰기
// tomorrow does not silently attach yesterday's exchange.
export type ShareTurn = { index: number; role: 'user' | 'npc'; text: string };

export type ShareSource = {
  scenarioId: string;
  /** What the snippet header shows — "ER · 통증 사정 — Mrs. Hopkins". */
  title: string;
  turns: ShareTurn[];
};

let current: ShareSource | null = null;

/** Called by the screen that owns the conversation, once it has ended. */
export function offerShareSource(src: ShareSource) {
  // A conversation with nothing in it is not a share offer: the compose screen would
  // show an empty turn list under a rule that says "pick consecutive turns".
  current = src.turns.length > 0 && src.scenarioId ? src : null;
}

export function shareSource(): ShareSource | null {
  return current;
}

export function clearShareSource() {
  current = null;
}
