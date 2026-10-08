import yaml,re,collections,sys
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
d=yaml.safe_load(open(D+'er-poisoning.yaml'))
b=yaml.safe_load(open(D+'base-er-poisoning.yaml'))
verbose = len(sys.argv)>1
for s,t in zip(d['situations'],b['situations']):
    assert [n['kind'] for n in s['nuance']]==[n['kind'] for n in t['nuance']]
    assert s['sentences'][0]['en']==t['sentences'][0]['en']
NEG=re.compile(r'(않|못|절대|말고|아니|없)')
COND=re.compile(r"^(If so|If it does|If not|In that case|If any of those|While|Once|Until|After that|After the|When that|First|Last|Because of that|Going by that|And|Also|Then)\b")
ORD=re.compile(r"\b(first|last|second|third|next|then|also|too|and then)\b",re.I)
optsets=collections.Counter(); ansall=collections.Counter()
for si,s in enumerate(d['situations']):
    print('##',si,s['title'])
    for j,t in enumerate(s['sentences']):
        a=t['blank']['answer']
        ko=t['ko']
        if verbose:
            print(f" [{j}] ko:{ko}")
            for o in sorted(t['blank']['options'],key=lambda x:x['en']!=a):
                print('    ',('*' if o['en']==a else ' '), re.sub(r'(?i)(?<![\w-])'+re.escape(a)+r'(?![\w-])',o['en'],t['en'],count=1))
        for dk in t['distractorsKo']:
            if NEG.search(dk) and not NEG.search(ko): print(f'  !! [{j}] DK negation: {dk}')
            # token overlap with ko
            ov=len(set(dk.split())&set(ko.split()))
            if ov>=3: print(f'  !! [{j}] DK overlap {ov}: {dk} || {ko}')
        if verbose: print('     DK:',t['distractorsKo'],'| decoy:',t['decoy'],'| tag',t['tag'])
        key=tuple(sorted(o['en'] for o in t['blank']['options'][:])); optsets[key]+=1
        for o in t['blank']['options']:
            if o['en']!=a: ansall[o['en']]+=1
        if len(set(x['en'] for x in t['blank']['options']))!=4: print('  !! dup opt',si,j)
        # answer position distribution
    L=[l['en'] for l in s['order']['lines']]
    for l in L:
        if COND.match(l): print('  !! ORDER weak/cond start:',l)
        if ORD.search(l): print('  ?? ORDER ordinal/connector word:',l)
        if len(l.split())>15: print('  !! long line',l)
    if verbose:
        for k in range(3):
            M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',k+1,'|',' / '.join(M))
    for n in s['nuance']:
        if n['kind']=='context':
            w=n['word'].lower(); bad=[x for x in n['scenes'] if not x['ok']][0]
            print('  CTX',w,'| all scenes:',all(w in x['en'].lower() for x in n['scenes']), '| fix has word:', w in bad['fix'].lower())
            if verbose:
                for x in n['scenes']: print('      ',x['ok'],x['who'],'|',x['en'])
                print('       fix:',bad['fix'],'| why:',n['why'])
print('dup option sets',[k for k,v in optsets.items() if v>1])
print('reused wrong options (>=3):',[(k,v) for k,v in ansall.items() if v>=3])
pos=collections.Counter()
for s in d['situations']:
    for t in s['sentences']:
        pos[[o['en'] for o in t['blank']['options']].index(t['blank']['answer'])]+=1
print('answer positions',dict(pos))
