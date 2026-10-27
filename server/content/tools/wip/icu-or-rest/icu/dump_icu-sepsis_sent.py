import yaml,sys
d=yaml.safe_load(open('icu-sepsis.pre-fix.yaml',encoding='utf-8'))
for si,s in enumerate(d['situations']):
    print(f"## S{si} {s['title']}")
    for i,x in enumerate(s['sentences']):
        print(f"{si}.{i} EN: {x['en']}\n   KO: {x['ko']}\n   CH: {x['chunks']} W:{x['words']} tag:{x['tag']} icon:{x['icon']}\n   WHY: {x['why']}\n   DECOY: {x['decoy']} DK: {x['distractorsKo']}\n   BL: {x['blank']['answer']} {[o['en'] for o in x['blank']['options']]}")
    o=s['order']
    print('  ORDER',o['ko'],'|',o['why'])
    for l in o['lines']: print('    ',l)
