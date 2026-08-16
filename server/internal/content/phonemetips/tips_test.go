package phonemetips

import (
	"strings"
	"testing"
	"unicode"
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

// 조음 기관을 지목하는 낱말. 이게 없으면 "무엇을 어떻게 움직여라"가 아니라
// 소리 이름만 부른 것이다.
var articulators = []string{"입", "혀", "턱", "성대", "숨", "코", "짧", "길"}

// 현장에서 무엇이 잘못되는지 말하는 낱말. "어색해져요" 같은 무해한 마무리는
// 여기 걸리지 않는다 — 실제로 무슨 일이 벌어지는지 못 말하면 2축의 ②가 빈다.
var consequences = []string{
	"들려", "들리면", "안 통해", "못 알아", "뒤집", "사라", "무너", "막혀", "늦어", "바뀌",
}

func hasAny(s string, needles []string) bool {
	for _, n := range needles {
		if strings.Contains(s, n) {
			return true
		}
	}
	return false
}

func hasASCIILetter(s string) bool {
	for _, r := range s {
		if r < unicode.MaxASCII && unicode.IsLetter(r) {
			return true
		}
	}
	return false
}

// Message는 SoT L199-200의 교정 카드 슬롯에 들어간다. 그 칸은 fontSize 11 /
// lineHeight 1.4에 42px 음절 칩과 스피커 버튼을 빼고 남은 flex 칸이고, SoT
// 자신의 두 문구는 28자·33자다. 조음 지시 하나만 담고 짧게 끝내야 한다.
func TestMessageFitsTheCorrectionCard(t *testing.T) {
	const maxRunes = 40 // SoT 33자 + 여유
	for p, tip := range All() {
		n := len([]rune(tip.Message))
		if n < 8 {
			t.Errorf("/%s/ message is not coaching: %q", p, tip.Message)
		}
		if n > maxRunes {
			t.Errorf("/%s/ message is %d runes; the card slot holds ~%d before it grows two lines deep: %q",
				p, n, maxRunes, tip.Message)
		}
		if !hasAny(tip.Message, articulators) {
			t.Errorf("/%s/ message has no articulation cue (입/혀/턱/…): %q", p, tip.Message)
		}
	}
}

// Detail은 드릴 박스(SoT L256)용 긴 문구다. 여기서 2축이 다 갖춰져야 한다:
// ①조음 지시 + ②현장에서 틀리면 무슨 일이 생기는지(실제 영어 낱말로).
func TestDetailGivesArticulationAndFieldConsequence(t *testing.T) {
	for p, tip := range All() {
		if tip.IPA == "" {
			t.Errorf("/%s/ has no IPA spelling", p)
		}
		if tip.Example == "" {
			t.Errorf("/%s/ has no example word — the nurse has nothing to drill", p)
		}
		if len([]rune(tip.Detail)) < 40 {
			t.Errorf("/%s/ detail is too thin for the drill box: %q", p, tip.Detail)
		}
		if !hasAny(tip.Detail, articulators) {
			t.Errorf("/%s/ detail has no articulation cue: %q", p, tip.Detail)
		}
		if !hasAny(tip.Detail, consequences) {
			t.Errorf("/%s/ detail never says what goes wrong in the ward: %q", p, tip.Detail)
		}
		// 결과를 말하려면 헷갈리는 실제 영어 낱말을 들어야 한다.
		if !hasASCIILetter(tip.Detail) {
			t.Errorf("/%s/ detail names no English word to contrast: %q", p, tip.Detail)
		}
	}
}

// ── 표기 체계 회귀 방지 ──────────────────────────────────────────────
// 이 태스크 전체가 여기 달려 있다. 키가 어긋나면 매핑이 한 번도 매칭되지
// 않고 교정 포인트가 영원히 비는데, 코드는 아무 에러도 내지 않는다.

// Azure Speech가 en-US에서 phonemeAlphabet=IPA로 실제 반환하는 글자 전 세트.
// 출처: learn.microsoft.com/azure/ai-services/speech-service/speech-ssml-phonetic-sets
// (en-US의 `ipa` 열, 모음·R색 모음·자음 세 표 전부). 사전식 IPA와 다른
// 지점이 함정이다:
//   - "seat"의 모음은 iː 가 아니라 i
//   - "boost"의 모음은 uː 가 아니라 u
//   - "red"의 자음은 r 이 아니라 ɹ
//   - R색 모음은 ɑ+ɹ 두 토큰이 아니라 ɑɹ 한 토큰
func TestAzureEnUSIPAGlyphsResolve(t *testing.T) {
	azure := []string{
		// Vowels (16)
		"i", "ɪ", "eɪ", "ɛ", "æ", "ɑ", "ɔ", "ʊ", "oʊ", "u", "ʌ", "aɪ", "aʊ", "ɔɪ", "ju", "ə",
		// R-colored vowels (9). Azure emits these as ONE token in IPA mode —
		// ɑɹ (chart/arm), ɔɹ (morning), ɪɹ (hear), ɛɹ (care) are ward staples.
		// In SAPI mode the same sounds arrive as two tokens ("aa"+"r"), so
		// missing them here breaks IPA mode only — the mode we just turned on.
		"ɪɹ", "ɛɹ", "ʊɹ", "aɪɹ", "aʊɹ", "ɔɹ", "ɑɹ", "ɝ", "ɚ",
		// Semivowels, stops, nasals, fricatives, affricates, approximants (24)
		"w", "j", "p", "b", "t", "d", "k", "ɡ", "m", "n", "ŋ",
		"f", "v", "θ", "ð", "s", "z", "ʃ", "ʒ", "h", "tʃ", "dʒ", "l", "ɹ",
	}
	if len(azure) != 49 {
		t.Fatalf("the en-US table has 49 IPA entries; this list has %d", len(azure))
	}
	for _, p := range azure {
		if _, ok := Lookup(p); !ok {
			t.Errorf("Azure en-US IPA %q has no tip — correction points would be blank for it", p)
		}
	}
	// 그리고 그 49개가 곧 정본 키 집합이어야 한다 — 표에 없는 키를 넣어두면
	// 영원히 죽은 항목이고, 표에 있는데 빠지면 조용히 빈 카드다.
	if len(All()) != len(azure) {
		t.Errorf("canonical set is %d entries but the en-US table has %d", len(All()), len(azure))
	}
}

// phonemeAlphabet를 지정하지 않으면 Azure는 SAPI로 준다(문서 명시). 우리는
// 요청에 IPA를 넣지만, 그 파라미터가 무시되거나 로케일이 IPA를 지원하지
// 않으면 조용히 SAPI가 돌아온다. 그때도 팁이 붙어야 한다.
func TestAzureSAPIGlyphsResolve(t *testing.T) {
	sapi := []string{
		"iy", "ih", "ey", "eh", "ae", "aa", "ao", "uh", "ow", "uw", "ah", "ay", "aw", "oy", "ax",
		// 문서의 R색 모음 sapi 열은 두 낱말이다. 실제 응답은 두 토큰으로
		// 쪼개져 오지만, 뭉쳐 오더라도 매칭돼야 한다.
		"ih r", "eh r", "uh r", "ay r", "aw r", "ao r", "aa r", "er r", "ax r", "er",
		"p", "b", "t", "d", "k", "g", "m", "n", "ng", "f", "v", "th", "dh", "s", "z",
		"sh", "zh", "h", "ch", "jh", "l", "r", "w", "y", "y uw",
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
		{"ɝ", "ɜː", "er", "er r"},
		{"ɚ", "ər", "ax r"},
		{"ɡ", "g"},
		{"j", "y"},
		{"ʌ", "ah", "ʌ1"},
		{"ɑɹ", "ɑr", "ɑːr", "aa r"},
		{"ɔɹ", "ɔr", "ɔːr", "ao r"},
		{"ɪɹ", "ɪər", "ih r"},
		{"ɛɹ", "ɛər", "eər", "eh r"},
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

// R색 모음은 그 안에 든 홑모음과 다른 팁이어야 한다. ɑɹ를 ɑ로 접어버리면
// "혀를 말아라"는 지시가 통째로 빠져서 chart가 chat으로 남는다.
func TestRColoredVowelsAreNotFoldedIntoPlainVowels(t *testing.T) {
	pairs := [][2]string{{"ɑɹ", "ɑ"}, {"ɔɹ", "ɔ"}, {"ɪɹ", "ɪ"}, {"ɛɹ", "ɛ"}, {"ʊɹ", "ʊ"}}
	for _, p := range pairs {
		colored, ok := Lookup(p[0])
		if !ok {
			t.Errorf("%q missing", p[0])
			continue
		}
		plain, _ := Lookup(p[1])
		if colored.Message == plain.Message {
			t.Errorf("%q collapsed into %q — the r-coloring instruction disappears", p[0], p[1])
		}
	}
}

// 미국영어의 탄설음 [ɾ]는 /t/의 이음이다(water, capital). /ɹ/로 매핑하면
// 혀를 제대로 친 간호사에게 "혀끝을 말아요 — right/light" 오답 코칭이 뜬다.
func TestFlapIsAnAllophoneOfT(t *testing.T) {
	flap, ok := Lookup("ɾ")
	if !ok {
		t.Fatal("ɾ did not resolve")
	}
	wantT, _ := Lookup("t")
	if flap.Message != wantT.Message {
		t.Errorf("[ɾ] must coach /t/, got %q", flap.Message)
	}
	gotR, _ := Lookup("ɹ")
	if flap.Message == gotR.Message {
		t.Error("[ɾ] is coaching /ɹ/ — that is wrong phonetics and wrong advice")
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
