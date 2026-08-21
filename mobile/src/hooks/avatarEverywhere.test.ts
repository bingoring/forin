// The learner's portrait comes from the saved avatar, wherever it is drawn.
//
// The dialogue screen drew the player with `RoleFace kind="nurse" hair="#3C2A18"` — a
// stock nurse with one hair colour — while the profile tab drew the same person from the
// four saved values. So editing your portrait changed the profile tab and nothing else,
// which is the kind of half-wired feature that reads as "the app forgot".
//
// FacePlayer is the player's face and it takes the avatar; passing it is not optional.
// RoleFace is for everyone ELSE, whose appearance comes from the scenario.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const SRC = join(__dirname, '..');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.tsx') && !p.includes('.test.')) out.push(p);
  }
  return out;
}

test('every FacePlayer is given an avatar', () => {
  const offenders: string[] = [];
  for (const p of walk(SRC)) {
    const src = readFileSync(p, 'utf8');
    for (const m of src.matchAll(/<FacePlayer\b([^>]*)>?/g)) {
      if (!/\bavatar=/.test(m[1])) offenders.push(`${p.slice(SRC.length + 1)}: ${m[0].slice(0, 60)}`);
    }
  }
  expect(offenders).toEqual([]);
});

test('and the dialogue screen draws the player that way', () => {
  // Named directly: this is the screen that was wrong, and the rule above cannot notice a
  // screen that renders someone else's face for the player instead.
  const src = readFileSync(join(SRC, 'app', 'dialogue', '[id].tsx'), 'utf8');
  expect(src).toMatch(/<FacePlayer[^>]*avatar=\{avatar\}/);
  // A hardcoded player hair colour is what this replaced.
  expect(src).not.toMatch(/hair="#3C2A18"/);
});
