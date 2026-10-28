import yaml, json, sys, re, itertools
D = '/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/'
T = 'icu-liver-failure'
y = yaml.safe_load(open(D + T + '.yaml'))
base = yaml.safe_load(open(D + 'base-' + T + '.yaml'))
ch = yaml.safe_load(open(D + 'changes-' + T + '.yaml'))
inj = json.load(open(D + 'in-' + T + '.json'))
kp = {s['title']: s['keyPhrases'] for s in inj['situations']}
sec = sys.argv[1]
W = {w['id']: w for w in y['words']}
BW = {w['id']: w for w in base['words']}

def L(s): return len(re.sub(r'\s', '', s))
def lenok(a, b):
    la, lb = L(a), L(b)
    return max(la, lb) <= 1.25 * min(la, lb) or abs(la - lb) <= 3

if sec == 'words':
    for w in y['words']:
        flag = []
        for d in w['distractorsEn']:
            if not lenok(w['en'], d): flag.append('LEN-en:' + d)
        for d in w['distractorsKo']:
            if not lenok(w['ko'], d): flag.append('LEN-ko:' + d)
        b = BW.get(w['id'])
        bm = '' if b is None else ('' if (b['en'], b['ko']) == (w['en'], w['ko']) else f" [base {b['en']}|{b['ko']}]")
        print(f"{w['id']} | {w['en']} | {w['ko']}{bm} | tag={w['tag']} | dEn={w['distractorsEn']} | dKo={w['distractorsKo']} | chips={w['chips']} | decoy={w['decoyChips']} | cue={w['cue']} {' '.join(flag)}")
elif sec == 'ex':
    for w in y['words']:
        print(f"{w['id']} | {w['en']} | ex={w['example']} | exKo={w['exKo']}")
elif sec == 'sent':
    for i, s in enumerate(y['situations']):
        print(f"## S{i} {s['title']}")
        for j, t in enumerate(s['sentences']):
            k = 'KP ' if t['en'] in kp.get(s['title'], []) else ''
            print(f"  {i}.{j} {k}{t['en']}\n      ko={t['ko']}\n      ch={' / '.join(t['chunks'])}\n      w={t['words']}")
elif sec == 'nu':
    for i, s in enumerate(y['situations']):
        print(f"## S{i} {s['title']}")
        for n in s.get('nuance', []):
            k = n['kind']
            if k == 'pair':
                print(f"  PAIR words={n['words']} pairs={n['pairs']} decoys={n['decoys']}\n    why={n['why']}")
                rights = [p[1] for p in n['pairs']] + n['decoys']
                for p in n['pairs']:
                    print('    ' + p[0] + ' :: ' + ' | '.join(rights))
            elif k == 'slider':
                print(f"  SLIDER words={n['words']} cue={n['cue']} scale={n['scale']} at={n['answerAt']}\n    why={n['why']}\n    ex={n.get('example')} / {n.get('exKo')}")
            elif k == 'swap':
                print(f"  SWAP words={n['words']} who={n['who']} ko={n.get('ko')} answer={n['answer']}")
                for o in n['options']:
                    print(f"    -> {n['before'][0]}{o}{n['before'][2]}   [{n['notes'].get(o)}]")
                print(f"    why={n['why']}")
            elif k == 'context':
                print(f"  CONTEXT word={n.get('word')} ko={n.get('ko')} words={n['words']}")
                for sc in n['scenes']:
                    has = n.get('word', '').lower() in sc['en'].lower()
                    print(f"    [{sc['ok']}] {sc['who']}: {sc['en']}  {'' if has else '!!NOWORD'}  {('fix=' + sc['fix']) if 'fix' in sc else ''}")
                print(f"    why={n['why']}")
            elif k == 'reel':
                print(f"  REEL word={n['word']} feels={n['feels']}")
                for sc in n['scenes']:
                    print(f"    {sc['who']}: {sc['en']} / {sc['ko']}")
                print(f"    why={n['why']}")
elif sec == 'chg':
    from collections import Counter
    print(Counter(c['kind'] for c in ch['changes']))
    for c in ch['changes']:
        if c['kind'] != 'sentence':
            print(c)
    for c in ch['changes']:
        if c['kind'] == 'sentence' and c['fields'] != ['words']:
            print(c)
