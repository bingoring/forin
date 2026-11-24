import yaml
d=yaml.safe_load(open('base-core-handoff-icu.yaml'))
R="right left day hour minute time morning today tomorrow tonight doctor family hand know see come go say again sorry sure back give start need stand move second wait early full once under far rather first last liter blood wrong already get help close down stay".split()
R={'w-'+x for x in R}
UNT={(8,0):['w-lab'],(11,1):['w-pressure'],(18,0):['w-correct']}
for si,s in enumerate(d['situations']):
    ws=set()
    for i,x in enumerate(s['sentences']):
        n=[w for w in x['words'] if w not in R and w not in UNT.get((si,i),[])]
        ws|=set(n)
        if len(n)<1: print('EMPTY',si,i,x['en'])
    print(si,s['title'],len(ws), sorted(w[2:] for w in ws))
