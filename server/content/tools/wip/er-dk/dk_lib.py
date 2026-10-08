import yaml,re,sys
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
from verify_lesson_content import length_tell
def run(topic,SENT,WKO=None,WEN=None,BLANK=None):
    WKO=WKO or {};WEN=WEN or {};BLANK=BLANK or {}
    p=f'/Users/ywyeom/private/forin/server/content/tools/wip/er-dk/base-{topic}.yaml'
    d=yaml.safe_load(open(p))
    seen=set();bad=0;n=0
    for s in d['situations']:
        for x in s['sentences']:
            en=x['en']
            if en not in SENT: print('MISSING',en);bad+=1;continue
            a=SENT[en]
            assert len(a)==2 and a[0]!=a[1],en
            for o in a:
                if length_tell(x['ko'],o): print('LEN',x['ko'],o);bad+=1
                if o==x['ko']: print('SAME',en);bad+=1
            x['distractorsKo']=list(a);seen.add(en);n+=1
            if en in BLANK:
                ans=x['blank']['answer']
                it=iter(BLANK[en]); assert len(BLANK[en])==3
                x['blank']['options']=[o if o['en']==ans else {'en':next(it)} for o in x['blank']['options']]
                for o in BLANK[en]:
                    if length_tell(ans,o): print('BLEN',ans,o)
                # keep answer position random-ish: original order kept
    extra=set(SENT)-seen
    if extra: print('EXTRA',extra);bad+=1
    ids={w['id']:w for w in d['words']}
    for k,v in WKO.items(): ids[k]['distractorsKo']=v
    for k,v in WEN.items(): ids[k]['distractorsEn']=v
    if bad: print('NOT SAVED',bad);return
    yaml.dump(d,open(p,'w'),allow_unicode=True,sort_keys=False,width=float('inf'))
    print('saved',n,len(WKO),len(WEN),len(BLANK))
    for s in d['situations']:
        for x in s['sentences']:
            print(f"{x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}")
