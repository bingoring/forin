import yaml,re,sys,collections
def cond(t): # 조건 ~면 (화면·면밀·앞면·옆면·표면·측면·~면서 제외)
  return len([m for m in re.findall(r'([가-힣]*면)(?=[ ,.?])',t+' ') if not re.search(r'(화면|앞면|옆면|표면|측면|단면|정면)$',m)])
M={'전에/직전/앞서/먼저':lambda t:len(re.findall(r'전에|직전|앞서|먼저',t)),
   '~면(조건)':cond,
   '려고/러(목적)':lambda t:len(re.findall(r'려고|려는|[하가오보]러 ',t)),
   '뒤/후/나서':lambda t:len(re.findall(r'[가-힣] 뒤|뒤에|후에|고 나서',t)),
   '~니/~라(이유)':lambda t:len(re.findall(r'[이으]니 |[가-힣]이라 ',t)),
   '부터':lambda t:len(re.findall(r'부터',t)),
   '동안':lambda t:len(re.findall(r'동안',t)),
   'ㄹ 관형절(~할 N)':lambda t:len([w for w in re.findall(r'([가-힣]+) (?=[가-힣])',t) if (ord(w[-1])-0xAC00)%28==8 and not re.search(r'(할 수|ㄹ 때)',t) and w[-1] not in '을를일날말물길발글줄달열얼일칼' ]),
   'ㄴ 관형절(~한 N, 뒤 단계)':lambda t:len(re.findall(r'(확인한|맞춘|고정한|꺼낸|가져온|정렬된|정렬한) ',t))}
for f in sys.argv[1:]:
  d=yaml.safe_load(open(f)); S=[(f'{i}.{j}',x) for i,s in enumerate(d['situations']) for j,x in enumerate(s['sentences'])]
  print('==',f)
  for n,fn in M.items():
    ko=sum(fn(x['ko']) for _,x in S); kos=sum(1 for _,x in S if fn(x['ko']))
    dk=sum(fn(t) for _,x in S for t in x['distractorsKo'])
    only=sum(1 for _,x in S for t in x['distractorsKo'] if fn(t) and not fn(x['ko']))
    both=[k for k,x in S if all(fn(y) for y in x['distractorsKo'])]
    print(f'  {n}: 정답 {ko}회({kos}문장) / 오답 {dk}회(정답 ko에 그 표지가 없는 칸 {only}) / 오답 둘 다 {len(both)} {both}')
  pos=collections.Counter(next(k for k,o in enumerate(x['blank']['options']) if o['en']==x['blank']['answer']) for _,x in S)
  print('  빈칸 정답 위치',sorted(pos.items()))
