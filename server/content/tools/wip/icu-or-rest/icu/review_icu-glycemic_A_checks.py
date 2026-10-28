import yaml,collections
d=yaml.safe_load(open('icu-glycemic.yaml'))
L=lambda x:len(x.replace(' ',''))
bad=set('die dye rip kill dead death grave coffin funeral bury corpse beer wine gin rum vodka booze drunk bar pub sod damn hell crap piss ass tit slut whore fool idiot dumb stupid mad sue lie flesh grieve kidnap brew dump smoke loss lost cry'.split())
ko=collections.defaultdict(list)
for w in d['words']:
    ko[w['ko']].append(w['id'])
    for x in w['decoyChips']+w['distractorsEn']:
        if x.lower() in bad: print('SENS',w['id'],x)
    for dd in w['distractorsEn']:
        a,b=L(w['en']),L(dd)
        if not (max(a,b)<=1.25*min(a,b) or abs(a-b)<=3): print('LEN-EN',w['id'],w['en'],dd)
    for dd in w['distractorsKo']:
        a,b=L(w['ko']),L(dd)
        if not (max(a,b)<=1.25*min(a,b) or abs(a-b)<=3): print('LEN-KO',w['id'],w['ko'],dd)
    # distractorKo equal to other bank ko
for w in d['words']:
    for dd in w['distractorsKo']:
        if dd in ko: print('DKO=bank ko',w['id'],dd,ko[dd])
    for dd in w['distractorsEn']:
        for v in d['words']:
            if v['en']==dd: print('DEN=bank',w['id'],dd,v['ko'],'vs',w['ko'])
for k,v in ko.items():
    if len(v)>1: print('SAMEKO',k,v)
# swap concatenations
for si,s in enumerate(d['situations']):
    for n in s['nuance']:
        if n['kind']=='swap':
            for o in n['options']: print('SWAP',si,n['before'][0]+o+n['before'][2])
        if n['kind']=='context':
            for sc in n['scenes']:
                if n['word'].lower() not in sc['en'].lower(): print('CTX-MISS',si,n['word'],sc['en'])
