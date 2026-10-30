import yaml, re, collections, sys
y = yaml.safe_load(open('or-count.yaml'))
pre = yaml.safe_load(open('or-count.pre-fix.yaml'))
nsp = lambda s: len(re.sub(r'\s', '', s))
MARK = ['려고', '러 ', '도록', '기 전에', '하면 ', '때까지', '게 ', '위해', '해서', '으려고', '니까']
print('--- 표지가 오답 둘에만 있는 문장')
rows = []
for si, s in enumerate(y['situations']):
    for i, x in enumerate(s['sentences']):
        ko, d = x['ko'], x['distractorsKo']
        rows.append((f'{si}.{i}', ko, d))
        for m in MARK:
            if all(m in o for o in d) and m not in ko:
                print(f'  {si}.{i} 표지 {m!r}: {ko} | {d}')
        if min(nsp(o) for o in d) > nsp(ko):
            print(f'  {si}.{i} 오답 둘 다 정답보다 길다: {nsp(ko)} {[nsp(o) for o in d]}')
print('--- 오답 전용 어간(앞 두 음절) 빈도 — 활용형 접어서')
FOLD = {'펴': '펴', '펼': '펴', '꺼내': '꺼내', '꺼낼': '꺼내', '놔': '놓', '놓': '놓', '놔요': '놓', '둬': '두', '둘': '두', '두': '두'}
def stems(t):
    out = set()
    for tok in re.findall(r'[가-힣]+', t):
        out.add(tok[:2] if len(tok) >= 2 else tok)
    return out
cnt = collections.Counter(); where = collections.defaultdict(list)
for k, ko, d in rows:
    mine = stems(ko)
    for o in d:
        for st in stems(o) - mine:
            cnt[st] += 1; where[st].append(k)
for st, c in cnt.most_common(18):
    print(f'  {st}: {c}  {where[st]}')
print('--- 준비 동사 어간(활용형 직접 센 것: 펴/펼, 꺼내/꺼낼, 놔/놓, 둬/두, 닦/씻/보여/불러)')
verbs = {'펴·펼': r'펴|펼', '꺼내': r'꺼내|꺼낼', '놔·놓': r'놔|놓', '둬·두': r'둬|두[지고]|둘', '닦': r'닦', '켜': r'켜', '보다·봐': r'봐|볼|보여|비춰', '불러': r'불러', '읽': r'읽', '챙기': r'챙', '모아': r'모아|모으'}
for name, rx in verbs.items():
    hits = [k for k, ko, d in rows for o in d if re.search(rx, o) and not re.search(rx, ko)]
    print(f'  {name}: {len(hits)} {hits}')
print('--- 오답만의 숫자·수사')
for name, rx in {'두': r'(^|\s)두 ', '세': r'(^|\s)세 ', '네': r'(^|\s)네 ', '개': r'개 '}.items():
    hits = [k for k, ko, d in rows for o in d if re.search(rx, o) and not re.search(rx, ko)]
    print(f'  {name}: {len(hits)}')
print('--- decoy·빈칸 오답 빈도(3 이하)')
dc = collections.Counter(); bw = collections.Counter()
for s in y['situations']:
    for x in s['sentences']:
        dc[x['decoy'].lower()] += 1
        for o in x['blank']['options']:
            if o['en'] != x['blank']['answer']:
                bw[o['en'].lower()] += 1
print('  decoy>=3:', [(a, b) for a, b in dc.items() if b >= 3])
print('  blank wrong>=3:', [(a, b) for a, b in bw.items() if b >= 3])
