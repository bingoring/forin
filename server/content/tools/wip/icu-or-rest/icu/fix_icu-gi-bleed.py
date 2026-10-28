#!/usr/bin/env python3
"""icu-gi-bleed 수정 — pre-fix를 읽어 icu-gi-bleed.yaml을 쓴다(다시 돌려도 같다).
입력: icu-gi-bleed.pre-fix.yaml, changes-icu-gi-bleed.pre-fix.yaml, in-icu-gi-bleed.json,
      fix_icu-gi-bleed_data_1.yaml(A 문장), fix_icu-gi-bleed_data_2.yaml(단어·뉘앙스·order), revB2_icu-gi-bleed_vals.py(B 값)
"""
import yaml, json, copy, re, importlib.util
T='icu-gi-bleed'
d=yaml.safe_load(open(f'{T}.pre-fix.yaml')); pre=copy.deepcopy(d)
D1=yaml.safe_load(open(f'fix_{T}_data_1.yaml')); D2=yaml.safe_load(open(f'fix_{T}_data_2.yaml'))
_s=importlib.util.spec_from_file_location('vals',f'revB2_{T}_vals.py'); V=importlib.util.module_from_spec(_s); _s.loader.exec_module(V)
J=json.load(open(f'in-{T}.json'))
S=lambda i,j: d['situations'][i]['sentences'][j]
W={w['id']:w for w in d['words']}
def key(k): i,j=k.split('.'); return int(i),int(j)
def joinc(ch):
    s=''
    for c in ch: s+= c if (not s or c[0] in ',.?!') else ' '+c
    return s
for i,s in enumerate(d['situations']):
    for j,x in enumerate(s['sentences']): assert joinc(x['chunks'])==x['en'],(i,j)
KP={(i,j) for i,(s,js) in enumerate(zip(d['situations'],J['situations'])) for j,x in enumerate(s['sentences']) if x['en'] in set(js['keyPhrases'])}
REWR={(r['i'],r['j']) for r in D1['rewrites']}; KOONLY={(r['i'],r['j']) for r in D1['ko_only']}
oldex={}   # 옛 en -> (새 en, 새 ko)
# ── B 먼저(pre-fix 위치 기준) ──
for k,idx,val,cat,why in V.KO:
    p=key(k)
    if p in REWR or p in KOONLY: continue
    S(*p)['distractorsKo'][idx]=val
BLANK_OVR={'18.6':['lipids','iron','salt']}
for k,(wr,why) in V.BLANK.items():
    p=key(k); x=S(*p)
    if p in REWR: continue
    if k in V.MOVE: continue
    if k in BLANK_OVR: wr=BLANK_OVR[k]
    if not wr: continue
    a=x['blank']['answer']; x['blank']['options']=[{'en':a}]+[{'en':o} for o in wr]
for k,(ans,wr) in V.MOVE.items():
    x=S(*key(k)); assert len(re.findall(r'(?<![A-Za-z])'+re.escape(ans)+r'(?![A-Za-z])',x['en']))==1,k
    x['blank']={'answer':ans,'options':[{'en':ans}]+[{'en':o} for o in wr]}
for k,dd in V.DECOY.items():
    p=key(k)
    if p in REWR: continue
    S(*p)['decoy']=dd
# B 문구·why·icon
for k,v in D2['sentence_why'].items(): S(*key(k))['why']=v
for k,v in D2['sentence_icon'].items(): S(*key(k))['icon']=v
for i,k,en,ko in D2['order_lines']:
    l=d['situations'][i]['order']['lines'][k]; l['en']=en; l['ko']=ko
    assert len(en.split())<=15,(i,k,en)
for i,v in D2['order_why'].items(): d['situations'][i]['order']['why']=v
# ── A 문장 ──
for r in D1['rewrites']:
    x=S(r['i'],r['j']); assert x['en'].startswith(r['old']) and (r['i'],r['j']) not in KP
    oldex[x['en']]=(r['en'],r['ko'])
    assert joinc(r['chunks'])==r['en'],r['en']
    for k in ('en','ko','chunks','words','tag','icon','why','decoy'): x[k]=r[k]
    for wid in r['words']: assert wid in W,wid
    x['distractorsKo']=list(r['dko'])
    x['blank']={'answer':r['blank']['answer'],'options':[{'en':r['blank']['answer']}]+[{'en':o} for o in r['blank']['wrong']]}
    assert len(re.findall(r'(?<![A-Za-z])'+re.escape(r['blank']['answer'])+r'(?![A-Za-z])',r['en']))==1,r['en']
    assert r['decoy'].lower().strip(' ,') not in r['en'].lower() and r['decoy'] not in r['chunks']
for r in D1['ko_only']:
    x=S(r['i'],r['j']); assert x['en'].startswith(r['old'])
    oldex.setdefault(x['en'],(x['en'],r['ko']))
    x['ko']=r['ko']; x['distractorsKo']=list(r['dko'])
    for wid in r.get('rm_words',[]): x['words'].remove(wid)
for r in D1['chunk_fixes']:
    x=S(r['i'],r['j']); assert joinc(r['chunks'])==x['en'],(r,joinc(r['chunks']))
    x['chunks']=r['chunks']
    assert x['decoy'] not in r['chunks'] and x['decoy'].lower().strip(' ,') not in x['en'].lower(),(r['i'],r['j'],x['decoy'])
for i,j,wid in D2['sentence_words_remove']:
    if wid in S(i,j)['words']: S(i,j)['words'].remove(wid)
# 예문 따라가기(결정 13)
for w in d['words']:
    if w['example'] in oldex:
        en,ko=oldex[w['example']]; w['example']=en; w['exKo']=ko
# ── 단어 ──
for wid,m in D2['distractors_en'].items():
    for o,n in m.items():
        assert o in W[wid]['distractorsEn'],(wid,o,W[wid]['distractorsEn']); W[wid]['distractorsEn']=[n if c==o else c for c in W[wid]['distractorsEn']]
for wid,m in D2['decoy_chips'].items():
    for o,n in m.items():
        assert o in W[wid]['decoyChips'],(wid,o); W[wid]['decoyChips']=[n if c==o else c for c in W[wid]['decoyChips']]
for wid,ch in D2['chips'].items():
    assert ''.join(''.join(x) for x in ch)==''.join(''.join(x) for x in W[wid]['chips']),wid
    W[wid]['chips']=ch
for wid,ch in D2['word_set'].items(): W[wid].update(ch)
used=set(w for s in d['situations'] for x in s['sentences'] for w in x['words'])
nw=set(w for s in d['situations'] for n in s['nuance'] for w in n.get('words',[]))
for wid in D2['word_remove']: assert wid not in used and wid not in nw,(wid,wid in used,wid in nw)
d['words']=[w for w in d['words'] if w['id'] not in D2['word_remove']]
# ── 뉘앙스 ──
for r in D2['nuance']:
    ns=[n for n in d['situations'][r['i']]['nuance'] if n['kind']==r['kind']]; assert len(ns)==1,r; n=ns[0]
    if 'set' in r: n.update(r['set'])
    if 'append_why' in r: n['why']+=r['append_why']
    if 'replace_why' in r:
        o,nn=r['replace_why']; assert o in n['why'],r; n['why']=n['why'].replace(o,nn)
    if 'scene3_en' in r: n['scenes'][2]['en']=r['scene3_en']
    if 'fix3' in r: assert n['scenes'][2]['ok'] is False; n['scenes'][2]['fix']=r['fix3']
    if 'scene1_en' in r: n['scenes'][0]['en']=r['scene1_en']
    if 'scene2_en' in r: n['scenes'][1]['en']=r['scene2_en']
    if 'scenes' in r: n['scenes']=[n['scenes'][k] if sc=='keep' else sc for k,sc in enumerate(r['scenes'])]
# 새 words 가 은행에 있는지, 태그·nuance 참조 확인
ids={w['id'] for w in d['words']}
for s in d['situations']:
    for x in s['sentences']:
        for wid in x['words']: assert wid in ids,wid
    for n in s['nuance']:
        for wid in n.get('words',[]): assert wid in ids,wid
# keyPhrase 보호
for (i,j) in KP:
    a,b=pre['situations'][i]['sentences'][j],S(i,j); assert a['en']==b['en'] and a['chunks']==b['chunks'],(i,j)
yaml.safe_dump(d,open(f'{T}.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)

# ── 변경 목록: pre-fix → 출력의 v44 필드 차이를 이어 적는다(같은 대상은 합침) ──
WK=['en','ko','ipa','icon','example']; SK=['en','ko','chunks','words']
WW={'w-hand':"구 hand off 안에서만 뜻이 서고(문장 17.6) 쉬운 말 hand의 ko '건네다'가 맞지 않아 구 단위 헤드워드로",
    'w-mix':"문장은 mix … up(떼어 쓴 구)이라 ko를 혼동하다로 — 헤드워드는 그대로(검사기 V2가 떨어진 구를 못 찾음)",'w-make':"ko '확실히 하다'는 make sure의 뜻이라 구 단위 헤드워드로",
'w-ever':"Have you ever had…의 ever는 '한 번이라도'",
    'w-actively':"actively bleeding의 actively는 '활발히'(활동성 출혈과 통함)",'w-through':"support you through it의 through는 '그 과정 내내'",
    'w-steady':"혈압·수치의 steady는 '변동 없는'이지 '꾸준한'(끈기)이 아님",'w-ir':"IR은 중재영상의학(인터벤션)",'w-light':"문장 3.6의 light는 call light(호출등)",
    'w-birth':"date of birth는 생년월일 — '생일'은 birthday",'w-way':"문장은 on the way(오는 중) — 구 단위 헤드워드로"}
chg=yaml.safe_load(open(f'changes-{T}.pre-fix.yaml')); new=[]
pw={w['id']:w for w in pre['words']}; nw_={w['id']:w for w in d['words']}
RM={'w-catch':"13.5를 고쳐 어느 문장도 태그하지 않게 됨(ko '나타나다'도 catch up과 안 맞았음)",'w-moment':"14.6을 고쳐 어느 문장도 태그하지 않게 됨",
    'w-sure':"make sure를 구 헤드워드 w-make가 맡아 5.2 태그를 뺌 — 어느 문장도 태그하지 않게 됨",'w-away':"ko '바로'는 right away의 뜻이고 태그된 문장은 13.4 하나 — 태그를 빼고 지움"}
for wid in pw:
    if wid not in nw_: new.append({'kind':'word-remove','id':wid,'why':RM[wid]})
for wid in nw_:
    if wid in pw:
        f=[k for k in WK if pw[wid].get(k)!=nw_[wid].get(k)]
        if f:
            ex='example' in f and pw[wid]['example']!=nw_[wid]['example']
            new.append({'kind':'word','id':wid,'fields':f,'why':WW.get(wid,"문장을 고쳐 예문도 새 문장으로" if f==['example'] else "검토 수정")})
SWHY={(8,3):"제한적 수혈 기준을 8로 단정하던 문장 — 기준은 처방대로, 7.2는 기준보다 낮지 않다고 고침(사실)",
 (8,4):"수혈을 간호사가 only로 못 박던 문장 — 처방에 따라 수혈한다고 고침(안전)",
 (13,5):"재출혈 감시 중 피로를 '정상'이라고 단정하던 잘못된 안심 — 가능성으로 말하고 더 심해지면 알리게 고침(안전)",
 (4,4):"금식 환자에게 물을 약속하던 문장 — 의사가 괜찮다고 하면으로 고침(안전)",
 (18,3):"처방 없이 수액을 최대로 미는 말 — 처방된 수액을 혈액이 올 때까지로 고침(안전)",
 (10,6):"내시경을 간호사가 미루던 문장 — 시점은 GI팀이 정한다고 고침(업무범위·지침)",
 (6,3):"내시경 전 원인을 단정하던 문장 — 가능성(most likely)으로 고침",
 (5,3):"어색한 영어를 자연스럽게 고침",(5,4):"간호사가 항응고제를 조절하는 말로 들리던 문장 — 의사들이 균형을 맞춘다고 고침",
 (14,6):"항공 은어 wheels up과 이동 뒤 보고 — 병동을 나서기 전에 인계 전화로 고침",
 (14,3):"pump bag은 표준 용어가 아님 — Ambu bag(앰부백)으로",
 (20,5):"keep fighting은 편안한 돌봄을 포기처럼 들리게 하는 전쟁 비유 — more treatment / comfort care로",
 (18,6):"ko '저랑 계속 계세요'는 Stay with me의 뜻이 뒤집힌 번역 — '정신 놓지 마세요'로 / w-stay 태그를 뺌(머무르다와 뜻이 다름)",
 (1,5):"ko '지금 들어갈게요'는 방에 들어간다고 읽힘 — 바늘을 넣는다고 고침",
 (2,2):"ko에 en에 없는 '시작'을 덧붙였음 — en 그대로 '지금 동의서랑 팔찌를 확인하죠'",
 (8,1):"ko가 조건문(if he shows)을 '있는지'로 옮긴 오역 — '보이면'으로",
 (9,2):"ko '주입이 흐르는 동안'을 자연스럽게 — '주입하는 동안'"}
for si,(a,b) in enumerate(zip(pre['situations'],d['situations'])):
    for j,(x,y) in enumerate(zip(a['sentences'],b['sentences'])):
        f=[k for k in SK if x.get(k)!=y.get(k)]
        if f:
            why=SWHY.get((si,j))
            if not why:
                if f==['chunks']: why='구 경계에서 다시 자름(복합명사·구를 끊지 않게)'
                elif f==['words']: why=({(5,2):"w-sure 태그를 뺌 — make sure는 구 헤드워드 w-make가 맡음(문장 en은 그대로)",(13,4):"w-away 태그를 뺌(은행에서 지움)"}).get((si,j),'태그 정리')
                else: why='검토 수정'
            new.append({'kind':'sentence','situation':a['title'],'index':j,'fields':f,'why':why})
# 같은 대상은 합침
out=[]; idx={}
def ident(c): return (c['kind'],c.get('id'),c.get('situation'),c.get('index'))
for c in list(chg['changes'])+new:
    k=ident(c)
    if k in idx and c['kind'] in ('word','sentence'):
        o=out[idx[k]]; o['fields']=list(dict.fromkeys(o['fields']+c['fields']))
        if c['why'] not in o['why']: o['why']=o['why']+' / '+c['why']
    else: idx[k]=len(out); out.append(copy.deepcopy(c))
chg['changes']=out
yaml.safe_dump(chg,open(f'changes-{T}.yaml','w'),allow_unicode=True,sort_keys=False,width=1000)
print('changes total',len(out),'added/merged',len(new))
