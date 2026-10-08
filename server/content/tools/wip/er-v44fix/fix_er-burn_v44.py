import sys; sys.path.insert(0,'/private/tmp/claude-501/scratch')
from fixlib import Fix
f=Fix('er-burn')
# --- 가피절개 (9.2, 9.4, 18.1, 18.4)
f.sent(9,2,reason='가피절개를 small cut이라 한 사실 오류 — 가피를 따라 내는 절개로 바로잡음; 9.4와 겹침 해소',
  en='We may need to release the pressure with a cut along the burned skin.',
  ko='화상 입은 피부를 따라 절개해서 압력을 풀어줘야 할 수도 있어요.',
  chunks=['We may need','to release','the pressure','with a cut','along the burned skin','.'],
  words=['w-need','w-release','w-pressure','w-cut','w-burn','w-skin'], decoy='with a bandage')
f.sent(9,4,reason='가피절개를 small cut이라 한 사실 오류 + 9.2와 거의 같은 문장 — 조여 있는 화상 피부를 절개한다고 바로잡음',
  en='We may need to cut the tight, burned skin to relieve the pressure.',
  ko='압력을 완화하려고 조여 있는 화상 피부를 절개해야 할 수도 있어요.',
  chunks=['We may need','to cut','the tight, burned skin','to relieve the pressure','.'],
  words=['w-need','w-cut','w-tight','w-burn','w-skin','w-relieve','w-pressure'], decoy='to dry the skin')
f.sent(18,1,reason='가피절개를 small cuts라 한 사실 오류 — 길고 얕은 절개로 바로잡음(why와 맞춤)',
  en='We may make long, shallow cuts in the burned skin to let it expand.',
  ko='피부가 팽창하도록 화상 입은 피부에 길고 얕은 절개를 낼 수도 있어요.',
  chunks=['We may make','long, shallow cuts','in the burned skin','to let it expand','.'],
  words=['w-cut','w-burn','w-skin','w-expand'])
f.sent(18,4,reason='가피절개를 small cuts라 한 사실 오류 + 18.1과 거의 같은 문장 — 조인 피부를 절개해 가슴이 팽창하게 한다고 바로잡음',
  en='We may need to cut the tight skin so your chest can expand.',
  ko='가슴이 팽창하도록 조여 있는 피부를 절개해야 할 수도 있어요.',
  chunks=['We may need','to cut','the tight skin','so your chest','can expand','.'],
  words=['w-need','w-cut','w-tight','w-skin','w-chest','w-expand'], decoy='so your arm',
  why='may need로 아직 확정이 아닌 일을, so…로 그 목적과 함께 말해요. 환기가 나아지지 않으면 의사가 가슴 둘레의 가피를 길게 절개해 호흡 운동을 되살려요.')
# nuance / order 따라 맞춤
f.rep(9,'a small cut in the burned skin','a cut along the burned skin')
f.rep(9,'압력을 풀려고 화상 입은 피부에 작은 절개를 낼 수도 있어요','압력을 풀려고 화상 입은 피부를 따라 절개를 낼 수도 있어요')
f.rep(9,"That's why we may need a small cut in the skin to relieve the pressure.","That's why we may need to cut the tight, burned skin to relieve the pressure.")
f.rep(9,'그래서 압력을 풀려고 피부에 작은 절개가 필요할 수도 있어요','그래서 압력을 풀려고 조여 있는 화상 피부를 절개해야 할 수도 있어요')
f.rep(9,'a small cut','a bandage')
f.rep(18,"That's why we may need small cuts to help your chest expand.","That's why we may need to cut the tight skin so your chest can expand.")
f.rep(18,'그래서 가슴이 팽창하도록 작은 절개가 필요할 수도 있어요','그래서 가슴이 팽창하도록 조여 있는 피부를 절개해야 할 수도 있어요')
f.rep(18,'small cuts','extra cuts')
# 단어 w-small은 더 쓰이지 않아 제거
f.d['words']=[w for w in f.d['words'] if w['id']!='w-small']
f.wordwhy['w-small']='가피절개 문장에서 small을 뺐고 이 주제에서 더 쓰이지 않는다'
# --- 17.3
f.sent(17,3,reason="We'll check a blood test는 어색 — run a blood test로",
  en="We'll run a blood test for the poison level.", ko='중독 수치를 보려고 혈액 검사를 할게요.',
  chunks=["We'll run",'a blood test','for the poison','level','.'],
  words=['w-blood','w-test','w-poison','w-level'])
f.rep(17,"we'll check a blood test for the poison level","we'll run a blood test for the poison level")
# --- 17.4 (17.0과 같은 문장)
f.sent(17,4,reason='17.0과 거의 같은 말 — 정상 수치가 안전을 뜻하지 않는다는 결론 문장으로 바꿔 구분',
  en="A normal number does not mean you're safe yet.", ko='정상 수치가 아직 안전하다는 뜻은 아니에요.',
  chunks=['A normal number','does not mean',"you're safe",'yet','.'],
  words=['w-normal','w-number','w-mean','w-safe'],
  why='does not mean으로 정상 수치에 안심하지 않게 못 박아요. 일산화탄소가 붙은 헤모글로빈도 산소처럼 읽혀 포화도가 높게 나올 수 있어서 증상과 혈액 검사로 확인해요.',
  decoy='when you sleep',
  blank={'answer':'safe','options':[{'en':'safe'},{'en':'sick'},{'en':'ready'},{'en':'alone'}]})
# --- 13.4
f.sent(13,4,reason='"당신의 언어로" 번역투 — "쓰시는 말로"',
  ko='통역사가 모든 내용을 쓰시는 말로 다시 말해줄 거예요.')
f.rep(13,'통역사가 모든 내용을 당신의 언어로 다시 말해줄 거예요','통역사가 모든 내용을 쓰시는 말로 다시 말해줄 거예요')
# --- 19.3
f.sent(19,3,reason='환자에게 단정 과거형 — may be breaking down(가능성)으로',
  en='Your muscles may be breaking down after the electrical burn.', ko='전기 화상 후에 근육이 파괴되고 있을 수 있어요.',
  chunks=['Your muscles','may be breaking down','after','the electrical burn','.'],
  why='may be로 검사 전이라 가능성으로 말해요. 전류와 열이 근육 세포를 깨뜨리면 속의 물질이 혈액과 소변으로 새 나와요.')
# --- 7.2, 15.2 chunks (대시를 넘는 청크 → 대시를 마침표로 나눠 청크 경계를 절 경계에 맞춤)
f.sent(7,2,reason='청크가 대시를 넘어 두 절을 묶음 — 두 문장으로 나눠 절 경계에서 끊음',
  en='Keep rinsing. This removes the chemical from your skin.', ko='계속 헹궈 주세요. 이렇게 하면 피부에서 화학물질이 제거돼요.',
  chunks=['Keep rinsing','.','This removes','the chemical','from your skin','.'], decoy='This cools')
f.sent(15,2,reason='청크가 대시를 넘어 두 절을 묶음 — 두 문장으로 나눠 절 경계에서 끊음',
  en='Try to stay calm. This will help you breathe safely.', ko='차분함을 유지해 보세요. 그러면 안전하게 숨쉬는 데 도움이 돼요.',
  chunks=['Try to','stay calm','.','This will help you','breathe safely','.'])
# --- 20.3 chunks (용어를 끊음)
f.sent(20,3,reason='partial thickness 용어를 끊은 청크 — 용어를 한 조각으로',
  chunks=['Burn size is','about thirty percent,','mostly','partial thickness','.'])
# --- 20.1 ko/exKo 통일
f.word('w-start')['exKo']='Parkland 수액을 시작했고 소변량은 적정합니다.'
f.wordwhy['w-start']='20.1 ko(적정합니다)와 단어 exKo(충분합니다)를 통일'
f.kp(7,'Keep rinsing—this removes the chemical from your skin.','Keep rinsing. This removes the chemical from your skin.')
f.kp(9,'We may need to release the pressure with a small cut.','We may need to release the pressure with a cut along the burned skin.')
f.kp(15,'Try to stay calm—this will help you breathe safely.','Try to stay calm. This will help you breathe safely.')
f.kp(18,'We may make small cuts in the burned skin to let it expand.','We may make long, shallow cuts in the burned skin to let it expand.')
f.save()
