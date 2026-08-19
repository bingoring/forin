package content

// DefaultTargetLang is the language an authored scenario is assumed to teach when it
// does not say. Every scenario shipped today is English.
const DefaultTargetLang = "en"

// Destination maps a country a learner can pick to the language spoken there.
// Code-side allowed set, so adding a country needs no migration.
var Destination = map[string]string{
	"us": "en",
	"de": "de",
}

// ReadyTargetLangs lists the languages whose AUTHORED phrases cover the whole
// learning path — the bar for offering a destination as more than an intention.
//
// The AI conversation already speaks any language: it takes the target from the
// profile and puts it in the prompt, and pronunciation scoring and TTS follow the
// same value. What does not follow is the authored material — 303 taglines and 996
// key phrases, all English. A German destination built on those would run a German
// conversation while every example sentence the nurse is asked to say is English, and
// the phrases are the part being taught. So this list stays honest, and cmd/seed
// asserts it instead of trusting it.
var ReadyTargetLangs = []string{"en"}

// IsTargetLangReady reports whether authored content exists for a language.
func IsTargetLangReady(lang string) bool {
	for _, l := range ReadyTargetLangs {
		if l == lang {
			return true
		}
	}
	return false
}

// IsDestinationReady reports whether a destination can be offered for real.
func IsDestinationReady(code string) bool {
	lang, ok := Destination[code]
	return ok && IsTargetLangReady(lang)
}
