// Package slang serves the 은어 도감 (SlangDeck): a server-authored deck of US clinical
// abbreviations and benign hospital slang. One card drops per day; the learner collects it.
//
// The deck lives in content (content/slang/*.yaml), NOT in the app — so it can grow to
// hundreds of cards, and adding more is a server deploy, never an app release. Glosses are
// per-locale with English as the fallback for any native we have not translated yet.
package slang

import "time"

// Card is one deck entry.
type Card struct {
	ID      string            `yaml:"id"`
	Code    string            `yaml:"code"`
	Gloss   map[string]string `yaml:"gloss"`
	Example string            `yaml:"example"`
	// Hidden marks the "real emergency codes" revealed at collection milestones; it only
	// styles the reveal, the drop order is unchanged.
	Hidden bool `yaml:"hidden,omitempty"`
}

// GlossFor resolves the meaning for a locale, falling back to English.
func (c Card) GlossFor(locale string) string {
	if g, ok := c.Gloss[locale]; ok && g != "" {
		return g
	}
	return c.Gloss["en"]
}

// Collected is one collected card with when it was picked up (for the "one per day" rule).
type Collected struct {
	CardID      string
	CollectedAt time.Time
}

// MasterTitleAt is the collection count that earns the '은어 마스터' recognition.
const MasterTitleAt = 30

// Deck is the ordered set of cards, in the sequence they drop.
type Deck struct{ Cards []Card }

func NewDeck(cards []Card) *Deck { return &Deck{Cards: cards} }

func (d *Deck) Len() int { return len(d.Cards) }

// At returns the card at index i (the (i+1)-th to drop), or false past the end.
func (d *Deck) At(i int) (Card, bool) {
	if i < 0 || i >= len(d.Cards) {
		return Card{}, false
	}
	return d.Cards[i], true
}

// ByID finds a card by id.
func (d *Deck) ByID(id string) (Card, bool) {
	for _, c := range d.Cards {
		if c.ID == id {
			return c, true
		}
	}
	return Card{}, false
}

// IndexOf returns a card's position in the deck (0-based), or -1 if it is not in the deck
// (a card retired from content after someone collected it).
func (d *Deck) IndexOf(id string) int {
	for i, c := range d.Cards {
		if c.ID == id {
			return i
		}
	}
	return -1
}
