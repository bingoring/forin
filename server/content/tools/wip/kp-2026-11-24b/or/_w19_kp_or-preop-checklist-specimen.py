"""새로 쓴 distractorsKo의 W19 어간(한글 앞 두 음절) 빈도를 주제 전체 기준으로 본다."""
import sys, re, io, yaml, collections
f, targets = sys.argv[1], sys.argv[2].split(',')
d = yaml.safe_load(io.open(f, encoding='utf-8'))
def stems(t): return {tok[:2] if len(tok) >= 2 else tok for tok in re.findall(r'[가-힣]+', t or '')}
cnt = collections.Counter(); where = collections.defaultdict(list)
for i, s in enumerate(d['situations']):
    for j, se in enumerate(s['sentences']):
        mine = stems(se['ko'])
        for dk in se.get('distractorsKo', []):
            for st in stems(dk) - mine:
                cnt[st] += 1; where[st].append(f'{i}.{j}')
for t in targets:
    i, j = map(int, t.split('.'))
    se = d['situations'][i]['sentences'][j]
    mine = stems(se['ko'])
    print(t, se['ko'])
    for dk in se['distractorsKo']:
        print('   ', dk, {st: cnt[st] for st in sorted(stems(dk) - mine)})
print('top:', cnt.most_common(8))
