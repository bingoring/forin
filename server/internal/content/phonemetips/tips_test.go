package phonemetips

import (
	"strings"
	"testing"
)

// 한국어 화자가 실제로 틀리는 음소는 반드시 있어야 한다.
// 여기 적힌 키는 학습자·SoT가 쓰는 사전식 IPA다(길이 기호 있는 /iː/, 평범한 /r/).
// Azure가 실제로 뱉는 표기는 다르다(아래 TestAzureEnUSIPAGlyphsResolve) — Lookup이
// 양쪽을 같은 팁으로 정규화하는지까지 이 테스트가 함께 고정한다.
func TestCoversKoreanSpeakerPainPoints(t *testing.T) {
	must := []string{"ɪ", "iː", "r", "l", "θ", "ð", "f", "v", "z", "æ", "ʌ", "ə"}
	for _, p := range must {
		if _, ok := Lookup(p); !ok {
			t.Errorf("no tip for /%s/ — a correction point for it would render blank", p)
		}
	}
}

// 문구는 입 모양·혀 위치 같은 실행 가능한 지시를 담아야 한다(단순 명칭 나열 금지).
func TestTipsAreActionable(t *testing.T) {
	for p, tip := range All() {
		if len([]rune(tip.Message)) < 10 {
			t.Errorf("/%s/ tip too short to act on: %q", p, tip.Message)
		}
	}
}

// 실행 가능성의 실질 기준: 조음 지시(입/혀/입술/턱/성대/길이) 한 개 이상 +
// 현장에서 틀리면 무슨 일이 생기는지. SoT L256의 두 축이다.
func TestTipsGiveArticulationAndFieldConsequence(t *testing.T) {
	articulators := []string{"입", "혀", "턱", "성대", "짧", "길", "코"}
	for p, tip := range All() {
		if tip.IPA == "" {
			t.Errorf("/%s/ has no IPA to display on the correction card", p)
		}
		if tip.Example == "" {
			t.Errorf("/%s/ has no example word — the nurse has nothing to drill", p)
		}
		if len([]rune(tip.Message)) < 30 {
			t.Errorf("/%s/ message is a label, not coaching: %q", p, tip.Message)
		}
		found := false
		for _, a := range articulators {
			if strings.Contains(tip.Message, a) {
				found = true
				break
			}
		}
		if !found {
			t.Errorf("/%s/ message has no articulation cue (입/혀/턱/…): %q", p, tip.Message)
		}
		// 현장 결과를 말해야 한다 — 문장이 둘 이상이어야 가능하다.
		if strings.Count(tip.Message, ".")+strings.Count(tip.Message, "요") < 2 {
			t.Errorf("/%s/ message never says what goes wrong in the ward: %q", p, tip.Message)
		}
	}
}

// ── 표기 체계 회귀 방지 ──────────────────────────────────────────────
// 이 태스크 전체가 여기 달려 있다. 키가 어긋나면 매핑이 한 번도 매칭되지
// 않고 교정 포인트가 영원히 비는데, 코드는 아무 에러도 내지 않는다.

// Azure Speech가 en-US에서 phonemeAlphabet=IPA로 실제 반환하는 글자.
// 출처: learn.microsoft.com/azure/ai-services/speech-service/speech-ssml-phonetic-sets
// (en-US의 `ipa` 열). 사전식 IPA와 다른 지점이 함정이다:
//   - "seat"의 모음은 iː 가 아니라 i
//   - "boost"의 모음은 uː 가 아니라 u
//   - "red"의 자음은 r 이 아니라 ɹ
func TestAzureEnUSIPAGlyphsResolve(t *testing.T) {
	azure := []string{
		"i", "ɪ", "eɪ", "ɛ", "æ", "ɑ", "ɔ", "ʊ", "oʊ", "u", "ʌ", "aɪ", "aʊ", "ɔɪ", "ju", "ə", "ɝ",
		"p", "b", "t", "d", "k", "ɡ", "m", "n", "ŋ", "f", "v", "θ", "ð", "s", "z",
		"ʃ", "ʒ", "h", "tʃ", "dʒ", "l", "ɹ", "w", "j",
	}
	for _, p := range azure {
		if _, ok := Lookup(p); !ok {
			t.Errorf("Azure en-US IPA %q has no tip — correction points would be blank for it", p)
		}
	}
}

// phonemeAlphabet를 지정하지 않으면 Azure는 SAPI로 준다(문서 명시). 우리는
// 요청에 IPA를 넣지만, 그 파라미터가 무시되거나 로케일이 IPA를 지원하지
// 않으면 조용히 SAPI가 돌아온다. 그때도 팁이 붙어야 한다.
func TestAzureSAPIGlyphsResolve(t *testing.T) {
	sapi := []string{
		"iy", "ih", "ey", "eh", "ae", "aa", "ao", "uh", "ow", "uw", "ah", "ay", "aw", "oy", "ax", "er",
		"p", "b", "t", "d", "k", "g", "m", "n", "ng", "f", "v", "th", "dh", "s", "z",
		"sh", "zh", "h", "ch", "jh", "l", "r", "w", "y",
	}
	for _, p := range sapi {
		if _, ok := Lookup(p); !ok {
			t.Errorf("SAPI %q has no tip — if Azure ignores phonemeAlphabet, every correction point goes blank", p)
		}
	}
}

// 같은 소리는 표기가 뭐든 같은 팁으로 수렴해야 한다.
func TestNotationsConvergeOnOneTip(t *testing.T) {
	groups := [][]string{
		{"i", "iː", "iy"},
		{"ɪ", "ih", "/ɪ/", "ˈɪ"},
		{"ɹ", "r", "R"},
		{"u", "uː", "uw"},
		{"θ", "th"},
		{"ɝ", "ɜː", "ɚ", "er"},
		{"ɡ", "g"},
		{"j", "y"},
		{"ʌ", "ah", "ʌ1"},
	}
	for _, g := range groups {
		first, ok := Lookup(g[0])
		if !ok {
			t.Errorf("%q missing", g[0])
			continue
		}
		for _, alt := range g[1:] {
			got, ok := Lookup(alt)
			if !ok {
				t.Errorf("%q did not resolve, but %q did — same sound, different notation", alt, g[0])
				continue
			}
			if got.Message != first.Message {
				t.Errorf("%q and %q are the same sound but got different tips", g[0], alt)
			}
		}
	}
}

// /ɪ/ 와 /iː/ 는 서로 다른 팁이어야 한다 — 정규화가 과해서 둘을 합치면
// SoT L256이 가르치려는 대비가 사라진다.
func TestShortAndLongIAreDistinct(t *testing.T) {
	short, _ := Lookup("ɪ")
	long, _ := Lookup("iː")
	if short.Message == long.Message {
		t.Error("/ɪ/ and /iː/ collapsed into one tip — the sit/seat contrast is the whole point")
	}
}

// R5: 팁이 없는 음소는 건너뛴다. 빈 Tip을 ok=true로 돌려주면 호출부가
// 빈 카드를 그린다.
func TestUnknownPhonemeReportsMissing(t *testing.T) {
	for _, p := range []string{"", "  ", "xyzzy", "ʘ"} {
		if tip, ok := Lookup(p); ok {
			t.Errorf("Lookup(%q) claimed a tip exists: %+v — R5 can no longer skip it", p, tip)
		}
	}
}

// All()은 복사본이어야 한다 — 호출부가 실수로 지우면 전역이 오염된다.
func TestAllReturnsACopy(t *testing.T) {
	a := All()
	n := len(a)
	if n == 0 {
		t.Fatal("All() is empty")
	}
	for k := range a {
		delete(a, k)
	}
	if len(All()) != n {
		t.Fatal("All() handed out the package's own map; a caller can wipe every tip")
	}
}
