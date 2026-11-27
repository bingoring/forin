# [tag, icon, why, decoy, d1, d2, ans, w1, w2, w3]
D = {}
D[0] = dict(s=[
["금식 문진","calendar","last를 eat 앞에 두어 '가장 최근'을 묻는 틀이에요. any solid food로 범위를 넓게 잡아 간식도 빠지지 않게 물어요.","How did you","고형식은 마지막으로 언제 사셨어요?","고형식은 마지막으로 언제 만드셨어요?","last","first","next","only"],
["물 따로 묻기","speech","대시 뒤에 질문을 붙여 앞 설명(물은 규정이 다르다)을 이유로 이어 줘요. sip은 한 모금이라 소량도 놓치지 않고 묻는 말이에요.","your first sip","물은 많이 다른데, 마지막으로 언제 한 모금 드셨어요?","물은 좀 다른데, 마지막으로 언제 한 잔 드셨어요?","sip","bite","meal","dose"],
["진행 안내","check","looks fine은 단정 대신 '보기에'라는 완곡한 판단이라 확인 결과를 부드럽게 알려요. so로 이유와 결론을 한 문장에 묶었어요.","as requested","시간이 적절하니 요청대로 진행할 수 있어요.","시간이 적절하니 예정대로 이동할 수 있어요.","fine","late","tight","short"],
["순서 이유","bulb","since로 이유를 뒤에 붙여 왜 고형식부터 묻는지 밝혀요. the slowest 최상급은 여럿 중 가장 오래 걸리는 것을 짚어요.","your mouth","고형식부터 시작할게요, 장을 가장 늦게 비우거든요.","고형식부터 점검할게요, 위를 가장 늦게 비우거든요.","stomach","throat","kidney","lungs"],
["간식 포함","bulb","Even이 '이것도?'라는 의외성을 깔아 환자가 간식을 빼먹지 않게 해요. counts as는 규정상 그렇게 분류한다는 표현이에요.","tastes like","간단한 음료도 이 경우에는 고형식으로 쳐요.","간단한 커피도 이 경우에는 고형식으로 쳐요.","snack","drink","sip","glass"],
["시각 요청","calendar","also가 앞서 물은 질문에 더하는 요청임을 알려요. exact는 대략이 아니라 분 단위까지 필요하다는 신호예요.","the full amount","물을 끊은 정확한 이유도 필요해요.","물을 끊은 정확한 방법도 필요해요.","exact","usual","average","previous"],
], order=dict(tag="대화 흐름",icon="compass",ko="금식 시작 시각 확인 4문장 순서",why="고형식 마지막 시각을 묻고, 물은 규정이 달라 따로 묻고, 그 두 시각이 필요하다고 짚은 뒤, 시간이 적절하면 예정대로 진행해요.",lines=[
["When did you last eat any solid food?","calendar","고형식은 마지막으로 언제 드셨어요?","고형식"],
["Water is different, so when did you last drink some?","speech","물은 다르니 마지막으로 언제 드셨어요?","물"],
["I need the exact time for both of those.","pencil","그 둘 다 정확한 시각이 필요해요","시각"],
["With those times, we can go ahead as planned.","check","그 시각이면 예정대로 진행할 수 있어요","진행"]]))
D[1] = dict(s=[
["알레르기 문진","pill","Can you tell me…는 요구가 아닌 부탁이라 환자가 부담 없이 이력을 풀어 놓게 해요. what happens로 반응의 내용을 열어 두고 물어요.","Can you show me","페니실린을 드시면 어떻게 되시는지 써 주시겠어요?","페니실린을 드시면 어떻게 되시는지 읽어 주시겠어요?","penicillin","ibuprofen","insulin","aspirin"],
["증상 세분","magnify","just a rash로 가벼운 쪽을, or any trouble로 중한 쪽을 대비시켜 반응의 정도를 가려요. 숨쉬기와 붓기는 아나필락시스를 가르는 핵심 증상이에요.","itching","그냥 기침만 있었나요, 아니면 숨쉬기 힘들거나 붓기도 있었나요?","그냥 가려움만 있었나요, 아니면 숨쉬기 힘들거나 붓기도 있었나요?","rash","cough","fever","bruise"],
["기록 약속","pushpin","flag는 눈에 띄게 표시한다는 동사라 단순 기록과 달리 다음 사람이 놓치지 않게 한다는 약속이에요. so …로 그 목적을 뒤에 붙여요.","I'll read this","이 내용을 차트에 붙여서 팀 전체가 알도록 할게요.","이 내용을 차트에 표시해서 팀 전체가 배우도록 할게요.","flag","copy","print","send"],
["심각도 묻기","faceWorried","How bad was…로 정도를 먼저 묻고 대시 뒤 질문으로 치료 여부를 이어 구체적 사실을 끌어내요. '괜찮았다'로 뭉뚱그리지 않게 하는 순서예요.","any paperwork","반응이 얼마나 심했나요? 휴식이 필요했나요?","반응이 얼마나 심했나요? 설명이 필요했나요?","treatment","payment","transport","insurance"],
["판단 설명","bulb","sounds like는 단정을 피하고 들은 내용으로 추정하는 완곡한 틀이에요. not just a…로 흔한 오해를 먼저 걷어 내요. 알레르기는 면역 반응이라는 점에서 부작용과 구분돼요.","a real infection","이건 단순 통증이 아니라 진짜 알레르기 같아요.","이건 단순 소화불량이 아니라 진짜 알레르기 같아요.","allergy","infection","injury","disease"],
["전달 약속","check","make sure는 내가 책임지고 확인한다는 뜻이라 적어 두는 것 이상의 약속이에요. before we start가 전달 시점을 시작 앞에 못 박아요.","and look into","빈도를 기록해서 시작 전에 마취과도 확인하게 할게요.","원인을 기록해서 시작 전에 마취과도 확인하게 할게요.","severity","frequency","location","duration"],
], order=dict(tag="대화 흐름",icon="compass",ko="약물 알레르기 문진 4문장 순서",why="약을 먹었을 때의 반응을 묻고, 증상의 정도를 좁혀 묻고, 들은 내용으로 진짜 알레르기라고 판단을 전한 뒤, 그에 따라 차트에 표시해요.",lines=[
["Can you tell me what happens when you take penicillin?","pill","페니실린을 드시면 어떻게 되시는지 말씀해 주시겠어요?","질문"],
["Was it just a rash, or did you have trouble breathing or swelling?","magnify","발진만이었나요, 숨쉬기 힘들거나 붓기도 있었나요?","좁히기"],
["From what you've described, this sounds like a real allergy.","bulb","말씀하신 걸로는 진짜 알레르기 같아요","판단"],
["Because of that, I'll flag it in your chart so the whole team knows.","pushpin","그래서 차트에 표시해 팀 전체가 알게 할게요","표시"]]))
D[2] = dict(s=[
["마취 경험","speech","feel을 써서 사실 확인이 아니라 환자의 느낌을 묻는 열린 질문이에요. waking up from…으로 깨어나는 순간에 초점을 좁혀요.","Why did you feel","지난번 수술에서 깨어나실 때 기분이 어떠셨어요?","지난번 마취에서 깨어나실 때 통증이 어떠셨어요?","anesthesia","surgery","dentist","recovery"],
["증상 열거","stetho","any를 세 번 겹쳐 쓴 열거형이라 환자가 하나씩 떠올리며 답하기 쉬워요. 마지막에 a bad reaction을 둬 앞에서 놓친 반응까지 묻습니다.","any bleeding","메스꺼움이나 호흡 문제, 혹은 통증이 있었나요?","메스꺼움이나 호흡 문제, 혹은 두통이 있었나요?","nausea","dizziness","itching","fatigue"],
["팀에 전달","handshake2","let A know는 알려서 알고 있게 한다는 구라 단순 보고보다 부드러워요. about the nausea로 무엇을 전하는지 분명히 해요.","talk about","마취팀에 어지러움 있었던 거 전달할게요.","마취팀에 두통 있었던 거 전달할게요.","nausea","headache","fever","cough"],
["호흡 문진","stetho","during or after로 시간 범위를 넓혀 수술 중과 후 어느 쪽 문제도 놓치지 않게 해요. that surgery가 지난번 수술임을 가리켜요.","that visit","그 검사 중이나 후에 호흡 문제가 있었나요?","그 입원 중이나 후에 호흡 문제가 있었나요?","breathing","bleeding","swallowing","sleeping"],
["기도 삽관","stetho","Was it hard for A to…는 사실을 묻되 평가하지 않는 틀이에요. place는 튜브를 자리 잡게 넣는 동작을 가리키는 동사예요.","to explain","마취팀이 기관삽관 튜브를 빼기 어려웠나요?","마취팀이 기관삽관 튜브를 고정하기 어려웠나요?","place","remove","label","carry"],
["사전 계획","handshake2","pass this along는 받은 정보를 다음 사람에게 넘긴다는 구예요. so …can plan ahead로 넘기는 목적을 붙여요.","so the front desk","오늘 팀이 미리 정리할 수 있도록 이 내용을 전달할게요.","오늘 팀이 미리 기억할 수 있도록 이 내용을 전달할게요.","today's","yesterday's","tomorrow's","Monday's"],
], order=dict(tag="대화 흐름",icon="compass",ko="과거 마취 이력 4문장 순서",why="지난 마취 경험을 열린 질문으로 묻고, 구체적인 증상을 짚어 묻고, 들은 내용을 마취팀에 전하겠다고 말한 뒤, 팀이 미리 계획하도록 해요.",lines=[
["How did you feel waking up from your last anesthesia?","speech","지난번 마취에서 깨어나실 때 기분이 어땠어요?","경험"],
["Did you have any nausea or breathing issues after that?","stetho","그 뒤에 메스꺼움이나 호흡 문제가 있었나요?","증상"],
["I'll let the anesthesia team know about it.","handshake2","그걸 마취팀에 알릴게요","전달"],
["With that, today's team can plan ahead.","check","그러면 오늘 팀이 미리 계획할 수 있어요","계획"]]))
