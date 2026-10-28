import yaml,json
d=yaml.safe_load(open('icu-stroke-icu.yaml'))
inj=json.load(open('in-icu-stroke-icu.json'))
kp={s['title']:set(s['keyPhrases']) for s in inj['situations']}
endbad={'the','a','an','of','to','for','and','or','but','with','in','on','at','by','from','he','she','you','we','i','his','her','your','my','their','into','than','as','so','if','every','some','any','this','that','more','few','is','are','be','not','once','whole','stat','safe','under','let','me','would','have','after','before','can','could','may','will','sort','lab','ongoing'}
for i,s in enumerate(d['situations']):
  for j,t in enumerate(s['sentences']):
    ch=t['chunks']; k='KP' if t['en'] in kp[s['title']] else '  '
    flags=[]
    for a,b in zip(ch,ch[1:]):
      if b[0] in ',.?!—': continue
      last=a.split()[-1].lower().strip(',')
      if last in endbad: flags.append(f"[{a} | {b}]")
    if flags: print(f"{i}.{j} {k} {' / '.join(ch)}  <- {flags}")
