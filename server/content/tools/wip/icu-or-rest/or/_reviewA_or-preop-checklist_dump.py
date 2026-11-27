import yaml, json, sys, re
D='/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/or/'
t=yaml.safe_load(open(D+'or-preop-checklist.yaml'))
inj=json.load(open(D+'in-or-preop-checklist.json'))
kp={}
for s in inj['situations']:
    kp[s['title']]=(set(s['keyPhrases']),s.get('role'),s.get('brief'))
mode=sys.argv[1]
W={w['id']:w for w in t['words']}
def nsp(x): return len(x.replace(' ',''))
if mode=='words':
    for w in t['words']:
        print(f"{w['id']} | {w['en']} | {w['ko']} | tag={w['tag']} | dEn={w['distractorsEn']} | dKo={w['distractorsKo']} | chips={w['chips']} | decoy={w['decoyChips']}\n   cue={w['cue']}\n   ex={w['example']} / {w['exKo']}")
elif mode=='sents':
    for i,s in enumerate(t['situations']):
        k,role,brief=kp[s['title']]
        print(f"\n## {i} {s['title']} (role={role}) {brief}")
        for j,x in enumerate(s['sentences']):
            m='KP' if x['en'] in k else '  '
            print(f"{i}.{j} {m} {x['en']}\n      ko={x['ko']}\n      ch={' / '.join(x['chunks'])}\n      w={x['words']} | why={x.get('why')}")
elif mode=='nuance':
    for i,s in enumerate(t['situations']):
        k,role,brief=kp[s['title']]
        print(f"\n## {i} {s['title']} (role={role})")
        for n in s['nuance']:
            print(json.dumps(n,ensure_ascii=False,indent=1))
elif mode=='lens':
    for w in t['words']:
        for d in w['distractorsEn']:
            a,b=nsp(w['en']),nsp(d)
            if not (max(a,b)<=1.25*min(a,b) or abs(a-b)<=3): print('EN',w['id'],w['en'],d)
        for d in w['distractorsKo']:
            a,b=nsp(w['ko']),nsp(d)
            if not (max(a,b)<=1.25*min(a,b) or abs(a-b)<=3): print('KO',w['id'],w['ko'],d)
elif mode=='combos':
    for i,s in enumerate(t['situations']):
        for n in s['nuance']:
            if n['kind']=='pair':
                L=[p[0] for p in n['pairs']]; R=[p[1] for p in n['pairs']]+n['decoys']
                print(f"\n## {i} pair ans={n['pairs']}")
                for l in L:
                    for r in R: print('   ',l,'+',r)
            if n['kind']=='swap':
                print(f"\n## {i} swap ko={n.get('ko')} ans={n['answer']}")
                for o in n['options']: print('   ',repr(n['before'][0]+o+n['before'][2]))
            if n['kind']=='slider':
                print(f"\n## {i} slider ans={n['answerAt']} cue={n['cue']}")
                for q,o in enumerate(n['scale']): print('   ',q,('*' if q==n['answerAt'] else ' '),o,len(o))
            if n['kind']=='context':
                print(f"\n## {i} context word={n.get('word')} ko={n.get('ko')}")
                for sc in n['scenes']: print('   ',sc.get('who'),'|',sc['en'],'|',sc['ok'],'|',sc.get('fix',''), '| has word:', n.get('word','').lower() in sc['en'].lower())
                print('    why=',n.get('why'))
