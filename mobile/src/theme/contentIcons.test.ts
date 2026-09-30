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
import { join, sep } from 'path';
import { artFor } from './emojiIcon';

const CONTENT = join(__dirname, '..', '..', '..', 'server', 'content');

function walk(dir: string, skip: (p: string) => boolean = () => false): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (skip(p)) continue;
    if (statSync(p).isDirectory()) out.push(...walk(p, skip));
    else if (p.endsWith('.yaml') || p.endsWith('.yml')) out.push(p);
  }
  return out;
}

/** 단어 은행(`nurse/lexicon/*.yaml`)은 보상 아이콘이 아니라 **NbIcon 이름**을 싣는다.
 *  같은 `icon:` 키를 쓰지만 푸는 곳이 다르다 — 아래에서 따로 지킨다. */
const isLexicon = (p: string) => p.includes(`${sep}lexicon${sep}`) || p.endsWith(`${sep}lexicon`);

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

/**
 * Split a content file into its `nuance:` blocks and the rest. Nuance items (v45) carry
 * NbIcon names under the same `icon:` key a reward uses — like the word banks, they are
 * resolved elsewhere, so the reward scan must not read them and a test below keeps them
 * honest instead. A block runs from its `nuance:` line to the next line indented no
 * deeper than that key (list items at the key's own indent still belong to it).
 */
function splitNuance(src: string): { nuance: string; rest: string } {
  const nuance: string[] = [];
  const rest: string[] = [];
  let depth = -1;
  for (const line of src.split('\n')) {
    const indent = line.length - line.trimStart().length;
    // A list may sit at the key's own indent (`  nuance:` / `  - kind:`) — valid YAML,
    // and what the merge tool writes — so a `- ` line at that depth is still inside.
    const sameLevelItem = indent === depth && line.trimStart().startsWith('- ');
    if (depth >= 0 && line.trim() !== '' && indent <= depth && !sameLevelItem) depth = -1;
    if (depth < 0 && /^\s*nuance:\s*$/.test(line)) {
      depth = indent;
      continue;
    }
    (depth >= 0 ? nuance : rest).push(line);
  }
  return { nuance: nuance.join('\n'), rest: rest.join('\n') };
}

/** Every distinct icon value in the content set, with one file that uses it. Both
 *  quoted and bare scalars — the generator writes bare 마크 for most icons and a
 *  quoted escape for the one above. */
function rewardIcons(): Map<string, string> {
  const found = new Map<string, string>();
  for (const f of walk(CONTENT, isLexicon)) {
    const src = splitNuance(readFileSync(f, 'utf8')).rest;
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

// ── 단어 은행의 아이콘 ──────────────────────────────────────────────────────
//
// STEP 1 플래시카드의 아이콘은 보상 아이콘과 **다른 집합**(NbIcon)에서 온다. 그런데
// YAML 키가 똑같이 `icon:` 이라, 위의 보상 스캔이 이것까지 집어 들고 있었다.
//
// 그 혼선 밑에 진짜 결함이 있었다. 저작 지시서의 허용 목록을 손으로 적으면서 `round`
// 라는 없는 이름을 넣었고, 그대로 525건에 퍼졌다. 화면에서는 빈 자리로 그려진다 —
// 터지지 않으니 눈으로 찾을 수 없다. 이 테스트가 그 자리를 지킨다.
test('every word-bank icon is a name NbIcon actually draws', () => {
  const decl = readFileSync(join(__dirname, '..', 'components', 'nb', 'NbIcon.tsx'), 'utf8');
  const union = decl.slice(decl.indexOf('NbIconName'), decl.indexOf('export function NbIcon'));
  const known = new Set([...union.matchAll(/'([a-zA-Z0-9-]+)'/g)].map((m) => m[1]));
  expect(known.size).toBeGreaterThan(20); // 선언 모양이 바뀌면 이 테스트가 헛돈다

  const lexicon = join(CONTENT, 'nurse', 'lexicon');
  const used = new Map<string, string>();
  for (const f of walk(lexicon)) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/icon:\s*"?([a-zA-Z0-9-]+)"?/g)) {
      if (!used.has(m[1])) used.set(m[1], f.split('/').slice(-1)[0]);
    }
  }
  expect(used.size).toBeGreaterThan(5); // 은행을 못 찾으면 통과해 버린다

  const unknown = [...used].filter(([n]) => !known.has(n)).map(([n, f]) => `${n} (first in ${f})`);
  expect(unknown).toEqual([]);
});

// v45 nuance items (scene and swap icons) are NbIcon names too, and live inside the
// scenario and topic files among the reward icons — same `icon:` key, different set.
test('every nuance icon is a name NbIcon actually draws', () => {
  const decl = readFileSync(join(__dirname, '..', 'components', 'nb', 'NbIcon.tsx'), 'utf8');
  const union = decl.slice(decl.indexOf('NbIconName'), decl.indexOf('export function NbIcon'));
  const known = new Set([...union.matchAll(/'([a-zA-Z0-9-]+)'/g)].map((m) => m[1]));
  const used = new Map<string, string>();
  for (const f of walk(CONTENT, isLexicon)) {
    const { nuance } = splitNuance(readFileSync(f, 'utf8'));
    for (const m of nuance.matchAll(/icon:\s*"?([^\s"',}]+)"?/g)) {
      if (!used.has(m[1])) used.set(m[1], f.split('/').slice(-1)[0]);
    }
  }
  expect(used.size).toBeGreaterThan(2); // 뉘앙스를 못 찾으면 통과해 버린다
  const unknown = [...used].filter(([n]) => !known.has(n)).map(([n, f]) => `${n} (first in ${f})`);
  expect(unknown).toEqual([]);
});
