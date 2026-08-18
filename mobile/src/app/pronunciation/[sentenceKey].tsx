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
// State transitions live in ./pronState.ts as a pure, independently-tested
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
  useAudioRecorder, useAudioRecorderState, requestRecordingPermissionsAsync, setAudioModeAsync,
  IOSOutputFormat, AudioQuality, type RecordingOptions,
} from 'expo-audio';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { PixelIcon } from '@/components/PixelIcon';
import { PixelButton } from '@/components/PixelButton';
import { PronCard } from '@/components/pron/PronCard';
import { TargetCard } from '@/components/pron/TargetCard';
import { Wave } from '@/components/pron/Wave';
import { SyllableGrid, type SyllableChip } from '@/components/pron/SyllableGrid';
import { ScoreBars } from '@/components/pron/ScoreBars';
import { CorrectionCard } from '@/components/pron/CorrectionCard';
import { AttemptHistory, type AttemptRow as AttemptDisplayRow } from '@/components/pron/AttemptHistory';
import { splitTargetTokens, syllableBand, buildCorrectionPoints } from '@/lib/pronTokens';
import { api, type PronunciationResult, type SentenceReference, type SpeechAttemptRow } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';
import { next, initialPronState, type PronState, type PronEventType } from './pronState';

const C = colors.ink;
const WAVE_DARK = '#0F1A24'; // SoT's dark wave-panel fill — not in theme/tokens
const RECORD_MAX_MS = 10_000; // business-rules R6
const BAR_COUNT = 20; // matches SoT's mock W1 array length

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

const NO_SPEECH_MSG = '소리가 잘 안 잡혔어요. 조용한 곳에서 다시 해볼까요?'; // business-rules §5
const SERVER_ERROR_MSG = '채점 서버가 응답하지 않아요. 잠시 후 다시.'; // business-rules §5

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

function paceLabel(mineMs: number, nativeMs: number): string {
  if (nativeMs <= 0) return '';
  const ratio = mineMs / nativeMs;
  if (ratio > 1.15) return '조금 느려요';
  if (ratio < 0.85) return '조금 빨라요';
  return '비슷해요';
}

// ── small SoT-mapped pieces kept local to this route (frontend-components §1
// lists them as part of this screen's own tree, not T7's reusable pron/ set)

function Head({
  ctx, step, dark, onBack, backDisabled,
}: { ctx: string; step: string; dark: boolean; onBack: () => void; backDisabled: boolean }) {
  return (
    <View style={styles.headWrap}>
      <View style={styles.headRow}>
        <Pressable onPress={backDisabled ? undefined : onBack} disabled={backDisabled} hitSlop={8}>
          <View
            style={[
              styles.backChip,
              { backgroundColor: dark ? colors.cream : '#fff' },
              backDisabled && styles.flat,
            ]}
          >
            <PixelIcon name="chevron-left" color={C} size={11} sw={2} />
          </View>
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.badge}>
          <PixelIcon name="mic" color={C} size={11} sw={1.8} />
          <Text style={styles.badgeText}>발음</Text>
        </View>
      </View>
      <Text style={[styles.ctx, { color: dark ? colors.textFaint : colors.textSoft }]}>{ctx}</Text>
      <Text style={[styles.step, { color: dark ? colors.cream : C }]}>{step}</Text>
    </View>
  );
}

function RiskNote() {
  return (
    <View style={styles.riskBox}>
      <PixelIcon name="alert" color={C} size={15} sw={1.8} />
      <Text style={styles.riskText}>
        약물명과 용량은 잘못 들리면 <Text style={{ color: C, fontFamily: fonts.heading }}>투약 사고</Text>로 이어져요. 음절을 끊어서 또박또박.
      </Text>
    </View>
  );
}

function Banner({ text }: { text: string }) {
  return (
    <View style={styles.banner}>
      <PixelIcon name="alert" color={C} size={14} sw={1.8} />
      <Text style={styles.bannerText}>{text}</Text>
    </View>
  );
}

function BigButton({
  size, bg, icon, label, sub, onPress, disabled,
}: { size: number; bg: string; icon: React.ReactNode; label: string; sub?: string; onPress: () => void; disabled?: boolean }) {
  return (
    <View style={styles.bigButtonWrap}>
      <Pressable onPress={disabled ? undefined : onPress} disabled={disabled} style={{ alignItems: 'center', gap: 9 }}>
        <View style={styles.bigButtonShadow} />
        <View style={[styles.bigButtonCap, { width: size, height: size, backgroundColor: disabled ? colors.textFaint : bg }]}>
          {icon}
        </View>
        <Text style={styles.bigButtonLabel}>{label}</Text>
        {!!sub && <Text style={styles.bigButtonSub}>{sub}</Text>}
      </Pressable>
    </View>
  );
}

// SoT L115-119: the sentence during recording, highlights only — no IPA, no
// playback row (those belong to the idle TargetCard).
function TargetLine({ tokens }: { tokens: { w: string; hi?: 'drug' | 'num' }[] }) {
  return (
    <PronCard bg={colors.cream} style={styles.targetLine}>
      <Text style={styles.targetLineText}>
        {tokens.map((tk, i) =>
          tk.hi ? (
            <Text key={i} style={[styles.targetLineHi, { backgroundColor: tk.hi === 'drug' ? colors.lilac : colors.yellow }]}>
              {tk.w}
            </Text>
          ) : (
            <Text key={i}>{tk.w}</Text>
          )
        )}
      </Text>
    </PronCard>
  );
}

// SoT L121-129 (recording) reused as-is for scoring with the timer row
// swapped for a progress indicator (frontend-components §4: "정지된 파형 +
// 진행 표시. 취소 불가").
function WavePanel({
  bars, elapsedSec, remainingSec, scoring,
}: { bars: number[]; elapsedSec: number; remainingSec: number; scoring: boolean }) {
  return (
    <PronCard bg={WAVE_DARK} style={styles.wavePanel}>
      <Wave bars={bars} color="#22D3EE" height={52} live={!scoring} />
      <View style={styles.wavePanelFooter}>
        {scoring ? (
          <>
            <ActivityIndicator color="#22D3EE" size="small" />
            <Text style={styles.recTimer}>채점 중…</Text>
          </>
        ) : (
          <>
            <View style={styles.recDot} />
            <Text style={styles.recTimer}>{`REC ${String(Math.floor(elapsedSec / 60)).padStart(2, '0')}:${String(elapsedSec % 60).padStart(2, '0')}`}</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.remaining}>{`남은 ${remainingSec}초`}</Text>
          </>
        )}
      </View>
    </PronCard>
  );
}

// SoT L130-134: a decorative progress strip. The demo hardcodes syllabified
// words for its one fixed sentence; here the segments come from the real
// reference's syllable breakdown when we have one (SentenceReference.words[].
// syllables[]), falling back to plain words when we don't — never a made-up
// segmentation.
function SyllableProgress({ segments, doneCount }: { segments: string[]; doneCount: number }) {
  if (segments.length === 0) return null;
  return (
    <View style={styles.syllableRow}>
      {segments.map((s, i) => (
        <View key={i} style={[styles.syllableCell, { backgroundColor: i < doneCount ? colors.mint : colors.paper }]}>
          <Text style={[styles.syllableCellText, { color: i < doneCount ? C : colors.textSoft }]} numberOfLines={1}>
            {s}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ScoreCard({
  overall, accuracy, fluency, prosody, prosodyAvailable,
}: { overall: number; accuracy: number; fluency: number; prosody: number; prosodyAvailable: boolean }) {
  return (
    <PronCard offset={4} bg={colors.mint} shadowColor={colors.mintShadow} style={styles.scoreCard}>
      <View style={styles.scoreTotal}>
        <Text style={styles.scoreTotalNum}>{Math.round(overall)}</Text>
        <Text style={styles.scoreTotalMax}>/ 100</Text>
      </View>
      <View style={styles.scoreDivider} />
      <ScoreBars accuracy={accuracy} fluency={fluency} prosody={prosody} prosodyAvailable={prosodyAvailable} />
    </PronCard>
  );
}

// SoT L185-196's two-Wave layout assumes a native waveform that this task has
// no data for — SentenceReference carries no amplitude envelope, and there is
// no HTTP route serving the synthesized reference audio's bytes at all (see
// task-8-report.md). Rather than draw a fabricated native Wave, this shows
// the real duration-only comparison (SentenceReference.durationMs vs the
// server-verified PronunciationResult.durationMs — both real numbers) as a
// caption above the one Wave we DO have real amplitudes for: mine.
function WaveCompare({ myBars, myDurationMs, nativeDurationMs }: { myBars: number[]; myDurationMs?: number; nativeDurationMs?: number }) {
  const compare = myDurationMs != null && nativeDurationMs != null
    ? `원어민 ${(nativeDurationMs / 1000).toFixed(1)}초 대비 ${paceLabel(myDurationMs, nativeDurationMs)}`
    : null;
  return (
    <PronCard bg={WAVE_DARK} style={styles.waveCompare}>
      {!!compare && <Text style={styles.waveCompareCaption}>{compare}</Text>}
      <View style={styles.waveCompareRow}>
        <View style={[styles.waveCompareTag, { backgroundColor: colors.mint }]}>
          <Text style={styles.waveCompareTagText}>내 발음</Text>
        </View>
        {myDurationMs != null && <Text style={styles.waveCompareDuration}>{(myDurationMs / 1000).toFixed(1)}초</Text>}
      </View>
      <Wave bars={myBars} color="#4FC79D" height={34} />
    </PronCard>
  );
}

function ResultActions({ onRetry, onNext, nextDisabled }: { onRetry: () => void; onNext: () => void; nextDisabled: boolean }) {
  return (
    <View style={{ marginTop: 15, marginHorizontal: 16, gap: 9 }}>
      <View style={{ flexDirection: 'row', gap: 9 }}>
        <PixelButton label="다시 녹음" icon="mic" bg="#fff" shadowColor={C} borderWidth={3} offset={3} fontSize={12} onPress={onRetry} style={{ flex: 1 }} />
        <PixelButton
          label="다음 문장 ›"
          bg={colors.mint}
          shadowColor={colors.mintShadow}
          borderWidth={3}
          offset={3}
          fontSize={12}
          onPress={onNext}
          disabled={nextDisabled}
          style={{ flex: 1 }}
        />
      </View>
      {/* SoT L215: rendered, deliberately disabled — this task's range excludes
          ScreenPronDrill (business-logic-model §1). Removing this button would
          shift the layout away from the SoT the next time it's re-added. */}
      <Pressable disabled style={styles.drillButton}>
        <PixelIcon name="target" color={colors.textFaint} size={13} sw={1.8} />
        <Text style={styles.drillButtonText}>약한 음소만 드릴하기</Text>
      </Pressable>
      <Text style={styles.drillNote}>드릴 기능은 곧 제공돼요</Text>
    </View>
  );
}

function PermissionBody({ onOpenSettings, onRecheck }: { onOpenSettings: () => void; onRecheck: () => void }) {
  return (
    <View style={{ marginHorizontal: 16, marginTop: 20, gap: 12 }}>
      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.text, lineHeight: 18 }}>
        발음을 채점하려면 마이크 권한이 필요해요. 설정에서 마이크 접근을 허용한 뒤 다시 시도해 주세요.
      </Text>
      <PixelButton label="설정 열기" bg={colors.blue} shadowColor={C} onPress={onOpenSettings} full />
      <PixelButton label="권한 다시 확인" bg="#fff" shadowColor={C} onPress={onRecheck} full />
    </View>
  );
}

export default function PronunciationRoute() {
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
  const idleStep = params.step ?? '발음 연습';
  const origin = params.origin || 'freeform';

  const [pron, setPron] = useState<PronState>(initialPronState);
  const dispatch = useCallback((type: PronEventType) => setPron((s) => next(s, { type })), []);

  const [banner, setBanner] = useState<string | null>(null);
  const [reference, setReference] = useState<SentenceReference>({});
  const [attempts, setAttempts] = useState<SpeechAttemptRow[]>([]);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [bars, setBars] = useState<number[]>(() => Array(BAR_COUNT).fill(0.05));

  const recorder = useAudioRecorder(WAV_16K_MONO);
  const recorderState = useAudioRecorderState(recorder, 100);
  const stoppedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── load reference + attempt history whenever the sentence changes ───────
  useEffect(() => {
    let alive = true;
    if (!referenceText) return;
    api.speechReference(referenceText).then((r) => { if (alive) setReference(r); }).catch(() => { if (alive) setReference({}); });
    api.speechAttempts(referenceText, 3).then((rows) => { if (alive) setAttempts(rows); }).catch(() => { if (alive) setAttempts([]); });
    return () => { alive = false; };
  }, [referenceText]);

  // ── live waveform while recording ────────────────────────────────────────
  useEffect(() => {
    if (pron !== 'recording') return;
    setBars((prev) => [...prev.slice(1), normalizeMetering(recorderState.metering)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pron, recorderState.metering]);

  // ── 10s auto-stop (business-rules R6) ────────────────────────────────────
  useEffect(() => {
    if (pron !== 'recording') return undefined;
    stoppedRef.current = false;
    timeoutRef.current = setTimeout(() => { void stopAndScore('TIMEOUT'); }, RECORD_MAX_MS);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pron]);

  // stop the native recorder on unmount if the learner navigated away mid-recording
  useEffect(() => () => { recorder.stop().catch(() => {}); }, [recorder]);

  const startRecording = useCallback(async () => {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) { dispatch('MIC_DENIED'); return; }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setBars(Array(BAR_COUNT).fill(0.05));
      setBanner(null);
      dispatch('START_RECORDING');
    } catch {
      Alert.alert('녹음을 시작하지 못했습니다.');
    }
  }, [dispatch, recorder]);

  const stopAndScore = useCallback(async (reason: 'STOP' | 'TIMEOUT') => {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    dispatch(reason);
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error('no audio uri');
      // R7: only the base64 goes over the wire; nothing persists the WAV
      // locally past this read (readAsStringAsync reads expo-audio's own
      // scratch file, which the OS/expo-audio manages — this route never
      // writes a copy of its own).
      const b64 = await readAsStringAsync(uri, { encoding: EncodingType.Base64 });
      const res = await api.assessPronunciation(referenceText, b64, {
        origin,
        scenarioId: params.scenarioId,
        reviewCardId: params.reviewCardId,
      });
      setResult(res);
      dispatch('SUCCESS');
    } catch (e) {
      if (statusOf(e) === 422) {
        setBanner(NO_SPEECH_MSG);
        dispatch('NO_SPEECH');
      } else {
        setBanner(SERVER_ERROR_MSG);
        dispatch('ERROR');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, recorder, referenceText, origin, params.scenarioId, params.reviewCardId]);

  const handleBack = useCallback(() => {
    if (pron === 'scoring') return; // no escape once the request is in flight
    if (pron === 'recording') {
      stoppedRef.current = true;
      recorder.stop().catch(() => {});
      dispatch('CANCEL');
    }
    router.back();
  }, [pron, recorder, dispatch, router]);

  const retry = useCallback(() => { setResult(null); dispatch('RETRY'); }, [dispatch]);

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

  // ── derived, render-only data ─────────────────────────────────────────────
  const tokens = useMemo(() => splitTargetTokens(referenceText, []), [referenceText]);
  // Judgment call (task-8-report.md): SentenceReference carries no amplitude
  // envelope and no HTTP route serves the synthesized reference audio's
  // bytes, so native playback can never actually work yet — nativeAvailable
  // stays false regardless of whether the reference metadata (ipa) exists.
  // The IPA line itself is real, cheap metadata and renders independently.
  const nativeAvailable = false;

  const hint = `3회 중 ${Math.min(3, attempts.length + 1)}회차`;

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
  const elapsedSec = Math.min(10, Math.floor(recorderState.durationMillis / 1000));
  const remainingSec = Math.max(0, 10 - elapsedSec);
  const doneCount = progressSegments.length
    ? Math.min(progressSegments.length, Math.floor((recorderState.durationMillis / RECORD_MAX_MS) * progressSegments.length))
    : 0;

  const syllableChips = useMemo((): SyllableChip[] =>
    (result?.words ?? []).flatMap((w) => (w.syllables ?? []).map((s): SyllableChip => ({ label: s.syllable, band: syllableBand(s.accuracy) }))),
  [result]);

  const correction = useMemo(
    () => buildCorrectionPoints(
      result?.words ?? [],
      // server/internal/content/phonemetips exists but is not wired into any
      // HTTP response yet (task-8-report.md) — nothing to look up until a
      // response field carries a tip. Kept as a real function call (not
      // inlined as "always empty") so this starts working the moment that
      // field ships, with no change needed here.
      () => undefined
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
  const step = pron === 'recording' ? '듣고 있어요…'
    : pron === 'scoring' ? '채점 중…'
    : pron === 'result' ? '발음 채점'
    : pron === 'permissionDenied' ? '마이크 권한이 필요해요'
    : idleStep;

  return (
    <View style={{ flex: 1, backgroundColor: dark ? C : colors.paper }}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Head ctx={ctx} step={step} dark={dark} onBack={handleBack} backDisabled={pron === 'scoring'} />

        {(pron === 'idle' || pron === 'noSpeech') && (
          <>
            {pron === 'noSpeech' && !!banner && <Banner text={banner} />}
            <TargetCard
              tokens={tokens}
              ipa={reference.ipa}
              hint={hint}
              nativeAvailable={nativeAvailable}
              onPlayNative={() => { if (__DEV__) console.warn('[pronunciation] no native audio endpoint yet'); }}
              onPlaySlow={() => { if (__DEV__) console.warn('[pronunciation] no native audio endpoint yet'); }}
            />
            <RiskNote />
            <BigButton
              size={92}
              bg={colors.red}
              icon={<PixelIcon name="mic" color={C} size={38} sw={2.4} />}
              label="눌러서 녹음"
              sub="조용한 곳에서 · 최대 10초"
              onPress={startRecording}
            />
            <AttemptHistory attempts={historyRows} />
          </>
        )}

        {pron === 'permissionDenied' && <PermissionBody onOpenSettings={openSettings} onRecheck={recheckPermission} />}

        {pron === 'recording' && (
          <>
            <TargetLine tokens={tokens} />
            <View style={{ marginHorizontal: 16, marginTop: 20 }}>
              <WavePanel bars={bars} elapsedSec={elapsedSec} remainingSec={remainingSec} scoring={false} />
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 14 }}>
              <SyllableProgress segments={progressSegments} doneCount={doneCount} />
            </View>
            <BigButton
              size={84}
              bg={colors.cream}
              icon={<View style={styles.stopGlyph} />}
              label="눌러서 끝내기"
              onPress={() => { void stopAndScore('STOP'); }}
            />
          </>
        )}

        {pron === 'scoring' && (
          <View style={{ marginHorizontal: 16, marginTop: 20 }}>
            <WavePanel bars={bars} elapsedSec={elapsedSec} remainingSec={0} scoring />
          </View>
        )}

        {pron === 'result' && result && (
          <>
            <View style={{ marginHorizontal: 16, marginTop: 14 }}>
              <ScoreCard
                overall={result.overall}
                accuracy={result.accuracy}
                fluency={result.fluency}
                prosody={result.prosody ?? 0}
                prosodyAvailable={!!result.prosodyAvailable}
              />
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 13 }}>
              <SyllableGrid syllables={syllableChips} />
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 13 }}>
              <WaveCompare myBars={bars} myDurationMs={result.durationMs} nativeDurationMs={reference.durationMs} />
            </View>
            <View style={{ marginHorizontal: 16, marginTop: 13 }}>
              {correction.suspectAllZero ? (
                <View style={styles.suspectBanner}>
                  <PixelIcon name="alert" color={C} size={13} sw={1.8} />
                  <Text style={styles.suspectText}>교정 데이터 이상 — 지금은 표시할 수 없어요</Text>
                </View>
              ) : correction.points.length > 0 ? (
                <>
                  <Text style={styles.correctionHeader}>{`━ 교정 포인트 ${correction.points.length} ━━━━━━`}</Text>
                  {correction.points.map((p) => (
                    <View key={`${p.syllable}-${p.ipa}`} style={{ marginBottom: 8 }}>
                      <CorrectionCard
                        syllable={p.syllable}
                        ipa={p.ipa}
                        message={p.message}
                        severe={p.severe}
                        onPlay={() => { if (__DEV__) console.warn('[pronunciation] no phoneme audio endpoint yet'); }}
                      />
                    </View>
                  ))}
                </>
              ) : null}
            </View>
            <ResultActions onRetry={retry} onNext={goNext} nextDisabled={!params.nextText} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headWrap: { paddingHorizontal: 16, paddingTop: 48 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backChip: { borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 9 },
  flat: { opacity: 0.4 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8,
  },
  badgeText: { fontFamily: fonts.heading, fontSize: 10, color: C },
  ctx: { fontFamily: fonts.body, fontSize: 10, marginTop: 11 },
  step: { fontFamily: fonts.heading, fontSize: 15, marginTop: 4 },

  riskBox: {
    flexDirection: 'row', gap: 9, margin: 16, marginTop: 13,
    backgroundColor: colors.peach, borderWidth: 3, borderColor: C, padding: 11,
  },
  riskText: { flex: 1, fontFamily: fonts.body, fontSize: 10.5, color: colors.text, lineHeight: 15 },

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 8, margin: 16, marginBottom: 0,
    backgroundColor: colors.peach, borderWidth: 2, borderColor: C, padding: 10,
  },
  bannerText: { flex: 1, fontFamily: fonts.body, fontSize: 11, color: colors.text, lineHeight: 15 },

  bigButtonWrap: { alignItems: 'center', marginTop: 22, marginBottom: 6 },
  bigButtonShadow: { position: 'absolute' },
  bigButtonCap: { borderWidth: 4, borderColor: C, alignItems: 'center', justifyContent: 'center' },
  bigButtonLabel: { fontFamily: fonts.heading, fontSize: 12.5, color: C },
  bigButtonSub: { fontFamily: fonts.body, fontSize: 9.5, color: colors.textSoft },
  stopGlyph: { width: 22, height: 22, backgroundColor: C },

  targetLine: { marginHorizontal: 16, marginTop: 16, padding: 13 },
  targetLineText: { fontFamily: fonts.body, fontSize: 14, color: C, lineHeight: 22, textAlign: 'center' },
  targetLineHi: { borderWidth: 2, borderColor: C, paddingHorizontal: 5, paddingVertical: 1 },

  wavePanel: { padding: 12 },
  wavePanelFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  recDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#EF4444' },
  recTimer: { fontFamily: fonts.heading, fontSize: 12, color: '#22D3EE' },
  remaining: { fontFamily: fonts.body, fontSize: 10, color: '#94A3B8' },

  syllableRow: { flexDirection: 'row', gap: 5 },
  syllableCell: { flex: 1, borderWidth: 2, borderColor: C, paddingVertical: 5, paddingHorizontal: 2, alignItems: 'center' },
  syllableCellText: { fontFamily: fonts.heading, fontSize: 8, lineHeight: 10 },

  scoreCard: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 },
  scoreTotal: { alignItems: 'center', flexShrink: 0 },
  scoreTotalNum: { fontFamily: fonts.heading, fontSize: 34, color: C, lineHeight: 34 },
  scoreTotalMax: { fontFamily: fonts.body, fontSize: 9.5, color: C, opacity: 0.8, marginTop: 3 },
  scoreDivider: { width: 3, alignSelf: 'stretch', backgroundColor: C + '33' },

  waveCompare: { padding: 11 },
  waveCompareCaption: { fontFamily: fonts.body, fontSize: 9, color: '#94A3B8', marginBottom: 6 },
  waveCompareRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  waveCompareTag: { borderWidth: 1.5, borderColor: C, paddingHorizontal: 5, paddingVertical: 1 },
  waveCompareTagText: { fontFamily: fonts.heading, fontSize: 8.5, color: C },
  waveCompareDuration: { fontFamily: fonts.body, fontSize: 9, color: '#94A3B8' },

  correctionHeader: { fontFamily: fonts.heading, fontSize: 11, color: C, marginBottom: 8 },
  suspectBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.peach, borderWidth: 2, borderColor: C, padding: 10,
  },
  suspectText: { flex: 1, fontFamily: fonts.body, fontSize: 11, color: colors.text },

  drillButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.lilac, borderWidth: 3, borderColor: C, paddingVertical: 11, opacity: 0.5,
  },
  drillButtonText: { fontFamily: fonts.heading, fontSize: 12, color: colors.textFaint },
  drillNote: { fontFamily: fonts.body, fontSize: 9.5, color: colors.textSoft, textAlign: 'center' },
});
