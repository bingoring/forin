# B 검토(core-family-or) 제안 값을 core-family-or.yaml 사본에 얹어 _reviewB_core-family-or_after.yaml을 만든다.
# 대상 파일은 건드리지 않는다. 키: "상황.문장"(0부터). dk = {오답 순번: 새 값}.
import yaml, sys

SRC = "core-family-or.yaml"
DST = "_reviewB_core-family-or_after.yaml"

S = {
 # 0 대기실 안내
 "0.0": {"decoy": "in the recovery"},
 "0.3": {"blank": ("comfortable", ["comfortable", "useful", "scarce", "available"])},
 # 1 예상 소요 시간
 "1.2": {"blank": ("posted", ["posted", "guessing", "busy", "seated"])},
 "1.4": {"decoy": "for visits to run"},
 # 2 진행 상황
 "2.0": {"blank": ("team", ["team", "lab", "pharmacy", "ICU"])},
 # 3 가족 질문
 "3.1": {"dk": {1: "필요한 순간에 바로 옷을 드릴 수 있게 준비해둘게요."}, "decoy": "He'll have a blanket"},
 "3.3": {"blank": ("worry", ["worry", "laugh", "argue", "joke"])},
 # 4 회복실 면회
 "4.0": {"dk": {0: "회복실에서 잠이 깨시면 뵈러 들어가실 수 있어요.",
                1: "회복실에서 안정을 찾으시면 전화로 통화하실 수 있어요."},
         "decoy": "in her room"},
 "4.1": {"dk": {0: "준비되면 의사가 모시러 올 거예요."}},
 "4.2": {"dk": {1: "보통 퇴원 후 삼십 분 정도 걸려요."}},
 "4.3": {"blank": ("sleepy", ["sleepy", "cheerful", "hungry", "energetic"])},
 "4.4": {"dk": {1: "저희가 내일 아침에 다시 모시고 올게요."}},
 # 5 연락 방법
 "5.1": {"dk": {1: "원하시면 대기 번호표도 있어요."},
         "blank": ("pager", ["pager", "brochure", "locker", "printout"])},
 "5.2": {"dk": {0: "질문이 있을 경우를 대비해 연락 가능하게 계셔주세요.",
                1: "회진 시간을 대비해 연락 가능하게 계셔주세요."},
         "blank": ("reachable", ["reachable", "silent", "offline", "busy"])},
 "5.3": {"dk": {0: "식사하러 가시면 데스크에 어디 계실지 알려만 주세요.",
                1: "주차하러 나가시면 데스크에 어디 계실지 알려만 주세요."},
         "blank": ("desk", ["desk", "pharmacy", "lab", "gift shop"])},
 "5.4": {"blank": ("page", ["page", "bill", "fax", "seat"]), "decoy": "anything arrives"},
 # 6 지연 사유
 "6.0": {"blank": ("longer", ["longer", "shorter", "smoother", "quicker"])},
 "6.1": {"blank": ("ready", ["ready", "billed", "quiet", "empty"])},
 "6.2": {"dk": {1: "담당 의사가 정해지는 대로 바로 알려드릴게요."}},
 "6.3": {"dk": {0: "팀에서 이걸 안전하게 하려고 더 상의하고 있어요."}, "decoy": "extra cases"},
 "6.4": {"blank": ("wrong", ["wrong", "done", "ready", "new"])},
 # 7 장시간 수술
 "7.0": {"blank": ("longer", ["longer", "shorter", "smaller", "simpler"]), "decoy": "A shorter surgery"},
 "7.4": {"dk": {0: "한 번 더 확인해서 바로바로 알려드릴게요."}},
 # 8 불안 가족
 "8.2": {"dk": {0: "혼자가 아니에요, 제가 여기 자주 들를게요.",
                1: "많이 힘드시죠, 제가 여기 함께 있을게요."},
         "decoy": "with the team"},
 "8.3": {"blank": ("scared", ["scared", "relieved", "proud", "excited"]), "decoy": "to feel tired"},
 "8.4": {"decoy": "and sit down"},
 # 9 정보 범위
 "9.0": {"blank": ("stable", ["stable", "walking", "eating", "dressed"]), "decoy": "that he's awake"},
 "9.3": {"blank": ("specifics", ["specifics", "visitors", "press", "chaplain"])},
 "9.4": {"blank": ("right", ["right", "wrong", "last", "newest"]), "decoy": "to repeat"},
 # 10 다국어
 "10.0": {"dk": {0: "아드님은 잘 지내고 있고, 지금 회복실에 있어요.",
                 1: "따님은 잘 지내고 있고, 안정적이에요."},
          "blank": ("stable", ["stable", "critical", "unstable", "transferred"])},
 "10.1": {"dk": {0: "서로 잘 이해할 수 있게 쓰시는 언어부터 여쭤볼게요.",
                 1: "제 말을 잘 이해하시게 통역사를 불러올게요."},
          "blank": ("interpreter", ["interpreter", "orderly", "attendant", "escort"])},
 "10.3": {"blank": ("language", ["language", "room", "file", "car"])},
 # 11 소아 보호자
 "11.0": {"dk": {0: "아드님은 아주 잘 돌봐드리고 있으니 안심하세요.",
                 1: "따님은 아주 좋은 병실에 계시니 안심하세요."},
          "blank": ("hands", ["hands", "company", "spirits", "time"]), "decoy": "in very busy"},
 "11.1": {"dk": {1: "소아과 팀은 아이들을 씻기는 데 전문이에요."}, "blank": ("pediatric", ["pediatric", "geriatric", "cardiac", "orthopedic"])},
 "11.2": {"dk": {0: "회복실로 옮기시면 바로 알려드릴게요."}},
 "11.3": {"dk": {1: "의사가 계속 곁에서 세심하게 지켜볼 거예요."},
          "blank": ("whole", ["whole", "first", "last", "same"])},
 "11.4": {"dk": {1: "곧 사진을 보실 수 있을 거예요."},
          "blank": ("see", ["see", "feed", "bathe", "dress"])},
 # 12 면회 규정
 "12.0": {"dk": {0: "회복실을 깨끗하게 유지하려고 한 번에 한 분만 면회하실 수 있어요."}, "decoy": "the halls calm"},
 "12.1": {"blank": ("monitor", ["monitor", "visit", "meet", "bathe"])},
 "12.2": {"dk": {0: "교대로 들어가시면 오래 뵐 수 있어요.", 1: "교대로 들어가시면 두 분만 뵐 수 있어요."},
          "blank": ("switch", ["switch", "sign", "check", "log"])},
 "12.4": {"dk": {0: "누가 먼저 들어가실지 저와 정해주세요."}},
 # 13 추가 시술
 "13.0": {"dk": {0: "지금 바로 설명드려야 할 걸 발견했어요.",
                 1: "지금 바로 처리해야 할 걸 찾고 있어요."}},
 "13.3": {"dk": {0: "계획이 조금 바뀌긴 했지만, 여전히 마취 중이세요."}},
 "13.4": {"dk": {0: "집도의 선생님이 가능한 한 빨리 전화로 말씀 나눌 거예요.",
                 1: "집도의 선생님이 이야기를 마치면 다시 들어가실 거예요."}},
 # 14 종교
 "14.1": {"dk": {1: "모시고 들어가기 전에 잠깐 통화를 연결해드릴 수 있어요."},
          "blank": ("before", ["before", "after", "until", "once"])},
 "14.2": {"blank": ("available", ["available", "busy", "absent", "away"])},
 # 15 합병증
 "15.1": {"dk": {0: "팀에서 상의하고 있고, 지금은 안정적이세요.",
                 1: "팀에서 대응하고 있고, 지금은 회복실에 계세요."}},
 "15.2": {"dk": {1: "집도의 선생님이 자세히 다 들어드릴 거예요."}},
 "15.3": {"dk": {0: "받아들이기 힘든 결정이라는 거 알아요."}},
 "15.4": {"dk": {1: "집도의 선생님이 이야기하러 오실 때까지 저쪽에 있을게요."}},
 # 16 나쁜 소식
 "16.2": {"blank": ("time", ["time", "notes", "photos", "snacks"])},
 "16.3": {"blank": ("easy", ["easy", "quick", "polite", "short"])},
 "16.4": {"dk": {0: "저는 어디 안 가요, 계속 바로 뒤에 있을게요.",
                 1: "저는 어디 안 가요, 계속 바로 문 앞에 있을게요."}},
 # 17 사망
 "17.0": {"decoy": "for my"},
 "17.1": {"dk": {1: "필요한 만큼 시간을 가지세요, 제가 문 밖에 있을게요."}, "decoy": "Take all the forms"},
 "17.2": {"dk": {1: "준비되시면 다음 주에 도와드릴게요."},
          "blank": ("ready", ["ready", "alone", "outside", "upstairs"])},
 "17.3": {"dk": {0: "이런 상실에는 어떤 시간도 부족하네요.", 1: "이런 결정에는 어떤 말도 부족하네요."},
          "blank": ("words", ["words", "tests", "forms", "signs"])},
 # 18 분노
 "18.1": {"dk": {1: "지금 느끼시는 슬픔은 충분히 정당해요."},
          "blank": ("valid", ["valid", "public", "mutual", "private"])},
 # 19 응급
 "19.0": {"dk": {0: "환자분 위치가 바뀌어서 팀이 빠르게 움직이고 있어요."}},
 "19.1": {"dk": {1: "지금 할 수 있는 몇 가지를 하고 있어요."}, "blank": ("can", ["can", "want", "like", "choose"])},
 "19.3": {"dk": {0: "보고하러 가야 하지만, 곧 돌아올게요."},
          "blank": ("back in", ["back in", "home", "on break", "to lunch"])},
 "19.4": {"dk": {0: "바로 여기 계세요, 누군가 와서 물을 드릴 거예요."}, "blank": ("right here", ["right here", "at home", "downstairs", "in the car"])},
 # 20 결정 지원
 "20.1": {"dk": {0: "환자분이 원하셨을 걸 적어 보세요."},
          "blank": ("wanted", ["wanted", "missed", "forgotten", "ordered"]), "decoy": "Write down"},
 "20.3": {"blank": ("wrong", ["wrong", "free", "legal", "medical"]), "decoy": "There's no easy choice"},
 "20.4": {"dk": {0: "천천히 생각하시고, 필요한 건 뭐든 적어 두세요."},
          "blank": ("time", ["time", "turn", "pick", "coat"]), "decoy": "Take a seat"},
}

# order: 바꾸는 줄만 {줄 순번: (en, ko, note)} (아이콘은 원래 줄 것), why는 통째로.
O = {
 2: {"lines": {2: ("Those are the only details I have so far.", "지금까지 제가 아는 건 그게 전부예요", "한정")},
     "why": "수술실에 확인하고, 그 내용을 전한 뒤, 아는 것이 그게 전부라고 한정하고, 새 소식이 오면 다시 오겠다고 약속하는 순서예요. 'They said'·'Those'가 앞 줄을 가리켜요."},
 3: {"lines": {1: ("That worry is very common, and we plan for it.", "그런 걱정은 아주 흔하고, 저희도 대비하고 있어요", "인정")},
     "why": "걱정을 인정하고, 그 걱정이 흔해 대비가 있음을 알리고, 그 계획을 구체적으로 말한 뒤, 더 물어도 된다고 여는 순서예요. 'That worry'·'That plan'이 앞 줄을 가리켜요."},
 8: {"lines": {1: ("You don't have to feel it alone — I'm here with you.", "그 마음을 혼자 견디지 않으셔도 돼요, 제가 함께 있어요", "지지"),
               2: ("Since I'm right here, let's take a breath together.", "제가 바로 여기 있으니 같이 숨을 쉬어봐요", "제안")},
     "why": "느낌을 인정하고, 그 느낌을 혼자 견디지 않아도 된다며 곁에 있음을 알린 뒤, 곁에 있으니 함께 숨을 쉬자고 하고, 그다음 이야기 나눌지 묻는 순서예요. 'feel it'·'Since I'm right here'·'After that'이 앞 줄을 가리켜요."},
 9: {"lines": {3: ("From him, you'll get accurate information, not guesses.", "집도의 선생님께 들으시면 추측이 아닌 정확한 정보예요", "이유")},
     "why": "말할 수 있는 것을 알리고, 말할 수 없는 부분의 한계를 밝힌 뒤, 그 질문은 집도의가 답한다고 잇고, 그분께 들으면 추측이 아닌 정확한 정보라고 맺는 순서예요. 'But'·'that question'·'From him'이 앞 줄을 가리켜요."},
 10: {"lines": {1: ("To tell you more than that, let me get an interpreter.", "그 이상 말씀드리려면 통역사를 불러올게요", "제안"),
                2: ("They can explain everything in your language.", "통역사가 모든 걸 어머님 언어로 설명해요", "안내"),
                3: ("If any of it still isn't clear, please tell me.", "그래도 명확하지 않은 게 있으면 말씀해 주세요", "확인")},
      "why": "상태를 먼저 전하고, 그 이상은 통역사를 통해 전하겠다고 한 뒤, 통역사가 할 일을 알리고, 그래도 모르면 말해 달라고 청하는 순서예요. 'more than that'·'They'·'any of it still'이 앞 줄을 가리켜요."},
 11: {"lines": {1: ("That's because the pediatric team specializes in caring for children.", "소아과 팀이 아이들을 돌보는 데 전문이라서 그래요", "근거"),
                2: ("One of their nurses will watch her closely the whole time.", "그 팀 간호사가 내내 세심하게 지켜볼 거예요", "관찰")},
      "why": "아이를 잘 맡았다고 안심시키고, 그 근거로 소아 전문 팀을 들고, 그 팀 간호사가 곁에서 지켜본다고 알린 뒤, 회복실에서 직접 보게 해 주겠다고 맺는 순서예요. 'That's because'·'their'가 앞 줄을 가리켜요."},
 12: {"lines": {1: ("That rule helps us monitor her closely and safely.", "그 규정 덕분에 더 세심하고 안전하게 지켜볼 수 있어요", "이유"),
                3: ("For that, please decide together who goes in first.", "그러려면 누가 먼저 들어가실지 함께 정해주세요", "맡김")},
      "why": "규정을 이유와 함께 알리고, 그 규정의 효과를 설명한 뒤, 교대 방법을 안내하고, 교대를 위해 누가 먼저 들어갈지 가족이 정하게 맡기는 순서예요. 'That rule'·'For that'이 앞 줄을 가리켜요."},
 13: {"why": "무엇을 발견했는지 알리고, 계획이 바뀌어도 안정적이라고 전한 뒤, 집도의가 직접 와서 이야기한다고 잇고, 그때 질문이 다 답변되도록 챙기겠다고 맺는 순서예요. 'This'·'then'이 앞 줄을 가리켜요."},
 15: {"lines": {2: ("The surgeon will explain both of those in detail.", "집도의 선생님이 그 두 가지를 자세히 설명해드릴 거예요", "연결")},
      "why": "합병증이 있었다는 사실을 먼저 알리고, 팀이 대응 중이고 안정적이라는 현재를 전한 뒤, 그 두 가지를 설명할 사람을 알리고, 곁에 있겠다고 약속하는 순서예요. 'it'·'both of those'·'until then'이 앞 줄을 가리켜요."},
 16: {"lines": {1: ("There's no easy way to say it, so I'll be direct.", "쉽게 말씀드릴 방법이 없어서 바로 말씀드릴게요", "인정"),
                2: ("Being direct means telling you honestly what happened.", "바로 말씀드린다는 건 무슨 일이 있었는지 솔직히 말씀드린다는 거예요", "솔직")},
      "why": "앉자고 청하며 예고하고, 그 소식을 쉽게 말할 방법이 없으니 바로 말하겠다고 한 뒤, 무슨 일이 있었는지 솔직히 말하고, 그 뒤에 시간을 가지라며 곁에 있겠다고 맺는 순서예요. 'it'·'Being direct'·'Afterward'가 앞 줄을 가리켜요."},
 17: {"lines": {1: ("Those words feel too small for a loss like this.", "그 말로는 이런 상실에 턱없이 부족하네요", "인정")},
      "why": "애도를 먼저 전하고, 그 말로는 부족하다고 인정한 뒤, 시간을 가지라고 하고, 때가 되면 다음 일을 이야기하자고 맺는 순서예요. 'Those words'·'Whenever that is'가 앞 줄을 가리켜요."},
 19: {"lines": {1: ("I need to go back in to help them.", "들어가서 팀을 도와야 해요", "이유"),
                2: ("While I'm gone, please stay right here.", "제가 없는 동안 바로 여기 계세요", "안내"),
                3: ("That way, someone can find you with any update.", "그래야 누군가 소식을 들고 찾아올 수 있어요", "약속")},
      "icons": {1: "redo", 2: "pushpin", 3: "bell"},
      "why": "상태가 바뀌었음을 알리고, 팀을 도우러 들어가야 한다고 말한 뒤, 그동안 이 자리에 있어 달라고 청하고, 그래야 소식을 들고 찾아올 수 있다고 맺는 순서예요. 'them'·'While I'm gone'·'That way'가 앞 줄을 가리켜요."},
 20: {"lines": {3: ("Until then, take your time, and ask me anything you need.", "그때까지 천천히 생각하시고, 필요한 건 뭐든 물어보세요", "질문")},
      "why": "선택지를 설명하고, 그것을 염두에 두고 환자의 뜻을 떠올리게 하고, 어떤 결정이든 지지하겠다고 약속한 뒤, 결정하실 때까지 질문을 환영하며 맺는 순서예요. 'those'·'Until then'이 앞 줄을 가리켜요."},
}

d = yaml.safe_load(open(SRC, encoding="utf-8"))
sits = d["situations"]
for key, ch in S.items():
    si, j = map(int, key.split("."))
    x = sits[si]["sentences"][j]
    for k, v in ch.get("dk", {}).items():
        x["distractorsKo"][k] = v
    if "decoy" in ch:
        x["decoy"] = ch["decoy"]
    if "blank" in ch:
        ans, opts = ch["blank"]
        x["blank"] = {"answer": ans, "options": [{"en": o} for o in opts]}
for si, ch in O.items():
    o = sits[si]["order"]
    for k, (en, ko, note) in ch.get("lines", {}).items():
        o["lines"][k].update({"en": en, "ko": ko, "note": note})
    for k, ic in ch.get("icons", {}).items():
        o["lines"][k]["icon"] = ic
    o["why"] = ch["why"]
with open(DST, "w", encoding="utf-8") as f:
    yaml.safe_dump(d, f, allow_unicode=True, sort_keys=False, width=4096)
print("wrote", DST, "sentences changed", len(S), "orders changed", len(O))
