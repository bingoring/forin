import yaml,sys,re,collections
sys.path.insert(0,'.')
from importlib import import_module
T=import_module('_reviewB_core-safety-or_tags')
f=sys.argv[1]; which=sys.argv[2]  # before|after
show=len(sys.argv)>3
d=yaml.safe_load(open(f)); TAG=T.BEFORE if which=='before' else T.AFTER
# 앞 단계 관형절 틀: '확인할 동의서를 꺼내요' — 관형형 동사 + 명사(+조사)
ADN=r'(?:할|볼|셀|읽을|물을|들을|살필|적을|알릴|붙일|부을|짚을|따질|말할|대조할|점검할|완료할|문서화할|제출할|브리핑할|보고할|보존할|확인할|동의할|구할|제기할|수색할|다시 볼|다시 셀)'
MARK={
 '관형절 앞 단계(~할 X를 …)': ADN+r' (?!수\b|때|만한|거|것|줄|뿐)[가-힣]+',
 '~려고/~려면': r'려고|려면',
 '~기 전에': r'기 전에|기 전엔',
 '~는 동안': r'동안',
 '~도록': r'도록',
 '~게(목적: ~시게·~수 있게·~하게 + 동사)': r'시게 |수 있게|[가-힣]하게 [가-힣]+(요|어요)|세게 ',
 '~면(조건)': r'(?<![측화])[가-힣]면 ',
 '먼저/부터': r'먼저|부터',
 '~고 나서/~한 뒤': r'고 나서|뒤에 |뒤엔 ',
 '~법이에요/~죠': r'법이|법입|죠[.?]',
}
def has(r,t): return bool(re.search(r,t))
mk_d=collections.Counter(); mk_k=collections.Counter(); hits=collections.defaultdict(list)
both_same_mark=[]
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        ko=x['ko']; ds=x['distractorsKo']; k=f'{si}.{j}'
        for m,r in MARK.items():
            if has(r,ko): mk_k[m]+=1
            dd=[has(r,t) and not has(r,ko) for t in ds]
            for t,h in zip(ds,dd):
                if h: mk_d[m]+=1; hits[m].append(f'{k}:{t}')
            if all(dd): both_same_mark.append(f'{k}({m})')
print('표지(오답에만 있는 칸 / 정답 ko 문장)')
for m in MARK:
    print(f'   {m}: {mk_d[m]} / {mk_k[m]}')
    if show:
        for h in hits[m]: print('        ',h)
print('오답 둘 다 같은 표지 틀:',len(both_same_mark),' '.join(both_same_mark))
ff=[k for k,v in TAG.items() if v=='FF']
print('오답 둘 다 사실문:',len(ff),' '.join(ff))
c=collections.Counter(ch for v in TAG.values() for ch in v)
print('칸 모양(S 같은 틀·세부 / P 앞 단계 / N 뒤 단계 / F 사실):',dict(c))
longer=[]
def ln(s): return len(re.sub(r'\s','',s))
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        if min(ln(t) for t in x['distractorsKo'])>ln(x['ko']): longer.append(f'{si}.{j}')
print('오답 둘 다 정답보다 긴 문장:',len(longer))
dshape=collections.Counter(); dw=collections.Counter()
STOP=set('the a an and to of in on at it this that i we my is for one if before while than all re i\'m i\'ll let\'s s'.split())
for s in d['situations']:
    for x in s['sentences']:
        dc=x['decoy'];w=dc.split()
        if re.match(r'(in|on|at|from|to|for|by|before|after|while|until|than|of)\b',dc,re.I): dshape['전치사구']+=1
        elif re.match(r'(and|or)\b',dc,re.I): dshape['and 구']+=1
        elif re.search(r"^(I|I'm|I'll|Let's|If|Any|Even)\b|,$",dc): dshape['절·주어 구']+=1
        elif len(w)==1: dshape['한 낱말']+=1
        else: dshape['명사구·동사구']+=1
        for t in set(re.findall(r"[a-z']+",dc.lower()))-STOP: dw[t]+=1
print('decoy 모양:',dict(dshape))
print('decoy 낱말 3회 이상:',[(k,v) for k,v in dw.most_common() if v>=3])
pos=collections.Counter(); bw=collections.Counter()
for s in d['situations']:
    for x in s['sentences']:
        ops=[o['en'] for o in x['blank']['options']]; pos[ops.index(x['blank']['answer'])]+=1
        for o in ops:
            if o!=x['blank']['answer']: bw[o]+=1
print('빈칸 정답 위치(1~4):',[pos[i] for i in range(4)])
print('빈칸 오답 최다:',bw.most_common(1),' 3회인 것',sum(1 for v in bw.values() if v==3))
