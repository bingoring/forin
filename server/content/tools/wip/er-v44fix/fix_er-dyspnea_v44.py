import sys; sys.path.insert(0,'/private/tmp/claude-501/scratch')
from fixlib import Fix
f=Fix('er-dyspnea')
# 1.1 keyPhrase — 문장 유지, why만 보강(v46 필드)
f.sent(1,1,why='how many … per minute는 호흡수를 환자에게 쉬운 말로 풀어 설명하는 틀이에요. 호흡수는 보통 환자가 의식하지 않게 조용히 세지만, 환자가 무엇을 하는지 물으면 이렇게 답해요. 숨쉬기를 의식하면 호흡이 달라질 수 있어서 설명은 짧게 해요.')
f.sent(11,4,reason='until help arrives는 응급실 안에서 어색(통역사를 뜻함) — until the interpreter arrives',
  en="We'll keep you safe until the interpreter arrives.", ko='통역사가 올 때까지 안전하게 지켜드릴게요.',
  chunks=["We'll keep you",'safe','until the interpreter arrives','.'],
  words=['w-keep','w-safe','w-interpreter','w-arrive'],
  why='until the interpreter arrives처럼 통역사가 올 때까지라는 기한을 주면 환자가 막연히 기다리지 않아요. 곁에서 안전을 지킨다고 약속하면 기다리는 동안 불안이 줄어요.',
  distractorsKo=['의사 선생님이 곧 오실 거예요','가족분께 통역을 부탁할게요'])
f.sent(12,3,reason='청크 watch your breathing / muscles closely가 명사구를 끊음 — 명사구를 한 조각으로',
  chunks=['We need to','watch','your breathing muscles','closely','.'])
f.sent(18,0,reason='동료에게 하는 투약 지시에 처방·standing order 근거가 없음 — per protocol 추가',
  en='Give IM epinephrine now per protocol — her airway is closing.',
  ko='프로토콜대로 지금 근육주사로 에피네프린 주세요 — 기도가 막히고 있습니다.',
  chunks=['Give IM epinephrine','now','per protocol —','her airway','is closing','.'],
  why='투여 경로(IM)와 약 이름을 먼저 말하고 now로 시급함을, per protocol로 정해진 프로토콜(standing order)에 따른 투약임을 알려요. 아나필락시스의 1차 치료는 근육주사 에피네프린이에요.')
f.rep(18,'Give IM epinephrine now — her airway is closing.','Give IM epinephrine now per protocol — her airway is closing.')
f.rep(18,'지금 근육주사로 에피네프린 주세요 — 기도가 막히고 있습니다','프로토콜대로 지금 근육주사로 에피네프린 주세요 — 기도가 막히고 있습니다')
f.sent(21,1,reason='환자에게 공기가 느껴지는지 묻는 대신 간호사가 직접 확인한다고 말함(개통 확인은 간호사 몫)',
  en='Let me check if air is moving through it.', ko='공기가 통하는지 제가 확인해 볼게요.',
  chunks=['Let me check','if air','is moving','through it','.'],
  words=['w-air','w-move'], icon='stetho',
  why='Let me check로 직접 확인하겠다고 알려요. 간호사가 관 입구로 공기가 나오는지 보고 흡인 카테터가 들어가는지 확인해요. 공기가 안 통하면 막히거나 빠졌을 수 있어요.')
f.rep(21,'Can you feel air moving through it now?','Let me check if air is moving through it now.')
f.rep(21,'이제 공기가 통해서 느껴지세요?','이제 공기가 통하는지 확인해 볼게요')
f.save()
