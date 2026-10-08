from _ctx_common_b import run
run("er-arrhythmia", {
 "electrode": {"why": "electrode·telemetry는 의료진끼리의 말이에요. 환자에게는 electrodes가 몸에 붙이는 stickers라고 풀어 주어야 하고, 설명 없이 쓰면 무슨 일인지 몰라 불안해해요.",
   "scenes": {0: {"en": "These electrodes are just stickers that read your heart's rhythm — they don't hurt."},
              1: {"en": "Electrodes are on, and she's on the monitor in sinus."}}},
 "OTC": {"why": "OTC와 sympathomimetic(교감신경 흥분제)은 의료진 말이에요. 환자에게는 OTC가 감기약·다이어트 약 같은 것이라고 풀어 주어야 답할 수 있어요.",
   "scenes": {0: {"en": "Any OTC medicine — like cold pills, diet pills, or supplements?"}}},
 "anticoagulated": {"why": "anticoagulated는 의료진 말이에요. 환자에게는 blood thinner라고 풀어 주고 warfarin 같은 약 이름을 예로 들면 더 잘 답해요.",
   "scenes": {0: {"en": "Are you anticoagulated — on a blood thinner like warfarin?"}}},
 "syncopal": {"why": "syncopal은 의료진 말이에요. 환자에게는 pass out·black out처럼 일상어로 풀어 주어야 무엇을 묻는지 알아들어요.",
   "scenes": {0: {"en": "Any syncopal episodes — did you actually pass out, or just feel close to it?"}}},
 "interrogation": {"why": "interrogation은 장치 점검을 뜻하는 의료진 용어인데, 설명 없이 환자에게 쓰면 '심문'처럼 들려요. '그냥 점검'이라고 풀어 주면 괜찮아요.",
   "scenes": {0: {"en": "A device interrogation is just a quick check — when was yours last done?"}}},
 "flag": {"why": "flag는 의료진끼리 흔히 쓰는 말이에요. 하지만 환자 자신을 contraindication risk(금기 위험)처럼 부르면 차갑게 들려요. 환자에게는 무엇을 왜 알리는지 쉬운 말로 해요.",
   "scenes": {0: {"en": "Flag bed 4 — WPW, so no AV nodal blockers."},
              1: {"en": "I'm flagging your WPW right away so the whole team knows."}}},
})
