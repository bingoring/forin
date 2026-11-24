import yaml,sys
d=yaml.safe_load(open('base-or-preop-verification.yaml'))
print(len(d['situations']))
for si,s in enumerate(d['situations']):
    print('##',si,s['title'], [k for k in s if k not in('title','sentences','nuance')])
    for i,x in enumerate(s['sentences']):
        print(f"  {i}. {x['en']} | {x['ko']} | {x['chunks']} | g{x['goal']} {x.get('words')}")
