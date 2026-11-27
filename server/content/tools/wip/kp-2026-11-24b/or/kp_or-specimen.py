"""or-specimen — keyPhrase 6문장 교체 + keyPhrase chunks 다시 자르기(2026-11-24 OR 묶음 6 결정, '추천대로').
base-or-specimen.yaml → or-specimen.yaml
근거: wip/icu-or-rest/or/fix-or-specimen-A.md §9 (K1 20.2·K2 0.1·K4 19.2·K5 14.2·K7 7.2·K10 12.1, KP chunks 목록)
대화 상대(정본 persona): 0·20 소독간호사, 7·12 병리사, 14·19 순회간호사."""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
sys.path.insert(0, '/Users/ywyeom/private/forin/server/content/tools')
import kp_common
from kp_common import *  # noqa
from verify_lesson_content import min_chunks_for, meaningful_chunks, dangling_chunks
kp_common.MARK = 'keyPhrase 교체(2026-11-24 사용자 결정)'

doc = load(os.path.join(HERE, 'base-or-specimen.yaml'))
CH = []
NOTE = []  # v45·v46 필드(order·nuance) 고침 — changes 목록 대상이 아님(V16은 v44만 봄)
OLD = []


def klen(s):
    return len(re.sub(r'\s', '', s))


def blank_at(answer, others, pos):
    """정답 칸을 base 자리 그대로(blank()는 정답을 맨 앞에 둔다)."""
    b = blank(answer, others)
    o = b['options'][1:]
    o.insert(pos, {'en': answer})
    b['options'] = o
    return b


def check_new(s, ko_kept=False):
    assert len(re.findall(r'(?<![\w-])' + re.escape(s['blank']['answer']) + r'(?![\w-])', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert len(s['distractorsKo']) == 2 and s['ko'] not in s['distractorsKo']
    a = klen(s['ko'])
    for x in s['distractorsKo']:
        b = klen(x)
        assert max(a, b) / min(a, b) <= 1.25 or abs(a - b) <= 3, (s['ko'], x, a, b)
    if not ko_kept:
        assert min(klen(x) for x in s['distractorsKo']) <= a, ('오답 하나는 정답 길이 이하', s['ko'])
    assert meaningful_chunks(s['chunks']) >= min_chunks_for(s['en']), (s['en'], s['chunks'])
    assert not dangling_chunks(s['chunks']), s['chunks']
    for w in s['words']:
        assert w in {x['id'] for x in doc['words']}, w


def recut(si, title, index, en, chunks, extra=None):
    """en은 그대로 두고 chunks만 구 경계로 다시 자른다(필요하면 decoy도 새 조각 자리에 맞춘다)."""
    s = sent(doc, si, title, index, en)
    assert join_chunks(chunks) == en, (join_chunks(chunks), en)
    old = s['chunks']
    s['chunks'] = chunks
    if extra:
        s.update(extra)
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']
    assert meaningful_chunks(s['chunks']) >= min_chunks_for(s['en']), (s['en'], s['chunks'])
    assert not dangling_chunks(s['chunks']), s['chunks']
    CH.append({'kind': 'sentence', 'situation': title, 'index': index, 'fields': ['chunks'],
               'why': f"keyPhrase chunks가 구 경계를 끊음({' / '.join(old[:-1])}) → {' / '.join(chunks[:-1])} — 문장은 그대로"
                      + (f"; decoy를 새 조각 자리 모양으로({extra['decoy']})" if extra and 'decoy' in extra else '')})


def order_line(si, title, li, old_en, new):
    od = sit(doc, si, title)['order']
    l = od['lines'][li]
    assert l['en'] == old_en, (title, li, l['en'])
    l.update(new)
    assert len(l['en'].split()) <= 15, l['en']
    NOTE.append({'kind': 'order', 'situation': title, 'line': li, 'fields': sorted(new)})


def order_why(si, title, old, new):
    od = sit(doc, si, title)['order']
    assert od['why'] == old, (title, od['why'])
    od['why'] = new
    NOTE.append({'kind': 'order', 'situation': title, 'fields': ['why']})


def slider_example(si, title, ni, old_en, s):
    sl = sit(doc, si, title)['nuance'][ni]
    assert sl['kind'] == 'slider' and sl['example'] == old_en, (title, sl.get('example'))
    sl['example'], sl['exKo'] = s['en'], s['ko']
    NOTE.append({'kind': 'nuance', 'situation': title, 'index': ni, 'fields': ['example', 'exKo']})


# ── 1. keyPhrase 문장 교체 ─────────────────────────────────────────────

# 1-1. K1 20.2 대체 불가 검체 위기 — 수술 중 순환간호사가 교대 없이 방을 비우는 약속 → 사람 손으로 옮겨지게 챙김
T = '대체 불가 검체 위기'
o = "I'll hand-carry it to pathology myself."
OLD.append(o)
s20 = replace(doc, CH, 20, T, 2, o, {
    'en': "I'll make sure it's hand-carried to pathology.",
    'ko': '병리과까지 꼭 사람 손으로 옮겨지게 할게요.',
    'chunks': ["I'll make sure", "it's hand-carried", 'to pathology', '.'],
    'words': ['w-carry', 'w-pathology'],
    'tag': '운반 챙기기',
    'icon': 'handshake2',
    'why': ("I'll make sure …로 내가 들고 가겠다는 약속 대신, 사람 손으로 옮겨지는 것까지 챙기겠다고 해요. "
            "수동태 it's hand-carried라 누가 들고 가는지는 열어 두어, 수술 중에 방을 비우지 않고도 지킬 수 있어요."),
    'decoy': 'in a cooler',
    'distractorsKo': ['옮길 사람이 올 때까지 제가 곁에서 지킬게요.',
                      '사람 손으로 옮기면 분실 위험이 줄어요.'],
    'blank': blank_at('pathology', ['radiology', 'admitting', 'registration'], 3),
}, ['en', 'ko', 'chunks'],
    "I'll hand-carry it to pathology myself → I'll make sure it's hand-carried to pathology."
    '(수술 중 순환간호사가 교대 없이 방을 비우는 약속 — 사람 손 운반을 챙기는 말로; 검토 A K1)')
check_new(s20)
order_line(20, T, 2, "Once we both agree, I'll hand-carry it to pathology myself.",
           {'en': "Once we both agree, I'll make sure it's hand-carried to pathology.",
            'ko': '둘이 합의하면 병리과까지 꼭 사람 손으로 옮겨지게 할게요', 'icon': 'handshake2'})
order_why(20, T,
          '대체할 수 없다고 이유를 말하고, 그래서 인계를 두 사람이 확인하고, 합의하면 직접 병리과로 옮기고, 도착하면 무사히 닿았는지 확인해요.',
          '대체할 수 없다고 이유를 말하고, 그래서 인계를 두 사람이 확인하고, 합의하면 병리과까지 사람 손으로 옮겨지게 챙기고, '
          '도착하면 무사히 닿았는지 확인해요. 수술 중이라 방을 비우지 않고 옮길 사람을 챙겨요.')

# 1-2. K5 14.2 병리 요청서 일치 — 불일치를 간호사 혼자 고친다는 말로 읽힘 → We'll
T = '병리 요청서 일치'
o = "I'll fix any discrepancy before sending."
OLD.append(o)
s14 = replace(doc, CH, 14, T, 2, o, {
    'en': "We'll fix any discrepancy before sending.",
    'ko': '보내기 전에 어떤 불일치든 함께 바로잡을게요.',
    'chunks': ["We'll fix", 'any discrepancy', 'before sending', '.'],
    'words': ['w-fix', 'w-discrepancy', 'w-send'],
    'tag': '함께 정정',
    'why': ("We'll로 혼자 고치지 않고 팀이 함께 바로잡는다고 해요. any를 붙여 어떤 불일치든 예외가 없다는 뜻이 되고, "
            "before sending은 보내기 전이 고칠 마지막 기회라는 뜻이에요."),
    'distractorsKo': ['바로잡기 전에 어떤 불일치든 차트와 맞춰 볼게요.',
                      '불일치가 있는 검체는 병리과에서 반려돼요.'],
}, ['en', 'ko', 'chunks'],
    "I'll fix any discrepancy before sending → We'll fix any discrepancy before sending."
    '(부위·좌우 불일치를 간호사 혼자 고치는 말로 읽힘 — slider 14 오답과 겹침; 검토 A K5)')
check_new(s14)
slider_example(14, T, 0, o, s14)

# 1-3. K4 19.2 잘못된 환자 라벨 — 보고 없이 그 자리에서 재라벨 → 확인·보고·재라벨 순서
T = '잘못된 환자 라벨'
o = "Let's re-verify identity and relabel now."
OLD.append(o)
s19 = replace(doc, CH, 19, T, 2, o, {
    'en': "Let's re-verify identity, report it, and then relabel.",
    'ko': '신원을 다시 확인하고, 보고한 다음에 다시 라벨해요.',
    'chunks': ["Let's re-verify identity", ', report it', ', and then relabel', '.'],
    'words': ['w-verify', 'w-identity', 'w-report'],
    'tag': '보고 후 재라벨',
    'why': ("re-verify와 relabel 사이에 report it을 넣어 신원 확인 → 보고 → 재라벨 순서를 정하고, and then으로 재라벨이 마지막임을 못 박아요. "
            '라벨 오류는 혼자 고치지 않고 알린 뒤 기관 절차대로 바로잡아요.'),
    'decoy': ', and then rewrap',
    'distractorsKo': ['신원을 다시 확인하고, 보고한 다음에 회신을 기다려요.',
                      '다시 라벨할 때는 집도의도 곁에서 함께 봐요.'],
    'blank': blank_at('relabel', ['reschedule', 'reweigh', 'reorder'], 2),
}, ['en', 'ko', 'chunks', 'words'],
    "Let's re-verify identity and relabel now → Let's re-verify identity, report it, and then relabel."
    '(보고 없이 그 자리에서 재라벨 — 라벨 오류는 알리고 절차대로 정정; 검토 A K4); +w-report 태그(19.5에 있음)')
check_new(s19)

# 1-4. K7 7.2 냉동절편 신속 이송 — 결과는 병리의가 집도의에게(수술방 전화) — 상대는 병리사
T = '냉동절편 신속 이송'
o = 'Call me the moment you have a result.'
OLD.append(o)
s7 = replace(doc, CH, 7, T, 2, o, {
    'en': 'Call the room the moment you have a result.',
    'ko': '결과 나오는 대로 수술방으로 바로 전화 주세요.',
    'chunks': ['Call', 'the room', 'the moment', 'you have a result', '.'],
    'words': ['w-result'],
    'why': ("Call the room으로 결과를 간호사 개인이 아니라 집도의가 바로 듣는 수술방으로 보내 달라고 해요. "
            "the moment는 'as soon as'처럼 나오는 그 순간 바로라는 시간 표현이에요."),
    'distractorsKo': ['결과 나오는 대로 수술방으로 바로 문자 주세요.',
                      '결과는 집도의가 전화로 받아 되읽어요.'],
}, ['en', 'ko', 'chunks'],
    'Call me the moment you have a result → Call the room the moment you have a result.'
    '(냉동절편 결과를 간호사에게 달라는 말 — 결과는 수술방의 집도의에게; 검토 A K7)')
check_new(s7)
order_line(7, T, 3, 'Call me the moment that result is ready.',
           {'en': 'Call the room the moment that result is ready.',
            'ko': '그 결과가 나오는 대로 수술방으로 바로 전화 주세요'})
order_why(7, T,
          '지금 가야 한다고 알리고, 곧장 병리과로 가져다 달라고 청한 뒤, 건넬 때 집도의가 결과를 기다린다고 전하게 하고, 그 결과가 나오면 바로 연락해 달라고 해요. '
          'it·hand it over·that result가 앞 줄을 가리켜요.',
          '지금 가야 한다고 알리고, 곧장 병리과로 가져다 달라고 청한 뒤, 건넬 때 집도의가 결과를 기다린다고 전하게 하고, '
          '그 결과가 나오면 수술방으로 바로 연락해 달라고 해요. it·hand it over·that result가 앞 줄을 가리켜요.')

# 1-5. K2 0.1 검체 용기 라벨 부착 — 관사 없는 영어 → the gallbladder (ko·v46 필드 그대로)
T = '검체 용기 라벨 부착'
o = 'This is gallbladder, correct?'
OLD.append(o)
s0 = replace(doc, CH, 0, T, 1, o, {
    'en': 'This is the gallbladder, correct?',
    'chunks': ['This is', 'the gallbladder', ', correct', '?'],
}, ['en', 'chunks'],
    'This is gallbladder, correct? → This is the gallbladder, correct?(관사 없는 영어 — 검토 A K2)')
check_new(s0, ko_kept=True)

# 1-6. K10 12.1 특수 검체 취급 지침 — media는 복수(단수 medium) → a 없이
T = '특수 검체 취급 지침'
o = 'Does it go on ice or in a specific media?'
OLD.append(o)
s12 = replace(doc, CH, 12, T, 1, o, {
    'en': 'Does it go on ice or in specific media?',
    'chunks': ['Does it go', 'on ice', 'or', 'in specific media', '?'],
    'why': ("'on ice'와 'in specific media'를 'or'로 이어 어느 쪽인지 묻는 질문이에요. "
            "media는 배지(medium)의 복수라 a 없이 써요. 'Does it go'는 어떻게 보내는지를 물어요."),
    'blank': blank('media', ['dressings', 'drapes', 'sponges']),
}, ['en', 'chunks'],
    'Does it go on ice or in a specific media? → Does it go on ice or in specific media?'
    '(media는 복수 — 단수 관사 a를 뺌; 검토 A K10)')
check_new(s12, ko_kept=True)
order_line(12, T, 1, o, {'en': s12['en']})

# ── 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-or-specimen-A.md §9 끝 목록 ─────
# 12.1은 위 1에서 새 문장으로 잘랐다.
recut(4, '냉동절편 검체 준비', 0, 'This is for frozen section—no fixative.',
      ['This is', 'for', 'frozen section—no fixative', '.'])
recut(9, '다수 검체 혼동 방지', 1, 'This is specimen A, left; specimen B, right.',
      ['This is', 'specimen A, left;', 'specimen B, right', '.'], {'decoy': 'specimen C, midline'})
recut(16, '검체 분실 즉시 대응', 0, 'One specimen is unaccounted for.',
      ['One specimen', 'is', 'unaccounted for', '.'])
recut(17, '냉동절편 결과 수술 변경', 0, 'The frozen margins are positive.',
      ['The frozen margins', 'are', 'positive', '.'], {'decoy': 'The frozen slides'})
recut(15, '라벨 없는 검체 발견', 0, 'This container has no label.',
      ['This container', 'has', 'no label', '.'])
recut(6, '라벨 정보 불일치', 2, "I won't send it until this is corrected.",
      ["I won't", 'send it', 'until this is corrected', '.'], {'decoy': 'copy it'})
recut(8, '배양 검체 무균 채취', 2, "I'll get it to micro before it dries out.",
      ["I'll get it", 'to micro', 'before', 'it dries out', '.'])
recut(3, '검체 전달 기록', 1, 'Can you sign that you received them?',
      ['Can you', 'sign', 'that you received them', '?'], {'decoy': 'that you counted them'})
recut(13, '검체 손상 방지 이송', 1, "Place it flat so it doesn't fold.",
      ['Place it', 'flat', "so it doesn't fold", '.'], {'decoy': 'so it stays cold'})

# ── 3. 남은 옛 문장·옛 주장 확인 ─────
check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['hand-carry it', 'pathology myself', "I'll fix any", 'and relabel now', 'Call me the moment', 'is gallbladder',
            'a specific media', '직접 병리과로', '직접 손에 들고', '불일치를 바로잡을게요', '지금 다시 라벨해요',
            "'in a specific"]:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'or-specimen.yaml'))
append_changes(os.path.join(HERE, 'changes-or-specimen.yaml'), CH)
for n in NOTE:
    print('  note:', n)
print('or-specimen.yaml 저장')
