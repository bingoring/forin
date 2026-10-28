#!/usr/bin/env python3
"""icu-status-epilepticus 수정 — pre-fix를 읽어 icu-status-epilepticus.yaml을 쓴다(다시 돌려도 같다).
입력: icu-status-epilepticus.pre-fix.yaml, changes-icu-status-epilepticus.pre-fix.yaml, fix_..._data_1.yaml(A), _data_2.yaml(B 표)
"""
import yaml, json, copy, re, sys
T='icu-status-epilepticus'
d=yaml.safe_load(open(f'{T}.pre-fix.yaml'))
pre=copy.deepcopy(d)
D1=yaml.safe_load(open(f'fix_{T}_data_1.yaml'))
D2=yaml.safe_load(open(f'fix_{T}_data_2.yaml'))
J=json.load(open(f'in-{T}.json'))
KP={s['title']:set(k if isinstance(k,str) else k['en'] for k in s['keyPhrases']) for s in J['situations']}
SIT={s['title']:s for s in d['situations']}
W={w['id']:w for w in d['words']}
def sent(sit,en):
    r=[x for x in SIT[sit]['sentences'] if x['en']==en]
    assert len(r)==1,(sit,en,len(r)); return r[0]
log=[]   # (kind, key, why)

# (a) A S1~S3 문장 다시 쓰기 + 단어
oldexample={}   # 옛 en -> (새 en, 새 ko)
for r in D1['sentence_rewrites']:
    x=sent(r['sit'],r['old_en']); assert r['old_en'] not in KP[r['sit']]
    oldko=x['ko']
    for k in ('en','ko','chunks','words','why','decoy'): x[k]=r[k]
    x['distractorsKo']=list(r['distractorsKo'])
    x['blank']={'answer':r['blank']['answer'],'options':[{'en':r['blank']['answer']}]+[{'en':o} for o in r['blank']['wrong']]}
    oldexample[r['old_en']]=(r['en'],r['ko'])
# (b) chunks
for r in D1['chunk_fixes']:
    assert r['en'] not in KP[r['sit']],r
    x=sent(r['sit'],r['en']); assert ''.join(' '+c if c not in '.,?!' else c for c in r['chunks']).strip()==r['en'],r
    x['chunks']=r['chunks']
# (c) K1 ko (KP: en·chunks 그대로)
for r in D1['kp_ko']:
    x=sent(r['sit'],r['en']); assert r['en'] in KP[r['sit']]
    oldexample.setdefault(r['en'],(r['en'],r['ko']))
    x['ko']=r['ko']; x['distractorsKo']=list(r['distractorsKo'])
# 단어: 새 단어, 지움, 태그 빼기
for r in D1['word_add']:
    d['words'].append({k:r[k] for k in ('id','en','ipa','ko','icon','example','cue','exKo','tag','distractorsEn','distractorsKo','chips','decoyChips')})
for r in D1['sentence_words_remove']:
    x=sent(r['sit'],r['en']); x['words'].remove(r['rm'])
# 예문 따라가기 (결정 13)
for w in d['words']:
    if w['example'] in oldexample and w['id']!='w-update':
        en,ko=oldexample[w['example']]; w['example']=en; w['exKo']=ko
# (d) 단어 항목
for wid,ch in D1['word_set'].items(): W[wid].update(ch)
for wid,(o,n) in D1['decoy_chips'].items():
    assert o in W[wid]['decoyChips'],wid; W[wid]['decoyChips']=[n if c==o else c for c in W[wid]['decoyChips']]
for wid,m in D1['distractors_en'].items():
    for o,n in m.items():
        assert o in W[wid]['distractorsEn'],(wid,o,W[wid]['distractorsEn']); W[wid]['distractorsEn']=[n if c==o else c for c in W[wid]['distractorsEn']]
# 단어 삭제 (태그 문장·nuance 참조 없어야)
used=set(wid for s in d['situations'] for x in s['sentences'] for wid in x['words'])
nw=set(wid for s in d['situations'] for n in s['nuance'] for wid in n.get('words',[]))
for wid in D1['word_remove']:
    assert wid not in used and wid not in nw,(wid,wid in used,wid in nw)
d['words']=[w for w in d['words'] if w['id'] not in D1['word_remove']]
# (e) 뉘앙스
cnt={}
for r in D1['nuance']:
    ns=[n for n in SIT[r['sit']]['nuance'] if n['kind']==r['kind']]
    # 같은 상황에 같은 kind가 여럿이면 slider·context는 하나뿐인지 확인
    assert len(ns)==1,(r['sit'],r['kind'],len(ns))
    n=ns[0]; s=dict(r['set'])
    if r['kind']=='context':
        if 'scene_en' in s: n['scenes'][s.pop('scene_en_idx')]['en']=s.pop('scene_en')
        i=s.pop('fix_for_scene_idx'); assert n['scenes'][i]['ok'] is False; n['scenes'][i]['fix']=s.pop('fix')
    n.update(s)
# (f) B
def find(sit,en): return sent(sit,en)
for r in D2['dk']:
    x=find(r['sit'],r['en']); x['distractorsKo'][r['k']]=r['v']
for r in D2['blank']:
    x=find(r['sit'],r['en'])
    if x['blank']['answer']!=r['answer']: x['blank']['answer']=r['answer']
    x['blank']['options']=[{'en':r['answer']}]+[{'en':o} for o in r['wrong']]
decoy={('2.1'):'the visitors','6.1':'with the family','6.2':'in the hallway','10.1':'the paperwork','12.2':'in the drawer','17.2':'on the menu'}
def byidx(i,j): return d['situations'][i]['sentences'][j]
# 문장 위치는 pre 기준 (en으로 확인)
def P(i,j,en_start):
    x=byidx(i,j); assert x['en'].startswith(en_start),(i,j,x['en']); return x
P(2,1,"Let's confirm the dose")['decoy']='the visitors'
P(6,1,"Let's confirm the weight")['decoy']='with the family'
P(6,2,"I'll monitor")['decoy']='in the hallway'
P(10,1,"Let's have intubation")['decoy']='the paperwork'
P(12,2,"I'll flag")['decoy']='in the drawer'
P(17,2,"Watch the heart")['decoy']='on the menu'
P(13,0,"Let's suction")['icon']='stetho'
def why2(x,new):   # 둘째 문장만 바꿈
    first=x['why'].split('요. ',1)[0]+'요.'; x['why']=first+' '+new
P(11,3,'His level')['why']="'came back'으로 결과가 막 나왔음을 알리고, 'within … range'로 판단까지 한 번에 전해 듣는 쪽이 다시 묻지 않게 해요."
P(14,2,'The neuro team')['why']="'with us'를 끝에 붙여, 다른 팀에 넘기는 게 아니라 함께 간다는 인상을 줘요."
why2(P(15,1,'This requires'),"'requires'로 선택이 아니라 조건임을 분명히 해, 왜 삽관이 먼저인지 받아들이게 해요.")
P(16,2,'The neuro team')['why']="'will guide'로 깊이와 기간은 신경과가 정한다고 말해, 간호사가 답할 수 없는 질문을 정중히 넘겨요."
why2(P(16,3,'His pressure'),"'stayed stable'을 앞에 두어 듣는 쪽이 결과부터 듣고 안심하게 해요.")
why2(P(16,4,"We'll add"),"조건을 'if' 절로 뒤에 두어, 지금 당장 추가하는 게 아니라는 점이 먼저 들려요.")
why2(P(17,3,'His heart'),"'while he's still seizing'을 끝에 붙여, 서맥과 발작이 동시에 진행 중이라 둘 다 지금 대응해야 함을 강조해요.")
why2(P(19,3,'His pressure'),"'right after we deepened'로 의심되는 처치와 시점을 함께 보고해, 팀이 바로 주입을 다시 보게 해요.")
# order
def L(en,icon,ko,note): return {'en':en,'icon':icon,'ko':ko,'note':note}
def setline(i,k,en,ko,icon=None,note=None):
    l=d['situations'][i]['order']['lines'][k]; l['en']=en; l['ko']=ko
    if icon: l['icon']=icon
    if note: l['note']=note
setline(0,1,"I'm timing the seizure and watching it closely.","발작 시간을 재고 자세히 지켜보고 있어요")
setline(0,3,"That's why I'll write it all down when it ends.","그래서 끝나면 전부 적어 둘게요")
setline(1,1,"While he's on his side, a pillow protects his head.","옆으로 누운 동안 베개가 머리를 보호해요")
setline(1,2,"With his head safe, I keep checking that his airway stays open.","머리가 안전하니 기도가 열려 있는지 계속 확인해요")
setline(1,3,"To keep it open, nothing goes in his mouth.","기도를 열어 두려고 입에는 아무것도 넣지 않아요")
setline(3,2,"With the oxygen on, his saturation is holding steady.","산소를 대니 포화도가 안정적으로 유지되고 있어요",'monitor','수치')
setline(3,3,"Still, I'm keeping suction ready in case he needs it.","그래도 필요할 때를 대비해 석션을 준비해 두고 있어요",'pager','장비')
d['situations'][3]['order']['why']="산소를 주고 있다고 알리고, 이유를 설명하고, 수치를 보고한 뒤, 그래도 석션을 준비해 둔다고 알려요."
setline(4,2,"Sure enough, one was off — his glucose came back low.","역시 하나가 어긋났어요 — 혈당이 낮게 나왔어요")
setline(6,1,"For that drug, let's first confirm the weight-based dose and rate.","그 약은 먼저 체중 기준 용량과 속도를 확인하죠")
setline(7,1,"That's why we use continuous EEG to catch it.","그래서 지속 EEG로 그걸 잡아내요")
setline(7,2,"For that, we put leads on his scalp to read his brain waves.","그러려고 두피에 선을 붙여 뇌파를 읽어요")
setline(7,3,"The neuro team reads those waves to guide his treatment.","신경과 팀이 그 뇌파를 읽고 치료를 이끌어요")
setline(9,1,"He's already had the second agent.","이미 2차 약제를 썼어요")
setline(9,2,"So let's have the next medication ready now.","그러니 다음 약물을 지금 준비해 두죠")
setline(9,3,"If he seizes again, it goes in right away.","또 발작하면 바로 투여해요")
setline(13,1,"After suctioning, I'm watching for signs of aspiration.","석션한 뒤에는 흡인 징후를 지켜보고 있어요")
setline(13,2,"While I watch for that, let's check his tongue for bite marks.","그걸 지켜보는 동안 혀에 물린 자국도 확인하죠")
setline(14,3,"Once they've decided, we'll explain the plan together.","결정되면 계획을 함께 설명해드릴게요")
setline(17,2,"While you bag, I'll call for help and prepare for intubation.","백을 짜는 동안 제가 도움을 요청하고 삽관을 준비할게요")

# (g) 결정 13 나머지는 verify 스크립트가 잡음 — 출력
yaml.safe_dump(d,open(f'{T}.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)

# (h) 변경 목록: pre-fix → 출력의 v44 필드 차이를 이어 적는다
WK=['en','ko','ipa','icon','example']; SK=['en','ko','chunks','words']
WHY={('word','w-clear'):"형용사로 쓰인 clear라 ko·cue가 동사(치우다)여서 맞지 않고 '치우다'가 오답 clean에도 맞아 정답이 둘이 됨",
     ('word','w-hear'):"문장 20.3을 고쳐 예문도 새 문장으로",('word','w-during'):"문장 5.3을 고쳐 예문도 새 문장으로"}
SWHY={'발작 후 상태 사정/3':"간호사가 확인할 수 없는 '통증이 없었다' 단정을 '아마 의식하지 못했을 것'으로",
      '지속 SE 예후·목표 소통/3':"'아무것도 숨기지 않겠다'는 지킬 수 없는 절대 약속 — 새 소식을 계속 알리겠다는 지킬 수 있는 약속으로",
      '지속 SE 예후·목표 소통/4':"결정의 기준은 환자의 가치 — 가족이 원하는 것은 무엇이든 지지한다는 약속을 고침"}
chg=yaml.safe_load(open(f'changes-{T}.pre-fix.yaml'))
new=[]
pw={w['id']:w for w in pre['words']}; nw_={w['id']:w for w in d['words']}
for wid in nw_:
    if wid not in pw: new.append({'kind':'word-add','id':wid,'why':"20.3을 '아무것도 숨기지 않겠다'에서 계속 알리겠다로 고치며 쓰는 말 — 문장 20.3에 있다"})
for wid in pw:
    if wid not in nw_:
        why={'w-hide':"20.3 문장 고침으로 어느 문장도 태그하지 않게 됨",'w-whatever':"20.4 문장 고침으로 어느 문장도 태그하지 않게 됨",'w-get':"너무 쉬운 말이고 ko '받다'가 어느 쓰임에도 맞지 않음 — 태그를 빼고 지움"}[wid]
        new.append({'kind':'word-remove','id':wid,'why':why})
for wid in nw_:
    if wid in pw:
        f=[k for k in WK if pw[wid].get(k)!=nw_[wid].get(k)]
        if f: new.append({'kind':'word','id':wid,'fields':f,'why':WHY.get(('word',wid),'검토 수정')})
for si,(a,b) in enumerate(zip(pre['situations'],d['situations'])):
    for j,(x,y) in enumerate(zip(a['sentences'],b['sentences'])):
        f=[k for k in SK if x.get(k)!=y.get(k)]
        if f:
            why=SWHY.get(f"{a['title']}/{j}") or {'chunks':'구 경계에서 다시 자름(복합명사·동사구를 끊지 않게)','ko':'동료에게 하는 말로 어색한 ko를 고침','words':'태그 정리(결정 11): 이 문장의 쓰임과 단어 ko가 맞지 않음'}[f[0]]
            if f==['words'] and j==0: why='w-pressure 태그 뺌 — 여기 pressure는 뇌압이라 ko 혈압과 맞지 않음' if '뇌부종' in a['title'] else why
            new.append({'kind':'sentence','situation':a['title'],'index':j,'fields':f,'why':why})
# words 뺀 이유를 문장별로 더 구체적으로
for c in new:
    if c['kind']=='sentence' and c['fields']==['words']:
        t,i=c['situation'],c['index']
        if '뇌부종' in t and i in (0,3): c['why']='w-pressure 태그 뺌 — 여기 pressure는 뇌압이라 ko 혈압과 맞지 않음'
        elif '저산소' in t and i==0: c['why']='w-open 태그 뺌 — 여기 Open은 명령형 동사라 ko 열린과 맞지 않음(문장은 그대로)'
        elif i in (1,4) or True and any(True for _ in [0]): pass
chg['changes']=list(chg['changes'])+new
yaml.safe_dump(chg,open(f'changes-{T}.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
print('changes added',len(new))
