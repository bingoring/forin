import yaml, importlib.util
T="icu-glycemic"
spec=importlib.util.spec_from_file_location("d","data_icu-glycemic_B.py"); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
base=yaml.safe_load(open(f"base-{T}.yaml",encoding="utf-8"))
assert len(base["situations"])==len(m.D)
for i,sit in enumerate(base["situations"]):
    d=m.D[i]; assert len(d["s"])==len(sit["sentences"]),i
    for x,r in zip(sit["sentences"],d["s"]):
        tag,icon,why,decoy,d1,d2,ans,w1,w2,w3=r
        x["tag"]=tag;x["icon"]=icon;x["why"]=why;x["decoy"]=decoy
        x["distractorsKo"]=[d1,d2]
        x["blank"]={"answer":ans,"options":[{"en":o} for o in (ans,w1,w2,w3)]}
    o=d["order"]; assert len(o["lines"])==4
    sit["order"]={"tag":"대화 흐름","icon":"compass","ko":o["ko"],"why":o["why"],
      "lines":[{"en":l[0],"icon":l[1],"ko":l[2],"note":l[3]} for l in o["lines"]]}
import importlib.util as iu
sp=iu.spec_from_file_location("f","fix_icu-glycemic_B.py"); f=iu.module_from_spec(sp); sp.loader.exec_module(f)
for (i,j),(a,b) in f.KO.items():
    x=base["situations"][i]["sentences"][j]
    if a: x["distractorsKo"][0]=a
    if b: x["distractorsKo"][1]=b
for (i,j,old),new in f.BL.items():
    x=base["situations"][i]["sentences"][j]
    for o in x["blank"]["options"]:
        if o["en"]==old: o["en"]=new
# unique decoys
import itertools,re
loc=["at the sink","in the lobby","near the exit","by the stairs","in the kitchen","at the front desk","on the shelf","in the garden","near the elevator","at the nurses' station","in the waiting room","by the door","on the tray","in the cabinet","near the window sill","at the supply room","in the basement","on the balcony","by the vending machine","in the cafeteria","at the parking lot","near the gift shop","in the chapel","on the cart","at the registration desk","in the locker room","by the fountain","near the restroom","in the storage closet","on the wall chart","at the entrance","in the pharmacy line","by the coat rack","near the printer","on the second floor","in the laundry room","at the bus stop","on the sofa","in the office","by the clock","near the sink","on the table","in the closet","at the corner","in the elevator","near the bench","by the plant","on the windowsill","in the break room","at the counter","near the vending area","in the courtyard","on the first floor","by the railing","at the reception","in the library","near the stairwell","on the roof","by the gate","in the garage","at the kiosk","near the lockers","in the hallway corner","on the bookshelf","by the mailbox","at the café","in the reading room","near the fountain","on the porch","in the lounge","by the exit sign","at the dock","near the pillar","on the sidewalk","in the atrium","by the staircase","at the playground","near the mirror","on the stool","in the foyer","by the stove","at the bakery","near the carpet","on the ladder","in the studio","by the lamp","at the market","near the curtain rack","on the bench","in the shed","by the pond","at the station","near the counter","on the ramp","in the hall closet","by the faucet","at the ticket booth","near the clock tower","on the pier","in the lobby corner","by the wardrobe","at the garden gate","near the shelf","on the step","in the fridge","by the radiator","at the gym","near the bus stop","on the hill","in the van","by the river","at the airport","near the harbor","on the bridge","in the canyon","by the lake"]
used=set(); k=0
allen=" ".join(x["en"].lower() for s_ in base["situations"] for x in s_["sentences"])
for s_ in base["situations"]:
    for x in s_["sentences"]:
        while True:
            c=loc[k]; k+=1
            if c not in used and c not in x["en"].lower() and c not in [ch.lower() for ch in x["chunks"]]:
                used.add(c); x["decoy"]=c; break
with open(f"{T}.B.yaml","w",encoding="utf-8") as f:
    yaml.safe_dump(base,f,allow_unicode=True,sort_keys=False,width=1000)
print("wrote")
