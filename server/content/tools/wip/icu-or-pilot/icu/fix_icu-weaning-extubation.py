#!/usr/bin/env python3
"""A·B 검토(fix-icu-weaning-extubation-A/B.md)를 icu-weaning-extubation.yaml 하나에 제자리로 반영한다.
바꾸기 전 값을 assert로 확인하므로 두 번 돌리면 멈춘다."""
import yaml

D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-pilot/icu"
T = "icu-weaning-extubation"
P = f"{D}/{T}.yaml"
PC = f"{D}/changes-{T}.yaml"

d = yaml.safe_load(open(P, encoding="utf-8"))
ch = yaml.safe_load(open(PC, encoding="utf-8"))
W = {w["id"]: w for w in d["words"]}
SIT = d["situations"]
changes = ch["changes"]


def S(i, j):
    return SIT[i]["sentences"][j]


def N(i, kind, k=0):
    xs = [n for n in SIT[i]["nuance"] if n["kind"] == kind]
    return xs[k]


def opts(answer, wrong):
    return {"answer": answer, "options": [{"en": o} for o in [answer] + list(wrong)]}


def set_blank(i, j, answer, wrong):
    S(i, j)["blank"] = opts(answer, wrong)


def add_change(c):
    changes.append(c)


def merge_word_change(wid, add_fields, why=None):
    for c in changes:
        if c["kind"] == "word" and c["id"] == wid:
            for f in add_fields:
                if f not in c["fields"]:
                    c["fields"].append(f)
            if why:
                c["why"] = c["why"] + " / " + why
            return
    add_change({"kind": "word", "id": wid, "fields": list(add_fields), "why": why})


# ---------------------------------------------------------------- 단어 (A W-1~W-11)
def word(wid, **kw):
    for k, v in kw.items():
        assert k in W[wid], (wid, k)
        W[wid][k] = v


word("w-criterion", distractorsEn=["critique", "crisis"])
word("w-swollen", distractorsEn=["swallowed", "bruised"])
word("w-bedside", distractorsEn=["bedpan", "bedrest"], distractorsKo=["침상 변기", "침상 안정"],
     decoyChips=["bad", "sigh", "beside"])
word("w-gentle", distractorsEn=["gradual", "general"])
word("w-delay", distractorsEn=["relay", "decay"], distractorsKo=["중계", "감쇠"])
word("w-lose", distractorsEn=["loosen", "load"], distractorsKo=["느슨하게 하다", "싣다"])
word("w-material", distractorsEn=["manual", "matter"], distractorsKo=["설명서(매뉴얼)", "문제(사안)"])
word("w-alert", distractorsEn=["alarmed", "altered"], distractorsKo=["놀란", "의식이 달라진"])
assert W["w-stat"]["ko"] == "즉시"
word("w-stat", ko="즉시(응급)", distractorsEn=["PRN", "BID"], distractorsKo=["필요할 때", "하루 두 번"])
merge_word_change("w-stat", ["ko"], None)
changes[-1]["why"] = "ko '즉시'가 w-immediately와 같아 듣고 뜻 고르기에서 정답이 둘이 된다 — '즉시(응급)'로 가름"
word("w-pause", cue="진정제 점적을 아주 끊지는 않고 잠깐 멈춰 두는 일 — 매일 아침 얼마나 깨는지 볼 때")
word("w-strength", chips=[["strength"]], decoyChips=["strange"])

# ---------------------------------------------------------------- 결정 11 (A D-1~D-6)
def drop_word_from(i, j, wid):
    ws = S(i, j)["words"]
    assert wid in ws, (i, j, wid)
    ws.remove(wid)


def drop_word_from_nuance(i, wid):
    hit = 0
    for n in SIT[i]["nuance"]:
        if wid in n["words"]:
            n["words"].remove(wid)
            hit += 1
    return hit


sent_words_changed = {}  # (i,j) -> 사유

def note_words(i, j, wid):
    sent_words_changed.setdefault((i, j), []).append(wid)


removals = {
    "w-family": [(14, 0), (14, 4)],
    "w-tonight": [(10, 2), (10, 5), (14, 3)],
    "w-team": [(12, 5), (13, 2), (15, 1), (15, 3), (16, 3), (18, 2), (18, 5)],
    "w-stop": [(2, 2)],
    "w-heart": [(19, 1), (19, 4)],
    "w-strong": [(11, 4)],
    "w-reason": [(13, 2)],
}
for wid, locs in removals.items():
    for (i, j) in locs:
        drop_word_from(i, j, wid)
        note_words(i, j, wid)
    for i in range(len(SIT)):
        drop_word_from_nuance(i, wid)
    d["words"] = [w for w in d["words"] if w["id"] != wid]
    W.pop(wid)

# D-4 w-deteriorate ko, D-5 w-fail example, D-6 w-vent ko
assert W["w-deteriorate"]["ko"] == "악화되는"
word("w-deteriorate", ko="악화되다")
merge_word_change("w-deteriorate", ["ko"], "ko를 원형에 맞춰 '악화되다'로")
assert W["w-fail"]["ko"] == "실패하다"
word("w-fail",
     example="He's failed repeated trials, so we need a longer-term weaning plan.",
     exKo=S(18, 0)["ko"])
merge_word_change("w-fail", ["example"], "예문이 '상태가 나빠지다' 뜻(he's failing)이라 ko와 어긋나 — 시험 실패 뜻의 문장으로")
word("w-vent", ko="인공호흡기(줄임말)", distractorsKo=["정맥(혈관 이름)", "조끼(보호 장비)"])
for c in changes:
    if c["kind"] == "word" and c["id"] == "w-vent":
        c["why"] = "ko가 w-ventilator와 같아 정답이 둘이 된다 — 줄임말임을 드러내 가름('벤트(구어)'는 음차일 뿐이라 '인공호흡기(줄임말)'로)"

# ---------------------------------------------------------------- 문장 en·ko 고치기 (A S-1~S-4)
def rewrite_sentence(i, j, old_en, en, ko, chunks, words, tag, icon, why, decoy, dko, blank, goal=None):
    x = S(i, j)
    assert x["en"] == old_en, (i, j, x["en"])
    x["en"], x["ko"], x["chunks"], x["words"] = en, ko, chunks, words
    x["tag"], x["icon"], x["why"], x["decoy"] = tag, icon, why, decoy
    x["distractorsKo"] = dko
    x["blank"] = blank
    for w in W.values():  # 예문으로 쓰던 단어가 있으면 알려 준다
        assert w["example"] != old_en, (w["id"], "example이 옛 문장")


# S-1  S17 문장 3
rewrite_sentence(
    17, 3,
    "He's alert and his airway looks manageable, so let's try rescue NIV.",
    "He's alert and his airway looks manageable, but NIV shouldn't delay reintubation.",
    "각성돼 있고 기도도 다룰 만해 보이지만, NIV 때문에 재삽관이 늦어지면 안 돼요.",
    ["He's alert", "and his airway looks manageable", ", but NIV", "shouldn't delay", "reintubation", "."],
    ["w-alert", "w-airway", "w-manageable", "w-niv", "w-delay", "w-reintubation"],
    "NIV 한도", "shield",
    "but으로 앞의 좋은 관찰(각성, 기도)에 제동을 걸어, NIV를 하더라도 재삽관 결정을 미루면 안 된다는 한계를 말해요.",
    "on the monitor",
    ["각성돼 있고 기도도 다룰 만해 보이지만, NIV 때문에 수술이 늦어지면 안 돼요.",
     "진정돼 있고 기도도 다룰 만해 보이지만, NIV 때문에 재삽관이 늦어지면 안 돼요."],
    opts("airway", ["chest", "stomach", "skin"]))

# S-2  S8 문장 3
rewrite_sentence(
    8, 3,
    "The high-flow cannula keeps his airway open without needing the tube.",
    "The high-flow cannula helps him breathe without needing the tube.",
    "고유량 캐뉼라가 튜브 없이도 숨 쉬는 걸 도와줘요.",
    ["The high-flow cannula", "helps him breathe", "without needing", "the tube", "."],
    ["w-highflow", "w-breathe", "w-tube"],
    "장치 설명", "monitor",
    "helps him breathe로 장치가 하는 일을 호흡을 돕는 것으로 정확히 말하고, without needing the tube로 가족이 걱정하는 튜브가 아님을 알려요.",
    "for his lunch",
    ["고유량 마스크가 튜브 없이도 숨 쉬는 걸 도와줘요.",
     "고유량 캐뉼라가 튜브 없이도 잠드는 걸 도와줘요."],
    opts("cannula", ["catheter", "dressing", "splint"]))

# S-3  S3 문장 5
rewrite_sentence(
    3, 5,
    "I'll tell the doctor if the leak is small, so we can wait a day.",
    "If the leak is small, I'll let the doctor know before we extubate.",
    "새는 정도가 작으면 발관 전에 의사에게 알릴게요.",
    ["If the leak is small", ", I'll let", "the doctor know", "before we extubate", "."],
    ["w-leak", "w-extubate"],
    "보고 계획", "handshake2",
    "let the doctor know로 간호사의 몫을 결과를 알리는 것으로 말해요. 발관을 미룰지, 스테로이드를 줄지는 의사와 팀이 정해요.",
    "at the desk",
    ["새는 정도가 작으면 발관 전에 간호사에게 알릴게요.",
     "새는 정도가 작으면 흡인 전에 의사에게 알릴게요."],
    opts("small", ["cold", "empty", "new"]))

# S-4  S7 문장 5
rewrite_sentence(
    7, 5,
    "He's getting restless — I'll restart sedation at half dose.",
    "He's agitated and pulling at his lines — I'll restart sedation at half dose.",
    "초조해하며 라인을 잡아당기고 있어서 절반 용량으로 진정제를 재개할게요.",
    ["He's agitated", "and pulling at his lines", "— I'll restart", "sedation", "at half dose", "."],
    ["w-pull", "w-line", "w-restart", "w-sedation", "w-halfdose"],
    "재개 행동", "siren",
    "pulling at his lines라는 구체적인 행동을 근거로 대시 뒤에 조치를 이어서, 단순히 안절부절이 아니라 안전 위험 때문에 재개한다는 판단이 들려요.",
    "for the visitors",
    ["초조해하며 이불을 잡아당기고 있어서 절반 용량으로 진정제를 재개할게요.",
     "초조해하며 난간을 잡아당기고 있어서 절반 용량으로 진정제를 재개할게요."],
    opts("agitated", ["calm", "bored", "chatty"]))

for (i, j, fields, why) in [
    (17, 3, ["en", "ko", "chunks", "words"], "발관 뒤 이미 생긴 호흡부전에 rescue NIV를 조건 없이 '해 보자'고 하면 ERS/ATS 2017과 어긋나 — NIV가 재삽관을 늦추면 안 된다는 문장으로"),
    (8, 3, ["en", "ko", "chunks", "words"], "HFNC가 기도를 열어 둔다는 설명은 틀림 — 고유량 산소를 주어 호흡을 돕는다로"),
    (3, 5, ["en", "ko", "chunks", "words"], "발관을 미룰지는 의사·팀이 정함 — 간호사가 미루는 것처럼 읽히지 않게 '의사에게 알린다'로"),
    (7, 5, ["en", "ko", "chunks", "words"], "'안절부절'만으로 진정제를 재개하는 것은 SAT 실패 기준보다 낮음 — 라인을 당기는 안전 위험 행동으로"),
]:
    add_change({"kind": "sentence", "situation": SIT[i]["title"], "index": j, "fields": fields, "why": why})

# S17 order 줄 0 — 같은 조건 없는 rescue NIV 주장 (변경 목록 대상 아님: order는 v46 필드)
o = SIT[17]["order"]["lines"][0]
assert o["en"] == "He's alert and his airway looks manageable, so let's try rescue NIV."
o["en"] = "If he's alert with a manageable airway, we can trial rescue NIV briefly."
o["ko"] = "각성돼 있고 기도가 괜찮으면 잠시 구조 NIV를 해 볼 수 있어요"

# ---------------------------------------------------------------- chunks (A C-1~C-4)
def rechunk(i, j, old, new):
    x = S(i, j)
    assert x["chunks"] == old, (i, j, x["chunks"])
    x["chunks"] = new
    add_change({"kind": "sentence", "situation": SIT[i]["title"], "index": j, "fields": ["chunks"],
                "why": "구 경계를 가로지른 조각 나누기를 바로잡음"})

rechunk(4, 3, ["Let's double-check", "the oxygen", "flow meter", "before we start", "."],
        ["Let's", "double-check", "the oxygen flow meter", "before we start", "."])
rechunk(10, 3, ["His cough is weak", ", and he was", "intubated", "a long time", "."],
        ["His cough", "is weak", ", and he was intubated", "a long time", "."])
rechunk(17, 4, ["If he keeps deteriorating", "past", "the time limit", ", we reintubate", "."],
        ["If he", "keeps deteriorating", "past the time limit", ", we reintubate", "."])
rechunk(20, 5, ["We'll prepare", "to reintubate immediately", "if this doesn't", "clear", "."],
        ["We'll prepare", "to reintubate immediately", "if this", "doesn't clear", "."])

# ---------------------------------------------------------------- 뉘앙스 (A N-1~N-14)
def rep_nuance(i, kind, new, k=0):
    n = N(i, kind, k)
    pos = SIT[i]["nuance"].index(n)
    SIT[i]["nuance"][pos] = new

rep_nuance(2, "slider", {
    "kind": "slider", "words": ["w-effort", "w-distress"],
    "cue": "Colleague: \"His rate is 28, but he's breathing easily — no neck muscles, sats holding.\"",
    "scale": ["unlabored", "labored", "in distress"], "answerAt": 0,
    "why": "호흡 노력은 unlabored(편안함) → labored(힘듦, 보조근 사용) → in distress(얼굴과 몸 전체로 괴로움이 드러남)로 올라가요. 호흡수가 28이어도 노력이 편해 보이면 unlabored라고 따로 말해야, 듣는 사람이 수치 하나로 시험을 멈추지 않아요.",
    "example": "Respirations are unlabored at a rate of 28.", "exKo": "호흡수 28, 호흡은 편안해요."})
rep_nuance(10, "slider", {
    "kind": "slider", "words": ["w-reintubation", "w-closely"],
    "cue": "Family: \"Is he going to need the tube again?\" — two risk factors, but doing well so far.",
    "scale": ["might need it", "is likely to need it", "will need it"], "answerAt": 0,
    "why": "위험인자가 있어도 지금 잘 지내고 있으면 might(그럴 수도 있음)가 사실에 맞아요. is likely to는 가능성이 더 크다는 판단이고, will은 확정이라 가족에게 사실보다 무겁게 들려요. 고위험은 '더 가까이 지켜본다'는 뜻이지 '실패한다'는 뜻이 아니에요.",
    "example": "He might need the tube again, so we're watching him closely.", "exKo": "튜브가 다시 필요할 수도 있어서 세심히 지켜보고 있어요."})
rep_nuance(12, "slider", {
    "kind": "slider", "words": ["w-tracheostomy", "w-comfortable"],
    "cue": "Doctor: \"Most patients find a trach easier to tolerate than the tube in the mouth.\"",
    "scale": ["sometimes", "usually", "always"], "answerAt": 1,
    "why": "대부분의 환자에게 맞는 말이면 usually예요. always는 예외를 지워 약속처럼 들리고, sometimes는 실제 장점을 깎아요. 가족에게 좋은 점을 말할 때도 사실의 강도를 맞춰요.",
    "example": "A tracheostomy is usually more comfortable than the tube through his mouth.", "exKo": "기관절개가 보통 입으로 넣는 튜브보다 더 편안해요."})
rep_nuance(17, "slider", {
    "kind": "slider", "words": ["w-deteriorate"],
    "cue": "Two minutes after extubation: SpO2 78 and dropping fast, gasping, can't speak.",
    "scale": ["slowly worsening", "deteriorating", "crashing"], "answerAt": 2,
    "why": "slowly worsening은 시간을 두고 나빠지는 것, deteriorating은 분명히 악화되는 중, crashing은 몇 분 안에 무너지는 상태를 말하는 의료진 구어예요. crashing이라고 하면 듣는 사람이 바로 침상으로 와야 한다는 걸 알아요. 발관 직후 이런 모습이면 지체 없이 도움을 불러요.",
    "example": "He's crashing — I need help in here now.", "exKo": "급격히 무너지고 있어요, 지금 여기로 와 주세요."})

# N-6 S15 slider
n = N(15, "slider")
assert "barely see his chest move" in n["cue"]
n["cue"] = "RN: \"The stridor was loud a minute ago. Now he's silent, his chest isn't rising, and I can't feel any air at his mouth.\""
assert "가슴 움직임까지 거의 없으면" in n["why"]
n["why"] = n["why"].replace("가슴 움직임까지 거의 없으면", "가슴이 오르지 않고 입에서 공기가 느껴지지 않으면")

# N-7 S1 pair
n = N(1, "pair")
assert n["pairs"][0] == ["low", "oxygen requirement"]
n["pairs"][0] = ["a low", "oxygen requirement"]
assert "산소 요구량이 low," in n["why"]
n["why"] = n["why"].replace("산소 요구량이 low,", "산소 요구량은 a low oxygen requirement,")

# N-8 S7 pair
n = N(7, "pair")
assert n["pairs"][1] == ["watch", "his vitals"]
n["pairs"][1] = ["watch", "for agitation"]
n["words"] = [("w-agitation" if w == "w-vitals" else w) for w in n["words"]]
assert "watch his vitals로 활력징후를 보며" in n["why"]
n["why"] = n["why"].replace("watch his vitals로 활력징후를 보며", "watch for agitation으로 초조해지는지 보며")

# N-9 S10 context
n = N(10, "context")
assert n["scenes"][2]["en"] == "He has several risk factors for reintubation failure."
n["scenes"][2]["en"] = "He has several risk factors for extubation failure."
assert "reintubation failure" in n["why"]
n["why"] = n["why"].replace("reintubation failure", "extubation failure")

# N-10, N-11 S9 context
n = N(9, "context")
assert n["scenes"][2]["en"] == "We had to put the mask on because he's failing extubation."
n["scenes"][2]["en"] = "We put him on a prophylactic NIV mask given his high reintubation risk."
n["why"] = "prophylactic NIV mask, reintubation risk는 의료진끼리의 정확한 말이지만 가족에게는 무엇이 잘못된 것처럼 들려요. 가족에게는 다시 튜브가 필요하지 않도록 돕는 예방 장치라고 쉬운 말로 말해요."
assert n["scenes"][0]["en"] == "Check the mask seal — he's leaking by the nose."
n["scenes"][0]["en"] = "Check the mask seal — he's leaking at the bridge of his nose."

# N-12 S6 context fix
n = N(6, "context")
assert n["scenes"][2]["fix"].startswith("You're breathing fast because you're nervous")
n["scenes"][2]["fix"] = "Feeling nervous can make you breathe faster — we're checking everything to be sure."

# N-13 S8 swap notes
n = N(8, "swap")
k = "warm oxygen in his nose"
assert "따뜻하고 많은 양의 산소라는 특징도 담겨요" in n["notes"][k]
n["notes"][k] = n["notes"][k].replace("따뜻하고 많은 양의 산소라는 특징도 담겨요", "따뜻한 산소라는 특징도 담겨요")

# ---------------------------------------------------------------- B 검토
def set_dko(i, j, k, new, old_part=None):
    x = S(i, j)
    if old_part:
        assert old_part in x["distractorsKo"][k], (i, j, k, x["distractorsKo"][k])
    x["distractorsKo"][k] = new

# distractorsKo (B 1~23, 일부는 위 문장 교체로 대체됨)
set_dko(4, 2, 0, "흡인기와 재삽관 세트가 손닿는 곳에 있는지 동료가 볼 거예요.", "복도 끝")
set_dko(4, 2, 1, "흡인기와 재삽관 세트가 손닿는 곳에 있는지 사진으로 남길게요.", "병동 입구")
set_dko(16, 4, 0, "흡인기와 후두경을 침상 곁에서 닦아 뒀어요.", "입구")
set_dko(7, 2, 1, "안전하지 않거나 불안정해지면 곁에 남아 라인을 지켜 볼게요.", "두 번 더")
set_dko(15, 0, 0, "저 가래 소리는 상기도가 붓고 좁아지고 있다는 뜻이에요.", "하기도")
set_dko(15, 1, 0, "에피네프린을 분무하고 지금 침대 머리를 올려 주세요.", "약사")
set_dko(15, 1, 1, "에피네프린을 분무하고 지금 창문을 열어 주세요.", "간병인")
set_dko(15, 3, 1, "협착음이 점점 커지고 있어요, 지금 재삽관 카트가 필요해요.", "영양팀")
set_dko(15, 4, 0, "부기를 줄이려고 지금 동료가 에피네프린을 분무하고 있어요.", "열을")
set_dko(15, 4, 1, "부기를 줄이려고 지금 약사가 에피네프린을 분무하고 있어요.", "통증을")
set_dko(17, 0, 0, "각성돼 있고 기도가 다룰 만하면 잠시 구조 NIV를 준비해 둘 수 있어요.", "보호자가 동의")
set_dko(17, 4, 1, "시간 제한을 넘어 계속 악화되면 마취과에 연락할게요.", "모니터를")
set_dko(20, 2, 1, "완전히 막히면 즉시 호흡치료사를 부를게요.", "동료에게")
set_dko(20, 3, 0, "완전히 막히기 전에 동료가 적극적으로 흡인해서 내용물을 없애고 있어요.", "막힌 뒤")
set_dko(20, 5, 0, "이게 없어지지 않으면 즉시 마취과를 부를게요.", "동료에게")
set_dko(20, 5, 1, "이게 없어지지 않으면 즉시 기도팀을 부를게요.", "시간을")
set_dko(13, 3, 1, "가족이 같은 내용을 알도록 지금 지연 사유를 차트에 남기고 있어요.", "직원이")
set_dko(16, 3, 0, "팀이 엑스레이를 준비하는 동안 100퍼센트로 백 환기하고 있어요.", "장비")
set_dko(8, 0, 0, "고유량 장치가 튜브 없이 따뜻한 산소와 부드러운 마사지를 줘요.", "강한")
set_dko(8, 0, 1, "고유량 장치가 튜브 없이 따뜻한 물과 부드러운 지지를 줘요.", "시원한")
set_dko(12, 0, 0, "기관절개가 오히려 장기 지지에서 더 저렴하게 만들어 줄 수 있어요.", "단기")
set_dko(19, 2, 1, "12유도 심전도를 찍고 즉시 보호자에게 알릴게요.", "수간호사")
set_dko(20, 1, 1, "옆으로 돌리고 입안을 닦아 주세요.", "도움을")
set_dko(5, 4, 0, "기침이 충분히 길어서 스스로 분비물을 배출할 수 있어요.", "소변")
set_dko(15, 2, 0, "기침할 경우를 대비해 재삽관 카트를 준비해 두세요.", "퇴원")

# 빈칸 (B 25~33 + 가벼운 것)
set_blank(2, 5, "failure", ["recovery", "success", "comfort"]); S(2, 5)["blank"]["answer"] = "failure"
set_blank(7, 0, "see", ["ask", "guess", "decide"])
set_blank(15, 2, "ready", ["locked", "empty", "new"])
set_blank(5, 4, "strong", ["weak", "wet", "short"])
set_blank(7, 2, "unsafe", ["unhappy", "unclear", "untidy"])
set_blank(13, 4, "know", ["forget", "ignore", "hide"])
set_blank(0, 3, "checking", ["weighing", "turning", "washing"])
set_blank(5, 3, "suctioning", ["charting", "listening", "repositioning"])
set_blank(6, 5, "settles", ["spreads", "worsens", "shrinks"])
set_blank(1, 0, "requirement", ["saturation", "tubing", "mask"])
set_blank(1, 1, "stable", ["falling", "low", "labile"])
set_blank(1, 2, "adequate", ["unusual", "impaired", "altered"])
set_blank(1, 4, "trial", ["transfer", "scan", "bath"])
set_blank(1, 5, "result", ["cost", "consent", "bill"])
set_blank(2, 1, "tiring", ["improving", "recovering", "relaxing"])
set_blank(2, 2, "distress", ["improvement", "progress", "comfort"])
set_blank(3, 3, "neck", ["chest", "back", "stomach"])
set_blank(3, 4, "leak", ["fever", "cough", "gag"])
set_blank(4, 0, "ready", ["empty", "closed", "locked"])
set_blank(4, 1, "backup", ["routine", "default", "replacement"])
set_blank(4, 3, "oxygen", ["saline", "air", "suction"])
set_blank(4, 4, "mask", ["gown", "gloves", "tape"])
set_blank(4, 5, "set", ["off", "missing", "loose"])
set_blank(5, 5, "secretions", ["stitches", "bandages", "wristband"])
set_blank(6, 2, "adjust", ["continue", "finish", "skip"])
set_blank(6, 4, "anxiety", ["boredom", "silence", "sunlight"])
set_blank(8, 1, "oxygen", ["sugar", "sodium", "weight"])
set_blank(9, 3, "wrong", ["missing", "stuck", "spilled"])
set_blank(9, 4, "careful", ["relaxed", "hopeful", "brief"])
set_blank(9, 5, "seal", ["alarm", "tubing", "chart"])
set_blank(10, 2, "closely", ["rarely", "briefly", "remotely"])
set_blank(10, 4, "handoff", ["discharge", "admission", "transfer"])
set_blank(12, 0, "comfortable", ["exhausted", "anxious", "restless"])
set_blank(12, 1, "longer", ["shorter", "easier", "quicker"])
set_blank(12, 3, "usually", ["rarely", "never", "barely"])
set_blank(12, 5, "timing", ["cost", "visitors", "discharge"])
set_blank(13, 2, "reason", ["time", "room", "bed"])
set_blank(13, 5, "plan", ["visitors", "diet", "bill"])
set_blank(14, 5, "calmer", ["drowsier", "sicker", "weaker"])
set_blank(16, 5, "secure", ["measure", "inspect", "photograph"])
set_blank(17, 0, "briefly", ["slowly", "quietly", "regularly"])
set_blank(18, 1, "gradual", ["sudden", "rapid", "forced"])
set_blank(18, 2, "goals", ["rooms", "meds", "visitors"])
set_blank(19, 2, "notify", ["thank", "invite", "question"])
set_blank(11, 0, "weaken", ["swell", "heal", "grow"])
set_blank(17, 1, "reintubate", ["rehydrate", "relocate", "reschedule"])
set_blank(20, 1, "side", ["bed", "floor", "stretcher"])

# decoy (B 34·35)
assert S(4, 2)["decoy"] == "in storage"; S(4, 2)["decoy"] = "for the audit"
assert S(16, 4)["decoy"] == "in the hall"; S(16, 4)["decoy"] = "on the monitor"
assert S(10, 3)["decoy"] == "for a while ago"; S(10, 3)["decoy"] = "a short time"

# order (B 37~41)
def set_line(i, k, old_en, **kw):
    ln = SIT[i]["order"]["lines"][k]
    assert ln["en"] == old_en, (i, k, ln["en"])
    ln.update(kw)

# 7번(S6)
set_line(6, 2, "To see if that settles, I'll trend his vitals for the next hour.",
         en="I'll report that pattern now so we can adjust the weaning plan.",
         ko="그 양상을 지금 보고해 계획을 조정해요", note="보고", icon="handshake2")
set_line(6, 3, "Whatever that shows, I'll report the pattern so we can adjust the weaning plan.",
         en="Meanwhile, I'll trend his vitals to see if it settles.",
         ko="그동안 활력징후 추이를 보고 가라앉는지 봐요", note="추이", icon="chartup")
SIT[6]["order"]["why"] = "원인 후보를 나열해 문제를 구조화하고, 관찰한 소견을 말한 뒤, 그 양상을 바로 보고해 계획을 조정하게 하고, 그동안 추이를 지켜보겠다는 말로 닫아요."
# 9번(S8)
set_line(8, 2, "So far, his oxygen levels look good on it.",
         en="So far, both of those look good.", ko="지금까지 둘 다 좋아 보여요")
SIT[8]["order"]["why"] = "장치가 주는 것을 먼저 설명하고, 그 장치에서 지켜보는 두 가지를 말한 뒤, 지금까지 둘 다 괜찮다는 경과를 말하고, 이 모든 것의 목적으로 닫아요."
# 16번(S15)
set_line(15, 3, "Beyond that, tell me the moment the stridor gets louder.",
         en="Keep it at the bedside in case he obstructs completely.", ko="완전히 막힐 때를 대비해 침상 곁에 두세요",
         note="대기", icon="shield")
SIT[15]["order"]["why"] = "소리를 해석해 상황을 알리고, 치료와 호출을 지시하고, 재삽관 카트를 준비하게 한 뒤, 그 카트를 침상 곁에 두라는 말로 닫아요."
# 19번(S18)
set_line(18, 1, "A gradual wean with a tracheostomy might suit him better.",
         en="For that, a gradual wean with a tracheostomy might suit him better.",
         ko="그러려면 기관절개를 통한 점진적 이탈이 더 맞을 수 있어요")
# 8번(S7)
set_line(7, 1, "I'm watching for agitation so he doesn't pull at his lines.",
         en="While he's off it, I'm watching for agitation so he doesn't pull at his lines.",
         ko="그동안 라인을 당기지 않게 초조함을 봐요")

# tag·icon (B 42), why (B 43)
assert S(20, 4)["icon"] == "stetho"; S(20, 4)["icon"] = "gear"
x = S(3, 2)
assert x["why"].startswith("make sure he can breathe once")
x["why"] = "once가 '빠진 뒤'라는 시점을 정해서 검사 목적이 발관 후의 호흡이라는 점을 짚어요."
x = S(4, 2)
assert "confirm은 눈으로 직접 본다" in x["why"]
x["why"] = x["why"].replace("confirm은 눈으로 직접 본다는 책임을 말해요", "confirm은 있다고 가정하지 않고 확인한다는 책임을 말해요")

# decoy 되풀이 줄이기 (B 36) — 응급 문장에 시간 지연 decoy가 되지 않게 장소·사물 조각만
POOL = ["by the window", "on the cart", "in the corner", "at the nurses' station", "near the sink", "on the wall",
        "by the sink", "at the door", "near the bed", "on the shelf"]
from collections import Counter
cnt = Counter(x["decoy"] for s in SIT for x in s["sentences"])
rep = [k for k, v in cnt.items() if v >= 4]
seen = Counter()
pi = 0
decoy_changes = 0
for s in SIT:
    for x in s["sentences"]:
        k = x["decoy"]
        if k in rep:
            seen[k] += 1
            if seen[k] > 3:
                while True:
                    cand = POOL[pi % len(POOL)]
                    pi += 1
                    if cand.lower() not in x["en"].lower() and cand not in x["chunks"]:
                        break
                x["decoy"] = cand
                decoy_changes += 1
print("decoy 되풀이 교체:", decoy_changes)

# ---------------------------------------------------------------- changes: 제거·문장 words
for wid, locs in removals.items():
    add_change({"kind": "word-remove", "id": wid, "why": "너무 쉬움(공통 쉬운 단어 또는 간호사가 이미 아는 말) — 어느 문장도 태그하지 않게 됐다"})
for (i, j), wids in sorted(sent_words_changed.items()):
    add_change({"kind": "sentence", "situation": SIT[i]["title"], "index": j, "fields": ["words"],
                "why": f"{', '.join(wids)} 태그를 뺌 — 너무 쉬운 단어"})

yaml.safe_dump(d, open(P, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
yaml.safe_dump(ch, open(PC, "w", encoding="utf-8"), allow_unicode=True, sort_keys=False, width=1000)
print("saved; changes:", len(changes))
