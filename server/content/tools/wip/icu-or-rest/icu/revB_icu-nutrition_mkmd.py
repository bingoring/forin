import yaml,sys,collections
sys.path.insert(0,'.')
from revB_icu_nutrition_vals import KO,BLANK,DECOY,ORDER,ICON,WHY
d=yaml.safe_load(open('icu-nutrition.yaml'))
S=lambda k:d['situations'][int(k.split('.')[0])]['sentences'][int(k.split('.')[1])]
key=lambda k:tuple(map(int,k.split('.')))
out=[]
c=collections.Counter(v[2] for v in KO.values())
out.append(f"## A. distractorsKo 새 값 ({len(KO)}문장 — 안전 {c['S']} · 정답 둘 {c['D']} · 길이 {c['L']})\n")
out.append("| 문장 | 분류 | 문제 | 지금 X1 / X2 | 새 X1 / X2 (— = 그대로) |\n|---|---|---|---|---|")
lab={'S':'**안전**','D':'정답 둘','L':'길이'}
for k in sorted(KO,key=key):
    a,b,cat,r=KO[k]; x=S(k)
    out.append(f"| {k} | {lab[cat]} | {r} | {x['distractorsKo'][0]} / {x['distractorsKo'][1]} | {a or '—'} / {b or '—'} |")
out.append(f"\n## B. 빈칸 새 선택지 ({len(BLANK)}문장)\n")
out.append("| 문장 | 문제 | 지금 answer / 선택지 | 새 answer / 선택지 |\n|---|---|---|---|")
for k in sorted(BLANK,key=key):
    a,opts,r=BLANK[k]; x=S(k); b=x['blank']
    out.append(f"| {k} | {r} | {b['answer']} / {', '.join(o['en'] for o in b['options'])} | {a or b['answer']} / {', '.join(opts)} |")
c=collections.Counter(v[1] for v in DECOY.values())
out.append(f"\n## C. decoy 새 값 ({len(DECOY)}개 — 조립하면 안전 문제 {c['S']} · 반대말 {c['O']} · 어느 청크 자리에도 안 맞음 {c['X']} · 되풀이 {c['R']})\n")
out.append("| 문장 | 분류 | 지금 | 새 값 | 문제 |\n|---|---|---|---|---|")
labd={'S':'**안전**','O':'반대말','X':'자리 없음','R':'되풀이'}
for k in sorted(DECOY,key=key):
    nv,cat,r=DECOY[k]; out.append(f"| {k} | {labd[cat]} | {S(k)['decoy']} | {nv} | {r} |")
out.append(f"\n## D. order 새 줄 ({len(ORDER)}줄, {len(set(o[0] for o in ORDER))}장)\n")
out.append("| 카드·줄 | 지금 en | 새 en / ko | 문제 |\n|---|---|---|---|")
for si,li,en,ko,r in ORDER:
    old=d['situations'][si]['order']['lines'][li-1]['en']
    out.append(f"| S{si}.L{li} | {old} | {en} / {ko} | {r} |")
out.append(f"\n## E. 아이콘 ({len(ICON)}곳)\n")
out.append("| 곳 | 지금 → 새 | 이유 |\n|---|---|---|")
for k,(o,nw,r) in ICON.items(): out.append(f"| {k} | {o} → {nw} | {r} |")
out.append(f"\n## F. why 새 값 ({len(WHY)}문장)\n")
out.append("| 문장 | 지금 | 새 값 |\n|---|---|---|")
for k in sorted(WHY,key=key): out.append(f"| {k} | {S(k)['why']} | {WHY[k]} |")
open('revB_icu-nutrition_tables.md','w').write('\n'.join(out)+'\n')
print(len(KO),dict(collections.Counter(v[2] for v in KO.values())),len(BLANK),len(DECOY),dict(c),len(ORDER),len(ICON),len(WHY))
