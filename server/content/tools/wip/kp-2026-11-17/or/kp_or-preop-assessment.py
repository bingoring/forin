"""or-preop-assessment — keyPhrase 1문장 교체 + keyPhrase chunks 다시 자르기(2026-11-17 OR 묶음 3 결정, '추천대로').
base-or-preop-assessment.yaml → or-preop-assessment.yaml"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks
kp_common.MARK = 'keyPhrase 교체(2026-11-17 사용자 결정)'

doc = load(os.path.join(HERE, 'base-or-preop-assessment.yaml'))
CH = []
OLD = []
DASH = '—'


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert len(s['distractorsKo']) == 2 and s['ko'] not in s['distractorsKo']
    assert meaningful_chunks(s['chunks']) >= min_chunks_for(s['en']), (s['en'], s['chunks'])
    assert not dangling_chunks(s['chunks']), s['chunks']


def recut(si, title, index, en, chunks, extra=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(필요하면 decoy도 새 조각 자리에 맞춘다)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    if extra:
        s.update(extra)
    check_new(s)
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'] + sorted(extra or {}),
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"})


# ── 1. 응급 환자 금식 위반 [15] 문장 0 — 유도 방식(RSI)은 마취과가 정함, 간호사는 준비를 맡는다(K1) ──
T = '응급 환자 금식 위반'
o = f'We should treat this as a full stomach {DASH} RSI it is.'
OLD.append(o)
NEW = f"We should treat this as a full stomach {DASH} I'll set up for RSI."
KO = '이 환자는 full stomach로 봐야 해요 — RSI 준비를 할게요.'
s = replace(doc, CH, 15, T, 0, o, {
    'en': NEW,
    'ko': KO,
    'chunks': ['We should treat this', 'as a full stomach', f"{DASH} I'll set up", 'for RSI', '.'],
    'words': ['w-treat', 'w-full', 'w-stomach', 'w-set', 'w-rsi'],
    'tag': 'RSI 준비',
    'icon': 'siren',
    'why': ("We should…로 판단을 제안하듯 말해 마취과와 같은 그림을 맞춰요. 대시 뒤 I'll set up for RSI는 유도 방식을 정하는 말이 아니라, "
            '흡인 위험에 쓰는 신속유도(RSI)에 필요한 물품을 간호사가 차려 두겠다는 말이에요.'),
    'decoy': 'for discharge',
    'distractorsKo': ['이 환자는 응급 수술 환자로 봐야 해요 — RSI 준비를 할게요.',
                      '이 환자는 full stomach로 봐야 해요 — 사고 한 시간 전에 먹었어요.'],
    'blank': blank('stomach', ['bladder', 'schedule', 'dose']),
}, ['en', 'ko', 'chunks', 'words'],
    "We should treat this as a full stomach — RSI it is → … — I'll set up for RSI.(유도 방식을 간호사가 정하는 말로 읽힘 — 간호사는 준비를 맡음; 검토 A K1); "
    '+w-set 태그(20.1에 있음)')
check_new(s)
for wid in ('w-treat', 'w-full', 'w-rsi'):
    w = word(doc, wid)
    assert w['example'] == NEW and w['exKo'] == KO, wid
od = sit(doc, 15, T)['order']
l0 = od['lines'][0]
assert l0['en'] == o and l0['note'] == '결정', l0
l0.update({'en': NEW, 'ko': 'full stomach로 봐야 해요 — RSI 준비를 할게요', 'note': '판단'})
assert len(l0['en'].split()) <= 15
old_why = '먼저 full stomach로 보고 RSI로 간다고 정하고,'
assert od['why'].startswith(old_why), od['why']
od['why'] = od['why'].replace(old_why, '먼저 full stomach로 봐야 한다며 RSI 준비를 하겠다고 하고,', 1)

# ── 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-or-preop-assessment-A.md "KP chunks가 구 경계를 끊은 것" ──
recut(1, '약물 알레르기 문진', 1, 'Was it just a rash, or any trouble breathing or swelling?',
      ['Was it', 'just a rash', ', or any trouble breathing', 'or swelling', '?'],
      {'decoy': 'or itching'})
recut(2, '과거 수술·마취 이력', 0, 'How did you feel waking up from your last anesthesia?',
      ['How', 'did you feel', 'waking up', 'from your last anesthesia', '?'],
      {'decoy': 'falling asleep'})
recut(3, '복용 약물 목록 확인', 2, 'Did you take your blood pressure pill this morning?',
      ['Did you', 'take', 'your blood pressure pill', 'this morning', '?'])
recut(5, '키·체중·BMI 확인', 0, "Let's get an accurate weight for your medication dosing.",
      ["Let's", 'get', 'an accurate weight', 'for your medication dosing', '.'],
      {'decoy': 'for your diet plan'})
recut(5, '키·체중·BMI 확인', 2, 'This helps us give you the exact right dose.',
      ['This', 'helps us', 'give you', 'the exact right dose', '.'],
      {'decoy': 'show you'})
recut(6, '물 한 모금 금식 위반', 0, 'Exactly how much water did you have, and at what time?',
      ['Exactly', 'how much water', 'did you have', ', and at what time', '?'])
recut(6, '물 한 모금 금식 위반', 1, 'I need to report this to the anesthesia team.',
      ['I need', 'to report', 'this', 'to the anesthesia team', '.'])
recut(11, '한약·건강보조제 복용', 2, "I'll list these so surgery knows about the bleeding risk.",
      ["I'll list", 'these', 'so surgery knows', 'about the bleeding risk', '.'])
recut(13, '가임기 임신 가능성', 0, "It's a routine safety test for everyone who could be pregnant.",
      ["It's", 'a routine safety test', 'for everyone', 'who could be pregnant', '.'],
      {'decoy': 'a routine billing form'})
recut(14, '최근 상기도 감염', 0, 'When did the cough and congestion start?',
      ['When did', 'the cough and congestion', 'start', '?'],
      {'decoy': 'the rash and itching'})
recut(16, '조영제 아나필락시스 병력', 0, f"That's a serious reaction {DASH} I'm marking you as high-risk.",
      ["That's", 'a serious reaction', f"{DASH} I'm marking you", 'as high-risk', '.'],
      {'decoy': 'as a donor'})
recut(17, '원인 미상 약물 반응', 0, "Let's figure out everything you were given around that time.",
      ["Let's figure out", 'everything', 'you were given', 'around that time', '.'],
      {'decoy': 'you were wearing'})
recut(18, '마취 가족력 MH 의심', 2, "I'll alert anesthesia so they can plan a safe technique.",
      ["I'll alert", 'anesthesia', 'so they can plan', 'a safe technique', '.'])
# 그대로 둔 것(구를 지키면 V8을 못 맞춤): 10.1 · 10.2 · 12.2 · 15.2 — 돌려줄 말에 이유

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['RSI it is', 'RSI로 갈게요', 'RSI로 갑시다', 'RSI로 간다고 정하고']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'or-preop-assessment.yaml'))
append_changes(os.path.join(HERE, 'changes-or-preop-assessment.yaml'), CH)
print('or-preop-assessment.yaml 저장')
