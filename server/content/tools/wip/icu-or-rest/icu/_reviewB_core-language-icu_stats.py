import yaml,re,collections,sys
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
from verify_lesson_content import _ko_stems
d=yaml.safe_load(open(sys.argv[1] if len(sys.argv)>1 else 'core-language-icu.yaml'))
MARK=re.compile(r'(면|려고|도록|위해|기 전에|전에|후에|뒤에|때|동안)')
only=[];longer=[];ko_only=collections.Counter();where=collections.defaultdict(list)
dec=collections.Counter();decfirst=collections.Counter();decword=collections.Counter();bw=collections.Counter()
STOP=set('the a an of to and for at on in is are was be with'.split())
for si,s in enumerate(d['situations']):
  for k,t in enumerate(s['sentences']):
    ko=t['ko'];x=t['distractorsKo'];id=f"{si}.{k}"
    mk=lambda z: set(m for m in MARK.findall(z))
    if all(mk(z)-mk(ko) for z in x): only.append(id)
    if all(len(z)>len(ko) for z in x): longer.append(id)
    for z in x:
      r=len(z)/len(ko)
      if r>1.25 or abs(len(z)-len(ko))>3 and len(z)>len(ko): pass
    mine=_ko_stems(ko)
    for z in x:
      for st in _ko_stems(z)-mine: ko_only[st]+=1; where[st].append(id)
    dc=t['decoy'].strip(); dec[dc.lower()]+=1
    decfirst[re.findall(r"[\w',—-]+|,",dc)[0].lower()]+=1
    for w in re.findall(r"[a-zA-Z'-]+",dc.lower()):
      if w not in STOP: decword[w]+=1
    b=t['blank']
    for o in b['options']:
      if o['en']!=b['answer']: bw[o['en'].lower()]+=1
print('표지 오답에만:',len(only),only)
print('오답 둘 다 김:',len(longer),longer)
print('ko-only stems top:',[(a,c,where[a]) for a,c in ko_only.most_common(12)])
print('decoy dup:',[x for x in dec.items() if x[1]>1])
print('decoy first:',decfirst.most_common(10))
print('decoy words:',decword.most_common(12))
print('blank wrong top:',bw.most_common(12))
