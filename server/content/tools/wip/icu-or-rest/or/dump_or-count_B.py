import yaml,sys,re,collections
d=yaml.safe_load(open('or-count.yaml'))
mode=sys.argv[1]
for si,s in enumerate(d['situations']):
    if mode in('all','sent'): print(f"\n## {si} {s['title']}")
    for i,x in enumerate(s['sentences']):
        k=f"{si}.{i}"
        if mode=='sent':
            print(f"[{k}] {x['en']}\n   ko: {x['ko']}\n   d1: {x['distractorsKo'][0]}\n   d2: {x['distractorsKo'][1]}\n   tag={x['tag']} icon={x['icon']} decoy={x['decoy']!r}\n   chunks: {' / '.join(x['chunks'])}\n   why: {x['why']}")
            b=x['blank'];en=x['en'];a=b['answer']
            for o in b['options']:
                m='*' if o['en']==a else ' '
                print(f"   {m} "+re.sub(r'\b'+re.escape(a)+r'\b','['+o['en']+']',en,count=1))
    if mode=='order':
        o=s['order'];L=[l['en'] for l in o['lines']]
        print(f"\n## {si} {s['title']} | ko={o['ko']} | tag={o.get('tag')} icon={o.get('icon')}\n   why: {o['why']}")
        for j,l in enumerate(o['lines']): print(f"   {j+1}. {l['en']}  ({l.get('ko')}/{l.get('note')}/{l['icon']})")
        for j in range(3):
            M=L[:];M[j],M[j+1]=M[j+1],M[j];print(f"   swap{j+1}{j+2}: "+' | '.join(M))
