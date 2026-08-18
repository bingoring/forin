package curriculum

import "strings"

// scenarioToKey maps every content id on the path to the curriculum holding it.
//
// Built once at process start: the catalog is immutable, so rebuilding this per
// request would be pure waste on the app's first screen. A scenario appears in at
// most one curriculum (business-rules R3, enforced by catalog_test.go), so the
// map is unambiguous.
var scenarioToKey = func() map[string]string {
	m := make(map[string]string, 400)
	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID != "" {
				m[s.ScenarioID] = c.Key
			}
		}
	}
	return m
}()

// KeyForScenario returns the key of the curriculum containing a scenario, or ""
// when the scenario is not on the path at all — a situation picked from the
// department sheet is playable but belongs to no curriculum, and the home screen
// must not treat it as the thing to continue (business-rules R12).
func KeyForScenario(scenarioID string) string { return scenarioToKey[scenarioID] }

// CoveredDeptCodes returns the department bank codes the authored path draws
// from, extracted from step ids ("SCN-WARD-00101" → "WARD").
//
// cmd/gencontent calls this to decide which departments still need the difficulty
// fallback (business-rules R7). It lives here rather than in the generator so that
// "what is covered" is answered by the catalog itself and cannot drift from it.
func CoveredDeptCodes() map[string]bool {
	out := map[string]bool{}
	for _, c := range authored {
		for _, s := range c.Steps {
			if code := deptCodeOf(s.ScenarioID); code != "" {
				out[code] = true
			}
		}
	}
	return out
}

// deptCodeOf pulls the bank code out of a content id. Ids are "<KIND>-<CODE>-<n>",
// and CODE itself never contains a hyphen.
func deptCodeOf(id string) string {
	first := strings.Index(id, "-")
	if first < 0 {
		return ""
	}
	rest := id[first+1:]
	second := strings.Index(rest, "-")
	if second <= 0 {
		return ""
	}
	return rest[:second]
}
