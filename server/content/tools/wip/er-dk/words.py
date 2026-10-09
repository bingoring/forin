import yaml,sys,subprocess,re
t=sys.argv[1]
out=subprocess.run(['python3','../../verify_one_theme.py','er',f'base-er-{t}.yaml'],capture_output=True,text=True).stdout
d=yaml.safe_load(open(f'base-er-{t}.yaml'))
W={w['id']:w for w in d['words']}
seen=set()
for l in out.split('\n'):
    m=re.search(r"\[(W16|W17)\].*?: (word '(\S+)'|sentence\[(\d+)\])",l)
    if not m: continue
    if m.group(1)=='W16':
        i=m.group(3)
        if i in seen: continue
        seen.add(i);w=W[i]
        print(i,'|',w['en'],'|',w['ko'],'| Ko:',w['distractorsKo'],'| En:',w['distractorsEn'])
    else: print(l[:400])
