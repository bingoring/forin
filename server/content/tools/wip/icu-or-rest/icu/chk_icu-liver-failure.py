import yaml,re,collections,sys
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
import verify_lesson_content as v
d=yaml.safe_load(open('icu-liver-failure.yaml'))
S=d['situations']
bl=collections.defaultdict(list)
dec=collections.defaultdict(list)
for i,s in enumerate(S):
    for j,t in enumerate(s['sentences']):
        a=t['blank']['answer'].lower()
        for o in t['blank']['options']:
            if o['en'].lower()!=a: bl[o['en'].lower()].append(f'{i}.{j}')
        dec[t['decoy'].lower()].append(f'{i}.{j}')
print('blank wrong >=3:',{k:x for k,x in bl.items() if len(x)>=3})
print('decoy >=3:',{k:x for k,x in dec.items() if len(x)>=3})
ko=collections.defaultdict(list)
for i,s in enumerate(S):
    for j,t in enumerate(s['sentences']):
        mine=v._ko_stems(t['ko'])
        for x in t['distractorsKo']:
            for st in v._ko_stems(x)-mine: ko[st].append(f'{i}.{j}')
for k,x in sorted(ko.items(),key=lambda a:-len(a[1])):
    if len(x)>=4: print(len(x),k,x)
