import yaml,collections
a=yaml.safe_load(open('core-language-icu.pre-fix.yaml')); b=yaml.safe_load(open('core-language-icu.yaml'))
def diff(x,y,path,out):
    if isinstance(x,dict) and isinstance(y,dict):
        for k in list(x)+[k for k in y if k not in x]: diff(x.get(k),y.get(k),path+[k],out)
    elif isinstance(x,list) and isinstance(y,list) and len(x)==len(y):
        for i,(p,q) in enumerate(zip(x,y)): diff(p,q,path+[i],out)
    elif x!=y: out.append((path,x,y))
out=[]
WA={w['id']:w for w in a['words']}; WB={w['id']:w for w in b['words']}
for wid in WA:
    if wid not in WB: print('W REMOVED',wid); continue
    o=[]; diff(WA[wid],WB[wid],[],o)
    for p,x,y in o:
        if p[0] in('cue','ko','exKo') or p[0]=='en': print('W',wid,p[0],'|',x,'->',y)
sent=collections.defaultdict(set)
for si,(s,t) in enumerate(zip(a['situations'],b['situations'])):
    o=[]; diff(s,t,[],o)
    for p,x,y in o:
        if p[0]=='sentences': sent[f"{si}.{p[1]}"].add(p[2])
        elif p[0]=='nuance': sent[f"S{si} nuance[{p[1]}]"].add(p[2] if len(p)>2 else '')
        else: sent[f"S{si} order"].add('.'.join(map(str,p[1:3])))
for k,v in sorted(sent.items(),key=lambda z:(int(z[0].split('.')[0].lstrip('S').split()[0]),z[0])): print(k,sorted(v))
