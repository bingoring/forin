package main

// Depts is assembled from per-file init() appends (depts.go, depts2.go) so the
// 25-department banks can be split across files. Order is stable (file name, then
// literal order) which keeps cross-department `related` links deterministic.
var Depts []Dept

// Dept is a department's curated bank: identity + clinical topic list. Topics are
// expanded (× patient persona × difficulty) into ≥ target scenarios.
type Dept struct {
	Code, Name, Label, Color, Tone, Accent string
	Topics                                 []Topic
}

// Topic is one curated clinical situation. Room is the sub-location shown as
// "<Label> · <Room>". Role drives the persona pool + default mood set.
type Topic struct {
	Title, Tagline, Room, Brief, Role string
	Diff                              int
	Skills, Phrases, Goals, Guard     []string
	Moods                             []string // optional; default by role
	// Acuity marks a situation that is HAPPENING, not one being taught about —
	// it decides which reputation dimension a clear moves. Curated per topic
	// because prose can't be sniffed reliably: "낙상 외상 사정" is an emergency,
	// "낙상 예방 교육" is a lesson. Empty = routine.
	Acuity string
}

// urgentTopics marks curated topics as urgent/critical by exact title. Kept as a
// table rather than keyword matching so every entry is a reviewed decision.
var urgentTopics = map[string]string{
	"Code Blue 콜 응대": "critical",
	"소아 Code 대응":     "critical",
	"산후 출혈 대응":       "critical",
	"증상 급변 대응":       "critical",
	"호흡곤란 초기 평가":     "urgent",
	"낙상 외상 사정":       "urgent",
	"낙상·머리 손상 관찰":    "urgent",
	"소아 열경련 부모 안내":   "urgent",
	"모니터 알람 해석":      "urgent",
	"무호흡·서맥 알람 설명":   "urgent",
	"장비 알람 대응":       "urgent",
	"ICU 섬망 대응":      "urgent",
	"패혈증 상태 설명":      "urgent",
	"자살 위험 사정":       "urgent",
}

// acuityOf returns the topic's curated acuity ("" = routine).
func (t Topic) acuityOf() string {
	if t.Acuity != "" {
		return t.Acuity
	}
	return urgentTopics[t.Title]
}

func (t Topic) Mood() string {
	m := t.moodSet()
	return m[0]
}
func (t Topic) moodSet() []string {
	if len(t.Moods) > 0 {
		return t.Moods
	}
	if m, ok := roleMoods[t.Role]; ok {
		return m
	}
	return []string{"neutral"}
}
func moodForVariant(t Topic, variant int) string {
	m := t.moodSet()
	return m[variant%len(m)]
}

var roleMoods = map[string][]string{
	"patient":    {"worried", "pain", "anxious", "sad", "neutral"},
	"parent":     {"worried", "anxious", "panic", "sad"},
	"family":     {"worried", "sad", "anxious"},
	"child":      {"scared", "shy", "sad"},
	"colleague":  {"focused", "neutral"},
	"doctor":     {"focused", "neutral"},
	"nurse":      {"focused", "neutral"},
	"pharmacist": {"focused", "neutral"},
}

var moodPersonality = map[string]string{
	"worried": "불안해하며 상황을 이해하려 애씀.", "pain": "통증으로 짧게 말하며 참으려 함.",
	"anxious": "긴장해 질문이 많음.", "sad": "가라앉아 조용히 반응함.", "neutral": "차분하고 협조적임.",
	"panic": "당황해 말이 빨라짐.", "scared": "겁먹어 위축됨.", "shy": "낯을 가리며 조심스러움.",
	"focused": "전문적이고 간결하게 소통함.",
}
var moodSpeaking = map[string]string{
	"worried": "머뭇거리며 확인을 반복함.", "pain": "숨차서 끊어 말함.", "anxious": "빠르게 여러 질문을 함.",
	"sad": "느리고 낮은 목소리.", "neutral": "또박또박 명확히.", "panic": "말이 빠르고 격앙됨.",
	"scared": "작은 목소리로 더듬음.", "shy": "짧게 대답함.", "focused": "요점 위주로 빠르게.",
}

// Persona is a reusable patient/colleague profile for variety.
type Persona struct{ Name, Age, Sub, Hair, HairStyle string }

var patients = []Persona{
	{"Mr. Robinson", "50s", "58y / Male", "#4A4A4A", "short"}, {"Mrs. Hopkins", "60s", "67y / Female", "#9A6B3F", "bob"},
	{"Ms. Alvarez", "30s", "34y / Female", "#2A1E14", "long"}, {"Mr. Chen", "40s", "45y / Male", "#1C1C1C", "short"},
	{"Mrs. Kelly", "70s", "72y / Female", "#B0B0B0", "bob"}, {"Mr. Okafor", "50s", "54y / Male", "#111111", "short"},
	{"Ms. Nguyen", "20s", "26y / Female", "#1A1A1A", "long"}, {"Mr. Patel", "60s", "63y / Male", "#3B2A1A", "short"},
	{"Mrs. Rossi", "50s", "51y / Female", "#5A3A22", "bob"}, {"Mr. Johnson", "40s", "42y / Male", "#2E2E2E", "short"},
	{"Ms. Bauer", "30s", "38y / Female", "#C9A24B", "long"}, {"Mr. Silva", "70s", "76y / Male", "#9C9C9C", "short"},
	{"Mrs. Adeyemi", "40s", "47y / Female", "#0F0F0F", "bob"}, {"Mr. Larsson", "50s", "59y / Male", "#D8B26A", "short"},
	{"Ms. Park", "20s", "29y / Female", "#141414", "long"}, {"Mr. Thompson", "60s", "68y / Male", "#8A8A8A", "short"},
	{"Mrs. Haddad", "30s", "33y / Female", "#241812", "bob"}, {"Mr. Yamamoto", "50s", "56y / Male", "#161616", "short"},
	{"Ms. O'Brien", "40s", "41y / Female", "#7A4A22", "long"}, {"Mr. Dubois", "60s", "64y / Male", "#5A5A5A", "short"},
	{"Mrs. Santos", "70s", "74y / Female", "#A0A0A0", "bob"}, {"Mr. Wagner", "40s", "48y / Male", "#3A2A1A", "short"},
	{"Ms. Ivanova", "30s", "31y / Female", "#C9A24B", "long"}, {"Mr. Reyes", "50s", "53y / Male", "#1C1C1C", "short"},
}
var colleagues = []Persona{
	{"Dr. Lee", "40s", "Attending", "#1C1C1C", "short"}, {"Charge Nurse Kim", "30s", "Charge RN", "#241812", "bob"},
	{"Dr. Novak", "50s", "Surgeon", "#5A5A5A", "short"}, {"RN Sofia", "20s", "Staff RN", "#2A1E14", "long"},
	{"Dr. Ahmed", "40s", "Resident", "#111111", "short"}, {"Pharmacist Cho", "30s", "PharmD", "#3B2A1A", "bob"},
	{"RN Marcus", "40s", "Charge RN", "#2E2E2E", "short"}, {"Dr. Weber", "50s", "Attending", "#8A8A8A", "short"},
}
var parents = []Persona{
	{"Mrs. Coleman", "30s", "Mother", "#241812", "long"}, {"Mr. Fischer", "30s", "Father", "#1C1C1C", "short"},
	{"Mrs. Aoki", "20s", "Mother", "#141414", "bob"}, {"Mr. Delgado", "40s", "Father", "#2E2E2E", "short"},
	{"Mrs. Bello", "30s", "Mother", "#0F0F0F", "long"}, {"Mr. Novak", "30s", "Father", "#3B2A1A", "short"},
}

func personaFor(role string, deptIdx, k int) Persona {
	var pool []Persona
	switch role {
	case "colleague", "doctor", "nurse", "pharmacist":
		pool = colleagues
	case "parent":
		pool = parents
	default:
		pool = patients
	}
	return pool[(deptIdx*7+k)%len(pool)]
}
