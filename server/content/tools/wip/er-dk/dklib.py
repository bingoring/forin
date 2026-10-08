import re,json,yaml
def q(s):
    return json.dumps(s,ensure_ascii=False)
def apply(topic,D):
    p=f'base-er-{topic}.yaml'
    L=open(p,encoding='utf-8').read().split('\n')
    d=yaml.safe_load(open(p,encoding='utf-8'))
    exp=sum(len(s['sentences']) for s in d['situations'])
    assert len(D)==exp,(len(D),exp)
    si=-1;i=-1;insit=False;done=0;out=[];k=0
    while k<len(L):
        l=L[k]
        if l.startswith('situations:'): insit=True
        if insit and l.startswith('- title:'): si+=1;i=-1
        if insit and l.startswith('  - en:'): i+=1
        if insit and l=='    distractorsKo:':
            a,b=D[f'{si}.{i}']
            assert L[k+1].startswith('    - ') and L[k+2].startswith('    - ') and not L[k+3].startswith('    - '),(si,i)
            out+= [l,'    - '+q(a),'    - '+q(b)]; k+=3; done+=1; continue
        out.append(l); k+=1
    assert done==exp,(done,exp)
    open(p,'w',encoding='utf-8').write('\n'.join(out))
    # show
    d=yaml.safe_load(open(p,encoding='utf-8'))
    for s_i,s in enumerate(d['situations']):
        for j,x in enumerate(s['sentences']):
            print(f"{s_i}.{j} | {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}")

def fixwords(topic,F):
    """F: {(id,field):[a,b]}"""
    p=f'base-er-{topic}.yaml'
    L=open(p,encoding='utf-8').read().split('\n')
    cur=None;out=[];k=0;n=0
    while k<len(L):
        l=L[k]
        if l.startswith('situations:'): cur=None;F_stop=True
        m=re.match(r'- id: (\S+)',l)
        if m: cur=m.group(1)
        m2=re.match(r'  (distractorsKo|distractorsEn):$',l)
        if m2 and cur and (cur,m2.group(1)) in F:
            a=F[(cur,m2.group(1))]
            assert len(a)==2 and L[k+1].startswith('  - ') and L[k+2].startswith('  - ') and not L[k+3].startswith('  - '),(cur,)
            out+=[l,'  - '+q(a[0]),'  - '+q(a[1])];k+=3;n+=1;continue
        out.append(l);k+=1
    assert n==len(F),(n,len(F))
    open(p,'w',encoding='utf-8').write('\n'.join(out))

def fixblank(topic,B):
    """B: {'si.i':[d1,d2,d3]} replace the non-answer options in order"""
    p=f'base-er-{topic}.yaml'
    L=open(p,encoding='utf-8').read().split('\n')
    si=-1;i=-1;insit=False;k=0;n=0
    while k<len(L):
        l=L[k]
        if l.startswith('situations:'): insit=True
        if insit and l.startswith('- title:'): si+=1;i=-1
        if insit and l.startswith('  - en:'): i+=1
        key=f'{si}.{i}'
        if insit and l=='      answer: '+L[k][len('      answer: '):] and l.startswith('      answer:') and key in B:
            ans=l[len('      answer: '):].strip().strip('"\'')
            assert L[k+1]=='      options:',(key,L[k+1])
            ds=list(B[key]);
            for j in range(2,6):
                m=re.match(r'      - en: (.*)$',L[k+j]); assert m,(key,L[k+j])
                v=m.group(1).strip().strip('"\'')
                if v!=ans:
                    L[k+j]='      - en: '+q(ds.pop(0))
            assert not ds,key
            n+=1
        k+=1
    assert n==len(B),(n,len(B))
    open(p,'w',encoding='utf-8').write('\n'.join(L))
