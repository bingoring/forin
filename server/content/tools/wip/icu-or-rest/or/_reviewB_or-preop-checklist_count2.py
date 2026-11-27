import yaml,re,collections,sys
sys.path.insert(0,'../../..')
from verify_lesson_content import _ko_stems
f=sys.argv[1]
d=yaml.safe_load(open(f))
MK={'려고':r'려고','러':r'[가-힣]러 ','도록':r'도록','기 전에':r'기 전에','~면':r'[가-힣](면|으면)[ ,.]','고 나서':r'고 나서','대로':r'대로','때까지':r'때까지','위해':r'위해'}
FAM={'XX':r'@@','나오/나왔':r'나오|나왔|나와','보/봐/볼':r'(^| )(보(?!류|내|관|통|호|험)|봐|볼)','알리/알려/알릴':r'알리|알려|알릴','적다':r'적어|적혀|적을|적고','정하다':r'정해|정하|정할|정했','확인':r'확인','기록':r'기록','감염':r'감염','혈액':r'혈액','몇':r'몇','다시':r'다시','먼저/부터':r'먼저|부터','물어/여쭤':r'물어|여쭤','번호':r'번호','카드':r'카드'}
def facty(ko,dk):
    # 정답과 앞뒤 어절을 하나도 공유하지 않으면 '다른 문장'(사실문 등)
    a=ko.split();b=dk.split()
    return a[0]!=b[0] and a[-1]!=b[-1]
mk_ko=collections.Counter();mk_dk=collections.Counter();both_mk=[]
fam=collections.Counter();famw=collections.defaultdict(list)
both_fact=[];one_fact=[]
topic=[];end=[]
stems=collections.Counter();sw=collections.defaultdict(list)
REQ=re.compile(r'(게요|시다|까요|세요|나요|요\?|\?)\s*[.?]?$')
for i,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    ko=x['ko'];o=x['distractorsKo'];t=f'{i}.{j}'
    for k,p in MK.items():
      if re.search(p,ko+' '): mk_ko[k]+=1
      c=[bool(re.search(p,q+' ')) and not re.search(p,ko+' ') for q in o]
      mk_dk[k]+=sum(c)
      if all(c): both_mk.append((t,k))
    for q in o:
      for k,p in FAM.items():
        if re.search(p,q) and not re.search(p,ko): fam[k]+=1;famw[k].append(t)
      for st in _ko_stems(q)-_ko_stems(ko): stems[st]+=1;sw[st].append(t)
    fa=[facty(ko,q) for q in o]
    if all(fa): both_fact.append(t)
    elif any(fa): one_fact.append(t)
    # 첫 어절 조사: 정답 이/가·을/를, 오답만 은/는
    f0=ko.split()[0]
    for q in o:
      g=q.split()[0]
      if re.search(r'[은는]$',g) and not re.search(r'[은는]$',f0): topic.append(t)
    # 정답은 요청·선언·질문, 오답은 평서(-요.)
    if REQ.search(ko) and all(not REQ.search(q) for q in o): end.append(t)
print('marker ko',dict(mk_ko));print('marker dk-only',dict(mk_dk));print('both dk same marker',both_mk)
print('families',{k:(v,famw[k]) for k,v in fam.most_common() if v>=3})
print('stems top',[(k,v) for k,v in stems.most_common(8)])
print('both distractors share neither first nor last eojeol with ko (다른 문장):',len(both_fact),both_fact)
print('one such:',len(one_fact))
print('topic marker 은/는 only in distractor first eojeol:',len(topic),sorted(set(topic)))
print('ko request/question/promise but both distractors plain statements:',len(end),end)
