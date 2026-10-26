import yaml, glob, copy
T='icu-mech-ventilation'
base=yaml.safe_load(open(f'base-{T}.yaml',encoding='utf-8'))
TAGS={1:'설정·기록',2:'튜브·고정',3:'회로·습화',4:'호흡 사정',5:'모니터링',6:'흡인·회복',7:'모드·동조',8:'압력·PEEP',9:'경보·원인',10:'폐보호·ABG',11:'위기 대응'}
# 결정 11 정리
REMOVE={'w-hour':'너무 쉬움','w-hand':'너무 쉬움','w-good':'너무 쉬움','w-big':'너무 쉬움','w-together':'너무 쉬움','w-find':'너무 쉬움','w-bring':'너무 쉬움','w-soon':'너무 쉬움','w-great':'너무 쉬움'}
KO={'w-confirm':'맞는지 확인하다','w-check':'점검하다','w-steady':'일정한','w-fall':'내려가다','w-climb':'상승하다','w-rise':'올라오다','w-fast':'빠르게','w-quick':'재빠른','w-change':'변화하다'}
# (상황 제목 인덱스, 문장 인덱스) -> 뺄 태그
UNTAG={(15+3,5):['w-respiratory'] }
def sit_idx(title): return [s['title'] for s in base['situations']].index(title)
UNTAG_SENT={(8,2):['w-work'],(9,2):['w-work'],(19,5):['w-work'],(18,5):['w-respiratory'],(16,5):['w-moment']}
changes=[]
words=[w for w in base['words']]
lines={}
for f in sorted(glob.glob(f'add_{T}_A_words_*.txt')):
    for l in open(f,encoding='utf-8'):
        l=l.strip()
        if not l or l.startswith('#'): continue
        p=[x.strip() for x in l.split(' | ')]
        assert len(p)==7,l
        lines[p[0]]=p
ex2ko={}
for s in base['situations']:
    for x in s['sentences']: ex2ko.setdefault(x['en'],x['ko'])
out_words=[]
for w in words:
    if w['id'] in REMOVE: continue
    p=lines.pop(w['id'])
    w=dict(w)
    if w['id'] in KO: w['ko']=KO[w['id']]
    w['exKo']=ex2ko[w['example']]
    w['cue']=p[1]; w['tag']=TAGS[int(p[2])]
    w['distractorsEn']=[x.strip() for x in p[3].split(',')]
    w['distractorsKo']=[x.strip() for x in p[4].split(',')]
    w['chips']=[x.split('|') for x in p[5].split()]
    w['decoyChips']=[x.strip() for x in p[6].split(',')]
    out_words.append(w)
assert not lines, lines.keys()
nu={d['sit']:d['items'] for d in yaml.safe_load(open(f'add_{T}_A_nuance_1.yaml',encoding='utf-8'))}
sits=copy.deepcopy(base['situations'])
for si,s in enumerate(sits):
    for xi,x in enumerate(s['sentences']):
        new=[t for t in x['words'] if t not in REMOVE and t not in UNTAG_SENT.get((si,xi),[])]
        if new!=x['words']:
            changes.append({'kind':'sentence','situation':s['title'],'index':xi,'fields':['words'],'why':'쉬운 단어·헤드워드와 맞지 않는 태그를 뺌'})
            x['words']=new
    s['nuance']=nu[si]
for wid in REMOVE: changes.append({'kind':'word-remove','id':wid,'why':'너무 쉬움 — 어느 문장도 태그하지 않게 됐다'})
for wid,ko in KO.items():
    changes.append({'kind':'word','id':wid,'fields':['ko'],'why':'뜻이 같은 은행 단어와 듣고 뜻 고르기에서 겹치거나 헤드워드와 맞지 않아 더 정확히 가름'})
# 헤드워드와 안 맞는 태그 때문에 바뀐 문장도 위에서 기록됨
res={'theme':base['theme'],'words':out_words,'situations':sits}
yaml.safe_dump(res,open(f'{T}.A.yaml','w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=1000)
yaml.safe_dump({'theme':T,'changes':changes},open(f'changes-{T}.yaml','w',encoding='utf-8'),allow_unicode=True,sort_keys=False,width=1000)
print(len(out_words),len(sits),len(changes))
