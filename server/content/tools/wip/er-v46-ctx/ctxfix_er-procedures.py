from _ctxfix_common_b import runfix
runfix("er-procedures", {
 "start": {"why": "20-gauge·PIV 같은 규격과 약어는 의료진 말이에요. 환자에게는 put in an IV처럼 쉬운 말로 해요.",
           "scenes": {2: {"en": "I'm going to start a 20-gauge PIV in your left forearm now."}}},
 "labs": {"why": "workup은 의료진끼리의 말이에요. labs는 환자도 듣는 말이지만, 무엇을 알아보려는 검사인지까지 쉬운 말로 해요.",
          "scenes": {2: {"en": "We're sending labs for your abdominal pain workup."}}},
 "brave": {"word": "well", "ko": "잘 (해내다)",
           "scenes": {0: {"en": "All done! You did so well!"},
                      1: {"en": "Pt tolerated venipuncture well."},
                      2: {"en": "You tolerated the venipuncture well.",
                          "fix": "You were so brave — you held really still for me!"}}},
 "contamination": {"why": "contamination·skin flora는 의료진 말이에요. 환자에게는 '피부 세균이 섞였을 수 있다'고 풀고, 왜 다시 하는지도 함께 말해요."},
 "NGT": {"word": "placement", "ko": "(관의) 위치",
         "scenes": {0: {"en": "The NG is in — can we get an X-ray to confirm placement?"}}},
 "monitor": {"scenes": {1: {"en": "Cardiac monitor in place throughout CVC insertion; no sustained ectopy."}}},
 "epinephrine": {"word": "epi", "ko": "에피(네프린)",
                 "scenes": {0: {"en": "Epi 0.5 IM given, lateral thigh, at 14:02."}}},
 "IO": {"why": "IO·proximal tibia는 의료진 말이에요. 위급한 환자에게는 어디에, 왜 하는지만 짧게 말해요."},
})
