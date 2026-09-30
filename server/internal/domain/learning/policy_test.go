package learning

import "testing"

func TestDefaultGuidance_passesAndLevels(t *testing.T) {
	g := DefaultGuidance{}
	// dlg: two passes — guided then free.
	if g.Passes("dlg") != 2 {
		t.Fatalf("dlg passes: want 2, got %d", g.Passes("dlg"))
	}
	if g.GuideForPass("dlg", 1) != GuideGuided {
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

// 개명(`choices` → `guided`)과 하위 호환. 이 테스트가 없으면 개명이 **진도를 조용히
// 어긋나게 한다** — 저장된 `guide` 값을 두 곳에서 문자열 `"choices"`와 직접 견주고
// 있어서, 서버가 `"guided"`를 쓰기 시작하면 가이드 회차 클리어가 자유 회차로 읽힌다.
// 그러면 혼자 해 본 적 없는 사람의 자유 회차가 완료로 찍힌다.
func TestIsGuided_readsBothTheNewNameAndTheStoredOldOne(t *testing.T) {
	if GuideGuided != "guided" {
		t.Fatalf("GuideGuided should be %q, got %q", "guided", GuideGuided)
	}
	if (DefaultGuidance{}).GuideForPass("dlg", 1) != GuideGuided {
		t.Errorf("dlg pass 1 should be the guided rung")
	}
	// 새 이름과 옛 이름이 **같은 회차**로 풀려야 한다.
	for _, stored := range []string{"guided", "choices"} {
		if !IsGuided(stored) {
			t.Errorf("stored guide %q should read as the guided pass", stored)
		}
	}
	// 나머지는 전부 자유 회차다. 빈 값은 기능 이전의 행이고 그 회차는 도움이 없었다.
	for _, stored := range []string{"free", "", "GUIDED", "choice"} {
		if IsGuided(stored) {
			t.Errorf("stored guide %q should NOT read as the guided pass", stored)
		}
	}
}
