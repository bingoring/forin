import sys; sys.path.insert(0,'/private/tmp/claude-501/scratch')
from fixlib import Fix
f=Fix('er-chestpain')
R='청크가 문장 경계를 넘음 — 문장 부호를 따로 떼어 문장 경계에서 끊음'
f.sent(10,0,reason=R,chunks=['Pain here','?','Point for me',', please','.'])
f.sent(10,1,reason=R,chunks=['Pain now','— one to ten','?','Show me','with fingers','.'])
f.sent(10,2,reason=R,chunks=['An interpreter','is coming','.','You are safe',', we will help','.'])
f.sent(10,3,reason=R,chunks=['Nurse here','.','I check you','now',', okay','?'],decoy='I call you')
f.sent(10,4,reason=R,chunks=['Breathe slow','.','Good','.','You are okay','.'])
f.sent(9,1,reason='ko가 어색 — 약과 스텐트를 각각 풀어 자연스럽게',ko='이전에 어떤 약을 드셨고 어떤 스텐트를 넣으셨나요?')
f.sent(1,4,reason='placing you in a higher priority가 어색 — giving you a higher priority',
  en="I'm giving you a higher priority so the doctor can see you sooner.",
  chunks=["I'm giving you",'a higher priority','so the doctor','can see you','sooner','.'])
f.sent(5,2,reason='stay with me를 "저와 함께 있어요"로 옮겨 뜻이 다름 — "정신 놓지 마세요"(19.0과 같게)',
  ko='땀이 나고 창백하세요 — 정신 놓지 마세요, 도움이 오고 있어요.',
  why='상태를 짧게 말해 주고 stay with me로 정신을 놓지 말고 저에게 집중해 달라고 해요. help is coming으로 도움이 오는 중임을 알려요.')
f.save()
