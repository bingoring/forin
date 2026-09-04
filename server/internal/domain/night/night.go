// Package night serves the 나이트 근무 라디오's 오늘 밤의 이야기 — short night-shift
// stories, each ending in one English line worth practicing. Stories are content
// (content/night), so the set grows by deploy, never an app release.
package night

// Story is one 오늘 밤의 이야기. Title/Body/KeyGloss are per-locale (en is the fallback);
// KeyLine is the English sentence the learner practices, universal.
type Story struct {
	ID       string            `yaml:"id"`
	Title    map[string]string `yaml:"title"`
	Body     map[string]string `yaml:"body"`
	KeyLine  string            `yaml:"keyLine"`
	KeyGloss map[string]string `yaml:"keyGloss"`
}

func loc(m map[string]string, locale string) string {
	if v, ok := m[locale]; ok && v != "" {
		return v
	}
	return m["en"]
}

func (s Story) TitleFor(l string) string    { return loc(s.Title, l) }
func (s Story) BodyFor(l string) string     { return loc(s.Body, l) }
func (s Story) KeyGlossFor(l string) string { return loc(s.KeyGloss, l) }

// Stories is the rotating set.
type Stories struct{ list []Story }

func NewStories(list []Story) *Stories { return &Stories{list: list} }

func (s *Stories) Len() int { return len(s.list) }

// At returns the story at index i, wrapping around, or false when there are none.
func (s *Stories) At(i int) (Story, bool) {
	n := len(s.list)
	if n == 0 {
		return Story{}, false
	}
	return s.list[((i%n)+n)%n], true
}
