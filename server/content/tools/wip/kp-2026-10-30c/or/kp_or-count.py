"""or-count — keyPhrase 1문장 교체 + keyPhrase chunks 6문장 다시 자르기(2026-10-30 OR 묶음 1 결정, '추천대로').
base-or-count.yaml → or-count.yaml"""
import io, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
from kp_common import *  # noqa

doc = load(os.path.join(HERE, 'base-or-count.yaml'))
CH = []
OLD = []


def check_new(s):
    assert len(re.findall(r'\b' + re.escape(s['blank']['answer']) + r'\b', s['en'])) == 1, s['en']
    assert s['blank']['answer'] in [o['en'] for o in s['blank']['options']]
    assert s['decoy'] not in s['chunks'] and s['decoy'] not in s['en'], s['decoy']


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


# 1. 소실 바늘 필드 수색 [17] 문장 2 — 전원 정지가 아니라 방 밖 반출을 막는 말로
T = '소실 바늘 필드 수색'
o = 'Nobody moves until we find it.'
OLD.append(o)
s = replace(doc, CH, 17, T, 2, o, {
    'en': 'Nothing leaves the room until we find it.',
    'ko': '찾을 때까지 방에서 아무것도 나가지 않아요.',
    'chunks': ['Nothing leaves', 'the room', 'until we find it', '.'],
    'words': ['w-find'],
    'tag': '반출 금지',
    'icon': 'lock',
    'why': ("Nothing을 주어로 세워 어떤 물건도 예외 없이 방 밖으로 나가지 않게 해요. "
            "쓰레기·린넨·기구 반출을 막는 말이지, 마취·지혈 같은 환자 처치를 멈추라는 말은 아니에요."),
    'decoy': 'the break room',
    'distractorsKo': ['끝날 때까지 방에서 아무것도 나가지 않아요.',
                      '방에서 나간 물건 속에 바늘이 섞일 수 있어요.'],
}, ['en', 'ko', 'chunks'],
    'Nobody moves until we find it → Nothing leaves the room until we find it(전원 정지로 읽힘 — 실제는 방에서 물건이 나가지 않게 하고 '
    '환자 처치는 계속; 검토 A K1). words [w-find] 그대로(room은 공통 쉬운 단어)')
check_new(s)
od = sit(doc, 17, T)['order']
assert od['lines'][1]['en'] == 'Nothing leaves the room until we find it.', od['lines'][1]
assert od['lines'][1]['ko'] == '찾을 때까지 방에서 아무것도 나가지 않아요'

# 2. keyPhrase chunks 다시 자르기 (en 그대로) — fix-or-count-A.md "KP chunks 끊김"
recut(8, '방사선 표지 거즈 확인', 1, 'Let me confirm each one has the radiopaque marker.',
      ['Let me confirm', 'each one', 'has', 'the radiopaque marker', '.'])
recut(9, '기구 분해 부품 계수', 1, 'All the small parts need to be accounted for.',
      ['All the small parts', 'need', 'to be', 'accounted for', '.'],
      {'decoy': 'All the spare batteries'})
recut(15, '봉합 직전 거즈 불일치', 1, "We're one sponge short, we need to search now.",
      ["We're", 'one sponge short', ', we need', 'to search now', '.'],
      {'decoy': 'one needle short'})
recut(17, T, 1, "Let's search the field, drapes, and floor systematically.",
      ["Let's search", 'the field, drapes, and floor', 'systematically', '.'])
recut(19, '이물 잔류 의심 보고', 0, "This is a possible retained object — I'm documenting it.",
      ['This is', 'a possible retained object', "— I'm", 'documenting it', '.'])
recut(20, '계수 불일치 은폐 압력', 1, 'We have to document and resolve this properly.',
      ['We have to', 'document and resolve this', 'properly', '.'],
      {'decoy': 'politely'})

check(doc, OLD)
raw = yaml.safe_dump(doc, allow_unicode=True, width=10000)
for bad in ['Nobody moves', '아무도 움직이지', '이동 금지']:
    assert bad not in raw, bad
dump(doc, os.path.join(HERE, 'or-count.yaml'))
append_changes(os.path.join(HERE, 'changes-or-count.yaml'), CH)
print('or-count.yaml 저장')
