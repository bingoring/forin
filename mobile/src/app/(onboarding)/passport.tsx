// Onboarding as a journey: a passport you open, stamp, fly with, and get admitted at.
//
// It asks the same three things the three-page wizard asked — job, destination, level —
// and saves them the same way (draft per answer, PATCH /me/profile at the end). What
// changed is that the questions are now stops on a trip, because the thing being sold is
// working abroad and a form is not that.
//
// The journey (v29 · 07_NOTEBOOK_REDESIGN.md § 온보딩 인터랙티브 플로우):
//   cover → job → destination → (stamp, close) → flight → immigration → approved →
//   first-day walk → the app
//
// TWO deviations from the prototype, both because the platform is not a browser:
//
// ONE deviation from the prototype: the curl is built from 2D slices rather than 24 nested
// 3D joints, because the nested version is a browser construct that produces a broken fan
// on Android. The geometry and the reasoning are in components/nb/PageCurl.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { api } from '@/api/client';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbCheck, NbMark, NbMemo, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { CurlSweep, PageCurl } from '@/components/nb/PageCurl';
import { RULE_COLOR, RULE_H, nb, nbFonts } from '@/theme/nb';
import { isDestinationReady } from '@/data/destinations';
import { clearDraft, loadDraft, passportStep, saveDraft } from '@/lib/onboardingDraft';
import { syncOnboarded } from '@/lib/auth';
import { useAuthStore } from '@/store/authStore';
import { LOCALES, LOCALE_META, getLocale, localeWasChosen, setLocale, useT, type Locale } from '@/i18n';

/** Passport green and its gold. Only this screen uses them — a passport is not a page of
 *  the notebook, it is the object the notebook came in. */
const GREEN = '#2E4636';
const GOLD = '#D4B46A';
const GOLD_SOFT = 'rgba(212,180,106,.75)';
const CREAM_TEXT = '#F3E6C8';

/**
 * The four destinations, and what each one changes downstream.
 *
 * `code` is the profile's destination — the codes the rest of the app already uses, not
 * the prototype's usa/aus/can/gbr. Only some are open: `isDestinationReady` is fed by the
 * server, and a country with no authored curriculum behind it must not be selectable, or
 * onboarding ends by committing someone to a hospital that does not exist yet.
 */
const DESTS = [
  { id: 'us', nameKey: 'onb.dest.us', stampCode: 'USA', apt: 'JFK', sub: 'NCLEX-RN · EN-US', flag: '🇺🇸', rot: -0.5 },
  { id: 'au', nameKey: 'onb.dest.au', stampCode: 'AUS', apt: 'SYD', sub: 'OBA · EN-AU', flag: '🇦🇺', rot: 0.5 },
  { id: 'ca', nameKey: 'onb.dest.ca', stampCode: 'CAN', apt: 'YVR', sub: 'NCLEX · EN-CA', flag: '🇨🇦', rot: -0.4 },
  { id: 'gb', nameKey: 'onb.dest.gb', stampCode: 'GBR', apt: 'LHR', sub: 'NMC · EN-GB', flag: '🇬🇧', rot: 0.4 },
] as const;

const JOBS = [
  { code: 'nurse', icon: 'stetho' as const, nameKey: 'onb.job.nurse', subKey: 'onb.job.nurseSub', ready: true, rot: -0.4 },
  { code: 'hotel', icon: 'bell' as const, nameKey: 'onb.job.hotel', subKey: 'onb.job.hotelSub', ready: false, rot: 0.4 },
  { code: 'service', icon: 'coffee' as const, nameKey: 'onb.job.service', subKey: 'onb.job.serviceSub', ready: false, rot: -0.3 },
  { code: 'engineer', icon: 'gear' as const, nameKey: 'onb.job.engineer', subKey: 'onb.job.engineerSub', ready: false, rot: 0.3 },
] as const;

/**
 * The immigration officer's three answers, and the CEFR band each one means.
 *
 * The prototype labels them a/b/c; the profile stores a CEFR band, because that is what
 * the server interprets (domain/user/level.go: speech register, grading calibration,
 * scenario weighting). The mapping is the whole point of the question, so it lives here
 * as one table rather than being spread across a switch.
 *
 * A2/B1/B2 rather than A1..C1: someone who can say words is past A1, and someone
 * comfortable in daily conversation but lost in a hospital is B2 — C1 would calibrate the
 * examiner against a level the answer does not claim.
 */
const LEVELS = [
  { id: 'a', cefr: 'A2', titleKey: 'onb.lvl.a', subKey: 'onb.lvl.aSub', rot: -0.3 },
  { id: 'b', cefr: 'B1', titleKey: 'onb.lvl.b', subKey: 'onb.lvl.bSub', rot: 0.3 },
  { id: 'c', cefr: 'B2', titleKey: 'onb.lvl.c', subKey: 'onb.lvl.cSub', rot: -0.3 },
] as const;

type Step =
  | 'cover' | 'lang' | 'job' | 'dest' | 'closing' | 'flight'
  | 'immigration' | 'approved' | 'commute' | 'flightBack';

/** How long each unattended stop lasts before the journey moves on. The prototype's
 *  numbers; they are the pacing, not an implementation detail. */
const HOLD: Partial<Record<Step, { ms: number; next: Step }>> = {
  closing: { ms: 1700, next: 'flight' },
  flight: { ms: 2700, next: 'immigration' },
  flightBack: { ms: 2700, next: 'dest' },
};

// ── the page turn ──────────────────────────────────────────────────────────
//
// The curl lives in components/nb/PageCurl: it is the one piece of this screen that had to
// be rebuilt rather than translated, and the reasoning for the projection is there.
// ── page furniture ─────────────────────────────────────────────────────────

/** The passport's spine: the fold every page is bound at, on the left. */
function Gutter() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 20, zIndex: 3 }}>
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, backgroundColor: 'rgba(62,54,43,.22)' }} />
      <View style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 8, backgroundColor: 'rgba(62,54,43,.09)' }} />
      <View style={{ position: 'absolute', left: 6, top: 0, bottom: 0, borderLeftWidth: 1.5, borderLeftColor: 'rgba(62,54,43,.35)', borderStyle: 'dashed' }} />
    </View>
  );
}

/** A ruled notebook page, sized to the screen — the passport's inside pages are the
 *  notebook's paper. */
function Page({ bg, children }: { bg?: string; children?: React.ReactNode }) {
  const { height } = useWindowDimensions();
  const lines = bg ? 0 : Math.ceil(height / RULE_H);
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: bg || nb.cream, overflow: 'hidden' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <View key={i} pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
      ))}
      {children}
    </View>
  );
}

function Dots({ at, total = 5 }: { at: number; total?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{ width: i === at ? 22 : 8, height: 8, borderRadius: 99, backgroundColor: i === at ? nb.ink : 'rgba(62,54,43,.25)' }} />
      ))}
    </View>
  );
}

function BackChip({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ position: 'absolute', right: 22, top: 14, zIndex: 5 }} hitSlop={10}>
      <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
        <NbIcon name="chevronLeft" size={16} />
      </NbPaper>
    </Pressable>
  );
}

function Header({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={{ paddingTop: 14, paddingLeft: 34, paddingRight: 24 }}>
      <Text style={[nbText.hand(26), { lineHeight: 31 }]}>{title}</Text>
      {!!sub && <Text style={[nbText.body(11.5, nb.soft), { marginTop: 3 }]}>{sub}</Text>}
    </View>
  );
}

/** The gold seal that a chosen card gets — the prototype's `0 0 0 2.5px #E9C45A`. */
const chosen = { borderWidth: 2.5, borderColor: '#E9C45A' } as const;

// ── the round stamps ───────────────────────────────────────────────────────

/** ADMITTED / APPROVED — a double-ringed rubber stamp that lands hard.
 *
 *  It scales down from 2.4× and overshoots, which is the 쾅: a stamp that fades in reads
 *  as a label appearing. */
function BigStamp({ color, size, head, name, foot }: {
  color: string; size: number; head: string; name: string; foot: string;
}) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 380, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [t]);
  return (
    <Animated.View style={{
      width: size, height: size, borderRadius: size / 2, borderWidth: 3.5, borderColor: color,
      alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(241,235,221,.6)',
      opacity: t.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, 1, 1] }),
      transform: [
        { scale: t.interpolate({ inputRange: [0, 0.55, 0.75, 1], outputRange: [2.4, 0.92, 1.06, 1] }) },
        { rotate: t.interpolate({ inputRange: [0, 0.55, 1], outputRange: ['-24deg', '-11deg', '-12deg'] }) },
      ],
    }}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 4, top: 4, right: 4, bottom: 4, borderRadius: size / 2, borderWidth: 1.4, borderColor: color }} />
      <Text style={{ fontFamily: nbFonts.bodyBold, fontSize: size * 0.085, letterSpacing: 2, color }}>{head}</Text>
      <Text style={{ fontFamily: nbFonts.hand, fontSize: size * 0.21, color, lineHeight: size * 0.23 }}>{name}</Text>
      <Text style={{ fontFamily: nbFonts.monoBold, fontSize: size * 0.066, color, marginTop: 2 }}>{foot}</Text>
    </Animated.View>
  );
}

// ── the immigration officer ────────────────────────────────────────────────

/**
 * The officer stands up from behind the counter — body, head and cap on three different
 * springs.
 *
 * The separation is the joke: the cap is thrown highest (-84) and lands last, so it reads
 * as inertia rather than as three things moving together. Same overshoot values as the
 * prototype's keyframes.
 */
function Officer() {
  const body = useRef(new Animated.Value(0)).current;
  const head = useRef(new Animated.Value(0)).current;
  const cap = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const run = (v: Animated.Value, duration: number, delay: number) =>
      Animated.timing(v, { toValue: 1, duration, delay, easing: Easing.bezier(0.35, 0.6, 0.3, 1), useNativeDriver: true });
    Animated.parallel([run(body, 850, 150), run(head, 1000, 200), run(cap, 1250, 240)]).start();
  }, [body, head, cap]);

  const P = { stroke: nb.ink, strokeWidth: 2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  return (
    <>
      <Animated.View style={{
        position: 'absolute', left: 30, bottom: 0, width: 110, height: 120,
        transform: [{ translateY: body.interpolate({ inputRange: [0, 0.58, 0.78, 1], outputRange: [160, -13, 6, 0] }) }],
      }}>
        <Svg viewBox="0 0 110 120" width={110} height={120}>
          <Rect {...P} x="8" y="86" width="94" height="34" fill="#4A6FA5" />
          <Rect x="14" y="94" width="26" height="4" fill="#D4B46A" />
          <Path {...P} d="M30 86 Q30 62 55 62 Q80 62 80 86" fill="#213B4A" />
        </Svg>
      </Animated.View>

      <Animated.View style={{
        position: 'absolute', left: 62, bottom: 52, width: 46, height: 46,
        transform: [{ translateY: head.interpolate({ inputRange: [0, 0.52, 0.74, 0.88, 1], outputRange: [185, -30, 11, -5, 0] }) }],
      }}>
        <Svg viewBox="0 0 46 46" width={46} height={46}>
          <Circle {...P} cx="23" cy="24" r="20" fill="#F6DCC0" />
          <Circle cx="16" cy="23" r="2" fill={nb.ink} />
          <Circle cx="30" cy="23" r="2" fill={nb.ink} />
          <Path {...P} d="M17 32 H29" fill="none" />
        </Svg>
      </Animated.View>

      <Animated.View style={{
        position: 'absolute', left: 58, bottom: 88, width: 54, height: 30,
        transform: [
          { translateY: cap.interpolate({ inputRange: [0, 0.42, 0.62, 0.8, 0.91, 1], outputRange: [210, -84, -80, 10, -4, 0] }) },
          { rotate: cap.interpolate({ inputRange: [0, 0.42, 0.62, 0.8, 0.91, 1], outputRange: ['-6deg', '10deg', '6deg', '-3deg', '1deg', '0deg'] }) },
        ],
      }}>
        <Svg viewBox="0 0 54 30" width={54} height={30}>
          <Path {...P} d="M8 22 Q8 4 27 4 Q46 4 46 22 Z" fill="#213B4A" />
          <Rect {...P} x="4" y="20" width="46" height="7" rx="2.5" fill="#213B4A" />
          <Rect x="21" y="11" width="12" height="6" rx="1" fill="#D4B46A" stroke={nb.ink} strokeWidth="1.6" />
        </Svg>
      </Animated.View>
    </>
  );
}

const ASK_EN = "Welcome. How's your English for work?";

/**
 * The officer's question, typed.
 *
 * English first at 34ms a character, then the Korean at 24. The options below stay
 * dimmed and untappable until both have finished — the point of the beat is that
 * somebody is asking you something, and answering before the question lands would make
 * it a form again.
 */
function useTypewriter(active: boolean, native: string) {
  const [en, setEn] = useState(0);
  const [ko, setKo] = useState(0);
  // The native-language line is passed IN, from a useT() caller. Reading the catalog
  // through the module-level translate helper here would resolve once per component
  // instance and never again — the React Compiler memoises it, so switching language
  // would leave the officer asking in the old one (i18n/useT.test.ts enforces this, and
  // its scan does not strip comments, so this note avoids naming the call).
  const ASK_KO = native;
  useEffect(() => {
    if (!active) return;
    let i = 0, j = 0;
    let inner: ReturnType<typeof setTimeout> | undefined;
    const start = setTimeout(function tick() {
      if (i < ASK_EN.length) { setEn(++i); inner = setTimeout(tick, 34); return; }
      if (j < ASK_KO.length) { setKo(++j); inner = setTimeout(tick, 24); }
    }, 1300);
    return () => { clearTimeout(start); if (inner) clearTimeout(inner); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  return { en, ko, native: ASK_KO, done: ko >= ASK_KO.length };
}

// ── the walking figure ─────────────────────────────────────────────────────

/** The first-day walk: legs crossing, a bob, and the hospital at the end of the road. */
function Commuter() {
  const x = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  useEffect(() => {
    Animated.timing(x, { toValue: 1, duration: 2500, easing: Easing.bezier(0.3, 0.1, 0.7, 0.9), useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 300, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    ).start();
  }, [x, bob]);
  const leg = bob.interpolate({ inputRange: [0, 1], outputRange: ['-24deg', '24deg'] });
  const legB = bob.interpolate({ inputRange: [0, 1], outputRange: ['24deg', '-24deg'] });
  const P = { stroke: nb.ink, strokeWidth: 2, strokeLinejoin: 'round' as const };
  return (
    <Animated.View style={{
      position: 'absolute', top: 262, left: 0,
      transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [-70, width * 0.65] }) }],
    }}>
      <Animated.View style={{
        transform: [
          { translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -7] }) },
          { rotate: bob.interpolate({ inputRange: [0, 1], outputRange: ['-2deg', '2deg'] }) },
        ],
      }}>
        <Svg viewBox="0 0 60 90" width={62} height={93}>
          <Circle {...P} cx="30" cy="16" r="12" fill="#F6DCC0" />
          <Path {...P} d="M20 12 Q20 4 30 4 Q40 4 40 12 L40 14 Q30 10 20 14 Z" fill="#8A6A4A" />
          <Circle cx="34" cy="15" r="1.5" fill={nb.ink} />
          <Path {...P} d="M18 30 Q30 24 42 30 L40 56 H20 Z" fill="#B8CBB0" />
          <Path d="M40 34 L50 44" stroke={nb.ink} strokeWidth="2.4" strokeLinecap="round" />
          <Rect x="46" y="42" width="13" height="10" rx="1.5" fill={nb.red} stroke={nb.ink} strokeWidth="1.8" transform="rotate(6 52 47)" />
        </Svg>
        {/* The legs swing on their own timing, so they are separate views over the body. */}
        <Animated.View style={{ position: 'absolute', left: 26, top: 56, transform: [{ rotate: leg }] }}>
          <Svg viewBox="0 0 24 24" width={24} height={24}>
            <Path d="M0 0 L-4 20 L-8 20" fill="none" stroke={nb.ink} strokeWidth="2.6" strokeLinecap="round" />
          </Svg>
        </Animated.View>
        <Animated.View style={{ position: 'absolute', left: 34, top: 56, transform: [{ rotate: legB }] }}>
          <Svg viewBox="0 0 24 24" width={24} height={24}>
            <Path d="M0 0 L4 20 L8 20" fill="none" stroke={nb.ink} strokeWidth="2.6" strokeLinecap="round" />
          </Svg>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
}

/** Clouds sliding past, on a loop. Used by both flights. */
function Clouds() {
  const x = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  useEffect(() => {
    Animated.loop(Animated.timing(x, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true })).start();
  }, [x]);
  return (
    <Animated.View style={{
      position: 'absolute', top: 150, left: 0, flexDirection: 'row', gap: 90,
      transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, -(width + 30)] }) }],
    }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={{ width: 92, height: 30, backgroundColor: '#fff', borderRadius: 99, opacity: 0.85, marginTop: (i % 3) * 60 }} />
      ))}
    </Animated.View>
  );
}

/** The plane crossing the page along the dotted route. */
function FlyingPlane({ mirrored }: { mirrored?: boolean }) {
  const t = useRef(new Animated.Value(0)).current;
  const { width } = useWindowDimensions();
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: 2300, easing: Easing.in(Easing.ease), useNativeDriver: true }).start();
  }, [t]);
  const sign = mirrored ? -1 : 1;
  return (
    <Animated.View style={{
      position: 'absolute', top: 330, left: mirrored ? undefined : 30, right: mirrored ? 30 : undefined,
      transform: [
        { translateX: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [-40 * sign, 150 * sign, (width * 0.9) * sign] }) },
        { translateY: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [110, 30, -60] }) },
        { rotate: t.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['8deg', '-4deg', '-10deg'] }) },
        { scaleX: sign },
      ],
    }}>
      <NbIcon name="plane" size={54} />
    </Animated.View>
  );
}

// ── the screen ─────────────────────────────────────────────────────────────

export default function PassportRoute() {
  const t = useT();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const authed = useAuthStore((st) => !!st.accessToken);

  const [step, setStep] = useState<Step>('cover');
  /** The page being turned away, if any — drawn over the new one until the turn ends. */
  const [turning, setTurning] = useState<Step | null>(null);
  /** The page coming BACK over the top (‹, and the passport closing). */
  const [returning, setReturning] = useState<Step | null>(null);
  // Pre-answered from whatever the app is already showing — which is the device's
  // language on a first launch. `touchedLang` is only for the "matched to your device"
  // note: once they have chosen, saying it would be wrong.
  const [lang, setLang] = useState<Locale>(getLocale());
  const [touchedLang, setTouchedLang] = useState(localeWasChosen());
  const [job, setJob] = useState<string | null>(null);
  const [dest, setDest] = useState<string | null>(null);
  const [lvl, setLvl] = useState<string | null>(null);
  const [stamping, setStamping] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  // A returning learner resumes at the page they had not answered — the whole reason the
  // draft exists. The cover is skipped for them: they have opened this passport before.
  useEffect(() => {
    let alive = true;
    void loadDraft().then((d) => {
      if (!alive) return;
      if (d.job) setJob(d.job);
      if (d.destination) setDest(d.destination);
      if (d.targetLevel) setLvl(LEVELS.find((l) => l.cefr === d.targetLevel)?.id ?? null);
      if (d.job || d.destination) setStep(passportStep(d) === 'level' ? 'immigration' : passportStep(d) === 'dest' ? 'dest' : 'job');
    });
    return () => { alive = false; };
  }, []);

  const D = useMemo(() => DESTS.find((x) => x.id === dest) ?? DESTS[0], [dest]);

  /** Forward: the current page turns away and the next one is underneath. */
  const go = useCallback((next: Step) => {
    setTurning(step);
    setStep(next);
  }, [step]);

  /** Backward: the previous page comes back over the top. */
  const goBack = useCallback((prev: Step) => {
    if (returning) return;
    setReturning(prev);
  }, [returning]);

  // The unattended stops. Each one is a beat with a fixed length; the numbers are the
  // pacing of the journey and live in HOLD so they can be read at once.
  useEffect(() => {
    const h = HOLD[step];
    if (!h) return;
    const timer = setTimeout(() => setStep(h.next), h.ms);
    return () => clearTimeout(timer);
  }, [step]);

  const pickLang = (code: Locale) => {
    setLang(code);
    setTouchedLang(true);
    // Applied immediately, not at the end: the rest of the journey is written in it, and
    // a language that only takes effect after onboarding would have the learner answering
    // three questions in a language they just rejected.
    void setLocale(code);
    void saveDraft({ nativeLang: code });
  };
  const pickJob = (code: string) => { setJob(code); void saveDraft({ job: code }); };
  const pickDest = (id: string) => {
    setDest(id);
    // targetLang travels with the destination, as it did on the old locale page: every
    // open destination is English-speaking, and the profile needs both.
    void saveDraft({ destination: id, targetLang: 'en' });
  };
  const pickLvl = (id: string) => {
    setLvl(id);
    void saveDraft({ targetLevel: LEVELS.find((l) => l.id === id)?.cefr });
  };

  /** 출국하기 — the stamp lands, then the passport closes. */
  const depart = () => {
    if (!dest || stamping) return;
    setStamping(true);
    setTimeout(() => { setStamping(false); setStep('closing'); }, 1150);
  };

  /**
   * The end of the journey: save the three answers and enter the app.
   *
   * Same contract as the wizard's last screen — PATCH /me/profile marks the user
   * onboarded, so it is one write at the end rather than one per page. The draft covers a
   * relaunch mid-journey; nativeLang comes from the device, since this flow has no page
   * for it.
   */
  const arrive = async () => {
    if (saving) return;
    setSaving(true);
    setFailed(false);
    try {
      const d = await loadDraft();
      await api.updateProfile({
        job: job || d.job || 'nurse',
        nativeLang: lang || d.nativeLang || getLocale(),
        targetLang: d.targetLang || 'en',
        destination: dest || d.destination || 'us',
        targetLevel: LEVELS.find((l) => l.id === lvl)?.cefr || d.targetLevel || 'B1',
      });
      await syncOnboarded();
      await clearDraft();
      setStep('commute');
    } catch {
      // The journey stays where it is. A learner who has just been admitted must not be
      // dropped back at the cover because a request failed.
      setFailed(true);
      setSaving(false);
    }
  };

  // The walk is the last beat: it plays while the app is already saved, then hands over.
  useEffect(() => {
    if (step !== 'commute') return;
    const timer = setTimeout(() => router.replace('/(tabs)'), 3100);
    return () => clearTimeout(timer);
  }, [step, router]);

  // ── pages ───────────────────────────────────────────────────────────────

  const cover = (
    <Page bg={GREEN}>
      <View style={{ position: 'absolute', top: 54, left: 26, right: 26, bottom: 40, borderWidth: 1.6, borderColor: 'rgba(212,180,106,.85)', paddingTop: 30, paddingHorizontal: 18, paddingBottom: 16, alignItems: 'center' }}>
        <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 10, letterSpacing: 4, color: GOLD }}>PASSPORT</Text>
        <Text style={{ fontFamily: nbFonts.hand, fontSize: 15, color: GOLD_SOFT, marginTop: 3 }}>forin</Text>
        <View style={{ width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: GOLD, alignItems: 'center', justifyContent: 'center', marginTop: 26 }}>
          <View pointerEvents="none" style={{ position: 'absolute', left: 5, top: 5, right: 5, bottom: 5, borderRadius: 43, borderWidth: 1.2, borderColor: 'rgba(212,180,106,.6)' }} />
          <Text style={{ fontFamily: nbFonts.hand, fontSize: 56, color: GOLD, lineHeight: 62, marginTop: -6 }}>f</Text>
        </View>
        <Text style={{ fontFamily: nbFonts.hand, fontSize: 34, color: CREAM_TEXT, marginTop: 26, lineHeight: 41, textAlign: 'center' }}>{t('onb.cover.title')}</Text>
        <Text style={{ fontFamily: nbFonts.hand, fontSize: 14.5, color: 'rgba(243,230,200,.65)', marginTop: 9 }}>{t('onb.cover.sub')}</Text>
        <View style={{ flex: 1 }} />
        <NbButton variant="yellow" size="lg" full iconRight="chevronRight" onPress={() => go('lang')}>{t('onb.cover.open')}</NbButton>
        {/* Only for someone who arrived here without a session — inside the normal flow
            login already happened, and offering it again reads as a dead end. */}
        {!authed && (
          <Pressable onPress={() => router.replace('/login')} hitSlop={8} style={{ marginTop: 12 }}>
            <Text style={{ fontFamily: nbFonts.hand, fontSize: 13.5, color: 'rgba(243,230,200,.6)' }}>
              {t('onb.cover.haveAccount')}<Text style={{ color: CREAM_TEXT, textDecorationLine: 'underline' }}>{t('onb.cover.login')}</Text>
            </Text>
          </Pressable>
        )}
      </View>
      {/* The machine-readable zone: the one printed thing on a handwritten cover. */}
      <View pointerEvents="none" style={{ position: 'absolute', left: 30, right: 30, bottom: 52 }}>
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.mono, fontSize: 9, color: 'rgba(212,180,106,.55)', letterSpacing: 1 }}>P&lt;KORFORIN&lt;&lt;LEARNER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</Text>
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.mono, fontSize: 9, color: 'rgba(212,180,106,.55)', letterSpacing: 1, marginTop: 2 }}>M2026090&lt;1KOR9508123M3009015&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</Text>
      </View>
    </Page>
  );

  /**
   * Which language the app speaks.
   *
   * FIRST, before the job: everything after this page is written in the answer, and asking
   * in one language then switching mid-journey reads as the app changing its mind. It
   * arrives pre-answered — the app already opens in the device's language (i18n/store:
   * stored choice → device → ko) — so this page is a confirmation, not a blank.
   *
   * Built like the destination page, minus the stamp: a stamp means a border was crossed,
   * and choosing a language is not that.
   */
  const langPage = (
    <Page>
      <Gutter />
      <BackChip onPress={() => goBack('cover')} />
      <Header title={t('onb.lang.title')} sub={t('onb.lang.sub')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 13, paddingTop: 16, paddingLeft: 34, paddingRight: 24 }}>
        {LOCALES.map((code, i) => {
          const meta = LOCALE_META[code];
          const on = lang === code;
          return (
            <Pressable key={code} onPress={() => pickLang(code)} style={{ width: (width - 58 - 13) / 2 }}>
              <NbPaper rot={i % 2 ? 0.5 : -0.45} style={[
                { paddingTop: 14, paddingBottom: 11, paddingHorizontal: 6, alignItems: 'center', opacity: on ? 1 : 0.7 },
                on ? chosen : null,
              ]}>
                <Text style={[nbText.hand(19), { lineHeight: 22 }]}>{meta.name}</Text>
                <Text numberOfLines={1} style={[nbText.body(9.5, nb.soft), { marginTop: 2 }]}>{meta.sub}</Text>
                {/* Said only on the one the device chose, and only until the learner
                    picks: it explains why this card came pre-selected. */}
                {on && !touchedLang && (
                  <View style={{ marginTop: 5 }}><NbTag color={nb.blue} rot={-1.5}>{t('onb.lang.detected')}</NbTag></View>
                )}
              </NbPaper>
            </Pressable>
          );
        })}
      </View>
      <View style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
        <Dots at={1} />
        <View style={{ marginTop: 13 }}>
          <NbButton variant="ink" size="lg" full iconRight="chevronRight" onPress={() => go('job')}>{t('onb.lang.next')}</NbButton>
        </View>
      </View>
    </Page>
  );

  const jobPage = (
    <Page>
      <Gutter />
      <BackChip onPress={() => goBack('lang')} />
      <Header title={t('onb.job.title')} sub={t('onb.job.sub')} />
      <View style={{ paddingTop: 2, paddingLeft: 34, paddingRight: 24 }}>
        {JOBS.map((j) => (
          <Pressable key={j.code} onPress={() => j.ready && pickJob(j.code)} disabled={!j.ready}>
            <NbPaper rot={j.rot} style={[
              { marginTop: 11, paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 12, opacity: j.ready ? 1 : 0.5 },
              job === j.code ? chosen : null,
            ]}>
              <NbIcon name={j.icon} size={28} />
              <View style={{ flex: 1, minWidth: 0 }}>
                {job === j.code
                  ? <NbMark textStyle={{ fontSize: 18.5 }}>{t(j.nameKey)}</NbMark>
                  : <Text style={[nbText.hand(18.5), { lineHeight: 20 }]}>{t(j.nameKey)}</Text>}
                <Text style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>{t(j.subKey)}</Text>
              </View>
              {job === j.code ? <NbCheck done /> : j.ready ? <NbCheck /> : <NbTag color={nb.soft} rot={2}>{t('onb.soon')}</NbTag>}
            </NbPaper>
          </Pressable>
        ))}
      </View>
      <View style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
        <Dots at={2} />
        <View style={{ marginTop: 13, opacity: job ? 1 : 0.45 }}>
          <NbButton variant="ink" size="lg" full iconRight="chevronRight" disabled={!job} onPress={() => go('dest')}>{t('onb.job.next')}</NbButton>
        </View>
      </View>
    </Page>
  );

  const destPage = (
    <Page>
      <Gutter />
      <BackChip onPress={() => goBack('job')} />
      <Header title={t('onb.dest.title')} sub={t('onb.dest.sub')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 13, paddingTop: 16, paddingLeft: 34, paddingRight: 24 }}>
        {DESTS.map((d) => {
          const open = isDestinationReady(d.id);
          const on = dest === d.id;
          return (
            <Pressable key={d.id} onPress={() => open && pickDest(d.id)} disabled={!open} style={{ width: (width - 58 - 13) / 2 }}>
              <NbPaper rot={d.rot} style={[
                { paddingTop: 14, paddingBottom: 11, paddingHorizontal: 6, alignItems: 'center', opacity: open ? (dest && !on ? 0.7 : 1) : 0.5 },
                on ? chosen : null,
              ]}>
                <Text style={{ fontSize: 25 }}>{d.flag}</Text>
                <Text style={[nbText.hand(17), { marginTop: 3 }]}>{t(d.nameKey)}</Text>
                <Text numberOfLines={1} style={[nbText.body(9.5, nb.soft), { marginTop: 2 }]}>{d.sub}</Text>
                {/* A country with no authored curriculum must not be selectable: onboarding
                    would end by posting the learner to a hospital that does not exist. */}
                {!open && <View style={{ marginTop: 5 }}><NbTag color={nb.soft} rot={2}>{t('onb.soon')}</NbTag></View>}
              </NbPaper>
            </Pressable>
          );
        })}
      </View>
      <View style={{ paddingTop: 14, paddingLeft: 34, paddingRight: 24, height: 150, alignItems: 'center', justifyContent: 'center' }}>
        {stamping && (
          <View style={{ alignItems: 'center' }}>
            <BigStamp color={nb.blue} size={108} head="ADMITTED" name={t(D.nameKey)} foot={`SEP 01 2026 · ${D.stampCode}`} />
            <Text style={[nbText.hand(12.5, nb.soft), { marginTop: 7 }]}>{t('onb.dest.stamped')}</Text>
          </View>
        )}
      </View>
      <View style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
        <Dots at={3} />
        <View style={{ marginTop: 13, opacity: dest ? 1 : 0.45 }}>
          <NbButton variant="ink" size="lg" full iconRight="plane" disabled={!dest} onPress={depart}>{t('onb.dest.depart')}</NbButton>
        </View>
      </View>
    </Page>
  );

  const backCover = (
    <Page bg={GREEN}>
      <View style={{ position: 'absolute', top: 26, left: 22, right: 22, bottom: 26, borderWidth: 1.6, borderColor: 'rgba(212,180,106,.85)', alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, borderWidth: 2, borderColor: GOLD, alignItems: 'center', justifyContent: 'center' }}>
          <NbIcon name="plane" size={40} color={GOLD} />
        </View>
        <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 11, letterSpacing: 4, color: GOLD, marginTop: 20 }}>BON VOYAGE</Text>
        <Text style={{ fontFamily: nbFonts.hand, fontSize: 19, color: 'rgba(243,230,200,.75)', marginTop: 6 }}>{t('onb.close.bon')}</Text>
      </View>
    </Page>
  );

  const flight = (mirrored: boolean) => (
    <Page bg="#CFE3EE">
      <Gutter />
      <Clouds />
      <View style={{ position: 'absolute', top: 210, left: 0, right: 0, height: 300 }}>
        <Svg width="100%" height={300} viewBox="0 0 402 300">
          <Path
            d={mirrored ? 'M422 250 Q242 190 -18 60' : 'M-20 250 Q160 190 420 60'}
            fill="none" stroke="rgba(62,54,43,.4)" strokeWidth="2" strokeDasharray="7 8"
          />
        </Svg>
      </View>
      <FlyingPlane mirrored={mirrored} />
      <View style={{ position: 'absolute', left: 34, right: 24, top: height * 0.64, alignItems: 'center' }}>
        <Text style={nbText.hand(25)}>{mirrored ? t('onb.flight.home') : t('onb.flight.to', { dest: t(D.nameKey) })}</Text>
        {/* A route reads as an en dash on a boarding pass — ICN–JFK. An arrow here would
            be a typographic stand-in for a drawn one, which theme/glyphs.test.ts ratchets
            down; the airline convention is better copy anyway. */}
        <Text style={[nbText.mono(10.5, nb.soft), { marginTop: 7, fontFamily: nbFonts.monoBold }]}>
          {mirrored ? `${D.apt}\u2013ICN · FORIN AIR 027` : `ICN\u2013${D.apt} · FORIN AIR 026`}
        </Text>
        <View style={{ marginTop: 14 }}>
          <NbTag color={nb.blue} rot={-2}>{mirrored ? t('onb.flight.backTag') : t('onb.flight.tag')}</NbTag>
        </View>
      </View>
    </Page>
  );

  const immigration = <Immigration
    lvl={lvl}
    onPick={pickLvl}
    onPass={() => lvl && go('approved')}
    onBack={() => setStep('flightBack')}
  />;

  const approved = (
    <Page>
      <Gutter />
      <View style={{ paddingTop: 30, paddingLeft: 34, paddingRight: 24, alignItems: 'center' }}>
        <BigStamp color={nb.green} size={130} head="APPROVED" name={t('onb.appr.stamp')} foot={`${D.stampCode} · RN · SEP 01`} />
        <Text style={[nbText.hand(24), { marginTop: 22, lineHeight: 31, textAlign: 'center' }]}>{t('onb.appr.title')}</Text>
      </View>
      <View style={{ paddingTop: 18, paddingLeft: 34, paddingRight: 24 }}>
        <NbPaper rot={-0.8} tape tapeLeft={130} style={{ paddingVertical: 12, paddingHorizontal: 14, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <NbIcon name="me" size={36} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 13, color: nb.ink }}>RN · Learner</Text>
            <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>
              {t('onb.appr.card', { lang: D.stampCode.slice(0, 2), dest: t(D.nameKey) })}
            </Text>
          </View>
          <NbTag color={nb.green}>EN {LEVELS.find((l) => l.id === lvl)?.cefr ?? 'B1'}</NbTag>
        </NbPaper>
        {failed && (
          <NbMemo color={nb.red} style={{ marginTop: 14 }}>
            <Text style={nbText.hand(14)}>{t('onb.appr.failed')}</Text>
          </NbMemo>
        )}
      </View>
      <View style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
        <NbButton variant="ink" size="lg" full icon="pencil" iconColor={nb.paper} disabled={saving} onPress={() => void arrive()}>
          {saving ? t('onb.appr.saving') : t('onb.appr.start')}
        </NbButton>
      </View>
    </Page>
  );

  const commute = (
    <Page bg="#DDE7E0">
      <Gutter />
      <View style={{ position: 'absolute', right: 30, top: 236, alignItems: 'center' }}>
        <NbIcon name="hospital" size={92} />
        <Text style={[nbText.hand(13, nb.soft), { marginTop: 2 }]}>{t('onb.commute.hospital', { dest: t(D.nameKey) })}</Text>
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, top: 348, borderTopWidth: 2, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.35)' }} />
      <Commuter />
      <View style={{ position: 'absolute', left: 34, right: 24, top: height * 0.58, alignItems: 'center' }}>
        <Text style={nbText.hand(25)}>{t('onb.commute.title')}</Text>
        <Text style={[nbText.mono(10.5, nb.soft), { marginTop: 7, fontFamily: nbFonts.monoBold }]}>{`DAY 1 · ${D.stampCode} GENERAL HOSPITAL`}</Text>
        <View style={{ marginTop: 14 }}>
          <NbTag color={nb.blue} rot={-2}>{t('onb.commute.tag')}</NbTag>
        </View>
      </View>
    </Page>
  );

  const PAGES: Record<Step, React.ReactNode> = {
    cover, lang: langPage, job: jobPage, dest: destPage, closing: destPage, flight: flight(false),
    immigration, approved, commute, flightBack: flight(true),
  };

  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }}>
      <Stack.Screen options={{ headerShown: false }} />
      {PAGES[step]}

      {/* The passport closing: the back cover comes over the destination page. */}
      {step === 'closing' && <PageCurl dir="in">{backCover}</PageCurl>}

      {/* ‹ — the previous page comes back over the top. */}
      {returning && (
        <PageCurl dir="in" onDone={() => { setStep(returning); setReturning(null); }}>
          {PAGES[returning]}
        </PageCurl>
      )}

      {/* Forward — the page just left curls away, with its shadow crossing the new one. */}
      {turning && (
        <>
          <CurlSweep />
          <PageCurl dir="out" onDone={() => setTurning(null)}>{PAGES[turning]}</PageCurl>
        </>
      )}
    </View>
  );
}

/**
 * The immigration desk.
 *
 * Its own component because the typewriter owns state, and a hook inside the parent would
 * restart the question every time any other answer changed.
 */
function Immigration({ lvl, onPick, onPass, onBack }: {
  lvl: string | null;
  onPick: (id: string) => void;
  onPass: () => void;
  onBack: () => void;
}) {
  const t = useT();
  const { en, ko, native, done } = useTypewriter(true, t('onb.imm.ask'));
  return (
    <Page>
      <Gutter />
      <View style={{ height: 250, backgroundColor: '#CFE3EE', borderBottomWidth: 1.5, borderBottomColor: '#C4D5DF', overflow: 'hidden' }}>
        <Text style={{ position: 'absolute', left: 34, top: 14, fontFamily: nbFonts.monoBold, fontSize: 9.5, letterSpacing: 2.5, color: nb.blue }}>
          {t('onb.imm.label')}
        </Text>
        <Pressable onPress={onBack} hitSlop={10} style={{ position: 'absolute', right: 16, top: 10, zIndex: 6, width: 32, height: 32, backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-1deg' }] }}>
          <NbIcon name="chevronLeft" size={16} />
        </Pressable>
        <Officer />
        {en > 0 && (
          <View style={{ position: 'absolute', right: 16, bottom: 66, width: 210, backgroundColor: nb.paper, borderWidth: 1, borderColor: nb.paperEdge, paddingVertical: 10, paddingHorizontal: 12, transform: [{ rotate: '0.4deg' }] }}>
            <Text style={[nbText.body(13), { minHeight: 38 }]}>{ASK_EN.slice(0, en)}</Text>
            {ko > 0 && <Text style={[nbText.hand(13, nb.soft), { marginTop: 3 }]}>{native.slice(0, ko)}</Text>}
          </View>
        )}
      </View>

      {/* Dimmed and untappable until the question has finished landing: the beat is that
          somebody is asking you something, and answering early makes it a form again. */}
      <View pointerEvents={done ? 'auto' : 'none'} style={{ paddingTop: 14, paddingLeft: 34, paddingRight: 24, opacity: done ? 1 : 0.35 }}>
        {LEVELS.map((l) => (
          <Pressable key={l.id} onPress={() => onPick(l.id)}>
            <NbPaper rot={l.rot} style={[
              { marginTop: 9, paddingVertical: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 10, opacity: lvl && lvl !== l.id ? 0.75 : 1 },
              lvl === l.id ? chosen : null,
            ]}>
              <View style={{ flex: 1, minWidth: 0 }}>
                {lvl === l.id
                  ? <NbMark textStyle={{ fontSize: 16.5 }}>{t(l.titleKey)}</NbMark>
                  : <Text style={[nbText.hand(16.5), { lineHeight: 19 }]}>{t(l.titleKey)}</Text>}
                <Text style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>{t(l.subKey)}</Text>
              </View>
              <NbCheck done={lvl === l.id} />
            </NbPaper>
          </Pressable>
        ))}
        {!!lvl && (
          <NbMemo color={nb.green} rot={0.3} style={{ marginTop: 13 }}>
            <Text style={nbText.hand(14)}>
              <Text style={{ color: nb.green }}>{t('onb.imm.officer')}</Text>
              &quot;Good. Enjoy your stay — and your shift.&quot;
            </Text>
          </NbMemo>
        )}
      </View>

      <View style={{ position: 'absolute', left: 34, right: 24, bottom: 34 }}>
        <Dots at={4} />
        <View style={{ marginTop: 13, opacity: lvl ? 1 : 0.45 }}>
          <NbButton variant="ink" size="lg" full iconRight="chevronRight" disabled={!lvl} onPress={onPass}>{t('onb.imm.pass')}</NbButton>
        </View>
      </View>
    </Page>
  );
}
