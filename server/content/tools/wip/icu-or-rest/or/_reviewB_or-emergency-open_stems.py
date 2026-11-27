# 한 음절 어간·활용형 직접 세기: 오답에만 있는 낱말(정답 ko에 같은 어간이 없을 때)
import yaml,re,sys,collections
d=yaml.safe_load(open(sys.argv[1]))
G={'오다':r'(?<![가-힣A-Za-z])(와요|와서|오면|온 |오고|오는|와 )|[가-힣]+(올게요)','있다':r'(있어|있나|있고|있는|있으)','두다':r'(둘게요|둬요|두면|두는|둡시다|뒀어요|두고)','알리다':r'(알려|알릴|알립)','보다':r'(?<![가-힣])(봐요|볼게요|보고|보면)|(을|를) 봐','세다':r'(세어|세고|셀게요|세요)(?!트)','걸다':r'(걸게요|걸어|걸고)','켜다':r'(켜서|켜졌|켜 )','열다':r'(열어|열게|열렸)','적다':r'(적어|적을|적고)','바로':r'바로','다시':r'다시','먼저':r'먼저','확인':r'확인','기록':r'기록','준비':r'준비','가져오다':r'가져','찾다':r'찾','보내다':r'보내|보낼','떨어지다':r'떨어','집도의':r'집도의','마취과':r'마취과','소리':r'소리','혈압':r'혈압','결과':r'결과','이송':r'이송','꺼내다':r'꺼내','쿨러':r'쿨러','라벨':r'라벨','가운':r'가운','장갑':r'장갑','복도':r'복도'}
C=collections.Counter(); W=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
  for j,x in enumerate(s['sentences']):
    for dk in x['distractorsKo']:
      for g,p in G.items():
        if re.search(p,dk+' ') and not re.search(p,x['ko']+' '): C[g]+=1; W[g].append(f'{si}.{j}')
for g,c in C.most_common(): print(g,c,W[g])
