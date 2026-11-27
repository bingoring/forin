import yaml,collections,json
d=yaml.safe_load(open('_reviewB_or-preop-verification_after.yaml'))
B={ # sit.sent: (answer, options)
(0,5):("name",["name","room number","weight","insurance"]),
(1,0):("operating",["operating","lying","standing","leaning"]),
(1,2):("chart",["chart","bill","locker","receipt"]),
(2,4):("desk",["desk","pharmacy","elevator","lab"]),
(3,0):("marking",["marking","incision","dressing","stitches"]),
(3,3):("awake",["awake","alone","dressed","standing"]),
(4,0):("allergies",["allergies","symptoms","surgeries","bruises"]),
(4,2):("team",["team","waiting room","lobby","hallway"]),
(4,3):("band",["band","belt","sleeve","bag"]),
(4,4):("same",["same","wrong","extra","next"]),
(5,2):("fasting",["fasting","drinking","walking","sleeping"]),
(5,4):("stomach",["stomach","bladder","bowel","schedule"]),
(5,5):("midnight",["midnight","sunrise","noon","sunset"]),
(6,4):("mismatch",["mismatch","delay","shortage","billing error"]),
(9,0):("interpreter",["interpreter","administrator","auditor","chaplain"]),
(9,2):("step",["step","machine","pill","rule"]),
(12,0):("legal",["legal","former","casual","visiting"]),
(12,2):("confirm",["confirm","guess","assume","print"]),
(13,4):("consent",["consent","gown","badge","nurse"]),
(14,0):("planned",["planned","usual","extra","cheapest"]),
(14,1):("permission",["permission","insurance","referral","address"]),
(15,0):("marking",["marking","badge","schedule","invoice"]),
(15,5):("voice",["voice","screen","ear","badge"]),
(17,3):("unconscious",["unconscious","comfortable","talkative","ambulatory"]),
(18,0):("patient",["patient","tray","room","gown"]),
(19,0):("mind",["mind","seat","shirt","locker"]),
(20,0):("prepping",["prepping","weighing","carrying","reading"]),
(20,2):("incise",["incise","suture","discharge","extubate"]),
(20,3):("freezes",["freezes","hurries","leaves","scrubs"]),
}
for (i,j),(a,o) in B.items():
  x=d['situations'][i]['sentences'][j]; assert f' {a}' in ' '+x['en'] , (i,j)
  x['blank']={'answer':a,'options':[{'en':t} for t in o]}
c=collections.Counter(o['en'] for s in d['situations'] for x in s['sentences'] for o in x['blank']['options'] if o['en']!=x['blank']['answer'])
print('>=4',[(k,v) for k,v in c.items() if v>=4])
yaml.safe_dump(d,open('_reviewB_or-preop-verification_after.yaml','w'),allow_unicode=True,sort_keys=False)
