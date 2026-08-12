package curriculum

import "sort"

// ReferencedIDs returns every content id the learning path points at, scenarios
// and quizzes alike. The seed guard uses it to refuse a content bundle that
// would delete something the path still links to — a step pointing at a missing
// id is a dead end, and the home screen's "오늘의 한 가지" would hand the learner
// a broken link.
func ReferencedIDs() []string {
	seen := map[string]bool{}
	for _, c := range catalog {
		for _, s := range c.Steps {
			if s.ScenarioID != "" {
				seen[s.ScenarioID] = true
			}
		}
	}
	ids := make([]string, 0, len(seen))
	for id := range seen {
		ids = append(ids, id)
	}
	sort.Strings(ids)
	return ids
}
