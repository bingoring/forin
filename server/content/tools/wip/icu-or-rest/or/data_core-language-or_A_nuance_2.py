N = {}

N["가족 통역 한계 인지"] = [
 {"kind": "slider", "words": ["w-professional", "w-medical", "w-word"],
  "cue": "A patient's 12-year-old daughter says, \"I can interpret for my mom.\" How much of the medical talk should she handle?",
  "scale": ["Greetings, small talk, and simple questions", "Simple medical questions, but not consent", "None — professionals handle medical talk"],
  "answerAt": 2,
  "why": "미국 병원은 가족, 특히 아이에게 의료 통역을 맡기지 않아요. 아이가 의학 용어를 몰라 틀릴 수 있고, 어머니의 민감한 이야기를 아이가 옮기게 되는 부담도 있어요. 의료 내용은 자격 있는 통역사가 맡아요.",
  "example": "For medical consent, we need a professional interpreter.", "exKo": "의료 동의를 위해서는 전문 통역사가 필요해요."},
 {"kind": "context", "words": ["w-trust"], "word": "trust", "ko": "신뢰",
  "scenes": [
   {"who": "간호사 → 환자", "icon": "me", "en": "This isn't about trust in your daughter — it's about having a trained interpreter.", "ok": True},
   {"who": "간호사 → 통역사", "icon": "speech", "en": "We trust you to say exactly what the surgeon says, nothing added or left out.", "ok": True},
   {"who": "간호사 → 딸", "icon": "me", "en": "We don't trust a kid to interpret, so go sit in the waiting room.", "ok": False,
    "fix": "This isn't about trust — we just use a trained interpreter, and you're welcome to stay."}],
  "why": "뜻은 셋 다 '신뢰'예요. 환자에게는 믿음의 문제가 아니라고 달래고, 통역사에게는 있는 그대로 옮겨 달라고 말해요. 하지만 아이에게 '못 믿는다, 나가라'고 하면 상처를 주고, 곁에서 힘이 되어 줄 가족까지 내쫓게 돼요."},
 {"kind": "swap", "words": ["w-professional", "w-daughter", "w-welcome", "w-stay"],
  "who": "간호사 → 환자 · 딸이 통역하겠다고 할 때", "icon": "me",
  "before": ["", "Your daughter can't interpret.", ""],
  "options": ["Your daughter can't interpret.", "For medical talk we use a professional interpreter, and your daughter is welcome to stay.", "Kids aren't allowed to interpret here, sorry."],
  "answer": "For medical talk we use a professional interpreter, and your daughter is welcome to stay.",
  "notes": {"Your daughter can't interpret.": "딸의 능력을 깎아내리는 말처럼 들려서 어머니와 딸이 모두 서운해해요.",
            "For medical talk we use a professional interpreter, and your daughter is welcome to stay.": "이유(의료 통역은 전문 통역사)를 말하고, 딸은 곁에 있어도 된다고 알려 관계를 지켜요.",
            "Kids aren't allowed to interpret here, sorry.": "규정 탓으로 돌려 사과는 하지만, 딸이 왜 안 되는지 이유가 빠져 있어요."},
  "why": "가족 통역을 사양할 때는 가족의 능력이 아니라 전문 통역사의 역할을 이유로 들고, 가족은 곁에 있어도 된다고 알려요.",
  "ko": "의료 이야기는 전문 통역사가 맡고, 따님은 곁에 계셔도 좋아요."},
]

N["전화·영상 통역 활용"] = [
 {"kind": "slider", "words": ["w-clearly", "w-hear", "w-loud"],
  "cue": "The patient says through the video interpreter, \"I hear her fine, just a little low sometimes.\" How do you report the audio?",
  "scale": ["Audio is a bit low", "Audio keeps cutting out", "There is no audio at all"],
  "answerAt": 0,
  "why": "환자가 '잘 들리지만 가끔 조금 작다'고 했으니 가장 약한 표현이 맞아요. 소리가 끊긴다거나 아예 안 들린다고 보고하면 서비스가 장비를 교체하러 시간을 쓰고, 그동안 소통이 늦어져요.",
  "example": "You'll hear the interpreter clearly on this device.", "exKo": "이 기기로 통역사 목소리가 또렷하게 들리실 거예요."},
 {"kind": "context", "words": ["w-device"], "word": "device", "ko": "기기",
  "scenes": [
   {"who": "간호사 → 통역사", "icon": "speech", "en": "I'll hold this device close to him, so please tell me if you can't see his face.", "ok": True},
   {"who": "간호사 → 서비스 데스크", "icon": "speech", "en": "The device in Pre-Op 1 has no audio, so please send another one.", "ok": True},
   {"who": "간호사 → 고령 환자", "icon": "me", "en": "Depress the primary actuator on the device to transmit your audio stream.", "ok": False,
    "fix": "Press the big green button on this device, and the interpreter will hear you."}],
  "why": "뜻은 셋 다 '기기'예요. 통역사에게는 화면 상태를 알려 달라고, 서비스 데스크에는 문제를 짧고 정확히 말해요. 하지만 환자에게 'actuator'나 'audio stream' 같은 기술 용어를 쓰면 무엇을 눌러야 하는지 알 수 없어요."},
]

N["동의 이해 재확인"] = [
 {"kind": "slider", "words": ["w-part", "w-unclear", "w-again"],
  "cue": "The patient says, \"The whole thing made sense, but the part about blood loss was confusing.\" What do you arrange?",
  "scale": ["Go over only the unclear part again", "Go over the whole consent form again", "Call off the procedure for now"],
  "answerAt": 0,
  "why": "헷갈린다고 한 대목만 시술자가 통역을 통해 다시 설명하게 해요. 전부 다시 하거나 수술을 취소할 일이 아니고, 간호사는 시술자에게 알려 설명이 이어지게 도와요.",
  "example": "Let's go over the part that's unclear again.", "exKo": "불명확한 부분을 다시 짚어 볼게요."},
 {"kind": "context", "words": ["w-informed"], "word": "informed", "ko": "충분히 설명 들은",
  "scenes": [
   {"who": "차트 기록", "icon": "board", "en": "Informed consent: surgeon explained risks via interpreter; patient teach-back accurate.", "ok": True},
   {"who": "간호사 → 집도의", "icon": "speech", "en": "She says she isn't fully informed about the risks, so please go over them again.", "ok": True},
   {"who": "간호사 → 환자", "icon": "me", "en": "Your informed consent shall be deemed valid upon execution of your signature.", "ok": False,
    "fix": "I want to be sure you feel fully informed before you sign."}],
  "why": "뜻은 셋 다 '충분히 설명 들은'이에요. 차트에는 간결하게, 시술자에게는 부족한 부분을 그대로 전해요. 하지만 환자에게 법률 문장처럼 말하면 통역도 어렵고 서명을 압박하는 것처럼 들려요."},
]

N["문화적 표현 차이 조율"] = [
 {"kind": "slider", "words": ["w-cultural", "w-preference", "w-respect"],
  "cue": "A patient says quietly, \"In my culture, we don't talk about this in front of men.\" How do you handle the question?",
  "scale": ["Ask once, then drop the subject entirely", "Offer privacy or a same-gender interpreter", "Insist she answer right now, in front of everyone"],
  "answerAt": 1,
  "why": "문화적 이유를 존중하되 필요한 정보는 얻어야 해요. 가능하면 사생활을 지키거나 같은 성별의 통역사를 권해요. 한 번 묻고 그만두면 안전 정보를 놓치고, 즉시 답하라고 다그치면 신뢰가 깨져요.",
  "example": "We respect your cultural preferences here.", "exKo": "여기서는 환자분의 문화적 선호를 존중해요."},
 {"kind": "context", "words": ["w-respect"], "word": "respect", "ko": "존중하다",
  "scenes": [
   {"who": "차트 기록", "icon": "board", "en": "Patient prefers a female provider; staff to respect preference where possible.", "ok": True},
   {"who": "간호사 → 통역사", "icon": "speech", "en": "Please respect her pace, and interpret exactly what she says.", "ok": True},
   {"who": "간호사 → 환자", "icon": "faceWorried", "en": "We kinda respect your culture thing, but we gotta ask anyway.", "ok": False,
    "fix": "We respect your culture, and we'll ask only what we need, as gently as we can."}],
  "why": "뜻은 셋 다 '존중하다'예요. 차트에는 선호를 기록하고, 통역사에게는 환자의 속도를 지켜 달라고 말해요. 하지만 '그 문화 어쩌고'라며 가볍게 말하면 존중이 아니라 무시로 들려요."},
 {"kind": "swap", "words": ["w-share", "w-comfortable", "w-difficult"],
  "who": "간호사 → 환자 · 민감한 질문", "icon": "me",
  "before": ["", "You must answer this.", ""],
  "options": ["You must answer this.", "Share what you're comfortable with, and I'll explain why we ask.", "Everyone answers this, so it isn't personal."],
  "answer": "Share what you're comfortable with, and I'll explain why we ask.",
  "notes": {"You must answer this.": "명령조라서 환자가 입을 닫아요.",
            "Share what you're comfortable with, and I'll explain why we ask.": "환자의 속도를 존중하면서 왜 묻는지 숨기지 않고 알려요.",
            "Everyone answers this, so it isn't personal.": "문화적인 거북함을 가볍게 넘기는 말이라 환자가 이해받지 못한다고 느껴요."},
  "why": "민감한 질문은 환자가 편한 만큼 말하게 하되, 왜 묻는지 이유를 알려요. 안전에 필요한 정보라는 점은 숨기지 않아요.",
  "ko": "편하신 만큼만 말씀해 주세요, 왜 여쭙는지는 제가 설명할게요."},
]

N["진정 후 비언어 소통"] = [
 {"kind": "slider", "words": ["w-pain", "w-discomfort", "w-face"],
  "cue": "A postop patient can't speak yet. He grimaces, groans, and grips the rail hard every time you touch the dressing.",
  "scale": ["No signs of pain", "Signs of mild discomfort", "Signs of severe pain"],
  "answerAt": 2,
  "why": "찡그림·신음·세게 움켜쥠은 말 대신 통증을 알리는 신호예요. 환자가 말하지 못해도 관찰한 대로 기록하고, 오더에 따라 통증 조절을 이어 가요.",
  "example": "I'm watching your face for any discomfort.", "exKo": "혹시 불편한 게 있는지 얼굴을 계속 살피고 있어요."},
 {"kind": "context", "words": ["w-point"], "word": "point", "ko": "가리키다",
  "scenes": [
   {"who": "간호사 → 동료", "icon": "speech", "en": "If he can't speak yet, ask him to point to where it hurts.", "ok": True},
   {"who": "차트 기록", "icon": "board", "en": "Patient points to right shoulder when asked about pain.", "ok": True},
   {"who": "간호사 → 막 깬 환자", "icon": "faceWorried", "en": "Indicate the anatomical site of discomfort by pointing with your dominant digit.", "ok": False,
    "fix": "Point to where it hurts, and I'll check right away."}],
  "why": "뜻은 셋 다 '가리키다'예요. 동료에게는 한마디로, 차트에는 짧게 적어요. 하지만 이제 막 깬 환자에게 어려운 문장으로 요구하면 알아듣지 못해요."},
]
