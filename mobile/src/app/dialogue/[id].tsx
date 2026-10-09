// AI dialogue — visual-novel style persona role-play. 1:1 port of the v16
// handoff `screens-dialogue.jsx` (free mode): peach/cream room backdrop, patient
// (L) + player (R) portrait frames, a mission tracker, and the bottom dialogue
// box with a speaker tab + NPC line + free-text input. Wired to the real AI:
// startConversation(scenarioId) → sendMessageStream streams the NPC reply in
// persona. Includes the v17 handoff affordances: MISSION counter, 💧 distress cue,
// QUICK INFO dock (차트/약물/활력 → chart panel), NPC-line 번역 toggle, ▼ next cue,
// and hint-mode choices with a red risky (평판 위험) variant, plus 🎤 mic dictation (record → Azure STT → draft).
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GUIDED, isGuidedRung } from '@/data/guideRung';
import { ActivityIndicator, Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View } from 'react-native';
import * as Speech from 'expo-speech';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  useAudioPlayer,
  requestRecordingPermissionsAsync, setAudioModeAsync,
  IOSOutputFormat, AudioQuality, type RecordingOptions,
} from 'expo-audio';
import { readAsStringAsync, EncodingType, cacheDirectory, downloadAsync, deleteAsync } from 'expo-file-system/legacy';
import { type RoleKind, type Expression } from '@engine';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { npcAvatarSpec, type NpcExpression } from '@/data/npcAvatar';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbGrabber, NbMemo, NbPaper, NbPressable, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, nb, nbFonts } from '@/theme/nb';
import { api, type LessonSentence, type ModelAnswerCard, type ReplyChoice, type ScenarioDetail } from '@/api/client';
import { MissionCluster } from '@/components/dialogue/MissionCluster';
import { ResizeHandle } from '@/components/ResizeHandle';
import { GUIDED_THREAD, STAGE, STAGE_TOP, clampChoices, clampGuidedThread, clampStage, stageGeometry } from '@/data/dialogueSplit';
import { setDialogueLayout, useDialogueLayout } from '@/lib/dialogueLayout';
import { ReplyChoices } from '@/components/dialogue/ReplyChoices';
import { GuidedTarget } from '@/components/lesson/GuidedTarget';
import { targetFor, wordChips } from '@/data/guidedTarget';
import { Typewriter } from '@/components/dialogue/Typewriter';
import { BottomSheet } from '@/components/BottomSheet';
import { threadOf } from '@/data/thread';
import { offerShareSource } from '@/data/loungeShare';
import { asMood, moodBorder, moodExpression, moodShowsSweat, type Mood } from '@/data/moodTone';
import { MoodLift } from '@/components/dialogue/MoodLift';
import { DialogueStage } from '@/components/dialogue/DialogueStage';
import { GuidedInput, type GuidedInputMode, type RecState } from '@/components/dialogue/GuidedInput';
import { Rail, RailButton } from '@/components/dialogue/DialogueRail';
import { NotesSheet } from '@/components/dialogue/NotesSheet';
import { playSfx } from '@/lib/sfx';
import { t, type Translate, useLocale, useT } from '@/i18n';
import { useWavRecorder } from '@/lib/useWavRecorder';
import { TASK_SCREEN } from '@/theme/transitions';

// 16kHz mono PCM WAV — the format the server STT endpoint expects.
const WAV_16K_MONO: RecordingOptions = {
  extension: '.wav', sampleRate: 16000, numberOfChannels: 1, bitRate: 256000,
  ios: { outputFormat: IOSOutputFormat.LINEARPCM, audioQuality: AudioQuality.HIGH, linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false },
  android: { outputFormat: 'default', audioEncoder: 'default' },
  web: {},
};

/** The character's OPENING line — the scenario's first dialogue step, else its tagline.
 *  Authored, shown client-side, and never persisted as a server turn; the resume path has
 *  to put it back or the first utterance goes missing from the restored thread. */
function openingLineOf(s: ScenarioDetail | null): string {
  const opening = (s?.steps ?? []).find((st) => st.type === 'dialogue');
  return (opening?.payload?.lineEn as string) || s?.tagline || '';
}

export default function DialogueRoute() {
  const t = useT();
  const { id, guide: guideParam } = useLocalSearchParams<{ id: string; guide?: string }>();
  const router = useRouter();

  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const sessionRef = useRef<string | null>(null);
  const turnsRef = useRef(0); // learner turns sent — gates grading (0 turns → 중단)

  // Window height is stable while the keyboard animates; the container's is not.
  const { height: winH } = useWindowDimensions();
  const [npcLine, setNpcLine] = useState(''); // latest NPC utterance (VN box)
  // The VN box only ever showed the CURRENT line, and every previous turn was
  // thrown away — the learner could not look back at what was said, which is
  // exactly what makes a role-play hard to follow. The server already persists
  // every turn (dialogue_turns); this keeps the same history client-side so the
  // transcript sheet can show it without another round trip.
  // `note` is why a PICKED reply was that reply. On the authored pass a pick is sent
  // immediately, so the card that carried the reason is gone by the time the learner
  // reads their own line — the reason rides along with the line instead, where it is
  // feedback on something they already did.
  const [transcript, setTranscript] = useState<{
    role: 'user' | 'npc';
    text: string;
    note?: string;
    // The immediate correction of a spoken line (guided-turn redesign): shown under the
    // learner's own bubble, so "you said X → say Y, because Z" lands right where they said
    // it. Arrives on an SSE frame just before the NPC reply.
    correction?: { original: string; corrected: string; note: string };
  }[]>([]);
  // Patient lines are spoken aloud. Auto-play is the point (#17: hearing the line
  // is half of understanding it), so it needs a visible off switch — audio that
  // starts on its own and cannot be stopped is worse than no audio.
  const [voiceOn, setVoiceOn] = useState(true);
  const npcPlayer = useAudioPlayer(undefined, { updateInterval: 200 });
  const voiceSeqRef = useRef(0);
  // Set when a previous conversation exists for this scenario. While it is set no
  // session is open yet — the learner picks resume or fresh first.
  const [resumable, setResumable] = useState<{ sessionId: string; turns: { role: string; content: string }[] } | null>(null);
  const [npcLineKo, setNpcLineKo] = useState(''); // Korean of the scripted line (for 번역)
  const [showKo, setShowKo] = useState(false);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [hintOn, setHintOn] = useState(false);
  // The guided pass of a curriculum step: three replies to pick from, refreshed after
  // each of the character's turns. `guide` arrives with the scenario so the screen knows
  // what to draw before the conversation starts.
  // The rung the learner CHOSE wins over what the server infers.
  //
  // Both entries of a dialogue point at one scenario id, so the server can only guess
  // from what has been cleared — and a guess cannot know which of the two rows was
  // tapped. Tapping "1/2 보기 중에서" and getting the unguided run is the app ignoring a
  // decision it had just asked for. The server's answer is still the fallback, for entry
  // points that have no rung at all: the board, a paged call, the home card.
  const guided = isGuidedRung(guideParam ?? scenario?.guide);
  // STEP 3 (lesson-four-steps-v44 J): the guided pass asks for the situation's STEP 2
  // sentences, one per turn, instead of offering three replies. A situation with no
  // sentences yet (content not written) keeps the reply choices.
  const [lessonSentences, setLessonSentences] = useState<LessonSentence[]>([]);
  // Whether the sentences have arrived — the choices must not be fetched before we know
  // there are none, or the guided pass pays for three replies it then never shows. A ref
  // as well as state: loadChoices runs inside the session-start closure, which would
  // otherwise read the value from the render that started it.
  const [lessonReady, setLessonReady] = useState(!guided);
  const lessonRef = useRef({ ready: !guided, count: 0 });
  useEffect(() => {
    if (!guided) return;
    // `guided` can turn true after mount (inferred from the scenario, no ?guide=): close
    // the gate again until the sentences are known.
    lessonRef.current = { ready: false, count: 0 };
    setLessonReady(false);
    let alive = true;
    const done = (n: LessonSentence[]) => {
      if (!alive) return;
      lessonRef.current = { ready: true, count: n.length };
      setLessonSentences(n);
      setLessonReady(true);
    };
    api.lesson(id).then((l) => done(l.sentences ?? [])).catch(() => done([]));
    return () => { alive = false; };
  }, [guided, id]);
  // The learner's turn k asks for target k (goal order). null = no sentences → choices.
  const target = guided ? targetFor(lessonSentences, transcript.filter((l) => l.role === 'user').length) : null;
  const [choices, setChoices] = useState<ReplyChoice[]>([]);
  const [choicesBusy, setChoicesBusy] = useState(false);
  // The intent the learner picked this turn (native language). Picking one reveals the
  // mic — they then say it in the target language themselves. null = nothing picked yet.
  const [selectedChoice, setSelectedChoice] = useState<ReplyChoice | null>(null);
  // Set when the learner asks for the box instead of the mic — a fallback for a device
  // with no microphone. Their decision outlives the next turn.
  const [wroteOwn, setWroteOwn] = useState(false);
  // The free pass's hint: one line about what this turn needs. Held per turn — a hint
  // from two exchanges ago is about a situation that has moved on.
  const [hintText, setHintText] = useState('');
  const [hintBusy, setHintBusy] = useState(false);
  const [tool, setTool] = useState<'chart' | 'meds' | 'vitals' | null>(null); // QUICK INFO panel
  const logRef = useRef<ScrollView>(null);

  // Typing raises the conversation over the portrait.
  //
  // A messenger can simply lift its list and input above the keyboard because the list
  // IS the screen. Here the top third is the NPC's portrait, so lifting only the bottom
  // left the thread squeezed into whatever was left — a few lines tall. Instead the
  // chrome (portrait, QUICK INFO dock) fades out and the thread's top edge travels up
  // into the space it vacated, so the conversation grows rather than shrinks. Closing
  // the keyboard reverses it and the portrait comes back.
  const [typing, setTyping] = useState(false);
  const chromeOpacity = useRef(new Animated.Value(1)).current;
  // `top` is a layout prop, so this one cannot use the native driver (opacity can).
  const threadTop = useRef(new Animated.Value(0)).current;
  // How far the column's BOTTOM edge lifts. The input lives inside that column, and
  // it was staying under the keyboard: KeyboardAvoidingView's `padding` behaviour
  // does not move an absolutely-positioned child reliably, so the height is taken
  // from the keyboard event and applied directly. Deterministic, and it rides the
  // same timing as the top edge — the column moves as one thing.
  const keyboardLift = useRef(new Animated.Value(0)).current;
  // Where the conversation starts when the keyboard is down: under the stage.
  //
  // lesson-fidelity-v46 결정 5 — the stage OPENS at the handoff's height (E 236, D 168) and
  // the learner can still drag its edge; a dragged height is remembered per run kind. The
  // keyboard overrides it while it is up — that is a borrowed position, not a new resting
  // one, and the edge returns here when it closes.
  const saved = useDialogueLayout();
  const stageMode = guided ? 'guided' : 'free';
  const [stageDrag, setStageDrag] = useState(0);
  const stageH = clampStage(stageDrag || (guided ? saved.stageGuided : saved.stageFree) || STAGE[stageMode], winH, stageMode);
  const restingTop = STAGE_TOP + stageH;
  const stageGeo = stageGeometry(stageH);
  // D's message band — the handoff's fixed 128, resizable by the grabber under it.
  const [threadDrag, setThreadDrag] = useState(0);
  const guidedThread = clampGuidedThread(threadDrag || saved.threadGuided || GUIDED_THREAD, winH);
  // The band the reply choices get (the no-sentence guided pass). Same rule.
  const [choicesH, setChoicesH] = useState(0);
  const choicesBand = clampChoices(choicesH || saved.choicesH || winH * 0.34, winH);
  // Where each drag began, so the handle's per-gesture delta can be applied to it — and
  // where it ENDED, which is what gets saved.
  //
  // The end has to be a ref: onDone fires in the same batch as the last onDrag's
  // setState, so a closure over the rendered value saves the position the finger started
  // from. It did exactly that, and a relaunch restored the size the learner had just
  // dragged away from.
  const dragFrom = useRef({ stage: 0, thread: 0, choices: 0 });
  const dragTo = useRef({ stage: 0, thread: 0, choices: 0 });
  // STEP 3's input: 말하기 (the hold mic) or 타이핑 (the writing line) — dialogue.jsx L151.
  const [inputMode, setInputMode] = useState<GuidedInputMode>('speak');
  // The rail's 노트 — this situation's correction notes (결정 6). null while loading.
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState<ModelAnswerCard[] | null>(null);
  const loadNotes = useCallback(() => {
    api.scenarioNotes(id).then(setNotes).catch(() => setNotes([]));
  }, [id]);
  useEffect(() => { loadNotes(); }, [loadNotes]);
  // Just under the status bar — MEASURED, not guessed.
  //
  // A constant was wrong: the bar is the exit button on the left and, on the right, a
  // MISSION chip, the mission text (which wraps) and the 상황 종료 button. That stack
  // is ~152pt with a mission and ~90 without, so any single number either covers the
  // mission and the way out, or wastes half the space it was meant to reclaim. The
  // exit and 상황 종료 are exactly what you need if the keyboard opened by accident,
  // so they must stay reachable.
  const [barH, setBarH] = useState(0);
  const raisedTop = Math.max(96, barH + 6);

  useEffect(() => {
    // will* on iOS so the motion rides the system animation; did* on Android, which
    // has no will* events.
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const animate = (up: boolean, duration: number, height: number) => {
      setTyping(up);
      Animated.parallel([
        Animated.timing(chromeOpacity, { toValue: up ? 0 : 1, duration, useNativeDriver: true }),
        Animated.timing(threadTop, { toValue: up ? 1 : 0, duration, useNativeDriver: false }),
        Animated.timing(keyboardLift, { toValue: up ? height : 0, duration, useNativeDriver: false }),
      ]).start();
    };
    const show = Keyboard.addListener(showEvt, (e) => animate(true, e.duration || 220, e.endCoordinates?.height ?? 0));
    const hide = Keyboard.addListener(hideEvt, (e) => animate(false, e.duration || 220, 0));
    return () => { show.remove(); hide.remove(); };
  }, [chromeOpacity, threadTop, keyboardLift]);

  // Re-derived when the measurement lands: interpolate() captures its outputRange, so
  // a value read once at mount would keep the pre-measurement guess forever.
  const threadTopStyle = useMemo(
    () => threadTop.interpolate({ inputRange: [0, 1], outputRange: [restingTop, raisedTop] }),
    [threadTop, restingTop, raisedTop],
  );
  // The stage band ends where the conversation begins — the same edge, so dragging moves both.
  const stageBandStyle = useMemo(
    () => threadTop.interpolate({ inputRange: [0, 1], outputRange: [restingTop - STAGE_TOP, raisedTop - STAGE_TOP] }),
    [threadTop, restingTop, raisedTop],
  );
  // 22 is the handoff's resting gap above the home indicator (dialogue.jsx L93 / L178).
  const threadBottomStyle = useMemo(
    () => Animated.add(new Animated.Value(22), keyboardLift),
    [keyboardLift],
  );
  const messages = threadOf(transcript, npcLine);
  // The NPC's mood for the CURRENT turn, from the server. undefined means the reply
  // carried no mood, and the portrait then keeps the scenario's authored expression —
  // a turn the model did not tag must not blank the patient's face.
  const [turnMood, setTurnMood] = useState<Mood | undefined>(undefined);
  // Set when this turn moved the character to a better place. Cleared when the next
  // turn starts, so the banner belongs to the line that earned it.
  const [improved, setImproved] = useState<Mood | undefined>(undefined);
  // The character has said everything they needed is handled.
  //
  // Asked ONCE per conversation, and only asked — never decided. The learner could
  // not tell when a situation was resolved and kept talking past it; but the
  // character's view is not the grade (that is goal coverage, computed at the end),
  // so the two can disagree and the honest move is a question. `asked` is what stops
  // it becoming a nag: declining once means it never appears again.
  const [wrapUp, setWrapUp] = useState(false);
  const askedWrapUp = useRef(false);
  // Which missions the character says are covered, 1-based, cumulative.
  //
  // UNIONED, never replaced: a turn where the character does not mention mission 1
  // must not un-tick it. The learner did that thing; the character forgetting to
  // list it does not undo it, and a tracker that flickers backwards is worse than
  // one that is slightly generous.
  //
  // Empty while the server does not send the field — which is exactly the state when
  // the feature is switched off, so the tracker falls back to the plain goal list
  // with no code path of its own.
  const [doneMissions, setDoneMissions] = useState<Set<number>>(new Set());
  // Closed by default — see the chip's own comment for why.
  const [missionsOpen, setMissionsOpen] = useState(false);
  const [rec, setRecState] = useState<RecState>('idle'); // mic dictation
  // Mirrored in a ref: the hold mic's press-in and release race the async recorder, and
  // each needs the state as it is NOW, not as it was when the render made the handler.
  const recRef = useRef<RecState>('idle');
  const setRec = (r: RecState) => { recRef.current = r; setRecState(r); };
  // Whether the finger is still on the hold mic.
  const heldRef = useRef(false);
  const recorder = useWavRecorder(WAV_16K_MONO); // Android: PCM→WAV via AudioStream (lib/useWavRecorder.android.ts)

  /** Opens the mic. Resolves true once it is recording. */
  const startRecording = async (): Promise<boolean> => {
    if (recRef.current !== 'idle') return false;
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) return false;
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRec('recording');
      return true;
    } catch { setRec('idle'); return false; }
  };

  /** Stops the mic → speech-to-text → the draft. */
  const finishRecording = async () => {
    if (recRef.current !== 'recording') return;
    setRec('transcribing');
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error('no audio');
      const b64 = await readAsStringAsync(uri, { encoding: EncodingType.Base64 });
      // The session id makes the server score this utterance too, filed under
      // this run — that is what the Scenario Clear review and the Review Lab
      // 직접 말하기 연습 block read back. Without it they would be permanently
      // empty, since free dialogue produces no other pronunciation record.
      const text = await api.transcribe(
        b64,
        sessionRef.current ? { sessionId: sessionRef.current, scenarioId: id } : undefined,
      );
      if (text) setDraft((d) => (d.trim() ? `${d.trim()} ${text}` : text));
    } catch { /* mic/STT unavailable — leave draft as-is */ }
    finally { setRec('idle'); }
  };

  // SPEAK FREELY (E): tap to record, tap to stop — "마이크를 눌러 말하기" (dialogue.jsx L94).
  const toggleMic = async () => {
    if (recRef.current === 'recording') await finishRecording();
    else if (recRef.current === 'idle') await startRecording();
  };

  // STEP 3 (D): the big mic is HELD — "꾹 누르고 영어로 말하기" (L162, 07 "큰 마이크 홀드").
  // Recording runs while the finger is down and ends when it lifts. Opening the recorder is
  // async, so a quick tap can lift before it is recording; the release is remembered and
  // the mic closes the moment it opens.
  const micDown = async () => {
    heldRef.current = true;
    const ok = await startRecording();
    if (ok && !heldRef.current) await finishRecording();
  };
  const micUp = async () => {
    heldRef.current = false;
    await finishRecording();
  };

  const loadChoices = useCallback(async () => {
    const sid = sessionRef.current;
    // With STEP 2 sentences the guided pass asks for those instead — no choices to fetch.
    if (!guided || wroteOwn || !sid || !lessonRef.current.ready || lessonRef.current.count > 0) return;
    setChoicesBusy(true);
    try {
      const turn = await api.replyChoices(sid);
      setChoices(turn.choices);
    } finally {
      setChoicesBusy(false);
    }
  }, [guided, wroteOwn]);
  // The sentences arrived after the session opened: now we know whether to fetch choices.
  useEffect(() => {
    if (lessonReady && guided) void loadChoices();
  }, [lessonReady, guided, loadChoices]);


  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await api.scenario(id);
        if (!alive) return;
        setScenario(s);
        // Opening line: the scenario's first dialogue step (has a Korean line for 번역), else the tagline.
        const opening = (s.steps ?? []).find((st) => st.type === 'dialogue');
        setNpcLine((opening?.payload?.lineEn as string) || s.tagline || '');
        setNpcLineKo((opening?.payload?.lineKo as string) || '');
        // Before opening a fresh session, check whether this learner already has
        // a conversation here. Starting unconditionally is what orphaned every
        // previous one — it stayed in the table and became unreachable.
        const prev = await api.resumableConversation(id).catch(() => ({ sessionId: '', turns: [] }));
        if (!alive) return;
        if (prev.sessionId && prev.turns.length > 0) {
          setResumable(prev);
          setState('ready');
          return; // the session is opened by the learner's choice below
        }
        const sid = await api.startConversation(id, undefined, guided ? GUIDED : 'free');
        if (!alive) return;
        sessionRef.current = sid;
        setState('ready');
        // The opening line is already on screen, so it is the learner's move — and the
        // very first turn is the one testers froze on. Waiting for them to speak before
        // offering help would help nobody.
        void loadChoices();
      } catch {
        if (alive) setState('error');
      }
    })();
    return () => { alive = false; };
  }, [id]);

  // `pick` sends a chosen reply straight away. The authored pass has no text box: the
  // three cards are the turn, and making the learner tap a card and then a send button
  // eight times is a toll on every beat of the conversation.
  const send = async (pick?: { text: string; intent?: string }) => {
    const text = (pick?.text ?? draft).trim();
    if (!text || pending || !sessionRef.current) return;
    const intent = pick?.intent;
    turnsRef.current += 1; // the server persists this turn in prepare(); count it for grading
    setDraft('');
    setSelectedChoice(null);
    // Clear the intent picker until the next turn: the learner has spoken, so the options
    // for THIS line are spent.
    setChoices([]);
    setPending(true);
    // Park the line the box is about to lose, then the learner's own line.
    const mine = { role: 'user' as const, text };
    setTranscript((t) => (npcLine ? [...t, { role: 'npc' as const, text: npcLine }, mine] : [...t, mine]));
    setNpcLine(''); setNpcLineKo(''); setShowKo(false); // clear for the streaming reply (no Ko for AI lines)
    // The celebration belongs to the line that earned it, so it clears when the next
    // turn begins. The MOOD does not clear here: until the reply arrives the character
    // still feels what they felt, and blanking the portrait mid-turn would read as the
    // patient going vacant while they wait for an answer.
    setImproved(undefined);
    try {
      await api.sendMessageStream(sessionRef.current, text, (chunk) => {
        // trimStart on the FIRST chunk only. The mood tag is stripped server-side at
        // the `]`, so the chunk after it usually begins with the space that separated
        // them — and a bubble that opens with a space reads as a typo.
        setNpcLine((prev) => (prev ? prev + chunk : chunk.replace(/^\s+/, '')));
      }, {
        // Arrives before the first word, so the face and the border are already right
        // when the learner starts reading.
        onMood: (m) => setTurnMood(asMood(m)),
        onImproved: (m) => setImproved(asMood(m)),
        onResolved: () => {
          if (askedWrapUp.current) return;
          askedWrapUp.current = true;
          setWrapUp(true);
        },
        onMissions: (numbers) => {
          setDoneMissions((prev) => {
            const next = new Set(prev);
            for (const n of numbers) next.add(n);
            // Same set means no re-render: this fires on every turn and the tracker
            // re-rendering for an unchanged tick is churn behind a streaming reply.
            return next.size === prev.size ? prev : next;
          });
        },
        // The immediate correction of the line just spoken, grounded by the picked intent.
        // Attach it to the most recent user turn so it renders under that bubble, ahead of
        // the NPC's reply.
        onCorrection: (c) => setTranscript((prev) => {
          for (let i = prev.length - 1; i >= 0; i--) {
            if (prev[i].role === 'user') {
              const next = [...prev];
              next[i] = { ...next[i], correction: c };
              return next;
            }
          }
          return prev;
        }),
      }, intent);
      void speakNpc();
      // The character has answered, so it is the learner's move: ask for replies to THIS
      // line. Not awaited — the conversation is readable while they arrive.
      void loadChoices();
    } catch {
      setNpcLine(t('dialogue.replyFailed'));
    } finally {
      setPending(false);
    }
  };

  // End the situation. No turns → nothing to grade: confirm, then leave without a
  // reward (the situation stays uncleared). With turns → grade on the result screen.
  const endSituation = () => {
    if (turnsRef.current === 0) {
      Alert.alert(
        t('dialogue.notStartedTitle'),
        t('dialogue.notStartedBody'),
        [
          { text: t('dialogue.keepGoing'), style: 'cancel' },
          { text: t('dialogue.leave'), style: 'destructive', onPress: () => router.back() },
        ],
      );
      return;
    }
    // Hand the conversation to the lounge's 대화 공유, which is offered on the result
    // screen. Offered, not posted: the turns are only in memory until the learner
    // chooses to quote some of them, and this is the last screen that holds them.
    offerShareSource({
      scenarioId: id,
      title: [scenario?.briefing?.dept, scenario?.title].filter(Boolean).join(' · '),
      turns: messages.map((m, i) => ({ index: i, role: m.role, text: m.text })),
    });
    router.replace(`/result/${id}?session=${sessionRef.current ?? ''}`);
  };

  // Leaving mid-conversation used to be a bare "× 나가기" — a UI escape hatch
  // that let the learner drop a patient mid-sentence with no fiction attached,
  // which is exactly what made it easy to break the thread. On a real ward you
  // do not "exit" a patient; you get pulled away. So the exit is framed as being
  // called elsewhere, and it says plainly that the conversation is kept.
  const [pagedOut, setPagedOut] = useState(false);
  // Speaks the session's latest NPC turn. 404 means "nothing appropriate to
  // speak" (no turn yet, TTS unconfigured, no voice for this locale) and is
  // silence, not an error — the screen must never show a failure for it.
  const speakNpc = useCallback(async () => {
    if (!voiceOn || !sessionRef.current) return;
    const seq = ++voiceSeqRef.current;
    const path = `${cacheDirectory}npc-${seq}.wav`;
    try {
      const res = await downloadAsync(api.npcSpeechUrl(sessionRef.current), path, { headers: api.authHeaders() });
      if (res.status !== 200) {
        await deleteAsync(path, { idempotent: true }).catch(() => {});
        return;
      }
      // A newer turn started while this one downloaded — drop it rather than
      // speaking a line the learner has already moved past.
      if (seq !== voiceSeqRef.current) {
        await deleteAsync(path, { idempotent: true }).catch(() => {});
        return;
      }
      npcPlayer.replace({ uri: path });
      npcPlayer.seekTo(0);
      npcPlayer.play();
    } catch {
      /* silence */
    }
  }, [voiceOn, npcPlayer]);

  const resumePrevious = async () => {
    if (!resumable) return;
    const prev = resumable;
    setResumable(null);
    try {
      sessionRef.current = await api.startConversation(id, prev.sessionId, guided ? GUIDED : 'free');
    } catch {
      setState('error');
      return;
    }
    // Rehydrate the transcript. Two things the old version got wrong:
    //
    //  · The scenario's OPENING line is authored and shown client-side — the server never
    //    stored it, so prev.turns starts with the learner's first message. Without putting
    //    it back the character's first utterance was simply missing from the thread.
    //  · The last assistant line is the CURRENT line the learner is answering; it belongs
    //    in npcLine, NOT the transcript — threadOf depends on "npcLine is not in the
    //    transcript", and the old code set npcLine to a line it had ALSO left in the
    //    transcript, which would duplicate it the moment the learner sent their next turn.
    const opening = openingLineOf(scenario);
    const turns = prev.turns;
    const endsWithNpc = turns.length > 0 && turns[turns.length - 1].role !== 'user';
    const body = endsWithNpc ? turns.slice(0, -1) : turns;
    setTranscript([
      ...(opening ? [{ role: 'npc' as const, text: opening }] : []),
      ...body.map((t) => ({ role: t.role === 'user' ? ('user' as const) : ('npc' as const), text: t.content })),
    ]);
    turnsRef.current = turns.filter((t) => t.role === 'user').length;
    setNpcLine(endsWithNpc ? turns[turns.length - 1].content : '');
    setNpcLineKo('');
    // The guided choices were fetched on a fresh start but NOT on resume, so the options
    // never came back and the guided pass was dead after resuming. Ask for them now.
    void loadChoices();
  };

  const startFresh = async () => {
    setResumable(null);
    try {
      sessionRef.current = await api.startConversation(id, undefined, guided ? GUIDED : 'free');
    } catch {
      setState('error');
    }
  };

  // Refetched whenever it is the learner's move again: the suggestions are answers to
  // the line that was just said, and yesterday's answers to a different line are worse
  // than none. Never blocks anything — an empty result simply leaves the text box.
  /** Ask for a nudge when stuck — the free pass's 힌트 (dialogue.jsx L101).
   *
   *  Fetches the best reply's reason with the sentence withheld, so producing it stays the
   *  learner's own work. The guided pass has no 힌트 on its rail (L178–182): its hints are
   *  the target card's chunks, opened with 힌트 더. */
  const askHint = async () => {
    if (hintOn) { setHintOn(false); return; }
    setHintOn(true);
    const sid = sessionRef.current;
    if (!sid) return;
    setHintBusy(true);
    try {
      const { choices: cs } = await api.replyChoices(sid);
      setHintText(cs.find((c) => c.tier === 'best')?.why ?? cs[0]?.why ?? '');
    } finally {
      setHintBusy(false);
    }
  };

  const stepAway = () => {
    Keyboard.dismiss();
    setPagedOut(true);
  };

  // Leave and throw the conversation away, so the next visit starts clean instead of
  // offering to pick this one up.
  //
  // The navigation does not wait on the request and does not care whether it succeeded:
  // the learner asked to go. A failed discard leaves a resumable conversation they will
  // be offered again, which is recoverable; a spinner or an error in front of someone on
  // their way out is not what they asked for.
  const leaveAndDiscard = async () => {
    setPagedOut(false);
    const sid = sessionRef.current;
    router.back();
    if (sid) await api.discardConversation(sid).catch(() => {});
  };

  // Bottom rail 🎤 직접 말하기 (04_SCREENS.md:324) — pushes to the standalone
  // pronunciation route (T8) with the scenario's first key phrase as the
  // target sentence. This replaces the old inline pronunciation-recording
  // widget that used to render under HINT ON (scenario.keyPhrases[0] was its
  // only referenceText source too, so the target phrase is unchanged).

  const p = scenario?.persona ?? {};
  const kind = (ROLE_KINDS.has(p.role as RoleKind) ? p.role : 'patient') as RoleKind;
  // Stable per NPC across the conversation: the name plus the scenario, so their face
  // does not shuffle turn to turn. The role fixes the uniform; the seed varies the
  // person; `expr` (the turn's mood) sets the face — see data/npcAvatar.
  const npcSeed = `${p.name || 'npc'}|${id}`;
  // The turn's mood wins; the scenario's authored mood is the opening state and the
  // fallback for a reply that carried none.
  const authored = (EXPRESSIONS.has(p.mood as Expression) ? p.mood : 'neutral') as Expression;
  const expr = moodExpression(turnMood) ?? authored;
  // Built once per (person, uniform, mood) rather than once per render. npcAvatarSpec
  // returns a fresh object, so passing the raw call to NbAvatar re-drew the whole SVG
  // portrait on every streaming token even though the face had not changed. It changes
  // only when the mood does, which is what this dependency list says.
  const npcSpec = useMemo(() => npcAvatarSpec(kind, npcSeed, expr as NpcExpression), [kind, npcSeed, expr]);
  const npcName = (p.name || 'NPC').toUpperCase();
  const goals = scenario?.goals ?? [];
  const chart = scenario?.briefing?.chart;
  const showSweat = moodShowsSweat(turnMood) || (!turnMood && (expr === 'pain' || expr === 'panic' || expr === 'worried'));
  // A scenario can embed several quiz steps; surface them all as one sequence.
  const quizIds = (scenario?.steps ?? [])
    .filter((s) => s.type === 'quiz')
    .map((s) => s.payload?.quizId)
    .filter((q): q is string => !!q);

  // What the learner's line is FOR on the guided pass: the target sentence, or the intent
  // they picked from the reply choices (the no-sentence fallback).
  const guidedIntent = selectedChoice ? selectedChoice.intent : target ? target.ko : undefined;
  const sendDraft = () => { void send(guidedIntent !== undefined ? { text: draft, intent: guidedIntent } : undefined); };
  // 듣기 on the guided rail plays the model line (07 "듣기(모범 발음)").
  const modelLine = target?.en ?? selectedChoice?.text ?? '';
  const canSend = !pending && !!draft.trim();
  // The guided pass's input (D): with a target, or once a reply choice is picked / the
  // learner asked to answer without the choices.
  const guidedInputOn = guided && (!!target || !!selectedChoice || wroteOwn || (!choicesBusy && choices.length === 0));
  // "작성 중" (dialogue.jsx L90): the line the learner is about to send, faded into the
  // thread. Not while the typing card is open — the card is where that line is shown then.
  const composing = !pending && !!draft.trim() && !(guided && inputMode === 'type');
  const openQuiz = () => router.push(`/quiz/${quizIds[0]}?scenario=${id}&q=${quizIds.join(',')}&i=0`);

  if (state === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: nb.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Rules />
        <ActivityIndicator color={nb.ink} />
      </View>
    );
  }
  if (state === 'error') {
    return (
      <View style={{ flex: 1, backgroundColor: nb.cream, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Rules />
        <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('dialogue.startFailed')}</Text>
        <NbButton variant="paper" onPress={() => router.back()}>{t('common.back')}</NbButton>
      </View>
    );
  }

  return (
    // No `behavior` prop: the thread column lifts itself by the keyboard's measured
    // height, and KeyboardAvoidingView's padding would move it a second time — the
    // input then travels past the top of the keyboard and off the thread entirely.
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: nb.cream }}>
      <Stack.Screen options={TASK_SCREEN} />

      {/* The page, and the keyboard's escape hatch — a full-screen chat has nowhere
          obvious to tap, so the room itself dismisses it. */}
      <Pressable
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: nb.cream }} />
        <Rules />
        {/* The stage (dialogue.jsx L43): `#F6E3DC` under the 44pt status bar, a 1.5 #E0D6C0
            line along its foot. Its height IS the divider, so the band and the top of the
            conversation are the same edge.

            TWO nested nodes, and it has to be two: `opacity` runs on the native driver
            and `height` cannot. On one node RN moves the whole style to native and then
            throws "Attempting to run JS driven animation on animated node that has been
            moved to native" the first time the keyboard opens. */}
        <Animated.View style={{ position: 'absolute', top: STAGE_TOP, left: 0, right: 0, opacity: chromeOpacity }}>
          <Animated.View testID="stage-band" style={{ height: stageBandStyle, backgroundColor: STAGE_BG, borderBottomWidth: 1.5, borderBottomColor: nb.paperEdge }} />
        </Animated.View>
      </Pressable>

      {/* The top bar (dialogue.jsx TopBar L29–39): top 50, sides 16, centred on one line. */}
      <View
        onLayout={(e) => setBarH(e.nativeEvent.layout.height)}
        pointerEvents="box-none"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 50, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 7 }}
      >
        {/* The way out — paper(-1) 34×34, the red ✕ (drawn: lesson-fidelity-v46 결정 4). It
            stands alone up here, with nothing beside it to catch a thumb. */}
        <NbPressable
          testID="dialogue-exit"
          accessibilityLabel={t('dialogue.leave')}
          rot={-1}
          shadow="paper"
          onPress={() => { playSfx('back'); stepAway(); }}
          faceStyle={{ width: 34, height: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge }}
        >
          <NbIcon name="cross" size={17} color={nb.red} />
        </NbPressable>
        {/* The missions, top-right. A FIXED 34pt box — the × is centred against it, and the
            panel opening below overflows it instead of growing the row, so opening the
            missions can never slide the exit. Everything else is in MissionCluster. */}
        <View testID="mission-slot" style={{ height: 34 }}>
          <MissionCluster
            goals={goals}
            done={doneMissions}
            open={missionsOpen}
            onToggle={() => setMissionsOpen((v) => !v)}
            opacity={chromeOpacity}
            disabled={typing}
          />
        </View>
      </View>

      {/* ✓ 상황 종료 — paper(0.5) 6/16, Gaegu 15 green (L34), on the bar's line and centred
          on the screen. A sibling of the bar rather than its child, so the mission chip's
          width cannot push it off centre; box-none so the bar underneath stays tappable. */}
      <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, top: 50, height: 34, alignItems: 'center', justifyContent: 'center', zIndex: 8 }}>
        <Animated.View style={{ opacity: chromeOpacity }} pointerEvents={typing ? 'none' : 'auto'}>
          <NbPressable
            testID="dialogue-end"
            rot={0.5}
            shadow="paper"
            onPress={endSituation}
            faceStyle={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 16, backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge }}
          >
            <NbIcon name="check" size={14} color={nb.green} />
            <Text numberOfLines={1} style={nbText.hand(15, nb.green)}>{t('dialogue.endSituation')}</Text>
          </NbPressable>
        </Animated.View>
      </View>

      {/* What stands on the stage: the polaroid, the name and mood on the left, the voice on
          the right. Fades out while the keyboard is up — see `typing`. */}
      <DialogueStage
        g={stageGeo}
        name={p.name || 'NPC'}
        // Same fact as the face's `expr` (this turn's mood, falling back to the authored
        // one). Shown only when there IS a mood to report, so a scenario that never authors
        // a mood does not grow a "NEUTRAL" tag that never existed before.
        status={(turnMood || p.mood) ? expr.toUpperCase() : undefined}
        sweat={showSweat}
        portrait={(w) => <NbAvatar spec={npcSpec} size={w} />}
        voiceOn={voiceOn}
        onToggleVoice={() => { setVoiceOn((v) => { if (v) { try { npcPlayer.pause(); } catch { /* nothing playing */ } } return !v; }); }}
        voiceLabel={t(voiceOn ? 'dialogue.voiceOn' : 'dialogue.voiceOff')}
        opacity={chromeOpacity}
        typing={typing}
      />

      {/* QUICK INFO — the chart, pulled out and held up.
          A taped sheet of paper over a dimmed page: the learner is looking at the same
          notebook, with one page raised. Tapping the page behind puts it back. */}
      {tool && (
        <Pressable onPress={() => setTool(null)} style={styles.quickScrim}>
          <Pressable onPress={() => {}} style={{ alignSelf: 'stretch' }}>
            <NbPaper rot={-0.6} tape tapeLeft={120} style={{ paddingTop: 18, paddingBottom: 16, paddingHorizontal: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <NbIcon name={tool === 'chart' ? 'board' : tool === 'meds' ? 'pill' : 'monitor'} size={19} />
                <Text numberOfLines={1} style={[nbText.hand(21), { flex: 1, minWidth: 0 }]}>
                  {tool === 'chart' ? t('dialogue.chartTitle') : tool === 'meds' ? t('dialogue.medsTitle') : t('dialogue.vitalsTitle')}
                </Text>
                <Pressable onPress={() => setTool(null)} hitSlop={10}><NbIcon name="cross" size={16} color={nb.soft} /></Pressable>
              </View>
              <QuickInfo tool={tool} p={p} kind={kind} chart={chart} brief={scenario?.briefing?.brief} tagline={scenario?.tagline} />
            </NbPaper>
          </Pressable>
        </Pressable>
      )}

      {/* The conversation, from the stage's foot down to the rail (dialogue.jsx L81–104 /
          L118–183): grabber, QUICK INFO, the exchange, grabber, then the input. A messaging
          screen, because that is what this is — the thread scrolls, newest at the bottom. */}
      <Animated.View testID="thread-column" style={{ position: 'absolute', left: 0, right: 0, top: threadTopStyle, bottom: threadBottomStyle, zIndex: 6 }}>
        {/* Grabber ① — the stage's edge. Hidden while the keyboard is up, because the edge
            is not at the learner's number then — it is borrowed by the keyboard. */}
        {!typing && (
          <ResizeHandle
            testID="split-handle"
            onDrag={(dy) => {
              // dy is cumulative for the gesture, so it applies to where the edge was
              // when the finger landed — captured on the first move, cleared on release.
              if (!dragFrom.current.stage) dragFrom.current.stage = stageH;
              const next = clampStage(dragFrom.current.stage + dy, winH, stageMode);
              dragTo.current.stage = next;
              setStageDrag(next);
            }}
            onDone={() => {
              dragFrom.current.stage = 0;
              if (dragTo.current.stage) void setDialogueLayout(guided ? { stageGuided: dragTo.current.stage } : { stageFree: dragTo.current.stage });
            }}
          />
        )}
        {/* QUICK INFO (L61–70): gap 7, padding 2/16/0. Inside the conversation, not above it
            — these are the learner's own instruments, reached for WHILE talking. Gone while
            the keyboard is up rather than faded: the row's height is exactly what the
            exchange needs back when the screen is at its smallest. */}
        {!typing && (
          <View style={{ paddingTop: 2 }}>
            {/* Scrolls rather than wrapping: wrapping costs a whole row of the thread. */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 16 }}
            >
              {/* The label is PRINTED, not written: a stamp on a chart rather than a note. */}
              <View style={{ borderWidth: 1.3, borderColor: nb.soft, paddingVertical: 2, paddingHorizontal: 6 }}>
                <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 9, letterSpacing: 1, color: nb.soft }}>QUICK INFO</Text>
              </View>
              {([['chart', 'board', t('dialogue.tabChart')], ['meds', 'pill', t('dialogue.tabMeds')], ['vitals', 'monitor', t('dialogue.tabVitals')]] as const).map(([k, nbIcon, label]) => (
                <Pressable key={k} onPress={() => setTool((cur) => (cur === k ? null : k))}>
                  <NbPaper
                    rot={k === 'meds' ? 0.8 : -0.8}
                    bg={tool === k ? 'rgba(249,227,123,.55)' : undefined}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 9 }}
                  >
                    <NbIcon name={nbIcon} size={14} />
                    <Text numberOfLines={1} style={nbText.hand(14)}>{label}</Text>
                  </NbPaper>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
        {/* The exchange (E L85: flex 1, padding 10/16/4, gap 10 · D L122: height 128,
            padding 10/16/2). D's band is the learner's to resize, from the grabber below. */}
        <ScrollView
          ref={logRef}
          testID="thread-log"
          style={guided && target
            ? { height: guidedThread, flexGrow: 0, flexShrink: 1, minHeight: 56 }
            : { flex: 1 }}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: guided && target ? 2 : 4, paddingHorizontal: 16, gap: 10 }}
          showsVerticalScrollIndicator={false}
          // Anchored to the bottom, like every messaging app: a new line arriving off
          // screen is a line the learner does not know arrived.
          onContentSizeChange={() => logRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((m, i) => {
            const mine = m.role === 'user';
            const last = i === messages.length - 1;
            return (
              // Blocks, as the handoff draws them: mine marginLeft 40, theirs marginRight 40
              // (L72–73), each the full width that leaves.
              <View key={i} style={mine ? { marginLeft: 40 } : { marginRight: 40 }}>
                {/* Mine is the page's own paper; theirs is the warmer sheet (#FCEEDC, edge
                    #E8D2B0). The NEWEST NPC bubble takes the mood in its edge — only the
                    newest, because the mood belongs to the turn and colouring the history
                    would repaint lines whose mood is no longer known. */}
                <NbPaper
                  rot={0}
                  bg={mine ? nb.paper : '#FCEEDC'}
                  style={[
                    { paddingVertical: 9, paddingHorizontal: 12 },
                    mine ? null : { borderColor: !last ? '#E8D2B0' : moodBorder(turnMood) },
                  ]}
                >
                  <View>
                    {last && !mine ? (
                      // The newest character line types out letter by letter; the history
                      // above it is already read, so those bubbles stay plain.
                      <Typewriter
                        text={showKo && npcLineKo ? npcLineKo : m.text}
                        style={styles.bubbleText}
                      />
                    ) : (
                      <Text style={styles.bubbleText}>{m.text}</Text>
                    )}
                    {/* The immediate correction of the learner's own line — feedback on
                        the thing they just did, which is why it lives under their bubble.
                        A real fix shows the better phrasing; an already-good line just gets
                        a ✓ and the encouraging note. */}
                    {mine && !!m.correction && <CorrectionNote text={m.text} correction={m.correction} />}
                    {/* Translation belongs to the line being worked on, so it is offered on
                        the newest NPC bubble only (L125: marginTop 7). */}
                    {last && !mine && !!npcLineKo && (
                      <Pressable onPress={() => setShowKo((v) => !v)} style={{ marginTop: 7, alignSelf: 'flex-start' }}>
                        <View style={{ backgroundColor: showKo ? 'rgba(249,227,123,.5)' : 'rgba(95,141,90,.2)', borderWidth: 1.5, borderColor: showKo ? nb.ink : nb.green, borderRadius: 3, paddingVertical: 2, paddingHorizontal: 8 }}>
                          <Text numberOfLines={1} style={nbText.hand(12.5, showKo ? nb.ink : nb.green)}>
                            {showKo ? t('dialogue.showSource') : t('dialogue.tapTranslate')}
                          </Text>
                        </View>
                      </Pressable>
                    )}
                  </View>
                </NbPaper>
              </View>
            );
          })}
          {/* Waiting for the reply. In the thread rather than in a box of its own, so the
              answer lands where the waiting was. */}
          {!npcLine && (
            <View style={{ marginRight: 40 }}>
              <NbPaper rot={0} bg="#FCEEDC" style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 12, borderColor: '#E8D2B0' }}>
                <ActivityIndicator color={nb.ink} size="small" />
                <Text style={nbText.hand(15, nb.soft)}>{t('dialogue.npcThinking', { name: npcName })}</Text>
              </NbPaper>
            </View>
          )}
          {/* 작성 중 (L90): my line, not yet sent, at .6. */}
          {composing && (
            <View testID="composing-bubble" style={{ marginLeft: 40, opacity: 0.6 }}>
              <NbPaper rot={0} style={{ paddingVertical: 9, paddingHorizontal: 12 }}>
                <Text style={styles.bubbleText}>{draft.trim()}</Text>
              </NbPaper>
            </View>
          )}
        </ScrollView>

        {/* Between the thread and the input: in the reading path without covering
            anything, and gone on its own before the next reply lands. */}
        <MoodLift mood={improved} onDone={() => setImproved(undefined)} />

        {guided ? (
          <>
            {target ? (
              <>
                {/* Grabber ② (L128) — the message band's foot. Drag it down for more
                    conversation, up for more room below. */}
                {!typing && (
                  <ResizeHandle
                    testID="thread-handle"
                    onDrag={(dy) => {
                      if (!dragFrom.current.thread) dragFrom.current.thread = guidedThread;
                      const next = clampGuidedThread(dragFrom.current.thread + dy, winH);
                      dragTo.current.thread = next;
                      setThreadDrag(next);
                    }}
                    onDone={() => {
                      dragFrom.current.thread = 0;
                      if (dragTo.current.thread) void setDialogueLayout({ threadGuided: dragTo.current.thread });
                    }}
                  />
                )}
                {/* The guide (L130): flex 1, padding 2/16/0. Keyed on the sentence so its
                    hints reset each turn. The Korean target stays on screen whatever else
                    happens — the learner is always looking at what to say. */}
                <View style={{ flex: 1, minHeight: 0, paddingTop: 2, paddingHorizontal: 16 }}>
                  <GuidedTarget key={`${target.en}|${transcript.length}`} sentence={target} />
                  <GuidedInput
                    mode={inputMode}
                    onMode={setInputMode}
                    rec={rec}
                    onMicDown={() => { void micDown(); }}
                    onMicUp={() => { void micUp(); }}
                    draft={draft}
                    onDraft={setDraft}
                    chips={wordChips(target)}
                    editable={!pending && rec === 'idle'}
                    micEnabled={!pending && rec !== 'transcribing'}
                    onSubmit={sendDraft}
                  />
                </View>
              </>
            ) : (
              // No STEP 2 sentences in this situation: the reply choices stay (v44 spec J —
              // the handoff has no picture of this case). Pick an intent, then say it.
              <View style={{ flex: guidedInputOn ? 1 : undefined, minHeight: 0, paddingHorizontal: 16 }}>
                {!wroteOwn && !selectedChoice && (choicesBusy || choices.length > 0) && (
                  <View>
                    {/* Grabber ② here is the choices band's top edge. Drag it DOWN to give
                        the conversation more room. */}
                    <ResizeHandle
                      testID="choices-handle"
                      onDrag={(dy) => {
                        if (!dragFrom.current.choices) dragFrom.current.choices = choicesBand;
                        const next = clampChoices(dragFrom.current.choices - dy, winH);
                        dragTo.current.choices = next;
                        setChoicesH(next);
                      }}
                      onDone={() => {
                        dragFrom.current.choices = 0;
                        if (dragTo.current.choices) void setDialogueLayout({ choicesH: dragTo.current.choices });
                      }}
                    />
                    <ReplyChoices
                      choices={choices}
                      loading={choicesBusy}
                      onPick={(c) => { setSelectedChoice(c); setDraft(''); }}
                      // The no-microphone fallback: type instead.
                      onWriteMyOwn={() => { setWroteOwn(true); setInputMode('type'); }}
                      maxHeight={choicesBand}
                    />
                  </View>
                )}
                {guidedInputOn && (
                  <>
                    {!typing && <NbGrabber />}
                    {selectedChoice && (
                      // The picked intent, held above the input as the thing to say. The ×
                      // puts the list back — a different goal, a different sentence.
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <NbIcon name="speech" size={16} />
                        <Text numberOfLines={2} style={[nbText.hand(15.5), { flex: 1, minWidth: 0 }]}>{selectedChoice.intent}</Text>
                        <Pressable onPress={() => { setSelectedChoice(null); setDraft(''); }} hitSlop={8}>
                          <NbIcon name="cross" size={13} color={nb.soft} />
                        </Pressable>
                      </View>
                    )}
                    <GuidedInput
                      mode={inputMode}
                      onMode={setInputMode}
                      rec={rec}
                      onMicDown={() => { void micDown(); }}
                      onMicUp={() => { void micUp(); }}
                      draft={draft}
                      onDraft={setDraft}
                      chips={[]}
                      editable={!pending && rec === 'idle'}
                      micEnabled={!pending && rec !== 'transcribing'}
                      onSubmit={sendDraft}
                    />
                  </>
                )}
              </View>
            )}
            {/* D's rail (L178–182): ▷ 보내기 (live once there is a line) · 듣기 · 노트. */}
            <View style={{ paddingHorizontal: 16 }}>
              <Rail>
                <RailButton
                  testID="rail-send"
                  rot={0} padH={0} flex
                  icon="play"
                  label={pending ? t('dialogue.sending') : t('dialogue.send')}
                  color={canSend ? nb.ink : nb.soft}
                  dim={!canSend}
                  bg={canSend ? 'rgba(249,227,123,.5)' : undefined}
                  disabled={!canSend}
                  onPress={sendDraft}
                />
                <RailButton
                  testID="rail-listen"
                  rot={0.5} padH={16}
                  icon="speaker"
                  label={t('guided.listen')}
                  disabled={!modelLine}
                  onPress={() => { Speech.stop(); Speech.speak(modelLine, { language: 'en-US', rate: 0.9 }); }}
                />
                <RailButton
                  testID="rail-notes"
                  rot={-0.5} padH={13}
                  icon="board"
                  accessibilityLabel={t('dialogue.notesTitle')}
                  onPress={() => { setNotesOpen(true); loadNotes(); }}
                />
              </Rail>
            </View>
          </>
        ) : (
          <>
            {/* HINT: what this turn NEEDS, not what to say — the REASON the best reply
                works, with the reply itself withheld. Asked for per turn, because the
                situation has moved on. */}
            {hintOn && (
              <View style={{ marginTop: 6, paddingHorizontal: 16 }}>
                <NbPaper rot={0.4} bg="rgba(249,227,123,.5)" style={{ paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 9 }}>
                  <NbIcon name="bulb" size={16} />
                  {hintBusy ? (
                    <ActivityIndicator color={nb.ink} />
                  ) : (
                    <Text style={[nbText.body(12.5), { flex: 1, minWidth: 0 }]}>
                      {hintText || t('dialogue.hintNone')}
                    </Text>
                  )}
                  <Pressable onPress={() => setHintOn(false)} hitSlop={8}>
                    <NbIcon name="cross" size={13} color={nb.soft} />
                  </Pressable>
                </NbPaper>
              </View>
            )}
            {/* Grabber ② (L92). Drawn as the handoff draws it; on this run the band below
                it is the input, which has nothing to give, so it does not drag. */}
            {!typing && <NbGrabber />}
            {/* SPEAK FREELY (L93–98): padding 0/16, label, then the mic box 7 below. */}
            <View style={{ paddingHorizontal: 16 }}>
              <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 9.5, letterSpacing: 1, color: nb.soft }}>
                {rec === 'recording' ? t('dialogue.listening') : rec === 'transcribing' ? t('dialogue.transcribing') : t('dialogue.speakFreely')}
              </Text>
              <NbPaper rot={0} style={{ marginTop: 7, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable testID="free-mic" onPress={() => { void toggleMic(); }} disabled={pending}>
                  {/* L96: 38×38, green wash, 1.7 ink, radius 4, mic 20. Recording turns the
                      box red and puts a stop square in it (ours). */}
                  <View style={{
                    width: 38, height: 38, borderRadius: 4, borderWidth: 1.7, borderColor: nb.ink,
                    backgroundColor: rec === 'recording' ? 'rgba(199,81,70,.2)' : 'rgba(95,141,90,.15)',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {rec === 'transcribing'
                      ? <ActivityIndicator color={nb.ink} size="small" />
                      : rec === 'recording'
                        ? <View style={{ width: 12, height: 12, backgroundColor: nb.red }} />
                        : <NbIcon name="mic" size={20} />}
                  </View>
                </Pressable>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  editable={!pending && rec === 'idle'}
                  // L97: two lines, broken where the handoff breaks them.
                  placeholder={rec === 'recording' ? t('dialogue.tapMicAgain') : t('dialogue.inputPlaceholder')}
                  placeholderTextColor={nb.placeholder}
                  style={{ flex: 1, fontFamily: nbFonts.hand, fontSize: 16, lineHeight: 20.8, color: nb.ink, paddingVertical: 0 }}
                  onSubmitEditing={sendDraft}
                  returnKeyType="send"
                  multiline
                  // With `multiline`, RN defaults to keeping focus on return, so the "send"
                  // key inserted a newline and the keyboard could never be dismissed.
                  submitBehavior="blurAndSubmit"
                />
              </NbPaper>
              {/* E's rail (L99–103): marginTop 10 — ▷ 보내기 · 힌트 (paper .5, 9/16) · 노트 n
                  (paper -.5, 9/13). */}
              <View style={{ marginTop: 10 }}>
                <Rail>
                  <RailButton
                    testID="rail-send"
                    rot={0} padH={0} flex
                    icon="play"
                    label={pending ? t('dialogue.sending') : t('dialogue.send')}
                    color={canSend ? nb.ink : nb.soft}
                    dim={!canSend}
                    bg={canSend ? 'rgba(249,227,123,.5)' : undefined}
                    disabled={!canSend}
                    onPress={sendDraft}
                  />
                  <RailButton
                    testID="rail-hint"
                    rot={0.5} padH={16}
                    icon="bulb"
                    label={t('dialogue.hint')}
                    bg={hintOn ? 'rgba(249,227,123,.5)' : undefined}
                    onPress={() => { void askHint(); }}
                  />
                  <RailButton
                    testID="rail-notes"
                    rot={-0.5} padH={13}
                    icon="board"
                    label={notes?.length ? String(notes.length) : undefined}
                    accessibilityLabel={t('dialogue.notesTitle')}
                    onPress={() => { setNotesOpen(true); loadNotes(); }}
                  />
                </Rail>
              </View>
            </View>
          </>
        )}
      </Animated.View>

      {/* The rail's 노트 (결정 6). */}
      <NotesSheet
        visible={notesOpen}
        onClose={() => setNotesOpen(false)}
        notes={notes}
        quizCount={quizIds.length}
        onQuiz={() => { setNotesOpen(false); openQuiz(); }}
      />

      {/* 상황이 해소된 것 같을 때 한 번 묻는다. 판단이 아니라 질문이다 — 마무리를
          누르면 지금까지의 대화로 채점하고, 계속을 누르면 다시 묻지 않는다. */}
      <BottomSheet visible={wrapUp} onClose={() => setWrapUp(false)}>
        <View style={{ padding: 18, gap: 12 }}>
          <Text style={nbText.hand(20)}>{t('dialogue.wrapUpTitle')}</Text>
          <Text style={nbText.body(12.5, nb.soft)}>{t('dialogue.wrapUpBody')}</Text>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            <View style={{ flex: 1 }}>
              <NbButton variant="paper" full onPress={() => setWrapUp(false)}>
                {t('dialogue.wrapUpKeepGoing')}
              </NbButton>
            </View>
            <View style={{ flex: 1 }}>
              <NbButton variant="ink" full icon="check" iconColor={nb.paper} onPress={() => { setWrapUp(false); endSituation(); }}>
                {t('dialogue.wrapUpFinish')}
              </NbButton>
            </View>
          </View>
        </View>
      </BottomSheet>

      {/* 이어하기 — 이전 대화가 있으면 세션을 열기 전에 먼저 묻는다. 마지막
          대사를 보여줘서 무엇을 이어받는지 알고 고르게 한다(닫기로 회피할 수
          없다: 아직 세션이 없으므로 둘 중 하나를 반드시 골라야 한다). */}
      <BottomSheet visible={!!resumable} onClose={() => { void startFresh(); }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <NbIcon name="speech" size={17} />
            <Text style={nbText.hand(20)}>{t('dialogue.resumeTitle')}</Text>
          </View>
          <Text style={[nbText.body(11, nb.soft), { marginBottom: 10 }]}>
            {t('dialogue.resumeBody', { name: npcName, n: resumable?.turns.filter((x) => x.role === 'user').length ?? 0 })}
          </Text>
          {(() => {
            const last = resumable ? [...resumable.turns].reverse()[0] : undefined;
            if (!last) return null;
            return (
              // The line as it stood in the thread: my paper, or their warmer sheet.
              <NbPaper rot={0} bg={last.role === 'user' ? nb.paper : '#FCEEDC'} style={{ paddingVertical: 9, paddingHorizontal: 11, marginBottom: 16, ...(last.role === 'user' ? null : { borderColor: '#E8D2B0' }) }}>
                <Text style={[nbText.hand(12.5, nb.soft), { marginBottom: 3 }]}>
                  {last.role === 'user' ? t('dialogue.lastMine') : t('dialogue.lastNpc', { name: npcName })}
                </Text>
                <Text style={[nbText.body(11), { lineHeight: 17 }]} numberOfLines={3}>{last.content}</Text>
              </NbPaper>
            );
          })()}
          <View style={{ gap: 9 }}>
            <NbButton variant="ink" full icon="pencil" iconColor={nb.paper} onPress={() => { void resumePrevious(); }}>
              {t('dialogue.resume')}
            </NbButton>
            <NbButton variant="paper" full icon="compass" onPress={() => { void startFresh(); }}>
              {t('dialogue.restart')}
            </NbButton>
          </View>
        </View>
      </BottomSheet>

      {/* Leaving, said plainly. Someone tapping × has already decided to leave; the three
          answers are the three things a person actually wants here. */}
      <BottomSheet visible={pagedOut} onClose={() => setPagedOut(false)}>
        <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <NbIcon name="cross" size={18} color={nb.red} />
            <Text style={nbText.hand(20)}>{t('dialogue.exitTitle')}</Text>
          </View>
          <Text style={[nbText.body(11.5), { lineHeight: 19, marginBottom: 16 }]}>
            {t('dialogue.exitBody', { name: npcName })}
          </Text>
          <View style={{ gap: 9 }}>
            <NbButton variant="ink" full icon="pencil" iconColor={nb.paper} onPress={() => setPagedOut(false)}>
              {t('dialogue.stay')}
            </NbButton>
            <NbButton variant="paper" full icon="cross" onPress={() => { setPagedOut(false); router.back(); }}>
              {t('dialogue.exitKeep')}
            </NbButton>
            {/* Throwing the conversation away is the one destructive choice on this sheet,
                so it is the one drawn in red pen. */}
            <NbButton variant="danger" full onPress={() => { void leaveAndDiscard(); }}>
              {t('dialogue.exitDiscard')}
            </NbButton>
            <Text style={[nbText.body(10, nb.soft), { textAlign: 'center' }]}>
              {t('dialogue.exitDiscardNote')}
            </Text>
          </View>
        </View>
      </BottomSheet>

    </KeyboardAvoidingView>
  );
}

// ── helpers ──────────────────────────────────────────────────────────

/** dialogue.jsx L6 `stage: '#F6E3DC'`. */
const STAGE_BG = '#F6E3DC';

/** The notebook's ruled lines, behind everything — `repeating-linear-gradient(transparent 0
 *  27px, rule 27px 28px)` (ui.jsx L164), so the first line is at 27. */
// memo, and that matters here: this paints ~30 absolutely-positioned rule lines, and it
// has no props, so it never needs to redraw once mounted. Without memo it was re-created
// on every render — and during a streaming reply that is once per token, which is a
// large part of why a long answer made the screen feel like it had seized.
const Rules = memo(function Rules() {
  const { height } = useWindowDimensions();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
      {Array.from({ length: Math.ceil(height / RULE_H) }).map((_, i) => (
        <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: i * RULE_H + 27, height: 1, backgroundColor: RULE_COLOR }} />
      ))}
    </View>
  );
});

/** The immediate correction under the learner's own bubble (ours — the handoff has no
 *  picture of it; kept per lesson-fidelity-v46 결정 9). */
function CorrectionNote({ text, correction }: { text: string; correction: { corrected: string; note: string } }) {
  const t = useT();
  const fixed = !!correction.corrected.trim() && correction.corrected.trim() !== text.trim();
  const tone = fixed ? nb.amber : nb.green;
  return (
    <View style={{ marginTop: 7, borderTopWidth: 1, borderTopColor: 'rgba(62,54,43,.15)', paddingTop: 6, gap: 3 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <NbIcon name={fixed ? 'pencil' : 'check'} size={12} color={tone} />
        <Text style={nbText.hand(13, tone)}>{fixed ? t('dialogue.correctionFix') : t('dialogue.correctionGood')}</Text>
      </View>
      {fixed && (
        <Text style={{ fontFamily: nbFonts.body, fontSize: 12.5, color: nb.ink, lineHeight: 18 }}>{correction.corrected}</Text>
      )}
      {!!correction.note && (
        <Text style={{ fontFamily: nbFonts.body, fontSize: 10.5, color: nb.soft, lineHeight: 15 }}>{correction.note}</Text>
      )}
    </View>
  );
}

/** QUICK INFO panel body — bedside reference derived from the scenario chart,
 *  with sensible fallbacks so a tool is never empty (prompts the nurse to assess). */
function QuickInfo({ tool, p, kind, chart, brief, tagline }: { tool: 'chart' | 'meds' | 'vitals'; p: { name?: string; sub?: string }; kind: RoleKind; chart?: import('@/api/client').ScenarioChart; brief?: string; tagline?: string }) {
  const t = useT();
  if (tool === 'chart') {
    const rows: [string, string][] = [
      [t('role.patient'), p.name || '—'],
      [t('dialogue.role'), roleLabel(t, kind)],
      ...(p.sub ? ([[t('dialogue.info'), p.sub]] as [string, string][]) : []),
      [t('dialogue.chiefComplaint'), tagline || '—'],
      [t('dialogue.allergies'), chart?.allergies || t('dialogue.toVerify')],
    ];
    return (
      <View>
        {rows.map(([k, v], i) => (
          <View key={i} style={[styles.chartRow, i > 0 && styles.chartDivider]}>
            {/* The field name is printed — it is a form's label, not something the nurse
                wrote — and the value is in her hand. */}
            <Text numberOfLines={1} style={styles.chartKey}>{k}</Text>
            <Text style={[nbText.hand(16), { flex: 1, minWidth: 0 }]}>{v}</Text>
          </View>
        ))}
        {!!(chart?.notes || brief) && (
          <NbMemo color={nb.blue} rot={0.3} style={{ marginTop: 10 }}>
            <Text style={nbText.hand(14.5)}>{chart?.notes || brief}</Text>
          </NbMemo>
        )}
      </View>
    );
  }
  if (tool === 'meds') {
    const meds = chart?.meds ?? [];
    if (meds.length === 0) return <Text style={nbText.hand(15, nb.soft)}>{t('dialogue.noMeds')}</Text>;
    return (
      <View>
        {meds.map((m, i) => (
          <View key={i} style={[styles.chartRow, i > 0 && styles.chartDivider]}>
            <NbIcon name="pill" size={15} />
            <Text style={[nbText.hand(16), { flex: 1, minWidth: 0 }]}>{m}</Text>
          </View>
        ))}
      </View>
    );
  }
  // vitals
  const vitals = chart?.vitals ?? [];
  if (vitals.length === 0) return <Text style={nbText.hand(15, nb.soft)}>{t('dialogue.noVitals')}</Text>;
  return (
    <View style={{ flexDirection: 'row', gap: 7 }}>
      {vitals.map((v, i) => (
        <NbPaper key={i} rot={i % 2 ? 0.8 : -0.8} bg={v.warn ? '#FFF0EC' : undefined} style={styles.vital}>
          <Text numberOfLines={1} style={styles.vitalLabel}>{v.label}</Text>
          {/* Printed: a vital sign is a reading off a machine. An out-of-range one is in
              red pen, which is the only place this panel uses it. */}
          <Text numberOfLines={1} style={[styles.vitalValue, v.warn && { color: nb.red }]}>{v.value}</Text>
          {!!v.unit && <Text numberOfLines={1} style={styles.vitalUnit}>{v.unit}</Text>}
        </NbPaper>
      ))}
    </View>
  );
}

/** The persona's role in the reader's language. A function, so it re-resolves on
 *  every render — unlike a module constant, which would freeze at import. */
function roleLabel(t: Translate, kind: RoleKind): string {
  return t(`role.${kind}`);
}

const ROLE_KINDS = new Set<RoleKind>(['nurse', 'doctor', 'surgeon', 'paramedic', 'police', 'patient', 'child', 'parent', 'visitor', 'pharmacist']);
const EXPRESSIONS = new Set<Expression>(['neutral', 'derp', 'happy', 'sad', 'worried', 'pain', 'surprised', 'angry', 'thinking', 'sleepy', 'panic', 'focused', 'shy']);

const styles = {
  /** Bubble text (L72–73): Pretendard 13.5, lineHeight 1.5. */
  bubbleText: { fontFamily: nbFonts.body, fontSize: 13.5, color: nb.ink, lineHeight: 20.25 } as const,
  /** The page behind, dimmed with the notebook's own dark rather than a navy wash. */
  quickScrim: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20,
    backgroundColor: 'rgba(46,40,35,.55)',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24,
  } as const,
  chartRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 7 } as const,
  chartDivider: { borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.15)' } as const,
  chartKey: { width: 62, flexShrink: 0, fontFamily: nbFonts.mono, fontSize: 9, color: nb.soft, letterSpacing: 0.5 } as const,
  vital: { flex: 1, paddingVertical: 7, alignItems: 'center' } as const,
  vitalLabel: { fontFamily: nbFonts.mono, fontSize: 8.5, color: nb.soft, letterSpacing: 0.5 } as const,
  vitalValue: { fontFamily: nbFonts.monoBold, fontSize: 17, color: nb.ink, marginTop: 2 } as const,
  vitalUnit: { fontFamily: nbFonts.mono, fontSize: 8, color: nb.soft } as const,
};
