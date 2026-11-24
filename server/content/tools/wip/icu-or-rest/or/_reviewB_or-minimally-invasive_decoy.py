import yaml,sys
d=yaml.safe_load(open(sys.argv[1]))
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    ch=x['chunks']; dc=x['decoy']
    print(f"--{si}.{j} [{dc}]  ko: {x['ko']}")
    for k,c in enumerate(ch):
      if c in '.?!': continue
      M=ch[:]; M[k]=dc
      print("   ",' '.join(M).replace(' .','.').replace(' ?','?').replace(' ,',','))
