import io, yaml
D = '/tmp/lesson-er-v45b'; T = 'er-sepsis'
doc = yaml.safe_load(open(f'{D}/{T}.yaml', encoding='utf-8'))
ch = yaml.safe_load(open(f'{D}/changes-{T}.yaml', encoding='utf-8'))
C = ch['changes']
W = {w['id']: w for w in doc['words']}
S = {s['title']: s for s in doc['situations']}

def setw(i, **kv):
    for k, v in kv.items():
        assert k in W[i], (i, k)
        W[i][k] = v

def nu(title, kind, pred=lambda q: True):
    qs = [q for q in S[title]['nuance'] if q['kind'] == kind and pred(q)]
    assert len(qs) == 1, (title, kind, len(qs))
    return qs[0]

def addchange(entry):
    for e in C:
        if e.get('kind') == entry['kind'] and e.get('id') == entry.get('id') and e.get('situation') == entry.get('situation') and e.get('index') == entry.get('index'):
            for f in entry.get('fields', []):
                if f not in e['fields']:
                    e['fields'].append(f)
            e['why'] = e['why'] + ' / ' + entry['why']
            return
    C.append(entry)

# --- v45 1~12 ---
# 1
setw('w-race', distractorsEn=['pace', 'rest'],
     cue="환자가 '심장이 너무 빨리 뛴다'고 할 때 쓰는 동사 — 'my heart is ___ing'")
# 2
assert W['w-step']['distractorsEn'] == ['stop', 'stage']
setw('w-step', distractorsEn=['stop', 'strip'])
# 3
setw('w-burn', distractorsEn=['itch', 'bump'], cue='요로감염을 가늠할 때 — 소변볼 때 뜨겁고 화한 느낌')
# 4
setw('w-level', distractorsKo=['비율', '부피'])
# 5
setw('w-little', cue='양이 모자랄 때 — 평소보다 덜(비교급으로 쓴다)')
# 6
q = nu('노인 비전형 패혈증', 'slider'); assert q['scale'] == ['low', 'normal', 'a fever']
q['scale'] = ['low', 'normal', 'high']
# 7
q = nu('요로성 패혈증', 'slider')
q['scale'] = ['routine', 'urgent', 'emergent']; q['answerAt'] = 2
q['example'] = 'With a blockage and an infection, draining the kidney is emergent.'
q['exKo'] = '막힘에 감염까지 있으면 신장 배액은 응급이에요.'
assert '막힌 곳을 빼내는 긴급 감압이 필요한 응급이에요' in q['why']
q['why'] = q['why'].replace('막힌 곳을 빼내는 긴급 감압이 필요한 응급이에요', '막힌 곳을 빼내는 감압이 필요한 응급이에요')
# 8
q = nu('젖산 지속상승 위기', 'context')
q['why'] = q['why'] + " mottling이라는 말을 쓰더라도 '순환이 힘겹다'고 바로 풀어 주면 되고, 환자에게 틀린 건 '무릎까지·5초' 같은 범위와 수치를 그대로 말한 것이에요."
# 9
setw('w-mottle', example="There's mottling up to her knees — I need you at bedside.",
     exKo='무릎까지 피부가 얼룩덜룩해요 — 침상으로 와 주세요.')
addchange({'kind': 'word', 'id': 'w-mottle', 'fields': ['example'],
           'why': '환자 말투 예문을 의료진 보고 말투로 — 단어 카드가 임상어 자리를 보여 주게(젖산 위기 context와 짝)'})
# 10
setw('w-antibiotic', cue='세균 감염에 쓰는 약 — 패혈성 쇼크면 인지 후 1시간 안에, 그 밖에도 되도록 빨리 들어가야 한다')
# 11
q = nu('폐렴성 패혈증', 'slider')
old = '산소를 올리고 지켜볼 단계이지 아직 위험할 만큼은 아니에요. 다만 계속 떨어지거나 호흡이 더 힘들어지면 바로 보고해요.'
assert old in q['why']
q['why'] = q['why'].replace(old, "환자에게는 'a little low'로 말하되, 간호사는 산소를 올리고 보고해요. 계속 떨어지거나 호흡이 힘들어지면 바로 알려요.")
# 12 + ③ : w-level 수치로 되돌림, w-number 숫자
setw('w-level', ko='수치')
setw('w-number', ko='숫자')
C[:] = [e for e in C if not (e.get('kind') == 'word' and e.get('id') == 'w-level')]
addchange({'kind': 'word', 'id': 'w-number', 'fields': ['ko'],
           'why': 'w-level과 ko(수치)가 같아 정답이 둘 — 태그 문장 kidney numbers·the higher the number는 환자용 쉬운 말이라 숫자(형제 er-burn·er-peds도 숫자); w-level은 형제 주제처럼 수치로 둔다'})

# --- 결정 11 ---
# ①
setw('w-confuse', ko='혼란스러운')
# ②
setw('w-place', ko='삽입하다')
addchange({'kind': 'word', 'id': 'w-place', 'fields': ['ko'], 'why': "'거치하다'는 place the tube에 안 맞는다 — 형제 4개 주제처럼 삽입하다"})
# ④ 1차 권고
setw('w-crash', ko='(crash cart의) 응급')
addchange({'kind': 'word', 'id': 'w-crash', 'fields': ['ko'], 'why': "'응급의'는 crash의 뜻이 아니라 crash cart의 수식 — 쓰임을 밝혀 (crash cart의) 응급"})
# ⑤
setw('w-get', example='Her kidney numbers are getting worse.', exKo='신장 수치가 나빠지고 있어요.')
addchange({'kind': 'word', 'id': 'w-get', 'fields': ['example'], 'why': "ko '(그 상태가) 되다'인데 예문은 getting enough blood(받다)였다"})
# ⑥
for title, idx in [('정맥로·수액 시작 설명', 4), ('수액반응성 평가', 2), ('수액반응성 평가', 5)]:
    se = S[title]['sentences'][idx]
    assert 'short of breath' in se['en'] and 'w-breathe' in se['words'] and 'w-short' in se['words']
    se['words'].remove('w-breathe')
    addchange({'kind': 'sentence', 'situation': title, 'index': idx, 'fields': ['words'],
               'why': 'short of breath가 구 헤드워드(w-short)라 명사 breath를 동사 w-breathe로 가르치지 않게 태그를 뺐다'})


class Dumper(yaml.SafeDumper):
    pass

def _str(d, s):
    return d.represent_scalar('tag:yaml.org,2002:str', s, style='"' if s.lower() in ('on', 'off', 'yes', 'no', 'true', 'false', 'null', 'y', 'n') else None)

Dumper.add_representer(str, _str)
io.open(f'{D}/{T}.yaml', 'w', encoding='utf-8').write(yaml.dump(doc, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
io.open(f'{D}/changes-{T}.yaml', 'w', encoding='utf-8').write(yaml.dump(ch, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
print('changes', len(C))
