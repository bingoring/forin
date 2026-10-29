import yaml,re,sys,glob
HERE='/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu'
d=yaml.safe_load(open(f'{HERE}/icu-invasive-lines.A.yaml'))
def L(s): return len(s.replace(' ',''))
def ok(a,b): return max(a,b)<=1.25*min(a,b) or abs(a-b)<=3
bad=0
for w in d['words']:
    if 'cue' not in w: continue
    i=w['id']; en=w['en']; ko=w['ko']
    for o in w['distractorsKo']:
        if o==ko or o.replace(' ','')==ko.replace(' ',''): print(i,'dKo==ko',o); bad+=1
        if not ok(L(o),L(ko)): print(i,'dKo len',o,ko); bad+=1
    for o in w['distractorsEn']:
        if o.lower()==en.lower(): print(i,'dEn==en',o); bad+=1
        if not ok(L(o),L(en)): print(i,'dEn len',o,en); bad+=1
        a,b=o.lower().replace(' ',''),en.lower().replace(' ','')
        if a.startswith(b) or b.startswith(a) and abs(len(a)-len(b))<=2: print(i,'dEn form?',o,en)
    j=' '.join(''.join(x) for x in w['chips'])
    if j!=en: print(i,'chips!=en',j,en); bad+=1
    n=sum(len(x) for x in w['chips'])
    if n>6 or any(len(x)>4 for x in w['chips']): print(i,'too many pieces'); bad+=1
    pool=[p for x in w['chips'] for p in x]
    dec=w['decoyChips']
    for p in dec:
        if p in pool: print(i,'decoy in chips',p); bad+=1
    # respell: any sequence of pool+decoy chips spelling en (no spaces) using a decoy
    target=en.replace(' ','')
    allc=set(pool)|set(dec)
    from functools import lru_cache
    @lru_cache(None)
    def can(pos,usedd):
        if pos==len(target): return usedd
        for c in allc:
            if target.startswith(c,pos):
                if can(pos+len(c),usedd or (c in dec)): return True
        return False
    if can(0,False): print(i,'respell via decoy',en,dec); bad+=1
    if en.lower() in w['cue'].lower(): print(i,'cue has en'); bad+=1
print('bad',bad)
