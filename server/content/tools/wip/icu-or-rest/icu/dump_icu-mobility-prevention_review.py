import yaml,sys,json
d=yaml.safe_load(open('icu-mobility-prevention.yaml'))
b=yaml.safe_load(open('base-icu-mobility-prevention.yaml'))
bw={w['id']:w for w in b['words']}
mode=sys.argv[1]
if mode=='words':
    for w in d['words']:
        o=bw.get(w['id'])
        ch=''
        if o is None: ch='[NEW]'
        else:
            ch=' '.join(f"{k}:{o.get(k)}" for k in ['en','ko','example'] if o.get(k)!=w.get(k))
        print(f"{w['id']}|{w['en']}|{w['ko']}|{w['tag']}|cue={w['cue']}|dEn={w['distractorsEn']}|dKo={w['distractorsKo']}|chips={w['chips']}|dc={w['decoyChips']}|ex={w['example']}/{w['exKo']} {('CHG '+ch) if ch else ''}")
if mode=='sent':
    inp=json.load(open('in-icu-mobility-prevention.json'))
    kp={s['title']:s['keyPhrases'] for s in inp['situations']}
    bs={s['title']:s for s in b['situations']}
    for si,s in enumerate(d['situations']):
        print(f"\n## [{si}] {s['title']}")
        bss=bs[s['title']]['sentences']
        for i,x in enumerate(s['sentences']):
            k='KP' if x['en'] in kp[s['title']] else '  '
            o=bss[i] if i<len(bss) else {}
            diff=[f for f in ['en','ko','chunks','words'] if o.get(f)!=x.get(f)]
            print(f"{i} {k} {x['en']} | {x['ko']} | {' / '.join(x['chunks'])} | {x['words']} {'DIFF:'+str(diff)+' was '+str(o.get('words')) if diff else ''}")
