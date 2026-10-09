import yaml,re
d=yaml.safe_load(open('/Users/ywyeom/private/forin/server/content/tools/wip/er-v46/er-asthma-copd.yaml'))
for si,s in enumerate(d['situations']):
    print('##',si,s['title'])
    for j,t in enumerate(s['sentences']):
        a=t['blank']['answer']; print(f" [{j}] ko:{t['ko']}")
        for o in sorted(t['blank']['options'],key=lambda x:x['en']!=a):
            print('    ',('*' if o['en']==a else ' '), re.sub(r'(?i)(?<![\w-])'+re.escape(a)+r'(?![\w-])',o['en'],t['en'],count=1))
    L=[l['en'] for l in s['order']['lines']]
    for k in range(3):
        M=L[:]; M[k],M[k+1]=M[k+1],M[k]; print('  SW',k+1,'|',' / '.join(M))
