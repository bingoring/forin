import yaml,re,collections
d=yaml.safe_load(open('icu-stroke-icu.yaml'))
def st(t): return {x[:2] if len(x)>=2 else x for x in re.findall(r"[가-힣]+",t)}
c=collections.Counter(); where=collections.defaultdict(list)
dc=collections.Counter(); bw=collections.Counter()
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    m=st(x['ko'])
    for dk in x['distractorsKo']:
      for w in st(dk)-m: c[w]+=1; where[w].append(f"{si}-{j}")
    dc[x['decoy'].lower()]+=1
    for o in x['blank']['options']:
      if o['en']!=x['blank']['answer']: bw[o['en'].lower()]+=1
for w,n in c.most_common(15): print(w,n,where[w])
print('decoy',[x for x in dc.most_common(8)])
print('blank',[x for x in bw.most_common(12)])
