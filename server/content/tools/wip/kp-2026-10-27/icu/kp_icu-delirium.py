"""icu-delirium — keyPhrase 6문장 교체(2026-10-27). base-icu-delirium.yaml → icu-delirium.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-delirium.yaml'))
CH = []
OLD = []

# 9. CAM-ICU 선별 시행 [5]
T = 'CAM-ICU 선별 시행'
o = 'If two features are positive, he screens delirious.'
OLD.append(o)
replace(doc, CH, 0, T, 5, o, {
    'en': 'If features 1 and 2, plus 3 or 4, are positive, he screens delirious.',
    'ko': '1번과 2번 항목에 더해 3번이나 4번이 양성이면 섬망으로 판정돼요.',
    'chunks': ['If features 1 and 2', ', plus 3 or 4', ', are positive', ', he screens delirious', '.'],
    'why': ("'plus 3 or 4'를 쉼표 사이에 끼워 꼭 있어야 하는 항목(1·2)과 둘 중 하나면 되는 항목(3·4)을 한 문장에서 갈라요. "
            "급성 변화·변동과 부주의가 모두 있고, 의식 수준 변화나 사고 와해 중 하나가 더 있어야 양성이에요."),
    'distractorsKo': ['1번과 2번 항목에 더해 3번이나 4번이 양성이면 감염으로 판정돼요.',
                      '1번과 2번 환자에 더해 3번이나 4번이 양성이면 섬망으로 판정돼요.'],
}, ['en', 'ko', 'chunks'], 'If two features(CAM-ICU 양성 기준이 틀림) → If features 1 and 2, plus 3 or 4')

# 12. 수면-각성 주기 회복 전략 [3]
T = '수면-각성 주기 회복 전략'
o = 'The ABCDEF bundle ties sedation, mobility, and sleep together.'
OLD.append(o)
replace(doc, CH, 9, T, 3, o, {
    'en': 'The ABCDEF bundle ties pain, sedation, delirium, and mobility together.',
    'ko': 'ABCDEF 번들은 통증, 진정, 섬망, 이동을 함께 묶어요.',
    'chunks': ['The ABCDEF bundle', 'ties', 'pain, sedation, delirium, and mobility', 'together', '.'],
    'words': ['w-bundle', 'w-tie', 'w-pain', 'w-sedation', 'w-delirium', 'w-mobility', 'w-together'],
    'why': ("ties A, B, C, and D together는 여러 요소를 하나의 묶음으로 엮는다는 뜻이에요. "
            "ABCDEF는 통증, 깨우기·자발호흡 시험, 진정제 선택, 섬망, 조기 이동, 가족 참여의 첫 글자예요."),
    'distractorsKo': ['ABCDEF 번들은 통증, 진정, 섬망, 청소를 함께 묶어요.',
                      'ABCDEF 번들은 통증, 진정, 섬망, 비용을 함께 묶어요.'],
    'blank': blank('mobility', ['surgery', 'dialysis', 'imaging']),
}, ['en', 'ko', 'chunks', 'words'],
    'sedation, mobility, and sleep(수면은 ABCDEF의 글자가 아님) → pain, sedation, delirium, and mobility; −w-sleep(다른 문장에서 계속 씀) +w-pain·w-delirium')

# 14. 가족에게 섬망 설명·교육 [1]
T = '가족에게 섬망 설명·교육'
o = "It's caused by his illness, not permanent dementia."
OLD.append(o)
remove_word(doc, 'w-permanent')
CH.append({'kind': 'word-remove', 'id': 'w-permanent', 'why': '바꾼 문장에 permanent가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 14, T, 1, o, {
    'en': "It's caused by his illness, and it's different from dementia.",
    'ko': '지금 앓는 병 때문에 생긴 거고, 치매와는 달라요.',
    'chunks': ["It's caused", 'by his illness', ", and it's different", 'from dementia', '.'],
    'words': ['w-cause', 'w-illness', 'w-dementia'],
    'why': ("caused by는 원인을 수동태로 말해 '환자 잘못이 아님'을 암시해요. different from dementia로 치매와 구분해 주되, "
            "치매가 함께 있을 가능성까지 닫지는 않아요."),
    'distractorsKo': ['지금 먹는 음식 때문에 생긴 거고, 치매와는 달라요.',
                      '지금 입은 상처 때문에 생긴 거고, 치매와는 달라요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'not permanent dementia(기저 치매 가능성을 배제하는 듯 들림) → and it\'s different from dementia; −w-permanent(은행에서 지움)')
ol = sit(doc, 14, T)['order']
l2 = ol['lines'][1]
assert l2['en'] == o
l2['en'] = "It's caused by his illness, and it's different from dementia."
l2['ko'] = '지금 앓는 병 때문이고 치매와는 달라요'

# 10. 섬망 중 라인·튜브 자가제거 급변 [3]
T = '섬망 중 라인·튜브 자가제거 급변'
o = "Secure his hands and we'll replace access urgently."
OLD.append(o)
replace(doc, CH, 16, T, 3, o, {
    'en': "Gently hold his hands, and we'll replace access urgently.",
    'ko': '손을 살며시 잡아 주시고, 접근로는 서둘러 다시 확보할게요.',
    'chunks': ['Gently hold his hands', ", and we'll", 'replace access', 'urgently', '.'],
    'words': ['w-hold', 'w-replace', 'w-access', 'w-urgently'],
    'why': ("Gently hold는 억제대로 묶는 게 아니라 손으로 부드럽게 잡아 더 뽑지 않게 하는 말이에요. "
            "쉼표 뒤 we'll replace로 '먼저 안전, 그다음 재확보' 흐름을 만들고, urgently는 서두르라는 부사예요."),
    'distractorsKo': ['손을 살며시 잡아 주시고, 담요는 서둘러 다시 덮어 드릴게요.',
                      '어깨를 살며시 잡아 주시고, 접근로는 서둘러 다시 확보할게요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'Secure his hands(손 고정 = 억제 — 처방·정책 필요) → Gently hold his hands; −w-secure(15.2에서 계속 씀) +w-hold')

# 11·13. 금단 발작·진전섬망 위기 [3][0]
T = '금단 발작·진전섬망 위기'
o = 'This looks like delirium tremens, escalate the dose.'
OLD.append(o)
replace(doc, CH, 18, T, 3, o, {
    'en': "This looks like delirium tremens — let's get orders to escalate the dose.",
    'ko': '진전섬망처럼 보이니 용량을 늘리도록 처방을 받죠.',
    'chunks': ['This looks like', 'delirium tremens', "— let's get orders", 'to escalate the dose', '.'],
    'words': ['w-look', 'w-delirium', 'w-tremens', 'w-order', 'w-escalate', 'w-dose'],
    'why': ("This looks like …는 확정이 아니라 '~처럼 보인다'는 판단이에요. let's get orders로 증량을 간호사 혼자 정하지 않고 "
            "처방을 받아 하자고 말해요."),
    'decoy': 'for a chest X-ray',
    'distractorsKo': ['금단 발작처럼 보이니 용량을 늘리도록 처방을 받죠.',
                      '진전섬망처럼 보이니 용량을 늘리도록 약국에 묻죠.'],
}, ['en', 'ko', 'chunks', 'words'],
    "escalate the dose(간호사 단독 증량으로 읽힘·쉼표 접속 비문) → — let's get orders to escalate the dose; +w-order")

o = "He's seizing — protect his airway and give the benzo now."
OLD.append(o)
replace(doc, CH, 18, T, 0, o, {
    'en': "He's seizing — protect his airway and give the PRN benzo now.",
    'ko': '발작 중이에요 — 기도를 보호하고 지금 PRN 벤조를 주세요.',
    'chunks': ["He's seizing", '— protect his airway', 'and give', 'the PRN benzo now', '.'],
    'why': ("He's seizing — …은 상황을 한 줄로 알린 뒤 대시로 지시 두 개를 이어요. the PRN benzo는 이미 처방된 필요시 약을 가리켜, "
            "처방 범위 안의 투여라는 게 말에 드러나요."),
    'distractorsKo': ['발작 중이에요 — 기도를 보호하고 지금 PRN 벤조를 가져와 주세요.',
                      '발작 중이에요 — 기도를 보호하고 PRN 벤조 처방부터 확인해 주세요.'],
}, ['en', 'ko', 'chunks'], 'give the benzo(처방 없이 투여로 읽힐 수 있음) → give the PRN benzo')
ol = sit(doc, 18, T)['order']
l1 = ol['lines'][0]
assert l1['en'] == o
l1['en'] = "He's seizing — protect his airway and give the PRN benzo now."
l1['ko'] = '발작 중이에요 — 기도를 보호하고 지금 PRN 벤조를 주세요'
ol['why'] = ol['why'].replace('기도 보호·벤조 지시가', '기도 보호·PRN 벤조 지시가', 1)
assert 'PRN 벤조 지시가' in ol['why']

check(doc, OLD)
dump(doc, os.path.join(HERE, 'icu-delirium.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-delirium.yaml'), CH)
print('icu-delirium.yaml 저장')
