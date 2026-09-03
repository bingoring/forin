// Package avatar validates the profile portrait's spec (핸드오프 v32 · NbAvatar).
//
// Ten axes of NAMED keys — skin, hair, hair colour, eyes, mouth, outfit, outfit
// colour, hat, background, accessory. The server does not draw anything; what it
// owns is "is this a key the client can draw", and that is the whole of this file.
//
// The allowed sets live HERE and not in a DB CHECK, which is this repository's rule
// for enum-ish values: a nineteenth hairstyle should cost a line of Go, not a
// migration. They are duplicated in mobile/src/data/nbAvatar.ts on purpose — the
// client needs them to build the picker, and a round trip per keystroke to learn
// what a hairstyle is called would be absurd. AllowedKeys is the canonical list;
// avatarKeys_test.go compares it against the TypeScript so the two cannot drift.
package avatar

import "errors"

var (
	ErrUnknownAxis = errors.New("avatar: unknown axis")
	ErrUnknownKey  = errors.New("avatar: unknown key for this axis")
)

// AllowedKeys is every axis and the keys it accepts.
//
// A spec is a map rather than a struct so a new axis is one line here and no change
// anywhere else: the handler stores what it validated, and the client reads back
// what it sent.
var AllowedKeys = map[string][]string{
	"skin": {"pale", "ivory", "beige", "tan", "warm", "olive", "brown", "deep"},
	"hair": {
		"short", "part", "midPart", "buzz", "curlyShort", "bob", "ponytail", "bun",
		"twintails", "longStraight", "curlyLong", "wavyMid", "wavyLong", "fringe",
		"spiky", "afro", "braid", "baldFringe", "bald",
	},
	"hairColor": {
		"black", "darkbrown", "brown", "lightbrown", "blonde", "ash", "gray", "white",
		"red", "navy", "pink", "mint",
	},
	"eyes": {
		"dot", "lash", "happy", "closed", "round", "sleepy", "wink", "uu", "side",
		"sparkle", "droopy", "brow", "weary", "worried", "angry",
	},
	"mouth": {
		"line", "smile", "grin", "laugh", "pout", "o", "wave", "smirk", "tongue",
		"frown", "teeth", "hmm", "pain", "clench",
	},
	"outfit": {
		"scrubV", "scrubPocket", "dress", "labCoat", "surgGown", "isoGown", "polo",
		"knit", "hoodie", "shirt", "tshirt", "apron",
		"hospitalGown", "paramedic", "security", "suit", "cardigan", "coverall",
	},
	"outfitColor": {
		"sage", "navy", "burgundy", "lilac", "sky", "peach", "charcoal", "mint",
		"yellow", "rose", "white", "teal",
	},
	"hat": {
		"none", "nurseCap", "scrubCap", "scrubCapDot", "beanie", "cap", "gradCap",
		"party", "beret", "headband", "bandana", "securityCap",
	},
	"bg": {
		"plain", "lines", "grid", "washSky", "washPink", "washMint", "washYellow",
		"window", "stripe", "stamps", "dots",
	},
	"acc": {
		"none", "stetho", "badge", "glassesRound", "glassesSquare", "earring",
		"maskChin", "maskOn", "plaster", "earphones", "blush", "freckles",
		"mustache", "beard", "wrinkles", "cannula", "faceShield",
	},
}

// Spec is one portrait: axis → key. Every axis is required, because a half-spec
// stored now becomes a half-spec read by somebody else's screen later, and the
// client would have to invent the missing half twice.
type Spec map[string]string

// Clean rejects anything that is not a complete, drawable portrait.
//
// Strict on purpose, unlike the client's normalizeAvatarSpec, which is deliberately
// forgiving: the client is reading a value that may predate a palette revision and
// still has to draw a face, while this is a WRITE and the writer is a picker that
// knows the current keys. Silently correcting a bad write would store a portrait
// nobody chose.
func (s Spec) Clean() (Spec, error) {
	if len(s) != len(AllowedKeys) {
		return nil, ErrUnknownAxis
	}
	out := make(Spec, len(s))
	for axis, key := range s {
		allowed, ok := AllowedKeys[axis]
		if !ok {
			return nil, ErrUnknownAxis
		}
		if !contains(allowed, key) {
			return nil, ErrUnknownKey
		}
		out[axis] = key
	}
	return out, nil
}

func contains(list []string, want string) bool {
	for _, x := range list {
		if x == want {
			return true
		}
	}
	return false
}
