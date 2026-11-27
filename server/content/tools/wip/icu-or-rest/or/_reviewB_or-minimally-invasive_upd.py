# 사용: python3 upd.py < json  {"i.j.k": "새 값" | ["새 값","이유","cls","shape"]}
import re,sys,json
p='_reviewB_or-minimally-invasive_patch.py'; s=open(p).read()
upd=json.loads(sys.stdin.read())
for kk,v in upd.items():
  i,j,k=map(int,kk.split('.'))
  key=f"({i},{j},{k}):("
  m=re.search(re.escape(key)+r'"[^"]*",',s)
  if isinstance(v,list):
    entry=key+'"'+v[0]+'","'+v[1]+'","'+v[2]+'","'+v[3]+'"),'
    if m:
      e=s.index('\n',m.start()); s=s[:m.start()]+entry+s[e:]
    else:
      s=s.replace("\n}\n# blank:","\n"+entry+"\n}\n# blank:",1)
  else:
    assert m,kk
    s=s[:m.start()]+key+'"'+v+'",'+s[m.end():]
open(p,'w').write(s)
