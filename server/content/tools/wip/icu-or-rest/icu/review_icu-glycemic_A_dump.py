import yaml,json,sys
d=yaml.safe_load(open('icu-glycemic.yaml'))
b=yaml.safe_load(open('base-icu-glycemic.yaml'))
kp=set()
for s in json.load(open('in-icu-glycemic.json'))['situations']: kp|=set(s['keyPhrases'])
bw={w['id']:w for w in b['words']}
use={}
for si,s in enumerate(d['situations']):
    for i,se in enumerate(s['sentences']):
        for w in se['words']: use.setdefault(w,[]).append(f"{si}.{i}")
mode=sys.argv[1]
def L(x): return len(x.replace(' ',''))
if mode=='words':
    for w in d['words']:
        o=bw.get(w['id'])
        ch='' if o and o['en']==w['en'] and o['ko']==w['ko'] else f" [BASE en={o['en'] if o else None} ko={o['ko'] if o else None}]"
        print(f"{w['id']} | {w['en']} | {w['ko']}{ch} | cue={w['cue']} | tag={w['tag']} | dEn={w['distractorsEn']} | dKo={w['distractorsKo']} | chips={'/'.join('+'.join(x) for x in w['chips'])} | decoy={w['decoyChips']} | ex={w['example']} | use={use.get(w['id'])}")
elif mode=='sent':
    for si,s in enumerate(d['situations']):
        print(f"=== S{si} {s['title']}")
        bs=b['situations'][si]['sentences']
        for i,se in enumerate(s['sentences']):
            k='KP' if se['en'] in kp else '  '
            chg=''
            if i<len(bs) and (bs[i]['en']!=se['en'] or bs[i]['ko']!=se['ko']): chg=f" [BASE {bs[i]['en']} / {bs[i]['ko']}]"
            print(f"{si}.{i} {k} {se['en']} | {se['ko']}{chg}\n   chunks: {' / '.join(se['chunks'])}\n   words: {se['words']}")
elif mode=='nuance':
    for si,s in enumerate(d['situations']):
        print(f"=== S{si} {s['title']}")
        for n in s['nuance']:
            print(json.dumps(n,ensure_ascii=False))
