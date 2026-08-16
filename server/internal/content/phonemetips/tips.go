// Package phonemetips maps a phoneme to Korean coaching a nurse can act on.
// Without a tip a correction point would render an empty card, so
// business-rules R5 skips phonemes that are missing here.
//
// # Notation (read this before adding a key)
//
// The whole package is worthless if its keys do not match what the scorer
// actually returns, and a mismatch is silent: Lookup simply never hits, R5
// skips every phoneme, and the correction-point section stays empty forever
// without a single error anywhere. Three facts pin the notation down, all from
// Microsoft's own tables:
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
//  3. That table has a separate "R-colored vowels" section, and in IPA mode
//     those arrive as a SINGLE token: ɑɹ, ɔɹ, ɪɹ, ɛɹ, ʊɹ, aɪɹ, aʊɹ, ɝ, ɚ.
//     In SAPI mode the same sounds arrive as two tokens ("aa" + "r"), which
//     means a map that only knows plain ɑ and ɹ appears to work under SAPI and
//     silently goes blank the moment IPA is switched on — precisely backwards
//     from what you would guess. chart/arm (ɑɹ), morning (ɔɹ), hear (ɪɹ) and
//     care (ɛɹ) are ward vocabulary, so this is not a long tail.
//
// The canonical key set below is the complete 49-entry en-US IPA table.
//
// Since IPA phoneme names are documented only for en-US, and any other locale
// (speech.voicesByLocale carries seven) falls back to SAPI or to no phoneme
// name at all, Lookup normalizes both alphabets onto one canonical key rather
// than trusting the request parameter to have been honored. Belt and braces:
// if the parameter is ever dropped, downgraded, or unsupported, the tips still
// attach instead of vanishing.
package phonemetips

import "strings"

// Tip is the Korean coaching attached to one phoneme.
//
// Message and Detail exist because the SoT uses two different slots with two
// different copy lengths, and writing one string for both overflows the small
// one:
//
//   - Message fills the correction card (screen-pronunciation.jsx L199-200) —
//     a Galmuri11 fontSize:11 / lineHeight:1.4 run inside a flex:1 column that
//     already gives up 42px to the syllable chip and ~30px to the speaker
//     button. The SoT's own two cards are 28 and 33 characters. Keep to that.
//   - Detail fills the drill box (L256), which is a full-width paragraph and
//     is where the "what goes wrong on the ward" half belongs.
//
// IPA is this phoneme's dictionary spelling (canonical key "i" displays as
// "iː"). It is NOT the string the correction card shows: that slot holds the
// *syllable's* IPA — /ˈmɪn/, /lɪ/ in the SoT — which spans several phonemes
// and can only be assembled by the caller from ports.SyllableResult. Use
// Tip.IPA for drill copy and for labeling a single sound, never as the card's
// `ipa` field.
//
// Example is a minimal pair or field word to drill. Every pair here uses two
// words that actually exist; a made-up "opposite" teaches nothing.
type Tip struct {
	IPA     string
	Message string
	Detail  string
	Example string
}

// tips is keyed by canonical phoneme — Azure's en-US IPA (see package doc).
// Never key this map by a dictionary spelling; put those in aliases instead.
var tips = map[string]Tip{
	// ── 모음 ──────────────────────────────────────────────────────────
	"i": {
		IPA:     "iː",
		Message: "짧은 /ɪ/ 말고 길게 — 입꼬리를 옆으로 당겨서.",
		Detail:  "혀를 높이 올리고 입꼬리를 당겨 /ɪ/보다 확실히 길게 뽑아요. \"seat\"이 \"sit\"으로 들리면 앉으시라는 지시가 그냥 계시라는 말로 바뀌어요.",
		Example: "seat / sit",
	},
	"ɪ": {
		IPA:     "ɪ",
		Message: "\"이\"로 늘이지 말고 짧게 — 입을 옆으로 살짝만.",
		Detail:  "입을 옆으로 살짝만 벌리고 짧고 느슨하게 냅니다. acetaminophen의 \"-min-\"을 길게 빼면 약 이름을 통째로 못 알아들어요.",
		Example: "sit / seat",
	},
	"eɪ": {
		IPA:     "eɪ",
		Message: "입을 좁히며 \"에\"에서 \"에이\"로 미끄러뜨려요.",
		Detail:  "입을 좁히며 \"에\"에서 \"이\"로 미끄러뜨려요. \"eight\"을 \"et\"처럼 끊으면 용량 숫자를 매번 다시 확인해야 해서 투약이 늦어져요.",
		Example: "eight, tape",
	},
	"ɛ": {
		IPA:     "ɛ",
		Message: "입을 반쯤만 벌리고 짧게 — /æ/처럼 넓히지 마세요.",
		Detail:  "턱을 많이 내리지 말고 입을 반쯤만 벌려 짧게 냅니다. \"bed\"가 \"bad\"로 들리면 침상 이야기가 상태 이야기로 바뀌어요.",
		Example: "bed / bad",
	},
	"æ": {
		IPA:     "æ",
		Message: "턱을 더 내리고 \"애\"를 넓게 — \"에\"가 아니에요.",
		Detail:  "턱을 아래로 확실히 내리고 \"애\"를 넓게 펴요. \"pan\"이 \"pen\"으로 들리면 변기를 달라는 말이 펜 이야기로 바뀌어요.",
		Example: "pan / pen",
	},
	"ɑ": {
		IPA:     "ɑ",
		Message: "턱을 크게 벌리고 혀를 낮춰 목 안쪽에서 \"아\".",
		Detail:  "턱을 크게 벌리고 혀를 낮춰 목 안쪽에서 울려요. \"cot\"이 \"coat\"으로 들리면 간이침대 이야기가 외투 이야기로 바뀌어요.",
		Example: "cot / coat",
	},
	"ɔ": {
		IPA:     "ɔː",
		Message: "입술을 둥글게 모으되 턱은 \"오\"보다 더 내려요.",
		Detail:  "입술을 둥글게 모으고 턱을 \"오\"보다 더 내려 길게 냅니다. \"call\"이 \"coal\"로 들리면 콜벨을 누르시라는 말이 안 통해요.",
		Example: "call / coal",
	},
	"ʊ": {
		IPA:     "ʊ",
		Message: "힘 빼고 아주 짧게 — 입술을 세게 오므리지 마세요.",
		Detail:  "입술에 힘을 빼고 아주 짧게 냅니다. \"foot\"이 \"food\"로 들리면 발을 보자는 말이 식사 이야기로 바뀌어요.",
		Example: "foot / food",
	},
	"oʊ": {
		IPA:     "oʊ",
		Message: "\"오\"에서 끝내지 말고 입술을 좁혀 \"오우\"로.",
		Detail:  "\"오\"에서 멈추지 말고 입술을 좁히며 \"우\"로 마무리해요. \"bowl\"이 \"ball\"로 들리면 대야를 달라는 말이 공 이야기로 바뀌어요.",
		Example: "bowl / ball",
	},
	"u": {
		IPA:     "uː",
		Message: "입술을 앞으로 동그랗게 내밀고 길게 \"우\".",
		Detail:  "입술을 앞으로 동그랗게 내밀고 길게 뽑아요. 짧으면 \"food\"가 \"foot\"으로 들려서 식사 이야기가 발 이야기로 바뀌어요.",
		Example: "food / foot",
	},
	"ʌ": {
		IPA:     "ʌ",
		Message: "입술을 둥글게 하지 말고 턱만 살짝 — 짧게 \"어\".",
		Detail:  "입술을 둥글게 하지 말고 턱만 살짝 내려 짧게 툭 던져요. \"cut\"이 \"cot\"으로 들리면 베인 상처 이야기가 침대 이야기로 바뀌어요.",
		Example: "cut / cot",
	},
	"aɪ": {
		IPA:     "aɪ",
		Message: "턱을 벌려 \"아\"로 시작해 \"이\"로 미끄러뜨려요.",
		Detail:  "턱을 벌려 \"아\"로 시작해 \"이\"까지 미끄러뜨려요. \"five\"와 \"IV\"의 첫소리라, 뭉개면 숫자인지 라인 이름인지 구분이 사라져요.",
		Example: "five, IV",
	},
	"aʊ": {
		IPA:     "aʊ",
		Message: "\"아\"로 벌렸다가 입술을 오므려 \"우\"로 닫아요.",
		Detail:  "\"아\"로 크게 벌렸다가 입술을 오므려 \"우\"로 닫아요. \"down\"이 \"dawn\"으로 들리면 침대를 내리시라는 지시가 사라져요.",
		Example: "down / dawn",
	},
	"ɔɪ": {
		IPA:     "ɔɪ",
		Message: "입술을 둥글게 \"오\"로 시작해 옆으로 당겨 \"이\".",
		Detail:  "입술을 둥글게 모아 시작해 옆으로 당기며 \"이\"로 끝내요. 하나로 뭉개면 \"point\"가 안 들려서 어디가 아픈지 짚어달라는 말이 안 통해요.",
		Example: "point, noise",
	},
	"ju": {
		IPA:     "juː",
		Message: "\"우\" 앞에 짧은 \"이\"를 붙여 \"유\"로 시작해요.",
		Detail:  "혀 앞을 올려 짧은 \"이\"를 붙인 뒤 입술을 내밀어 \"우\"로 갑니다. \"unit\"을 \"우닛\"으로 읽으면 인슐린 단위가 안 통해요.",
		Example: "unit, few",
	},
	"ə": {
		IPA:     "ə",
		Message: "힘을 빼고 아주 짧게 — 또박또박 읽지 마세요.",
		Detail:  "입에 힘을 완전히 빼고 아주 짧게 흘려요. acetaminophen의 약한 음절까지 세게 읽으면 리듬이 깨져서 약 이름을 못 알아들어요.",
		Example: "acetaminophen, about",
	},

	// ── R색 모음 ──────────────────────────────────────────────────────
	// IPA 모드에서 한 토큰으로 온다(문서 "R-colored vowels for English").
	// 여기가 비면 chart·morning·hear·care 같은 병동 상용어가 통째로 빈 카드다.
	"ɪɹ": {
		IPA:     "ɪr",
		Message: "짧은 \"이\" 뒤에 혀를 말아 r까지 이어 붙여요.",
		Detail:  "짧은 /ɪ/를 낸 뒤 끊지 말고 혀를 뒤로 말아 r로 이어요. \"hear\"이 \"hair\"로 들리면 들리시냐는 확인이 머리카락 이야기로 바뀌어요.",
		Example: "hear / hair",
	},
	"ɛɹ": {
		IPA:     "ɛr",
		Message: "\"에\" 뒤에 혀를 말아 r까지 이어 붙여요.",
		Detail:  "입을 반쯤 벌려 \"에\"를 낸 뒤 혀를 뒤로 말아 r까지 붙여요. \"care\"가 \"car\"로 들리면 돌봄 이야기가 자동차 이야기로 바뀌어요.",
		Example: "care / car",
	},
	"ʊɹ": {
		IPA:     "ʊr",
		Message: "입술을 살짝 오므려 짧은 \"우\" 뒤에 r을 붙여요.",
		Detail:  "입술을 살짝 오므려 짧은 \"우\"를 낸 뒤 혀를 말아 r로 이어요. \"cure\"에서 r을 흘리면 \"coo\"처럼 들려서 치료 이야기가 안 통해요.",
		Example: "cure, sure",
	},
	"aɪɹ": {
		IPA:     "aɪr",
		Message: "\"아이\"를 낸 뒤 혀를 말아 r까지 이어요.",
		Detail:  "턱을 벌려 \"아\"에서 \"이\"로 미끄러진 뒤 혀를 말아 r로 마무리해요. \"wire\"가 \"why\"로 들리면 선을 확인하자는 말이 사라져요.",
		Example: "wire, fire",
	},
	"aʊɹ": {
		IPA:     "aʊr",
		Message: "\"아우\" 뒤에 혀를 말아 r까지 이어 붙여요.",
		Detail:  "\"아\"에서 입술을 오므려 \"우\"로 간 뒤 혀를 말아 r로 끝내요. \"hours\"가 \"house\"로 들리면 몇 시간마다 주라는 투약 간격이 무너져요.",
		Example: "hours / house",
	},
	"ɔɹ": {
		IPA:     "ɔr",
		Message: "입술을 둥글게 \"오\" 뒤에 혀를 말아 r로.",
		Detail:  "입술을 둥글게 모아 \"오\"를 낸 뒤 혀를 말아 r로 이어요. \"morning\"에서 r을 흘리면 \"moaning\"으로 들려서 아침 인사가 신음 이야기로 바뀌어요.",
		Example: "morning / moaning",
	},
	"ɑɹ": {
		IPA:     "ɑr",
		Message: "턱을 크게 벌려 \"아\" 뒤에 혀를 말아 r로.",
		Detail:  "턱을 크게 벌려 \"아\"를 낸 뒤 혀를 뒤로 말아 r까지 붙여요. \"chart\"에서 r을 빼면 \"chat\"처럼 들려서 차트를 보자는 말이 잡담이 돼요.",
		Example: "chart, arm",
	},
	"ɝ": {
		IPA:     "ɜːr",
		Message: "혀 가운데를 말아 올린 채 \"어\"를 끌어요.",
		Detail:  "혀 가운데를 목 쪽으로 말아 올린 채 \"어\"를 끌어요 — \"오\"가 아니에요. r 색이 빠지면 \"nurse\"부터 못 알아들어서 자기소개가 막혀요.",
		Example: "nurse, first",
	},
	"ɚ": {
		IPA:     "ər",
		Message: "힘을 뺀 짧은 \"어\"에 혀만 살짝 말아요.",
		Detail:  "강세가 없는 자리라 힘을 빼고 짧게, 혀만 살짝 말아 r 색만 남겨요. \"supper\"의 끝을 \"서\"로 끊으면 리듬이 깨져서 못 알아들어요.",
		Example: "supper, allergy",
	},

	// ── 반모음 ────────────────────────────────────────────────────────
	"w": {
		IPA:     "w",
		Message: "입술을 동그랗게 모았다 펴면서 시작해요.",
		Detail:  "입술을 동그랗게 모았다 펴며 시작해요 — 윗니를 아랫입술에 대면 v가 됩니다. \"wet\"이 \"vet\"으로 들리면 침상이 젖었다는 말이 수의사 이야기로 바뀌어요.",
		Example: "wet / vet",
	},
	"j": {
		IPA:     "j",
		Message: "혀 앞을 입천장 가까이 올렸다 빠르게 내려요.",
		Detail:  "혀 앞을 입천장 가까이 올렸다 빠르게 내려요. 이 소리를 빼면 \"years\"가 \"ears\"가 되어 병력 기간이 귀 이야기로 바뀌어요.",
		Example: "years / ears",
	},

	// ── 파열음 ────────────────────────────────────────────────────────
	"p": {
		IPA:     "p",
		Message: "입술을 붙였다 떼며 바람을 훅 터뜨려요.",
		Detail:  "입술을 붙였다 떼며 바람을 훅 터뜨려요 — \"ㅃ\"처럼 바람 없이 내면 b가 됩니다. \"pill\"이 \"bill\"로 들리면 약 이야기가 청구서 이야기로 바뀌어요.",
		Example: "pill / bill",
	},
	"b": {
		IPA:     "b",
		Message: "입술을 붙인 채 성대를 먼저 울리고 터뜨려요.",
		Detail:  "입술을 붙인 채 성대를 먼저 울리고 떼요 — 바람만 세면 p가 됩니다. \"back\"이 \"pack\"으로 들리면 등 이야기가 찜질팩 이야기로 바뀌어요.",
		Example: "back / pack",
	},
	"t": {
		IPA:     "t",
		Message: "혀끝을 윗잇몸에 붙였다 바람과 함께 떼요.",
		Detail:  "혀끝을 윗잇몸에 붙였다 바람과 함께 떼되 뒤에 \"으\"를 붙이지 마세요. \"chart\"를 \"차트\"로 읽으면 음절이 늘어나서 못 알아들어요.",
		Example: "chart, take",
	},
	"d": {
		IPA:     "d",
		Message: "혀끝을 윗잇몸에 붙이고 성대를 울리며 떼요.",
		Detail:  "혀끝을 윗잇몸에 붙이고 성대를 울리며 떼요. 끝소리에 \"으\"를 붙이면 \"bed\"가 \"베드\"가 되어 음절이 늘어나서 못 알아들어요.",
		Example: "bed, need",
	},
	"k": {
		IPA:     "k",
		Message: "혀 뒤를 입천장에 붙였다 바람을 터뜨려요.",
		Detail:  "혀 뒤를 여린입천장에 붙였다 바람을 터뜨려요 — 약하면 g로 들려요. \"cane\"이 \"gain\"으로 들리면 지팡이 이야기가 체중 증가 이야기로 바뀌어요.",
		Example: "cane / gain",
	},
	"ɡ": {
		IPA:     "ɡ",
		Message: "혀 뒤를 붙이고 성대를 울리며 떼요.",
		Detail:  "혀 뒤를 여린입천장에 붙이고 성대를 울리며 떼요. k로 새면 \"gauze\"가 \"cause\"로 들려서 거즈를 달라는 말이 안 통해요.",
		Example: "gauze / cause",
	},

	// ── 비음 ──────────────────────────────────────────────────────────
	"m": {
		IPA:     "m",
		Message: "입술을 다물고 코로 소리를 내보내요.",
		Detail:  "입술을 완전히 다물고 코로 울려요. 끝소리 m을 흘리면 \"mg\"의 단위가 사라져서 숫자만 남아요.",
		Example: "mg, arm",
	},
	"n": {
		IPA:     "n",
		Message: "혀끝을 윗잇몸에 붙인 채 코로 소리를 내요.",
		Detail:  "혀끝을 윗잇몸에 붙인 채 코로 냅니다 — 끝소리를 \"ㅇ\"으로 바꾸지 마세요. \"run\"이 \"rung\"으로 들리면 수액이 들어가는 중이라는 말이 안 통해요.",
		Example: "run / rung",
	},
	"ŋ": {
		IPA:     "ŋ",
		Message: "혀 뒤로 막고 코로만 — 끝에 \"그\"를 붙이지 마세요.",
		Detail:  "혀 뒤를 올려 입을 막고 코로만 울려요. \"swelling\"이 \"스웰링그\"가 되면 부종 보고가 한 박자 늦어져요.",
		Example: "swelling, coughing",
	},

	// ── 마찰음 ────────────────────────────────────────────────────────
	"f": {
		IPA:     "f",
		Message: "윗니를 아랫입술에 대고 바람을 길게 흘려요.",
		Detail:  "윗니를 아랫입술에 살짝 대고 바람을 흘려요 — 입술만 터뜨리면 p가 됩니다. \"fill\"이 \"pill\"로 들리면 채우라는 말이 약 이야기로 바뀌어요.",
		Example: "fill / pill",
	},
	"v": {
		IPA:     "v",
		Message: "윗니를 아랫입술에 댄 채 성대를 울려요.",
		Detail:  "윗니를 아랫입술에 댄 채 성대를 울려요 — \"ㅂ\"로 내면 b가 됩니다. \"vein\"이 \"bane\"으로 들리면 정맥을 찾는 대화가 그대로 멈춰요.",
		Example: "vein / bane",
	},
	"θ": {
		IPA:     "θ",
		Message: "혀끝을 윗니 사이로 내밀고 바람만 흘려요.",
		Detail:  "혀끝을 윗니 사이로 살짝 내밀고 바람만 흘려요 — \"ㅅ\"가 아니에요. \"mouth\"가 \"mouse\"로 들리면 입 안을 보자는 말이 안 통해요.",
		Example: "mouth / mouse",
	},
	"ð": {
		IPA:     "ð",
		Message: "혀끝을 윗니 사이에 둔 채 성대를 울려요.",
		Detail:  "혀끝을 윗니 사이에 둔 채 성대를 울려요 — \"ㄷ\"가 아니에요. \"breathe\"가 \"breeze\"로 들리면 숨을 쉬시라는 지시가 사라져요.",
		Example: "breathe / breeze",
	},
	"s": {
		IPA:     "s",
		Message: "혀끝을 윗잇몸 가까이 두고 가늘게 바람을 흘려요.",
		Detail:  "혀끝을 윗잇몸 가까이 두고 가늘게 바람을 흘려요 — \"쉬\"로 새지 않게. \"see\"가 \"she\"로 들리면 보자는 말이 그 환자 이야기로 바뀌어요.",
		Example: "see / she",
	},
	"z": {
		IPA:     "z",
		Message: "s와 같은 혀 자리에서 성대를 울려요.",
		Detail:  "s와 같은 혀 자리에서 성대를 울려요 — \"ㅈ\"가 아니에요. \"eyes\"가 \"ice\"로 들리면 눈을 감으시라는 말이 얼음 이야기로 바뀌어요.",
		Example: "eyes / ice",
	},
	"ʃ": {
		IPA:     "ʃ",
		Message: "혀를 뒤로 물리고 입술을 내밀어 \"쉬\".",
		Detail:  "혀를 뒤로 조금 물리고 입술을 살짝 내밀어 냅니다. \"she\"가 \"see\"로 들리면 환자를 가리키는 말이 보라는 말로 바뀌어요.",
		Example: "she / see",
	},
	"ʒ": {
		IPA:     "ʒ",
		Message: "\"쉬\" 자리에서 성대를 울려 아주 짧게.",
		Detail:  "\"쉬\"와 같은 혀 자리에서 성대를 울려요 — dʒ처럼 터뜨리면 안 됩니다. \"lesion\"이 \"legion\"으로 들리면 병변 보고가 엉뚱한 말로 바뀌어요.",
		Example: "lesion / legion",
	},
	"h": {
		IPA:     "h",
		Message: "입은 다음 모음 모양으로 두고 숨만 내보내요.",
		Detail:  "입을 뒤에 올 모음 모양으로 미리 벌려두고 목을 조이지 말고 숨만 내보내요. h를 빼면 \"heart\"가 \"art\"가 되어 심장 이야기가 통째로 사라져요.",
		Example: "heart / art",
	},

	// ── 파찰음 ────────────────────────────────────────────────────────
	"tʃ": {
		IPA:     "tʃ",
		Message: "혀끝을 붙였다 \"쉬\"로 한 번에 터뜨려요.",
		Detail:  "혀끝을 윗잇몸에 붙였다 \"쉬\"로 한 번에 터뜨려요. \"츠\"처럼 늘이면 \"chest\"가 두 음절이 되어 부위 확인이 늦어져요.",
		Example: "chest, chart",
	},
	"dʒ": {
		IPA:     "dʒ",
		Message: "혀끝을 붙였다 성대를 울리며 \"지\"로 한 번에.",
		Detail:  "혀끝을 붙였다 성대를 울리며 \"지\"로 한 번에 터뜨려요. \"injection\"의 -jec-을 \"제\"로 뭉개면 주사 이야기를 못 알아들어요.",
		Example: "injection, gel",
	},

	// ── 접근음 ────────────────────────────────────────────────────────
	"l": {
		IPA:     "l",
		Message: "혀끝을 윗잇몸에 붙인 채 소리를 내고 떼요.",
		Detail:  "혀끝을 윗잇몸에 붙인 채로 소리를 내고 나서 떼요. milligrams의 -li-를 흘리지 말고 짚어주세요 — 용량이 통째로 사라집니다.",
		Example: "milligrams, pill",
	},
	"ɹ": {
		IPA:     "r",
		Message: "혀끝을 어디에도 붙이지 말고 안쪽으로 말아요.",
		Detail:  "혀끝을 어디에도 붙이지 말고 안쪽으로 말아요 — 한국어 \"ㄹ\"처럼 튕기면 l로 들려요. \"right\"이 \"light\"으로 들리면 좌우 지시가 뒤집혀요.",
		Example: "right / light",
	},
}

// aliases maps every other spelling we might receive onto a canonical key.
//
// Three sources feed this: Azure's SAPI alphabet (the documented default, and
// what we fall back to on any locale that does not support IPA phoneme
// names), dictionary IPA as learners and the SoT write it, and a few Unicode
// near-twins. Entries whose spelling already equals the canonical key
// (s, z, f, l, …) are deliberately omitted — Lookup tries the canonical map
// first.
//
// normalize strips internal spaces before consulting this map, so the
// two-word SAPI spellings in Microsoft's table ("ih r", "y uw") arrive here
// as "ihr" and "yuw".
var aliases = map[string]string{
	// SAPI 모음 — speech-ssml-phonetic-sets, en-US `sapi` 열.
	"iy": "i", "ih": "ɪ", "ey": "eɪ", "eh": "ɛ", "ae": "æ", "aa": "ɑ",
	"ao": "ɔ", "uh": "ʊ", "ow": "oʊ", "uw": "u", "ah": "ʌ", "ay": "aɪ",
	"aw": "aʊ", "oy": "ɔɪ", "ax": "ə", "yuw": "ju",
	// SAPI R색 모음. 표기가 두 낱말("ih r")이라 공백 제거 후 형태로 적는다.
	// 단, 실제 SAPI 응답은 이 소리를 "ih"+"r" 두 토큰으로 쪼개 보내므로
	// 그 경로에서는 각 토큰이 따로 매칭된다 — 여기 항목은 한 토큰으로
	// 뭉쳐 오는 경우를 위한 것이다.
	"ihr": "ɪɹ", "ehr": "ɛɹ", "uhr": "ʊɹ", "ayr": "aɪɹ", "awr": "aʊɹ",
	"aor": "ɔɹ", "aar": "ɑɹ", "er": "ɝ", "err": "ɝ", "axr": "ɚ",
	// SAPI 자음 — 나머지(p b t d k m n f v s z h l w)는 표기가 IPA와 같다.
	// "g"는 SAPI 표기이기도 하고, 문서 IPA 열이 평범한 g(U+0067)를 쓰는지
	// 음성기호 ɡ(U+0261)를 쓰는지도 렌더에 따라 갈린다. 둘 다 받는다 —
	// 정본은 ɡ(U+0261), 여기 "g"는 U+0067이다.
	"g": "ɡ", "ng": "ŋ", "th": "θ", "dh": "ð", "sh": "ʃ", "zh": "ʒ",
	"ch": "tʃ", "jh": "dʒ", "r": "ɹ", "y": "j",

	// 사전식 IPA. 길이 기호(ː)는 normalize가 떼므로 iː·uː·ɔː는 자동으로
	// i·u·ɔ가 된다. 여기 남는 건 글자 자체가 다른 것들이다.
	"ɜ": "ɝ", "ɜr": "ɝ", "ɝr": "ɝ", "ər": "ɚ", "ɐ": "ʌ", "ɒ": "ɑ", "e": "ɛ",
	"əʊ": "oʊ", "ɵʊ": "oʊ", "ʀ": "ɹ", "ɻ": "ɹ", "ɫ": "l", "ɱ": "m",
	"ʧ": "tʃ", "ʤ": "dʒ",
	// 사전식 R색 모음: 중심 모음 + (ə) + r.
	"ɪr": "ɪɹ", "ɪər": "ɪɹ", "ɪə": "ɪɹ",
	"ɛr": "ɛɹ", "ɛər": "ɛɹ", "ɛə": "ɛɹ", "eər": "ɛɹ",
	"ʊr": "ʊɹ", "ʊər": "ʊɹ", "ʊə": "ʊɹ",
	"aɪr": "aɪɹ", "aɪər": "aɪɹ",
	"aʊr": "aʊɹ", "aʊər": "aʊɹ",
	"ɔr": "ɔɹ", "ɔər": "ɔɹ",
	"ɑr": "ɑɹ",

	// [ɾ] is the American flap — an allophone of /t/ (water, capital), not of
	// /ɹ/. Mapping it to ɹ would hand the nurse "혀끝을 말아요 … right/light"
	// coaching for a sound she produced with a correct tongue tap.
	"ɾ": "t",
}

// stripped are the decorations that carry no phoneme identity: slashes and
// brackets around a transcription, stress and length marks, syllable dots,
// tie bars, and the spaces inside Microsoft's two-word SAPI spellings. Azure
// does not emit most of these, but the SoT and any hand-authored fixture do,
// and a stray "ˈ" would otherwise miss silently.
var stripped = strings.NewReplacer(
	"/", "", "[", "", "]", "", "ˈ", "", "ˌ", "", "ː", "", "ˑ", "",
	".", "", "‿", "", "͡", "", "​", "", " ", "", "\t", "",
)

// normalize reduces any spelling of a phoneme to a canonical key. It returns
// "" when nothing usable is left, which Lookup reports as "no tip" so R5 can
// skip the phoneme rather than render a blank card.
func normalize(phoneme string) string {
	s := strings.ToLower(stripped.Replace(strings.TrimSpace(phoneme)))
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
