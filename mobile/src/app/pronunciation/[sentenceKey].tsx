// Pronunciation loop — one route, 6 screen states (frontend-components.md §4):
// idle · recording · scoring · result · permissionDenied · noSpeech.
// SoT: design-handoff_v22/reference/screen-pronunciation.jsx — ScreenPronPractice
// (L71-107), ScreenPronRecording (L110-143), ScreenPronResult (L146-218).
// ScreenPronDrill (L221-274) is out of scope; its button is rendered disabled
// (business-logic-model §1, requirement ⑦) so the layout doesn't shift when a
// future task turns it on.
//
// `scoring` has no SoT frame — it is this task's deliberate addition so the
// screen never goes blank between "recording stopped" and "result arrived"
// (business-logic-model §3/§4). It keeps the dark shell from `recording`.
//
// State transitions live in lib/pronState.ts as a pure, independently-tested
// function — this file only dispatches events from real triggers (mic
// permission, the 10s timer, the /pronunciation response) and renders.
//
// Recording follows dialogue/[id].tsx's expo-audio setup verbatim (16kHz mono
// WAV — the only shape ValidateWAV on the server accepts), with
// isMeteringEnabled added so the WavePanel can show a live waveform instead of
// a static mock.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  useAudioRecorder, useAudioRecorderState, useAudioPlayer, requestRecordingPermissionsAsync, setAudioModeAsync,
  IOSOutputFormat, AudioQuality, type RecordingOptions,
} from 'expo-audio';
import {
  readAsStringAsync, EncodingType, deleteAsync, downloadAsync, getInfoAsync, cacheDirectory,
} from 'expo-file-system/legacy';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMemo, NbPaper, NbSheet, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts, paperShadow } from '@/theme/nb';
import { AUDIO } from '@/components/pron/nbPron';
import { DarkPanel } from '@/components/pron/DarkPanel';
import { TargetCard } from '@/components/pron/TargetCard';
import { Wave } from '@/components/pron/Wave';
import { SyllableGrid, type SyllableChip } from '@/components/pron/SyllableGrid';
import { ScoreBars } from '@/components/pron/ScoreBars';
import { CorrectionCard } from '@/components/pron/CorrectionCard';
import { AttemptHistory, type AttemptRow as AttemptDisplayRow } from '@/components/pron/AttemptHistory';
import { splitTargetTokens, syllableBand, buildCorrectionPoints, downsampleAmplitude, phonemeTipLookup } from '@/lib/pronTokens';
import { api, type PronunciationResult, type SentenceReference, type SpeechAttemptRow } from '@/api/client';
import { next, initialPronState, type PronState, type PronEventType } from '@/lib/pronState';
import { type Translate, useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

const BAR_COUNT = 20; // matches SoT's mock W1 array length

// business-rules R6 says "최대 10초" and that's what the countdown/copy show,
// but the AUTO-stop fires a little earlier: speech.ValidateWAV rejects a WAV
// over 10s as 400 invalid_audio (server/internal/domain/speech/validate.go:
// 37-39), and `await recorder.stop()` + its flush routinely adds tens to a
// few hundred ms on top of a `setTimeout(10000)` — enough to push a
// literally-10s recording over that hard cap and get every auto-stopped
// attempt rejected (review finding). Firing at 9.5s leaves that margin.
const RECORD_DISPLAY_MS = 10_000;
const RECORD_AUTO_STOP_MS = 9_500;

// 16kHz mono PCM WAV — the only shape speech.ValidateWAV accepts server-side.
// Metering is on so the live Wave panel reflects the actual mic input instead
// of a static mock (SoT L68's W1 array is explicitly "목업 데이터. 실제
// 진폭으로 대체" per frontend-components §6).
const WAV_16K_MONO: RecordingOptions = {
  extension: '.wav',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  isMeteringEnabled: true,
  ios: {
    outputFormat: IOSOutputFormat.LINEARPCM,
    audioQuality: AudioQuality.HIGH,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  android: { outputFormat: 'default', audioEncoder: 'default' },
  web: {},
};

// The three banner messages are KEYS here, resolved where they are shown.
//
// They used to be `const X = t('...')` at module scope — evaluated once when the module
// was imported, so they were pinned to whatever language the app started in and ignored
// every change after. The module-scope guard did not catch them because it only looked
// inside array and object initializers; a scalar const was invisible to it.
//
// 4xx(invalid_audio/invalid_reference_text/invalid_review_card_id/소유권 403)는
// SERVER_ERROR로 뭉뚱그리면 "일시적" 문제처럼 보이지만 실제로는 같은
// 입력으로 재시도해도 매번 재현되는 결함이다(review finding) — 문구를 분리한다.
const NO_SPEECH_KEY = 'pron.noSpeech'; // business-rules §5, 422
const SERVER_ERROR_KEY = 'pron.serverDown'; // business-rules §5, 5xx/네트워크
const CLIENT_ERROR_KEY = 'pron.badRequest';

// iOS/Android metering is dBFS, roughly -160 (silence) to 0 (max). Normal
// speech in a quiet room sits well above -50dB; clamping there keeps talking
// visible instead of pinned near the floor. This is a calibration heuristic,
// not a spec'd constant — there is no reference amplitude to derive it from.
function normalizeMetering(db: number | undefined): number {
  if (db === undefined || !Number.isFinite(db)) return 0.05;
  return Math.max(0.05, Math.min(1, (db + 50) / 50));
}

function statusOf(e: unknown): number | undefined {
  return (e as { response?: { status?: number } } | undefined)?.response?.status;
}

// A stable, filesystem-safe cache filename for a sentence's reference audio.
// Collisions are harmless (worst case: two distinct sentences briefly share a
// cache slot and the newer download overwrites the older) — this is a local
// player cache, not a keying scheme the server relies on. djb2 keeps the
// filename short regardless of how long the sentence is.
function audioCacheKey(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

function paceLabel(t: Translate, mineMs: number, nativeMs: number): string {
  if (nativeMs <= 0) return '';
  const ratio = mineMs / nativeMs;
  if (ratio > 1.15) return t('pron.paceSlow');
  if (ratio < 0.85) return t('pron.paceFast');
  return t('pron.paceSame');
}

// ── small SoT-mapped pieces kept local to this route (frontend-components §1
// lists them as part of this screen's own tree, not T7's reusable pron/ set)

function Head({
  ctx, step, dark, onBack, backDisabled,
}: { ctx: string; step: string; dark: boolean; onBack: () => void; backDisabled: boolean }) {
  const t = useT();
  return (
    <View style={styles.headWrap}>
      <View style={styles.headRow}>
        <Pressable onPress={backDisabled ? undefined : onBack} disabled={backDisabled} hitSlop={8}>
          {/* Paper even on the dark shell: the way back out is the one thing on a
              recording screen that must not look like part of the instrument. */}
          <NbPaper rot={-1} style={[styles.backChip, backDisabled && styles.flat]}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1 }} />
        <NbPaper rot={1} bg="rgba(95,141,90,.18)" style={styles.badge}>
          <NbIcon name="mic" size={14} />
          <Text style={nbText.hand(14)}>{t('pron.badge')}</Text>
        </NbPaper>
      </View>
      {!!ctx && <Text numberOfLines={1} style={[nbText.body(10.5, dark ? AUDIO.quiet : nb.soft), styles.ctx]}>{ctx}</Text>}
      <Text style={[nbText.hand(28, dark ? nb.cream : nb.ink), styles.step]}>{step}</Text>
    </View>
  );
}

/** The one memo on this screen that is not about how you did — it is about what happens
 *  if you get it wrong, so it is in red pen on peach paper and sits above the mic. */
function RiskNote() {
  const t = useT();
  return (
    <View style={styles.riskBox}>
      <Text style={nbText.hand(14.5)}>
        <Text style={{ color: nb.red }}>{t('pron.careLabel')} </Text>
        {t('pron.careBody')}
      </Text>
    </View>
  );
}

function Banner({ text }: { text: string }) {
  return (
    <View style={styles.banner}>
      <NbIcon name="bell" size={15} color={nb.red} />
      <Text style={[nbText.hand(14.5), { flex: 1, minWidth: 0 }]}>{text}</Text>
    </View>
  );
}

/** The mic, drawn as a scribbled circle with "꾹!" written beside it. Round because it is
 *  the one control on the page and a square would read as another card. */
function BigButton({
  size, icon, label, sub, dark, onPress, disabled, note,
}: {
  size: number; icon: React.ReactNode; label: string;
  sub?: string;
  /** On the recording shell the label has to be cream — ink on #2E2823 is invisible. */
  dark?: boolean;
  onPress: () => void; disabled?: boolean;
  /** The "꾹!" beside the button. Omitted for the stop button: you tap that once. */
  note?: string;
}) {
  return (
    <View style={styles.bigButtonWrap}>
      <Pressable onPress={disabled ? undefined : onPress} disabled={disabled} style={{ alignItems: 'center' }}>
        <View>
          <View
            style={[
              styles.bigButtonCap,
              {
                width: size, height: size, borderRadius: size / 2,
                backgroundColor: dark ? nb.cream : 'rgba(199,81,70,.2)',
                borderColor: dark ? nb.paperEdge : nb.ink,
                borderWidth: dark ? 1 : 2,
                opacity: disabled ? 0.45 : 1,
              },
            ]}
          >
            {icon}
          </View>
          {!!note && <Text style={styles.bigButtonNote}>{note}</Text>}
        </View>
        <Text style={[nbText.hand(17, dark ? nb.cream : nb.ink), styles.bigButtonLabel]}>{label}</Text>
        {!!sub && <Text style={nbText.body(11, dark ? AUDIO.quiet : nb.soft)}>{sub}</Text>}
      </Pressable>
    </View>
  );
}

/** The sentence during recording: highlights only — no IPA, no playback row (those belong
 *  to the idle TargetCard). Taped down, because on the dark shell it is the only thing
 *  from the notebook and it should look stuck there. */
function TargetLine({ tokens }: { tokens: { w: string; hi?: 'drug' | 'num' }[] }) {
  return (
    <NbPaper rot={-0.6} tape tapeLeft={140} style={styles.targetLine}>
      <Text style={styles.targetLineText}>
        {tokens.map((tk, i) =>
          tk.hi ? (
            <Text key={i} style={[styles.targetLineHi, tk.hi === 'drug' && styles.targetLineDrug]}>{tk.w}</Text>
          ) : (
            <Text key={i}>{tk.w}</Text>
          )
        )}
      </Text>
    </NbPaper>
  );
}

/** The live trace. Reused as-is for `scoring` with the timer row swapped for a spinner
 *  (frontend-components §4: "정지된 파형 + 진행 표시. 취소 불가"). */
function WavePanel({
  bars, elapsedSec, remainingSec, scoring,
}: { bars: number[]; elapsedSec: number; remainingSec: number; scoring: boolean }) {
  const t = useT();
  return (
    <DarkPanel style={styles.wavePanel}>
      <Wave bars={bars} height={44} live={!scoring} />
      <View style={styles.wavePanelFooter}>
        {scoring ? (
          <>
            <ActivityIndicator color={AUDIO.waveLit} size="small" />
            <Text style={styles.recTimer}>{t('pron.scoring')}</Text>
          </>
        ) : (
          <>
            <View style={styles.recDot} />
            <Text style={styles.recTimer}>{`REC ${String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:${String(elapsedSec % 60).padStart(2, '0')}`}</Text>
            <View style={{ flex: 1 }} />
            <Text numberOfLines={1} style={nbText.hand(14, AUDIO.quiet)}>{t('pron.secondsLeft', { n: remainingSec })}</Text>
          </>
        )}
      </View>
    </DarkPanel>
  );
}

/** A progress strip of highlighter cells. The segments come from the real reference's
 *  syllable breakdown when we have one (SentenceReference.words[].syllables[]), falling
 *  back to plain words when we don't — never a made-up segmentation. */
function SyllableProgress({ segments, doneCount }: { segments: string[]; doneCount: number }) {
  if (segments.length === 0) return null;
  return (
    <View style={styles.syllableRow}>
      {segments.map((s, i) => (
        <View
          key={i}
          style={[
            styles.syllableCell,
            { backgroundColor: i < doneCount ? 'rgba(168,217,151,.85)' : nb.cream, transform: [{ rotate: i % 2 ? '1.5deg' : '-1.5deg' }] },
          ]}
        >
          <Text numberOfLines={1} style={styles.syllableCellText}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

function ScoreCard({
  overall, accuracy, fluency, prosody, prosodyAvailable,
}: { overall: number; accuracy: number; fluency: number; prosody: number; prosodyAvailable: boolean }) {
  return (
    <NbPaper rot={-0.5} bg="rgba(168,217,151,.35)" style={styles.scoreCard}>
      {/* The total is the one number on this screen written by hand — it is the verdict,
          and the three measured sub-scores beside it are the printed evidence. */}
      <View style={styles.scoreTotal}>
        <Text style={styles.scoreTotalNum}>{Math.round(overall)}</Text>
        <Text style={styles.scoreTotalMax}>/ 100</Text>
      </View>
      <ScoreBars accuracy={accuracy} fluency={fluency} prosody={prosody} prosodyAvailable={prosodyAvailable} />
    </NbPaper>
  );
}

function WaveCompare({ myBars, myDurationMs, nativeDurationMs }: { myBars: number[]; myDurationMs?: number; nativeDurationMs?: number }) {
  const t = useT();
  const compare = myDurationMs != null && nativeDurationMs != null
    ? t('pron.vsNative', { sec: (nativeDurationMs / 1000).toFixed(1), pace: paceLabel(t, myDurationMs, nativeDurationMs) })
    : null;
  return (
    <DarkPanel style={styles.waveCompare}>
      {!!compare && <Text style={nbText.hand(14, '#9BB8C6')}>{compare}</Text>}
      <View style={styles.waveCompareRow}>
        <View style={styles.waveCompareTag}>
          <Text style={styles.waveCompareTagText}>{t('pron.mine')}</Text>
        </View>
        {myDurationMs != null && <Text style={styles.waveCompareDuration}>{t('pron.seconds', { sec: (myDurationMs / 1000).toFixed(1) })}</Text>}
      </View>
      <Wave bars={myBars} height={30} />
    </DarkPanel>
  );
}

function ResultActions({ onRetry, onNext, nextDisabled }: { onRetry: () => void; onNext: () => void; nextDisabled: boolean }) {
  const t = useT();
  return (
    <View style={styles.actionsWrap}>
      <View style={{ flexDirection: 'row', gap: 9 }}>
        <View style={{ flex: 1 }}>
          <NbButton variant="paper" full icon="mic" rot={-0.5} onPress={onRetry}>{t('pron.recordAgain')}</NbButton>
        </View>
        <View style={{ flex: 1 }}>
          <NbButton variant="ink" full iconRight="chevronRight" iconColor={nb.paper} rot={0.4} disabled={nextDisabled} onPress={onNext}>
            {t('pron.nextSentence')}
          </NbButton>
        </View>
      </View>
      {/* Rendered, deliberately dead — the drill screen is not built (business-logic-model
          §1). Announced rather than hidden: it is the answer to "so what do I do about
          the two bad phonemes", and the note below says when. */}
      <NbButton variant="dashed" full disabled icon="lock" onPress={() => {}}>{t('pron.drill')}</NbButton>
      <Text style={[nbText.hand(13, nb.soft), { textAlign: 'center' }]}>{t('pron.drillSoon')}</Text>
    </View>
  );
}

function PermissionBody({ onOpenSettings, onRecheck }: { onOpenSettings: () => void; onRecheck: () => void }) {
  const t = useT();
  return (
    <View style={styles.permBody}>
      <NbMemo color={nb.blue}>
        <Text style={nbText.body(12)}>{t('pron.micWhy')}</Text>
      </NbMemo>
      <NbButton variant="ink" size="lg" full icon="gear" iconColor={nb.paper} onPress={onOpenSettings}>{t('pron.openSettings')}</NbButton>
      <NbButton variant="paper" size="lg" full onPress={onRecheck}>{t('pron.recheckPermission')}</NbButton>
    </View>
  );
}

export default function PronunciationRoute() {
  const t = useT();
  const params = useLocalSearchParams<{
    sentenceKey: string;
    referenceText?: string;
    scenarioId?: string;
    reviewCardId?: string;
    origin?: string;
    ctx?: string;
    step?: string;
    // Not part of frontend-components §3's official param list — an addition
    // so "다음 문장" (SoT L213) can do something real instead of either
    // fabricating a next sentence or silently no-op'ing. Absent until a
    // caller (T9's job) supplies it; the button stays disabled until then.
    // See task-8-report.md's judgment-call log.
    nextText?: string;
  }>();
  const router = useRouter();

  const referenceText = params.referenceText ?? '';
  const ctx = params.ctx ?? '';
  const idleStep = params.step ?? t('pron.practice');
  const origin = params.origin || 'freeform';

  const [pron, setPron] = useState<PronState>(initialPronState);
  const dispatch = useCallback((type: PronEventType) => setPron((s) => next(s, { type })), []);

  const [banner, setBanner] = useState<string | null>(null);
  const [reference, setReference] = useState<SentenceReference>({});
  const [attempts, setAttempts] = useState<SpeechAttemptRow[]>([]);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  // Rolling window (last ~2s at 100ms polling) for the LIVE meter — a VU-meter
  // read is supposed to show only recent input, not the whole clip.
  const [liveBars, setLiveBars] = useState<number[]>(() => Array(BAR_COUNT).fill(0.05));
  // Fixed-size, FULL-recording waveform for the result screen's "내 발음" row
  // — review finding: reusing liveBars there rendered only the recording's
  // last ~2 seconds as if that were the whole utterance. Computed once, at
  // stop time, from every sample collected (fullSamplesRef below).
  const [myWaveform, setMyWaveform] = useState<number[]>(() => Array(BAR_COUNT).fill(0.05));

  const recorder = useAudioRecorder(WAV_16K_MONO);
  const recorderState = useAudioRecorderState(recorder, 100);
  const stoppedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fullSamplesRef = useRef<number[]>([]);

  // Native reference-audio playback ("🔊 원어민" / "0.5× 느리게", Task 11).
  // Downloaded lazily (on first tap, not on mount) — a learner who never
  // presses play shouldn't pay for the download, and TargetCard's chips
  // already show a real disabled state while `nativeAvailable` is false, so
  // there's nothing useful to show for a background prefetch anyway.
  const nativePlayer = useAudioPlayer(undefined, { updateInterval: 100 });
  const nativeAudioPathRef = useRef<string | null>(null);
  const nativeAudioLoadingRef = useRef(false);

  // ── load reference + attempt history whenever the sentence changes ───────
  useEffect(() => {
    let alive = true;
    if (!referenceText) return;
    api.speechReference(referenceText).then((r) => { if (alive) setReference(r); }).catch(() => { if (alive) setReference({}); });
    api.speechAttempts(referenceText, 3).then((rows) => { if (alive) setAttempts(rows); }).catch(() => { if (alive) setAttempts([]); });
    return () => { alive = false; };
  }, [referenceText]);

  // A new sentence invalidates whatever native clip was cached for the
  // previous one — without this, tapping 원어민 right after "다음 문장" would
  // play the OLD sentence's audio (nativeAudioPathRef still pointing at it).
  // Review round 2 (minor): this alone only stopped FUTURE taps from reusing
  // the stale path — a clip already mid-playback from the previous sentence
  // kept audibly playing straight through the transition. pause() (best-
  // effort; the player may have nothing loaded yet) stops that.
  useEffect(() => {
    nativeAudioPathRef.current = null;
    try {
      nativePlayer.pause();
    } catch {
      // no-op — nothing was loaded/playing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceText]);

  // ── live waveform while recording (rolling tail + full-clip accumulator) ──
  useEffect(() => {
    if (pron !== 'recording') return;
    const amp = normalizeMetering(recorderState.metering);
    fullSamplesRef.current.push(amp);
    setLiveBars((prev) => [...prev.slice(1), amp]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pron, recorderState.metering]);

  // ── auto-stop before the server's hard cap (business-rules R6, margin above) ─
  useEffect(() => {
    if (pron !== 'recording') return undefined;
    stoppedRef.current = false;
    timeoutRef.current = setTimeout(() => { void stopAndScore('TIMEOUT'); }, RECORD_AUTO_STOP_MS);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pron]);

  // Review finding (Critical 1's guard): if pron ever says 'recording' while
  // the hardware genuinely isn't — the exact shape of the retry bug this
  // round fixed (state transitioned, recorder never started) — don't let the
  // screen sit there showing a fake countdown over dead air. Checked once,
  // shortly after entry, via `getStatus()` directly rather than the polled
  // `recorderState` to avoid a stale closure.
  useEffect(() => {
    if (pron !== 'recording') return undefined;
    const id = setTimeout(() => {
      if (!recorder.getStatus().isRecording) {
        if (__DEV__) console.warn('[pronunciation] pron===recording but the hardware never started — bailing out');
        // Stop and discard unconditionally. If the check is right there is
        // nothing to clean up and this is a no-op; if it is a false positive
        // on a slow device that started late, this is what keeps a native
        // session (and its file, R7) from being orphaned by the CANCEL below.
        recorder
          .stop()
          .then(() => {
            const uri = recorder.uri;
            if (uri) deleteAsync(uri, { idempotent: true }).catch(() => {});
          })
          .catch(() => {});
        Alert.alert(t('pron.recordFailed'));
        dispatch('CANCEL');
      }
    }, 400);
    return () => clearTimeout(id);
  }, [pron, recorder, dispatch]);

  // stop (and discard) the native recorder on unmount if the learner navigated away mid-recording
  useEffect(() => () => {
    recorder.stop().then(() => {
      const uri = recorder.uri;
      if (uri) deleteAsync(uri, { idempotent: true }).catch(() => {}); // R7
    }).catch(() => {});
  }, [recorder]);

  // Shared hardware start: permission → audio mode → prepare → record. Both
  // the idle/noSpeech record button AND t('pron.recordAgain') must call this — Critical
  // 1 was exactly the case where a caller dispatched an FSM event that says
  // "recording" without ever calling this, so the screen shows a countdown
  // over a recorder that was never told to start.
  const beginRecordingHardware = useCallback(async (): Promise<boolean> => {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) return false;
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    fullSamplesRef.current = [];
    setLiveBars(Array(BAR_COUNT).fill(0.05));
    setBanner(null);
    return true;
  }, [recorder]);

  const startRecording = useCallback(async () => {
    try {
      const ok = await beginRecordingHardware();
      dispatch(ok ? 'START_RECORDING' : 'MIC_DENIED');
    } catch {
      Alert.alert(t('pron.recordFailed'));
    }
  }, [dispatch, beginRecordingHardware]);

  const stopAndScore = useCallback(async (reason: 'STOP' | 'TIMEOUT') => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch(reason);
    setMyWaveform(downsampleAmplitude(fullSamplesRef.current, BAR_COUNT));
    let uri: string | null = null;
    try {
      await recorder.stop();
      uri = recorder.uri;
      if (!uri) throw new Error('no audio uri');
      const b64 = await readAsStringAsync(uri, { encoding: EncodingType.Base64 });
      const res = await api.assessPronunciation(referenceText, b64, {
        origin,
        scenarioId: params.scenarioId,
        reviewCardId: params.reviewCardId,
      });
      setResult(res);
      dispatch('SUCCESS');
    } catch (e) {
      const status = statusOf(e);
      if (status === 422) {
        setBanner(t(NO_SPEECH_KEY));
        dispatch('NO_SPEECH');
      } else if (status !== undefined && status >= 400 && status < 500) {
        // Not transient — the same referenceText/audio will fail again.
        // Distinct copy + a dev warning so this doesn't masquerade as a
        // passing "server hiccup" (review finding).
        if (__DEV__) console.warn('[pronunciation] /pronunciation rejected the request (4xx) — this will recur, not a transient failure', status);
        setBanner(t(CLIENT_ERROR_KEY));
        dispatch('ERROR');
      } else {
        setBanner(t(SERVER_ERROR_KEY));
        dispatch('ERROR');
      }
    } finally {
      // R7: the WAV never persists past scoring, success or failure alike.
      if (uri) await deleteAsync(uri, { idempotent: true }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, recorder, referenceText, origin, params.scenarioId, params.reviewCardId]);

  const handleBack = useCallback(() => {
    if (pron === 'scoring') return; // no escape once the request is in flight
    if (pron === 'recording') {
      stoppedRef.current = true;
      recorder.stop().then(() => {
        const uri = recorder.uri;
        if (uri) deleteAsync(uri, { idempotent: true }).catch(() => {}); // R7: discard, don't upload
      }).catch(() => {});
      dispatch('CANCEL');
    }
    router.back();
  }, [pron, recorder, dispatch, router]);

  // Critical 1 fix: RETRY used to only move the FSM to 'recording' without
  // ever calling the hardware — the dark shell/wave/countdown all rendered
  // over a recorder that was never started, and the eventual auto-stop
  // re-sent the PREVIOUS attempt's leftover file (recorder.uri still pointed
  // at it), silently double-submitting a scored attempt to an append-only
  // table (I1). t('pron.recordAgain') must start real hardware exactly like the
  // idle/noSpeech record button does.
  const retry = useCallback(async () => {
    // Clear the previous score only AFTER the mic is actually live. Doing it
    // first meant a native failure here (anything other than the handled
    // permission denial) left the FSM in `result` with `result === null`, so
    // the result branch's `pron === 'result' && result` guard failed and the
    // learner got a blank screen with their score gone from view.
    try {
      const ok = await beginRecordingHardware();
      if (!ok) {
        dispatch('MIC_DENIED');
        return;
      }
      setResult(null);
      dispatch('RETRY');
    } catch {
      Alert.alert(t('pron.recordFailed'));
    }
  }, [dispatch, beginRecordingHardware]);

  const goNext = useCallback(() => {
    if (!params.nextText) return;
    // One template literal (not string concatenation) so expo-router's typed
    // routes can match it against the generated `/pronunciation/${string}?
    // ${string}` pattern. Every param is individually encodeURIComponent'd —
    // referenceText especially, since an un-encoded `#` truncates the rest of
    // the query string at that point (the same bug hit in elevator/[building].tsx).
    const scenarioQS = params.scenarioId ? `&scenarioId=${encodeURIComponent(params.scenarioId)}` : '';
    router.replace(
      `/pronunciation/${encodeURIComponent(params.nextText.slice(0, 40))}?referenceText=${encodeURIComponent(params.nextText)}&ctx=${encodeURIComponent(ctx)}&step=${encodeURIComponent(idleStep)}&origin=${encodeURIComponent(origin)}${scenarioQS}`
    );
  }, [params.nextText, params.scenarioId, ctx, idleStep, origin, router]);

  const openSettings = useCallback(() => { Linking.openSettings().catch(() => {}); }, []);
  const recheckPermission = useCallback(async () => {
    const perm = await requestRecordingPermissionsAsync();
    if (perm.granted) dispatch('PERMISSION_GRANTED');
  }, [dispatch]);

  // Downloads (once) and caches locally the reference audio GET /speech/
  // reference/audio.wav serves for the current sentence. iOS AVPlayer won't
  // stream cleartext-http localhost (ATS) — same reason ListenQuiz.tsx
  // downloads to a local file before playing rather than pointing the player
  // straight at the URL.
  const ensureNativeAudioLoaded = useCallback(async (): Promise<boolean> => {
    if (nativeAudioPathRef.current) return true;
    if (nativeAudioLoadingRef.current) return false; // a concurrent tap is already loading it
    nativeAudioLoadingRef.current = true;
    try {
      const path = `${cacheDirectory}pron-ref-${audioCacheKey(referenceText)}.wav`;
      const info = await getInfoAsync(path);
      if (!info.exists) {
        // Review round 2 (Important 2): downloadAsync writes the response
        // body to disk regardless of status code — a 404/401 JSON error
        // body would otherwise get cached as if it were the WAV. Worse, the
        // next tap sees getInfoAsync().exists === true and skips
        // re-downloading forever, so the device never recovers even after
        // the server has real audio. Checking status here, and deleting a
        // bad download, keeps every miss a real retry candidate.
        //
        // This request also bypasses axios entirely (expo-file-system, not
        // http.get), so it does NOT go through client.ts's 401 refresh
        // interceptor — a genuinely reachable path on an expired access
        // token. authHeaders() sends whatever token is current, but a 401
        // here just fails this ensure-call cleanly rather than silently
        // caching a JSON error body as "audio".
        const res = await downloadAsync(api.speechReferenceAudioUrl(referenceText), path, { headers: api.authHeaders() });
        if (res.status !== 200) {
          await deleteAsync(path, { idempotent: true }).catch(() => {});
          return false;
        }
      }
      nativePlayer.replace({ uri: path });
      nativeAudioPathRef.current = path;
      return true;
    } catch {
      return false;
    } finally {
      nativeAudioLoadingRef.current = false;
    }
  }, [referenceText, nativePlayer]);

  // "0.5× 느리게" is a client-side playback rate, not a second TTS call with
  // an SSML prosody rate (task-11-report.md judgment call 3) — mirrors
  // ListenQuiz.tsx's own 0.7×/1.0× buttons, which already use
  // player.setPlaybackRate against ONE synthesized clip.
  // rate stays a parameter although every caller now passes 1.0: the 0.5×
  // 느리게 chip was removed as unusably slow ("0.5배속은 너무 느려. 1배속으로 해줘"),
  // and a future speed control belongs here rather than in a second player.
  const playNativeAudio = useCallback(async (rate: number) => {
    const ok = await ensureNativeAudioLoaded();
    if (!ok) {
      if (__DEV__) console.warn('[pronunciation] reference audio unavailable');
      return;
    }
    try {
      nativePlayer.setPlaybackRate(rate);
      nativePlayer.seekTo(0);
      nativePlayer.play();
    } catch {
      if (__DEV__) console.warn('[pronunciation] failed to play reference audio');
    }
  }, [ensureNativeAudioLoaded, nativePlayer]);

  // ── derived, render-only data ─────────────────────────────────────────────
  const tokens = useMemo(() => splitTargetTokens(referenceText, []), [referenceText]);
  // A reference row existing at all (business-rules R9) is the signal that
  // audio should exist too — Reference() now persists both together (Task
  // 11). If playback ever 404s despite this (a legacy row predating audio
  // storage), ensureNativeAudioLoaded's catch just leaves the tap a no-op;
  // there is no separate probe call to make first.
  const nativeAvailable = !!reference.sentenceKey;

  const hint = t('pron.attemptOf', { n: Math.min(3, attempts.length + 1) });

  // AttemptHistory always shows 3 rows (business-rules R3). `attempts` is
  // already the server's most-recent-3-oldest-first window, so any slot past
  // its length hasn't happened yet — labeled with the attempt number it WILL
  // get (continuing from the last real one), scored null (not 0: R3's own
  // "—" vs a genuine zero-score attempt distinction).
  const historyRows = useMemo((): AttemptDisplayRow[] => Array.from({ length: 3 }, (_, i) => (
    i < attempts.length
      ? { no: attempts[i].attemptNo ?? i + 1, score: attempts[i].overall ?? null }
      : { no: (attempts[attempts.length - 1]?.attemptNo ?? 0) + (i - attempts.length + 1), score: null }
  )), [attempts]);

  const progressSegments = useMemo(() => {
    const fromRef = reference.words?.flatMap((w) => (w.syllables?.length ? w.syllables.map((s) => s.syllable) : [w.word]));
    if (fromRef && fromRef.length) return fromRef;
    return referenceText.split(/\s+/).filter(Boolean);
  }, [reference, referenceText]);
  // Display uses the SoT's "최대 10초" copy (RECORD_DISPLAY_MS); the actual
  // auto-stop fires a bit earlier (RECORD_AUTO_STOP_MS) so recorder.stop()'s
  // flush latency doesn't push the WAV past the server's hard 10s cap.
  const elapsedSec = Math.min(10, Math.floor(recorderState.durationMillis / 1000));
  const remainingSec = Math.max(0, RECORD_DISPLAY_MS / 1000 - elapsedSec);
  const doneCount = progressSegments.length
    ? Math.min(progressSegments.length, Math.floor((recorderState.durationMillis / RECORD_AUTO_STOP_MS) * progressSegments.length))
    : 0;

  // Labelled with the GRAPHEME — the spelling — not the phonetic syllable.
  //
  // Azure returns both per syllable, and we ask for PhonemeAlphabet: IPA, which makes its
  // `syllable` field an IPA string: "pronunciation" came back as prə · nʌn · si · eɪ · ʃən
  // and read as a different word entirely. The learner is looking at a chip to find which
  // PART of the word they missed, and they navigate by spelling. `grapheme` is exactly
  // that, and it was already carried through the port and the contract — only the screen
  // had not asked. IPA still has its place: the correction cards below show it beside the
  // spelling, where it is labelled as pronunciation rather than mistaken for the word.
  const syllableChips = useMemo((): SyllableChip[] =>
    (result?.words ?? []).flatMap((w) =>
      (w.syllables ?? []).map((s): SyllableChip => ({
        // Falls back to the phonetic form rather than rendering an empty chip: a locale
        // without grapheme segmentation should still show where the syllables divide.
        label: s.grapheme?.trim() || s.syllable,
        band: syllableBand(s.accuracy),
      }))
    ),
  [result]);

  const correction = useMemo(
    () => buildCorrectionPoints(
      result?.words ?? [],
      // Task 11: result.phonemeTips is the server's deduplicated Korean
      // coaching map (POST /pronunciation), sourced from content/phonemetips.
      // T7 left this as `() => undefined` because nothing populated the
      // field yet (task-8-report.md) — phonemeTipLookup is the real
      // implementation now that it does.
      phonemeTipLookup(result?.phonemeTips)
    ),
    [result]
  );
  useEffect(() => {
    if (correction.suspectAllZero && __DEV__) {
      // eslint-disable-next-line no-console
      console.warn('[pronunciation] suspectAllZero: phoneme/syllable offsets look degenerate (all zero) — correction points suppressed. See lib/pronTokens.ts matchPhonemesToSyllables.');
    }
  }, [correction.suspectAllZero]);

  const dark = pron === 'recording' || pron === 'scoring';
  const step = pron === 'recording' ? t('pron.listening')
    : pron === 'scoring' ? t('pron.scoring')
    : pron === 'result' ? t('pron.scoreTitle')
    : pron === 'permissionDenied' ? t('pron.needMic')
    : idleStep;

  return (
    <NbSheet dark={dark}>
      <Stack.Screen options={TASK_SCREEN} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Head ctx={ctx} step={step} dark={dark} onBack={handleBack} backDisabled={pron === 'scoring'} />

        {(pron === 'idle' || pron === 'noSpeech') && (
          <>
            {pron === 'noSpeech' && !!banner && <Banner text={banner} />}
            <View style={styles.body}>
              <TargetCard
                tokens={tokens}
                ipa={reference.ipa}
                hint={hint}
                nativeAvailable={nativeAvailable}
                onPlayNative={() => { void playNativeAudio(1.0); }}
              />
            </View>
            <RiskNote />
            <BigButton
              size={96}
              icon={<NbIcon name="mic" size={42} />}
              label={t('pron.tapToRecord')}
              sub={t('pron.recordHint')}
              note={t('pron.press')}
              onPress={() => { void startRecording(); }}
            />
            <View style={[styles.body, { marginTop: 24 }]}>
              <AttemptHistory attempts={historyRows} />
            </View>
          </>
        )}

        {pron === 'permissionDenied' && <PermissionBody onOpenSettings={openSettings} onRecheck={recheckPermission} />}

        {pron === 'recording' && (
          <>
            <View style={styles.body}><TargetLine tokens={tokens} /></View>
            <View style={[styles.body, { marginTop: 16 }]}>
              <WavePanel bars={liveBars} elapsedSec={elapsedSec} remainingSec={remainingSec} scoring={false} />
            </View>
            <View style={[styles.body, { marginTop: 16 }]}>
              <SyllableProgress segments={progressSegments} doneCount={doneCount} />
            </View>
            <BigButton
              size={92}
              dark
              icon={<View style={styles.stopGlyph} />}
              label={t('pron.tapToStop')}
              onPress={() => { void stopAndScore('STOP'); }}
            />
          </>
        )}

        {pron === 'scoring' && (
          <View style={[styles.body, { marginTop: 16 }]}>
            <WavePanel bars={liveBars} elapsedSec={elapsedSec} remainingSec={0} scoring />
          </View>
        )}

        {pron === 'result' && result && (
          <>
            <View style={styles.body}>
              <ScoreCard
                overall={result.overall}
                accuracy={result.accuracy}
                fluency={result.fluency}
                prosody={result.prosody ?? 0}
                prosodyAvailable={!!result.prosodyAvailable}
              />
            </View>
            <View style={[styles.body, { marginTop: 13 }]}>
              <SyllableGrid syllables={syllableChips} />
            </View>
            <View style={[styles.body, { marginTop: 13 }]}>
              <WaveCompare myBars={myWaveform} myDurationMs={result.durationMs} nativeDurationMs={reference.durationMs} />
            </View>
            <View style={[styles.body, { marginTop: 13 }]}>
              {/* review finding: these used to be mutually exclusive (an if/else-if), so
                  ANY word's suspectAllZero hid every OTHER word's already-valid
                  correction points, not just the affected word's own (which
                  buildCorrectionPoints already excludes on its own). The banner and any
                  surviving points are independent facts and both render when true. */}
              {correction.suspectAllZero && (
                <View style={styles.banner}>
                  <NbIcon name="bell" size={15} color={nb.red} />
                  <Text style={[nbText.hand(14.5), { flex: 1, minWidth: 0 }]}>{t('pron.suspect')}</Text>
                </View>
              )}
              {correction.points.length > 0 && (
                <>
                  <Text style={[nbText.hand(16), { marginBottom: 4 }]}>{t('pron.correctionPoints', { n: correction.points.length })}</Text>
                  {correction.points.map((p, i) => (
                    <View key={`${p.syllable}-${p.ipa}`} style={{ marginTop: 10 }}>
                      <CorrectionCard
                        syllable={p.syllable}
                        ipa={p.ipa}
                        message={p.message}
                        severe={p.severe}
                        rot={i % 2 ? 0.4 : -0.4}
                        // Task 11 added sentence-level reference audio (TargetCard's
                        // 원어민 chip), not a per-syllable clip — slicing just this
                        // syllable's span out of the full WAV is a distinct feature this
                        // task didn't build (task-11-report.md's open concerns).
                        onPlay={() => { if (__DEV__) console.warn('[pronunciation] no per-syllable audio clip yet — see task-11-report.md'); }}
                      />
                    </View>
                  ))}
                </>
              )}
            </View>
            <ResultActions onRetry={() => { void retry(); }} onNext={goNext} nextDisabled={!params.nextText} />
          </>
        )}
      </ScrollView>
    </NbSheet>
  );
}

const styles = StyleSheet.create({
  /** Every card on this screen shares one gutter. It used to be repeated inline as
   *  marginHorizontal:16 on eight views, and the two idle cards were the two that got
   *  missed — they sat flush against the screen edge. */
  body: { marginHorizontal: 20, marginTop: 14 },

  headWrap: { paddingHorizontal: 20, paddingTop: 52 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backChip: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  flat: { opacity: 0.4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 11 },
  ctx: { marginTop: 12 },
  step: { marginTop: 2 },

  riskBox: {
    marginHorizontal: 20, marginTop: 15, paddingVertical: 9, paddingHorizontal: 12,
    backgroundColor: '#FFF3EE', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D9A08E',
    transform: [{ rotate: '0.4deg' }],
  },

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    marginHorizontal: 20, marginTop: 14, paddingVertical: 9, paddingHorizontal: 12,
    backgroundColor: '#FFF3EE', borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#D9A08E',
  },

  bigButtonWrap: { alignItems: 'center', marginTop: 26 },
  bigButtonCap: { alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-2deg' }], ...paperShadow },
  bigButtonNote: { position: 'absolute', top: -9, right: -15, fontFamily: nbFonts.hand, fontSize: 13, color: nb.red, transform: [{ rotate: '8deg' }] },
  bigButtonLabel: { marginTop: 9 },
  stopGlyph: { width: 30, height: 30, backgroundColor: nb.dark },

  targetLine: { paddingVertical: 14, paddingHorizontal: 16 },
  targetLineText: { fontFamily: nbFonts.bodyBold, fontSize: 16.5, color: nb.ink, lineHeight: 26, textAlign: 'center' },
  targetLineHi: { backgroundColor: nb.marker },
  targetLineDrug: { textDecorationLine: 'underline' },

  wavePanel: { paddingTop: 18, paddingBottom: 12, paddingHorizontal: 14 },
  wavePanelFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  recDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: AUDIO.rec },
  recTimer: { fontFamily: nbFonts.monoBold, fontSize: 12, color: AUDIO.waveLit },

  syllableRow: { flexDirection: 'row', gap: 4 },
  syllableCell: { flex: 1, height: 26, borderWidth: 1, borderColor: '#171310', alignItems: 'center', justifyContent: 'center' },
  syllableCellText: { fontFamily: nbFonts.mono, fontSize: 7, color: nb.ink },

  scoreCard: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13, paddingHorizontal: 15 },
  scoreTotal: {
    alignItems: 'center', flexShrink: 0, paddingRight: 13,
    borderRightWidth: 1.5, borderStyle: 'dashed', borderRightColor: 'rgba(62,54,43,.3)',
  },
  scoreTotalNum: { fontFamily: nbFonts.handBold, fontSize: 40, color: nb.ink, lineHeight: 42 },
  scoreTotalMax: { fontFamily: nbFonts.monoBold, fontSize: 10, color: nb.soft },

  waveCompare: { paddingVertical: 12, paddingHorizontal: 14 },
  waveCompareRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 7, marginBottom: 8 },
  waveCompareTag: { backgroundColor: 'rgba(168,217,151,.85)', paddingVertical: 1, paddingHorizontal: 6 },
  waveCompareTagText: { fontFamily: nbFonts.monoBold, fontSize: 10, color: AUDIO.bg },
  waveCompareDuration: { fontFamily: nbFonts.mono, fontSize: 11, color: '#9BB8C6' },

  actionsWrap: { marginHorizontal: 20, marginTop: 18, gap: 10 },
  permBody: { marginHorizontal: 20, marginTop: 20, gap: 11 },
});
