package content

import (
	"fmt"
	"strings"
)

// The hub's one line (lesson-fidelity-v46 T6, handoff forin-notebook-lesson.jsx L126):
//
//	“또 물어요? 아까도 말했잖아요.” — 짜증난 환자에게 [[왜 매번 확인하는지]] 설명하기
//
// Briefing.Line is optional; without it the hub falls back to the brief, unmarked
// (§R3). With it, the line carries exactly one highlighted span — the thing to do —
// written between [[ and ]]. The client draws that span under the highlighter.
const (
	HubMarkOpen  = "[["
	HubMarkClose = "]]"
)

// ValidateHubLine checks a briefing line: empty is fine (not authored); anything else
// must be non-blank and hold exactly one non-blank [[span]].
func ValidateHubLine(scenario, line string) []error {
	if line == "" {
		return nil
	}
	bad := func(why string) []error {
		return []error{fmt.Errorf("scenario %s briefing.line: %s: %q", scenario, why, line)}
	}
	if strings.TrimSpace(line) == "" {
		return bad("blank")
	}
	if strings.Count(line, HubMarkOpen) != 1 || strings.Count(line, HubMarkClose) != 1 {
		return bad("needs exactly one [[highlighted]] span")
	}
	i, j := strings.Index(line, HubMarkOpen), strings.Index(line, HubMarkClose)
	if j < i || strings.TrimSpace(line[i+len(HubMarkOpen):j]) == "" {
		return bad("the [[span]] is empty or reversed")
	}
	return nil
}
