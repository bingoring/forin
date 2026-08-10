package access

import "testing"

func learner() Learner {
	return Learner{
		Level:         12,
		Cleared:       map[string]bool{"SCN-ER-00001": true},
		EquippedTitle: "ward_friend",
		Reputation:    map[string]int{"peer_trust": 70, "patient_satisfaction": 20},
		Missions:      map[string]bool{"veteran": true},
	}
}

func TestNoRequirementsIsOpen(t *testing.T) {
	if ok, _ := Evaluate(nil, learner()); !ok {
		t.Fatal("a room with no requirements must be open")
	}
}

func TestEachKind(t *testing.T) {
	l := learner()
	cases := []struct {
		name string
		req  Requirement
		want bool
	}{
		{"level met", Requirement{Kind: KindLevel, Value: 10}, true},
		{"level unmet", Requirement{Kind: KindLevel, Value: 20}, false},
		{"cleared met", Requirement{Kind: KindCleared, Key: "SCN-ER-00001"}, true},
		{"cleared unmet", Requirement{Kind: KindCleared, Key: "SCN-ER-99999"}, false},
		{"title met", Requirement{Kind: KindTitle, Key: "ward_friend"}, true},
		{"title unmet", Requirement{Kind: KindTitle, Key: "hidden_hero"}, false},
		{"reputation met", Requirement{Kind: KindReputation, Key: "peer_trust", Value: 60}, true},
		{"reputation unmet", Requirement{Kind: KindReputation, Key: "patient_satisfaction", Value: 60}, false},
		{"mission met", Requirement{Kind: KindMission, Key: "veteran"}, true},
		{"mission unmet", Requirement{Kind: KindMission, Key: "beloved"}, false},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			ok, reason := Evaluate([]Requirement{c.req}, l)
			if ok != c.want {
				t.Fatalf("Evaluate(%+v) = %v, want %v", c.req, ok, c.want)
			}
			if !ok && reason == "" {
				t.Fatal("a locked door must say why — a lock without a reason isn't a goal")
			}
		})
	}
}

func TestAllRequirementsMustPass(t *testing.T) {
	l := learner()
	reqs := []Requirement{
		{Kind: KindLevel, Value: 5},                          // met
		{Kind: KindReputation, Key: "peer_trust", Value: 90}, // not met
	}
	ok, reason := Evaluate(reqs, l)
	if ok {
		t.Fatal("one unmet requirement must lock the whole thing")
	}
	if reason == "" {
		t.Fatal("expected the unmet requirement's reason")
	}
}

func TestUnknownKindFailsClosed(t *testing.T) {
	// Content we don't understand must not open a door.
	ok, reason := Evaluate([]Requirement{{Kind: Kind("teleport")}}, learner())
	if ok {
		t.Fatal("an unknown requirement kind must fail closed")
	}
	if reason == "" {
		t.Fatal("expected a neutral reason")
	}
}

func TestAllowedSets(t *testing.T) {
	for k := range AllowedKinds {
		if !k.Valid() {
			t.Errorf("%q should be valid", k)
		}
	}
	if Kind("nope").Valid() {
		t.Error("an unlisted kind must not validate")
	}
	if !AllowedRewards[RewardUnlock] {
		t.Error("unlock must be a reward type — it is what makes gating a reward loop")
	}
}
