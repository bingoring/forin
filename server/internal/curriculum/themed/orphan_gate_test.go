package themed

import "testing"

// R3: every scenario must belong to exactly one theme (orphans == 0). This is a
// P2 gate — it turns on once 전수조사 tagging fills theme tags for the full
// content set. Until then it stays skipped so P1 (empty/partial tags) is green.
//
// When enabling in P2: load content/nurse/themes.yaml via LoadThemes, project
// every scenario to a ScenarioTag (as ContentRepo.ListScenarioTags does), run
// Assemble, and assert len(orphans) == 0 — naming the first few offenders.
func TestNoOrphans_fullContent(t *testing.T) {
	t.Skip("P2 게이트: 전수조사 태깅 완료 후 활성화 — themes.yaml + 태그된 시나리오로 Assemble해 orphans==0 검증")
}
