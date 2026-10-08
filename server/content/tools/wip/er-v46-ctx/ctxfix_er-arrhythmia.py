from _ctxfix_common_b import runfix
runfix("er-arrhythmia", {
 "OTC": {"why": "sympathomimetic(교감신경 흥분제)은 의료진 말이에요. OTC는 환자도 아는 말이지만, 감기약·다이어트 약처럼 구체적인 예를 들어야 빠짐없이 답해요."},
 "syncopal": {"word": "episode", "ko": "(증상이 있었던) 한 번",
   "scenes": {0: {"en": "Have you had any episodes where you actually passed out, or just felt close to it?"}},
   "why": "syncopal은 의료진 말이에요. 환자에게는 pass out·black out처럼 일상어로 물어야 무엇을 묻는지 알아들어요."},
 "mag": {"scenes": {2: {"fix": "This is magnesium — it helps keep your heartbeat steady."}}},
})
