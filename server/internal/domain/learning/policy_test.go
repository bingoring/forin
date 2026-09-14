package learning

import "testing"

func TestDefaultGuidance_passesAndLevels(t *testing.T) {
	g := DefaultGuidance{}
	// dlg: two passes — guided then free.
	if g.Passes("dlg") != 2 {
		t.Fatalf("dlg passes: want 2, got %d", g.Passes("dlg"))
	}
	if g.GuideForPass("dlg", 1) != GuideChoices {
		t.Errorf("dlg pass 1 should be choices")
	}
	if g.GuideForPass("dlg", 2) != GuideFree {
		t.Errorf("dlg pass 2 should be free")
	}
	// boss/quiz: one pass, free.
	for _, k := range []string{"boss", "quiz"} {
		if g.Passes(k) != 1 {
			t.Errorf("%s passes: want 1, got %d", k, g.Passes(k))
		}
		if g.GuideForPass(k, 1) != GuideFree {
			t.Errorf("%s pass 1 should be free", k)
		}
	}
}

func TestDefaultTierUnlock(t *testing.T) {
	u := DefaultTierUnlock{}
	if !u.Unlocked(true) || u.Unlocked(false) {
		t.Fatalf("unlock should mirror prevTierDone")
	}
}

func TestDefaultExam(t *testing.T) {
	e := DefaultExam{}
	if !e.HasExam(nil) {
		t.Errorf("omitted exam should default on")
	}
	yes, no := true, false
	if !e.HasExam(&yes) {
		t.Errorf("exam:true should be on")
	}
	if e.HasExam(&no) {
		t.Errorf("exam:false should be off")
	}
}
