import yaml, glob, sys
D="/Users/ywyeom/private/forin/server/content/tools/wip/icu-or-rest/icu"
# w -> overrides
O = {
 "chilled": dict(dEn=["thrilled","chipped"]),
 "itchy": dict(dEn=["icy","inky"]),
 "achy": dict(chips=[["ach","y"]]),
 "temperature": dict(dEn=["temperament","temperance"]),
 "factor": dict(dEn=["favor","fraction"]),
 "replace": dict(dEn=["replay","retrace"]),
 "provider": dict(dEn=["providence","province"]),
 "ffp": dict(dEn=["PRBC","FDA"]),
 "cryoprecipitate": dict(dEn=["cryopreservation","cryoglobulin"], chips=[["cryo","pre","cip","i","tate"]], decoy=["crow","sip"]),
 "disease": dict(dEn=["disuse","decease"]),
 "low": dict(dEn=["loud","lean"]),
 "after": dict(dEn=["afar","ever"]),
 "ask": dict(dEn=["aim","act"]),
 "tell": dict(dEn=["sell","yell"]),
 "say": dict(dEn=["stay","pay"]),
 "chart": dict(dEn=["charm","charter"]),
 "sign": dict(decoy=["sine"]),
 "run": dict(dEn=["rub","ruin"], decoy=["rung"]),
 "slow": dict(dEn=["slim","slick"]),
 "start": dict(dEn=["stare","stir"]),
 "baseline": dict(dEn=["deadline","headline"]),
 "vital": dict(dEn=["vision","virus"], dKo=["생활습관","면역수치"]),
 "stay": dict(dEn=["stray","sway"]),
 "shortly": dict(dEn=["sharply","surely"]),
 "off": dict(dEn=["oily","oval"]),
 "away": dict(dEn=["aside","awhile"]),
 "closely": dict(dEn=["clearly","coldly"]),
 "back": dict(dEn=["badly","barely"]),
 "tolerate": dict(dEn=["translate","titrate"]),
 "fever": dict(dEn=["feather","fiber"]),
 "dyspnea": dict(chips=[["dys","pnea"]], decoy=["dis","knee"]),
 "signal": dict(dEn=["spike","settle"]),
 "spike": dict(dEn=["spill","spoil"]),
 "open": dict(dEn=["offer","order"]),
 "document": dict(dEn=["dominate","decorate"]),
 "redcell": dict(dEn=["white cells","red cross"]),
 "choose": dict(dEn=["choke","chew"]),
 "component": dict(dEn=["compound","complaint"]),
 "must": dict(dEn=["might","shall"], dKo=["해도 된다","할 수 없다"]),
 "thirty": dict(dEn=["thirteen","forty"]),
 "leave": dict(dEn=["lease","leap"]),
 "thrombocytopenia": dict(chips=[["thrombo","cyto","penia"]], decoy=["phobia","cytes"]),
}
k={"dEn":"dEn","dKo":"dKo","chips":"chips","decoy":"decoy"}
done=set()
for f in sorted(glob.glob(f"{D}/add_icu-transfusion_A_words_*.yaml")):
    L=yaml.safe_load(open(f,encoding="utf-8")); ch=False
    for e in L:
        if e["w"] in O:
            e.update(O[e["w"]]); done.add(e["w"]); ch=True
    if ch:
        with open(f,"w",encoding="utf-8") as g:
            for e in L:
                g.write("- "+yaml.safe_dump(e,allow_unicode=True,default_flow_style=True,width=10000).strip()+"\n")
print(set(O)-done)
