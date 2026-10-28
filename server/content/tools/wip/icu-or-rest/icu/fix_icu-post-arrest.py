#!/usr/bin/env python3
"""icu-post-arrest 검토 A·B(+Fable 판정 A·B) 반영. icu-post-arrest.pre-fix.yaml(+changes-…pre-fix.yaml)을 읽어
icu-post-arrest.yaml / changes-icu-post-arrest.yaml 을 다시 만든다. 다시 돌려도 같은 결과."""
import copy, os, re
import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
def P(n): return os.path.join(HERE, n)
def load(n): return yaml.safe_load(open(P(n), encoding='utf-8'))

doc = load('icu-post-arrest.pre-fix.yaml')
pre = copy.deepcopy(doc)
chg_doc = load('changes-icu-post-arrest.pre-fix.yaml')
W = {w['id']: w for w in doc['words']}
SIT = doc['situations']
SEEDS = yaml.safe_load(open(os.path.join(HERE, '..', '..', '..', '..', 'nurse', 'topics', 'icu.yaml'), encoding='utf-8'))
KEY = {s['title']: set(s.get('keyPhrases') or []) for s in SEEDS if s['theme'] == 'icu-post-arrest'}

# ---------- 문장 ----------
SENT_FIELDS = ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy')
for n in (1, 2, 3):
    for e in load(f'fix_icu-post-arrest_data_{n}.yaml')['sent']:
        sit = SIT[e['s']]
        x = sit['sentences'][e['i']]
        if x['en'] in KEY[sit['title']]:
            assert e.get('en', x['en']) == x['en'] and e.get('chunks', x['chunks']) == x['chunks'], ('keyPhrase', e)
        for k in SENT_FIELDS:
            if k in e:
                x[k] = e[k]
        if 'd1' in e:
            x['distractorsKo'][0] = e['d1']
        if 'd2' in e:
            x['distractorsKo'][1] = e['d2']
        if 'blank' in e:
            b = e['blank']
            assert b['answer'] in b['options'] and len(set(b['options'])) == 4, e
            x['blank'] = {'answer': b['answer'], 'options': [{'en': o} for o in b['options']]}

# ---------- 단어 ----------
d4 = load('fix_icu-post-arrest_data_4.yaml')
for wid, setv in d4['words'].items():
    W[wid].update(setv)

# distractorsEn 품사 표 — A 검토 표(우선) + Fable 판정 표(A에 없는 단어만)
def parse_alts(s):
    s = s.strip().lstrip('→').strip()
    s = s.strip('[]')
    return [t.strip() for t in s.split(',') if t.strip()]
rows = {}
txtA = open(P('fix-icu-post-arrest-A.md'), encoding='utf-8').read()
for wid, ans, off, alt in re.findall(r"^    \| (w-[\w-]+) \| (.*?) \| (.*?) \| (.*?) \|$", txtA, re.M):
    alts = parse_alts(alt)
    if not all(re.fullmatch(r"[a-z\- ]+", a) for a in alts):
        continue
    offs = [t.strip().split('(')[0].strip() for t in off.split(',')]
    rows[wid] = (offs, alts)
txtJ = open(P('judge-icu-post-arrest-A.md'), encoding='utf-8').read()
for wid, ans, off, alt in re.findall(r"^\| (w-[\w-]+) \| (.*?) \| (.*?) \| → (.*?) \|$", txtJ, re.M):
    if wid in rows:
        continue
    alts = parse_alts(alt)
    offs = [re.sub(r"\(.*?\)", "", t).strip() for t in off.split(',')]
    rows[wid] = (offs, alts)
for wid, (offs, alts) in rows.items():
    if wid not in W:
        continue
    cur = W[wid]['distractorsEn']
    for i, o in enumerate(offs):
        if o in cur and i < len(alts):
            cur[cur.index(o)] = alts[i]
        elif o not in cur:
            print('  [row mismatch]', wid, 'offender', o, 'not in', cur)
# Fable 표에서 A 표가 덮지 못한 나머지 오답(예: harm의 farm, trend의 tread, result의 reset)
for wid, ans, off, alt in re.findall(r"^\| (w-[\w-]+) \| (.*?) \| (.*?) \| → (.*?) \|$", txtJ, re.M):
    if wid not in W:
        continue
    alts = parse_alts(alt)
    offs = [re.sub(r"\(.*?\)", "", t).strip() for t in off.split(',')]
    cur = W[wid]['distractorsEn']
    for o in offs:
        if o in cur:
            spare = [a for a in alts if a not in cur and a != W[wid]['en']]
            if spare:
                cur[cur.index(o)] = spare[0]
for wid, lst in d4['dEn_set'].items():
    W[wid]['distractorsEn'] = lst
removed = set(d4['word_remove'])
for wid in removed:
    del W[wid]
doc['words'] = [w for w in doc['words'] if w['id'] in W]
for sit in SIT:
    for s in sit['sentences']:
        for wid in s['words']:
            assert wid in W, (sit['title'], s['en'], wid)
    for n in sit['nuance']:
        for wid in n.get('words') or []:
            assert wid in W, (sit['title'], n['kind'], wid)

# 예문(example)·exKo 맞춤
old_en = {}
for si, s in enumerate(pre['situations']):
    for i, x in enumerate(s['sentences']):
        old_en.setdefault(x['en'], (si, i))
used = {}
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        for wid in x['words']:
            used.setdefault(wid, []).append((si, i))
for wid, w in W.items():
    if w['example'] not in old_en:
        continue
    si, i = old_en[w['example']]
    new = SIT[si]['sentences'][i]
    old = pre['situations'][si]['sentences'][i]
    if new['en'] != w['example']:
        if wid in new['words']:
            w['example'] = new['en']
        else:
            cands = [c for c in used.get(wid, []) if SIT[c[0]]['sentences'][c[1]]['en'] == pre['situations'][c[0]]['sentences'][c[1]]['en']]
            assert cands, wid
            new = SIT[cands[0][0]]['sentences'][cands[0][1]]
            w['example'] = new['en']
            print('  [example moved]', wid, '->', new['en'])
        w['exKo'] = new['ko']
    elif new['ko'] != old['ko'] and w['exKo'] == old['ko']:
        w['exKo'] = new['ko']

# ---------- 뉘앙스 ----------
for e in d4['nuance']:
    sit = SIT[e['s']]
    cands = [n for n in sit['nuance'] if n['kind'] == e['kind']]
    assert len(cands) == 1, (e['s'], e['kind'], len(cands))
    n = cands[0]
    n.update(e.get('set', {}))
    for idx, upd in (e.get('scene') or {}).items():
        n['scenes'][idx].update(upd)
    if 'addwhy' in e:
        n['why'] = n['why'] + e['addwhy']
# 슬라이더·swap의 예문 ko 맞춤(문장 ko만 바뀐 경우)
for si, s in enumerate(SIT):
    for n in s['nuance']:
        if n['kind'] == 'slider' and n.get('example') in old_en:
            a, b = old_en[n['example']]
            new = SIT[a]['sentences'][b]
            old = pre['situations'][a]['sentences'][b]
            if new['en'] == n['example'] and new['ko'] != old['ko'] and n.get('exKo') == old['ko']:
                n['exKo'] = new['ko']

# ---------- order ----------
for e in d4['order']:
    o = SIT[e['s']]['order']
    if 'why' in e:
        o['why'] = e['why']
    for idx, upd in (e.get('lines') or {}).items():
        o['lines'][idx].update(upd)

with open(P('icu-post-arrest.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=100000)

# ---------- changes-icu-post-arrest.yaml ----------
changes = copy.deepcopy(chg_doc['changes'])
V44_WORD = ('id', 'en', 'ipa', 'ko', 'icon', 'example')
V44_SENT = ('en', 'ko', 'chunks', 'words')
changes = [c for c in changes if not (c['kind'] == 'word' and c['id'] in removed)]
WHY_WORD = {
    'w-tight': "ko '단단히(팽팽하게)'는 tightly(체온을 좁은 범위로 엄격하게 유지)의 뜻이 아님 — '엄격하게(빈틈없이)'",
    'w-outcome': "ko '경과(결과)'의 '경과'는 진행 과정(course)이라 outcome의 뜻이 아님 — w-result '결과'와 갈리게 '최종 결과'",
    'w-control': "7.2 'can help control it'은 능동이라 ko '조절되다'가 어긋남 — '조절하다'",
    'w-meds': "ko '약들'이 어색함 — w-drug '약물'과 갈리게 '약(구어)'",
    'w-crash': "문장 16.0이 타동('crashing his pressure')이라 ko를 '무너뜨리다'로",
    'w-rearrest': "ko '재정지'(명사)인데 문장 5.2는 동사('he re-arrests') — '재정지되다'",
}
REPLACE_WHY = {'w-outcome', 'w-tight'}
def add_word_change(wid, fields, why):
    for c in changes:
        if c['kind'] == 'word' and c['id'] == wid:
            c['fields'] = sorted(set(c['fields']) | set(fields), key=V44_WORD.index)
            c['why'] = why if wid in REPLACE_WHY else c['why'] + ' / ' + why
            return
    changes.append({'kind': 'word', 'id': wid, 'fields': sorted(fields, key=V44_WORD.index), 'why': why})
pre_W = {w['id']: w for w in pre['words']}
for wid, w in W.items():
    diff = [k for k in V44_WORD if w.get(k) != pre_W[wid].get(k)]
    if diff:
        why = WHY_WORD.get(wid) or "이 단어를 예문으로 쓰던 문장을 바꾼 검토 반영에 맞춰 예문을 바꿈"
        add_word_change(wid, diff, why)
WHY_REMOVE = {
    'w-tomorrow': "너무 쉬움(today·morning과 같은 급) — 14.4·20.5에서 태그를 빼 어느 문장도 태그하지 않게 됨",
    'w-belong': "20.4를 '곁에 있겠다'는 말로 바꾸며(\"belongs to\" 삭제) 어느 문장도 태그하지 않게 됨",
}
for wid in removed:
    changes.append({'kind': 'word-remove', 'id': wid, 'why': WHY_REMOVE[wid]})
WHY_SENT = {
    (1, 1): "ko '전부 보내세요'는 틀림 — 'a full metabolic panel'은 종합 대사 패널(CMP)이라 '종합 대사 패널을 보내세요'로(en은 그대로)",
    (2, 5): "단위가 없어 화씨로 읽힐 수 있음 — 'Celsius'를 붙여 '섭씨 36도'로",
    (5, 4): "처방 없이 승압제를 올린 말로 읽힘(독단 적정) — 'titrated … per the order'로 처방 범위 안에서 올렸다고. w-titrate 태그를 더함",
    (6, 1): "ko '팽팽하게 안정적으로'는 tightly의 오역 — '좁은 범위에서 엄격하게'(en은 그대로)",
    (8, 3): "w-drip ko를 '지속주입(드립)'으로 가른 데 맞춰 문장 ko도 '지속주입 약'으로(en·chunks 불변)",
    (8, 5): "삽관 환자 이송 중 기도는 보통 호흡치료사(RT)가 맡고 간호사는 모니터·드립을 봄(업무범위)",
    (9, 3): "MAP 기준 60이 같은 상황의 목표(65 이상)와 어긋남 — 65로",
    (12, 3): "'flagged it'은 '(팀에) 알렸다'인데 ko가 '표시해 뒀어요'라 행동이 달라짐 — '바로 알렸어요'(en은 그대로)",
    (14, 4): "너무 쉬운 말(tomorrow, today·morning과 같은 급) 태그를 뺌 — 문장은 그대로",
    (18, 4): "18.1이 '회복 가능성이 낮다'고 말한 상황에서 '아직 모른다'는 같은 대화의 엇갈린 메시지 — 서두르지 않되 징후는 좋지 않다고",
    (18, 5): "'We're not giving up'은 연명 치료 계속으로 들려 치료 목표 대화와 어긋남 — '계속 돌본다'(버리지 않음)로",
    (18, 6): "의문문인데 끝이 '.'이었음 — '?'로",
    (20, 4): "'whatever you choose'는 지킬 수 없는 약속이고 20.1(그분이 원했을 것)과 어긋남 — '혼자 고르지 않아도 된다·곁에 있겠다'로",
    (20, 5): "너무 쉬운 말(tomorrow) 태그를 뺌 — 문장은 그대로",
}
CH_BY = {}
for c in changes:
    if c['kind'] == 'sentence':
        CH_BY[(c['situation'], c['index'])] = c
n_new = 0
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        px = pre['situations'][si]['sentences'][i]
        diff = [k for k in V44_SENT if x[k] != px[k]]
        if not diff:
            continue
        if (si, i) in WHY_SENT:
            why = WHY_SENT[(si, i)]
        elif diff == ['chunks']:
            why = "구 경계를 끊은 chunks를 구 단위로 바로잡음 — 문장은 그대로"
        else:
            why = "검토 반영"
        key = (s['title'], i)
        if key in CH_BY:
            c = CH_BY[key]
            c['fields'] = sorted(set(c['fields']) | set(diff), key=V44_SENT.index)
            c['why'] = c['why'] + ' / ' + why
        else:
            c = {'kind': 'sentence', 'situation': s['title'], 'index': i,
                 'fields': sorted(diff, key=V44_SENT.index), 'why': why}
            changes.append(c)
            CH_BY[key] = c
        n_new += 1
with open(P('changes-icu-post-arrest.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': chg_doc['theme'], 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=100000)
print('words', len(pre['words']), '->', len(doc['words']), '| changes', len(chg_doc['changes']), '->', len(changes), '| sentences changed', n_new)
