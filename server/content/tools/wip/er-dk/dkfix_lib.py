import yaml,re,sys
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/'
def n(s): return len(re.sub(r'\s','',s))
def ok(a,b):
    la,lb=n(a),n(b); return max(la,lb)<=1.25*min(la,lb) or abs(la-lb)<=3
def fix(theme,S,WKO=None,WEN=None):
    """S: {(si,xi):(d1|None,d2|None)}"""
    f=D+f'base-{theme}.yaml'; d=yaml.safe_load(open(f)); bad=0
    for (si,xi),(a,b) in S.items():
        x=d['situations'][si]['sentences'][xi]
        for k,v in enumerate((a,b)):
            if v is None: continue
            x['distractorsKo'][k]=v
            if not ok(v,x['ko']): print('LEN',si,xi,x['ko'],v); bad+=1
        assert x['distractorsKo'][0]!=x['distractorsKo'][1]
    ids={w['id']:w for w in d['words']}
    for k,v in (WKO or {}).items(): ids[k]['distractorsKo']=v
    for k,v in (WEN or {}).items(): ids[k]['distractorsEn']=v
    if bad: print('NOT SAVED'); return
    open(f,'w').write(yaml.dump(d,allow_unicode=True,sort_keys=False,width=1000))
    for (si,xi) in S:
        x=d['situations'][si]['sentences'][xi]
        print(f"{si}.{xi} {x['en']} | {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}")
