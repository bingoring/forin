#!/usr/bin/env python3
"""상황 지도 생성기 — 한 부서의 themes.yaml + topics/<dept>.yaml을 단일 HTML로 그린다.

임상 검수용 읽기 도구다. 콘텐츠의 정본은 YAML이고 이 HTML은 파생물이므로, YAML을 고친 뒤
다시 돌려 덮어쓴다.

    python3 server/content/tools/situation_map.py ER \
        -o docs/dlc/projects/forin/02-construction/departments/er/situation-map.html

주제 → 난이도 계단(Lv1/2/3) → 상황 순으로 접히며, 검색과 응급도 필터가 붙는다.
"""
from __future__ import annotations

import argparse
import collections
import html
import json
import pathlib
import sys

try:
    import yaml
except ImportError:  # pragma: no cover - 실행 환경 안내
    sys.exit("PyYAML이 필요합니다: pip3 install pyyaml")

ROOT = pathlib.Path(__file__).resolve().parents[1]  # server/content

# 부서별 영역 묶음. 주제를 임상 영역으로 모아 보여 주기 위한 읽기용 분류이며, 런타임은 쓰지 않는다.
# 여기에 없는 주제는 '기타'로 모이고, core-* 주제는 자동으로 공통 코어가 된다.
DOMAINS: dict[str, list[tuple[str, list[str]]]] = {
    "ER": [
        ("심혈관·순환", ["er-chestpain", "er-arrhythmia", "er-arrest", "er-shock"]),
        ("호흡·기도", ["er-dyspnea", "er-asthma-copd"]),
        ("신경", ["er-stroke", "er-seizure-loc"]),
        ("외상", ["er-polytrauma", "er-head-trauma", "er-chest-abd-trauma",
                  "er-ortho-trauma", "er-burn", "er-bleeding-wound"]),
        ("소화·비뇨·대사", ["er-abdominal", "er-gi-bleed", "er-genitourinary", "er-diabetic"]),
        ("중독·환경·알레르기", ["er-poisoning", "er-anaphylaxis", "er-environmental",
                                "er-alcohol-withdrawal"]),
        ("감염", ["er-fever-infection", "er-sepsis"]),
        ("정신·행동", ["er-psych", "er-deescalation"]),
        ("특수 집단", ["er-peds", "er-geriatric", "er-obgyn"]),
        ("처치·시스템", ["er-pain-sedation", "er-procedures"]),
    ],
}

CORE_DOMAIN = "공통 코어 (부서 맥락)"
TARGET_PER_THEME = 21  # D-P2-B 목표치. 벗어난 주제는 지도에 표시된다.


def load(dept: str) -> tuple[list[dict], list[dict], str]:
    """직업군 디렉터리를 훑어 부서 코드가 사는 곳을 찾고, 주제와 상황을 읽어 온다."""
    for prof_dir in sorted(p for p in ROOT.iterdir() if p.is_dir()):
        themes_path = prof_dir / "themes.yaml"
        if not themes_path.exists():
            continue
        themes = [t for t in yaml.safe_load(themes_path.read_text()) or []
                  if t.get("dept") == dept]
        if not themes:
            continue
        topic_path = prof_dir / "topics" / f"{dept.lower()}.yaml"
        if not topic_path.exists():
            sys.exit(f"주제는 찾았으나 상황 파일이 없습니다: {topic_path}")
        seeds = yaml.safe_load(topic_path.read_text()) or []
        return themes, seeds, prof_dir.name
    sys.exit(f"부서 코드 {dept}를 가진 주제를 어느 직업군에서도 찾지 못했습니다.")


def group(dept: str, themes: list[dict], seeds: list[dict]) -> list[dict]:
    """주제를 임상 영역으로 묶고, 각 주제 안의 상황을 난이도 계단으로 나눈다."""
    by_theme: dict[str, list[dict]] = collections.defaultdict(list)
    for s in seeds:
        by_theme[s.get("theme", "")].append(s)

    themes_by_key = {t["key"]: t for t in themes}
    assigned: set[str] = set()
    out: list[dict] = []

    def theme_entry(t: dict) -> dict:
        sits = by_theme.get(t["key"], [])
        tiers: dict[str, list[dict]] = {"1": [], "2": [], "3": []}
        for s in sits:
            tiers.setdefault(str(s.get("difficulty", 1)), []).append({
                "t": s.get("title", ""),
                "b": s.get("brief", ""),
                "g": s.get("tagline", ""),
                "a": s.get("acuity", ""),
                "r": s.get("role", ""),
                "m": s.get("room", ""),
                "sk": s.get("skills", []) or [],
                "go": s.get("goals", []) or [],
                "kp": s.get("keyPhrases", []) or [],
                "p": s.get("persona", {}) or {},
            })
        return {
            "k": t["key"],
            "n": t.get("name", t["key"]),
            "t": t.get("track", "depth"),
            "o": t.get("order", 0),
            "s": tiers,
        }

    for domain, keys in DOMAINS.get(dept, []):
        entries = [theme_entry(themes_by_key[k]) for k in keys if k in themes_by_key]
        assigned.update(k for k in keys if k in themes_by_key)
        if entries:
            out.append({"domain": domain, "themes": entries})

    cores = [t for t in themes if t.get("track") == "core" and t["key"] not in assigned]
    rest = [t for t in themes
            if t.get("track") != "core" and t["key"] not in assigned]
    if rest:
        out.append({"domain": "기타",
                    "themes": [theme_entry(t) for t in sorted(rest, key=lambda x: x.get("order", 0))]})
    if cores:
        out.append({"domain": CORE_DOMAIN,
                    "themes": [theme_entry(t) for t in sorted(cores, key=lambda x: x.get("order", 0))]})
    return out


def render(dept: str, prof: str, data: list[dict], seeds: list[dict]) -> str:
    acuity = collections.Counter(s.get("acuity", "") for s in seeds)
    subtitle = {"ER": "응급의료센터(ER)"}.get(dept, dept)
    payload = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    return TEMPLATE.replace("__TITLE__", html.escape(f"{dept} 상황 지도")) \
                   .replace("__HEADING__", html.escape(f"{subtitle} 상황 지도")) \
                   .replace("__PROF__", html.escape(prof)) \
                   .replace("__TARGET__", str(TARGET_PER_THEME)) \
                   .replace("__ROUTINE__", str(acuity.get("routine", 0))) \
                   .replace("__URGENT__", str(acuity.get("urgent", 0))) \
                   .replace("__CRITICAL__", str(acuity.get("critical", 0))) \
                   .replace("__DATA__", payload)


TEMPLATE = r"""<!doctype html>
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
  :root{
    --bg:#f4f6f7; --paper:#ffffff; --ink:#1c2b30; --soft:#6b7c82; --line:#e2e8ea;
    --accent:#0e7c86; --accent-soft:#e6f2f3;
    --lv1:#3f8f6b; --lv1bg:#eaf5ef; --lv2:#b9812e; --lv2bg:#f8f0e0; --lv3:#c1483f; --lv3bg:#f8e9e7;
    --core:#5a6bb0; --corebg:#eceffa; --warn:#b4531f; --warnbg:#fbeee4;
    --body:'Gowun Dodum', system-ui, -apple-system, 'Apple SD Gothic Neo', sans-serif;
    --mono:'IBM Plex Mono', ui-monospace, monospace;
  }
  @media (prefers-color-scheme: dark){
    :root:not([data-theme="light"]){
      --bg:#12191b; --paper:#1a2427; --ink:#e6edee; --soft:#93a3a8; --line:#2b393d;
      --accent:#4bb3bd; --accent-soft:#153035;
      --lv1:#6fc79a; --lv1bg:#16281f; --lv2:#d9ab5e; --lv2bg:#2a2213; --lv3:#e07a70; --lv3bg:#2c1815;
      --core:#8f9ede; --corebg:#1a2033; --warn:#e0925e; --warnbg:#2e2015;
    }
  }
  :root[data-theme="dark"]{
    --bg:#12191b; --paper:#1a2427; --ink:#e6edee; --soft:#93a3a8; --line:#2b393d;
    --accent:#4bb3bd; --accent-soft:#153035;
    --lv1:#6fc79a; --lv1bg:#16281f; --lv2:#d9ab5e; --lv2bg:#2a2213; --lv3:#e07a70; --lv3bg:#2c1815;
    --core:#8f9ede; --corebg:#1a2033; --warn:#e0925e; --warnbg:#2e2015;
  }
  *{box-sizing:border-box}
  body{margin:0; background:var(--bg); color:var(--ink); font-family:var(--body); line-height:1.6;
       -webkit-font-smoothing:antialiased;}
  .wrap{max-width:1000px; margin:0 auto; padding:0 16px 80px;}
  header.top{position:sticky; top:0; z-index:10; background:var(--bg);
             border-bottom:1px solid var(--line); padding:14px 0 10px;}
  .eyebrow{font-family:var(--mono); font-size:11px; letter-spacing:.14em; text-transform:uppercase; color:var(--accent);}
  h1{font-size:23px; margin:4px 0 0; letter-spacing:-.01em;}
  .totals{display:flex; gap:16px; margin-top:8px; flex-wrap:wrap; font-size:13px; color:var(--soft);}
  .totals b{color:var(--ink); font-family:var(--mono); font-size:15px;}
  .search{margin-top:10px; width:100%; padding:9px 12px; border:1px solid var(--line); border-radius:8px;
          background:var(--paper); color:var(--ink); font-family:var(--body); font-size:14px;}
  .search:focus{outline:2px solid var(--accent); outline-offset:1px; border-color:transparent;}
  .filters{display:flex; flex-wrap:wrap; gap:6px; margin-top:9px; align-items:center;}
  .filters button{font-family:var(--mono); font-size:11px; padding:3px 10px; border-radius:20px; cursor:pointer;
                  border:1px solid var(--line); background:var(--paper); color:var(--soft);}
  .filters button[aria-pressed="true"]{border-color:var(--accent); color:var(--accent); background:var(--accent-soft);}
  .nav{display:flex; flex-wrap:wrap; gap:5px; margin-top:9px;}
  .nav a{font-size:12px; color:var(--soft); text-decoration:none; padding:3px 9px; border:1px solid var(--line);
         border-radius:20px; background:var(--paper);}
  .nav a:hover{color:var(--accent); border-color:var(--accent);}
  .lede{color:var(--soft); font-size:14px; margin:16px 0 20px; max-width:70ch;}
  .domain{margin-top:28px;}
  .domain-h{display:flex; align-items:baseline; gap:10px; border-bottom:2px solid var(--ink);
            padding-bottom:6px; margin-bottom:12px;}
  .domain-h h2{font-size:18px; margin:0;}
  .domain-h .cnt{font-family:var(--mono); font-size:12px; color:var(--soft);}
  .theme{background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:14px 16px;
         margin-bottom:12px; box-shadow:0 1px 2px rgba(0,0,0,.03);}
  .theme-h{display:flex; align-items:center; gap:9px; flex-wrap:wrap; cursor:pointer;}
  .theme-h h3{font-size:16.5px; margin:0;}
  .key{font-family:var(--mono); font-size:11px; color:var(--soft);}
  .badge{font-family:var(--mono); font-size:10px; padding:2px 7px; border-radius:4px; letter-spacing:.03em;}
  .badge.depth{color:var(--accent); background:var(--accent-soft);}
  .badge.core{color:var(--core); background:var(--corebg);}
  .badge.collab{color:var(--lv2); background:var(--lv2bg);}
  .badge.off{color:var(--warn); background:var(--warnbg);}
  .n{margin-left:auto; font-family:var(--mono); font-size:12px; color:var(--soft);}
  .chev{color:var(--soft); font-size:12px; transition:transform .15s;}
  .theme.collapsed .chev{transform:rotate(-90deg);}
  .theme.collapsed .body{display:none;}
  .tier{margin-top:12px;}
  .tier-label{display:inline-block; font-family:var(--mono); font-size:10px; letter-spacing:.06em;
              padding:1px 8px; border-radius:4px; margin-bottom:5px;}
  .tier1 .tier-label{color:var(--lv1); background:var(--lv1bg);}
  .tier2 .tier-label{color:var(--lv2); background:var(--lv2bg);}
  .tier3 .tier-label{color:var(--lv3); background:var(--lv3bg);}
  ul.sits{list-style:none; margin:0; padding:0;}
  ul.sits li{padding:7px 0 7px 15px; position:relative; border-bottom:1px dashed var(--line); cursor:pointer;}
  ul.sits li:last-child{border-bottom:0;}
  ul.sits li::before{content:""; position:absolute; left:2px; top:15px; width:5px; height:5px; border-radius:50%;}
  .tier1 ul.sits li::before{background:var(--lv1);}
  .tier2 ul.sits li::before{background:var(--lv2);}
  .tier3 ul.sits li::before{background:var(--lv3);}
  .sit-top{display:flex; align-items:center; gap:7px; flex-wrap:wrap;}
  .sit-name{font-weight:600; font-size:14.5px;}
  .chip{font-family:var(--mono); font-size:9.5px; padding:1px 6px; border-radius:4px; letter-spacing:.04em;}
  .ac-routine{color:var(--lv1); background:var(--lv1bg);}
  .ac-urgent{color:var(--lv2); background:var(--lv2bg);}
  .ac-critical{color:var(--lv3); background:var(--lv3bg);}
  .chip.role{color:var(--soft); background:var(--bg); border:1px solid var(--line);}
  .room{font-family:var(--mono); font-size:10px; color:var(--soft); margin-left:auto;}
  .sit-focus{color:var(--soft); font-size:13.5px; margin-top:2px;}
  .sit-line{font-family:var(--mono); font-size:12px; color:var(--accent); margin-top:3px;}
  .detail{display:none; margin-top:8px; padding:10px 12px; border-radius:8px; background:var(--bg);
          border:1px solid var(--line); font-size:13px;}
  li.open .detail{display:block;}
  .detail dl{margin:0; display:grid; grid-template-columns:auto 1fr; gap:4px 12px;}
  .detail dt{font-family:var(--mono); font-size:10px; color:var(--soft); letter-spacing:.05em; padding-top:3px;}
  .detail dd{margin:0;}
  .detail ul{margin:0; padding-left:16px;}
  .detail .en{font-family:var(--mono); font-size:12px;}
  .hidden{display:none!important;}
  .nores{color:var(--soft); font-size:14px; padding:20px 0;}
  footer{margin-top:40px; padding-top:16px; border-top:1px solid var(--line); color:var(--soft); font-size:13px;}
  @media (max-width:560px){
    .room{margin-left:0;}
    .detail dl{grid-template-columns:1fr; gap:2px;}
  }
</style></head><body>
<header class="top"><div class="wrap">
  <div class="eyebrow">forin · 커리큘럼 v3 · __PROF__ · 콘텐츠 검수</div>
  <h1>__HEADING__</h1>
  <div class="totals">
    <span><b id="tThemes">0</b> 주제</span>
    <span><b id="tSits">0</b> 상황</span>
    <span><b id="tDepth">0</b> 심화 · <b id="tCore">0</b> 코어</span>
    <span>응급도 <b>__ROUTINE__</b> routine · <b>__URGENT__</b> urgent · <b>__CRITICAL__</b> critical</span>
  </div>
  <input id="q" class="search" placeholder="상황 검색 (제목·설명·영어 대사·역할·구역)">
  <div class="filters">
    <button data-ac="" aria-pressed="true">전체</button>
    <button data-ac="routine" aria-pressed="false">routine</button>
    <button data-ac="urgent" aria-pressed="false">urgent</button>
    <button data-ac="critical" aria-pressed="false">critical</button>
    <button id="expand" aria-pressed="false">모두 펼치기</button>
  </div>
  <nav class="nav" id="nav"></nav>
</div></header>
<div class="wrap">
  <p class="lede">한 주제는 서로 구별되는 상황들이 난이도 순으로 이어진 경로입니다. 계단은
    <b style="color:var(--lv1)">Lv1 기초</b> · <b style="color:var(--lv2)">Lv2 응용</b> ·
    <b style="color:var(--lv3)">Lv3 위기</b>이고, 주제당 목표치는 __TARGET__개입니다. 상황을 누르면
    학습 목표와 핵심 문장, 페르소나가 펼쳐집니다.</p>
  <div id="root"></div>
  <div id="nores" class="nores hidden">검색 결과가 없습니다.</div>
  <footer>이 페이지는 <code>server/content/&lt;직업군&gt;/topics/</code>의 YAML에서 생성됩니다. 내용을
    고칠 곳은 YAML이며, 고친 뒤 <code>server/content/tools/situation_map.py</code>를 다시 돌려 덮어씁니다.</footer>
</div>
<script>
const DATA = __DATA__;
const TARGET = __TARGET__;
const TIER = {1:'Lv1 기초', 2:'Lv2 응용', 3:'Lv3 위기'};
const TRACK = {core:'부서 코어', depth:'부서 심화', collab:'타 부서 접점'};
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

function personaLine(p){
  if(!p || !p.name) return '';
  const bits = [p.name, p.ageRange, p.sub, p.mood, p.personality, p.speakingStyle].filter(Boolean);
  return bits.join(' · ');
}

function sitHTML(s){
  const txt = [s.t, s.b, s.g, s.r, s.m, personaLine(s.p), (s.sk||[]).join(' '), (s.go||[]).join(' '),
               (s.kp||[]).join(' ')].join(' ').toLowerCase();
  const rows = [];
  if(s.sk && s.sk.length) rows.push(`<dt>기술</dt><dd>${esc(s.sk.join(' · '))}</dd>`);
  if(s.go && s.go.length) rows.push(`<dt>목표</dt><dd><ul>${s.go.map(g=>`<li>${esc(g)}</li>`).join('')}</ul></dd>`);
  if(s.kp && s.kp.length) rows.push(`<dt>핵심 문장</dt><dd><ul class="en">${s.kp.map(k=>`<li>${esc(k)}</li>`).join('')}</ul></dd>`);
  const pl = personaLine(s.p);
  if(pl) rows.push(`<dt>페르소나</dt><dd>${esc(pl)}</dd>`);
  return `<li data-txt="${esc(txt)}" data-ac="${esc(s.a)}">
    <div class="sit-top"><span class="sit-name">${esc(s.t)}</span>`+
    (s.a?`<span class="chip ac-${esc(s.a)}">${esc(s.a)}</span>`:'')+
    (s.r?`<span class="chip role">${esc(s.r)}</span>`:'')+
    (s.m?`<span class="room">${esc(s.m)}</span>`:'')+
    `</div>`+
    (s.b?`<div class="sit-focus">${esc(s.b)}</div>`:'')+
    (s.g?`<div class="sit-line">${esc(s.g)}</div>`:'')+
    (rows.length?`<div class="detail"><dl>${rows.join('')}</dl></div>`:'')+
  `</li>`;
}

const root = document.getElementById('root'), nav = document.getElementById('nav');
let themeCount=0, sitCount=0, depthCount=0, coreCount=0;

DATA.forEach((dom, di) => {
  const domSits = dom.themes.reduce((a,t)=>a+[1,2,3].reduce((b,l)=>b+(t.s[l]?t.s[l].length:0),0),0);
  const sec = document.createElement('section');
  sec.className='domain'; sec.id='dom'+di;
  sec.innerHTML = `<div class="domain-h"><h2>${esc(dom.domain)}</h2>`+
    `<span class="cnt">${dom.themes.length}주제 · ${domSits}상황</span></div>`;
  const a=document.createElement('a'); a.href='#dom'+di; a.textContent=dom.domain; nav.appendChild(a);

  dom.themes.forEach(t => {
    themeCount++;
    const tSits=[1,2,3].reduce((b,l)=>b+(t.s[l]?t.s[l].length:0),0);
    sitCount+=tSits;
    if(t.t==='core') coreCount++; else depthCount++;
    const card=document.createElement('div');
    card.className='theme collapsed'; card.dataset.name=t.n+' '+t.k;
    let body='';
    [1,2,3].forEach(l => {
      const list = t.s[l];
      if(!list || !list.length) return;
      body += `<div class="tier tier${l}"><span class="tier-label">${TIER[l]} · ${list.length}</span>`+
              `<ul class="sits">${list.map(sitHTML).join('')}</ul></div>`;
    });
    const off = tSits===TARGET ? '' : `<span class="badge off">목표 ${TARGET}</span>`;
    card.innerHTML = `<div class="theme-h"><h3>${esc(t.n)}</h3><span class="key">${esc(t.k)}</span>`+
      `<span class="badge ${esc(t.t)}">${TRACK[t.t]||esc(t.t)}</span>${off}`+
      `<span class="n">${tSits}</span><span class="chev">▾</span></div><div class="body">${body}</div>`;
    card.querySelector('.theme-h').addEventListener('click', ()=>card.classList.toggle('collapsed'));
    card.querySelectorAll('ul.sits li').forEach(li =>
      li.addEventListener('click', e => { e.stopPropagation(); li.classList.toggle('open'); }));
    sec.appendChild(card);
  });
  root.appendChild(sec);
});

document.getElementById('tThemes').textContent=themeCount;
document.getElementById('tSits').textContent=sitCount;
document.getElementById('tDepth').textContent=depthCount;
document.getElementById('tCore').textContent=coreCount;

const q=document.getElementById('q'), nores=document.getElementById('nores');
let acuity='';

function apply(){
  const term=q.value.trim().toLowerCase();
  let anyShown=false;
  document.querySelectorAll('.domain').forEach(sec=>{
    let secShown=false;
    sec.querySelectorAll('.theme').forEach(card=>{
      const nameHit = !term || card.dataset.name.toLowerCase().includes(term);
      let hit=false;
      card.querySelectorAll('ul.sits li').forEach(li=>{
        const m = (nameHit || li.dataset.txt.includes(term)) &&
                  (!acuity || li.dataset.ac===acuity);
        li.classList.toggle('hidden', !m); if(m) hit=true;
      });
      card.querySelectorAll('.tier').forEach(tier=>{
        const any=[...tier.querySelectorAll('li')].some(li=>!li.classList.contains('hidden'));
        tier.classList.toggle('hidden', !any);
      });
      card.classList.toggle('hidden', !hit);
      if(hit){ if(term||acuity) card.classList.remove('collapsed'); secShown=true; }
    });
    sec.classList.toggle('hidden', !secShown);
    if(secShown) anyShown=true;
  });
  nores.classList.toggle('hidden', anyShown);
}

q.addEventListener('input', apply);
document.querySelectorAll('.filters button[data-ac]').forEach(b=>{
  b.addEventListener('click', ()=>{
    acuity = b.dataset.ac;
    document.querySelectorAll('.filters button[data-ac]').forEach(o=>
      o.setAttribute('aria-pressed', String(o===b)));
    apply();
  });
});
const expand=document.getElementById('expand');
expand.addEventListener('click', ()=>{
  const on = expand.getAttribute('aria-pressed')!=='true';
  expand.setAttribute('aria-pressed', String(on));
  expand.textContent = on ? '모두 접기' : '모두 펼치기';
  document.querySelectorAll('.theme').forEach(c=>c.classList.toggle('collapsed', !on));
});
</script></body></html>
"""


def main() -> None:
    ap = argparse.ArgumentParser(description="부서 상황 지도를 HTML로 생성합니다.")
    ap.add_argument("dept", help="부서 코드 (예: ER, ICU, WARD)")
    ap.add_argument("-o", "--out", required=True, help="출력 HTML 경로")
    args = ap.parse_args()

    dept = args.dept.upper()
    themes, seeds, prof = load(dept)
    data = group(dept, themes, seeds)

    covered = {t["k"] for d in data for t in d["themes"]}
    missing = [t["key"] for t in themes if t["key"] not in covered]
    if missing:
        sys.exit(f"분류되지 않은 주제가 있습니다: {missing}")

    out = pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(render(dept, prof, data, seeds))
    print(f"{out} — {len(themes)}주제 · {len(seeds)}상황 ({prof})")


if __name__ == "__main__":
    main()
