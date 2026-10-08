import yaml,re,collections
d=yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-diabetic.yaml'))
b=yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/base-er-diabetic.yaml'))
# nuance kinds unchanged
for s,t in zip(d['situations'],b['situations']):
    assert [n['kind'] for n in s['nuance']]==[n['kind'] for n in t['nuance']]
cnt=collections.Counter(); cond=[]
for si,s in enumerate(d['situations']):
    print('##',si,s['title'])
    for j,t in enumerate(s['sentences']):
        a=t['blank']['answer']; print(f" [{j}] ko:{t['ko']}")
        for o in sorted(t['blank']['options'],key=lambda x:x['en']!=a):
            print('    ',('*' if o['en']==a else ' '), re.sub(r'(?i)(?<![\w-])'+re.escape(a)+r'(?![\w-])',o['en'],t['en'],count=1))
        print('     DK:',t['distractorsKo'],'| decoy:',t['decoy'])
        cnt[tuple(sorted(o['en'] for o in t['blank']['options'][:]))]+=1
        for k in ('tag','icon','why'): assert t[k]
    L=[l['en'] for l in s['order']['lines']]
    for k in range(3):
        M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',k+1,'|',' / '.join(M))
    for l in L:
        if re.match(r"(If so|If it does|If not|In that case|If any of those)",l): cond.append((si,l))
    for n in s['nuance']:
        if n['kind']=='context':
            w=n['word'].lower(); bad=[x for x in n['scenes'] if not x['ok']][0]
            print('  CTX',w, 'in odd:',w in bad['en'].lower(), 'all:',all(w in x['en'].lower() for x in n['scenes']))
print('cond',cond)
print('dup option sets',[k for k,v in cnt.items() if v>1])
# --- extra lint
for si,s in enumerate(d['situations']):
    for j,t in enumerate(s['sentences']):
        for o in t['blank']['options']:
            r=re.sub(r'(?i)(?<![\w-])'+re.escape(t['blank']['answer'])+r'(?![\w-])',o['en'],t['en'],count=1)
            m=re.search(r"\b(a|an) (\w+)",r)
            for m in re.finditer(r"\b(a|an) ([\w-]+)",r):
                art,w=m.groups(); vow=w[0].lower() in 'aeiou' or w.upper() in('MRI','ECG','EEG','SBAR','FBI')
                if (art=='an')!=vow and w.lower() not in ('hour','sbar','mri','ecg','eeg','iv','one','unit'):
                    print('ARTICLE?',si,j,r)
    for l in s['order']['lines']:
        if re.match(r"(And|Also|Then|First|Last|Finally|While|Once|Until|After|If|Next|Now|So|Because)\b",l['en']): print('ORDERSTART',si,l['en'])
