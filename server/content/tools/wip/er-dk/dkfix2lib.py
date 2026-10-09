import yaml,re,sys
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/'
def n(s): return len(re.sub(r'\s','',s))
def ok(a,b):
    la,lb=n(a),n(b); return max(la,lb)<=1.25*min(la,lb) or abs(la-lb)<=3
def run(theme,items,WKO=None,WEN=None,BL=None):
    f=D+f'base-er-{theme}.yaml'; d=yaml.safe_load(open(f)); bad=0; shown=[]
    for key,slot,v in items:
        si,xi=map(int,key.split('.')); x=d['situations'][si]['sentences'][xi]
        x['distractorsKo'][slot-1]=v
        if (si,xi) not in shown: shown.append((si,xi))
        if not ok(v,x['ko']): print('LEN',key,x['ko'],v); bad+=1
    for (si,xi) in shown:
        x=d['situations'][si]['sentences'][xi]
        a,b=x['distractorsKo']
        assert a!=b,(si,xi)
        if min(n(a),n(b))>n(x['ko']): print('LONG',si,xi,x['ko'],a,b); bad+=1
    ids={w['id']:w for w in d['words']}
    for k,v in (WKO or {}).items(): ids[k]['distractorsKo']=v
    for k,v in (WEN or {}).items(): ids[k]['distractorsEn']=v
    for key,(old,new) in (BL or {}).items():
        si,xi=map(int,key.split('.')); o=d['situations'][si]['sentences'][xi]['blank']['options']
        hit=[q for q in o if q['en']==old]; assert len(hit)==1; hit[0]['en']=new
    if bad: print('NOT SAVED'); return
    open(f,'w').write(yaml.dump(d,allow_unicode=True,sort_keys=False,width=1000))
    for (si,xi) in sorted(shown):
        x=d['situations'][si]['sentences'][xi]
        print(f"{si}.{xi} {x['en']} | {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}")
