import yaml
T = "or-tourniquet"
D = {}
for n in (1,2,3):
    g = {}
    exec(open(f"data_{T}_B_{n}.py", encoding="utf-8").read(), g)
    D.update(g["D"])
base = yaml.safe_load(open(f"base-{T}.yaml", encoding="utf-8"))

PATCH = {(1,3):("size","color","name"),(4,2):("weight","texture","temperature"),(8,1):("date","name","weather"),
(10,0):("cost","noise","speed"),(12,2):("sound","taste","smell"),(14,2):("weather","rumor","noise"),(18,0):("smell","weight","brand"),
(12,3):("sticker","badge","marker"),(3,4):("final","rough","random"),(6,1):("minimum","entrance","window"),(15,4):("typical","first","usual"),
(20,2):("average","weekly","daily"),(9,4):("recipe","ledger","diet"),
(9,1):("abandoned","cancelled","reversed"),(14,4):("concealing","rehearsing","decorating")}
ANS = {(2,1):"Smooth"}
assert len(base["situations"]) == len(D) == 21
for i, sit in enumerate(base["situations"]):
    d = D[i]
    assert len(d["s"]) == len(sit["sentences"]) == 5, i
    for x, r in zip(sit["sentences"], d["s"]):
        assert len(r) == 10, (i, r)
        tag, icon, why, decoy, d1, d2, ans, w1, w2, w3 = r
        k = (i, d["s"].index(r))
        if k in PATCH: w1, w2, w3 = PATCH[k]
        if k in ANS: ans = ANS[k]; w1, w2, w3 = ("Rough","Wet","Folded")
        x["tag"] = tag; x["icon"] = icon; x["why"] = why; x["decoy"] = decoy
        x["distractorsKo"] = [d1, d2]
        x["blank"] = {"answer": ans, "options": [{"en": o} for o in (ans, w1, w2, w3)]}
    o = d["order"]; assert len(o["lines"]) == 4
    sit["order"] = {"tag": o["tag"], "icon": o["icon"], "ko": o["ko"], "why": o["why"],
        "lines": [{"en": l[0], "icon": l[1], "ko": l[2], "note": l[3]} for l in o["lines"]]}
with open(f"{T}.B.yaml", "w", encoding="utf-8") as f:
    yaml.safe_dump(base, f, allow_unicode=True, sort_keys=False, width=1000)
print("wrote")
