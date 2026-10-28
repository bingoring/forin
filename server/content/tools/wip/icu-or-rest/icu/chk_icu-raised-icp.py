import yaml,re,sys
d=yaml.safe_load(open(sys.argv[1] if len(sys.argv)>1 else 'icu-raised-icp.yaml'))
def L(s): return len(re.sub(r'\s','',s))
def ok(a,b):
    la,lb=L(a),L(b); return max(la,lb)<=1.25*min(la,lb) or abs(la-lb)<=3
for i,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        ko=x['ko']; xs=x['distractorsKo']
        for k,q in enumerate(xs):
            if not ok(ko,q): print(f'LEN {i}.{j} X{k+1} {L(q)} vs {L(ko)}: {q}')
        if all(L(q)>L(ko) for q in xs): print(f'BOTHLONG {i}.{j} ko={L(ko)} X={[L(q) for q in xs]}')
