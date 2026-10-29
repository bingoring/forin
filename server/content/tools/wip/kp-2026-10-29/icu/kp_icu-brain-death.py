"""icu-brain-death — keyPhrase 5문장 교체 + keyPhrase chunks 7문장 다시 자르기(2026-10-29).
base-icu-brain-death.yaml → icu-brain-death.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-icu-brain-death.yaml'))
CH = []
OLD = []


def nlen(s):
    return len(re.sub(r'\s', '', s))


def dko(ko, ds):
    """문장 distractorsKo 길이(V20: 1.25배 이내 또는 3자 이내) + 하나는 정답 길이 이하."""
    a = nlen(ko)
    for d in ds:
        b = nlen(d)
        assert max(a, b) <= 1.25 * min(a, b) or abs(a - b) <= 3, (ko, d)
    assert min(nlen(d) for d in ds) <= a, (ko, ds)
    return list(ds)


def line(si, title, k, old_en, en, ko):
    l = sit(doc, si, title)['order']['lines'][k]
    assert l['en'] == old_en, (title, k, l['en'])
    assert len(en.split()) <= 15, en
    l['en'], l['ko'] = en, ko


def owhy(si, title, old, new):
    od = sit(doc, si, title)['order']
    assert old in od['why'], (title, od['why'])
    od['why'] = od['why'].replace(old, new)


def recut(si, title, index, en, chunks, decoy=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(decoy가 새 조각 자리에 안 맞으면 새로)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    if decoy:
        s['decoy'] = decoy
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', en)) == 1
    assert s['decoy'] not in chunks and s['decoy'] not in en, s['decoy']
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'],
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"
                      + (f"; decoy를 새 조각 자리에 맞춤({decoy})" if decoy else '')})


# 3. 뇌사 후 순환 붕괴 위기 [16] — 처방 최대치를 넘겨 올리라는 말로 읽힘(slider 16 why와 모순)
T = '뇌사 후 순환 붕괴 위기'
o = 'Max the pressors and give volume now.'
OLD.append(o)
ko = '승압제를 처방된 최대치까지 조절하고, 수액은 처방대로 주세요.'
replace(doc, CH, 16, T, 0, o, {
    'en': 'Titrate the pressors to the ordered max and give volume as ordered.',
    'ko': ko,
    'chunks': ['Titrate the pressors', 'to the ordered max', 'and give volume', 'as ordered', '.'],
    'words': ['w-titrate', 'w-pressor', 'w-max', 'w-give', 'w-volume'],
    'tag': '처방 내 승압',
    'why': ("'to the ordered max'는 처방이 허용하는 최대치까지만 올린다는 한계를 말해요. 'Titrate'는 혈압을 보며 조금씩 맞춘다는 뜻이고, "
            "'as ordered'로 수액도 처방대로라는 것을 밝혀요. 최대치에서도 혈압이 떨어지면 의사를 바로 불러요."),
    'decoy': 'to the ordered mix',
    'distractorsKo': dko(ko, ['승압제를 처방된 최대치까지 조절하고, 의사를 바로 부르세요.',
                              '승압제를 처방된 최대치까지 조절하고, 두 번째 정맥 라인을 잡으세요.']),
    'blank': blank('pressors', ['feeds', 'antibiotics', 'warmers']),
}, ['en', 'ko', 'chunks', 'words'],
    '처방 최대치를 넘겨 올리라는 말로 읽힘(안전, slider 16 why와 모순) → to the ordered max … as ordered; '
    '+w-titrate(은행에 있음). w-max는 문장에 남아 동사→명사(최대치)로 태그 유지. order 16 줄 3·why도 맞춤')
w = word(doc, 'w-max')
w.update({
    'ko': '최대치',
    'cue': '처방이 허용하는 가장 높은 용량 — 그 위로는 올리지 않는 한계',
    'distractorsEn': ['min', 'mask'],
    'distractorsKo': ['최소치', '평균치'],
})
CH.append({'kind': 'word', 'id': 'w-max', 'fields': ['ko'],
           'why': '문장이 Max the pressors(동사) → the ordered max(명사) — ko 최대로 올리다 → 최대치, cue·오답도 명사로'})
line(16, T, 2, "Before they arrive, I'll titrate the pressors up and give the ordered volume.",
     "Before they arrive, I'll titrate pressors to the ordered max and give volume as ordered.",
     '그들이 오기 전에 승압제를 처방된 최대치까지 올리고 수액을 처방대로 줘요')
owhy(16, T, '처방 범위에서 승압제를 올리고 처방된 수액을 주고', '처방된 최대치까지 승압제를 올리고 처방대로 수액을 주고')

# 4. 무호흡 검사 중 급변 위기 [15] — 명령형 투여 → 의사에게 묻는 질문
T = '무호흡 검사 중 급변 위기'
o = 'Start pressors and give a fluid bolus.'
OLD.append(o)
ko = '승압제를 시작하고 수액 볼루스를 줄까요?'
replace(doc, CH, 15, T, 1, o, {
    'en': 'Should we start pressors and give a fluid bolus?',
    'ko': ko,
    'chunks': ['Should we', 'start pressors', 'and give', 'a fluid bolus', '?'],
    'tag': '처치 제안',
    'why': ("'Should we …?'는 처방이 필요한 처치를 의사에게 제안하며 묻는 틀이에요. 위급할 때도 무엇을 할지 "
            "구체적으로 말하면 의사가 바로 결정할 수 있어요."),
    'distractorsKo': dko(ko, ['승압제를 시작하고 의사를 부를까요?',
                              '승압제를 연결하려고 펌프를 켤까요?']),
}, ['en', 'ko', 'chunks'], '간호사가 명령형으로 투여를 정함 → Should we …? 질문(태그 단어 그대로). order 15 줄 3·why도 질문으로')
line(15, T, 2, 'With him back on the vent, start pressors and give a fluid bolus.',
     'With him back on the vent, should we start pressors and give a fluid bolus?',
     '연결했으니 승압제와 볼루스를 시작할까요?')
owhy(15, T, '다시 연결한 뒤 승압제와 볼루스를 주고', '다시 연결한 뒤 승압제와 볼루스를 시작할지 묻고')

# 5. 심한 요붕증 급변 관리 [17] — 명령형 투여 → 처방 요청 질문
T = '심한 요붕증 급변 관리'
o = 'Give desmopressin now and start matching the losses.'
OLD.append(o)
ko = '지금 데스모프레신 처방을 받고 손실량을 맞추기 시작할까요?'
replace(doc, CH, 17, T, 0, o, {
    'en': 'Can we get desmopressin ordered now and start matching the losses?',
    'ko': ko,
    'chunks': ['Can we get', 'desmopressin ordered', 'now', 'and start', 'matching the losses', '?'],
    'words': ['w-desmopressin', 'w-start', 'w-match', 'w-loss'],
    'tag': '처방 요청',
    'why': ("'Can we get … ordered'는 약을 직접 정하지 않고 의사에게 처방을 바로 내 달라고 요청하는 틀이에요. "
            "'start matching the losses'로 빠져나가는 소변만큼 수액을 맞추기 시작하자는 제안을 함께 해요."),
    'decoy': 'marking the losses',
    'distractorsKo': dko(ko, ['지금 데스모프레신 처방을 받고 두 번째 라인을 잡을까요?',
                              '지금 데스모프레신 처방을 받고 코디네이터에게도 알릴까요?']),
}, ['en', 'ko', 'chunks', 'words'],
    '명령형 투여 지시 → Can we get desmopressin ordered …? 처방 요청; −w-give(문장에 give가 없어짐, 7.1·8.0 등에서 계속 씀). '
    'w-order는 은행 뜻이 순서라 태그하지 않음')

# 6. 요붕증 관리 [8] — 처방 근거
T = '요붕증 관리'
o = "Let's give desmopressin and match the fluid losses."
OLD.append(o)
ko = '처방대로 데스모프레신을 주고 수액 손실량을 맞추겠습니다.'
replace(doc, CH, 8, T, 0, o, {
    'en': "Let's give the desmopressin as ordered and match the fluid losses.",
    'ko': ko,
    'chunks': ["Let's give", 'the desmopressin', 'as ordered', 'and match', 'the fluid losses', '.'],
    'why': ("'as ordered'로 약은 처방대로 준다는 것을 밝혀요. 'Let's give … and match'는 약을 준 뒤에도 "
            "빠져나가는 수액을 계속 맞춘다는 두 일을 이어 말해요."),
    'distractorsKo': dko(ko, ['처방대로 데스모프레신을 주고 나트륨을 다시 재겠습니다.',
                              '처방대로 데스모프레신을 주고 수액으로 혈압을 지키겠습니다.']),
}, ['en', 'ko', 'chunks'], '처방 근거가 없음 → the desmopressin as ordered(태그 단어 그대로). order 8 줄 3·why도 맞춤')
line(8, T, 2, "To fix that, let's give desmopressin and match the fluid losses.",
     "To fix that, let's give the desmopressin as ordered and match the fluid losses.",
     '그걸 막으려고 처방대로 데스모프레신을 줘요')
owhy(8, T, '그걸 막기 위해 약과 수액을 정하고', '그걸 막기 위해 처방대로 약을 주고 수액을 맞추고')

# 7. 뇌사 후 혈역학 유지 [7] — 단독 투여처럼 읽힘
T = '뇌사 후 혈역학 유지'
o = "I'll give a fluid bolus and reassess."
OLD.append(o)
ko = '처방된 수액 볼루스를 주고 재평가하겠습니다.'
replace(doc, CH, 7, T, 1, o, {
    'en': "I'll give the ordered fluid bolus and reassess.",
    'ko': ko,
    'chunks': ["I'll give", 'the ordered fluid bolus', 'and reassess', '.'],
    'why': ("'the ordered'로 처방된 볼루스를 준다는 것을 밝혀요. 'give … and reassess'는 주고 나서 "
            "반응을 본다는 순서를 말해요."),
    'decoy': 'and reassure',
    'distractorsKo': dko(ko, ['처방된 수액 볼루스를 주기 전에 호흡음을 듣겠습니다.',
                              '처방된 수액 볼루스를 주고 부종을 보겠습니다.']),
}, ['en', 'ko', 'chunks'], '단독 투여처럼 읽힘 → the ordered fluid bolus(태그 단어 그대로). order 7 줄 2도 맞춤')
line(7, T, 1, "Let's give a fluid bolus for that.",
     "Let's give the ordered fluid bolus for that.",
     '그걸 위해 처방된 수액 볼루스를 줘요')

# keyPhrase chunks 다시 자르기(en 그대로) — fix-icu-brain-death-A.md E절 'keyPhrase chunks(보고만)' 7문장
recut(2, '무호흡 검사 준비', 2, 'Everything is set for the apnea test to begin.',
      ['Everything', 'is set', 'for the apnea test', 'to begin', '.'], 'to finish')
recut(6, '무호흡 검사 중 안전 감시', 2, 'Rescue equipment is at the bedside and ready.',
      ['Rescue equipment', 'is at the bedside', 'and ready', '.'], 'and labeled')
recut(12, '동의·문화적 고려', 2, 'I can arrange for the coordinator to speak with all of you together.',
      ['I can arrange', 'for the coordinator', 'to speak', 'with all of you', 'together', '.'])
recut(15, '무호흡 검사 중 급변 위기', 2, "Let's stabilize him before anything else.",
      ["Let's", 'stabilize him', 'before anything else', '.'], 'reposition him')
recut(18, '가족 갈등·기증 거부 상황', 0, "I hear you, and your family's wishes will be respected.",
      ['I hear you,', "and your family's wishes", 'will be', 'respected', '.'], 'inspected')
recut(3, '가족에게 상태 설명 지원', 3, "I'll make sure the doctor explains anything that's still unclear.",
      ["I'll make sure", 'the doctor explains', 'anything', "that's still unclear", '.'])
recut(11, '가족 사별 지원·소통', 0, 'Take all the time you need to be with him.',
      ['Take', 'all the time you need', 'to be', 'with him', '.'])

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for frag in ['Max the pressors', 'start pressors and give a fluid bolus.', 'give desmopressin and match',
             'give a fluid bolus and reassess', '최대로 올리']:
    assert frag not in raw, frag
dump(doc, os.path.join(HERE, 'icu-brain-death.yaml'))
append_changes(os.path.join(HERE, 'changes-icu-brain-death.yaml'), CH)
print('icu-brain-death.yaml 저장')
