import re,sys,json
p='_reviewB_or-specimen_P2.py'; s=open(p).read()
upd=json.loads(sys.stdin.read())
for kk,v in upd.items():
  i,j,k=map(int,kk.split('.'))
  key=f"({i},{j},{k}):"; m=re.search(re.escape(key)+r'"[^"]*",',s)
  if m: s=s[:m.start()]+key+'"'+v+'",'+s[m.end():]
  else: s=s.replace("}\nADD=",f'{key}"{v}",\n}}\nADD=',1)
open(p,'w').write(s)
