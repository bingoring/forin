// Package reputation decides WHICH standing a cleared scenario moves and by how
// much. The consuming side (NPC disposition in the conversation engine) already
// existed; nothing ever produced the values, so every learner sat at the default
// forever and the four disposition bands collapsed into one.
//
// Two design points worth keeping:
//
//   - The dimension is chosen from the scenario's own ACUITY and the persona's
//     role — never from a department string. A ward patient can crash, a theatre
//     can go wrong, a pharmacy can hand over the wrong vial: urgency is a property
//     of the situation, not of a place. Keying on department would also have to be
//     rewritten wholesale for the next profession.
//   - Dimensions belong to a PROFESSION, not to the app. "Patient satisfaction"
//     means nothing to a programmer. Adding a profession is adding a catalog entry.
package reputation

import "strings"

// Dimension is one axis of standing. Values are the storage keys, so a future
// key-value table can use them verbatim.
type Dimension string

const (
	DimPatientSatisfaction Dimension = "patient_satisfaction"
	DimPeerTrust           Dimension = "peer_trust"
	DimEmergencyResponse   Dimension = "emergency_response"
)

// Acuity is how urgent a scenario is, declared by the content itself.
type Acuity string

const (
	AcuityRoutine  Acuity = "routine"  // default when a scenario says nothing
	AcuityUrgent   Acuity = "urgent"   // something went sideways — possible anywhere
	AcuityCritical Acuity = "critical" // code blue, rapid deterioration
)

// NormalizeAcuity maps authored content onto the allowed set. Unknown or missing
// values become routine: content must never be able to break the app, and
// back-filling every existing scenario is not a precondition for shipping this.
func NormalizeAcuity(s string) Acuity {
	switch Acuity(strings.ToLower(strings.TrimSpace(s))) {
	case AcuityUrgent:
		return AcuityUrgent
	case AcuityCritical:
		return AcuityCritical
	default:
		return AcuityRoutine
	}
}

// Routine reports whether this acuity is the everyday case.
func (a Acuity) Routine() bool { return a != AcuityUrgent && a != AcuityCritical }

// Spec is one dimension as it should be shown. The LABEL lives here, on the
// server, because it is profession vocabulary: a client that hardcodes
// "환자 만족도" has to be rebuilt the day a non-clinical profession ships.
type Spec struct {
	Key   Dimension `json:"key"`
	Label string    `json:"label"`
}

// Catalog is one profession's reputation model: which dimensions exist (in
// display order), which persona roles count as "a colleague" in that trade, and
// which dimension each role group reads.
type Catalog struct {
	Profession     string
	Specs          []Spec // display order is meaningful
	ColleagueRoles []string
	Peer           Dimension // a colleague in a routine situation
	Client         Dimension // the person being served (patient, customer, …)
	Urgent         Dimension // anything non-routine, whoever it is with
}

// Dims returns just the keys, in display order.
func (c Catalog) Dims() []Dimension {
	out := make([]Dimension, 0, len(c.Specs))
	for _, s := range c.Specs {
		out = append(out, s.Key)
	}
	return out
}

// Has reports whether this profession uses the dimension — used to ignore stored
// rows left over from another profession's model.
func (c Catalog) Has(d Dimension) bool {
	for _, s := range c.Specs {
		if s.Key == d {
			return true
		}
	}
	return false
}

// Valid reports whether this catalog is usable (a zero Catalog is not).
func (c Catalog) Valid() bool { return c.Profession != "" && len(c.Specs) > 0 }

var catalogs = map[string]Catalog{
	"nurse": {
		Profession: "nurse",
		Specs: []Spec{
			{Key: DimPatientSatisfaction, Label: "환자 만족도"},
			{Key: DimPeerTrust, Label: "동료 신뢰도"},
			{Key: DimEmergencyResponse, Label: "응급 대응력"},
		},
		ColleagueRoles: []string{
			"doctor", "physician", "surgeon", "nurse", "colleague", "charge",
			"resident", "attending", "pharmacist", "therapist", "technician",
		},
		Peer:   DimPeerTrust,
		Client: DimPatientSatisfaction,
		Urgent: DimEmergencyResponse,
	},
}

// CatalogFor returns the profession's catalog. An unknown profession yields an
// invalid catalog and the caller skips applying anything — moving the wrong axis
// is worse than moving none (Build Spec R-8).
func CatalogFor(profession string) Catalog {
	return catalogs[strings.ToLower(strings.TrimSpace(profession))]
}

// Resolve picks the dimension a clear should move.
//
// Acuity wins over role: in an emergency what is being judged is the response,
// even when the other party is a colleague.
func (c Catalog) Resolve(personaRole string, acuity Acuity) Dimension {
	if !acuity.Routine() {
		return c.Urgent
	}
	role := strings.ToLower(personaRole)
	for _, k := range c.ColleagueRoles {
		if strings.Contains(role, k) {
			return c.Peer
		}
	}
	// No role authored → the person being served. Most scenarios are that.
	return c.Client
}

// Delta converts a 0..100 AI grade into a reputation change, with the pass score
// as the pivot: a bare pass moves nothing, because scraping through is not the
// same as doing well. Gain and loss are scaled separately so recovering is easier
// than falling — this is a learning app, not a punishment.
//
// The result is monotonic in grade (Build Spec INV-3).
func Delta(grade, pass, gainMax, lossMax int) int {
	switch {
	case grade < 0:
		return 0 // ungraded (direct/legacy clear) — nothing to judge
	case grade > 100:
		grade = 100
	}
	if pass <= 0 || pass >= 100 {
		return 0 // nonsensical config; refuse rather than guess
	}
	if grade >= pass {
		return atLeastOne(roundDiv(gainMax*(grade-pass), 100-pass), grade-pass)
	}
	return -atLeastOne(roundDiv(lossMax*(pass-grade), pass), pass-grade)
}

// atLeastOne keeps the scale from erasing a real difference. With a small gain
// budget spread over a wide grade range, integer scaling rounds the first few
// points either side of the pivot down to zero — so 61 and 60 would be the same
// clear. Anything strictly off the pivot moves by at least one.
func atLeastOne(scaled, distance int) int {
	if distance > 0 && scaled == 0 {
		return 1
	}
	return scaled
}

// roundDiv divides with round-half-up.
func roundDiv(n, d int) int {
	if d == 0 {
		return 0
	}
	return (n + d/2) / d
}

// Clamp keeps a stored value inside the displayable 0..100 range (INV-1).
func Clamp(v int) int {
	if v < 0 {
		return 0
	}
	if v > 100 {
		return 100
	}
	return v
}

// Default is the starting value for a dimension with no stored row yet.
const Default = 50
