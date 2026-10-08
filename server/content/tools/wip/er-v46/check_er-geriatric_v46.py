import yaml, re, collections, itertools
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
o=yaml.safe_load(open(D+'er-geriatric.yaml'))
b=yaml.safe_load(open(D+'base-er-geriatric.yaml'))
# nuance/기존 키 불변 확인
for so,sb in zip(o['situations'],b['situations']):
    for x,y in zip(so['sentences'],sb['sentences']):
        for k in y: assert x[k]==y[k],(so['title'],k)
    for n1,n2 in zip(so['nuance'],sb['nuance']):
        assert n1['kind']==n2['kind']
        for k in n2:
            if n1['kind']=='context' and k in('scenes','why'): continue
            assert n1[k]==n2[k],(so['title'],k)
        if n1['kind']=='context':
            for a,c in zip(n1['scenes'],n2['scenes']):
                for k in('who','icon','ok','tone'): assert a.get(k)==c.get(k)
                if a['ok']: pass
                assert ('fix' in a)==('fix' in c)
print('base keys intact')
out=[]
bund=collections.Counter()
for si,s in enumerate(o['situations']):
    out.append(f'\n## {si} {s["title"]}')
    for j,x in enumerate(s['sentences']):
        bl=x['blank']; a=bl['answer']; opts=[p['en'] for p in bl['options']]
        out.append(f'[{si}.{j}] KO: {x["ko"]}')
        out.append(f'    DIST: {x["distractorsKo"]}   TAG:{x["tag"]}  DECOY: {x["decoy"]}')
        for e in opts:
            line=re.sub(r'(?<![A-Za-z0-9])'+re.escape(a)+r'(?![A-Za-z0-9])',e,x['en'],count=1)
            out.append('    '+('* ' if e==a else '  ')+line)
        bund[tuple(sorted(opts[0:0]+[e for e in opts if e!=a]))]+=1
    L=s['order']['lines']
    out.append('  ORDER:')
    for l in L: out.append('     - '+l['en'])
    for i in range(3):
        sw=L[:]; sw[i],sw[i+1]=sw[i+1],sw[i]
        out.append(f'   swap{i+1}/{i+2}: '+' || '.join(l['en'] for l in sw))
    for l in L:
        if re.match(r'(If|In that case|While|Once|Until|After|Meanwhile|And|Also|Then|First|Last|Along|Based)\b',l['en']) or re.search(r'\b(meanwhile|too)\b',l['en']): out.append('  !! cond/time/connective: '+l['en'])
open(D+'review_er-geriatric_v46.txt','w').write('\n'.join(out))
print('dup distractor bundles:',[b for b,c in bund.items() if c>1])
allopt=collections.Counter(e for s in o['situations'] for x in s['sentences'] for e in [p['en'] for p in x['blank']['options']] if e!=x['blank']['answer'])
print([ (e,c) for e,c in allopt.items() if c>2])
print(sum(len(s['sentences']) for s in o['situations']))
