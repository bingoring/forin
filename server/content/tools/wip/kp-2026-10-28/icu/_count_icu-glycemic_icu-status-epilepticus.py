import sys, io, yaml, collections
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
from verify_lesson_content import _ko_stems, _norm
d = yaml.safe_load(io.open(sys.argv[1]))
ko = collections.Counter(); bw = collections.Counter(); dc = collections.Counter()
for s in d['situations']:
    for se in s['sentences']:
        mine = _ko_stems(se['ko'])
        for dk in se.get('distractorsKo') or []:
            for st in _ko_stems(dk) - mine: ko[st] += 1
        b = se.get('blank') or {}
        for o in b.get('options') or []:
            if _norm(o['en']) != _norm(b['answer']): bw[_norm(o['en'])] += 1
        dc[(se.get('decoy') or '').lower()] += 1
q = sys.argv[2:]
for st in q: print(st, 'ko', ko[st], 'blank', bw[st], 'decoy', dc[st])
print('ko>=4', [(k, v) for k, v in ko.most_common() if v >= 4])
print('blank>=3', [(k, v) for k, v in bw.most_common() if v >= 3])
