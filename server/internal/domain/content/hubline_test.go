package content

import "testing"

// lesson-fidelity-v46 T6 (hub #23): the hub's one line carries exactly one highlighted
// span, written [[like this]].
func TestValidateHubLine(t *testing.T) {
	ok := []string{
		"",
		"“또 물어요? 아까도 말했잖아요.” — 짜증난 환자에게 [[왜 매번 확인하는지]] 설명하기",
		"[[처음부터]] 끝까지",
	}
	for _, l := range ok {
		if errs := ValidateHubLine("SCN-ER-00001", l); len(errs) != 0 {
			t.Fatalf("%q: %v", l, errs)
		}
	}
	bad := []string{
		"   ",
		"형광펜 없는 줄",
		"[[둘]] 그리고 [[셋]]",
		"[[  ]] 빈 형광펜",
		"]]거꾸로[[",
		"[[닫히지 않음",
		"[[겹친 [[안쪽]]]]",
	}
	for _, l := range bad {
		if errs := ValidateHubLine("SCN-ER-00001", l); len(errs) == 0 {
			t.Fatalf("%q should fail", l)
		}
	}
}

func TestBundleChecksTheHubLine(t *testing.T) {
	b := validBundle()
	b.Scenarios[0].Briefing = &Briefing{Line: "형광펜 없는 줄"}
	if errs := b.Validate(); len(errs) != 1 {
		t.Fatalf("a briefing line without its span must fail loading, got %v", errs)
	}
	b.Scenarios[0].Briefing.Line = "환자에게 [[왜 확인하는지]] 설명하기"
	if errs := b.Validate(); len(errs) != 0 {
		t.Fatalf("got %v", errs)
	}
}
