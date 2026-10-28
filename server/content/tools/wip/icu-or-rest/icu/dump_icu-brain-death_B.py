import yaml,re,collections,sys
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v
d=yaml.safe_load(open('icu-brain-death.B.yaml'))
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        mine=v._ko_stems(x['ko'])
        for k in x['distractorsKo']:
            for st in v._ko_stems(k)-mine:
                cnt[st]+=1; where[st].append(f"{si}.{j}")
for st,c in cnt.most_common(25): print(st,c,where[st])
