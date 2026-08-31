// AI dialogue — visual-novel style persona role-play. 1:1 port of the v16
// handoff `screens-dialogue.jsx` (free mode): peach/cream room backdrop, patient
// (L) + player (R) portrait frames, a mission tracker, and the bottom dialogue
// box with a speaker tab + NPC line + free-text input. Wired to the real AI:
// startConversation(scenarioId) → sendMessageStream streams the NPC reply in
// persona. Includes the v17 handoff affordances: MISSION counter, 💧 distress cue,
// QUICK INFO dock (차트/약물/활력 → chart panel), NPC-line 번역 toggle, ▼ next cue,
// and hint-mode choices with a red risky (평판 위험) variant, plus 🎤 mic dictation (record → Azure STT → draft).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, useWindowDimensions, View, type ViewStyle } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  useAudioPlayer,
  useAudioRecorder, requestRecordingPermissionsAsync, setAudioModeAsync,
  IOSOutputFormat, AudioQuality, type RecordingOptions,
} from 'expo-audio';
import { readAsStringAsync, EncodingType, cacheDirectory, downloadAsync, deleteAsync } from 'expo-file-system/legacy';
import { RoleFace, type RoleKind, type Expression } from '@engine';
import { PixelButton } from '@/components/PixelButton';
import { api, type ReplyChoice, type ScenarioDetail } from '@/api/client';
import { PixelIcon } from '@/components/PixelIcon';
import { FIcon } from '@/components/FIcon';
import { MissionCluster } from '@/components/dialogue/MissionCluster';
import { ReplyChoices } from '@/components/dialogue/ReplyChoices';
import { Collapsible, DisclosureChevron } from '@/components/Collapsible';
import { colors, fonts, fs } from '@/theme/tokens';
import { BottomSheet } from '@/components/BottomSheet';
import { threadOf } from '@/data/thread';
import { asMood, moodBorder, moodExpression, moodShowsSweat, type Mood } from '@/data/moodTone';
import { deptWash } from '@/data/deptWash';
import { MoodLift } from '@/components/dialogue/MoodLift';
import { playSfx } from '@/lib/sfx';
import { t, type Translate, useLocale, useT } from '@/i18n';
import { TASK_SCREEN } from '@/theme/transitions';

const C = colors.ink;

// 16kHz mono PCM WAV — the format the server STT endpoint expects.
const WAV_16K_MONO: RecordingOptions = {
  extension: '.wav', sampleRate: 16000, numberOfChannels: 1, bitRate: 256000,
  ios: { outputFormat: IOSOutputFormat.LINEARPCM, audioQuality: AudioQuality.HIGH, linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false },
  android: { outputFormat: 'default', audioEncoder: 'default' },
  web: {},
};

export default function DialogueRoute() {
  const t = useT();
  const { id, guide: guideParam } = useLocalSearchParams<{ id: string; guide?: 'choices' | 'free' }>();
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
  const [transcript, setTranscript] = useState<{ role: 'user' | 'npc'; text: string }[]>([]);
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
  const guided = (guideParam ?? scenario?.guide) === 'choices';
  const [choices, setChoices] = useState<ReplyChoice[]>([]);
  const [choicesBusy, setChoicesBusy] = useState(false);
  // Set when the learner asks for the box instead. Their decision outlives the next
  // turn — being handed the list again after saying "I'll write my own" is the app not
  // listening.
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
  const restingTop = winH * 0.41 + 34;
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
  // 20 is the resting gap above the home indicator.
  const threadBottomStyle = useMemo(
    () => Animated.add(new Animated.Value(20), keyboardLift),
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
  // The exit's pressed state — it is hand-drawn rather than a PixelButton because it is
  // a 30pt square with an icon and no label.
  const [exitDown, setExitDown] = useState(false);
  const [rec, setRec] = useState<'idle' | 'recording' | 'transcribing'>('idle'); // mic dictation
  const recorder = useAudioRecorder(WAV_16K_MONO);

  // Mic → speech-to-text: tap to record, tap to stop → transcribe → fill the draft.
  const toggleMic = async () => {
    if (rec === 'transcribing') return;
    if (rec === 'recording') {
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
      return;
    }
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) return;
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRec('recording');
    } catch { setRec('idle'); }
  };

  const loadChoices = useCallback(async () => {
    const sid = sessionRef.current;
    if (!guided || wroteOwn || !sid) return;
    setChoicesBusy(true);
    try {
      setChoices(await api.replyChoices(sid));
    } finally {
      setChoicesBusy(false);
    }
  }, [guided, wroteOwn]);


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
        const sid = await api.startConversation(id);
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

  const send = async () => {
    const text = draft.trim();
    if (!text || pending || !sessionRef.current) return;
    turnsRef.current += 1; // the server persists this turn in prepare(); count it for grading
    setDraft('');
    setPending(true);
    // Park the line the box is about to lose, then the learner's own line.
    setTranscript((t) => (npcLine ? [...t, { role: 'npc' as const, text: npcLine }, { role: 'user' as const, text }] : [...t, { role: 'user' as const, text }]));
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
      });
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
      sessionRef.current = await api.startConversation(id, prev.sessionId);
    } catch {
      setState('error');
      return;
    }
    // Rehydrate the transcript so the history sheet shows the earlier turns, and
    // count them so leaving grades instead of asking "아직 대화를 시작하지 않았어요".
    setTranscript(prev.turns.map((t) => ({ role: t.role === 'user' ? ('user' as const) : ('npc' as const), text: t.content })));
    turnsRef.current = prev.turns.filter((t) => t.role === 'user').length;
    const lastNpc = [...prev.turns].reverse().find((t) => t.role !== 'user');
    if (lastNpc) { setNpcLine(lastNpc.content); setNpcLineKo(''); }
  };

  const startFresh = async () => {
    setResumable(null);
    try {
      sessionRef.current = await api.startConversation(id);
    } catch {
      setState('error');
    }
  };

  // Refetched whenever it is the learner's move again: the suggestions are answers to
  // the line that was just said, and yesterday's answers to a different line are worse
  // than none. Never blocks anything — an empty result simply leaves the text box.
  /** Ask for a nudge: the REASON the best reply works, with the reply withheld.
   *
   *  Same source as the guided pass's choices — one call, two uses — but only the `why`
   *  is shown. On the free pass the sentence is the thing that must stay theirs; handing
   *  it over would make the second rung of the ladder the first one again. */
  const askHint = async () => {
    if (hintOn) { setHintOn(false); return; }
    setHintOn(true);
    const sid = sessionRef.current;
    if (!sid) return;
    setHintBusy(true);
    try {
      const cs = await api.replyChoices(sid);
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
  // The turn's mood wins; the scenario's authored mood is the opening state and the
  // fallback for a reply that carried none.
  // The scenario's own background tone, from its department colour (see deptWash).
  const wash = deptWash(scenario?.briefing?.deptColor);
  const authored = (EXPRESSIONS.has(p.mood as Expression) ? p.mood : 'neutral') as Expression;
  const expr = moodExpression(turnMood) ?? authored;
  const npcName = (p.name || 'NPC').toUpperCase();
  const goals = scenario?.goals ?? [];
  const chart = scenario?.briefing?.chart;
  const riskyPhrases = scenario?.briefing?.riskyPhrases ?? [];
  const showSweat = moodShowsSweat(turnMood) || (!turnMood && (expr === 'pain' || expr === 'panic' || expr === 'worried'));
  // A scenario can embed several quiz steps; surface them all as one sequence.
  const quizIds = (scenario?.steps ?? [])
    .filter((s) => s.type === 'quiz')
    .map((s) => s.payload?.quizId)
    .filter((q): q is string => !!q);

  if (state === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center' }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator color={colors.mint} />
      </View>
    );
  }
  if (state === 'error') {
    return (
      <View style={{ flex: 1, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: '#fff' }}>대화를 시작하지 못했습니다</Text>
        <PixelButton label={t('common.back')} onPress={() => router.back()} />
      </View>
    );
  }

  return (
    // No `behavior` prop: the thread column lifts itself by the keyboard's measured
    // height, and KeyboardAvoidingView's padding would move it a second time — the
    // input then travels past the top of the keyboard and off the thread entirely.
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#1F2937' }}>
      <Stack.Screen options={TASK_SCREEN} />

      {/* room backdrop: peach (patient room) over cream (working area).
          Also the keyboard's escape hatch — a full-screen chat has nowhere
          obvious to tap, so the room itself dismisses it. */}
      <Pressable
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {/* Ivory underneath, the department's wash on top of the upper band.
            The wash fades on the same timing as the thread rising, so the ivory the
            conversation sits on grows to fill the screen as the keyboard opens instead
            of leaving a band of another colour above it.
            The colour is the scenario's own department (deptWash) — an ER conversation
            reads warm, an ICU one cool — washed most of the way to cream so it cannot
            fight the bubbles drawn on it. */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.cream }} />
        <Animated.View style={{ height: '40%', backgroundColor: wash, opacity: chromeOpacity }} />
      </Pressable>

      {/* status bar */}
      <View
        onLayout={(e) => setBarH(e.nativeEvent.layout.height)}
        // alignItems: 'flex-start', not 'center'. Centred, this row re-centred its
        // children every time the mission cluster on the right grew — so opening the
        // missions slid the × in the opposite corner downwards. The exit is the one
        // control on this screen that must be in the same place every time it is
        // needed.
        style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 5 }}
      >
        {/* A bare ×. Renaming this to "호출 받기" put the fiction on the button,
            where it read as a feature rather than an exit; the framing belongs in
            the sheet it opens ("다른 곳에서 호출이 왔어요", and the promise that
            the conversation is kept). The affordance stays a plain close. */}
        {/* The exit stands alone up here, with nothing beside it to catch a thumb.
            The voice toggle used to sit 8px to its right — and both carried hitSlop 8, so
            their touch areas MET: there was no dead zone at all between a benign toggle
            and the way out, however far apart they looked. The toggle moved to the NPC's
            name plate, where the voice it controls comes from. */}
        {/* The way out. It had a shadow but no press: tapping it moved nothing, so on a
            slow frame there was no sign the tap had landed at all. Same mechanic as
            PixelButton now — the cap drops onto its own shadow. */}
        <Pressable
          onPressIn={() => setExitDown(true)}
          onPressOut={() => setExitDown(false)}
          onPress={() => { playSfx('back'); stepAway(); }}
          hitSlop={8}
        >
          <View style={{ position: 'absolute', left: 2, top: 2, right: -2, bottom: -2, backgroundColor: C }} />
          <View style={{
            width: 30, height: 30, backgroundColor: '#fff', borderWidth: 2, borderColor: C,
            alignItems: 'center', justifyContent: 'center',
            transform: [{ translateX: exitDown ? 2 : 0 }, { translateY: exitDown ? 2 : 0 }],
          }}>
            <FIcon name="cross" size={15} />
          </View>
        </Pressable>
        {/* 상황 종료, in the CENTRE OF THE SCREEN.
            Absolutely positioned across the row rather than laid out between its
            neighbours: with space-between it sat whereever the × and the mission chip
            left it, which drifted as the chip's count changed and read as "almost
            centred". Pinned across the full width it is centred on the screen, full
            stop. pointerEvents box-none so the row's own children stay tappable. */}
        <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, top: 52, alignItems: 'center' }}>
          <Animated.View style={{ opacity: chromeOpacity }} pointerEvents={typing ? 'none' : 'auto'}>
            <PixelButton
              icon="check"
              label={t('dialogue.endSituation')}
              bg={colors.mint}
              shadowColor={colors.mintShadow}
              offset={2}
              fontSize={10}
              borderWidth={2}
              paddingV={4}
              paddingH={9}
              onPress={endSituation}
            />
          </Animated.View>
        </View>

        {/* The missions, top-right. Everything about this cluster — including why its
            width is repeated down the chain — is in MissionCluster. */}
        <MissionCluster
          goals={goals}
          done={doneMissions}
          open={missionsOpen}
          onToggle={() => setMissionsOpen((v) => !v)}
          opacity={chromeOpacity}
          disabled={typing}
        />
      </View>

      {/* The NPC portrait, centred. Fades out while the keyboard is up — see `typing`.

          There used to be a second frame on the right holding the LEARNER's own face.
          It cost the top third of the screen to tell you what you look like, in a
          conversation where you are the one typing, and it pushed the NPC — the person
          being spoken to, whose expression is the feedback — off to one side. One
          portrait, in the middle, is the whole of what this strip is for. */}
      <Animated.View style={{ position: 'absolute', left: 0, right: 0, top: 128, alignItems: 'center', zIndex: 3, opacity: chromeOpacity }} pointerEvents={typing ? 'none' : 'auto'}>
        <PortraitFrame name={p.name || 'NPC'} status={p.mood ? p.mood.toUpperCase() : undefined} sweat={showSweat}>
          <RoleFace kind={kind} hair={p.hair} expression={expr} size={120} />
        </PortraitFrame>
        {/* On the portrait, because that is whose voice it turns off.
            It used to sit beside a name plate above the dialogue box — and that plate was
            the VN speaker tab, naming a person whose face and name are already on screen
            twice over. With the exchange scrolling as bubbles, who is speaking is the side
            the bubble is on, so the plate said nothing and the button was the only reason
            it was still there. Tapping it while a line is playing stops that line. */}
        <Pressable
          onPress={() => { setVoiceOn((v) => { if (v) { try { npcPlayer.pause(); } catch { /* nothing playing */ } } return !v; }); }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="switch"
          accessibilityState={{ checked: voiceOn }}
          accessibilityLabel={t(voiceOn ? 'dialogue.voiceOn' : 'dialogue.voiceOff')}
          // The frame is centred now, so the button hangs off its right edge rather than
          // being measured from the screen's left. Same relationship as before — adjacent
          // to the portrait, clear of the name plate underneath it.
          style={{ position: 'absolute', right: -38, top: 96 }}
        >
          <Shadowed offset={2}>
            <View style={{ width: 30, height: 30, backgroundColor: voiceOn ? colors.mint : '#fff', borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
              <PixelIcon name="volume" color={voiceOn ? C : C + '66'} size={15} sw={1.9} />
            </View>
          </Shadowed>
        </Pressable>
      </Animated.View>

      {/* QUICK INFO dock — bedside reference tools (차트 / 약물 / 활력).
          Anchored off the WINDOW height, not a percentage of this container: the
          KeyboardAvoidingView shrinks the container by the keyboard's height, so
          `top: '41%'` was 41% of a moving number and the dock rode up with the
          keyboard. The dialogue box below it is bottom-anchored and SHOULD rise
          (it holds the input); a bedside reference has no reason to. */}
      <Animated.View
        style={{ position: 'absolute', left: 14, right: 14, top: winH * 0.41, zIndex: 4, opacity: chromeOpacity }}
        // Not just faded — unhittable, so a tool cannot be opened by a tap aimed at the
        // thread that now covers this strip.
        pointerEvents={typing ? 'none' : 'auto'}
      >
        {/* Scrolls rather than wrapping. Wrapping was the other option and it costs a
            whole row of the thread every time it happens; scrolling costs nothing until
            the row is actually too wide, and then it costs a swipe. */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 4 }}
        >
        <View style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingVertical: 2, paddingHorizontal: 5 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C, opacity: 0.75 }}>QUICK INFO</Text>
        </View>
        {/* The chips used to be preceded by a `flex: 1` dotted rule, which took every
            spare pixel and squeezed them until the last label clipped — 활력 lost its
            last character. The rule is gone: the chips get their natural width, and the
            row scrolls if a longer translation still overflows.
            The real cause of the clipping was worse than the squeeze: each chip drew its
            icon NAME as text, so the row literally read "stethoscope 활력". */}
        {([['chart', 'clipboard', t('dialogue.tabChart')], ['meds', 'pill', t('dialogue.tabMeds')], ['vitals', 'stethoscope', t('dialogue.tabVitals')]] as const).map(([k, icon, label]) => (
          <Pressable key={k} onPress={() => setTool((cur) => (cur === k ? null : k))}>
            <Shadowed offset={2}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: tool === k ? colors.mint : '#fff', borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
                <PixelIcon name={icon} color={C} size={13} sw={1.9} />
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }} numberOfLines={1}>{label}</Text>
              </View>
            </Shadowed>
          </Pressable>
        ))}
        </ScrollView>
      </Animated.View>

      {/* QUICK INFO panel — modal card over a scrim */}
      {tool && (
        <Pressable onPress={() => setTool(null)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(31,41,55,0.55)', zIndex: 20, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Pressable onPress={() => {}} style={{ alignSelf: 'stretch' }}>
            <Shadowed offset={5}>
              <View style={{ backgroundColor: colors.cream, borderWidth: 3, borderColor: C, padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>{tool === 'chart' ? t('dialogue.chartTitle') : tool === 'meds' ? t('dialogue.medsTitle') : t('dialogue.vitalsTitle')}</Text>
                  <Pressable onPress={() => setTool(null)}><Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: colors.textSoft }}>✕</Text></Pressable>
                </View>
                <QuickInfo tool={tool} p={p} kind={kind} chart={chart} brief={scenario?.briefing?.brief} tagline={scenario?.tagline} />
              </View>
            </Shadowed>
          </Pressable>
        </Pressable>
      )}

      {/* The conversation, from below QUICK INFO down to the input.
          This used to be a VN box: one NPC line at a time, with everything said before it
          behind a 기록 chip and a sheet. Reading back a turn meant leaving the conversation
          to look at it, and a role-play is the one screen where what was already said is
          the thing you need — you are being graded on the thread.
          So the column fills the space instead: the exchange scrolls in the middle, the
          input stays put at the bottom, newest at the bottom. A messaging screen, because
          that is what this is. */}
      <Animated.View style={{ position: 'absolute', left: 14, right: 14, top: threadTopStyle, bottom: threadBottomStyle, zIndex: 6 }}>
        {/* the exchange */}
        <ScrollView
          ref={logRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 6 }}
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
              <View key={i} style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <View style={{ maxWidth: '86%' }}>
                  {/* The NEWEST NPC bubble carries the mood in its outline. Only the
                      newest: the mood belongs to the turn, and colouring the whole
                      history would repaint lines whose mood is no longer known (the
                      server stores it per turn, but the transcript this screen keeps
                      is text) and turn the thread into a colour chart. */}
                  <Shadowed offset={2.5} shadowColor={mine ? C : colors.peachShadow}>
                    <View style={{ backgroundColor: mine ? '#fff' : colors.peach, borderWidth: 2.5, borderColor: !mine && last ? moodBorder(turnMood) : C, paddingVertical: 9, paddingHorizontal: 12 }}>
                      <Text style={{ fontFamily: fonts.body, fontSize: fs(13), color: C, lineHeight: 20 }}>
                        {last && !mine && showKo && npcLineKo ? npcLineKo : m.text}
                      </Text>
                      {/* Translation belongs to the line being worked on, so it is offered on
                          the newest NPC bubble only — on every bubble it would be four buttons
                          asking the same question. */}
                      {last && !mine && !!npcLineKo && (
                        <Pressable onPress={() => setShowKo((v) => !v)} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                          <View style={{ backgroundColor: showKo ? colors.yellow : colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
                            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: C }}>{showKo ? t('dialogue.showSource') : t('dialogue.tapTranslate')}</Text>
                          </View>
                        </Pressable>
                      )}
                    </View>
                  </Shadowed>
                </View>
              </View>
            );
          })}
          {/* Waiting for the reply. In the thread rather than in a box of its own, so the
              answer lands where the waiting was. */}
          {!npcLine && (
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.peach, borderWidth: 2.5, borderColor: C, paddingVertical: 9, paddingHorizontal: 12 }}>
                <ActivityIndicator color={C} size="small" />
                <Text style={{ fontFamily: fonts.body, fontSize: fs(11.5), color: C }}>{t('dialogue.npcThinking', { name: npcName })}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Between the thread and the input: in the reading path without covering
            anything, and gone on its own before the next reply lands. */}
        <MoodLift mood={improved} onDone={() => setImproved(undefined)} />

        {/* HINT: what this turn NEEDS, not what to say.
            It used to be the scenario's authored key phrases, shown as a permanent list
            of ready-made sentences. Two things were wrong with that. It cost nothing and
            sat on screen, so there was no reason not to read it — and a hint nobody has
            to reach for teaches nothing. And it handed over the answer, which on the free
            pass is the one thing that must stay theirs.
            Now it is one line: the REASON the best reply works, with the reply itself
            withheld. Asked for per turn, because the situation has moved on. */}
        {hintOn && (
          <View style={{ marginTop: 12 }}>
            <View style={{ position: 'absolute', left: 3, top: 3, right: -3, bottom: -3, backgroundColor: C }} />
            <View style={{ backgroundColor: colors.yellow, borderWidth: 2.5, borderColor: C, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 9 }}>
              <FIcon name="hint" size={16} />
              {hintBusy ? (
                <ActivityIndicator color={C} />
              ) : (
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(12), color: C, lineHeight: 17 }}>
                  {hintText || t('dialogue.hintNone')}
                </Text>
              )}
              <Pressable onPress={() => setHintOn(false)} hitSlop={8}>
                <FIcon name="cross" size={13} />
              </Pressable>
            </View>
          </View>
        )}

        {/* GUIDED PASS: three replies instead of an empty box.
            The first time through a conversation the learner has nothing to be free
            with, which is what testers reported. Picking one takes them to pronunciation
            practice — the point is to SAY it, not to recognise it. */}
        {guided && !wroteOwn && !hintOn && (
          <View style={{ marginTop: 12 }}>
            <ReplyChoices
              choices={choices}
              loading={choicesBusy}
              selectedText={draft}
              // Choosing fills the box and stays put. It used to jump straight to the
              // pronunciation screen, which made speaking a toll gate on the way to
              // sending — someone on a bus could not get past it.
              onPick={(c) => setDraft(c.text)}
              // Speaking is its own zone on the card, so it is a decision rather than a
              // consequence of choosing.
              onSpeak={(c) => {
                setDraft(c.text);
                router.push(
                  `/pronunciation/${encodeURIComponent(c.text.slice(0, 40))}?referenceText=${encodeURIComponent(c.text)}&origin=dialogue&scenarioId=${encodeURIComponent(id ?? '')}&step=${encodeURIComponent(t('choice.prompt'))}`
                );
              }}
              onWriteMyOwn={() => setWroteOwn(true)}
              // Capped so the cards cannot cover the conversation they answer.
              maxHeight={winH * 0.34}
            />
          </View>
        )}

        {/* free-text input (hidden in hint mode — the choice chips replace it, per handoff) */}
        {(!hintOn && (!guided || wroteOwn || (!choicesBusy && choices.length === 0))) && (
          <View style={{ marginTop: 14 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft, marginBottom: 5 }}>{rec === 'recording' ? t('dialogue.listening') : rec === 'transcribing' ? t('dialogue.transcribing') : t('dialogue.speakFreely')}</Text>
            <Shadowed offset={3}>
              <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable onPress={toggleMic} disabled={pending}>
                  <Shadowed offset={2} shadowColor={rec === 'recording' ? '#B91C1C' : colors.mintShadow}>
                    <View style={{ width: 32, height: 32, backgroundColor: rec === 'recording' ? '#FCA5A5' : colors.mint, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                      {rec === 'transcribing'
                        ? <ActivityIndicator color={C} size="small" />
                        : rec === 'recording'
                          ? <View style={{ width: 12, height: 12, backgroundColor: C }} />
                          : <FIcon name="mic" size={18} />}
                    </View>
                  </Shadowed>
                </Pressable>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  editable={!pending && rec === 'idle'}
                  placeholder={rec === 'recording' ? t('dialogue.tapMicAgain') : t('dialogue.inputPlaceholder')}
                  placeholderTextColor={colors.textFaint}
                  style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(13), color: C, paddingVertical: 4 }}
                  onSubmitEditing={send}
                  returnKeyType="send"
                  multiline
                  // With `multiline`, RN defaults to keeping focus on return, so
                  // the "send" key inserted a newline and the keyboard could
                  // never be dismissed. Blur AND submit instead — that is what
                  // the key says it does.
                  submitBehavior="blurAndSubmit"
                />
              </View>
            </Shadowed>
          </View>
        )}

        {/* action rail */}
        <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 2 }}>
            <PixelButton label={pending ? t('dialogue.sending') : t('dialogue.send')} icon={pending ? undefined : 'play'} bg={colors.mint} shadowColor={colors.mintShadow} fontSize={12} paddingV={9} borderWidth={2} offset={2} disabled={pending || !draft.trim()} onPress={send} full />
          </View>
          <View style={{ flex: 1 }}>
            <PixelButton icon="bulb" label={t('dialogue.hint')} bg={hintOn ? colors.yellow : '#fff'} shadowColor={hintOn ? colors.yellowShadow : C} fontSize={12} paddingV={9} borderWidth={2} offset={2} onPress={askHint} full />
            {hintOn && (
              <View style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, backgroundColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.yellow }}>●</Text>
              </View>
            )}
          </View>
          {/* 핵심 표현 발음 연습 lived here and has been removed. It sent the learner
              OUT of a conversation they were in the middle of, to drill a phrase from the
              scenario's key-phrase list — and the same practice is now reachable from
              where it belongs: the result screen lists every sentence they actually spoke
              with its score, and the Review Lab's 직접 말하기 연습 holds the whole history.
              Practising a phrase you were handed is a weaker exercise than practising the
              sentence you chose yourself. */}
          {quizIds.length > 0 && (
            <PixelButton
              icon="note"
              label={quizIds.length > 1 ? `${quizIds.length}` : ''}
              bg="#fff"
              shadowColor={C}
              fontSize={12}
              paddingV={9}
              paddingH={12}
              borderWidth={2}
              offset={2}
              onPress={() => router.push(`/quiz/${quizIds[0]}?scenario=${id}&q=${quizIds.join(',')}&i=0`)}
            />
          )}
        </View>
      </Animated.View>
      {/* 상황이 해소된 것 같을 때 한 번 묻는다. 판단이 아니라 질문이다 — 마무리를
          누르면 지금까지의 대화로 채점하고, 계속을 누르면 다시 묻지 않는다. */}
      <BottomSheet visible={wrapUp} onClose={() => setWrapUp(false)}>
        <View style={{ padding: 18, gap: 12 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C }}>{t('dialogue.wrapUpTitle')}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.text, lineHeight: 18 }}>{t('dialogue.wrapUpBody')}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <PixelButton
              label={t('dialogue.wrapUpKeepGoing')}
              bg="#fff"
              shadowColor={C}
              fontSize={12}
              paddingV={9}
              borderWidth={2}
              offset={2}
              onPress={() => setWrapUp(false)}
              style={{ flex: 1 }}
            />
            <PixelButton
              icon="check"
              label={t('dialogue.wrapUpFinish')}
              bg={colors.mint}
              shadowColor={colors.mintShadow}
              fontSize={12}
              paddingV={9}
              borderWidth={2}
              offset={2}
              onPress={() => { setWrapUp(false); endSituation(); }}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomSheet>

      {/* 이어하기 — 이전 대화가 있으면 세션을 열기 전에 먼저 묻는다. 마지막
          대사를 보여줘서 무엇을 이어받는지 알고 고르게 한다(닫기로 회피할 수
          없다: 아직 세션이 없으므로 둘 중 하나를 반드시 골라야 한다). */}
      <BottomSheet visible={!!resumable} onClose={() => { void startFresh(); }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <FIcon name="doc" size={17} />
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C }}>이어서 대화할까요?</Text>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, marginBottom: 10 }}>
            {npcName} 님과 {resumable?.turns.filter((t) => t.role === 'user').length ?? 0}번 주고받은 기록이 있어요.
          </Text>
          {(() => {
            const last = resumable ? [...resumable.turns].reverse()[0] : undefined;
            if (!last) return null;
            return (
              <View style={{ backgroundColor: last.role === 'user' ? '#fff' : colors.peach, borderWidth: 2.5, borderColor: C, paddingVertical: 9, paddingHorizontal: 11, marginBottom: 16 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.textSoft, marginBottom: 3 }}>
                  {last.role === 'user' ? t('dialogue.lastMine') : t('dialogue.lastNpc', { name: npcName })}
                </Text>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 17 }} numberOfLines={3}>{last.content}</Text>
              </View>
            );
          })()}
          <View style={{ gap: 8 }}>
            <PixelButton label={t('dialogue.resume')} icon="play" bg={colors.mint} shadowColor={colors.mintShadow} full onPress={() => { void resumePrevious(); }} />
            <PixelButton label={t('dialogue.restart')} icon="refresh" bg="#fff" shadowColor={C} full onPress={() => { void startFresh(); }} />
          </View>
        </View>
      </BottomSheet>

      {/* Leaving, said plainly.
          This used to be framed as a page from elsewhere — "다른 곳에서 호출이 왔어요" —
          on the theory that a ward nurse does not "exit" a patient, they get pulled away.
          The fiction was doing the wrong job: someone tapping × has already decided to
          leave, and being told a story about why is one more thing to read before a door
          opens. The three answers are the three things a person actually wants here. */}
      <BottomSheet visible={pagedOut} onClose={() => setPagedOut(false)}>
        <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <FIcon name="cross" size={18} />
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C }}>{t('dialogue.exitTitle')}</Text>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11.5), color: colors.text, lineHeight: 19, marginBottom: 16 }}>
            {t('dialogue.exitBody', { name: npcName })}
          </Text>
          <View style={{ gap: 8 }}>
            <PixelButton
              label={t('dialogue.stay')}
              icon="play"
              bg={colors.mint}
              shadowColor={colors.mintShadow}
              full
              onPress={() => setPagedOut(false)}
            />
            <PixelButton
              label={t('dialogue.exitKeep')}
              icon="x"
              bg="#fff"
              shadowColor={C}
              full
              onPress={() => { setPagedOut(false); router.back(); }}
            />
            <PixelButton
              label={t('dialogue.exitDiscard')}
              icon="trash"
              bg={colors.peach}
              shadowColor={colors.peachShadow}
              full
              onPress={() => { void leaveAndDiscard(); }}
            />
            <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, textAlign: 'center' }}>
              {t('dialogue.exitDiscardNote')}
            </Text>
          </View>
        </View>
      </BottomSheet>

    </KeyboardAvoidingView>
  );
}

// ── helpers ──────────────────────────────────────────────────────────

function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: ViewStyle }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}

/** Portrait frame with a name plate (and optional red status chip). */
function PortraitFrame({ children, name, status, hue, sweat }: { children: React.ReactNode; name: string; status?: string; hue?: string; sweat?: boolean }) {
  return (
    <View>
      <Shadowed offset={4}>
        <View style={{ width: 110, height: 130, backgroundColor: hue || colors.peach, borderWidth: 3, borderColor: C, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ position: 'absolute', left: 6, top: 6, right: 6, bottom: 6, backgroundColor: 'rgba(255,255,255,0.5)' }} />
          {children}
        </View>
      </Shadowed>
      {sweat && (
        <View style={{ position: 'absolute', top: 2, right: -8, zIndex: 4 }}>
          <PixelIcon name="droplet" color={colors.blue} size={18} sw={1.8} />
        </View>
      )}
      <Shadowed offset={2} style={{ marginTop: 6, alignSelf: 'flex-start' }}>
        <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{name}</Text>
        </View>
      </Shadowed>
      {!!status && (
        <Shadowed offset={2} style={{ marginTop: 4, alignSelf: 'flex-start' }}>
          <View style={{ backgroundColor: '#EF4444', borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 6 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: '#fff' }}>{status}</Text>
          </View>
        </Shadowed>
      )}
    </View>
  );
}

/** A tappable suggested response (hint mode). Numbered chip + phrase.
 *  suggested = mint (AI 추천) · risky = red (평판 위험) · else peach (normal). */
function ChoiceRow({ num, text, suggested, risky, onPress }: { num: number; text: string; suggested?: boolean; risky?: boolean; onPress: () => void }) {
  const tabBg = risky ? '#FCA5A5' : suggested ? colors.mint : colors.peach;
  const shadow = suggested ? colors.mintShadow : '#2A252266';
  return (
    <Shadowed offset={suggested ? 3 : 2} shadowColor={shadow}>
      <Pressable onPress={onPress} style={{ flexDirection: 'row', backgroundColor: '#fff', borderWidth: 2, borderColor: C }}>
        <View style={{ width: 28, backgroundColor: tabBg, borderRightWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>{num}</Text>
        </View>
        <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 10 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: C, lineHeight: 17 }}>{text}</Text>
          {suggested && <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.mintShadow, marginTop: 3 }}>AI 추천 · 미션 진행</Text>}
          {risky && <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: '#B91C1C', marginTop: 3 }}>평판 −2 위험</Text>}
        </View>
      </Pressable>
    </Shadowed>
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
      <View style={{ gap: 6 }}>
        {rows.map(([k, v], i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
            <Text style={{ width: 68, fontFamily: fonts.heading, fontSize: fs(11), color: colors.textSoft }}>{k}</Text>
            <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(12), color: C, lineHeight: 17 }}>{v}</Text>
          </View>
        ))}
        {!!(chart?.notes || brief) && (
          <View style={{ marginTop: 4, backgroundColor: colors.paper, borderWidth: 1.5, borderColor: '#2A252244', borderStyle: 'dashed', padding: 8 }}>
            <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.text, lineHeight: 16 }}>{chart?.notes || brief}</Text>
          </View>
        )}
      </View>
    );
  }
  if (tool === 'meds') {
    const meds = chart?.meds ?? [];
    if (meds.length === 0) return <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, lineHeight: 18 }}>확인된 처방 약물이 없어요. 구두로 직접 확인하세요.</Text>;
    return (
      <View style={{ gap: 6 }}>
        {meds.map((m, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
            <FIcon name="pill" size={14} />
            <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(12), color: C, lineHeight: 17 }}>{m}</Text>
          </View>
        ))}
      </View>
    );
  }
  // vitals
  const vitals = chart?.vitals ?? [];
  if (vitals.length === 0) return <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, lineHeight: 18 }}>활력징후가 아직 측정되지 않았어요. 직접 사정하세요.</Text>;
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {vitals.map((v, i) => (
        <View key={i} style={{ flex: 1, backgroundColor: v.warn ? '#FEE2E2' : colors.paper, borderWidth: 1.5, borderColor: C, paddingVertical: 6, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: colors.textSoft }}>{v.label}</Text>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: v.warn ? '#DC2626' : C, marginTop: 2 }}>{v.value}</Text>
          {!!v.unit && <Text style={{ fontFamily: fonts.body, fontSize: fs(8), color: colors.textSoft, marginTop: 1 }}>{v.unit}</Text>}
        </View>
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
