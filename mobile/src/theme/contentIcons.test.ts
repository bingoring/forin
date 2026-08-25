// Every reward icon the CONTENT ships must resolve to artwork.
//
// The briefing screen's reward rows vary by situation — 응급 대응 진척, 수술실 인증
// 진척, ACLS 인증 진척, 동료 신뢰도 — and each row's icon comes from the scenario
// YAML, not from code. So "the icons are updated" is only true if every value those
// 1000+ files use has artwork; one unmapped value renders as a bare emoji beside
// pixel-art neighbours, on whichever situations happen to use it.
//
// Reads the content directory directly rather than a hand-copied list: a new
// scenario introducing a new icon is exactly the case this must catch.
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { artFor } from './emojiIcon';

const CONTENT = join(__dirname, '..', '..', '..', 'server', 'content');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.yaml') || p.endsWith('.yml')) out.push(p);
  }
  return out;
}

/** YAML double-quoted scalars may carry escapes, and the generated files do: the Go
 *  yaml encoder writes 🎖 as "\U0001F396". A parser decodes that back to the emoji —
 *  reading the raw text without decoding reports a content bug that does not exist
 *  (checked against the actual loader: gen-nicu.yaml parses to U+1F396). */
function decodeYamlEscapes(v: string): string {
  return v
    .replace(/\\U([0-9a-fA-F]{8})/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCodePoint(parseInt(h, 16)));
}

/** Every distinct icon value in the content set, with one file that uses it. Both
 *  quoted and bare scalars — the generator writes bare 마크 for most icons and a
 *  quoted escape for the one above. */
function rewardIcons(): Map<string, string> {
  const found = new Map<string, string>();
  for (const f of walk(CONTENT)) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/icon:\s*(?:"([^"]+)"|([^\s"'#][^\s#]*))/g)) {
      const raw = m[1] !== undefined ? decodeYamlEscapes(m[1]) : m[2];
      if (raw && !found.has(raw)) found.set(raw, f);
    }
  }
  return found;
}

test('the content scan finds the reward icons', () => {
  // Without this the assertion below would pass on a moved or renamed directory.
  const icons = rewardIcons();
  expect(icons.size).toBeGreaterThan(3);
  expect(icons.has('⭐')).toBe(true);
});

test('every reward icon in every scenario resolves to artwork', () => {
  const unresolved = [...rewardIcons()]
    .filter(([e]) => !artFor(e))
    // Named with a file, so a failure says which content introduced it.
    .map(([e, f]) => `${e} (first in ${f.split('/').slice(-1)[0]})`);
  expect(unresolved).toEqual([]);
});

// The generator writes rewards too (cmd/gencontent), and its icons are Go string
// literals rather than YAML — a separate place to forget.
test('the generator only emits icons that resolve', () => {
  const gen = readFileSync(join(CONTENT, '..', 'cmd', 'gencontent', 'main.go'), 'utf8');
  const icons = [...gen.matchAll(/Icon:\s*"([^"]+)"/g)].map((m) => m[1]);
  expect(icons.length).toBeGreaterThan(0);
  expect(icons.filter((e) => !artFor(e))).toEqual([]);
});

// Which artwork each one lands on, spelled out. A remap that silently sends 동료
// 신뢰도 to a gem would otherwise pass the "resolves" test above.
test('the reward icons land on the artwork they mean', () => {
  expect(artFor('⭐')).toEqual({ tier: 'ficon', name: 'xp' });        // 경험치
  expect(artFor('❤')).toEqual({ tier: 'ficon', name: 'heart' });      // 환자 만족도
  expect(artFor('🎖')).toEqual({ tier: 'ficon', name: 'badge' });     // 부서·인증 진척
  expect(artFor('🤝')).toEqual({ tier: 'ficon', name: 'handshake' }); // 동료 신뢰도
  expect(artFor('🚨')).toEqual({ tier: 'ficon', name: 'siren' });     // ACLS·트라우마 인증
  expect(artFor('📋')).toEqual({ tier: 'ficon', name: 'board' });     // 시나리오 잠금해제
});
