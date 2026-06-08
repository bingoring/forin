package content

import "testing"

func validBundle() *Bundle {
	return &Bundle{
		Departments: []Department{{ID: "DEPT-ER-00001", Ward: "er"}},
		Events: []Event{{
			ID: "EVT-ER-00001", Category: CatClinical, Tier: 1, Delivery: DeliveryBoth,
			Scenarios: []string{"SCN-ER-00001"}, FollowUps: []string{"EVT-ER-00002"},
		}, {ID: "EVT-ER-00002", Category: CatEmergencyCode, Tier: 3, Delivery: DeliveryMainRoute}},
		Scenarios: []Scenario{{
			ID: "SCN-ER-00001", EventID: "EVT-ER-00001",
			Steps: []Step{
				{ID: "s1", Type: StepDialogue},
				{ID: "s2", Type: StepEffect, Effects: []Directive{{Type: EffectScreen}}},
			},
		}},
	}
}

func TestValidBundlePasses(t *testing.T) {
	if errs := validBundle().Validate(); len(errs) != 0 {
		t.Fatalf("expected no errors, got %v", errs)
	}
}

func TestRejectsBadEnumAndRefs(t *testing.T) {
	b := validBundle()
	b.Events[0].Category = "nope"             // bad enum
	b.Events[0].FollowUps = []string{"EVT-X"} // missing ref (also bad slug)
	b.Scenarios[0].Steps[1].Effects[0].Type = "laser"
	errs := b.Validate()
	if len(errs) < 2 {
		t.Fatalf("expected multiple validation errors, got %v", errs)
	}
}

func TestRejectsBadSlugAndDuplicate(t *testing.T) {
	b := &Bundle{Departments: []Department{{ID: "dept1"}, {ID: "dept1"}}}
	if errs := b.Validate(); len(errs) == 0 {
		t.Fatal("expected slug-format and duplicate errors")
	}
}
