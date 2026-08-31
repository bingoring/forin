package content

import (
	"fmt"
	"regexp"
	"strings"
)

var slugRe = regexp.MustCompile(`^[A-Z]+(-[A-Z]+)*-\d{5,}$`) // e.g. EVT-ER-00001

// Validate checks the bundle for enum validity, ID format, uniqueness, and
// referential integrity. Returns all problems found (not just the first).
func (b *Bundle) Validate() []error {
	var errs []error
	add := func(format string, a ...any) { errs = append(errs, fmt.Errorf(format, a...)) }

	ids := map[string]string{} // id -> kind
	claim := func(kind, id string) {
		if id == "" {
			add("%s has empty id", kind)
			return
		}
		if !slugRe.MatchString(id) {
			add("%s id %q must be a slug with >=5-digit suffix (e.g. EVT-ER-00001)", kind, id)
		}
		if prev, ok := ids[id]; ok {
			add("duplicate id %q (%s and %s)", id, prev, kind)
		}
		ids[id] = kind
	}

	deptIDs := map[string]bool{}
	for _, d := range b.Departments {
		claim("department", d.ID)
		deptIDs[d.ID] = true
	}
	for _, in := range b.Interiors {
		claim("interior", in.ID)
	}
	scenarioIDs := map[string]bool{}
	for _, s := range b.Scenarios {
		claim("scenario", s.ID)
		scenarioIDs[s.ID] = true
	}
	quizIDs := map[string]bool{}
	for _, q := range b.Quizzes {
		claim("quiz", q.ID)
		quizIDs[q.ID] = true
	}
	for _, p := range b.Phrases {
		claim("phrase", p.ID)
	}
	eventIDs := map[string]bool{}
	for _, e := range b.Events {
		claim("event", e.ID)
		eventIDs[e.ID] = true
	}

	// Enums + cross-references.
	for _, e := range b.Events {
		if !AllowedCategories[e.Category] {
			add("event %s: unknown category %q", e.ID, e.Category)
		}
		if !AllowedDeliveries[e.Delivery] {
			add("event %s: unknown delivery %q", e.ID, e.Delivery)
		}
		if e.Tier < 1 || e.Tier > 4 {
			add("event %s: tier %d out of range 1-4", e.ID, e.Tier)
		}
		for _, ref := range append(append(append([]string{}, e.Prerequisites...), e.FollowUps...), e.Related...) {
			if !eventIDs[ref] {
				add("event %s: references unknown event %q", e.ID, ref)
			}
		}
		for _, sc := range e.Scenarios {
			if !scenarioIDs[sc] {
				add("event %s: references unknown scenario %q", e.ID, sc)
			}
		}
	}
	for _, s := range b.Scenarios {
		if !eventIDs[s.EventID] {
			add("scenario %s: unknown eventId %q", s.ID, s.EventID)
		}
		// A scenario whose dialogue steps carry `choices` is an authored guided
		// conversation. That is the marker, not the step count: the v16 content already
		// puts two dialogue steps on most scenarios (an NPC line and a player line) and
		// neither is a script.
		//
		// A half-written script is worse than none — the runtime drops the whole thing
		// silently (conversation.ScriptOf is deliberately strict), so the learner gets
		// the model-driven pass and the authoring looks like it worked. Fail here
		// instead, while somebody is looking at the file.
		if hasAuthoredChoices(s.Steps) {
			errs = append(errs, scriptProblems(s)...)
		}
		for _, st := range s.Steps {
			if !AllowedStepTypes[st.Type] {
				add("scenario %s step %s: unknown type %q", s.ID, st.ID, st.Type)
			}
			for _, eff := range st.Effects {
				if !AllowedEffectTypes[eff.Type] {
					add("scenario %s step %s: unknown effect type %q", s.ID, st.ID, eff.Type)
				}
			}
		}
	}
	for _, in := range b.Interiors {
		if !deptIDs[in.DeptID] {
			add("interior %s: unknown deptId %q", in.ID, in.DeptID)
		}
		for _, hs := range in.Hotspots {
			if hs.ScenarioID != "" && !scenarioIDs[hs.ScenarioID] {
				add("interior %s hotspot %s: unknown scenario %q", in.ID, hs.ID, hs.ScenarioID)
			}
		}
	}
	return errs
}

// hasAuthoredChoices reports whether any dialogue step offers replies — the marker of
// an authored guided conversation.
func hasAuthoredChoices(steps []Step) bool {
	for _, st := range steps {
		if st.Type != StepDialogue {
			continue
		}
		if raw, _ := st.Payload["choices"].([]any); len(raw) > 0 {
			return true
		}
	}
	return false
}

// scriptProblems checks an authored guided conversation against what the runtime will
// accept. Kept here rather than in the conversation domain because content validation
// runs at load time, where a mistake is still cheap.
//
// The rules and why each one exists:
//   - at least 7 beats (6 replies + a close). Fewer and the scaffolding runs out before
//     the learner has done anything but say their name, which is the complaint the whole
//     feature answers.
//   - every beat has a line. A beat without one has the character saying nothing while
//     the learner picks a reply to silence.
//   - every beat but the last offers exactly 3 replies, and the last offers none. The
//     guided screen has no text box: a beat with no choices in the middle strands the
//     run with nothing to do.
//   - tiers are the known set, and distinct within a beat. Three cards labelled the same
//     is not a choice between three ways of being competent.
func scriptProblems(s Scenario) []error {
	var errs []error
	add := func(format string, a ...any) { errs = append(errs, fmt.Errorf(format, a...)) }

	var beats []Step
	for _, st := range s.Steps {
		if st.Type == StepDialogue {
			beats = append(beats, st)
		}
	}
	if len(beats) < 7 {
		add("scenario %s: authored conversation has %d beats, want at least 7 (6 replies + a close)", s.ID, len(beats))
	}
	for i, st := range beats {
		last := i == len(beats)-1
		if line, _ := st.Payload["lineEn"].(string); strings.TrimSpace(line) == "" {
			add("scenario %s beat %d (%s): no lineEn", s.ID, i, st.ID)
		}
		raw, _ := st.Payload["choices"].([]any)
		if last {
			if len(raw) != 0 {
				add("scenario %s beat %d (%s): the closing beat must offer no choices", s.ID, i, st.ID)
			}
			continue
		}
		if len(raw) != 3 {
			add("scenario %s beat %d (%s): %d choices, want 3", s.ID, i, st.ID, len(raw))
			continue
		}
		seen := map[string]bool{}
		for j, v := range raw {
			m, ok := v.(map[string]any)
			if !ok {
				add("scenario %s beat %d choice %d: not a mapping", s.ID, i, j)
				continue
			}
			text, _ := m["text"].(string)
			if strings.TrimSpace(text) == "" {
				add("scenario %s beat %d choice %d: empty text", s.ID, i, j)
			}
			tier, _ := m["tier"].(string)
			if !AllowedTiers[ChoiceTier(tier)] {
				add("scenario %s beat %d choice %d: unknown tier %q", s.ID, i, j, tier)
			}
			if seen[tier] {
				add("scenario %s beat %d: tier %q appears twice", s.ID, i, tier)
			}
			seen[tier] = true
		}
	}
	return errs
}
