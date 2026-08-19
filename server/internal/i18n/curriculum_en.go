package i18n

// English names for the learning path: 89 curricula and the 24 floor headings.
//
// Step names are not here yet — there are ~400 of them and they fall back to the
// authored Korean until translated, which is the fallback working as designed
// rather than a gap that breaks a screen. Coverage() reports the real figure.
func init() {
	register("en", map[string]string{
		// ── situation state labels ───────────────────────────────────────────
		"tag.cleared": "Done",
		"tag.urgent":  "Urgent",
		"tag.new":     "New",

		// ── floor headings (building|floor) ──────────────────────────────────
		"본관|1F":   "Main 1F · Emergency Centre",
		"본관|P1":   "Main P1 · Central Pharmacy",
		"본관|3F":   "Main 3F · Operating Rooms · PACU",
		"본관|4F":   "Main 4F · ICU",
		"본관|8F":   "Main 8F · General Medical Ward",
		"본관|7F":   "Main 7F · General Surgical Ward",
		"본관|6F":   "Main 6F · Orthopaedic Ward",
		"본관|2F":   "Main 2F · Dermatology Centre",
		"별관 1|1F": "Annex 1 1F · Paediatric & Obstetric Clinic",
		"별관 1|2F": "Annex 1 2F · General Paediatric Ward",
		"별관 1|3F": "Annex 1 3F · Family Delivery Suite · Nursery",
		"별관 1|4F": "Annex 1 4F · Neonatal & Paediatric ICU",
		"별관 2|1F": "Annex 2 1F · Rehabilitation Gym",
		"별관 2|2F": "Annex 2 2F · Psychiatric Ward",
		"별관 2|3F": "Annex 2 3F · Oncology Ward · Transplant",
		"별관 2|4F": "Annex 2 4F · Palliative Care · Geriatrics",
		"별관 3|1F": "Annex 3 1F · Radiology",
		"별관 3|2F": "Annex 3 2F · Specialty Clinics",
		"별관 3|3F": "Annex 3 3F · Infusion Centre · Dialysis",
		"별관 3|4F": "Annex 3 4F · Endoscopy · Cath Lab",
		"지원동|B1":  "Support Wing B1 · Mortuary",
		"지원동|1F":  "Support Wing 1F · Central Sterile Supply",
		"지원동|2F":  "Support Wing 2F · Staff Lounge",
		"지원동|3F":  "Support Wing 3F · Simulation Lab",

		// ── 본관 1F 응급의료센터 ─────────────────────────────────────────────
		"본관|1F|orientation": "First shift · taking the handover",
		"본관|1F|triage":      "Intake and triage",
		"본관|1F|trauma":      "Trauma · brought in",
		"본관|1F|children":    "Children and their parents",
		"본관|1F|crisis":      "Patients in crisis",

		// ── 본관 P1 중앙 약제부 ──────────────────────────────────────────────
		"본관|P1|dispense": "Checks before it leaves the counter",
		"본관|P1|compound": "Compounding and dosing",
		"본관|P1|teaching": "Teaching people their medicines",
		"본관|P1|withward": "Checking with the ward",

		// ── 본관 3F 수술실 · PACU ────────────────────────────────────────────
		"본관|3F|preop":   "Before the incision",
		"본관|3F|intraop": "Inside the operating room",
		"본관|3F|pacu":    "Recovery room",
		"본관|3F|team":    "To the family and the team",

		// ── 본관 4F ICU ──────────────────────────────────────────────────────
		"본관|4F|monitor":   "Monitors and alarms",
		"본관|4F|vent":      "Ventilated patients",
		"본관|4F|delirium":  "Delirium and deterioration",
		"본관|4F|endoflife": "Code blue and the end of life",

		// ── 본관 8F 내과 병동 ────────────────────────────────────────────────
		"본관|8F|admission":     "The first day on the ward",
		"본관|8F|chronic":       "Teaching chronic conditions",
		"본관|8F|deterioration": "Deterioration and handover",

		// ── 본관 7F 외과 병동 ────────────────────────────────────────────────
		"본관|7F|postop":   "First meeting after surgery",
		"본관|7F|recovery": "Helping recovery along",
		"본관|7F|warning":  "Warning signs",

		// ── 본관 6F 정형외과 병동 ────────────────────────────────────────────
		"본관|6F|fracture": "Admitting a fracture",
		"본관|6F|walking":  "Back on their feet",
		"본관|6F|watch":    "What you cannot miss",

		// ── 본관 2F 피부과 센터 ──────────────────────────────────────────────
		"본관|2F|lesion":      "An eye for skin",
		"본관|2F|light":       "Phototherapy and lasers",
		"본관|2F|chronicskin": "People who live with it",

		// ── 별관 1 여성소아 센터 ─────────────────────────────────────────────
		"별관 1|1F|prenatal":         "Before and after birth",
		"별관 1|1F|womenhealth":      "Women's health consultations",
		"별관 1|1F|withparent":       "Parents who brought a child",
		"별관 1|2F|meetchild":        "Meeting a child for the first time",
		"별관 1|2F|teachparent":      "Teaching the parents",
		"별관 1|2F|urgentchild":      "A child in a hurry, a frightened parent",
		"별관 1|3F|labor":            "Delivery · through the contractions",
		"별관 1|3F|firsttouch":       "Delivery · the first contact",
		"별관 1|3F|highrisk":         "Delivery · high-risk birth",
		"별관 1|3F|newbornassess":    "Nursery · the first assessment",
		"별관 1|3F|newbornteach":     "Nursery · teaching the parents",
		"별관 1|3F|newborndischarge": "Nursery · up to discharge",
		"별관 1|4F|nicufamily":       "NICU · a parent's first hours",
		"별관 1|4F|nicugrow":         "NICU · a baby growing",
		"별관 1|4F|nicucritical":     "NICU · the precarious moments",
		"별관 1|4F|picufamily":       "PICU · a frightened family",
		"별관 1|4F|picusedation":     "PICU · sedation and pain",
		"별관 1|4F|picucode":         "PICU · codes and handover",

		// ── 별관 2 특수 치료 센터 ────────────────────────────────────────────
		"별관 2|1F|goals":          "Goals for walking again",
		"별관 2|1F|daily":          "Back to everyday life",
		"별관 2|1F|confidence":     "Confidence that broke",
		"별관 2|2F|rapport":        "Conversations that build trust",
		"별관 2|2F|crisis":         "The moment of crisis",
		"별관 2|2F|safety":         "Safety plans and follow-up",
		"별관 2|3F|sideeffects":    "The cost of treatment",
		"별관 2|3F|treatment":      "A body still in treatment",
		"별관 2|3F|goalstalk":      "How far to go",
		"별관 2|4F|hospicecomfort": "Hospice · making someone comfortable",
		"별관 2|4F|hospicetalk":    "Hospice · the hard conversations",
		"별관 2|4F|hospiceend":     "Hospice · the end and after",
		"별관 2|4F|gerisafety":     "Geriatrics · keeping them upright",
		"별관 2|4F|gerimind":       "Geriatrics · a fading memory",
		"별관 2|4F|geridignity":    "Geriatrics · hands that keep dignity",

		// ── 별관 3 진단·검사 센터 ────────────────────────────────────────────
		"별관 3|1F|scanfear":       "Frightened in front of a machine",
		"별관 3|1F|scanprep":       "What to check before the scan",
		"별관 3|1F|scanafter":      "After the scan",
		"별관 3|2F|firstvisit":     "A first-time patient",
		"별관 3|2F|keepgoing":      "What makes them come back",
		"별관 3|2F|worsening":      "Signs of getting worse",
		"별관 3|3F|infusionstart":  "Infusion · starting the drip",
		"별관 3|3F|infusionlong":   "Infusion · people who come for months",
		"별관 3|3F|infusionsafety": "Infusion · safety during the drip",
		"별관 3|3F|dialstart":      "Dialysis · starting treatment",
		"별관 3|3F|dialteach":      "Dialysis · what to keep to at home",
		"별관 3|3F|dialalarm":      "Dialysis · when something goes wrong",
		"별관 3|4F|endoprep":       "Preparing for the procedure",
		"별관 3|4F|sedation":       "Managing sedation",
		"별관 3|4F|endoafter":      "After they wake",

		// ── 지원동 ───────────────────────────────────────────────────────────
		"지원동|B1|procedure": "The procedures that keep dignity",
		"지원동|B1|bereaved":  "Facing the bereaved",
		"지원동|B1|staff":     "The people left behind",
		"지원동|1F|requests":  "On the receiving end of requests",
		"지원동|1F|sterile":   "Hands that keep it sterile",
		"지원동|1F|escalate":  "How to escalate a problem",
		"지원동|2F|smalltalk": "Breaking the ice with colleagues",
		"지원동|2F|burnout":   "Beside someone worn out",
		"지원동|2F|hardtosay": "The things that are hard to say",
		"지원동|3F|prepare":   "Ready to learn",
		"지원동|3F|debrief":   "Looking back over it",
		"지원동|3F|rehearse":  "Like the real thing",
	})
}
