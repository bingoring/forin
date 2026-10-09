import re,json,yaml
def q(s): return json.dumps(s,ensure_ascii=False)
def apply(topic,edits,words=None,blanks=None):
    p=f'base-er-{topic}.yaml'
    L=open(p,encoding='utf-8').read().split('\n')
    full={}
    for k,v in edits.items():
        if '/' in k:
            key,i=k.split('/'); full.setdefault(key,{})[int(i)]=v
        else:
            assert len(v)==2,k
            full.setdefault(k,{})[0]=v[0]; full[k][1]=v[1]
    words=words or {}; blanks=blanks or {}
    _d=yaml.safe_load(open(p,encoding='utf-8'))
    _ko={f'{a}.{b}':x['ko'] for a,s_ in enumerate(_d['situations']) for b,x in enumerate(s_['sentences'])}
    def fix(key,t):
        ko=_ko[key].rstrip(); tail=ko[-1] if ko[-1] in '.?!' else ''
        return t.rstrip('.?!')+tail
    for key in full:
        for j in full[key]: full[key][j]=fix(key,full[key][j])
    si=-1;i=-1;insit=False;cur=None;k=0;out=[];used=set();wused=set();bused=set()
    cursent=None
    while k<len(L):
        l=L[k]
        if l.startswith('situations:'): insit=True
        if insit and l.startswith('- title:'): si+=1;i=-1
        if insit and l.startswith('  - en:'): i+=1
        key=f'{si}.{i}'
        if not insit:
            m=re.match(r'- id: (\S+)',l)
            if m: cur=m.group(1)
            m2=re.match(r'  (distractorsKo|distractorsEn):$',l)
            if m2 and (cur,m2.group(1)) in words:
                a=words[(cur,m2.group(1))]
                assert L[k+1].startswith('  - ') and L[k+2].startswith('  - ') and not L[k+3].startswith('  - ')
                out+=[l,'  - '+q(a[0]),'  - '+q(a[1])];k+=3;wused.add((cur,m2.group(1)));continue
        if insit and l=='    distractorsKo:' and key in full:
            assert L[k+1].startswith('    - ') and L[k+2].startswith('    - ') and not L[k+3].startswith('    - '),key
            e=full[key]
            out.append(l)
            for j in (0,1):
                if j in e: out.append('    - '+q(e[j])); used.add((key,j))
                else: out.append(L[k+1+j])
            k+=3;continue
        if insit and key in blanks and l.startswith('      options:'):
            pairs=blanks[key]
            if isinstance(pairs,tuple): pairs=[pairs]
            ok=0
            for old,new in pairs:
                for j in range(1,5):
                    m=re.match(r'      - en: (.*)$',L[k+j]); assert m,(key,L[k+j])
                    v=m.group(1).strip().strip('"\'')
                    if v==old: L[k+j]='      - en: '+q(new); ok+=1
            assert ok==len(pairs),(key,pairs); bused.add(key)
        out.append(l);k+=1
    exp={(key,j) for key,e in full.items() for j in e}
    assert exp==used,(exp-used)
    assert set(words)==wused,(set(words)-wused)
    assert set(blanks)==bused
    open(p,'w',encoding='utf-8').write('\n'.join(out))
    d=yaml.safe_load(open(p,encoding='utf-8'))
    for key in sorted(set(list(full)+list(blanks)),key=lambda s:tuple(map(int,s.split('.')))):
        a,b=map(int,key.split('.'));x=d['situations'][a]['sentences'][b]
        print(f"{key} | {x['en']} | {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}"+(f" | OPT {[o['en'] for o in x['blank']['options']]}" if key in blanks else ''))
