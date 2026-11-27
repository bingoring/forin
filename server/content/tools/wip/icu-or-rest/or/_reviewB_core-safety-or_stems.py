# 오답에만 나오는 낱말을 어간·활용형으로 묶어 직접 센다(조사 떼기 + 이 주제의 동사 활용형 표)
import yaml,re,collections,sys
f=sys.argv[1]; lim=int(sys.argv[2]) if len(sys.argv)>2 else 4
d=yaml.safe_load(open(f))
JOSA=['에서는','에서도','으로는','으로도','까지','부터','에서','에는','에도','으로','이라고','라고','이랑','하고','과','와','은','는','이','가','을','를','에','도','만','의','로','엔','께','처럼','보다']
LEMMA=[ # (정규식, 어간)
 (r'^(봐|봐요|봐야|보는|보고$|볼|보도록|본$|보면|보셨|봤)', '보다'),
 (r'^(보여|보이)', '보이다'),
 (r'^(세어|세요|셀|세고|세는|세기|센|세면|세게)$', '세다'),
 (r'^(펴|펴요|펴고|펼|펼쳐|펼칠|펴서)', '펴다'),
 (r'^(꺼내)', '꺼내다'), (r'^(켜|켜요|켤)', '켜다'), (r'^(정해|정할|정하)', '정하다'),
 (r'^(적어|적을|적고|적혀|적는|적은|적기)', '적다'), (r'^(들어요|들고|들을)$', '들다/듣다'),
 (r'^(모아|모을|모여|모인|모이)', '모으다/모이다'), (r'^(놓아|놓을|놓고|놓)', '놓다'),
 (r'^(맞춰|맞추|맞아|맞는|맞나|맞지|맞을|맞)', '맞다/맞추다'), (r'^(말해|말할|말하|말씀)', '말하다'),
 (r'^(물을|물어|묻기|묻)', '묻다'), (r'^(익혀|익히)', '익히다'), (r'^(둬|두고|둘게)', '두다'),
 (r'^(찾아|찾을|찾지|찾는|찾기)', '찾다'), (r'^(확인)', '확인'), (r'^(기록)', '기록'),
 (r'^(끝나|끝난|끝났|끝날)', '끝나다'), (r'^(되돌)', '되돌리다'), (r'^(어려|어렵)', '어렵다'),
 (r'^(챙겨|챙기)', '챙기다'), (r'^(직전)', '직전'), (r'^(전에|전과|전)$', '전'),
]
def norm(tok):
    for j in sorted(JOSA,key=len,reverse=True):
        if tok.endswith(j) and len(tok)>len(j): tok=tok[:-len(j)]; break
    for r,l in LEMMA:
        if re.match(r,tok): return l
    return tok
def toks(t): return re.findall(r'[가-힣]+',t)
cnt=collections.Counter(); where=collections.defaultdict(list)
for si,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']):
        mine={norm(t) for t in toks(x['ko'])}
        for k,dk in enumerate(x['distractorsKo']):
            for l in {norm(t) for t in toks(dk)}-mine:
                cnt[l]+=1; where[l].append(f'{si}.{j}/{k}')
for l,c in cnt.most_common():
    if c>lim: print(f'{l} {c}: '+' '.join(where[l]))
