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

test('the dialogue screen draws the NPC only, and no stock face for the player', () => {
  // This screen used to draw the learner as `RoleFace kind="nurse"` — a stock nurse
  // with one hair colour — which is the bug the rule above exists for. It was then
  // fixed to FacePlayer + avatar, and has since been cut entirely: one portrait, the
  // person being spoken to, centred (the learner is the one typing; a second frame
  // cost the top third of the screen to say what you look like).
  //
  // So the assertion is no longer "it passes the avatar" but "it draws no player face
  // at all" — which also catches the original bug, since a stock RoleFace for the
  // player would have to be a second portrait frame.
  const src = readFileSync(join(SRC, 'app', 'dialogue', '[id].tsx'), 'utf8');
  expect(src).not.toMatch(/<FacePlayer/);
  // Exactly one portrait frame, and it takes the scenario's own character.
  expect(src.match(/<PortraitFrame/g) ?? []).toHaveLength(1);
  expect(src).toMatch(/<PortraitFrame[^>]*name=\{p\.name/);
});
