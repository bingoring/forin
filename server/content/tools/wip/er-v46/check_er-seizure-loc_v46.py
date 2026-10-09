import yaml,re,sys
D='/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/'
d=yaml.safe_load(open(D+'er-seizure-loc.yaml'))
b=yaml.safe_load(open(D+'base-er-seizure-loc.yaml'))
err=0
cnt=dict(tag=0,icon=0,why=0,decoy=0,dko=0,blank=0,order=0,ctx=0,sw=0,sent=0)
for si,(s,bs) in enumerate(zip(d['situations'],b['situations'])):
    assert s['nuance'][0]['kind']==bs['nuance'][0]['kind'] and len(s['nuance'])==len(bs['nuance'])
    for j,t in enumerate(s['sentences']):
        cnt['sent']+=1
        for k,c in (('tag','tag'),('icon','icon'),('why','why'),('decoy','decoy'),('distractorsKo','dko'),('blank','blank')):
            if t.get(k): cnt[c]+=1
        en=t['en']; a=t['blank']['answer']
        pat=r'(?<![\w-])'+re.escape(a)+r'(?![\w-])'
        if len(re.findall(pat,en))!=1: print('ANS',si,j,a); err+=1
        opts=[o['en'] for o in t['blank']['options']]
        if len(set(opts))!=4 or a not in opts or any('icon' in o for o in t['blank']['options']): print('OPT',si,j); err+=1
        if len(t['tag'])>10: print('TAG',si,j); err+=1
        if t['decoy'].lower() in en.lower(): print('DECOY',si,j); err+=1
        # item 7: print blanks
        print(f"[{si}.{j}] {t['ko']}")
        for o in sorted(opts,key=lambda x:x!=a): print('    ','*' if o==a else ' ',re.sub(pat,o,en,count=1))
        # item 8
        print('    KO-D:',t['distractorsKo'])
    if 'order' in s: cnt['order']+=1
    L=[l['en'] for l in s['order']['lines']]
    assert len(L)==4
    for l in L:
        if re.match(r'(?i)\s*(if so|if it does|if not|in that case|if any of those|if )',l): print('COND',si,l); err+=1
    for k in range(3):
        M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',si,k+1,'|',' / '.join(M))
    for n in s['nuance']:
        if n['kind']=='context':
            cnt['ctx']+=1
            bad=[sc for sc in n['scenes'] if not sc['ok']]
            if not any(n['word'] in sc['en'] for sc in bad): print('CTXWORD',si,n['word']); err+=1
            if not n.get('ko'): err+=1
        if n['kind']=='swap':
            cnt['sw']+=1
            if not n.get('ko'): err+=1
print(cnt,'err',err)
