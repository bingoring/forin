package content

import (
	"fmt"
	"regexp"
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

	for _, d := range b.Departments {
		claim("department", d.ID)
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
	return errs
}
