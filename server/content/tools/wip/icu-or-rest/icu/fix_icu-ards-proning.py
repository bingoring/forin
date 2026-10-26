#!/usr/bin/env python3
"""icu-ards-proning 수정 — fix-icu-ards-proning-A.md · -B.md 반영.

원본(수정 전)은 scratchpad 백업에서 읽고, 결과를 이 폴더의 icu-ards-proning.yaml / changes-icu-ards-proning.yaml 에 쓴다.
데이터: fix_icu-ards-proning_data_{1,2,3}.yaml
"""
import copy, re, sys, yaml

HERE = '/Users/yeom-yeon-ung/repository/forin/server/content/tools/wip/icu-or-rest/icu'
SP = '/private/tmp/claude-501/-Users-yeom-yeon-ung-repository-forin/029b8414-0111-4622-82a8-8bb7f168f932/scratchpad'
ORIG = f'{SP}/ards_orig.yaml'
CH_ORIG = f'{SP}/ards_changes_orig.yaml'
T = 'icu-ards-proning'


def ld(p):
    return yaml.safe_load(open(p, encoding='utf-8'))


orig = ld(ORIG)
d = copy.deepcopy(orig)
ch = ld(CH_ORIG)
d1, d2, d3 = (ld(f'{HERE}/fix_{T}_data_{i}.yaml') for i in (1, 2, 3))
W = {w['id']: w for w in d['words']}
S = d['situations']

# ---- 1. 단어
for wid, f in d1['words'].items():
    W[wid].update(f)
for wid, m in d1['decoy_chip_replace'].items():
    W[wid]['decoyChips'] = [m.get(c, c) for c in W[wid]['decoyChips']]

# distractorsEn — A 검토의 W-표(마지막 칸 굵은 글씨)
tab = {}
for line in open(f'{HERE}/fix-{T}-A.md', encoding='utf-8'):
    if not line.startswith('| w-'):
        continue
    cells = [c.strip() for c in line.strip().strip('|').split('|')]
    m = re.fullmatch(r'\*\*(.+)\*\*', cells[-1])
    assert m, line
    tab[cells[0]] = [x.strip() for x in m.group(1).split(',')]
    cur = [x.strip() for x in cells[2].split(',')]
    assert cur == W[cells[0]]['distractorsEn'], (cells[0], cur, W[cells[0]]['distractorsEn'])
for wid, v in tab.items():
    assert len(v) == 2
    W[wid]['distractorsEn'] = v
W['w-count']['distractorsEn'] = ['court', 'cough']  # county는 count의 다른 꼴이라 W13

# ---- 2. 문장
for e in d2['sentences']:
    s = S[e['s']]['sentences'][e['i']]
    for k, v in e.items():
        if k in ('s', 'i'):
            continue
        if k == 'dko':
            s['distractorsKo'] = v
        elif k == 'blank':
            s['blank'] = {'answer': v['answer'], 'options': [{'en': o} for o in v['options']]}
        elif k == 'drop':
            s['words'] = [w for w in s['words'] if w not in v]
        else:
            s[k] = v

# 단어 은행에서 지울 것 — 모든 문장 태그에서 뺀다
rm = d1['remove']
for sit in S:
    for s in sit['sentences']:
        s['words'] = [w for w in s['words'] if w not in rm]
    for n in sit['nuance']:
        assert not set(n['words']) & set(rm), (sit['title'], n['words'])
d['words'] = [w for w in d['words'] if w['id'] not in rm]
W = {w['id']: w for w in d['words']}

# ---- 3. 순서·뉘앙스
for e in d3['order']:
    o = S[e['s']]['order']
    for j, l in e.get('lines', {}).items():
        o['lines'][j]['en'] = l['en']
        o['lines'][j]['ko'] = l['ko']
    if 'why' in e:
        o['why'] = e['why']
for e in d3['nuance']:
    ns = [n for n in S[e['s']]['nuance'] if n['kind'] == e['kind']]
    assert len(ns) == 1, (e['s'], e['kind'], len(ns))
    n = ns[0]
    for k, v in e.get('set', {}).items():
        n[k] = v
    for j, f in e.get('scene', {}).items():
        n['scenes'][j].update(f)

# ---- 4. 고평부압 → 플래토압
def walk(x):
    if isinstance(x, dict):
        return {k: walk(v) for k, v in x.items()}
    if isinstance(x, list):
        return [walk(v) for v in x]
    if isinstance(x, str):
        return x.replace('고평부압', '플래토압')
    return x
d = walk(d)
W = {w['id']: w for w in d['words']}
S = d['situations']

# ---- 5. 문장을 예문으로 쓰는 단어의 example·exKo
oS = {(si, i): x for si, sit in enumerate(orig['situations']) for i, x in enumerate(sit['sentences'])}
nS = {(si, i): x for si, sit in enumerate(S) for i, x in enumerate(sit['sentences'])}
for key, o in oS.items():
    n = nS[key]
    for w in d['words']:
        if w['example'] == o['en']:
            if n['en'] != o['en']:
                if w['id'] in n['words']:
                    w['example'] = n['en']
                    w['exKo'] = n['ko']
                else:
                    print('EXAMPLE ORPHAN', w['id'], '|', o['en'])
            elif n['ko'] != o['ko']:
                w['exKo'] = n['ko']

# ---- 6. 변경 목록
ch_list = ch['changes']
KEYW = ('en', 'ko', 'ipa', 'icon', 'example')
KEYS = ('en', 'ko', 'chunks', 'words')
WHY_W = {
    'w-train-of-four': "ko에 정답 약어(TOF)가 들어 있어 카드에서 정답이 드러난다 — 약어를 뺀 뜻으로",
    'w-tof': "ko에 정답 약어(TOF)가 들어 있어 카드에서 정답이 드러난다 — 약어를 뺀 뜻으로",
    'w-sat': "'사트'는 소리만 옮겨 뜻을 알려 주지 않는다 — 포화도 수치의 약칭으로",
    'w-below': "below는 '미만'인데 ko가 '이하인' — 정확한 뜻으로(w-under와 겹치지 않게 '밑도는')",
    'w-pressure': "ko '압박'인데 blood pressure·plateau pressure에서는 '압력·혈압' — 둘을 덮도록",
    'w-plateau-pressure': "학습자에게 익숙한 '플래토압'으로 표기를 통일(문장 ko·exKo의 '고평부압'도 맞춤)",
}
WHY_S = {
    (1, 2): "문장 ko의 '고평부압'을 학습자에게 익숙한 '플래토압'으로 통일 — ko만 바꿈(keyPhrase 영어는 그대로)",
    (1, 4): "below는 '미만' — ko '이하'를 정확한 뜻으로 바로잡음; chunks는 소유격과 명사를 끊지 않게",
    (2, 3): "chunks가 'a clear / contraindication'처럼 명사구를 끊어 조립 문제가 어색 — 구 단위로",
    (7, 2): "ko '눌리지 않게 … 걸리지 않게 둬요'가 어색하고 뜻이 겹침 — 몸 아래에 눌리는 게 없도록 라인을 비켜 두라는 뜻으로(keyPhrase 영어는 그대로)",
    (7, 4): "chunks가 'before we / turn him'처럼 절의 주어와 동사를 끊음 — 구 단위로; 쉬운 말 태그(give·before)를 뺌",
    (9, 4): "간호사가 근이완제 증량을 혼자 약속하는 문장이었다 — 프로토콜에 따른다는 말을 넣고, 기준 없는 'too soon'을 '더 많이 돌아오면'으로",
    (10, 2): "양측성 ARDS에는 '좋은 쪽 폐'가 따로 없다 — ko를 '덜 손상된 폐 부위'로(keyPhrase 영어는 그대로)",
    (10, 4): "폐포 동원 수기는 일부러 압력을 올리는 처치라 '압력이 오르면 중단'은 기준이 아니다 — 혈압 저하·심박수 급변을 중단 기준으로",
    (11, 4): "쉬운 말(tonight) 태그를 뺌 — 문장은 그대로",
    (12, 4): "복와위 직후의 일시적 저혈압은 보통 몇 분 안에 회복되고, 앙와위 복귀는 마지막 조치다 — '다시 눕히면 회복'이라 가르치지 않게",
    (13, 3): "부종이 곧 가라앉는다는 지킬 수 없는 단정(잘못된 안심) — 대개·다시 눕힌 뒤로 바로잡음",
    (16, 4): "복와위 심정지에서 돌리느라 압박이 늦어지면 안 된다(AHA 2020) — 빨리 뒤집을 수 없으면 엎드린 채 압박 시작",
    (17, 3): "윤상연골 압박은 심정지·응급 기도에서 일상적으로 권하지 않고 환기를 방해할 수 있다 — 백으로 환기를 이어 가는 역할 분담으로",
    (18, 3): "chunks가 'won't / come up'처럼 조동사와 동사를 끊음 — 구 단위로",
    (19, 1): "영어는 명령형인데 ko가 간호사가 직접 호흡량을 낮추겠다는 1인칭이었다 — ko만 명령형으로(keyPhrase 영어는 그대로)",
    (19, 3): "chunks가 'on both / sides'처럼 한정사와 명사를 끊음 — 구 단위로",
}
DEFAULT_S = {
    'words': "뜻이 다른 태그를 빼거나 쉬운 말 태그를 뺌 — 문장은 그대로",
}


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
            add('word-remove', '간호사가 이미 아는 쉬운 말이거나 문장 수정으로 어느 문장도 태그하지 않게 됐다 — 은행에서 지움', id=wid)
        else:
            raise SystemExit('unexpected removal ' + wid)
        continue
    diff = [k for k in KEYW if o.get(k) != W[wid].get(k)]
    if diff:
        why = WHY_W.get(wid) or ("문장을 고쳐 예문이 바뀜" if diff == ['example'] else "검토 반영")
        add('word', why, fields=diff, id=wid)
for key in sorted(oS):
    o, n = oS[key], nS[key]
    diff = [k for k in KEYS if o.get(k) != n.get(k)]
    if diff:
        title = S[key[0]]['title']
        why = WHY_S.get(key) or DEFAULT_S['words']
        if diff == ['words'] and key not in WHY_S:
            why = "뜻이 다른 태그를 빼거나 쉬운 말 태그를 뺌 — 문장은 그대로"
        add('sentence', why, fields=diff, situation=title, index=key[1])
# 기존 항목의 이유 정정
x = find('word', id='w-plateau-pressure')
x['why'] = "학습자에게 익숙한 '플래토압(고원압)'으로 통일(문장 ko·exKo의 '고평부압'도 맞춤)"
x = find('word', id='w-sat')
x['why'] = "ko '산소포화도'가 w-saturation과 같아 정답이 둘이 되고, '사트(수치)'는 소리만 옮겨 뜻을 알려 주지 않는다 — '포화도 수치(약칭)'로 가름"

open(f'{HERE}/{T}.yaml', 'w', encoding='utf-8').write(yaml.safe_dump(d, allow_unicode=True, sort_keys=False, width=1000))
open(f'{HERE}/changes-{T}.yaml', 'w', encoding='utf-8').write(yaml.safe_dump({'theme': T, 'changes': ch_list}, allow_unicode=True, sort_keys=False, width=1000))
print('written; changes', len(ch_list), 'words', len(d['words']))
