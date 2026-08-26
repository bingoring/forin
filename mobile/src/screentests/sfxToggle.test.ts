// The sound switch answers every tap.
//
// Reported as "every second tap makes a sound; one tap makes none" — and this control
// produced exactly that. Turning sound OFF cannot be confirmed by a sound if the mute
// is applied first, so alternate taps were silent by construction. A switch that
// answers half its taps reads as broken.
//
// A source test rather than a render one: what matters is the ORDER of two calls, and
// a render test that pressed the switch would need the whole profile screen (avatar,
// colleagues, curriculum) mounted to observe it.
import { readFileSync } from 'fs';
import { join } from 'path';

const SRC = readFileSync(join(__dirname, '..', 'app', '(tabs)', 'me.tsx'), 'utf8');

/** The body of toggleSfx. */
function toggleBody(): string {
  const start = SRC.indexOf('const toggleSfx = () => {');
  expect(start).toBeGreaterThan(-1);
  const end = SRC.indexOf('\n  };', start);
  return SRC.slice(start, end);
}

test('both directions play something', () => {
  const body = toggleBody();
  // Turning on, and turning off.
  expect(body).toMatch(/playSfx\('confirm'\)/);
  expect(body).toMatch(/playSfx\('back'\)/);
});

test('the off sound is played BEFORE the mute takes effect', () => {
  // playSfx reads the mute flag when it is called, so muting first makes the farewell
  // blip silent — which is the whole bug.
  const body = toggleBody();
  const play = body.indexOf("playSfx('back')");
  const mute = body.indexOf('setSfxMuted(true)');
  expect(play).toBeGreaterThan(-1);
  expect(mute).toBeGreaterThan(-1);
  expect(play).toBeLessThan(mute);
});

test('turning on unmutes before playing', () => {
  // The mirror image: playing before unmuting would be silenced by the flag.
  const body = toggleBody();
  const unmute = body.indexOf('setSfxMuted(false)');
  const play = body.indexOf("playSfx('confirm')");
  expect(unmute).toBeGreaterThan(-1);
  expect(unmute).toBeLessThan(play);
});
