// Package access turns what a learner has earned into what they may enter.
//
// This is the "유기적 환류" half of the growth system: rewards stop being a
// scoreboard and become keys. A room can require a level, a cleared scenario, an
// equipped title, a standing, or a discovered mission — and the same vocabulary
// works for hotspots, so content decides what gates what without new code.
//
// Requirements are evaluated SEPARATELY from the map payload: interiors are
// public and cached by id on the client, while access is per-learner and must
// never be cached alongside them.
package access

import (
	"fmt"
	"strings"
)

// Kind is a requirement type. Code-side allowed set (no DB CHECK) so a new gate
// is a new case here plus content, never a migration.
type Kind string

const (
	KindLevel      Kind = "level"      // Value = minimum level
	KindCleared    Kind = "cleared"    // Key = scenario id
	KindTitle      Kind = "title"      // Key = equipped title id
	KindReputation Kind = "reputation" // Key = dimension, Value = minimum
	KindMission    Kind = "mission"    // Key = discovered hidden-mission id
)

var AllowedKinds = map[Kind]bool{
	KindLevel: true, KindCleared: true, KindTitle: true, KindReputation: true, KindMission: true,
}

func (k Kind) Valid() bool { return AllowedKinds[k] }

// Requirement is one condition. Authored as content on a room or hotspot.
type Requirement struct {
	Kind  Kind   `yaml:"kind" json:"kind"`
	Key   string `yaml:"key" json:"key,omitempty"`
	Value int    `yaml:"value" json:"value,omitempty"`
}

// RewardType is what a clear can grant. The allowed set lives here so the
// delivery side and the gating side share one vocabulary — a reward that can't
// be named can't be required either.
type RewardType string

const (
	RewardXP      RewardType = "xp"
	RewardSticker RewardType = "sticker"
	RewardTitle   RewardType = "title"
	RewardBadge   RewardType = "badge"
	RewardUnlock  RewardType = "unlock"
)

var AllowedRewards = map[RewardType]bool{
	RewardXP: true, RewardSticker: true, RewardTitle: true, RewardBadge: true, RewardUnlock: true,
}

// Learner is the snapshot a requirement is checked against. Everything here is
// already computed elsewhere; access does not query.
type Learner struct {
	Level         int
	Cleared       map[string]bool
	EquippedTitle string
	Reputation    map[string]int
	Missions      map[string]bool
}

// Evaluate reports whether ALL requirements are met, and if not, why — in the
// learner's language, because "잠김"에 이유가 없으면 목표가 되지 못한다.
//
// An empty requirement list is open. An UNKNOWN kind is treated as unmet with a
// neutral reason: failing closed on content we don't understand is safer than
// silently opening a door.
func Evaluate(reqs []Requirement, l Learner) (bool, string) {
	for _, r := range reqs {
		ok, reason := one(r, l)
		if !ok {
			return false, reason
		}
	}
	return true, ""
}

func one(r Requirement, l Learner) (bool, string) {
	switch r.Kind {
	case KindLevel:
		if l.Level >= r.Value {
			return true, ""
		}
		return false, fmt.Sprintf("레벨 %d부터 들어갈 수 있어요", r.Value)
	case KindCleared:
		if l.Cleared[r.Key] {
			return true, ""
		}
		return false, "앞선 시나리오를 먼저 끝내야 해요"
	case KindTitle:
		if l.EquippedTitle == r.Key {
			return true, ""
		}
		return false, "특정 칭호를 장착해야 열려요"
	case KindReputation:
		if l.Reputation[r.Key] >= r.Value {
			return true, ""
		}
		return false, fmt.Sprintf("%s %d 이상이 필요해요", label(r.Key), r.Value)
	case KindMission:
		if l.Missions[r.Key] {
			return true, ""
		}
		return false, "숨은 미션을 먼저 발견해야 해요"
	}
	return false, "아직 열리지 않았어요"
}

// label makes a dimension key readable when a requirement mentions one. The
// authoritative label lives in the reputation catalog; this is the fallback for
// a requirement that names a dimension the caller didn't resolve.
func label(key string) string {
	return strings.ReplaceAll(key, "_", " ")
}
