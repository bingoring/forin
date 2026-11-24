# 문말 어미 종류로 기계 대조: 청유/약속/명령/질문/평서
import yaml,re,sys
def cls(t):
  t=t.strip().rstrip('.!')
  if t.endswith('?'): return '질문'
  if re.search(r'(ㅂ시다|읍시다|합시다|봅시다|시다)$',t) or t.endswith('시다'): return '청유'
  if re.search(r'(ㄹ게요|할게요|게요)$',t): return '약속'
  if re.search(r'(세요|주세요|십시오)$',t): return '명령'
  return '평서'
for f in sys.argv[1:]:
  d=yaml.safe_load(open(f)); S=[(f'{i}.{j}',x) for i,s in enumerate(d['situations']) for j,x in enumerate(s['sentences'])]
  both=[k for k,x in S if all(cls(y)!=cls(x['ko']) for y in x['distractorsKo'])]
  act=[k for k,x in S if cls(x['ko'])!='평서']
  bothact=[k for k in both if k in act]
  print(f,'| 정답이 행동·질문 문장',len(act),'| 오답 둘 다 정답과 어미 종류가 다름',len(both),both)
