#!/usr/bin/env python3
"""core-safety-er.yaml: blank.options 의 check/cross 아이콘을 낱말 느낌 아이콘으로 교체 (제자리, 아이콘 값만)."""
import re, os, sys
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'core-safety-er.yaml')
# (문장 앞부분, 선택지 en) -> 새 아이콘
M = {
 ("I'm checking this against", 'against'): 'faceAngry', ("I'm checking this against", 'without'): 'plane',
 ("I always confirm two", 'never'): 'lock',
 ("If your name or date", 'match'): 'handshake2',
 ("Do you use a cane", 'use'): 'play',
 ("Based on what I find", 'together'): 'star',
 ("This is your call button", 'ignore'): 'coffee',
 ("I'll keep the bed low", 'empty'): 'coffee',
 ("Any other allergies", 'skip'): 'chevronRight',
 ("Let me check your chart", 'confirm'): 'handshake2', ("Let me check your chart", 'erase'): 'redo',
 ("Your oxygen tank", 'empty'): 'coffee',
 ("I'll check on you often since", 'never'): 'lock',
 ("I'm keeping a close watch", 'careless'): 'faceWorried',
 ("Let me remind you again", 'blame'): 'pushpin',
 ("Is this hydralazine", 'skip'): 'chevronRight', ("Is this hydralazine", 'confirm'): 'shield',
 ("Can you verify the concentration", 'ignore'): 'coffee',
 ("Let's check it again together", 'wrong'): 'faceWorried',
 ("Register him as unknown", 'Ignore'): 'coffee',
 ("We'll update the record", 'delete'): 'chevronDown',
 ("Until we know his name", 'wrong'): 'faceWorried', ("Until we know his name", 'same'): 'pushpin',
 ("This tube is for bed four", 'confirm'): 'shield', ("This tube is for bed four", 'skip'): 'chevronRight',
 ("Always check the bed number", 'unless'): 'speech',
 ("Never carry labels", 'Always'): 'shield',
 ("I'm going to check you before", 'unless'): 'gear',
 ("I'll report this fall", 'deny'): 'faceAngry',
 ("We'll remove them as soon", 'remove'): 'scalpel',
 ("Restraints are only used", 'never'): 'chevronDown',
 ("Let me explain why this is safe", 'deny'): 'faceAngry',
 ("Isolation helps stop", 'ending'): 'pushpin',
 ("You're not in trouble", 'punish'): 'lock',
 ("I'll check on you often, and", 'never'): 'chevronDown',
 ("We just want to keep you safe", 'never'): 'pushpin',
 ("Time-out: this is John", 'Check-in'): 'board',
 ("Consent is signed", 'erased'): 'redo', ("Consent is signed", 'marked'): 'pushpin',
 ("If anything doesn't match", 'stop'): 'shield',
 ("Everyone on the team must agree", 'must'): 'lock',
 ("Her heart rate is up", 'normal'): 'coffee',
 ("I'm calling the rapid response", 'unless'): 'gear',
 ("I'll give the team a clear", 'clear'): 'magnify',
 ("Confirm the medical record number", 'Confirm'): 'shield', ("Confirm the medical record number", 'Skip'): 'chevronRight',
 ("Always confirm the record number", 'never'): 'shield',
 ("Because you're on a blood thinner", 'bleeding'): 'scalpel',
 ("We'll watch you closely", 'cancel'): 'redo',
 ("We're monitoring her vitals", 'ignoring'): 'coffee',
 ("I'm reporting exactly", 'exactly'): 'magnify',
 ("We'll document this honestly", 'carelessly'): 'coffee',
 ("Close doors behind us", 'account'): 'board',
}
def uq(v):
    if len(v) > 1 and v[0] == v[-1] == "'": return v[1:-1].replace("''", "'")
    if len(v) > 1 and v[0] == v[-1] == '"': return v[1:-1]
    return v

L = open(P, encoding='utf-8').read().split('\n')
sent = None; opt = None; n = 0; used = set()
for i, l in enumerate(L):
    m = re.match(r'^  - en: (.*)$', l)
    if m: sent = uq(m.group(1)); opt = None; continue
    m = re.match(r'^      - en: (.*)$', l)
    if m: opt = uq(m.group(1)); continue
    m = re.match(r'^(        icon: )(check|cross)$', l)
    if m and sent and opt:
        key = next(((p, opt) for (p, o) in M if o == opt and sent.startswith(p)), None)
        if key is None:
            print('UNMAPPED', i + 1, sent, opt); sys.exit(1)
        used.add(key); L[i] = m.group(1) + M[key]; n += 1
print('replaced', n, 'unused keys', [k for k in M if k not in used])
open(P, 'w', encoding='utf-8').write('\n'.join(L))
