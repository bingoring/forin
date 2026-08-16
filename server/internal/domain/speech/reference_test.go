package speech

import (
	"context"
	"errors"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/ports"
)

// fakeSynth is a fake ports.SpeechSynthesizer that counts Synthesize calls, so
// tests can assert Azure TTS is skipped entirely on a cache hit (NFR: once per
// sentence, ever).
type fakeSynth struct {
	wav        []byte
	err        error
	synthCalls int
	configured bool
}

func (f *fakeSynth) Synthesize(ctx context.Context, text, voice, locale string) ([]byte, error) {
	f.synthCalls++
	if f.err != nil {
		return nil, f.err
	}
	return f.wav, nil
}

func (f *fakeSynth) Configured() bool { return f.configured }

func newTestServiceWithTTS(pron *fakePronPort, repo *fakeSpeechRepo, tts *fakeSynth) *Service {
	pronSvc := pronunciation.NewService(pron, fakeProfiles{})
	return NewService(repo, pronSvc, tts)
}

// referenceScoredResult is what a self-scored TTS rendition looks like: a
// nonsense Overall/Accuracy (the machine grading itself), but real syllable/
// phoneme segmentation — the part Reference is actually after.
func referenceScoredResult() *ports.PronunciationResult {
	return &ports.PronunciationResult{
		Recognized:   "I'm giving you acetaminophen",
		Accuracy:     100, // meaningless — self-graded, must not survive into the reference
		Fluency:      100,
		Completeness: 100,
		Overall:      100,
		Words: []ports.WordScore{
			{
				Word:     "I'm",
				Accuracy: 100,
				Syllables: []ports.SyllableResult{
					{Syllable: "aɪm", Accuracy: 100},
				},
				Phonemes: []ports.PhonemeResult{
					{Phoneme: "aɪ", Accuracy: 100},
					{Phoneme: "m", Accuracy: 100},
				},
			},
			{
				Word:     "giving",
				Accuracy: 100,
				Syllables: []ports.SyllableResult{
					{Syllable: "ˈɡɪ", Accuracy: 100},
					{Syllable: "vɪŋ", Accuracy: 100},
				},
				Phonemes: []ports.PhonemeResult{
					{Phoneme: "ɡ", Accuracy: 100},
					{Phoneme: "ɪ", Accuracy: 100},
					{Phoneme: "v", Accuracy: 100},
					{Phoneme: "ɪ", Accuracy: 100},
					{Phoneme: "ŋ", Accuracy: 100},
				},
			},
		},
	}
}

// Caching is the whole point (NFR: TTS + assess run once per sentence, ever).
// A cache hit must call neither the synthesizer nor the scorer.
func TestReferenceUsesCache(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey:   SentenceKey("I'm giving you acetaminophen", "en-US"),
		ReferenceText: "I'm giving you acetaminophen",
		Locale:        "en-US",
		IPA:           "/aɪm ˈɡɪvɪŋ/",
		DurationMS:    1200,
	}
	tts := &fakeSynth{configured: true}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.Reference(context.Background(), "u1", "I'm giving you acetaminophen")
	if err != nil {
		t.Fatalf("Reference: %v", err)
	}
	if tts.synthCalls != 0 {
		t.Fatalf("cache hit must not call Synthesize, got %d calls", tts.synthCalls)
	}
	if pron.assessCalls != 0 {
		t.Fatalf("cache hit must not call Assess, got %d calls", pron.assessCalls)
	}
	if got.IPA != "/aɪm ˈɡɪvɪŋ/" || got.DurationMS != 1200 {
		t.Fatalf("Reference must return the cached row untouched, got %+v", got)
	}
}

// A cache miss must synthesize once, score that synthesis once, and persist
// the result so the next call is a hit.
func TestReferenceDerivesAndCaches(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	wav := buildWav(24000, 1, 24000) // 1s @ 24kHz mono (Azure TTS's own output format)
	tts := &fakeSynth{configured: true, wav: wav}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.Reference(context.Background(), "u1", "I'm giving you acetaminophen")
	if err != nil {
		t.Fatalf("Reference: %v", err)
	}
	if tts.synthCalls != 1 {
		t.Fatalf("Synthesize called %d times, want exactly 1 on a miss", tts.synthCalls)
	}
	if pron.assessCalls != 1 {
		t.Fatalf("Assess called %d times, want exactly 1 on a miss", pron.assessCalls)
	}
	if len(repo.putReference) != 1 {
		t.Fatalf("PutReference called %d times, want exactly 1", len(repo.putReference))
	}
	wantKey := SentenceKey("I'm giving you acetaminophen", "en-US")
	if repo.putReference[0].SentenceKey != wantKey {
		t.Fatalf("stored SentenceKey = %q, want %q", repo.putReference[0].SentenceKey, wantKey)
	}
	if got.DurationMS != 1000 {
		t.Fatalf("DurationMS = %d, want 1000 (1s clip)", got.DurationMS)
	}
	if got.IPA == "" {
		t.Fatalf("IPA must be assembled from the scored words, got empty")
	}
}

// The self-scoring pass's Accuracy/Fluency/etc. are meaningless (a machine
// grading its own TTS output) — only segmentation (syllables/phonemes, sans
// their accuracy numbers) may reach the stored reference.
func TestReferenceDropsScores(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	tts := &fakeSynth{configured: true, wav: buildWav(24000, 1, 100)}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.Reference(context.Background(), "u1", "I'm giving you acetaminophen")
	if err != nil {
		t.Fatalf("Reference: %v", err)
	}
	if len(got.Words) != 2 {
		t.Fatalf("expected 2 words in the reference, got %d", len(got.Words))
	}
	for _, w := range got.Words {
		if w.Accuracy != 0 || w.ErrorType != "" {
			t.Fatalf("word-level score must be dropped, got %+v", w)
		}
		for _, sy := range w.Syllables {
			if sy.Accuracy != 0 {
				t.Fatalf("syllable accuracy must be dropped, got %+v", sy)
			}
		}
		for _, ph := range w.Phonemes {
			if ph.Accuracy != 0 {
				t.Fatalf("phoneme accuracy must be dropped, got %+v", ph)
			}
		}
	}
	// Segmentation itself must survive — dropping scores must not drop content.
	if got.Words[0].Syllables[0].Syllable != "aɪm" {
		t.Fatalf("syllable text lost, got %+v", got.Words[0].Syllables)
	}
	if got.Words[1].Phonemes[2].Phoneme != "v" {
		t.Fatalf("phoneme text lost, got %+v", got.Words[1].Phonemes)
	}
}

// TTS failure must surface as an error from Reference, but must not be fatal
// to the service as a whole — the scoring path (Record) is entirely
// independent and callers of Reference may choose to ignore the error and
// simply hide the IPA row (business-rules §5 "참조 생성 실패").
func TestReferenceFailureIsNotFatal(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	sentinel := errors.New("azurespeech tts: status 503")
	tts := &fakeSynth{configured: true, err: sentinel}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.Reference(context.Background(), "u1", "I'm giving you acetaminophen")
	if err == nil {
		t.Fatal("expected an error when TTS synthesis fails")
	}
	if got != nil {
		t.Fatalf("expected nil reference on failure, got %+v", got)
	}
	if pron.assessCalls != 0 {
		t.Fatalf("Assess must not be called when Synthesize already failed, got %d calls", pron.assessCalls)
	}
	if len(repo.putReference) != 0 {
		t.Fatalf("nothing should be cached on failure, got %d PutReference calls", len(repo.putReference))
	}

	// The rest of the service must still work — Reference failing is not fatal
	// to Record (an entirely separate call path).
	if _, err := svc.Record(context.Background(), "u1", []byte("wav"), "hello", RecordOptions{Origin: "dialogue"}); err != nil {
		t.Fatalf("Record must still work after a Reference failure: %v", err)
	}
}
