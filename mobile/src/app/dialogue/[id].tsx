// AI dialogue — visual-novel style persona role-play. 1:1 port of the v16
// handoff `screens-dialogue.jsx` (free mode): peach/cream room backdrop, patient
// (L) + player (R) portrait frames, a mission tracker, and the bottom dialogue
// box with a speaker tab + NPC line + free-text input. Wired to the real AI:
// startConversation(scenarioId) → sendMessageStream streams the NPC reply in
// persona. Hint mode, mic STT, quick-tools, and the result screen are follow-ups.
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View, type ViewStyle } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { RoleFace, type RoleKind, type Expression } from '@engine';
import { PixelButton } from '@/components/PixelButton';
import { PronunciationPractice } from '@/components/PronunciationPractice';
import { api, type ScenarioDetail } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;

export default function DialogueRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [scenario, setScenario] = useState<ScenarioDetail | null>(null);
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
  const sessionRef = useRef<string | null>(null);

  const [npcLine, setNpcLine] = useState(''); // latest NPC utterance (VN box)
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [hintOn, setHintOn] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const s = await api.scenario(id);
        if (!alive) return;
        setScenario(s);
        setNpcLine(s.tagline || ''); // opening line before the exchange starts
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
    setDraft('');
    setPending(true);
    setNpcLine(''); // clear for the streaming reply
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

  const p = scenario?.persona ?? {};
  const kind = (ROLE_KINDS.has(p.role as RoleKind) ? p.role : 'patient') as RoleKind;
  const expr = (EXPRESSIONS.has(p.mood as Expression) ? p.mood : 'neutral') as Expression;
  const npcName = (p.name || 'NPC').toUpperCase();
  const mission = scenario?.goals?.[0];
  const quizId = scenario?.steps?.find((s) => s.type === 'quiz')?.payload?.quizId;

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
        <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: '#fff' }}>대화를 시작하지 못했습니다</Text>
        <PixelButton label="‹ 돌아가기" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#1F2937' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />

      {/* room backdrop: peach (patient room) over cream (working area) */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <View style={{ flex: 4, backgroundColor: colors.peach }} />
        <View style={{ flex: 6, backgroundColor: colors.cream }} />
      </View>

      {/* status bar */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 52, paddingHorizontal: 16, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 5 }}>
        <PixelButton label="× 나가기" bg="#fff" shadowColor={C} offset={2} onPress={() => router.back()} style={{ paddingVertical: 4, paddingHorizontal: 10 }} />
        {!!mission && (
          <View style={{ alignItems: 'flex-end', gap: 4, maxWidth: 190 }}>
            <Shadowed offset={2}>
              <View style={{ backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, paddingVertical: 3, paddingHorizontal: 8 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>🎯 MISSION</Text>
              </View>
            </Shadowed>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 10, color: C, textAlign: 'right', lineHeight: 14 }}>{mission}</Text>
            </View>
          </View>
        )}
      </View>

      {/* patient portrait (L) */}
      <View style={{ position: 'absolute', left: 16, top: 128, zIndex: 3 }}>
        <PortraitFrame name={p.name || 'NPC'} status={p.mood ? p.mood.toUpperCase() : undefined}>
          <RoleFace kind={kind} hair={p.hair} expression={expr} size={120} />
        </PortraitFrame>
      </View>

      {/* player portrait (R) */}
      <View style={{ position: 'absolute', right: 16, top: 158, zIndex: 2, opacity: 0.9 }}>
        <PortraitFrame name="YOU · Junior Nurse" hue={colors.mint}>
          <RoleFace kind="nurse" hair="#3C2A18" expression="focused" size={120} />
        </PortraitFrame>
      </View>

      {/* dialogue box */}
      <View style={{ position: 'absolute', left: 14, right: 14, bottom: 20, zIndex: 6 }}>
        {/* speaker tab */}
        <View style={{ alignSelf: 'flex-start', marginLeft: 12 }}>
          <View style={{ backgroundColor: colors.peach, borderWidth: 3, borderColor: C, borderBottomWidth: 0, paddingVertical: 4, paddingHorizontal: 12 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>{npcName} · {roleKo(kind)}</Text>
          </View>
        </View>

        {/* NPC utterance */}
        <Shadowed offset={4}>
          <View style={{ backgroundColor: colors.cream, borderWidth: 3, borderColor: C, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, minHeight: 76 }}>
            {npcLine ? (
              <Text style={{ fontFamily: fonts.body, fontSize: 14, color: C, lineHeight: 22 }}>{npcLine}</Text>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color={C} size="small" />
                <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSoft }}>{npcName} 응답 중…</Text>
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
                  <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>💡 HINT ON</Text>
                </View>
              </Shadowed>
              <View style={{ flex: 1, height: 0, borderTopWidth: 2, borderColor: '#2A252255', borderStyle: 'dotted' }} />
              <Text style={{ fontFamily: fonts.body, fontSize: 10, color: '#fff', opacity: 0.85 }}>추천 답변 · 탭하면 입력</Text>
            </View>
            <View style={{ gap: 8 }}>
              {scenario.keyPhrases.map((phrase, i) => (
                <ChoiceRow key={i} num={i + 1} text={phrase} suggested={i === 0} onPress={() => { setDraft(phrase); setHintOn(false); }} />
              ))}
            </View>
            {/* pronunciation practice for the suggested phrase */}
            <PronunciationPractice referenceText={scenario.keyPhrases[0]} />
          </View>
        )}

        {/* free-text input */}
        <View style={{ marginTop: 14 }}>
          <Shadowed offset={3}>
            <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, backgroundColor: colors.mint, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16 }}>🎤</Text>
              </View>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                editable={!pending}
                placeholder="영어로 답해보세요…"
                placeholderTextColor={colors.textFaint}
                style={{ flex: 1, fontFamily: fonts.body, fontSize: 13, color: C, paddingVertical: 4 }}
                onSubmitEditing={send}
                returnKeyType="send"
                multiline
              />
            </View>
          </Shadowed>
        </View>

        {/* action rail */}
        <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 2 }}>
            <PixelButton label={pending ? '전송 중…' : '▶ 보내기'} bg={colors.mint} shadowColor={colors.mintShadow} disabled={pending || !draft.trim()} onPress={send} full />
          </View>
          <PixelButton label="💡 힌트" bg={hintOn ? colors.yellow : '#fff'} shadowColor={hintOn ? colors.yellowShadow : C} onPress={() => setHintOn((v) => !v)} disabled={!scenario?.keyPhrases?.length} style={{ flex: 1 }} />
          {!!quizId && <PixelButton label="📝" bg="#fff" shadowColor={C} onPress={() => router.push(`/quiz/${quizId}?scenario=${id}`)} style={{ paddingHorizontal: 12 }} />}
        </View>
      </View>
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
function PortraitFrame({ children, name, status, hue }: { children: React.ReactNode; name: string; status?: string; hue?: string }) {
  return (
    <View>
      <Shadowed offset={4}>
        <View style={{ width: 110, height: 130, backgroundColor: hue || colors.peach, borderWidth: 3, borderColor: C, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' }}>
          <View style={{ position: 'absolute', left: 6, top: 6, right: 6, bottom: 6, backgroundColor: 'rgba(255,255,255,0.5)' }} />
          {children}
        </View>
      </Shadowed>
      <Shadowed offset={2} style={{ marginTop: 6, alignSelf: 'flex-start' }}>
        <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 8 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>{name}</Text>
        </View>
      </Shadowed>
      {!!status && (
        <Shadowed offset={2} style={{ marginTop: 4, alignSelf: 'flex-start' }}>
          <View style={{ backgroundColor: '#EF4444', borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 6 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: '#fff' }}>{status}</Text>
          </View>
        </Shadowed>
      )}
    </View>
  );
}

/** A tappable suggested response (hint mode). Numbered chip + phrase. */
function ChoiceRow({ num, text, suggested, onPress }: { num: number; text: string; suggested?: boolean; onPress: () => void }) {
  return (
    <Shadowed offset={suggested ? 3 : 2} shadowColor={suggested ? colors.mintShadow : '#2A252266'}>
      <Pressable onPress={onPress} style={{ flexDirection: 'row', backgroundColor: '#fff', borderWidth: 2, borderColor: C }}>
        <View style={{ width: 28, backgroundColor: suggested ? colors.mint : colors.peach, borderRightWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>{num}</Text>
        </View>
        <View style={{ flex: 1, paddingVertical: 8, paddingHorizontal: 10 }}>
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, lineHeight: 17 }}>{text}</Text>
          {suggested && <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.mintShadow, marginTop: 3 }}>★ AI 추천 · 미션 진행</Text>}
        </View>
      </Pressable>
    </Shadowed>
  );
}

function roleKo(kind: RoleKind): string {
  return ({ patient: '환자', doctor: '의사', surgeon: '외과의', paramedic: '구급대원', police: '경찰', nurse: '간호사', child: '아동', parent: '보호자', visitor: '방문객', pharmacist: '약사' } as Record<RoleKind, string>)[kind];
}

const ROLE_KINDS = new Set<RoleKind>(['nurse', 'doctor', 'surgeon', 'paramedic', 'police', 'patient', 'child', 'parent', 'visitor', 'pharmacist']);
const EXPRESSIONS = new Set<Expression>(['neutral', 'derp', 'happy', 'sad', 'worried', 'pain', 'surprised', 'angry', 'thinking', 'sleepy', 'panic', 'focused', 'shy']);
