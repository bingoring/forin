"""core-language-icu 수정 — pre-fix 원본을 읽어 A·B 검토 목록을 반영하고 yaml·changes를 다시 쓴다(여러 번 돌려도 같은 결과)."""
import yaml, re, copy, os, importlib.util as u
os.chdir(os.path.dirname(os.path.abspath(__file__)))
THEME = 'core-language-icu'
d = yaml.safe_load(open(f'{THEME}.pre-fix.yaml'))
chg = yaml.safe_load(open(f'changes-{THEME}.pre-fix.yaml'))
L = lambda n: yaml.safe_load(open(f'fix_{THEME}_data_{n}.yaml'))
sp = u.spec_from_file_location('v', f'_reviewB_{THEME}_vals.py'); v = u.module_from_spec(sp); sp.loader.exec_module(v)
DK, BL, DC = v.DK, v.BL, v.DC
Wd = {w['id']: w for w in d['words']}
SIT = d['situations']
changes = chg['changes']

def S(si, k): return SIT[si]['sentences'][k]

# ── 1. B 값(distractorsKo·빈칸·decoy) — apply.py와 같은 방식, 정답 ko 끝 부호를 붙인다
for si, s in enumerate(SIT):
    for k, t in enumerate(s['sentences']):
        key = f'{si}.{k}'
        end = t['ko'][-1] if t['ko'][-1] in '.?' else ''
        if key in DK:
            for i, x in enumerate(DK[key]):
                if x is not None: t['distractorsKo'][i] = x + end
        if key in BL:
            ans, opts = BL[key]
            assert len(re.findall(r'\b' + re.escape(ans) + r'\b', t['en'])) == 1, (key, ans)
            t['blank'] = {'answer': ans, 'options': [{'en': o} for o in opts]}
        if key in DC: t['decoy'] = DC[key]

# ── 2. 단어 수정
D2 = L(2)
for w in D2['words']:
    Wd[w['id']].update(copy.deepcopy(w['set']))
    if w.get('changes'):
        changes.append({'kind': 'word', 'id': w['id'], 'fields': w['changes'], 'why': 'A 검토 W4/W5/W8/W9 — 헤드워드·ko를 문장 쓰임에 맞춤' if w['id'] != 'w-print' else 'A 검토 W9 — 손글씨 정자체가 아니라 활자'})
for e in D2['exko']:
    for wid in e['ids']:
        assert Wd[wid]['example'] == e['example'], wid
        Wd[wid]['exKo'] = e['exKo']

# ── 3. 문장 수정 (옛 en으로 위치 확인)
D1 = L(1)
for e in D1['sentences']:
    t = S(e['sit'], e['idx']); assert t['en'] == e['old'], (e['sit'], e['idx'], t['en'])
    new = copy.deepcopy(e['set']); fields = [k for k in ('en', 'ko', 'chunks', 'words') if k in new and new[k] != t[k]]
    t.update(new)
    assert ''.join(' '.join(t['chunks']).replace(' .', '.').replace(' ,', ',').replace(' —', ' —')) .replace('  ', ' ') or True
    if fields:
        title = SIT[e['sit']]['title']
        if e['kind'] == 'rewrite':
            why = 'A 검토 S1/S2 — 지킬 수 없는 약속을 지킬 수 있는 말로 새로 씀(en·ko·chunks·words·v46 전부)'
        elif 'ko' in fields: why = 'A 검토 S3/S4/S5 — ko를 문장 쓰임에 맞게 고침' + (' · 쓰임이 다른 단어 태그 뺌' if 'words' in fields else '')
        elif 'chunks' in fields: why = 'A 검토 S6/S7 — 구 경계에서 끊긴 청크를 다시 자름'
        else: why = 'A 검토 T1/T2 — 카드 뜻과 쓰임이 다른 단어 태그 뺌'
        changes.append({'kind': 'sentence', 'situation': title, 'index': e['idx'], 'fields': fields, 'why': why})
# 결정 11 — w-long은 어느 문장도 태그하지 않게 되었으니 지운다
for wid in D2['remove']:
    assert not any(wid in t['words'] for s in SIT for t in s['sentences']), wid
    assert not any(wid in n.get('words', []) for s in SIT for n in s['nuance']), wid
    d['words'] = [w for w in d['words'] if w['id'] != wid]
    changes.append({'kind': 'word-remove', 'id': wid, 'why': '17.6을 "필요한 만큼 있겠다"에서 "다시 부를 수 있다"로 바꿔 어느 문장도 태그하지 않게 됨'})

# ── 4. 뉘앙스
D3 = L(3)
def nu(si, kind): return [n for n in SIT[si]['nuance'] if n['kind'] == kind]
for si, c in D3['contexts'].items():
    n, = nu(si, 'context')
    for k in ('word', 'ko', 'scenes', 'why'): n[k] = copy.deepcopy(c[k])
for si, p in D3['pairs'].items():
    n, = nu(si, 'pair')
    for k, val in p.items(): n[k] = copy.deepcopy(val)
# swap 16 (사망 고지) — 비문 `is no longer with us a few minutes ago`
n, = nu(16, 'swap'); n['options'] = ['passed away', 'died', 'left us']
n['notes'] = {('left us' if k == 'is no longer with us' else k): val for k, val in n['notes'].items()}
n['notes']['left us'] = '돌려 말해서 뜻이 흐려지고, 통역을 거치면 가족이 아직 살아 있는지 되묻기 쉽다.'
# swap 6 (흡인 신호) — 근거 없는 해설 과장
n, = nu(6, 'swap')
n['notes']['wish for'] = '바람을 말하는 딱딱한 표현이라 짧은 신호 질문에 어울리지 않는다.'
n['why'] = n['why'].rstrip() + ' 흡인 여부는 신호와 함께 간호사가 직접 사정해요.'

# ── 5. order
D4 = L(4)['order']
for si, o in D4.items():
    od = SIT[si]['order']
    if 'why' in o: od['why'] = o['why']
    for i, f in o['lines'].items(): od['lines'][i].update(f)

# ── 6. 쓰기
yaml.safe_dump(d, open(f'{THEME}.yaml', 'w'), allow_unicode=True, sort_keys=False, width=200)
yaml.safe_dump({'theme': THEME, 'changes': changes}, open(f'changes-{THEME}.yaml', 'w'), allow_unicode=True, sort_keys=False, width=200)
print('written; changes', len(changes))
