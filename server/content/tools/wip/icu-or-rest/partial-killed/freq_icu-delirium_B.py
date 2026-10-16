import yaml,re,collections
b=yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu/icu-delirium.B.yaml'))
def stems(t): return {x[:2] if len(x)>=2 else x for x in re.findall(r'[가-힣]+',t)}
c=collections.Counter(); dec=collections.Counter(); bw=collections.Counter()
for s in b['situations']:
    for x in s['sentences']:
        if 'distractorsKo' not in x: continue
        mine=stems(x['ko'])
        for d in x['distractorsKo']:
            for st in stems(d)-mine: c[st]+=1
        dec[x['decoy'].lower()]+=1
        for o in x['blank']['options']:
            if o['en']!=x['blank']['answer']: bw[o['en'].lower()]+=1
print('KO',[kv for kv in c.most_common(12)])
print('DECOY',[kv for kv in dec.most_common(5)])
print('BW',[kv for kv in bw.most_common(8)])
