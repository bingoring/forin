import yaml,re,collections,sys
T='or-difficult-airway'
d=yaml.safe_load(open(f'{T}.B.yaml',encoding='utf-8'))
def L(s): return len(re.sub(r'\s','',s))
def stems(t):
    o=set()
    for tok in re.findall(r'[가-힣]+',t or ''): o.add(tok[:2] if len(tok)>=2 else tok)
    return o
ko_only=collections.Counter(); dec=collections.Counter(); bw=collections.Counter()
mode=sys.argv[1] if len(sys.argv)>1 else 'all'
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        if 'distractorsKo' not in x: continue
        a=L(x['ko']); 
        flag=''
        for o in x['distractorsKo']:
            b=L(o)
            if max(a,b)/min(a,b)>1.25 and abs(a-b)>3: flag+=f' [V20 {o}:{b} vs {a}]'
            for st in stems(o)-stems(x['ko']): ko_only[st]+=1
        if not any(L(o)<=a for o in x['distractorsKo']): flag+=' [no-short]'
        dec[x['decoy'].lower()]+=1
        for o in x['blank']['options']:
            if o['en']!=x['blank']['answer']: bw[o['en'].lower()]+=1
        if mode in('all','dump'): print(f"{si}.{j} {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}{flag}")
        if mode=='blank':
            for o in x['blank']['options']:
                print(si,j,x['en'].replace(x['blank']['answer'],'['+o['en']+']',1))
print('--- ko-only >3:',[(k,v) for k,v in ko_only.most_common() if v>3])
print('--- decoy>1:',[(k,v) for k,v in dec.items() if v>1],'blank-wrong>2:',[(k,v) for k,v in bw.items() if v>2])
