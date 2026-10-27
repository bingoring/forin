#!/usr/bin/env python3
"""icu-infection-prevention 수정 — fix-icu-infection-prevention-A.md · -B.md 반영.

수정 전 원본(icu-infection-prevention.pre-fix.yaml · fix_icu-infection-prevention_changes_orig.yaml)을 읽어
icu-infection-prevention.yaml / changes-icu-infection-prevention.yaml 을 다시 만든다(몇 번 돌려도 같은 결과).
데이터: fix_icu-infection-prevention_data_{1,2,3}.yaml
"""
import copy, sys, yaml

HERE = '/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu'
T = 'icu-infection-prevention'


class L(yaml.SafeLoader):
    pass


def _cm(loader, node):
    out = {}
    for k, v in node.value:
        key = loader.construct_object(k)
        val = loader.construct_object(v, deep=True)
        if key in out and isinstance(out[key], dict) and isinstance(val, dict):
            out[key].update(val)
        elif key in out:
            raise SystemExit(f'중복 키 {key}')
        else:
            out[key] = val
    return out


L.add_constructor(yaml.resolver.BaseResolver.DEFAULT_MAPPING_TAG, _cm)


def ld(p):
    return yaml.load(open(p, encoding='utf-8'), Loader=L)


orig = ld(f'{HERE}/{T}.pre-fix.yaml')
ch = ld(f'{HERE}/fix_{T}_changes_orig.yaml')
d = copy.deepcopy(orig)
d1, d2, d3 = (ld(f'{HERE}/fix_{T}_data_{i}.yaml') for i in (1, 2, 3))
W = {w['id']: w for w in d['words']}
S = d['situations']

# 문장 번호(#n) -> (상황, 줄)
POS = {}
n = 0
for si, sit in enumerate(S):
    for i, _ in enumerate(sit['sentences']):
        n += 1
        POS[n] = (si, i)

# ---- 1. 단어
for wid, f in d1['words'].items():
    W[wid].update(f)
for wid, v in d1['distractorsEn'].items():
    assert len(v) == 2
    W[wid]['distractorsEn'] = v
for wid, m in d1['decoy_chip_replace'].items():
    new = [m.get(c, c) for c in W[wid]['decoyChips']]
    assert new != W[wid]['decoyChips'], wid
    W[wid]['decoyChips'] = new
for wid, add_ in d1['decoy_chip_add'].items():
    W[wid]['decoyChips'] = W[wid]['decoyChips'] + add_

# ---- 2. 문장
replaced = set()
for num, e in d2['sentences'].items():
    si, i = POS[num]
    s = S[si]['sentences'][i]
    if 'en' in e:
        replaced.add((si, i))
    for k, v in e.items():
        if k == 'dko':
            assert len(v) == 2
            s['distractorsKo'] = [s['distractorsKo'][j] if v[j] is None else v[j] for j in range(2)]
        elif k == 'blank':
            opts = v['options']
            ans = v.get('answer', opts[0])
            assert ans == opts[0], (num, ans, opts)
            if (si, i) not in replaced and 'answer' not in v:
                assert ans == s['blank']['answer'], (num, ans, s['blank']['answer'])
            assert len(set(opts)) == 4
            s['blank'] = {'answer': ans, 'options': [{'en': o} for o in opts]}
        else:
            s[k] = v

# 단어 은행에서 지울 것
rm = d1['remove']
for sit in S:
    for s in sit['sentences']:
        s['words'] = [w for w in s['words'] if w not in rm]
    for nu in sit['nuance']:
        assert not set(nu['words']) & set(rm), (sit['title'], nu['words'])
d['words'] = [w for w in d['words'] if w['id'] not in rm]
W = {w['id']: w for w in d['words']}

# ---- 3. 순서·뉘앙스
for e in d3['order']:
    o = S[e['s']]['order']
    for j, l in e.get('lines', {}).items():
        o['lines'][j]['en'] = l['en']
        o['lines'][j]['ko'] = l['ko']
        if 'note' in l:
            o['lines'][j]['note'] = l['note']
    if 'why' in e:
        o['why'] = e['why']
for e in d3['nuance']:
    ns = [x for x in S[e['s']]['nuance'] if x['kind'] == e['kind']]
    assert len(ns) == 1, (e['s'], e['kind'], len(ns))
    nu = ns[0]
    for k, v in e.get('set', {}).items():
        nu[k] = v
    for j, f in e.get('scene', {}).items():
        nu['scenes'][j].update(f)

# ---- 4. 문장을 예문으로 쓰는 단어의 example·exKo
oS = {(si, i): x for si, sit in enumerate(orig['situations']) for i, x in enumerate(sit['sentences'])}
nS = {(si, i): x for si, sit in enumerate(S) for i, x in enumerate(sit['sentences'])}
MANUAL = {  # 새 문장에 단어가 더는 없을 때 다른 문장으로
    'w-soap': POS[58],
    'w-reach': POS[35],
    'w-screen': POS[89],
}
for key, o in oS.items():
    nn = nS[key]
    for w in d['words']:
        if w['example'] == o['en']:
            if nn['en'] != o['en']:
                if w['id'] in nn['words']:
                    w['example'], w['exKo'] = nn['en'], nn['ko']
                elif w['id'] in MANUAL:
                    t = nS[MANUAL[w['id']]]
                    w['example'], w['exKo'] = t['en'], t['ko']
                else:
                    print('EXAMPLE ORPHAN', w['id'], '|', o['en'])
            elif nn['ko'] != o['ko']:
                w['exKo'] = nn['ko']

# ---- 5. 변경 목록
ch_list = ch['changes']
KEYW = ('en', 'ko', 'ipa', 'icon', 'example')
KEYS = ('en', 'ko', 'chunks', 'words')
WHY_W = {
    'w-blame': "문장의 blame은 명사('탓·비난')인데 ko가 동사 '탓하다'였다",
    'w-line': "ko '중심라인'은 말초 라인(cover any lines)을 못 덮는다 — '라인(혈관 카테터)'로",
    'w-brush': "ko '닦다'가 w-wipe '닦아내다'와 겹쳐 듣고 뜻 고르기에서 정답이 둘 — '칫솔질하다'로 가름",
    'w-grab': "문장 수정(밀착검사 받은 N95를 챙기게)에 맞춰 ko를 '챙기다'로, 예문도 새 문장으로",
    'w-step': "ko '조치'가 w-measure·w-precaution과 글자까지 같아 정답이 겹침 — '단계'로",
    'w-measure': "ko '조치'가 w-step·w-precaution과 글자까지 같아 정답이 겹침 — '대책'으로",
    'w-cauti': "헤드워드가 약어의 복수형(CAUTIs)이었다 — 원형 CAUTI로(문장의 CAUTIs는 복수형이라 허용)",
}
WHY_S = {
    (0, 5): "'soap can't always reach'는 젤이 비누보다 낫다는 투라 C. diff 상황과 부딪힘 — 문질러 마를 때까지 바르면 대부분의 균이 준다는 말로",
    (3, 3): "chunks가 'the head / of the bed'처럼 명사구를 끊음 — 구 단위로",
    (3, 4): "'every few hours'는 실제 구강 관리 빈도(칫솔질 하루 2회 안팎)보다 잦다 — 정해진 일정에 따라 하는 것으로",
    (9, 4): "접촉주의 환자 이송 중 가운·장갑을 입은 채 복도를 다니면 오염이 퍼진다(CDC 2007) — 도착지에서 환자를 다루는 사람이 새로 입는 것으로",
    (10, 4): "환자를 '이 사람들'이라 부르면 낮춰 들림 — '이 환자들의 장비'로",
    (12, 2): "'표시해 알린다'는 어색함 — flag ~ to the team은 '알리다'(keyPhrase 영어는 그대로); 쉬운 말이 아닌 w-sign은 문장 뜻이 '표지'와 달라 태그를 뺌",
    (12, 3): "chunks가 'for over / a week'처럼 구를 끊음 — 구 단위로",
    (13, 0): "w-sign의 뜻('표지')과 이 문장의 sign('징후')이 달라 태그를 뺌 — 문장은 그대로",
    (8, 2): "CAUTI의 뜻을 살려 '도뇨관 관련 요로감염'으로(keyPhrase 영어는 그대로)",
    (15, 4): "병동 전체 선별검사는 감염관리팀이 정한다 — 간호사가 혼자 하자고 하지 않고 감염관리팀에 문의하는 것으로",
    (16, 3): "아무 N95나 건네면 된다는 오해(N95는 본인이 밀착검사를 받은 모델·크기를 써야 함) — 밀착검사 받은 N95를 챙기게",
    (18, 3): "CDC·NIOSH 지침에 없는 '꼬박 1분' 수치를 약속하고 chunks도 구를 끊음 — 직원 건강관리실에 연락하는 동안 계속 씻게",
    (18, 4): "PEP는 직원보건·의사가 평가해 처방하고 노출 몇 시간 안에 시작해야 한다 — 간호사가 '오늘' 시작하는 것이 아니라 보고해 바로 평가받게",
    (19, 1): "'생화분'은 없는 말 — '화분이나 생화'로(keyPhrase 영어는 그대로)",
}
DEFAULT_S = "뜻이 다른 태그를 빼거나 쉬운 말 태그를 뺌 — 문장은 그대로"


def find(kind, **kw):
    for x in ch_list:
        if x['kind'] == kind and all(x.get(k) == v for k, v in kw.items()):
            return x


def add(kind, why, fields=None, **kw):
    x = find(kind, **kw)
    if x is None:
        x = {'kind': kind, **kw}
        if fields is not None:
            x['fields'] = []
        x['why'] = why
        ch_list.append(x)
    else:
        if why and why not in x['why']:
            x['why'] = x['why'] if x['kind'] == 'word-remove' else x['why'] + '; ' + why
    if fields:
        for f in fields:
            if f not in x['fields']:
                x['fields'].append(f)


oW = {w['id']: w for w in orig['words']}
for wid, o in oW.items():
    if wid not in W:
        if wid in rm:
            add('word-remove', '너무 쉬운 말(결정 11) — 문장 한 곳에만 태그돼 있었고 태그를 뺐다 — 은행에서 지움', id=wid)
        else:
            raise SystemExit('unexpected removal ' + wid)
        continue
    diff = [k for k in KEYW if o.get(k) != W[wid].get(k)]
    if diff:
        why = WHY_W.get(wid) or "문장을 고쳐 예문이 바뀜"
        add('word', why, fields=diff, id=wid)
for key in sorted(oS):
    o, nn = oS[key], nS[key]
    diff = [k for k in KEYS if o.get(k) != nn.get(k)]
    if diff:
        title = S[key[0]]['title']
        why = WHY_S.get(key) or DEFAULT_S
        add('sentence', why, fields=diff, situation=title, index=key[1])

open(f'{HERE}/{T}.yaml', 'w', encoding='utf-8').write(yaml.safe_dump(d, allow_unicode=True, sort_keys=False, width=1000))
open(f'{HERE}/changes-{T}.yaml', 'w', encoding='utf-8').write(yaml.safe_dump({'theme': T, 'changes': ch_list}, allow_unicode=True, sort_keys=False, width=1000))
print('written; changes', len(ch_list), 'words', len(d['words']))
