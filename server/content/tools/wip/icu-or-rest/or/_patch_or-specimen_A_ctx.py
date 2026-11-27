import yaml, io, glob
class Dumper(yaml.SafeDumper): pass
def _str(d, s):
    q = s.lower() in ("on","off","yes","no","true","false","null","y","n")
    return d.represent_scalar("tag:yaml.org,2002:str", s, style='"' if q else None)
Dumper.add_representer(str, _str)
def sc(who, icon, en, ok, fix=None):
    d = {"who": who, "icon": icon, "en": en, "ok": ok}
    if fix: d["fix"] = fix
    return d
NEW = {
"조직명 구두 확인": dict(words=["w-appendix"], word="appendix", ko="맹장", scenes=[
  sc("간호사 → 집도의","speech","Can you confirm this is the appendix before I bag it?",True),
  sc("간호사 → 병리 기사","pager","It's an appendix, or something like that, I think.",False,"The specimen is the appendix, confirmed verbally with Dr. Park."),
  sc("차트 기록","board","Specimen confirmed verbally with Dr. Park: appendix.",True)],
  why="뜻은 셋 다 '맹장(충수)'이에요. 집도의에게는 맹장이 맞는지 묻고, 차트에는 누구와 확인했는지 적어요. 하지만 병리 쪽에 '맹장인 것 같다'고 하면 확인된 이름인지 알 수 없어요. 누구와 확인했는지 밝히며 분명한 이름으로 말해요."),
"냉동절편 신속 이송": dict(words=["w-pathology"], word="pathology", ko="병리과", scenes=[
  sc("간호사 → 보호자","faceWorried","Pathology is checking right now whether it's cancer.",False,"The surgeon will explain everything after the surgery."),
  sc("간호사 → 집도의","speech","Pathology will call the result as soon as they have it.",True),
  sc("차트 기록","board","Frozen section sent to pathology at 10:35.",True)],
  why="뜻은 셋 다 '병리과'예요. 집도의에게는 병리과가 나오는 대로 전화한다고 알리고, 차트에는 언제 보냈는지 적어요. 하지만 보호자에게 병리과가 암인지 보고 있다고 말하는 것은 간호사의 일이 아니에요. 결과는 집도의가 수술 후 직접 설명해요."),
"검체 크기·개수 기록": dict(words=["w-fragment"], word="fragment", ko="단편", scenes=[
  sc("간호사 → 순환간호사","speech","Let's confirm there are three fragments before I seal the container.",True),
  sc("차트 기록","board","Three fragments received in one container, recorded on the form.",True),
  sc("간호사 → 병리 기사","pager","There's a fragment or two in there, or a bunch, I dunno.",False,"Three fragments are in the container, and each size is listed on the form.")],
  why="뜻은 셋 다 '단편'이에요. 동료에게는 밀봉하기 전에 수를 확인하자고 말하고, 차트에는 몇 단편을 서식에 기록했는지 적어요. 하지만 병리 쪽에 '한두 개 아니면 여러 개'라고 하면 단편이 빠져도 알 수 없어요. 정확한 개수와 서식에 적은 크기를 말해요."),
"검체 손상 방지 이송": dict(words=["w-crush"], word="crush", ko="으스러뜨리다", scenes=[
  sc("차트 기록","board","The tissue got crushed a bit, no big deal.",False,"Specimen crushed during transport; surgeon and pathology notified."),
  sc("간호사 → 이송 담당자","pager","Please don't crush it — carry the container flat.",True),
  sc("간호사 → 순환간호사","speech","Let's choose a container that won't crush it.",True)],
  why="뜻은 셋 다 '으스러뜨리다'예요. 이송 담당자에게는 누르지 말고 평평하게 들라고 하고, 동료에게는 눌리지 않을 용기를 고르자고 말해요. 하지만 차트에 '조금 눌렸는데 별일 아니다'라고 적으면 사고 기록이 되지 않아요. 무슨 일이 있었고 누구에게 알렸는지 적어요."),
"검체 분실 즉시 대응": dict(words=["w-field"], word="field", ko="수술 시야", scenes=[
  sc("간호사 → 병리 기사","pager","It's somewhere in the field probably, who knows.",False,"We're searching the surgical field and every container for it now."),
  sc("간호사 → 집도의","speech","I'm searching the field and the containers for the missing one.",True),
  sc("차트 기록","board","Surgical field and containers searched; specimen not found, surgeon notified.",True)],
  why="뜻은 셋 다 '수술 시야'예요. 집도의에게는 수술 시야와 용기를 찾고 있다고 알리고, 차트에는 어디를 찾았고 누구에게 알렸는지 적어요. 하지만 병리 쪽에 '시야 어딘가 있겠지, 누가 알아'라고 하면 사실을 알 수 없어요. 지금 어디를 찾고 있는지 분명히 알려요."),
"오염 검체 재채취": dict(words=["w-surface"], word="surface", ko="표면", scenes=[
  sc("간호사 → 집도의","speech","This sample touched a non-sterile surface — we need a new one.",True),
  sc("간호사 → 미생물 검사실","pager","It sat on a surface for a second, it's fine.",False,"It touched a non-sterile surface, so we're collecting a new sample."),
  sc("차트 기록","board","Sample contacted a non-sterile surface; new sample collected with sterile kit.",True)],
  why="뜻은 셋 다 '표면'이에요. 집도의에게는 무균이 아닌 표면에 닿았다고 알리고, 차트에는 닿은 사실과 재채취를 적어요. 하지만 미생물검사실에 '잠깐 있었는데 괜찮다'며 보내면 오염된 시료를 정상으로 믿고 검사하게 돼요. 무균이 아닌 표면에 닿았다는 사실을 분명히 알려요."),
"대체 불가 검체 위기": dict(words=["w-log"], word="log", ko="일지에 적다", scenes=[
  sc("간호사 → 순환간호사","speech","I'll log the handoff before I leave the room.",True),
  sc("간호사 → 이송 담당자","pager","Just log it somewhere, I guess, whatever.",False,"Please sign the handoff log with your name and the time."),
  sc("차트 기록","board","Handoff logged: time, name and receiver's signature.",True)],
  why="뜻은 셋 다 '일지에 적다'예요. 동료에게는 방을 나가기 전에 적겠다고 알리고, 차트에는 시간과 이름과 서명을 적었다고 기록해요. 하지만 이송 담당자에게 '아무 데나 적든지'라고 하면 무엇을 어디에 적으라는 것인지 알 수 없어요. 인계 기록지에 이름과 시간을 적으라고 분명히 말해요."),
}
PAIR2 = {"kind":"pair","words":["w-read","w-say","w-record","w-confirm"],
 "pairs":[["out","loud"],["word for","word"],["on the","record"]],"decoys":["the room"],
 "why":"'out loud(소리 내어)', 'word for word(한 마디도 빼지 않고)', 'on the record(기록으로 남겨)'는 서로 바꿔 끼울 수 없는 굳은 짝이에요. 검체 이름은 소리 내어 읽고, 들은 그대로 적고, 기록으로 남겨요."}
for f in sorted(glob.glob("add_or-specimen_A_nuance_*.yaml")):
    d = yaml.safe_load(io.open(f, encoding="utf-8"))
    for title, lst in d.items():
        for i, q in enumerate(lst):
            if q["kind"] == "context" and title in NEW:
                lst[i] = dict(kind="context", **NEW[title])
            if title == "조직명 구두 확인" and q["kind"] == "pair":
                lst[i] = PAIR2
    io.open(f, "w", encoding="utf-8").write(yaml.dump(d, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=1000))
# 단어 오답 조각·오답 정리
rep = {
 "w-specimen": ("decoyChips: [spice, man]", "decoyChips: [speck, mean]"),
 "w-right": ("decoyChips: [night]", "decoyChips: [rite]"),
 "w-flat": ("decoyChips: [flit]", "decoyChips: [flap]"),
 "w-identify": ("decoyChips: [id, tie]", "decoyChips: [id, dent]"),
 "w-identity": ("decoyChips: [id, tie]", "decoyChips: [id, dent]"),
 "w-search": ("decoyChips: [sear]", "decoyChips: [seat]"),
 "w-missing": ("decoyChips: [mess, ring]", "decoyChips: [mess, mist]"),
 "w-superior": ("chips: [[su, per, i, or]], decoyChips: [sup, ore]", "chips: [[sup, er, i, or]], decoyChips: [sue, ore]"),
 "w-positive": ("distractorsEn: [passive, possible]", "distractorsEn: [primitive, productive]"),
 "w-missing#": ("distractorsEn: [pending, dripping]", "distractorsEn: [pending, flowing]"),
 "w-sterile": ("distractorsEn: [stable, stale]", "distractorsEn: [subtle, stale]"),
 "w-lateral": ("distractorsEn: [literal, liberal]", "distractorsEn: [liberal, lethargic]"),
 "w-requisition": ("distractorsEn: [acquisition, prescription]", "distractorsEn: [acquisition, recognition]"),
}
for f in glob.glob("add_or-specimen_A_words_*.yaml"):
    lines = io.open(f, encoding="utf-8").read().split("\n")
    for k, (a, b) in rep.items():
        wid = k.rstrip("#")
        for i, ln in enumerate(lines):
            if ln.startswith(wid + ":") and a in ln:
                lines[i] = ln.replace(a, b); rep_done = True
    io.open(f, "w", encoding="utf-8").write("\n".join(lines))
