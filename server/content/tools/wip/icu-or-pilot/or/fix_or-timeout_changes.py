#!/usr/bin/env python3
"""수정 전(or-timeout.pre-fix 사본)과 지금 or-timeout.yaml 을 비교해 v44 필드 변경을 changes-or-timeout.yaml 에 덧붙인다."""
import io, sys, yaml
D = "/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-pilot/or"
PRE = sys.argv[1]
old = yaml.safe_load(io.open(PRE, encoding="utf-8")); new = yaml.safe_load(io.open(f"{D}/or-timeout.yaml", encoding="utf-8"))
ch = yaml.safe_load(io.open(f"{D}/changes-or-timeout.yaml", encoding="utf-8"))
base = [c for c in ch["changes"] if c.get("_fix") is None and not c.get("fixbatch")]
orig5 = {"w-start", "w-note", "w-check", "w-run", "w-align"}
base = [c for c in ch["changes"] if c["kind"] == "word" and c["id"] in orig5 and "fixbatch" not in c]
# w-align 은 이번에도 exKo 말고 v44 필드가 바뀌지 않으므로 기존 항목 그대로
out = list(base)
OW = {w["id"]: w for w in old["words"]}; NW = {w["id"]: w for w in new["words"]}
WHY_W = {
 "w-circulating": "ko를 '순환하는'으로 — 문장 ko·뉘앙스 설명의 '순환 간호사'와 통일",
 "w-type": "type and cross의 type은 혈액형을 정하는 검사 — ko를 '혈액형 검사'로",
 "w-double": "태그된 말은 double-check의 double — ko를 '이중의(두 번)'로(재확인의 → 이중의)",
 "w-vital": "문장 두 곳 모두 명사 vitals — 헤드워드를 vitals로(id는 그대로)",
 "w-hold": "example을 S19 문장(절개 보류)으로 — S8 'on hold'(혈액 확보)와 다른 뜻의 hold 태그를 떼었다",
}
for wid, nw in NW.items():
    ow = OW[wid]
    f = [k for k in ("en", "ko", "ipa", "icon", "example") if ow[k] != nw[k]]
    if f and wid not in orig5:
        out.append({"kind": "word", "id": wid, "fields": f, "why": WHY_W.get(wid, "검토 목록 반영"), "fixbatch": True})
for wid in OW:
    if wid not in NW:
        out.append({"kind": "word-remove", "id": wid, "why": "너무 쉬운 말(결정 11) — 어느 문장도 태그하지 않게 됨", "fixbatch": True})
for s_o, s_n in zip(old["situations"], new["situations"]):
    for i, (a, b) in enumerate(zip(s_o["sentences"], s_n["sentences"])):
        f = [k for k in ("en", "ko", "chunks", "words") if a[k] != b[k]]
        if f:
            why = []
            if "words" in f: why.append("쉬운 말 태그 제거" + (" · 다른 뜻의 hold/set 태그 제거" if set(a["words"]) - set(b["words"]) & {"w-hold", "w-set"} else ""))
            if "ko" in f: why.append("ko 수정(검토 목록)")
            if "chunks" in f: why.append("조각을 구 경계에서")
            out.append({"kind": "sentence", "situation": s_n["title"], "index": i, "fields": f, "why": " / ".join(why), "fixbatch": True})
ch["changes"] = out
for c in out: c.pop("fixbatch", None)
io.open(f"{D}/changes-or-timeout.yaml", "w", encoding="utf-8").write(yaml.safe_dump(ch, allow_unicode=True, sort_keys=False, width=1000))
print(len(out), "changes")
