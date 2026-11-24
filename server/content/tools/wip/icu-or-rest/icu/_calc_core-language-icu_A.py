import yaml
b=yaml.safe_load(open('base-core-language-icu.yaml'))
REM=set('day hour minute time now today morning home doctor family mother father baby body hand know see come zero ten right away nothing anything again okay yes no one two here say tell ask help need want use give take find call bring show feel like way more soon long much same only once together great think stay leave start finish try hear mean hold change work own down fast small deep simple lot wrong sorry alone single quite rather happen worry matter face hurt confused eye important clear everything'.split())
used={}
for s in b['situations']:
    ws=set()
    for x in s['sentences']:
        for w in x['words']:
            if w[2:] not in REM: ws.add(w[2:])
    print(s['title'],len(ws),sorted(ws))
