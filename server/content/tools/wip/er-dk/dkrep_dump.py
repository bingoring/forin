import yaml,sys
import re
exec(open("dkrep.py").read().split("Q=")[0])
T={'alcohol-withdrawal':['감염'],'anaphylaxis':['보호자'],'arrest':['의사'],'arrhythmia':['혈압'],'bleeding-wound':['통증'],'chest-abd-trauma':['체온'],'diabetic':['혈압','체온'],'dyspnea':['맥박'],'environmental':['맥박'],'fever-infection':['통증'],'genitourinary':['소변'],'gi-bleed':['통증','소변'],'obgyn':['가족']}
for t,ws in T.items():
    d=yaml.safe_load(open(f'base-er-{t}.yaml'))
    for w in ws:
        print('=====',t,w)
        for si,s in enumerate(d['situations']):
            for xi,x in enumerate(s['sentences']):
                ck=toks(x['ko'])
                for k,o in enumerate(x['distractorsKo']):
                    if w in toks(o)-ck:
                        print(f"{si}.{xi}/{k} | {x['en']} | {x['ko']} | {x['distractorsKo'][0]} | {x['distractorsKo'][1]}")
