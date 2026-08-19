#!/usr/bin/env python3
"""Build a translation matrix page from the i18n catalogs.

Languages across the top, keys down the side, one row per key so the same string
in four languages sits on one line. Untranslated cells are marked, which is what
makes the page useful: it answers "what is left" without reading four files.

Why a generated page and not a translation server: the catalogs live in git, so
they get diffs, review and rollback, and the app has no runtime dependency on a
service that could be down while a nurse is in a basement with no signal. Editing
happens in the browser and exports catalog files to commit.

Usage:  python3 scripts/i18n-matrix.py [-o out.html]
"""
import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "src" / "i18n" / "catalog"
LOCALES = ["ko", "en", "ja", "de"]
LOCALE_NAMES = {"ko": "한국어", "en": "English", "ja": "日本語", "de": "Deutsch"}

# One entry per line: 'key': 'value',  — either quote style, escapes allowed.
ENTRY = re.compile(
    r"""^\s*(?P<kq>['"])(?P<key>(?:\\.|[^\\])*?)(?P=kq)\s*:\s*"""
    r"""(?P<vq>['"])(?P<val>(?:\\.|[^\\])*?)(?P=vq)\s*,\s*$"""
)


def unescape(s: str) -> str:
    return s.replace("\\'", "'").replace('\\"', '"').replace("\\n", "\n").replace("\\\\", "\\")


def parse(locale: str) -> dict:
    """Parse a catalog. Refuses to guess: an unparsed content line is an error.

    Silently skipping a malformed line would drop a real string from the matrix and
    make the page quietly wrong — the exact failure mode this project keeps hitting
    (a check that passes because it examined nothing).
    """
    path = CATALOG / f"{locale}.ts"
    out, bad = {}, []
    for i, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        stripped = line.strip()
        if (not stripped or stripped.startswith("//") or stripped.startswith("export ")
                or stripped in ("};", "}")):
            continue
        m = ENTRY.match(line)
        if m:
            out[unescape(m.group("key"))] = unescape(m.group("val"))
        else:
            bad.append((i, stripped[:80]))
    if bad:
        raise SystemExit(
            f"{path}: {len(bad)} line(s) did not parse as a catalog entry:\n"
            + "\n".join(f"  {n}: {t}" for n, t in bad[:10])
        )
    return out


HANGUL = re.compile(r"[가-힣]")


def translated(cats: dict, base: dict, loc: str, key: str) -> bool:
    """Whether `loc` really translated `key`.

    Equal-to-Korean normally means untranslated, but "Lv.3", "???" and "NOW" are
    correctly identical everywhere; counting those as gaps would hold every locale
    under 100% forever. So sameness is only a gap when the Korean had Hangul in it.
    """
    v = cats[loc].get(key)
    if v in (None, ""):
        return False
    return v != base[key] or not HANGUL.search(base[key] or "")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("-o", "--out", default=str(ROOT / "scripts" / "out" / "i18n-matrix.html"))
    args = ap.parse_args()

    cats = {loc: parse(loc) for loc in LOCALES}
    base = cats["ko"]
    keys = list(base.keys())  # authoring order — related keys stay adjacent

    # Group by the key's first segment so the table reads in sections.
    groups: dict[str, list[str]] = {}
    for k in keys:
        groups.setdefault(k.split(".")[0], []).append(k)

    stats = {}
    for loc in LOCALES:
        done = len(keys) if loc == "ko" else sum(1 for k in keys if translated(cats, base, loc, k))
        stats[loc] = {"done": done, "total": len(keys)}

    data = {"locales": LOCALES, "names": LOCALE_NAMES, "keys": keys,
            "groups": {g: ks for g, ks in groups.items()},
            "cats": cats, "stats": stats}

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page(data), encoding="utf-8")
    print(f"{out}  ·  {len(keys)} keys × {len(LOCALES)} locales")
    for loc in LOCALES:
        s = stats[loc]
        print(f"  {loc}  {s['done']:>4}/{s['total']}  {100 * s['done'] // max(1, s['total']):>3}%")


def page(d: dict) -> str:
    payload = html.escape(json.dumps(d, ensure_ascii=False), quote=True)
    return TEMPLATE.replace("__DATA__", payload)


TEMPLATE = r"""<title>forin 번역표</title>
<style>
  :root {
    --ink: #1F1B16; --paper: #F5EFE3; --cream: #FBF6EA; --line: #1F1B16;
    --soft: #6B6255; --faint: #A39B8C; --mint: #BFE3C6; --yellow: #F4D98A;
    --red: #F3C0BC; --white: #fff;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --ink: #F2EDE3; --paper: #171512; --cream: #1F1C17; --line: #4A443A;
      --soft: #A79E8F; --faint: #6E665A; --mint: #2C4A34; --yellow: #5A4A1E;
      --red: #4E2B28; --white: #232019;
    }
  }
  :root[data-theme="dark"] {
    --ink: #F2EDE3; --paper: #171512; --cream: #1F1C17; --line: #4A443A;
    --soft: #A79E8F; --faint: #6E665A; --mint: #2C4A34; --yellow: #5A4A1E;
    --red: #4E2B28; --white: #232019;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--paper); color: var(--ink);
    font: 14px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  header {
    position: sticky; top: 0; z-index: 3; background: var(--cream);
    border-bottom: 3px solid var(--line); padding: 14px 16px;
  }
  h1 { margin: 0 0 8px; font-size: 17px; letter-spacing: .02em; }
  .bars { display: flex; flex-wrap: wrap; gap: 10px; }
  .bar { display: flex; align-items: center; gap: 6px; font-size: 12px; font-variant-numeric: tabular-nums; }
  .track { width: 90px; height: 9px; border: 2px solid var(--line); background: var(--white); position: relative; }
  .fill { position: absolute; inset: 0 auto 0 0; background: var(--ink); }
  .tools { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  input[type=search], button {
    font: inherit; color: var(--ink); background: var(--white);
    border: 2px solid var(--line); padding: 5px 9px;
  }
  button { cursor: pointer; }
  button:hover { background: var(--yellow); }
  :focus-visible { outline: 3px solid var(--yellow); outline-offset: 2px; }
  label.chk { display: flex; align-items: center; gap: 5px; font-size: 12px; }
  .wrap { overflow-x: auto; padding: 0 16px 60px; }
  table { border-collapse: collapse; width: 100%; min-width: 900px; }
  th, td { border: 1.5px solid var(--line); padding: 5px 7px; vertical-align: top; text-align: left; }
  thead th { position: sticky; top: 0; background: var(--cream); font-size: 12px; z-index: 2; }
  tbody th.key {
    font-weight: normal; font-size: 11.5px; color: var(--soft);
    white-space: nowrap; background: var(--cream); width: 1%;
  }
  tr.group th { background: var(--ink); color: var(--paper); font-size: 12px; letter-spacing: .06em; }
  td[contenteditable] { min-width: 190px; background: var(--white); }
  td[contenteditable]:focus { outline: 3px solid var(--yellow); outline-offset: -3px; }
  td.missing { background: var(--red); }
  /* Colour alone would be the only signal for anyone who cannot separate the red
     from the yellow, and this table is read for exactly that distinction. */
  td.missing::after { content: '비어 있음'; color: var(--soft); font-size: 11px; }
  td.same::after { content: ' · 한국어와 같음'; color: var(--soft); font-size: 11px; }
  td.same { background: var(--yellow); }
  td.dirty { box-shadow: inset 0 0 0 3px var(--ink); }
  #count { font-size: 12px; color: var(--soft); align-self: center; font-variant-numeric: tabular-nums; }
  .note { margin: 12px 16px; padding: 10px 12px; border: 2px dashed var(--line); font-size: 12px; color: var(--soft); max-width: 70ch; }
  footer { padding: 0 16px 40px; font-size: 12px; color: var(--soft); }
</style>

<header>
  <h1>forin 번역표</h1>
  <div class="bars" id="bars"></div>
  <div class="tools">
    <input type="search" id="q" placeholder="키 또는 문장 검색" />
    <label class="chk"><input type="checkbox" id="onlyGaps" /> 빈 칸만</label>
    <button id="export">고친 것 내보내기</button>
    <button id="reset">고친 것 버리기</button>
    <span id="count"></span>
  </div>
</header>

<p class="note">
  칸을 눌러 바로 고칠 수 있어요. 고친 내용은 이 브라우저에만 남습니다 —
  <b>고친 것 내보내기</b>를 누르면 <code>en.ts</code> 같은 카탈로그 파일이 내려오고, 그 파일을 커밋하면 앱에 들어갑니다.
  붉은 칸은 번역이 없는 것, 노란 칸은 한국어와 똑같아서 아직 번역으로 세지 않는 것입니다.
</p>

<div class="wrap"><table id="t"><thead></thead><tbody></tbody></table></div>
<footer id="foot"></footer>

<script id="payload" type="application/json">__DATA__</script>
<script>
const D = JSON.parse(document.getElementById('payload').textContent);
const LS = 'forin.i18n.edits';
let edits = {};
try { edits = JSON.parse(localStorage.getItem(LS) || '{}'); } catch { edits = {}; }

const valueOf = (loc, key) => (edits[loc]?.[key] ?? D.cats[loc][key] ?? '');
const isMissing = (loc, key) => loc !== 'ko' && valueOf(loc, key) === '';
// Same rule as the app's isTranslated: identical-to-Korean is only a gap when the
// Korean string had Hangul in it ("Lv.3" and "NOW" are meant to be identical).
const HANGUL = /[\uAC00-\uD7A3]/;
const isSame = (loc, key) => loc !== 'ko' && valueOf(loc, key) !== ''
  && valueOf(loc, key) === D.cats.ko[key] && HANGUL.test(D.cats.ko[key] || '');

function stats(loc) {
  if (loc === 'ko') return { done: D.keys.length, total: D.keys.length };
  let done = 0;
  for (const k of D.keys) if (!isMissing(loc, k) && !isSame(loc, k)) done++;
  return { done, total: D.keys.length };
}

function drawBars() {
  document.getElementById('bars').innerHTML = D.locales.map((loc) => {
    const s = stats(loc), pct = Math.round((s.done / s.total) * 100);
    return `<span class="bar">${D.names[loc]}
      <span class="track"><span class="fill" style="width:${pct}%"></span></span>
      ${s.done}/${s.total} · ${pct}%</span>`;
  }).join('');
}

function drawHead() {
  document.querySelector('#t thead').innerHTML =
    '<tr><th>키</th>' + D.locales.map((l) => `<th>${D.names[l]} <span style="color:var(--faint)">${l}</span></th>`).join('') + '</tr>';
}

function drawBody() {
  const q = document.getElementById('q').value.trim().toLowerCase();
  const gapsOnly = document.getElementById('onlyGaps').checked;
  const rows = [];
  let shown = 0;
  for (const [group, keys] of Object.entries(D.groups)) {
    const visible = keys.filter((k) => {
      if (gapsOnly && !D.locales.some((l) => isMissing(l, k) || isSame(l, k))) return false;
      if (!q) return true;
      if (k.toLowerCase().includes(q)) return true;
      return D.locales.some((l) => valueOf(l, k).toLowerCase().includes(q));
    });
    if (!visible.length) continue;
    rows.push(`<tr class="group"><th colspan="${D.locales.length + 1}">${group}</th></tr>`);
    for (const k of visible) {
      shown++;
      const cells = D.locales.map((loc) => {
        const cls = [isMissing(loc, k) ? 'missing' : '', isSame(loc, k) ? 'same' : '',
                     edits[loc]?.[k] !== undefined ? 'dirty' : ''].filter(Boolean).join(' ');
        const v = valueOf(loc, k).replace(/&/g, '&amp;').replace(/</g, '&lt;');
        return `<td contenteditable="plaintext-only" class="${cls}" data-loc="${loc}" data-key="${k}">${v}</td>`;
      }).join('');
      rows.push(`<tr><th class="key">${k}</th>${cells}</tr>`);
    }
  }
  document.querySelector('#t tbody').innerHTML = rows.join('');
  document.getElementById('count').textContent = `${shown} / ${D.keys.length} 키`;
}

document.querySelector('#t tbody').addEventListener('blur', (e) => {
  const td = e.target.closest('td[contenteditable]');
  if (!td) return;
  const { loc, key } = td.dataset;
  const next = td.textContent;
  if (next === (D.cats[loc][key] ?? '')) {
    if (edits[loc]) delete edits[loc][key];
  } else {
    (edits[loc] ||= {})[key] = next;
  }
  localStorage.setItem(LS, JSON.stringify(edits));
  drawBars(); drawBody();
}, true);

// Export writes a whole catalog file, not a patch: the app imports these modules
// directly, so a partial diff would be one more thing to assemble by hand.
function esc(s) { return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n'); }
document.getElementById('export').onclick = () => {
  const touched = D.locales.filter((l) => edits[l] && Object.keys(edits[l]).length);
  if (!touched.length) { alert('고친 칸이 없어요.'); return; }
  for (const loc of touched) {
    const lines = D.keys
      .filter((k) => valueOf(loc, k) !== '')
      .map((k) => `  '${esc(k)}': '${esc(valueOf(loc, k))}',`);
    const body = `// ${D.names[loc]} — generated from the translation matrix.\n`
      + `// Keys absent here fall back to Korean and count as untranslated.\n`
      + `export const ${loc}: Record<string, string> = {\n${lines.join('\n')}\n};\n`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
    a.download = `${loc}.ts`;
    a.click();
  }
};
document.getElementById('reset').onclick = () => {
  if (!confirm('이 브라우저에 저장된 수정을 모두 버릴까요?')) return;
  edits = {}; localStorage.removeItem(LS); drawBars(); drawBody();
};
document.getElementById('q').oninput = drawBody;
document.getElementById('onlyGaps').onchange = drawBody;

document.getElementById('foot').textContent =
  `mobile/scripts/i18n-matrix.py 로 생성 · 키 ${D.keys.length}개 · 로케일 ${D.locales.length}개`;
drawBars(); drawHead(); drawBody();
</script>
"""

if __name__ == "__main__":
    main()
