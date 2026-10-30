import yaml, sys
sys.path.insert(0,'.')
import importlib.util
def load(n):
    sp=importlib.util.spec_from_file_location(n,n+'.py'); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m); return m
V=load('_reviewB_core-safety-icu_vals'); RS=load('_reviewB_core-safety-icu_reasons')
d=yaml.safe_load(open('core-safety-icu.yaml')); S=d['situations']
BR={(1,2):"TABLET — 태블릿 기분 전환은 실제 억제대 대안이라 정답 둘",
 (2,2):"AFTER(주입 뒤 서명)가 하면 안 되는 시점을 보임 — 빈칸을 runs로 옮김",
 (2,3):"숫자(fifty) 자리는 문장에서 추론 불가 — 넷 다 성립. label로 옮김",
 (2,5):"약 이름(insulin) 자리는 추론 불가 — heparin·vasopressin·oxytocin 모두 단위 처방 성립. units로 옮김",
 (3,3):"FEEDING은 '투약용 아님(정맥)'으로 읽혀 정답 둘, MIDLINE은 'midline line' 중복",
 (3,4):"SYRINGE — 'push the wrong syringe into the wrong line'도 자연스러움(정답 둘)",
 (7,0):"ORIENTATION — 억제대 감시 항목에 정신 상태가 실제로 들어감(정답 둘)",
 (7,2):"REHYDRATE — 해제 때 수분 제공은 실제 해제 간호(정답 둘)",
 (8,5):"a EXPENSIVE/IMPRESSIVE/INTENSIVE — 관사로 걸러짐",
 (8,6):"SEARCH — 'so no one has to search'도 성립(정답 둘)",
 (9,2):"SHAMPOO/PERFUME/MOUTHWASH — 장면과 동떨어짐(파일럿 갈래 2). 같은 분야지만 침상 금지 대상 아닌 것으로",
 (11,4):"LABELED≈flagged(정답 둘)",
 (11,6):"TWICE — 'confirm twice'도 맞는 실천(정답 둘)",
 (14,5):"CHANGE — 'might change someone's life'도 긍정으로 성립",
 (15,0):"RECONNECT·FLUSH — 오연결 라인을 다시 잇거나 밀어 넣는 위험 처치를 선택지로 보임",
 (16,3):"약 이름(heparin) 자리는 추론 불가 — insulin·morphine·potassium 10배도 성립. ordered로 옮김",
 (17,5):"JUST/ONLY/STILL — 'stay just here'≈right here(정답 둘)",
 (18,1):"HELIUM — heliox는 실제 치료라 어색한 근접 정답",
 (18,3):"sat 자리는 추론 불가 — heart/temp 알람도 성립. sounding으로 옮김",
 (19,3):"LOUD — 전원이 나가면 펌프가 실제로 경보를 울림(정답 둘)",
 (20,5):"RETURN — 'we return to the facts'도 같은 뜻",
}
DR={(0,2):"반대말 decoy(based on↔away from)",(2,0):"together 자리에 들어가 '혼자 장갑 끼고 확인'이 됨(이중확인 빠뜨림)",
 (2,4):"'stop and wash up together before we give it' — 확인을 손 씻기로 바꾼 맞는 문장",(2,5):"읽어 주기에서 용량을 지운 맞는 문장",
 (2,6):"'borrow a pen before we sign' — 되짚어 듣기를 지운 맞는 문장",(3,0):"lunch 몰림(15회) 줄이기",
 (4,5):"'someone needs clean the floor' — 어느 청크 자리에도 안 맞음 + 알람 응답 대체",(4,6):"어느 청크 자리에도 안 맞음",
 (5,3):"IV 자리에 들어가 경로 없는 복창이 됨",(5,4):"조각 모양(out the window:)이 어느 자리에도 안 맞음",
 (5,5):"손목밴드 자리에 들어가 '식판을 처방과 대조'(식이 처방)로 성립 — 환자 식별 빠뜨림",(7,3):"lunch 몰림",
 (7,6):"문장 첫 청크 자리인데 소문자 — 모양으로 걸러짐",(8,0):"back to 없이 its owner — 어느 자리에도 안 맞음",
 (9,4):"and 없는 동사구 — 자리에 안 맞음",(10,0):"and keep 없이 — 자리에 안 맞음",(11,4):"어느 청크 자리에도 안 맞음",
 (11,6):"menu 몰림",(12,1):"without prompting 자리에 들어가 독립성 조건을 지움",(13,3):"lunch 몰림",
 (15,0):"자리에 안 맞음(위기 문장)",(15,1):"자리에 안 맞음(위기 문장)",(15,2):"자리에 안 맞음",
 (15,4):"'paperwork first' — 위기에서 서류를 먼저 하라는 맞는 문장",(16,1):"lunch 몰림",(16,2):"lunch 몰림",
 (17,0):"자리에 안 맞음(위기 문장)",(17,1):"자리에 안 맞음(위기 문장)",(17,5):"'someone else, bring a chair' — 도움 요청을 지운 맞는 문장",
 (18,2):"lunch 몰림",(18,3):"lunch 몰림",(18,5):"lunch 몰림",(19,2):"'freshly labeled infusions first' — 위기 우선순위 기준을 틀리게 하는 맞는 문장",
 (20,1):"lunch 몰림",(20,2):"lunch 몰림",(20,6):"lunch 몰림"}
out=[]
out.append("### 고칠 것 A — `distractorsKo` (두 값을 그대로 덮어쓰기. 통과한 쪽도 함께 적음)\n")
for (i,k),v in sorted(V.DK.items()):
    t=S[i]['sentences'][k]
    out.append(f"- **[{i}]s{k}** {S[i]['title']} — `{t['en']}` / 정답 \"{t['ko']}\"\n  - 지금: \"{t['distractorsKo'][0]}\" · \"{t['distractorsKo'][1]}\"\n  - 판정: {RS.R[(i,k)]}\n  - 고칠 값: \"{v[0]}\" · \"{v[1]}\"")
out.append("\n### 고칠 것 B — `blank`\n")
for (i,k),(a,o) in sorted(V.BLANK.items()):
    t=S[i]['sentences'][k]; b=t['blank']
    out.append(f"- **[{i}]s{k}** `{t['en']}` — 지금 answer={b['answer']} [{', '.join(x['en'] for x in b['options'])}] · {BR[(i,k)]} → answer={a} [{', '.join(o)}]")
out.append("\n### 고칠 것 C — `decoy`\n")
for (i,k),v in sorted(V.DECOY.items()):
    t=S[i]['sentences'][k]
    out.append(f"- **[{i}]s{k}** «{t['decoy']}» ({' / '.join(t['chunks'])}) · {DR[(i,k)]} → «{v}»")
out.append("\n### 고칠 것 D — `tag`·`why`\n")
for (i,k),v in sorted(V.TAG.items()):
    out.append(f"- **[{i}]s{k}** tag \"{S[i]['sentences'][k]['tag']}\" — 영어 약어 태그(파일럿 갈래 5) → \"{v}\"")
for (i,k),v in sorted(V.WHY.items()):
    out.append(f"- **[{i}]s{k}** why — \"can't stop은 멈추면 안 된다가 아니라 멈출 수 없다\"는 설명이 뜻을 거꾸로 흐림 → \"{v}\"")
out.append("\n### 고칠 것 E — `order`\n")
OR={4:"3줄 16단어(15 넘음)",7:"3↔4 교환이 자연스러움 — 'That way'가 2줄(해제 일정) 뒤에도 그대로 붙음",8:"3줄 17단어",10:"4줄 18단어",11:"3줄 20단어",13:"4줄 20단어",15:"3줄 17단어",
 18:"1↔2 교환이 더 자연스러움 — 급변 순간에 '앞서 알람이 울렸다'는 경위를 먼저 말하는 순서(위기에선 주목·대응이 먼저). 경위 줄을 빼고 원인은 안정 뒤로",
 19:"3줄 'On that backup … by hand'가 앞뒤가 안 맞음(백업으로 펌프가 돌면 손 조절이 필요 없음)",20:"2↔3 교환이 자연스러움 — 'In that conversation'과 'In it'이 같은 앞말을 가리킴. 4줄 16단어"}
for i in sorted(OR):
    out.append(f"- **[{i}] {S[i]['title']}** · {OR[i]}")
    for (j,n),v in sorted(V.ORDER.items()):
        if j==i:
            old=S[i]['order']['lines'][n]
            out.append(f"  - {n+1}줄 \"{old['en']}\" → " + ", ".join(f"{kk}: \"{vv}\"" for kk,vv in v.items()))
    if i in V.ORDER_WHY: out.append(f"  - why → \"{V.ORDER_WHY[i]}\"")
open('_reviewB_core-safety-icu_body.md','w').write('\n'.join(out)+'\n')
print(len(V.DK),len(V.BLANK),len(V.DECOY),len(V.TAG)+len(V.WHY),len(OR))
