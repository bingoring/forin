#!/usr/bin/env python3
"""core-safety-icu A — base에 v45 필드(단어)·nuance(상황)·결정 11 정리를 얹는다."""
import glob, os, yaml, copy, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)
TH = 'core-safety-icu'
base = yaml.safe_load(open(f'base-{TH}.yaml'))
SENT = {x['en']: x['ko'] for s in base['situations'] for x in s['sentences']}

W = {}
for f in sorted(glob.glob(f'add_{TH}_A_words_*.txt')):
    for ln in open(f, encoding='utf-8'):
        ln = ln.strip()
        if not ln: continue
        p = ln.split('|')
        assert len(p) == 7, (f, ln)
        i, cue, tag, den, dko, chips, dec = p
        W['w-' + i] = dict(cue=cue, tag=tag, dEn=den.split(','), dKo=dko.split(','),
                          chips=[w.split('/') for w in chips.split(' ')], dec=dec.split(','))
N = {}
for f in sorted(glob.glob(f'add_{TH}_A_nuance_*.yaml')):
    N.update(yaml.safe_load(open(f, encoding='utf-8')))

RM = set('minute patient hour time now room name day doctor family know night red yellow first light tonight give ask say bed help'.split())
rmids = {'w-' + r for r in RM}
TAGFIX = {'환경 정리': '낙상·환경'}
KO = {'w-trace': '추적하다', 'w-verify': '검증하다', 'w-confirm': '재확인하다', 'w-afterward': '그 후에', 'w-prompt': '유도하다'}
EN = {'w-prompt': ('prompt', '/prɑːmpt/'), 'w-crash': ('crash', '/kræʃ/')}
SIGNOFF = ('Both of us sign off before it runs.', 'w-off')   # off(풀린)가 sign off(서명 완료)에 붙어 뜻이 안 맞음

out = copy.deepcopy(base); changes = []
for s in out['situations']:
    for i, x in enumerate(s['sentences']):
        drop = {w for w in x['words'] if w in rmids}
        if x['en'] == SIGNOFF[0] and SIGNOFF[1] in x['words']: drop.add(SIGNOFF[1])
        if drop:
            gone = [w for w in x['words'] if w in drop]
            x['words'] = [w for w in x['words'] if w not in drop]
            changes.append({'kind': 'sentence', 'situation': s['title'], 'index': i, 'fields': ['words'],
                            'why': '태그 빼기: ' + ', '.join(w[2:] for w in gone)})
    if s['title'] in N: s['nuance'] = N[s['title']]
used = {w for s in out['situations'] for x in s['sentences'] for w in x['words']}
nw = []
for w in out['words']:
    if w['id'] not in used:
        changes.append({'kind': 'word-remove', 'id': w['id'],
                        'why': '너무 쉬움/뜻이 안 맞음 — 어느 문장도 태그하지 않게 됐다'}); continue
    a = W[w['id']]
    f = []
    if w['id'] in EN:
        w['en'], w['ipa'] = EN[w['id']]; f += ['en', 'ipa']
    if w['id'] in KO:
        w['ko'] = KO[w['id']]; f.append('ko')
    if f:
        changes.append({'kind': 'word', 'id': w['id'], 'fields': f,
                        'why': '헤드워드를 원형으로' if 'en' in f else '은행 안 같은 뜻(대조 확인·따라가다·나중에) 구분'})
    w.update({'cue': a['cue'], 'exKo': SENT[w['example']], 'tag': TAGFIX.get(a['tag'], a['tag']),
              'distractorsEn': a['dEn'], 'distractorsKo': a['dKo'], 'chips': a['chips'], 'decoyChips': a['dec']})
    nw.append(w)
out['words'] = nw

# ---- 자체 점검 ----
def L(s): return len(s.replace(' ', ''))
def ok_len(a, b): return L(b) <= L(a) * 1.25 + 1e-9 and L(b) >= L(a) / 1.25 - 1e-9 or abs(L(a) - L(b)) <= 3
bad = []
for w in nw:
    en = w['en']
    joined = ' '.join(''.join(p) for p in w['chips'])
    if joined != en: bad.append(('chips', w['id'], joined, en))
    for d in w['distractorsEn']:
        if not ok_len(en, d): bad.append(('lenEn', w['id'], d))
    for d in w['distractorsKo']:
        if not ok_len(w['ko'], d): bad.append(('lenKo', w['id'], w['ko'], d))
    # 조각 경로
    pieces = [p for ws in w['chips'] for p in ws] + w['decoyChips']
    canon = [p for ws in w['chips'] for p in ws]
    target = en.replace(' ', '')
    def paths(t, avail):
        if not t: yield []; return
        for k, p in enumerate(avail):
            if t.startswith(p):
                for r in paths(t[len(p):], avail[:k] + avail[k+1:]): yield [p] + r
    for pth in paths(target, pieces):
        if any(p in w['decoyChips'] for p in pth) : bad.append(('decoyPath', w['id'], pth)); break
kos = {}
for w in nw: kos.setdefault(w['ko'], []).append(w['id'])
for k, v in kos.items():
    if len(v) > 1: bad.append(('dupKo', k, v))
for b_ in bad: print('!!', b_)
missing = [w['id'] for w in nw if w['id'] not in W]
print('words', len(nw), 'bad', len(bad), 'nuance sits', sum(1 for s in out['situations'] if 'nuance' in s))
if '--check' in sys.argv: sys.exit()
yaml.dump(out, open(f'{TH}.A.yaml', 'w'), Dumper=yaml.SafeDumper, allow_unicode=True, sort_keys=False, width=1000)
yaml.dump({'theme': TH, 'changes': changes}, open(f'changes-{TH}.yaml', 'w'), Dumper=yaml.SafeDumper, allow_unicode=True, sort_keys=False, width=1000)
print('changes', len(changes))
