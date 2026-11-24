import yaml,re,collections,sys
sys.path.insert(0,'/Users/ywyeom/private/forin/server/content/tools')
f=sys.argv[1] if len(sys.argv)>1 else 'icu-mobility-prevention.yaml'
d=yaml.safe_load(open(f))
S=[(si,j,x) for si,s in enumerate(d['situations']) for j,x in enumerate(s['sentences'])]
print('sentences',len(S))
MK=['면 ','면서','려고','전에','도록','위해','뒤에','뒤','자마자','함께','따로','때 ','때마다','니까','서 ']
def marks(t): return {m for m in ['면','려고','전에','도록','위해','뒤','자마자','함께','따로','때'] if re.search(m+r'(?=[\s,.—]|$)|'+m+' ',t)}
cnt=0;lst=[]
for si,j,x in S:
  k=marks(x['ko']); a,b=[marks(t) for t in x['distractorsKo']]
  if (a-k) and (b-k): cnt+=1; lst.append(f"{si}.{j}")
print('both-distractors-only markers:',cnt,lst)
# length: both longer
bl=[f"{si}.{j}" for si,j,x in S if all(len(re.sub(r'\s','',t))>len(re.sub(r'\s','',x['ko'])) for t in x['distractorsKo'])]
print('both longer:',len(bl),bl)
# decoy words
stop=set('the a an of to and in on for with at is are we i i\'ll you her his him she he it my your our be all this that'.split())
dw=collections.Counter(); where=collections.defaultdict(list)
for si,j,x in S:
  for w in set(re.findall(r"[a-z']+",x['decoy'].lower()))-stop:
    dw[w]+=1; where[w].append(f"{si}.{j}")
print('decoy words >=2:',[(w,n,where[w]) for w,n in dw.most_common() if n>=2])
bw=collections.Counter()
for si,j,x in S:
  for o in x['blank']['options']:
    if o['en']!=x['blank']['answer']: bw[o['en'].lower()]+=1
print('blank wrong >=2:',[(w,n) for w,n in bw.most_common() if n>=2])
# decoy shape: starts with comma / preposition etc
shape=collections.Counter()
for si,j,x in S:
  dc=x['decoy']; first=dc.split()[0].lower().strip(',—')
  shape[('punct-' if dc[0] in ',—' else '')+first]+=1
print('decoy first-word:',shape.most_common(12))
from verify_lesson_content import check_theme_repetition, length_tell
