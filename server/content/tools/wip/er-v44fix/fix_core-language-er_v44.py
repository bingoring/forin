#!/usr/bin/env python3
"""core-language-er v44 필드 수정 (결정 11 예외, 2026-10-08). base-core-language-er.yaml 을 제자리에서 고친다."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib_v44fix_s55 import Fixer

F = Fixer('core-language-er')

# ── 2.5 (base S1.4) 알레르기 today — 2.2와 사실상 같은 문장 → 다른 핵심 질문(매일 먹는 약)으로 교체 [처방 "또는 다른 핵심 질문으로 교체"]
F.set_sentence('기본 의사 확인', 4, 'Any medicine allergy today? Yes or no?',
               "알레르기에 today가 부자연스럽고 2.2와 사실상 같은 문장 — 다른 핵심 질문(매일 먹는 약)으로 교체",
               en='Do you take medicine every day? Yes or no?',
               ko='매일 드시는 약이 있나요? 예 아니오?',
               chunks=['Do you take', 'medicine', 'every day', '?', 'Yes or no', '?'],
               words=['w-medicine', 'w-yes', 'w-no'],
               tag='복용 약', icon='pill',
               why='매일 먹는 약을 묻는 짧은 질문이라 영어가 서툰 환자도 예·아니오로 답할 수 있어요. 어떤 약인지는 답을 들은 뒤 이어서 물어요.',
               decoy='last year',
               distractorsKo=['지난주에 약을 드셨나요?', '어떤 약이 필요하세요?'],
               blank={'answer': 'take', 'options': [{'en': 'take'}, {'en': 'sell'}, {'en': 'break'}, {'en': 'lose'}]})

# ── 7.6 (base S6.5) 통역사가 통역사를 찾는 꼴
F.set_sentence('방언·소수언어 대응', 5, 'The interpreter is looking for someone who speaks your dialect.',
               '통역사가 통역사를 찾는 꼴 — 통역 서비스가 찾는 것으로',
               en='The interpreter service is looking for someone who speaks your dialect.',
               ko='통역 서비스에서 환자분 방언을 하는 분을 찾고 있어요.',
               chunks=['The interpreter service', 'is looking', 'for someone', 'who speaks your dialect', '.'])

# ── 16.2 (base S15.1) 통역사의 역할을 넘음 (keyPhrase)
F.set_sentence('동의능력 언어 복합', 1, 'The interpreter will check if he truly understands.',
               '통역사의 역할을 넘음(동의 능력은 임상의 몫) — 우리가 통역사와 함께 확인한다는 말로 (keyPhrase 문장이라 상황 keyPhrases도 바꿈)',
               en="We'll check with the interpreter if he truly understands.",
               ko='통역사를 통해 정말 이해하시는지 확인할게요.',
               chunks=["We'll check", 'with the interpreter', 'if he truly', 'understands', '.'],
               distractorsKo=['저희가 서류에 서명할 거예요', '저희가 환자를 진찰할 거예요'])
F.key_phrases('동의능력 언어 복합', {'The interpreter will check if he truly understands.': "We'll check with the interpreter if he truly understands."})

# ── 8.4 (base S7.3) 3자 대화: 간호사는 통역사에게 직접 말한다 [처방 없음 — 직접 고친 문장]
F.set_sentence('통역 오역 감지', 3, 'Please ask the interpreter to repeat every word.',
               '3자 대화에서는 간호사가 통역사에게 직접 말하는 게 원칙인데 누구에게 하는 말인지 어색 — 통역사를 직접 불러 요청',
               en='Interpreter, please repeat every word the patient said.',
               ko='통역사님, 환자분이 하신 말씀을 한 마디도 빠짐없이 다시 말해 주세요.',
               chunks=['Interpreter,', 'please repeat', 'every word', 'the patient said', '.'],
               words=['w-interpreter', 'w-repeat'],
               why='3자 대화에서는 간호사가 통역사에게 직접 말해요. 통역사를 먼저 부르면 누구에게 하는 말인지 분명하고, every word는 한 마디도 빼지 말라는 요청이에요.',
               distractorsKo=['통역사님, 대강만 전해 주세요', '통역사님, 천천히 말해 주세요'])

# ── chunks 경계: 구를 끊지 않게 (en 그대로)
F.set_sentence('청각장애 수어 통역', 0, "I'm arranging a sign language interpreter now.", 'a sign language / interpreter now로 구를 끊음 — 청크 경계만 고침',
               chunks=["I'm arranging", 'a sign language interpreter', 'now', '.'])
F.set_sentence('응급 중 통역 지연', 0, 'Chest? Point here. Yes or no?', '구두점(. Yes or no)이 청크 머리 — 청크 경계만 고침',
               chunks=['Chest', '?', 'Point here.', 'Yes or no', '?'])
F.set_sentence('동의능력 언어 복합', 2, "If he can't consent, we'll reach his next of kin.", 'his next / of kin으로 구를 끊음 — 청크 경계만 고침',
               chunks=["If he can't", 'consent', ", we'll reach", 'his next of kin', '.'])
F.set_sentence('문화·언어 기인 치료거부', 1, 'There may be a misunderstanding I can clear up.', 'I can clear / up으로 구동사를 끊음 — 청크 경계만 고침',
               chunks=['There may be', 'a misunderstanding', 'I can', 'clear up', '.'])
F.save()
