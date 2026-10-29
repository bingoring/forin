import re,sys
def patch(fn,P):
    s=open(fn,encoding='utf-8').read(); out=[]
    for l in s.split('\n'):
        m=re.match(r'- \{id: ([\w-]+),',l)
        if m and m.group(1) in P:
            for k,v in P[m.group(1)].items():
                assert re.search(k+r': \[[^\]]*\]',l),(m.group(1),k)
                l=re.sub(k+r': \[[^\]]*\]',k+': '+v,l,count=1)
        out.append(l)
    open(fn,'w',encoding='utf-8').write('\n'.join(out))
