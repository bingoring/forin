import yaml,json,sys,re
d=yaml.safe_load(open('icu-invasive-lines.yaml'))
mode=sys.argv[1]
W={w['id']:w for w in d['words']}
def L(s): return len(re.sub(r'\s','',s))
def lenok(a,b): la,lb=L(a),L(b); return max(la,lb)<=1.25*min(la,lb) or abs(la-lb)<=3
if mode=='words':
    for w in d['words']:
        flag=''
        for x in w['distractorsEn']:
            if not lenok(w['en'],x): flag+=' LEN-EN:'+x
        for x in w['distractorsKo']:
            if not lenok(w['ko'],x): flag+=' LEN-KO:'+x
        chips=' '.join('+'.join(p) for p in w['chips'])
        print(f"{w['id']}|{w['en']}|{w['ko']}|cue:{w['cue']}|tag:{w['tag']}|dEn:{w['distractorsEn']}|dKo:{w['distractorsKo']}|chips:{chips}|decoy:{w['decoyChips']}|ex:{w['example']}{flag}")
elif mode=='sent':
    kp=json.load(open('in-icu-invasive-lines.json'))
    for i,s in enumerate(d['situations']):
        kps=kp['situations'][i]['keyPhrases']
        print(f"=== {i} {s['title']}")
        for j,t in enumerate(s['sentences']):
            k='KP ' if t['en'] in kps else ''
            print(f"{i}.{j} {k}{t['en']} | {t['ko']} | {' / '.join(t['chunks'])} | {t['words']}")
elif mode=='nu':
    for i,s in enumerate(d['situations']):
        print(f"=== {i} {s['title']}")
        for n in s.get('nuance',[]):
            n=dict(n); k=n.pop('kind')
            if k=='swap':
                b=n['before']
                for o in n['options']: print('   SWAPREAD:',b[0]+o+b[2])
            if k=='pair':
                lefts=[p[0] for p in n['pairs']]; rights=[p[1] for p in n['pairs']]+list(n.get('decoys',[]))
                for l in lefts:
                    for r in rights: print('   PAIR:',l,'+',r)
            print(f" [{k}]", yaml.safe_dump(n,allow_unicode=True,width=300,default_flow_style=None))
