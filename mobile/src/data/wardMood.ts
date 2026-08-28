// What time it is on the ward, from the DEVICE clock.
//
// The server used to decide this, and it did not read a clock at all:
// home.DeriveShift picked between "DAY" and "EVENING" with
// `shifts[hash(userID, day) % 2]`. A learner opening the app at 11pm was told they
// were on days, and it flipped for no reason the next morning. It is a dice roll
// wearing a shift's name.
//
// So the phone decides, from `new Date()`. That is what a learner means by "지금": the
// clock they can see. It also lets the app have a NIGHT mood at all, which the server's
// two-value coin flip could not express, and it needs no round trip — the ward can be
// right before the home request lands.
//
// ONE source, used by both the LiveWard and the shift badge. Two sources is how the
// badge came to say DAY over a ward full of stars.

/** The three moods v27 draws. Lower-case because they are also the art's keys. */
export type WardMood = 'day' | 'evening' | 'night';

/** Korean three-shift nursing hours, which is what this app is about:
 *  데이 07–15, 이브닝 15–23, 나이트 23–07. Not 6/12/18 — those are someone's idea of
 *  morning and afternoon, and a nurse reading this screen knows the real boundaries. */
const DAY_START = 7;
const EVENING_START = 15;
const NIGHT_START = 23;

export function moodAt(date: Date): WardMood {
  const h = date.getHours();
  if (h >= NIGHT_START || h < DAY_START) return 'night';
  if (h >= EVENING_START) return 'evening';
  return 'day';
}

/** The label the shift badge and the ward's sky both show. Uppercase, as v27 draws it. */
export const SHIFT_LABEL: Record<WardMood, string> = {
  day: 'DAY',
  evening: 'EVENING',
  night: 'NIGHT',
};

/** i18n keys for the mood's own two lines: the sky's caption and the bar underneath it,
 *  which says what the mood changes about the day's content. */
export const MOOD_TITLE_KEY: Record<WardMood, string> = {
  day: 'ward.dayTitle',
  evening: 'ward.eveningTitle',
  night: 'ward.nightTitle',
};
export const MOOD_SUB_KEY: Record<WardMood, string> = {
  day: 'ward.daySub',
  evening: 'ward.eveningSub',
  night: 'ward.nightSub',
};

/** Milliseconds until the mood can next change, so the ward can re-read the clock
 *  exactly then instead of polling.
 *
 *  A learner studying at 14:58 should see the ward turn over at 15:00 without leaving
 *  the screen — and an app left open overnight must not still be showing DAY. */
export function msUntilNextMood(date: Date): number {
  const h = date.getHours();
  const next = h < DAY_START ? DAY_START : h < EVENING_START ? EVENING_START : h < NIGHT_START ? NIGHT_START : 24 + DAY_START;
  const at = new Date(date);
  at.setHours(next, 0, 0, 0);
  // setHours(24+7) rolls into tomorrow on its own, so no date arithmetic is needed —
  // and it is the only branch where the boundary is not today.
  //
  // No floor: every hour resolves to a boundary strictly ahead of it, the boundary
  // instants included (15:00:00 looks to 23:00, not to itself). A Math.max here was a
  // guard against a case that cannot occur, and no test could kill it.
  return at.getTime() - date.getTime();
}
