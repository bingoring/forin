#!/usr/bin/env python3
"""수정 전 사본(argv[1])과 지금 yaml 을 비교해 v44 필드 변경을 changes-or-malignant-hyperthermia.yaml 에 이어 적는다."""
import io, sys, yaml
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-pilot/or"
old = yaml.safe_load(io.open(sys.argv[1], encoding="utf-8"))
new = yaml.safe_load(io.open(f"{D}/or-malignant-hyperthermia.yaml", encoding="utf-8"))
CP = f"{D}/changes-or-malignant-hyperthermia.yaml"
ch = yaml.safe_load(io.open(CP, encoding="utf-8"))
items = ch["changes"]
def find(kind, **kw):
    for c in items:
        if c["kind"] == kind and all(c.get(k) == v for k, v in kw.items()): return c
    return None
def add(kind, fields, why, **kw):
    c = find(kind, **kw)
    if c is None:
        c = {"kind": kind, **kw, "fields": [], "why": why}
        items.append(c)
    else:
        if why not in c["why"]: c["why"] = c["why"] + " / " + why
    for f in fields:
        if f not in c["fields"]: c["fields"].append(f)
OW = {w["id"]: w for w in old["words"]}; NW = {w["id"]: w for w in new["words"]}
WHY_W = {
 "w-cart": "문장 2.3 'twelve vials'(MHAUS 권고량과 다른 수치)를 정량 전부로 바꿔 예문도 교체",
 "w-medication": "w-drug(약물)와 ko가 겹쳐 듣고 뜻 고르기에서 정답이 둘 — 투약용 약으로 가름",
 "w-reconstitute": "재구성은 약 설명서식 직역 — 임상에서 쓰는 '녹여 조제하다'로",
 "w-critical": "문장이 critically(부사) — 헤드워드를 부사로(id는 그대로)",
}
for wid, nw in NW.items():
    ow = OW[wid]
    f = [k for k in ("en", "ko", "ipa", "icon", "example") if ow[k] != nw[k]]
    if f: add("word", f, WHY_W.get(wid, "검토 목록 반영"), id=wid)
WHY_S = {
 ("dantrolene 위치 확인", 3): "twelve vials는 MHAUS 권고(20 mg 36바이알·Ryanodex 3바이알)와 맞지 않는 수치 — 정량 전부로",
 ("MH 카트 점검", 2): "in date는 유효기한 안 — ko '유효기한도 지났어요'는 뜻이 반대",
 ("급속 냉각 시행", 3): "pack ice to → around(자연스러운 영어)",
 ("MH 위기 발동", 4): "'손을 더 불러'는 어색 → 일손",
 ("EtCO2 상승 조기 인지", 1): "'조기 MH가 생각나요' → 초기 MH가 의심돼요",
 ("MH 감수성 환자 준비", 2): "'안전한 손에 맡겨져'는 직역",
 ("유발약 회피 마취", 2): "'준비되어 뽑아 두었어요' 어순 정리",
 ("냉각 물품 준비", 4): "'콜하는 순간'은 뜻이 흐림 → MH로 선언하는 순간",
 ("고칼륨 감시", 0): "send a level = 검사를 보내다",
 ("dantrolene 혼합 투여", 0): "reconstitute → 녹여 조제(재구성 직역 정리)",
 ("고칼륨 부정맥 대응", 0): "'위중하게 높아요'는 어색 → 위험할 만큼",
 ("고칼륨 부정맥 대응", 1): "'포도당을 곁들인 인슐린' → 인슐린과 포도당",
}
for st, so, sn in zip(range(99), old["situations"], new["situations"]):
    for i, (a, b) in enumerate(zip(so["sentences"], sn["sentences"])):
        f = [k for k in ("en", "ko", "chunks", "words") if a[k] != b[k]]
        if f:
            why = []
            if "ko" in f or "en" in f: why.append(WHY_S.get((sn["title"], i), "검토 목록 반영"))
            if "chunks" in f: why.append("조각을 구 경계에서")
            add("sentence", f, " / ".join(why) or "검토 목록 반영", situation=sn["title"], index=i)
io.open(CP, "w", encoding="utf-8").write(yaml.safe_dump(ch, allow_unicode=True, sort_keys=False, width=1000))
print(len(items))
