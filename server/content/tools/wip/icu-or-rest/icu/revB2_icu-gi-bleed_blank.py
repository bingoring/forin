import yaml,re
d=yaml.safe_load(open("icu-gi-bleed.yaml",encoding="utf-8"))
for i,s in enumerate(d["situations"]):
    for j,x in enumerate(s["sentences"]):
        b=x['blank'];ans=b['answer'];en=x['en']
        m=re.search(r'(?<![A-Za-z])'+re.escape(ans)+r'(?![A-Za-z])',en)
        pre,post=en[:m.start()],en[m.end():]
        opts=[o['en'] for o in b['options'] if o['en']!=ans]
        print(f"{i}.{j} {pre}[{ans}]{post}  || x: {' | '.join(opts)}")
