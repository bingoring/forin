import yaml,re,collections
d=yaml.safe_load(open(__import__('sys').argv[1]))
JOS=['으로','에서','에게','까지','부터','이나','하고','처럼','보다','를','을','이','가','은','는','에','와','과','도','로','의','나','만']
def toks(s):
    out=[]
    for w in re.findall(r'[가-힣A-Za-z0-9]+',s):
        for j in JOS:
            if w.endswith(j) and len(w)>len(j)+0: w=w[:-len(j)];break
        out.append(w)
    return out
def stem(w): return w[:2] if len(w)>=2 else w
cnt=collections.Counter(); where=collections.defaultdict(list)
scnt=collections.Counter(); swhere=collections.defaultdict(list)
for i,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        ko=set(toks(x['ko'])); kos={stem(w) for w in ko}
        for k,dk in enumerate(x['distractorsKo']):
            for w in set(toks(dk))-ko:
                cnt[w]+=1; where[w].append(f'{i}-{j}')
            for st in {stem(w) for w in toks(dk)}-kos:
                scnt[st]+=1; swhere[st].append(f'{i}-{j}')
print('== 오답 전용 낱말(조사 뗌) 상위')
for w,c in cnt.most_common(25): print(c,w,where[w])
print('== 어간(앞 2자) 상위')
for w,c in scnt.most_common(25): print(c,w,swhere[w])
# decoys
dc=collections.Counter(); 
print('== decoys')
for i,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        print(f'{i}-{j}',repr(x['decoy']))
        for w in re.findall(r'[a-z]+',x['decoy'].lower()): dc[w]+=1
print([ (w,c) for w,c in dc.most_common(20)])
# blank option words
bc=collections.Counter()
for s in d['situations']:
    for x in s['sentences']:
        for o in x['blank']['options']:
            if o['en']!=x['blank']['answer']: bc[o['en'].lower()]+=1
print('blank wrong opts >=2:',[(w,c) for w,c in bc.most_common() if c>=2])
