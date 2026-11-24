"""W18·W19 빈도표: python3 _freq_kp_or-difficult-airway-preop-assessment.py <yaml> [stem ...]"""
import sys, collections, yaml
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
from verify_lesson_content import _ko_stems, _norm
d = yaml.safe_load(open(sys.argv[1]))
ko_only = collections.Counter(); dec = collections.Counter(); bw = collections.Counter()
for s in d['situations']:
    for se in s['sentences']:
        mine = _ko_stems(se['ko'])
        for dk in se.get('distractorsKo') or []:
            for st in _ko_stems(dk) - mine:
                ko_only[st] += 1
        dec[(se.get('decoy') or '').strip().lower()] += 1
        b = se.get('blank') or {}
        for o in b.get('options', []):
            if _norm(o['en']) != _norm(b['answer']):
                bw[_norm(o['en'])] += 1
want = sys.argv[2:]
if want:
    for w in want:
        print(w, ko_only[w[:2]], dec[w.lower()], bw[w.lower()])
else:
    print('ko-only ≥4:', [(k, v) for k, v in ko_only.most_common() if v >= 4])
    print('decoy ≥2:', [(k, v) for k, v in dec.most_common() if v >= 2])
    print('blank ≥3:', [(k, v) for k, v in bw.most_common() if v >= 3])
