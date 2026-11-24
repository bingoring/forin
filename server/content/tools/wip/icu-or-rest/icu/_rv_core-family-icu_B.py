import yaml,re,collections,sys
d=yaml.safe_load(open('core-family-icu.B.yaml',encoding='utf-8'))
def stems(t): return {x[:2] if len(x)>=2 else x for x in re.findall(r'[가-힣]+',t)}
bw=collections.Counter(); dc=collections.Counter(); kos=collections.Counter(); loc=collections.defaultdict(list)
for i,s in enumerate(d['situations']):
    for j,t in enumerate(s['sentences']):
        for o in t['blank']['options'][1:]:
            bw[o['en']]+=1; loc[o['en']].append((i,j))
        dc[t['decoy'].lower()]+=1
        mine=stems(t['ko'])
        for dk in t['distractorsKo']:
            for st in stems(dk)-mine: kos[st]+=1; loc['ko:'+st].append((i,j))
print('BLANK>=3',[(k,v,loc[k]) for k,v in bw.items() if v>=3])
print('DECOY>=2',[(k,v) for k,v in dc.items() if v>=2])
print('KO>=4',[(k,v,loc['ko:'+k]) for k,v in kos.items() if v>=4])
if len(sys.argv)>1:
    for i,s in enumerate(d['situations']):
        print('##',i)
        for j,t in enumerate(s['sentences']):
            print(f"{i}.{j} {t['ko']}\n    1) {t['distractorsKo'][0]}\n    2) {t['distractorsKo'][1]}\n    decoy={t['decoy']} chunks={t['chunks']}\n    blank={t['blank']['answer']}:{[o['en'] for o in t['blank']['options'][1:]]}")
