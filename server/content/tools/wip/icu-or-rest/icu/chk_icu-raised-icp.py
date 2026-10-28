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
# W19 재현
import collections
def stems(t): return {tok[:2] if len(tok)>=2 else tok for tok in re.findall(r'[가-힣]+',t or '')}
Q=re.compile(r"^(무엇|어디|언제|누가|누구|왜|어떻|몇|얼마|[0-9]|한|두|세|네|다섯|여섯|일곱|여덟|아홉|열)")
c=collections.defaultdict(list)
for i,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        mine=stems(x['ko'])
        for k,q in enumerate(x['distractorsKo']):
            for st in stems(q)-mine: c[st].append(f'{i}.{j}X{k+1}')
for st,v in sorted(c.items(),key=lambda a:-len(a[1])):
    cap=7 if Q.match(st) else 5
    if len(v)>=cap: print('W19',st,len(v),' '.join(v))
