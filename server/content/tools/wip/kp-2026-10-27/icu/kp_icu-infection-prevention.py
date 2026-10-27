"""icu-infection-prevention — keyPhrase 3문장 교체(2026-10-27) + 연동 문장 19.4(F5).
base-icu-infection-prevention.yaml → icu-infection-prevention.yaml"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-infection-prevention.yaml'))
CH = []
OLD = []

# 1·3. 면역저하 보호격리 붕괴 위기 [1][0] + 연동 [4](A 목록 F5)
T = '면역저하 보호격리 붕괴 위기'
o = 'Only healthy, gowned staff should enter, and no live plants or flowers.'
OLD.append(o)
remove_word(doc, 'w-gowned')
CH.append({'kind': 'word-remove', 'id': 'w-gowned', 'why': '바꾼 문장에 gowned가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 19, T, 1, o, {
    'en': 'Only healthy staff should enter, and no live plants or flowers.',
    'ko': '건강한 직원만 들어가야 하고, 화분이나 생화도 안 돼요.',
    'chunks': ['Only', 'healthy staff', 'should enter', ', and no live plants or flowers', '.'],
    'words': ['w-healthy', 'w-staff', 'w-enter'],
    'why': ("'Only'로 들어올 수 있는 사람을 좁히고, 'no live plants'로 금지 물품도 함께 알려요. "
            "생화·화분의 흙과 물에는 곰팡이와 세균이 있어요."),
    'distractorsKo': ['건강한 직원만 들어가야 하고, 음악이나 영상도 안 돼요.',
                      '건강한 직원만 들어가야 하고, 새 책이나 잡지도 안 돼요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'healthy, gowned staff(CDC 보호환경은 감염 의심이 없으면 가운을 일률로 요구하지 않음) → healthy staff; −w-gowned')

o = 'His immune system is severely low, so we must protect him from all germs.'
OLD.append(o)
replace(doc, CH, 19, T, 0, o, {
    'en': 'His immune system is severely low, so we must protect him from germs as much as we can.',
    'ko': '이분은 면역이 심하게 저하돼서 최대한 균으로부터 보호해야 해요.',
    'chunks': ['His immune system', 'is severely low', ', so we must', 'protect him from germs', 'as much as we can', '.'],
    'why': ("'so we must'로 이유와 의무를 한 문장에 잇고, 'as much as we can'으로 할 수 있는 만큼 다한다고 말해요. "
            "모든 균을 막는다는 약속은 지킬 수 없어서예요. 면역이 낮으면 평소엔 무해한 균도 감염을 일으켜요."),
    'distractorsKo': ['이분은 면역이 심하게 저하돼서 최대한 소음으로부터 보호해야 해요.',
                      '이분은 체력이 심하게 저하돼서 최대한 균으로부터 보호해야 해요.'],
}, ['en', 'ko', 'chunks'], 'from all germs(지킬 수 없는 절대 표현) → from germs as much as we can')

# 19.4 — keyPhrase가 아닌 연동 문장(A 목록 F5, K1 결정에 따라)
o = "Let's get everyone back into gowns and restore precautions now."
OLD.append(o)
replace(doc, CH, 19, T, 4, o, {
    'en': "Let's get everyone back to strict hand hygiene and restore precautions now.",
    'ko': '모두 다시 철저히 손위생을 하게 하고 지금 주의조치를 복구하죠.',
    'chunks': ["Let's get everyone", 'back to strict hand hygiene', 'and restore precautions', 'now', '.'],
    'words': ['w-strict', 'w-hygiene', 'w-restore', 'w-precaution'],
    'why': ("'back to'는 무너졌던 기준으로 되돌린다는 그림이에요. 보호환경의 바탕은 손위생이라 그것부터 다잡고, "
            "'now'로 곧바로 시작해요."),
    'decoy': 'in the lobby',
    'distractorsKo': ['모두 다시 철저히 병실 청소를 하게 하고 지금 주의조치를 복구하죠.',
                      '모두 다시 철저히 손위생을 하게 하고 지금 감염관리팀에 알리죠.'],
    'blank': blank('strict', ['casual', 'occasional', 'optional']),
}, ['en', 'ko', 'chunks', 'words'],
    'K1 결정(가운 일률 요구 삭제)에 맞춰 A 목록 F5대로: back into gowns → back to strict hand hygiene; −w-gown(다른 문장에서 계속 씀) +w-strict·w-hygiene')

ol = sit(doc, 19, T)['order']
l2, l3, l4 = ol['lines'][1], ol['lines'][2], ol['lines'][3]
assert l2['en'] == 'So only healthy, gowned staff should enter, and no live plants or flowers.'
assert l3['en'] == "If that standard slipped today, let's get everyone back into gowns now."
assert l4['en'] == "Once everyone is gowned, let's restore full protective isolation immediately."
l2['en'] = 'So only healthy staff should enter, and no live plants or flowers.'
l2['ko'] = '그래서 건강한 직원만 들어가고 생화도 안 돼요'
l3['en'] = "If that standard slipped today, let's get everyone back to strict hand hygiene."
l3['ko'] = '그 기준이 무너졌다면 모두 다시 철저히 손위생을 하죠'
l4['en'] = "With hand hygiene back on track, let's restore full protective isolation immediately."
l4['ko'] = '손위생을 다잡았으면 즉시 완전한 보호격리를 복구하죠'
ol['why'] = ("면역이 약해 균이 위험하다는 이유를 먼저 말하고, So가 그 이유를 받아 출입 기준을 정해요. "
             "3줄의 that standard가 그 기준을 가리켜 무너졌으면 손위생부터 다잡고, 4줄이 그 손위생을 받아 완전한 보호격리를 복구해요.")

# 2. C. difficile 예방·관리 [2]
T = 'C. difficile 예방·관리'
o = 'Bleach-based cleaning is required to kill the spores.'
OLD.append(o)
remove_word(doc, 'w-require')
CH.append({'kind': 'word-remove', 'id': 'w-require', 'why': '바꾼 문장에 require가 없어 어느 문장도 태그하지 않게 됐다'})
replace(doc, CH, 11, T, 2, o, {
    'en': 'A sporicidal cleaner like bleach is needed to kill the spores.',
    'ko': '아포를 없애려면 표백제 같은 살아포 소독제가 필요해요.',
    'chunks': ['A sporicidal cleaner', 'like bleach', 'is needed', 'to kill the spores', '.'],
    'words': ['w-bleach', 'w-need', 'w-kill', 'w-spore'],
    'why': ("'like bleach'로 표백제를 한 예로 들어, 아포를 죽이는 소독제가 표백제만은 아니라는 여지를 남겨요. "
            "아포는 알코올에 잘 죽지 않아 살아포 소독제가 필요해요."),
    'distractorsKo': ['곰팡이를 없애려면 표백제 같은 살아포 소독제가 필요해요.',
                      '냄새를 없애려면 표백제 같은 살아포 소독제가 필요해요.'],
}, ['en', 'ko', 'chunks', 'words'],
    'Bleach-based cleaning is required(살아포 소독제는 표백제 말고도 있음 — EPA List K) → A sporicidal cleaner like bleach is needed; −w-require +w-need')

# 기존 V21(2026-10-27 목록 확대) — w-flag decoyChips 'flog'
w = word(doc, 'w-flag')
assert w['decoyChips'] == ['flog']
w['decoyChips'] = ['flat']

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
assert 'gowned' not in raw, 'gowned가 남아 있음'
dump(doc, os.path.join(HERE, 'icu-infection-prevention.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-infection-prevention.yaml'), CH)
print('icu-infection-prevention.yaml 저장')
