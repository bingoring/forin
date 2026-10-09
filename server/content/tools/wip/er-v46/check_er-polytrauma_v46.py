import yaml,re
d=yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-polytrauma.yaml'))
cond=re.compile(r'^(If so|If it does|If not|In that case|If any of those)',re.I)
bad=0
for si,s in enumerate(d['situations']):
    print('##',si,s['title'])
    for j,t in enumerate(s['sentences']):
        a=t['blank']['answer']; print(f" [{j}] ko:{t['ko']}")
        for o in sorted(t['blank']['options'],key=lambda x:x['en']!=a):
            print('    ',('*' if o['en']==a else ' '), re.sub(r'(?i)(?<![\w-])'+re.escape(a)+r'(?![\w-])',o['en'],t['en'],count=1))
        print('     K:',t['distractorsKo'],'| D:',t['decoy'])
    L=[l['en'] for l in s['order']['lines']]
    for l in L:
        if cond.match(l): print('  COND!',l); bad+=1
    for k in range(3):
        M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',k+1,'|',' / '.join(M))
    for n in s['nuance']:
        if n['kind']=='context':
            aw=[x for x in n['scenes'] if not x['ok']][0]['en']
            ok=n['word'] in aw
            print('  CTX',n['word'],'in awkward:',ok); bad+= (not ok)
print('bad',bad)
