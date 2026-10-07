"""결정 13 잔여 수정 — 뇌졸중 Fable 최종 판정(gate-er-stroke.md)과 쇼크 수정 대조에서 나온 것.

Sonnet 수정이 남긴 '바꾼 값 주변' 흠과 판정의 필수 7건 + pair 1건 + 선택 4건을 제자리에서 고친다.
"""
import io
import os

import yaml

D = os.path.dirname(os.path.abspath(__file__))


def load(name):
    return yaml.safe_load(io.open(os.path.join(D, name), encoding='utf-8'))


def save(name, doc):
    with io.open(os.path.join(D, name), 'w', encoding='utf-8') as f:
        yaml.safe_dump(doc, f, allow_unicode=True, sort_keys=False, width=1000, default_flow_style=None)


def sit(doc, title):
    return next(s for s in doc['situations'] if s['title'] == title)


def nu(doc, title, kind):
    return next(n for n in sit(doc, title)['nuance'] if n['kind'] == kind)


def word(doc, wid):
    return next(w for w in doc['words'] if w['id'] == wid)


def change(chg, entry):
    for c in chg['changes']:
        if all(c.get(k) == entry.get(k) for k in ('kind', 'id', 'situation', 'index')):
            c['fields'] += [f for f in entry['fields'] if f not in c['fields']]
            c['why'] = c['why'] + ' / ' + entry['why']
            return
    chg['changes'].append(entry)


# ---- 뇌졸중 ----
doc, chg = load('er-stroke.yaml'), load('changes-er-stroke.yaml')
young = sit(doc, '젊은 환자 경동맥 박리')['sentences']

# 필수 1·2: 문장 ko를 고칠 때 빠뜨린 exKo
word(doc, 'w-neck')['exKo'] = young[0]['ko']
word(doc, 'w-numbness')['exKo'] = young[1]['ko']
# 필수 3: chips 를 한 조각으로 바꾸며 남은 옛 분할 찌꺼기
word(doc, 'w-check')['decoyChips'] = ['cheek']
# 필수 4: '정각'은 시 정각이라 8:15 에 틀린 말
sl = nu(doc, '마지막 정상 시각 확정', 'slider')
sl['why'] = sl['why'].replace('exactly(정각)', 'exactly(정확한 시각)')
# 필수 9: 염좌는 sprain(인대) — 같은 상황 swap 이 sprain=염좌로 가르친다
word(doc, 'w-strain')['ko'] = '무리한 힘(근육 좌상)'
change(chg, {'kind': 'word', 'id': 'w-strain', 'fields': ['ko'], 'why': '염좌는 sprain — 근육 좌상으로'})
# 필수 10·11: 구 경계가 아닌 청크
sit(doc, '실어증 환자 소통')['sentences'][3]['chunks'] = ["I'll ask", 'yes or no', 'questions', ', one at a time', '.']
change(chg, {'kind': 'sentence', 'situation': '실어증 환자 소통', 'index': 3, 'fields': ['chunks'],
             'why': "청크가 구 경계를 끊음(', one at' / 'a time')"})
sit(doc, '언어장벽 뇌졸중')['sentences'][3]['chunks'] = ['Show me', 'with your fingers', ', one to five', '.']
change(chg, {'kind': 'sentence', 'situation': '언어장벽 뇌졸중', 'index': 3, 'fields': ['chunks'],
             'why': "청크가 구 경계를 끊음(', one' / 'to five')"})
# pair: 'bring up your finger' 가 영어로 성립해 정답이 둘
pr = nu(doc, '즉시 혈당·활력 측정', 'pair')
pr['pairs'][1] = ['give', 'sugar through your IV']
pr['why'] = '동사가 짝을 정해요. 채혈은 손끝을 prick(찔러서), 낮은 혈당은 IV로 당을 give(주다), 혈압 커프는 apply(대다).'
# 선택: 코 검사 cue 가 ko '코'를 되풀이
word(doc, 'w-nose')['cue'] = '신경 검사에서 손가락으로 내 손끝과 번갈아 짚게 하는, 얼굴 한가운데 튀어나온 곳'
# 선택: 'week'는 명사 — 같은 품사 오답으로
word(doc, 'w-weak')['distractorsEn'] = ['weary', 'wobbly']
# 선택: 'a real risk'는 중간 강도가 아님
nu(doc, '대혈관 폐색 혈전제거술 이송', 'slider')['scale'] = ['a small risk', 'a moderate risk', 'a high risk']
# 선택: tingling 은 감각 이상의 종류 — 강도 축으로
fs = nu(doc, 'FAST 초기 선별', 'slider')
fs['scale'] = ['slightly numb', 'numb', 'no feeling at all']
fs['why'] = ('slightly numb은 조금 둔한 정도, numb는 감각이 크게 둔해진 상태(치과 마취 뒤처럼), no feeling at all은 '
             '완전한 소실이에요. 환자가 쓰는 말대로 정도를 구분해 기록하세요.')
save('er-stroke.yaml', doc)
save('changes-er-stroke.yaml', chg)

# ---- 쇼크 ----
doc = load('er-shock.yaml')
# 수치만 98→88로 바꾸고 해설은 그대로 — 88은 저혈압 기준(90) 아래
lo = nu(doc, '저혈압 초기 활력 인지', 'slider')
lo['why'] = ("수축기 88은 저혈압 기준(90) 아래라 바로 보고할 값이에요. 환자에게는 겁주지 않고 사실대로 'a little low'라고 "
             "말하고, 'dangerously low'는 불안만 키워요.")
# 정답을 put 으로 바꾸고 해설은 'put in' 그대로
sw = next(n for n in sit(doc, '대구경 정맥로·수액 설명')['nuance'] if n['kind'] == 'swap')
sw['why'] = sw['why'].replace("'put in'처럼", "'put'처럼")
save('er-shock.yaml', doc)
