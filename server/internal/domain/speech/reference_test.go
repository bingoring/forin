package speech

import (
	"context"
	"errors"
	"testing"

	"github.com/bingoring/forin/server/internal/domain/pronunciation"
	"github.com/bingoring/forin/server/internal/domain/user"
	"github.com/bingoring/forin/server/internal/ports"
)

// fakeSynth is a fake ports.SpeechSynthesizer that counts Synthesize calls, so
// tests can assert Azure TTS is skipped entirely on a cache hit (NFR: once per
// sentence, ever). It also records the last call's arguments so tests can
// assert voice/locale were passed through as a matched pair, never a
// hardcoded voice against a varying locale.
type fakeSynth struct {
	wav        []byte
	err        error
	synthCalls int
	configured bool
	lastVoice  string
	lastLocale string
	lastText   string
}

func (f *fakeSynth) Synthesize(ctx context.Context, text, voice, locale string) ([]byte, error) {
	f.synthCalls++
	f.lastVoice, f.lastLocale, f.lastText = voice, locale, text
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

// fakeProfilesFor resolves TargetLang to whatever lang is given, so tests can
// drive pronunciation.Service.LocaleFor to a specific non-en-US locale (e.g.
// "ja" -> "ja-JP") without reaching into pronunciation's unexported localeFor.
type fakeProfilesFor struct{ lang string }

func (f fakeProfilesFor) GetProfile(ctx context.Context, userID string) (*user.Profile, error) {
	return &user.Profile{TargetLang: f.lang}, nil
}

func newTestServiceWithProfile(pron *fakePronPort, repo *fakeSpeechRepo, tts *fakeSynth, lang string) *Service {
	pronSvc := pronunciation.NewService(pron, fakeProfilesFor{lang: lang})
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

// Code review finding (Important 1): a hardcoded voice paired with a
// *variable* locale can silently mismatch, unlike quiz_audio_handler.go where
// both are fixed. A user whose target language resolves to ja-JP must get a
// ja-JP voice, never the en-US one — Azure would otherwise synthesize
// mismatched audio without ever erroring, and R9 would cache that garbage
// globally forever.
func TestReferenceUsesLocaleMatchedVoice(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	tts := &fakeSynth{configured: true, wav: buildWav(24000, 1, 100)}
	svc := newTestServiceWithProfile(pron, repo, tts, "ja")

	if _, err := svc.Reference(context.Background(), "u1", "hello"); err != nil {
		t.Fatalf("Reference: %v", err)
	}
	if tts.lastLocale != "ja-JP" {
		t.Fatalf("expected locale ja-JP, got %q", tts.lastLocale)
	}
	if tts.lastVoice != "ja-JP-NanamiNeural" {
		t.Fatalf("voice must match the ja-JP locale, got %q — a leftover en-US voice would make Azure synthesize mismatched audio without ever erroring", tts.lastVoice)
	}
}

// voiceForLocale is the pure lookup Reference relies on to keep voice/locale
// paired. Table-tests every locale pronunciation.go's localeFor can produce,
// plus the "we don't know this one" branch (business-rules R9 discussion:
// skip derivation rather than guess en-US for an unrecognized locale).
func TestVoiceForLocaleCoversKnownLocales(t *testing.T) {
	cases := map[string]string{
		"en-US": "en-US-JennyNeural",
		"de-DE": "de-DE-KatjaNeural",
		"ja-JP": "ja-JP-NanamiNeural",
		"ko-KR": "ko-KR-SunHiNeural",
		"zh-CN": "zh-CN-XiaoxiaoNeural",
		"es-ES": "es-ES-ElviraNeural",
		"fr-FR": "fr-FR-DeniseNeural",
	}
	for locale, want := range cases {
		got, ok := voiceForLocale(locale)
		if !ok || got != want {
			t.Errorf("voiceForLocale(%q) = (%q, %v), want (%q, true)", locale, got, ok, want)
		}
	}
}

func TestVoiceForLocaleUnknownSkipsRatherThanGuessing(t *testing.T) {
	if _, ok := voiceForLocale("xx-XX"); ok {
		t.Fatal("an unrecognized locale must not resolve to a voice — Reference must skip derivation, not guess en-US")
	}
}

// Code review finding (Important 3): the decision to propagate a GetReference
// error (rather than swallow it and fall through to a paid re-derivation) was
// deliberate — it protects the "TTS+assess once per sentence, ever" NFR from
// a transient repo read failure triggering Azure calls on every request. That
// deliberate deviation needs its own test, not just a design note.
func TestReferenceRepoReadErrorPropagatesWithoutRederiving(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	sentinel := errors.New("db: connection reset")
	repo.getRefErr = sentinel
	tts := &fakeSynth{configured: true, wav: buildWav(24000, 1, 100)}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.Reference(context.Background(), "u1", "hello")
	if !errors.Is(err, sentinel) {
		t.Fatalf("expected GetReference's error to propagate untouched, got %v", err)
	}
	if got != nil {
		t.Fatalf("expected nil reference on a repo read failure, got %+v", got)
	}
	if tts.synthCalls != 0 || pron.assessCalls != 0 {
		t.Fatalf("a repo read failure must not trigger a paid re-derivation, got %d Synthesize / %d Assess calls",
			tts.synthCalls, pron.assessCalls)
	}
}

// ── ReferenceAudio (Task 11) ────────────────────────────────────────────────
// Closes task-11-brief.md item ②: T4 synthesized the WAV to derive Reference
// and discarded it. These assert the audio is now persisted alongside the
// row and served back WITHOUT a second Synthesize call — the whole point of
// "reused in native playback" (reference.go's own doc, predating this task).

// A cache hit (row + audio already stored) must not touch the synthesizer.
func TestReferenceAudioCacheHit(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	wav := []byte("cached-wav-bytes")
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey:    SentenceKey("hello there", "en-US"),
		ReferenceText:  "hello there",
		Locale:         "en-US",
		ReferenceAudio: wav,
	}
	tts := &fakeSynth{configured: true}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.ReferenceAudio(context.Background(), "u1", "hello there")
	if err != nil {
		t.Fatalf("ReferenceAudio: %v", err)
	}
	if string(got) != string(wav) {
		t.Fatalf("ReferenceAudio = %q, want the cached bytes %q", got, wav)
	}
	if tts.synthCalls != 0 {
		t.Fatalf("a cache hit must not call Synthesize, got %d calls", tts.synthCalls)
	}
}

// A miss (nothing derived yet) must derive via Reference — exactly one
// Synthesize/Assess pair — and the audio from that SAME call must come back.
func TestReferenceAudioMissDerivesAndReturnsSameWav(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	wav := buildWav(24000, 1, 24000)
	tts := &fakeSynth{configured: true, wav: wav}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.ReferenceAudio(context.Background(), "u1", "I'm giving you acetaminophen")
	if err != nil {
		t.Fatalf("ReferenceAudio: %v", err)
	}
	if string(got) != string(wav) {
		t.Fatalf("ReferenceAudio returned different bytes than the one Synthesize call produced")
	}
	if tts.synthCalls != 1 {
		t.Fatalf("Synthesize called %d times, want exactly 1 on a miss", tts.synthCalls)
	}
	if len(repo.putReference) != 1 || len(repo.putReference[0].ReferenceAudio) == 0 {
		t.Fatalf("the derived row must persist ReferenceAudio, got %+v", repo.putReference)
	}
}

// Review round 2, Important 1: a legacy row (reference exists, no audio_wav
// — predates Task 11, OR left behind by running migration 000022 down and
// back up) must be BACKFILLED, not left permanently empty. Reference() alone
// cannot do this (it hits its own cache and returns before ever calling
// Synthesize again) — ReferenceAudio must re-synthesize just the audio
// against the row's own stored voice/locale and write it back, WITHOUT
// re-deriving segmentation (no second Assess call: that work is done and
// permanent, R9).
func TestReferenceAudioBackfillsLegacyRow(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey:   SentenceKey("hello there", "en-US"),
		ReferenceText: "hello there",
		Locale:        "en-US",
		IPA:           "/heˈloʊ ðɛr/",
		// ReferenceAudio deliberately empty — a row from before this column existed.
	}
	newWav := buildWav(24000, 1, 100)
	tts := &fakeSynth{configured: true, wav: newWav}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.ReferenceAudio(context.Background(), "u1", "hello there")
	if err != nil {
		t.Fatalf("ReferenceAudio: %v", err)
	}
	if string(got) != string(newWav) {
		t.Fatalf("expected the freshly backfilled audio, got %d bytes", len(got))
	}
	if tts.synthCalls != 1 {
		t.Fatalf("expected exactly 1 Synthesize call to backfill the legacy row, got %d", tts.synthCalls)
	}
	if pron.assessCalls != 0 {
		t.Fatalf("backfill must NOT re-Assess — segmentation is already derived and permanent (R9), got %d Assess calls", pron.assessCalls)
	}
	if len(repo.updatedAudio) != 1 {
		t.Fatalf("expected exactly one UpdateReferenceAudio call, got %d: %+v", len(repo.updatedAudio), repo.updatedAudio)
	}
	if repo.updatedAudio[0].SentenceKey != SentenceKey("hello there", "en-US") {
		t.Fatalf("backfill wrote to the wrong sentence_key: %+v", repo.updatedAudio[0])
	}

	// A second call must now be a pure cache hit — no more Synthesize calls.
	got2, err := svc.ReferenceAudio(context.Background(), "u1", "hello there")
	if err != nil {
		t.Fatalf("ReferenceAudio (2nd call): %v", err)
	}
	if string(got2) != string(newWav) {
		t.Fatalf("second call must return the now-backfilled audio, got %d bytes", len(got2))
	}
	if tts.synthCalls != 1 {
		t.Fatalf("second call must be a cache hit — no additional Synthesize call, got %d total calls", tts.synthCalls)
	}
}

// Backfill must surface the same honest failures Reference() itself would —
// e.g. TTS unconfigured — rather than silently staying empty forever.
func TestReferenceAudioBackfillPropagatesFailure(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	repo.refRow = &ports.SentenceReferenceRow{
		SentenceKey:   SentenceKey("hello there", "en-US"),
		ReferenceText: "hello there",
		Locale:        "en-US",
	}
	tts := &fakeSynth{configured: false} // ErrTTSNotConfigured
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.ReferenceAudio(context.Background(), "u1", "hello there")
	if err == nil {
		t.Fatal("expected an error when backfill's TTS is not configured")
	}
	if len(got) != 0 {
		t.Fatalf("expected no audio on a failed backfill, got %d bytes", len(got))
	}
	if len(repo.updatedAudio) != 0 {
		t.Fatalf("a failed backfill must not write anything, got %+v", repo.updatedAudio)
	}
}

// An oversized synthesized clip must be rejected before it is ever persisted
// — via Reference()'s main derivation path (review round 2, Important 4: no
// invalidation path exists for speech_references, so a bad row would be
// permanent).
func TestReferenceRejectsOversizedAudio(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	oversized := make([]byte, maxReferenceAudioBytes+1)
	tts := &fakeSynth{configured: true, wav: oversized}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.Reference(context.Background(), "u1", "hello there")
	if !errors.Is(err, ErrReferenceAudioTooLarge) {
		t.Fatalf("expected ErrReferenceAudioTooLarge, got %v", err)
	}
	if got != nil {
		t.Fatalf("expected nil reference when the synthesized audio is oversized, got %+v", got)
	}
	if pron.assessCalls != 0 {
		t.Fatalf("must not pay for Assess on a clip that will be rejected anyway, got %d calls", pron.assessCalls)
	}
	if len(repo.putReference) != 0 {
		t.Fatalf("an oversized clip must never be persisted, got %d PutReference calls", len(repo.putReference))
	}
}

// TTS failure on a true miss must propagate as an honest error, not a fabricated clip.
func TestReferenceAudioPropagatesDerivationFailure(t *testing.T) {
	pron := &fakePronPort{result: referenceScoredResult()}
	repo := newFakeSpeechRepo()
	tts := &fakeSynth{configured: false} // ErrTTSNotConfigured
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.ReferenceAudio(context.Background(), "u1", "hello there")
	if err == nil {
		t.Fatal("expected an error when TTS is not configured and no reference is cached")
	}
	if len(got) != 0 {
		t.Fatalf("expected no audio on failure, got %d bytes", len(got))
	}
}

// R10 edge case (business-rules): Azure can return word-level scores with no
// syllable/phoneme detail at all. IPA must come back empty (nothing honest to
// show), but the reference row is still stored — the duration is still
// valid, and re-deriving on every call would defeat the whole cache.
func TestReferenceStoresRowWithEmptyIPAWhenAzureOmitsPhonemes(t *testing.T) {
	pron := &fakePronPort{result: &ports.PronunciationResult{
		Recognized: "hello",
		Words: []ports.WordScore{
			{Word: "hello", Accuracy: 91}, // no Syllables, no Phonemes (R10)
		},
	}}
	repo := newFakeSpeechRepo()
	tts := &fakeSynth{configured: true, wav: buildWav(24000, 1, 100)}
	svc := newTestServiceWithTTS(pron, repo, tts)

	got, err := svc.Reference(context.Background(), "u1", "hello")
	if err != nil {
		t.Fatalf("Reference: %v", err)
	}
	if got.IPA != "" {
		t.Fatalf("IPA must be empty when Azure returned no phonemes (R10), got %q", got.IPA)
	}
	if len(repo.putReference) != 1 {
		t.Fatalf("the reference row must still be cached even with no IPA, got %d PutReference calls", len(repo.putReference))
	}
	if repo.putReference[0].DurationMS == 0 {
		t.Fatal("duration must still be computed from the wav even when IPA is empty")
	}
}
