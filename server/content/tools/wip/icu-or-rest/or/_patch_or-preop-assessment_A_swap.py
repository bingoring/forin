import re
# title: (before1, answer, wrong_a, wrong_b, answer_pos, notes_answer, notes_a, notes_b)
P = {
"금식 시작 시각 확인": ("Did you drink anything at all since last night?", "When exactly did you last have a sip of water?", "You haven't had any water since midnight, right?", 1),
"기저 활력징후 측정": ("Your heart rate is tachycardic, above the usual range.", "Your pulse is a bit fast, which is common when nervous.", "Your heart is racing dangerously fast, and that worries me.", 2),
"물 한 모금 금식 위반": ("You broke the rules, so I have to report you now.", "I need to let anesthesia know so they can decide.", "Don't worry about it, we'll keep this between us.", 0),
"조영제·해산물 교차 알레르기": ("A shellfish allergy means you'll react to contrast.", "A shellfish allergy doesn't actually predict a contrast reaction.", "A shellfish allergy has no link to anything we give.", 1),
"심·호흡 기저질환": ("He has COPD, and he's doing fine, no problems.", "He has COPD and gets short of breath on stairs.", "He has some kind of lung thing, I think so.", 2),
"흡연·음주력 문진": ("You drink too much, don't you? Be honest.", "About how many drinks do you have in a week?", "Be honest, how bad is your drinking these days?", 0),
"최근 상기도 감염": ("He's sick, so cancel the surgery for today.", "Three days of cough and congestion, no fever. Your call?", "He's fine, just a little cold, nothing more.", 1),
"조영제 아나필락시스 병력": ("That sounds like a side effect, nothing bigger.", "That sounds like a serious reaction, so I'm marking it for the team.", "That sounds like nothing to worry about at all.", 2),
"마취 가족력 MH 의심": ("His brother had some kind of problem under anesthesia.", "His brother had a high fever and stiff muscles during surgery.", "His brother is fine now, so it's probably nothing.", 0),
"금식 확인 불가 무의식": ("His NPO status is fine, so we can go ahead.", "We can't confirm his NPO status, so we're assuming a full stomach.", "He's probably empty, so there's no need to prepare.", 1),
}
for k,v in P.items():
    print(k,[len(re.sub(r'\s','',x)) for x in v[:3]])
