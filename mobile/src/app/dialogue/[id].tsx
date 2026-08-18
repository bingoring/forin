// AI dialogue — visual-novel style persona role-play. 1:1 port of the v16
// handoff `screens-dialogue.jsx` (free mode): peach/cream room backdrop, patient
// (L) + player (R) portrait frames, a mission tracker, and the bottom dialogue
// box with a speaker tab + NPC line + free-text input. Wired to the real AI:
// startConversation(scenarioId) → sendMessageStream streams the NPC reply in
// persona. Includes the v17 handoff affordances: MISSION counter, 💧 distress cue,
// QUICK INFO dock (차트/약물/활력 → chart panel), NPC-line 번역 toggle, ▼ next cue,
// and hint-mode choices with a red risky (평판 위험) variant, plus 🎤 mic dictation (record → Azure STT → draft).
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, type ViewStyle } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
  useAudioRecorder, requestRecordingPermissionsAsync, setAudioModeAsync,
  IOSOutputFormat, AudioQuality, type RecordingOptions,
} from 'expo-audio';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { RoleFace, type RoleKind, type Expression } from '@engine';
import { PixelButton } from '@/components/PixelButton';
import { api, type ScenarioDetail } from '@/api/client';
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { BottomSheet } from '@/components/BottomSheet';

const C = colors.ink;

// 16kHz mono PCM WAV — the format the server STT endpoint expects.
const WAV_16K_MONO: RecordingOptions = {
  extension: '.wav', sampleRate: 16000, numberOfChannels: 1, bitRate: 256000,
  ios: { outputFormat: IOSOutputFormat.LINEARPCM, audioQuality: AudioQuality.HIGH, linearPCMBitDepth: 16, linearPCMIsBigEndian: false, linearPCMIsFloat: false },
  android: { outputFormat: 'default', audioEncoder: 'default' },
  web: {},
};

export default function DialogueRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const sessionRef = useRef<string | null>(null);
  const turnsRef = useRef(0); // learner turns sent — gates grading (0 turns → 중단)

  const [npcLine, setNpcLine] = useState(''); // latest NPC utterance (VN box)
  // The VN box only ever showed the CURRENT line, and every previous turn was
  // thrown away — the learner could not look back at what was said, which is
  // exactly what makes a role-play hard to follow. The server already persists
  // every turn (dialogue_turns); this keeps the same history client-side so the
  // transcript sheet can show it without another round trip.
  const [transcript, setTranscript] = useState<{ role: 'user' | 'npc'; text: string }[]>([]);
  const [logOpen, setLogOpen] = useState(false);
  // Set when a previous conversation exists for this scenario. While it is set no
  // session is open yet — the learner picks resume or fresh first.
  const [resumable, setResumable] = useState<{ sessionId: string; turns: { role: string; content: string }[] } | null>(null);
  const [npcLineKo, setNpcLineKo] = useState(''); // Korean of the scripted line (for 번역)
  const [showKo, setShowKo] = useState(false);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [hintOn, setHintOn] = useState(false);
  const [tool, setTool] = useState<'chart' | 'meds' | 'vitals' | null>(null); // QUICK INFO panel
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
        const text = await api.transcribe(b64);
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
    try {
      await api.sendMessageStream(sessionRef.current, text, (chunk) => {
        setNpcLine((prev) => prev + chunk);
      });
    } catch {
      setNpcLine('(응답을 불러오지 못했습니다. 다시 시도해 주세요.)');
    } finally {
      setPending(false);
    }
  };

  // End the situation. No turns → nothing to grade: confirm, then leave without a
  // reward (the situation stays uncleared). With turns → grade on the result screen.
  const endSituation = () => {
    if (turnsRef.current === 0) {
      Alert.alert(
        '아직 대화를 시작하지 않았어요',
        '대화를 나눠야 평가와 보상을 받을 수 있어요. 그냥 나갈까요?',
        [
          { text: '계속하기', style: 'cancel' },
          { text: '나가기', style: 'destructive', onPress: () => router.back() },
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

  const stepAway = () => {
    Keyboard.dismiss();
    setPagedOut(true);
  };

  // Bottom rail 🎤 직접 말하기 (04_SCREENS.md:324) — pushes to the standalone
  // pronunciation route (T8) with the scenario's first key phrase as the
  // target sentence. This replaces the old inline pronunciation-recording
  // widget that used to render under HINT ON (scenario.keyPhrases[0] was its
  // only referenceText source too, so the target phrase is unchanged).
  const openPronunciation = () => {
    const phrase = scenario?.keyPhrases?.[0];
    if (!phrase) return;
    // One single template literal (not string concatenation) — expo-router's
    // typed-routes generator statically matches against a single backtick
    // expression; splitting it across `+`-joined pieces breaks that match
    // (same rule pronunciation/[sentenceKey].tsx's goNext follows).
    router.push(
      `/pronunciation/${encodeURIComponent(phrase.slice(0, 40))}?referenceText=${encodeURIComponent(phrase)}&origin=dialogue&scenarioId=${encodeURIComponent(id)}&ctx=${encodeURIComponent(scenario?.title ?? '')}&step=${encodeURIComponent('핵심 표현 발음 연습')}`
    );
  };

  const p = scenario?.persona ?? {};
  const kind = (ROLE_KINDS.has(p.role as RoleKind) ? p.role : 'patient') as RoleKind;
  const expr = (EXPRESSIONS.has(p.mood as Expression) ? p.mood : 'neutral') as Expression;
  const npcName = (p.name || 'NPC').toUpperCase();
  const goals = scenario?.goals ?? [];
  const mission = goals[0];
  const chart = scenario?.briefing?.chart;
  const riskyPhrases = scenario?.briefing?.riskyPhrases ?? [];
  const showSweat = expr === 'pain' || expr === 'panic' || expr === 'worried';
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
        <PixelButton label="‹ 돌아가기" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#1F2937' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      {/* room backdrop: peach (patient room) over cream (working area).
          Also the keyboard's escape hatch — a full-screen chat has nowhere
          obvious to tap, so the room itself dismisses it. */}
      <Pressable
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <View style={{ flex: 4, backgroundColor: colors.peach }} />
        <View style={{ flex: 6, backgroundColor: colors.cream }} />
      </Pressable>

      {/* status bar */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
        <PixelButton label="호출 받기" icon="alert" bg="#fff" shadowColor={C} offset={2} fontSize={11} borderWidth={2} paddingV={4} paddingH={10} onPress={stepAway} />
        <View style={{ alignItems: 'flex-end', gap: 4, maxWidth: 200 }}>
          {!!mission && (
            <>
              <Shadowed offset={2}>
                <View style={{ backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>MISSION 1/{Math.max(1, goals.length)}</Text>
                </View>
              </Shadowed>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: C, textAlign: 'right', lineHeight: 14 }}>{mission}</Text>
              </View>
            </>
          )}
          {/* Main completion: resolving the situation via dialogue ends the scenario.
              Ending with no dialogue is "중단" — no grade, no reward; ending after
              speaking hands the sessionId to the result screen for AI grading. */}
          <PixelButton icon="check" label="상황 종료" bg={colors.mint} shadowColor={colors.mintShadow} offset={2} fontSize={10} borderWidth={2} paddingV={4} paddingH={9} onPress={endSituation} />
        </View>
      </View>

      {/* patient portrait (L) */}
      <View style={{ position: 'absolute', left: 16, top: 128, zIndex: 3 }}>
        <PortraitFrame name={p.name || 'NPC'} status={p.mood ? p.mood.toUpperCase() : undefined} sweat={showSweat}>
          <RoleFace kind={kind} hair={p.hair} expression={expr} size={120} />
        </PortraitFrame>
      </View>

      {/* player portrait (R) */}
      <View style={{ position: 'absolute', right: 16, top: 158, zIndex: 2, opacity: 0.85 }}>
        <PortraitFrame name="YOU · Junior Nurse" hue={colors.mint}>
          <RoleFace kind="nurse" hair="#3C2A18" expression="focused" size={120} />
        </PortraitFrame>
      </View>

      {/* QUICK INFO dock — bedside reference tools (차트 / 약물 / 활력) */}
      <View style={{ position: 'absolute', left: 14, right: 14, top: '41%', flexDirection: 'row', alignItems: 'center', gap: 6, zIndex: 4 }}>
        <View style={{ backgroundColor: '#fff', borderWidth: 1.5, borderColor: C, paddingVertical: 2, paddingHorizontal: 5 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(8), color: C, opacity: 0.75 }}>QUICK INFO</Text>
        </View>
        <View style={{ flex: 1, height: 0, borderTopWidth: 2, borderColor: '#2A252255', borderStyle: 'dotted' }} />
        {([['chart', 'clipboard', '차트'], ['meds', 'pill', '약물'], ['vitals', 'stethoscope', '활력']] as const).map(([k, icon, label]) => (
          <Pressable key={k} onPress={() => setTool((cur) => (cur === k ? null : k))}>
            <Shadowed offset={2}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: tool === k ? colors.mint : '#fff', borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
                <Text style={{ fontSize: fs(13) }}>{icon}</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{label}</Text>
              </View>
            </Shadowed>
          </Pressable>
        ))}
      </View>

      {/* QUICK INFO panel — modal card over a scrim */}
      {tool && (
        <Pressable onPress={() => setTool(null)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(31,41,55,0.55)', zIndex: 20, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Pressable onPress={() => {}} style={{ alignSelf: 'stretch' }}>
            <Shadowed offset={5}>
              <View style={{ backgroundColor: colors.cream, borderWidth: 3, borderColor: C, padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>{tool === 'chart' ? '환자 차트' : tool === 'meds' ? '투약 정보' : '활력징후'}</Text>
                  <Pressable onPress={() => setTool(null)}><Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: colors.textSoft }}>✕</Text></Pressable>
                </View>
                <QuickInfo tool={tool} p={p} kind={kind} chart={chart} brief={scenario?.briefing?.brief} tagline={scenario?.tagline} />
              </View>
            </Shadowed>
          </Pressable>
        </Pressable>
      )}

      {/* dialogue box */}
      <View style={{ position: 'absolute', left: 14, right: 14, bottom: 20, zIndex: 6 }}>
        {/* speaker tab (with an upward peach shadow) */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginLeft: 12 }}>
          <View>
            <View style={{ position: 'absolute', left: 3, top: -2, right: -3, bottom: 2, backgroundColor: colors.peachShadow }} />
            <View style={{ backgroundColor: colors.peach, borderWidth: 3, borderColor: C, borderBottomWidth: 0, paddingVertical: 4, paddingHorizontal: 12 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{npcName} · {roleKo(kind)}</Text>
            </View>
          </View>
          {transcript.length > 0 && (
            <Pressable onPress={() => { Keyboard.dismiss(); setLogOpen(true); }} hitSlop={6}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.cream, borderWidth: 2.5, borderColor: C, borderBottomWidth: 0, paddingVertical: 3, paddingHorizontal: 8 }}>
                <PixelIcon name="note" color={C} size={11} sw={1.8} />
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>기록 {Math.ceil(transcript.length / 2)}</Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* NPC utterance */}
        <Shadowed offset={4}>
          <View style={{ backgroundColor: colors.cream, borderWidth: 3, borderColor: C, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, minHeight: 76 }}>
            {npcLine ? (
              <Text style={{ fontFamily: fonts.body, fontSize: fs(14), color: C, lineHeight: 22 }}>{showKo && npcLineKo ? npcLineKo : npcLine}</Text>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color={C} size="small" />
                <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft }}>{npcName} 응답 중…</Text>
              </View>
            )}
            {/* translate row — available for scripted lines that carry a Korean translation */}
            {!!npcLine && !!npcLineKo && (
              <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#2A252233', borderStyle: 'dotted', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, lineHeight: 14 }}>{showKo ? '원문 English' : '한국어 번역'}</Text>
                <Pressable onPress={() => setShowKo((v) => !v)}>
                  <View style={{ backgroundColor: showKo ? colors.yellow : colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>{showKo ? '원문 보기' : 'tap to 번역'}</Text>
                  </View>
                </Pressable>
              </View>
            )}
            {/* next-turn cue */}
            {!!npcLine && (
              <View style={{ position: 'absolute', right: 10, bottom: -8 }}>
                <Shadowed offset={2}>
                  <View style={{ width: 20, height: 20, backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                    <PixelIcon name="chevron-down" color={C} size={13} sw={1.8} />
                  </View>
                </Shadowed>
              </View>
            )}
          </View>
        </Shadowed>

        {/* HINT ON: suggested responses (from the scenario's key phrases) */}
        {hintOn && !!scenario?.keyPhrases?.length && (
          <View style={{ marginTop: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Shadowed offset={2}>
                <View style={{ backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: C }}>HINT ON</Text>
                </View>
              </Shadowed>
              <View style={{ flex: 1, height: 0, borderTopWidth: 2, borderColor: '#2A252255', borderStyle: 'dotted' }} />
              <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.cream, opacity: 0.85 }}>{scenario.keyPhrases.length}가지 추천 답변</Text>
            </View>
            <View style={{ gap: 8 }}>
              {scenario.keyPhrases.map((phrase, i) => {
                const risky = riskyPhrases.includes(phrase);
                return <ChoiceRow key={i} num={i + 1} text={phrase} suggested={i === 0 && !risky} risky={risky} onPress={() => { setDraft(phrase); setHintOn(false); }} />;
              })}
            </View>
          </View>
        )}

        {/* free-text input (hidden in hint mode — the choice chips replace it, per handoff) */}
        {!hintOn && (
          <View style={{ marginTop: 14 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: colors.textSoft, marginBottom: 5 }}>{rec === 'recording' ? '듣는 중… (마이크 탭하면 완료)' : rec === 'transcribing' ? '받아쓰는 중…' : 'SPEAK FREELY · 마이크를 눌러 말하기'}</Text>
            <Shadowed offset={3}>
              <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Pressable onPress={toggleMic} disabled={pending}>
                  <Shadowed offset={2} shadowColor={rec === 'recording' ? '#B91C1C' : colors.mintShadow}>
                    <View style={{ width: 32, height: 32, backgroundColor: rec === 'recording' ? '#FCA5A5' : colors.mint, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                      {rec === 'transcribing'
                        ? <ActivityIndicator color={C} size="small" />
                        : rec === 'recording'
                          ? <View style={{ width: 12, height: 12, backgroundColor: C }} />
                          : <PixelIcon name="mic" color={C} size={18} sw={1.8} />}
                    </View>
                  </Shadowed>
                </Pressable>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  editable={!pending && rec === 'idle'}
                  placeholder={rec === 'recording' ? '말한 뒤 마이크를 다시 누르세요…' : '자유롭게 영어로 답하거나 마이크로 말해보세요…'}
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
            <PixelButton label={pending ? '전송 중…' : '보내기'} icon={pending ? undefined : 'play'} bg={colors.mint} shadowColor={colors.mintShadow} fontSize={12} paddingV={9} borderWidth={2} offset={2} disabled={pending || !draft.trim()} onPress={send} full />
          </View>
          <View style={{ flex: 1 }}>
            <PixelButton icon="bulb" label="힌트" bg={hintOn ? colors.yellow : '#fff'} shadowColor={hintOn ? colors.yellowShadow : C} fontSize={12} paddingV={9} borderWidth={2} offset={2} onPress={() => setHintOn((v) => !v)} disabled={!scenario?.keyPhrases?.length} full />
            {hintOn && (
              <View style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, backgroundColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: colors.yellow }}>●</Text>
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <PixelButton icon="mic" label="직접 말하기" bg="#fff" shadowColor={C} fontSize={12} paddingV={9} borderWidth={2} offset={2} onPress={openPronunciation} disabled={!scenario?.keyPhrases?.length} full />
          </View>
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
      </View>
      {/* 이어하기 — 이전 대화가 있으면 세션을 열기 전에 먼저 묻는다. 마지막
          대사를 보여줘서 무엇을 이어받는지 알고 고르게 한다(닫기로 회피할 수
          없다: 아직 세션이 없으므로 둘 중 하나를 반드시 골라야 한다). */}
      <BottomSheet visible={!!resumable} onClose={() => { void startFresh(); }} expandable={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <PixelIcon name="note" color={C} size={17} sw={1.8} />
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
                  {last.role === 'user' ? '내가 마지막으로' : `${npcName} 님이 마지막으로`}
                </Text>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 17 }} numberOfLines={3}>{last.content}</Text>
              </View>
            );
          })()}
          <View style={{ gap: 8 }}>
            <PixelButton label="이어서 대화한다" icon="play" bg={colors.mint} shadowColor={colors.mintShadow} full onPress={() => { void resumePrevious(); }} />
            <PixelButton label="처음부터 다시" icon="refresh" bg="#fff" shadowColor={C} full onPress={() => { void startFresh(); }} />
          </View>
        </View>
      </BottomSheet>

      {/* 긴급 호출 — 이탈에 서사를 붙인다. 나가는 것은 같지만, 대화를 버리는
          것이 아니라 자리를 비우는 것이라고 말한다(기록은 남는다). */}
      <BottomSheet visible={pagedOut} onClose={() => setPagedOut(false)} expandable={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <PixelIcon name="alert" color={C} size={18} sw={1.9} />
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C }}>다른 곳에서 호출이 왔어요</Text>
          </View>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(11.5), color: colors.text, lineHeight: 19, marginBottom: 16 }}>
            {npcName} 님과의 대화를 잠시 멈추고 자리를 비우게 됩니다.{'\n'}
            지금까지 나눈 대화는 남아 있어요.
          </Text>
          <View style={{ gap: 8 }}>
            <PixelButton
              label="자리를 비운다"
              icon="alert"
              bg={colors.peach}
              shadowColor={colors.peachShadow}
              full
              onPress={() => { setPagedOut(false); router.back(); }}
            />
            <PixelButton
              label="대화를 계속한다"
              icon="play"
              bg={colors.mint}
              shadowColor={colors.mintShadow}
              full
              onPress={() => setPagedOut(false)}
            />
          </View>
        </View>
      </BottomSheet>

      {/* 대화 기록 — VN 박스는 현재 대사 하나만 보여주는 것이 핸드오프 설계이므로
          기록은 걷어내지 않고 시트로 연다. 확장 가능: 긴 대화는 위로 스와이프. */}
      <BottomSheet visible={logOpen} onClose={() => setLogOpen(false)}>
        <View style={{ paddingHorizontal: 14, paddingTop: 4, paddingBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 }}>
            <PixelIcon name="note" color={C} size={16} sw={1.8} />
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>지금까지의 대화</Text>
            <View style={{ flex: 1 }} />
            <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft }}>{npcName}</Text>
          </View>
          <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
            {[...transcript, ...(npcLine ? [{ role: 'npc' as const, text: npcLine }] : [])].map((t, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: t.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <View style={{ maxWidth: '84%', backgroundColor: t.role === 'user' ? '#fff' : colors.peach, borderWidth: 2.5, borderColor: C, paddingVertical: 8, paddingHorizontal: 11 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 17 }}>{t.text}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
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
  if (tool === 'chart') {
    const rows: [string, string][] = [
      ['환자', p.name || '—'],
      ['역할', roleKo(kind)],
      ...(p.sub ? ([['정보', p.sub]] as [string, string][]) : []),
      ['주요 호소', tagline || '—'],
      ['알레르기', chart?.allergies || '확인 필요'],
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
            <PixelIcon name="pill" color={C} size={14} sw={1.8} />
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

function roleKo(kind: RoleKind): string {
  return ({ patient: '환자', doctor: '의사', surgeon: '외과의', paramedic: '구급대원', police: '경찰', nurse: '간호사', child: '아동', parent: '보호자', visitor: '방문객', pharmacist: '약사' } as Record<RoleKind, string>)[kind];
}

const ROLE_KINDS = new Set<RoleKind>(['nurse', 'doctor', 'surgeon', 'paramedic', 'police', 'patient', 'child', 'parent', 'visitor', 'pharmacist']);
const EXPRESSIONS = new Set<Expression>(['neutral', 'derp', 'happy', 'sad', 'worried', 'pain', 'surprised', 'angry', 'thinking', 'sleepy', 'panic', 'focused', 'shy']);
