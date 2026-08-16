// Package phonemetips maps a phoneme to Korean coaching a nurse can act on.
// Without a tip a correction point would render an empty card, so
// business-rules R5 skips phonemes that are missing here.
//
// # Notation (read this before adding a key)
//
// The whole package is worthless if its keys do not match what the scorer
// actually returns, and a mismatch is silent: Lookup simply never hits, R5
// skips every phoneme, and the correction-point section stays empty forever
// without a single error anywhere. Two facts pin the notation down:
//
//  1. Azure Pronunciation Assessment returns SAPI phonemes by default.
//     "To request IPA phonemes, set the phoneme alphabet to IPA. If you don't
//     specify the alphabet, the phonemes are in SAPI format by default."
//     — learn.microsoft.com/azure/ai-services/speech-service/how-to-pronunciation-assessment
//     azurespeech.Client therefore sends PhonemeAlphabet:"IPA" explicitly.
//
//  2. Azure's en-US IPA is *not* dictionary IPA. Per the en-US `ipa` column of
//     learn.microsoft.com/azure/ai-services/speech-service/speech-ssml-phonetic-sets
//     the vowel of "eat" is i (not iː), of "boost" is u (not uː), and the
//     consonant of "red" is ɹ (not r).
//
// Since IPA phoneme names are documented only for en-US, and any other locale
// (speech.voicesByLocale carries seven) falls back to SAPI or to no phoneme
// name at all, Lookup normalizes both alphabets onto one canonical key rather
// than trusting the request parameter to have been honored. Belt and braces:
// if the parameter is ever dropped, downgraded, or unsupported, the tips still
// attach instead of vanishing.
//
// Canonical keys are Azure's en-US IPA. Tip.IPA carries the dictionary-style
// spelling for display, because that is the form the SoT writes to learners
// ("/ɪ/는 짧고 느슨하게, /iː/는 길고 입꼬리를 당겨서").
package phonemetips

import "strings"

// Tip is the Korean coaching attached to one phoneme.
//
// IPA is the display spelling for the correction card (dictionary style, so
// /iː/ rather than Azure's /i/). Message is the coaching itself: an
// articulation cue plus what goes wrong on the ward. Example is a minimal pair
// or a field word to drill.
type Tip struct {
	IPA     string
	Message string
	Example string
}

// tips is keyed by canonical phoneme — Azure's en-US IPA (see package doc).
// Never key this map by a dictionary spelling; put those in aliases instead.
var tips = map[string]Tip{
	// ── 모음 ──────────────────────────────────────────────────────────
	"i": {
		IPA:     "iː",
		Message: "혀를 높이 올리고 입꼬리를 옆으로 당겨 길게 뽑아요. /ɪ/보다 확실히 길어야 해요. \"seat\"과 \"sit\"이 같아지면 앉히라는 건지 그냥 있으라는 건지 체위 지시가 뒤집혀요.",
		Example: "seat / sit",
	},
	"ɪ": {
		IPA:     "ɪ",
		Message: "\"이\"로 늘이지 말고 짧고 느슨하게 — 입을 옆으로 살짝만 벌려요. acetaminophen의 \"-min-\"을 길게 빼면 약 이름이 다른 단어로 들려요.",
		Example: "sit / seat",
	},
	"eɪ": {
		IPA:     "eɪ",
		Message: "\"에\"에서 멈추지 말고 입을 좁히며 \"에이\"로 미끄러뜨려요. \"eight\"을 \"et\"처럼 끊으면 용량 숫자를 매번 다시 물어보게 돼요.",
		Example: "eight, tape",
	},
	"ɛ": {
		IPA:     "ɛ",
		Message: "입을 반쯤만 벌리고 짧게 \"에\" — /æ/처럼 턱을 내려 넓히지 마세요. \"bed\"와 \"bad\"가 섞이면 침상 이야기인지 상태 이야기인지 흐려져요.",
		Example: "bed / bad",
	},
	"æ": {
		IPA:     "æ",
		Message: "턱을 아래로 더 내리고 \"애\"를 넓게 펴요 — \"에\"가 아니에요. \"rash\"가 \"resh\"처럼 좁아지면 발진 보고가 그대로 막혀요.",
		Example: "rash, ambulate",
	},
	"ɑ": {
		IPA:     "ɑ",
		Message: "턱을 크게 벌리고 혀를 낮춰 목 안쪽에서 \"아\"를 내요. 짧은 \"오\"로 바꾸면 \"drop\"이 \"drope\"처럼 들려 낙상·투약 지시가 어긋나요.",
		Example: "drop, body",
	},
	"ɔ": {
		IPA:     "ɔː",
		Message: "입술을 둥글게 모으되 \"오\"보다 턱을 더 내려 길게 냅니다. \"call\"이 \"coal\"처럼 들리면 콜벨을 누르라는 말이 전달되지 않아요.",
		Example: "call, walk",
	},
	"ʊ": {
		IPA:     "ʊ",
		Message: "힘을 빼고 아주 짧게 \"우\" — 입술을 세게 오므리지 마세요. \"foot\"과 \"food\"가 같아지면 부위 이야기인지 식사 이야기인지 헷갈려요.",
		Example: "foot / food",
	},
	"oʊ": {
		IPA:     "oʊ",
		Message: "\"오\"에서 끝내지 말고 입술을 좁히며 \"오우\"로 마무리해요. \"dose\"를 \"doss\"처럼 끊으면 용량 확인이 한 번 더 필요해져요.",
		Example: "dose, no",
	},
	"u": {
		IPA:     "uː",
		Message: "입술을 앞으로 동그랗게 내밀고 길게 \"우\"를 뽑아요. 짧으면 \"food\"가 \"foot\"이 되어 금식·식이 지시가 뒤집혀요.",
		Example: "food, soon",
	},
	"ʌ": {
		IPA:     "ʌ",
		Message: "입술을 둥글게 하지 말고 턱만 살짝 내려 짧게 \"어\"를 툭 던져요. \"blood\"를 \"블루드\"처럼 늘이면 채혈 이야기가 어색하게 들려요.",
		Example: "blood, cup",
	},
	"aɪ": {
		IPA:     "aɪ",
		Message: "턱을 벌려 \"아\"로 시작해 \"이\"로 미끄러뜨려요. \"five\"와 \"IV\"의 첫소리라, 뭉개면 숫자인지 라인 이름인지 안 들려요.",
		Example: "five, IV",
	},
	"aʊ": {
		IPA:     "aʊ",
		Message: "\"아\"로 벌렸다가 입술을 오므려 \"우\"로 닫아요. \"아\"에서 멈추면 \"down\"이 \"dawn\"처럼 들려 체위 방향이 흐려져요.",
		Example: "down, mouth",
	},
	"ɔɪ": {
		IPA:     "ɔɪ",
		Message: "입술을 둥글게 \"오\"로 시작해 옆으로 당기며 \"이\"로 끝내요. 하나로 뭉개면 \"point\"가 안 들려서 어디가 아픈지 짚어달라는 말이 통하지 않아요.",
		Example: "point, noise",
	},
	"ju": {
		IPA:     "juː",
		Message: "\"우\" 앞에 짧은 \"이\"를 붙여 \"유\"로 시작해요. \"unit\"을 \"우닛\"으로 읽으면 인슐린 단위가 그대로 안 통해요.",
		Example: "unit, few",
	},
	"ə": {
		IPA:     "ə",
		Message: "힘을 완전히 빼고 아주 짧게 흘려요 — 철자대로 또박또박 읽지 마세요. acetaminophen의 약한 음절까지 세게 읽으면 리듬이 깨져서 약 이름을 못 알아들어요.",
		Example: "acetaminophen, about",
	},
	"ɝ": {
		IPA:     "ɜːr",
		Message: "혀 가운데를 목 쪽으로 말아 올린 채 \"어\"를 끌어요 — \"오\"가 아니에요. r 색이 빠지면 \"nurse\"부터 안 들려서 자기소개가 막혀요.",
		Example: "nurse, first",
	},

	// ── 자음 ──────────────────────────────────────────────────────────
	"p": {
		IPA:     "p",
		Message: "입술을 붙였다 떼며 바람을 훅 터뜨려요. 한국어 \"ㅃ\"처럼 바람 없이 내면 b로 들려서 \"pain\"이 \"bane\"이 돼요.",
		Example: "pain, pill",
	},
	"b": {
		IPA:     "b",
		Message: "입술을 붙인 채 성대를 먼저 울리고 터뜨려요. 바람만 세면 p가 되어 \"back pain\"의 부위가 바뀌어 들려요.",
		Example: "back, bed",
	},
	"t": {
		IPA:     "t",
		Message: "혀끝을 윗잇몸에 붙였다 바람과 함께 떼요. 뒤에 \"으\"를 붙이지 마세요 — \"chart\"를 \"차트\"로 읽으면 음절이 늘어 다른 말처럼 들려요.",
		Example: "chart, take",
	},
	"d": {
		IPA:     "d",
		Message: "혀끝을 윗잇몸에 붙이고 성대를 울리며 떼요. 끝소리 d에 \"으\"를 붙이면 \"bed\"가 \"베드\"가 되어 두 음절로 들려요.",
		Example: "bed, need",
	},
	"k": {
		IPA:     "k",
		Message: "혀 뒤를 여린입천장에 붙였다 바람을 터뜨려요. 바람이 약하면 g로 들려서 \"code\"가 \"goad\"가 되고 응급 호출이 흐려져요.",
		Example: "code, cath",
	},
	"ɡ": {
		IPA:     "ɡ",
		Message: "혀 뒤를 여린입천장에 붙이고 성대를 울리며 떼요. k로 새면 \"gauze\"가 \"cause\"처럼 들려서 드레싱 요청이 안 통해요.",
		Example: "gauze, gown",
	},
	"m": {
		IPA:     "m",
		Message: "입술을 다물고 코로 소리를 내보내요. 끝소리 m을 흘리면 \"mg\"의 단위가 사라져 용량이 숫자만 남아요.",
		Example: "mg, arm",
	},
	"n": {
		IPA:     "n",
		Message: "혀끝을 윗잇몸에 붙인 채 코로 소리를 내요. 끝소리를 \"ㅇ\"으로 바꾸면 \"pain\"이 \"paying\"처럼 들려 통증 사정이 어긋나요.",
		Example: "pain, in",
	},
	"ŋ": {
		IPA:     "ŋ",
		Message: "혀 뒤를 올려 입을 막고 코로만 울려요 — 끝에 \"그\"를 붙이지 마세요. \"swelling\"이 \"스웰링그\"가 되면 부종 보고가 한 박자 늦어져요.",
		Example: "swelling, coughing",
	},
	"f": {
		IPA:     "f",
		Message: "윗니를 아랫입술에 살짝 대고 바람을 길게 내보내요 — \"ㅍ\"처럼 입술만 터뜨리면 안 돼요. \"fever\"가 \"pever\"가 되면 발열 보고가 통하지 않아요.",
		Example: "fever, fluid",
	},
	"v": {
		IPA:     "v",
		Message: "윗니를 아랫입술에 댄 채 성대를 울려요 — \"ㅂ\"가 아니에요. \"vein\"이 \"bane\"이 되면 정맥 확보 대화가 그대로 막혀요.",
		Example: "vein, IV",
	},
	"θ": {
		IPA:     "θ",
		Message: "혀끝을 윗니 사이로 살짝 내밀고 바람만 흘려요 — \"ㅅ\"가 아니에요. \"month\"가 \"먼스\"가 되면 복약 기간이 잘못 전달돼요.",
		Example: "mouth, month",
	},
	"ð": {
		IPA:     "ð",
		Message: "혀끝을 윗니 사이에 둔 채 성대를 울려요 — \"ㄷ\"가 아니에요. \"breathe\"가 \"브리드\"가 되면 심호흡 지시가 뭉개져요.",
		Example: "breathe, this",
	},
	"s": {
		IPA:     "s",
		Message: "혀끝을 윗잇몸 가까이 두고 가늘게 바람을 흘려요 — \"쉬\"로 새지 않게. \"saline\"이 \"shaline\"이 되면 수액 이름이 안 통해요.",
		Example: "saline, sit",
	},
	"z": {
		IPA:     "z",
		Message: "s와 같은 자리에서 성대를 울려요 — \"ㅈ\"가 아니에요. 복수형 \"meds\"·\"labs\"의 끝소리를 s로 흘리면 한 건인지 여러 건인지 사라져요.",
		Example: "meds, labs",
	},
	"ʃ": {
		IPA:     "ʃ",
		Message: "혀를 뒤로 조금 물리고 입술을 살짝 내밀어 \"쉬\"를 냅니다. \"she\"가 \"see\"가 되면 환자를 가리키는 말이 바뀌어요.",
		Example: "she, shot",
	},
	"ʒ": {
		IPA:     "ʒ",
		Message: "\"쉬\"와 같은 혀 자리에서 성대를 울려 아주 짧게 냅니다. \"measure\"의 가운데 소리라, 굳으면 계측 지시가 어색해져요.",
		Example: "measure, usual",
	},
	"h": {
		IPA:     "h",
		Message: "입은 뒤에 올 모음 모양으로 미리 벌려두고, 목을 조이지 말고 숨만 앞으로 내보내요. h를 빼면 \"heart\"가 \"art\"가 되어 심장 이야기가 통째로 사라져요.",
		Example: "heart, hand",
	},
	"tʃ": {
		IPA:     "tʃ",
		Message: "혀끝을 윗잇몸에 붙였다 \"쉬\"로 한 번에 터뜨려요. \"츠\"처럼 늘이면 \"chest\"가 두 음절이 되어 부위가 흐려져요.",
		Example: "chest, chart",
	},
	"dʒ": {
		IPA:     "dʒ",
		Message: "혀끝을 붙였다 성대를 울리며 \"지\"로 한 번에 터뜨려요. \"injection\"의 -jec-을 \"제\"로 뭉개면 주사 이야기가 안 들려요.",
		Example: "injection, gel",
	},
	"l": {
		IPA:     "l",
		Message: "혀끝을 윗잇몸에 붙인 채로 소리를 내고 나서 떼요. milligrams의 -li-를 흘리지 말고 짚어주세요 — 용량이 통째로 사라집니다.",
		Example: "milligrams, pill",
	},
	"ɹ": {
		IPA:     "r",
		Message: "혀끝을 어디에도 붙이지 말고 안쪽으로 살짝 말아요 — 한국어 \"ㄹ\"처럼 튕기면 l로 들려요. \"right\"과 \"light\"이 섞이면 좌우 지시가 뒤집혀요.",
		Example: "right / light",
	},
	"w": {
		IPA:     "w",
		Message: "입술을 동그랗게 모았다 펴면서 시작해요. w가 빠지면 \"wound\"가 \"oond\"처럼 뭉개져 상처 부위 이야기가 안 통해요.",
		Example: "wound, water",
	},
	"j": {
		IPA:     "j",
		Message: "혀 앞을 입천장 가까이 올렸다 빠르게 내려요. 이 소리를 빼면 \"years\"가 \"ears\"가 되어 병력 기간이 귀 이야기로 바뀌어요.",
		Example: "yes, year",
	},
}

// aliases maps every other spelling we might receive onto a canonical key.
//
// Three sources feed this: Azure's SAPI alphabet (the documented default, and
// what we fall back to on any locale that does not support IPA phoneme
// names), dictionary IPA as learners and the SoT write it, and a few
// Unicode near-twins. Entries whose spelling already equals the canonical key
// (s, z, f, l, …) are deliberately omitted — Lookup tries the canonical map
// first.
var aliases = map[string]string{
	// SAPI 모음 — speech-ssml-phonetic-sets, en-US `sapi` 열.
	"iy": "i", "ih": "ɪ", "ey": "eɪ", "eh": "ɛ", "ae": "æ", "aa": "ɑ",
	"ao": "ɔ", "uh": "ʊ", "ow": "oʊ", "uw": "u", "ah": "ʌ", "ay": "aɪ",
	"aw": "aʊ", "oy": "ɔɪ", "ax": "ə", "er": "ɝ",
	// SAPI 자음 — 나머지(p b t d k m n f v s z h l w)는 표기가 IPA와 같다.
	"g": "ɡ", "ng": "ŋ", "th": "θ", "dh": "ð", "sh": "ʃ", "zh": "ʒ",
	"ch": "tʃ", "jh": "dʒ", "r": "ɹ", "y": "j",

	// 사전식 IPA. 길이 기호(ː)는 normalize가 떼므로 iː·uː는 자동으로
	// i·u가 된다. 여기 남는 건 글자 자체가 다른 것들이다.
	"ɜ": "ɝ", "ɜr": "ɝ", "ɚ": "ɝ", "ɐ": "ʌ", "ɒ": "ɑ", "e": "ɛ",
	"əʊ": "oʊ", "ɵʊ": "oʊ", "ɾ": "ɹ", "ʀ": "ɹ", "ɫ": "l", "ɱ": "m",
	"ʧ": "tʃ", "ʤ": "dʒ", "ɹ̩": "ɹ", "ɡ̊": "ɡ",
}

// stripped are the decorations that carry no phoneme identity: slashes and
// brackets around a transcription, stress and length marks, syllable dots,
// and tie bars. Azure does not emit most of these, but the SoT and any
// hand-authored fixture do, and a stray "ˈ" would otherwise miss silently.
var stripped = strings.NewReplacer(
	"/", "", "[", "", "]", "", "ˈ", "", "ˌ", "", "ː", "", "ˑ", "",
	".", "", "‿", "", "͡", "", "​", "",
)

// normalize reduces any spelling of a phoneme to a canonical key. It returns
// "" when nothing usable is left, which Lookup reports as "no tip" so R5 can
// skip the phoneme rather than render a blank card.
func normalize(phoneme string) string {
	s := stripped.Replace(strings.TrimSpace(phoneme))
	s = strings.ToLower(strings.TrimSpace(s))
	// ARPAbet-style stress digits (ah1, iy0) ride along in some toolchains.
	s = strings.TrimRight(s, "0123456789")
	if s == "" {
		return ""
	}
	if _, ok := tips[s]; ok {
		return s
	}
	if canonical, ok := aliases[s]; ok {
		return canonical
	}
	return ""
}

// Lookup returns the Korean coaching for a phoneme in any of the spellings
// this package understands (Azure IPA, Azure SAPI, dictionary IPA).
//
// ok=false means "we have nothing to say about this phoneme". Per
// business-rules R5 the caller must skip it and move to the next-worst
// phoneme rather than render an empty correction card.
func Lookup(phoneme string) (Tip, bool) {
	key := normalize(phoneme)
	if key == "" {
		return Tip{}, false
	}
	t, ok := tips[key]
	return t, ok
}

// Canonical exposes the normalization on its own, for callers that want to
// group or de-duplicate phonemes without pulling the coaching text along.
// ok=false has the same meaning as in Lookup.
func Canonical(phoneme string) (string, bool) {
	key := normalize(phoneme)
	return key, key != ""
}

// All returns every tip keyed by canonical phoneme. The result is a fresh map
// each call, so a caller cannot mutate the package's own table.
func All() map[string]Tip {
	out := make(map[string]Tip, len(tips))
	for k, v := range tips {
		out[k] = v
	}
	return out
}
