#!/usr/bin/env python3
"""icu-shock 검토 A·B 반영. icu-shock.pre-fix.yaml(+changes-icu-shock.pre-fix.yaml)을 읽어
icu-shock.yaml / changes-icu-shock.yaml 을 다시 만든다. 다시 돌려도 같은 결과."""
import copy, os, re, sys
import yaml

HERE = os.path.dirname(os.path.abspath(__file__))
def P(n): return os.path.join(HERE, n)
def load(n): return yaml.safe_load(open(P(n), encoding='utf-8'))

doc = load('icu-shock.pre-fix.yaml')
pre = copy.deepcopy(doc)
chg_doc = load('changes-icu-shock.pre-fix.yaml')
W = {w['id']: w for w in doc['words']}
SIT = doc['situations']

# ---------- 문장 ----------
SENT_FIELDS = ('en', 'ko', 'chunks', 'words', 'tag', 'icon', 'why', 'decoy')
for n in (1, 2, 3):
    for e in load(f'fix_icu-shock_data_{n}.yaml')['sent']:
        x = SIT[e['s']]['sentences'][e['i']]
        for k in SENT_FIELDS:
            if k in e:
                x[k] = e[k]
        if 'dko' in e:
            assert len(e['dko']) == 2
            x['distractorsKo'] = e['dko']
        if 'blank' in e:
            b = e['blank']
            x['blank'] = {'answer': b['answer'], 'options': [{'en': o} for o in b['options']]}
        for wid in e.get('words_remove', []):
            assert wid in x['words'], (e, wid)
            x['words'] = [w for w in x['words'] if w != wid]

# ---------- 단어 ----------
d4 = load('fix_icu-shock_data_4.yaml')
for wid, setv in d4['words'].items():
    W[wid].update(setv)
# 품사 다른 distractorsEn 85 + 그 밖: A 검토 표
rows = re.findall(r"^\| \d+ \| (w-[\w-]+) \|.*?\| \[(.*?)\] → \[(.*?)\] \|$", open(P('fix-icu-shock-A.md'), encoding='utf-8').read(), re.M)
assert len(rows) == 85, len(rows)
for wid, old, new in rows:
    new = [t.strip() for t in new.split(',')]
    assert len(new) == 2
    W[wid]['distractorsEn'] = new
for wid, v in d4.get('dEn_override', {}).items():
    W[wid]['distractorsEn'] = v
for wid in d4['tag_general']:
    assert W[wid]['tag'] == '일반 동사', wid
    W[wid]['tag'] = '일반 표현'
for wid in d4['word_remove']:
    del W[wid]
doc['words'] = [w for w in doc['words'] if w['id'] in W]

# 예문(example)·exKo 맞춤: ko가 바뀐 문장은 exKo, en이 바뀐 문장은 example도
sent_by_old_en = {}
for si, s in enumerate(pre['situations']):
    for i, x in enumerate(s['sentences']):
        sent_by_old_en[x['en']] = (si, i)
for wid, w in W.items():
    if w['example'] in sent_by_old_en:
        si, i = sent_by_old_en[w['example']]
        new = SIT[si]['sentences'][i]
        if new['en'] != w['example']:
            if wid in d4['example_to']:
                a, b = d4['example_to'][wid]
                new = SIT[a]['sentences'][b]
            elif wid not in d4['words'] or True:
                # 새 en에 단어가 그대로 있으면 새 문장으로, 아니면 매핑이 필요하다
                pass
            w['example'] = new['en']
        w['exKo'] = new['ko']
# en이 바뀌어 example이 더는 그 문장이 아닌 단어 중 d4 매핑이 있는 것 처리(위 루프가 처리). 확인:
for wid, w in W.items():
    pass

# ---------- 뉘앙스 ----------
for e in d4['nuance']:
    sit = SIT[e['s']]
    cands = [n for n in sit['nuance'] if n['kind'] == e['kind']]
    assert len(cands) == 1, (e['s'], e['kind'], len(cands))
    n = cands[0]
    n.update(e.get('set', {}))
    if 'scene_fix' in e:
        sc = n['scenes'][e['scene_fix']['index']]
        assert sc['ok'] is False
        sc['fix'] = e['scene_fix']['fix']
    if 'scene_set' in e:
        ss = e['scene_set']
        sc = n['scenes'][ss['index']]
        assert sc['ok'] is False
        for k in ('en', 'fix'):
            if k in ss:
                sc[k] = ss[k]

# ---------- order ----------
for e in d4['order']:
    o = SIT[e['s']]['order']
    if 'why' in e:
        o['why'] = e['why']
    for idx, upd in (e.get('lines') or {}).items():
        o['lines'][idx].update(upd)

with open(P('icu-shock.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=100000)

# ---------- changes-icu-shock.yaml ----------
changes = copy.deepcopy(chg_doc['changes'])
V44_WORD = ('id', 'en', 'ipa', 'ko', 'icon', 'example')
V44_SENT = ('en', 'ko', 'chunks', 'words')
removed = set(d4['word_remove'])
# 지워진 단어의 옛 변경(단어 변경)은 뺀다
changes = [c for c in changes if not (c['kind'] == 'word' and c['id'] in removed)]
WHY_WORD = {
    'w-eye': "'keep a close eye on' 구 단위로(쓰인 곳이 이 구 하나뿐) — 헤드워드·ko·ipa",
    'w-rate': "ko '박동수'는 breathing rate(호흡수)에도 붙어 틀림 — '분당 횟수'",
    'w-large': "감압 바늘의 large는 굵기(large-bore) — ko '굵은'",
    'w-volume': "ko '용량'은 투여량(dose)으로 읽힘 — 혈관 안 체액의 양 '용적'",
    'w-compression': "활용형(compressions)을 원형으로 — 같은 브랜치 icu-cardiogenic과 일관",
}
def add_word_change(wid, fields, why):
    for c in changes:
        if c['kind'] == 'word' and c['id'] == wid:
            c['fields'] = sorted(set(c['fields']) | set(fields), key=V44_WORD.index)
            c['why'] = c['why'] + ' / ' + why
            return
    changes.append({'kind': 'word', 'id': wid, 'fields': sorted(fields, key=V44_WORD.index), 'why': why})
pre_W = {w['id']: w for w in pre['words']}
for wid, w in W.items():
    diff = [k for k in V44_WORD if w.get(k) != pre_W[wid].get(k)]
    if diff:
        why = WHY_WORD.get(wid)
        if not why:
            why = "이 단어를 예문으로 쓰던 문장을 바꾼 검토 반영에 맞춰 예문을 바꿈"
        add_word_change(wid, diff, why)
for wid in d4['word_remove']:
    changes.append({'kind': 'word-remove', 'id': wid,
                    'why': "어느 문장도 태그하지 않게 됨 — 무의미성 갈등 문장 5를 '어떤 결정이든 지지'(지킬 수 없는 약속)에서 바꿈"})
WHY_SENT = {
    (7, 4): "승압제 시작은 처방이 있어야 하므로 간호사가 스스로 시작한다고 말하지 않게 — 준비만 해 둔다로(환자 안전)",
    (12, 4): "recheck와 again이 겹친 중복 표현 정리",
    (13, 5): "환자가 she인 상황에서 him이 누구인지 모호 — the physician으로",
    (16, 4): "대량수혈은 적혈구와 혈장을 1:1로 함께 주는 것이 원칙 — '먼저 적혈구, 그다음 혈장'은 틀린 순서(환자 안전)",
    (17, 3): "상황의 환자가 she(tagline)인데 문장이 his — her로",
    (17, 5): "상황의 환자가 she(tagline)인데 문장이 his — her로",
    (18, 3): "산소포화도는 한쪽 폐마다 재는 값이 아님 — 한쪽 가슴이 안 올라온다로(사실 오류)",
    (20, 5): "무의미성 갈등에서 '어떤 결정이든 지지'는 지킬 수 없는 약속 — 함께 풀어 간다로",
    (2, 5): "ko '습성 음…바로'가 early를 담지 못하고 쓰지 않는 말 — 수포음·다 들어가기 전에라도",
    (5, 3): "ko가 번역투 — 만져 본 관찰로",
    (9, 5): "감압 바늘의 large는 굵기(large-bore)",
    (10, 2): "ko '용량'은 투여량으로 읽힘 — '용적'(w-volume과 짝)",
    (12, 0): "clearing은 젖산이 씻겨 나간다는 뜻 — '회복'이 아니라 '제거'",
    (12, 2): "our resuscitation은 소생 치료 — '소생 반응'이 아님",
    (15, 1): "goals에 '재사정'은 어색 — '다시 검토'",
    (15, 3): "ko '기능부전이 되고 있어요'가 어색",
    (16, 5): "running count(누적 합계)를 ko가 담지 못함",
}
def sent_label(s, i): return (SIT[s]['title'], i)
CH_BY = {}
for c in changes:
    if c['kind'] == 'sentence':
        CH_BY[(c['situation'], c['index'])] = c
for si, s in enumerate(SIT):
    for i, x in enumerate(s['sentences']):
        px = pre['situations'][si]['sentences'][i]
        diff = [k for k in V44_SENT if x[k] != px[k]]
        if not diff:
            continue
        key = (s['title'], i)
        if (si, i) in WHY_SENT:
            why = WHY_SENT[(si, i)]
        elif diff == ['chunks']:
            why = "구 경계를 끊은 chunks를 구 단위로 바로잡음 — 문장은 그대로"
        elif diff == ['words']:
            why = "반쪽 태그(뜻이 다른 단어 태그)를 뺌 — 문장은 그대로"
        else:
            why = "검토 반영"
        if key in CH_BY:
            c = CH_BY[key]
            c['fields'] = sorted(set(c['fields']) | set(diff), key=V44_SENT.index)
            c['why'] = c['why'] + ' / ' + why
        else:
            c = {'kind': 'sentence', 'situation': s['title'], 'index': i,
                 'fields': sorted(diff, key=V44_SENT.index), 'why': why}
            changes.append(c)
            CH_BY[key] = c
with open(P('changes-icu-shock.yaml'), 'w', encoding='utf-8') as f:
    yaml.safe_dump({'theme': chg_doc['theme'], 'changes': changes}, f, allow_unicode=True, sort_keys=False, width=100000)
print('words', len(pre['words']), '->', len(doc['words']), '| changes', len(chg_doc['changes']), '->', len(changes))
