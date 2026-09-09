package themed

import "sort"

// ThemeStat is one theme's tagging coverage.
type ThemeStat struct {
	Key   string
	Count int
	Thin  bool // Count < minDepth (R2/R-P2-4)
}

// AuditReport summarizes tagging coverage for curation (P2). Scope note: the
// input tags should be AUTHORED scenarios (SCN-*). User-generated scenarios,
// when they exist, belong to user bundles and are not expected to carry a theme.
type AuditReport struct {
	Themes      []ThemeStat // registry order
	Orphans     []string    // authored scenario ids with no known theme
	Duplicates  []string    // "dept: title" seen more than once
	TotalTagged int
}

// Audit summarizes theme coverage. minDepth marks themes below the depth target
// as Thin. Pure; no I/O.
func Audit(themes []Theme, tags []ScenarioTag, minDepth int) AuditReport {
	_, orphans := Assemble(themes, tags)
	known := map[string]bool{}
	for _, th := range themes {
		known[th.Key] = true
	}
	count := map[string]int{}
	titleSeen := map[string]int{}
	dupSet := map[string]bool{}
	tagged := 0
	for _, tg := range tags {
		if tg.Theme != "" && known[tg.Theme] {
			count[tg.Theme]++
			tagged++
		}
		key := tg.Dept + ": " + tg.Title
		titleSeen[key]++
		if titleSeen[key] == 2 {
			dupSet[key] = true
		}
	}
	stats := make([]ThemeStat, 0, len(themes))
	for _, th := range themes {
		c := count[th.Key]
		stats = append(stats, ThemeStat{Key: th.Key, Count: c, Thin: c < minDepth})
	}
	dups := make([]string, 0, len(dupSet))
	for k := range dupSet {
		dups = append(dups, k)
	}
	sort.Strings(dups)
	return AuditReport{Themes: stats, Orphans: orphans, Duplicates: dups, TotalTagged: tagged}
}

// TopicCount is how many scenarios share one topic (title prefix) in one dept.
type TopicCount struct {
	Dept  string
	Topic string
	Count int
}

// TopicDistribution groups scenarios by (dept, topic) where topic is the title
// with its persona suffix dropped (generated titles are "<topic> · <name>").
// This is the pre-tagging view that reveals which topics cluster into a theme
// of ≥20 — the raw material for authoring themes.yaml. Sorted dept asc, then
// count desc, then topic asc (deterministic).
func TopicDistribution(tags []ScenarioTag) []TopicCount {
	byKey := map[string]int{}
	meta := map[string]TopicCount{}
	for _, tg := range tags {
		topic := stepName(tg.Title)
		key := tg.Dept + "\x00" + topic
		byKey[key]++
		meta[key] = TopicCount{Dept: tg.Dept, Topic: topic}
	}
	out := make([]TopicCount, 0, len(byKey))
	for k, c := range byKey {
		m := meta[k]
		m.Count = c
		out = append(out, m)
	}
	sort.Slice(out, func(i, j int) bool {
		if out[i].Dept != out[j].Dept {
			return out[i].Dept < out[j].Dept
		}
		if out[i].Count != out[j].Count {
			return out[i].Count > out[j].Count
		}
		return out[i].Topic < out[j].Topic
	})
	return out
}
