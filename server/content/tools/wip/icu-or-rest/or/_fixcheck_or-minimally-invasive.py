import yaml,sys
T='or-minimally-invasive'
a=yaml.safe_load(open(f'{T}.pre-fix.yaml')); b=yaml.safe_load(open(f'{T}.yaml')); af=yaml.safe_load(open(f'_reviewB_{T}_after.yaml'))
out=[]
def P(*x): out.append(' '.join(str(i) for i in x))
def short(v): 
    s=yaml.safe_dump(v,allow_unicode=True,sort_keys=False,width=1000,default_flow_style=True).strip().replace('\n',' ')
    return s
P('=== 단어 (pre-fix -> 결과)')
A={w['id']:w for w in a['words']}; B={w['id']:w for w in b['words']}
for i in A:
    if i not in B: P(f'[삭제] {i}'); continue
    for k in sorted(set(A[i])|set(B[i])):
        if A[i].get(k)!=B[i].get(k): P(f'{i}.{k}: {short(A[i].get(k))}  ->  {short(B[i].get(k))}')
for i in B:
    if i not in A: P('[추가]',i)
P(); P('=== 문장 필드 (pre-fix -> 결과)  [B 사본과 다른 것에 *]')
nb=0
for si,(sa,sb,sf) in enumerate(zip(a['situations'],b['situations'],af['situations'])):
    for j,(x,y,z) in enumerate(zip(sa['sentences'],sb['sentences'],sf['sentences'])):
        for k in sorted(set(x)|set(y)):
            if x.get(k)!=y.get(k):
                mark='*' if y.get(k)!=z.get(k) else ' '
                P(f'{mark}{si}.{j} {sb["title"]} / {y["en"][:40]} .{k}: {short(x.get(k))}  ->  {short(y.get(k))}')
P(); P('=== 뉘앙스')
for si,(sa,sb) in enumerate(zip(a['situations'],b['situations'])):
    for n,(x,y) in enumerate(zip(sa['nuance'],sb['nuance'])):
        for k in sorted(set(x)|set(y)):
            if x.get(k)!=y.get(k): P(f'{si}.{n} {sb["title"]} {y["kind"]}.{k}: {short(x.get(k))}  ->  {short(y.get(k))}')
P(); P('=== order (pre-fix -> 결과, * = B 사본과 다른 것)')
for si,(sa,sb,sf) in enumerate(zip(a['situations'],b['situations'],af['situations'])):
    x,y,z=sa['order'],sb['order'],sf['order']
    for k in ('tag','icon','ko','why'):
        if x[k]!=y[k]: P(f'{"*" if y[k]!=z[k] else " "}{si} {sb["title"]} order.{k}: {x[k]} -> {y[k]}')
    for l,(p,q,r) in enumerate(zip(x['lines'],y['lines'],z['lines'])):
        for k in sorted(set(p)|set(q)):
            if p.get(k)!=q.get(k): P(f'{"*" if q.get(k)!=r.get(k) else " "}{si} {sb["title"]} order.lines[{l}].{k}: {p.get(k)} -> {q.get(k)}')
open(f'_fixcheck_{T}.txt','w').write('\n'.join(out)+'\n')
print(len(out),'lines')
