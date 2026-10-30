import glob
fs = {f: open(f, encoding="utf-8").read() for f in sorted(glob.glob("addB_core-safety-icu_*.yaml"))}
def rep(old, new, nth=0):
    allt = "".join(fs.values())
    for f, t in fs.items():
        idx = -1
        for _ in range(nth + 1):
            idx = t.find(old, idx + 1)
            if idx < 0: break
        if idx >= 0 and nth == 0 or (idx >= 0 and nth > 0):
            fs[f] = t[:idx] + new + t[idx+len(old):]; return
    raise SystemExit("NF " + old)
# S7 s2 (first occurrence) / S17 s0 (second)
rep('"reposition", "dress", "feed", "weigh"', '"reposition", "rehydrate", "retrain", "rewrite"', 0)
rep('"reposition", "dress", "feed", "weigh"', '"reposition", "recharge", "refill", "rehearse"', 0)
rep('"lower", "clean", "weigh", "label"', '"lower", "clean", "weigh", "carry"')
rep('"setting", "battery", "cable", "label"', '"setting", "battery", "cable", "wire"')
rep('"pull", "count", "wash", "label"', '"pull", "count", "wash", "tape"')
rep('"confirm", "print", "copy", "file"', '"confirm", "print", "sort", "file"')
rep('"tailor", "print", "copy", "share"', '"tailor", "print", "share", "post"')
rep('"chart", "print", "scan", "copy"', '"chart", "print", "scan", "mail"')
rep('"force", "hide", "label", "copy"', '"force", "hide", "label", "swap"')
rep('"count", "copy", "move", "weigh"', '"count", "wrap", "move", "weigh"')
rep('"read", "fold", "copy", "mail"', '"read", "fold", "tape", "mail"')
rep('"prevent", "cause", "repeat", "copy"', '"prevent", "cause", "repeat", "measure"')
rep('"notify", "thank", "greet", "copy"', '"notify", "thank", "greet", "visit"')
rep('"document", "count", "copy", "print"', '"document", "count", "copy", "sort"')
rep('"file", "print", "copy", "scan"', '"file", "mail", "scan", "sort"')
rep('"run", "print", "fold", "lose"', '"run", "post", "fold", "lose"')
rep('"labs", "meals", "bills", "visitors"', '"labs", "meals", "bills", "fees"')
rep('"infusions", "snacks", "visitors", "chores"', '"infusions", "snacks", "tools", "chores"')
rep('"medications", "visitors", "shifts", "rooms"', '"medications", "staff", "shifts", "rooms"')
rep('"pressors", "vitamins", "snacks", "linens"', '"pressors", "vitamins", "gowns", "linens"')
rep('"battery", "coffee", "snacks", "paper"', '"battery", "coffee", "water", "paper"')
# W17
rep('"circulation", "vision", "hearing", "weight"', '"circulation", "orientation", "digestion", "vaccination"')
rep('"careless", "rude", "lazy", "rare"', '"careless", "expensive", "impressive", "intensive"')
rep('"potassium", "soap", "sugar", "water"', '"potassium", "shampoo", "perfume", "mouthwash"')
for f, t in fs.items(): open(f, "w", encoding="utf-8").write(t)
print("ok")
