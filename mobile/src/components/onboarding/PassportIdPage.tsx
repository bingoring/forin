// 여권 발급 — 신분(ID) 페이지 (핸드오프 v36 · OnbFlow2).
//
// One passport ID page whose blanks are filled in a fixed order — 사용 언어 → 직업 →
// 사진(아바타) → 이름. When a blank's turn comes, its picker ZOOMS up to the middle of the
// screen (nb2-zoom); choosing shrinks it back and the blank pops filled (nb2-fill). This
// replaces the old separate language and job pages (v36 재배치); destination, the level
// desk and the rest of the journey stay where they were.
//
// Self-contained: it owns the picker/animation state and reports each pick up to the
// passport, which owns the draft, the avatar save and the step machine.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { NbAvatar } from '@/components/nb/NbAvatar';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbCheck, NbMemo, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { TOP_INSET, nb, nbFonts } from '@/theme/nb';
import { DEFAULT_AVATAR_SPEC, randomAvatarSpec, type AvatarSpec } from '@/data/nbAvatar';
import { LOCALE_META, useT } from '@/i18n';

const GOLD = '#C9A227';

/** The six native languages a learner can speak, with the flag and the MRZ code the
 *  passport prints. `id` is the locale code stored as nativeLang. The names are endonyms —
 *  each language in its own script; Korean comes from LOCALE_META so no Hangul is written
 *  here (the src/components literal ceiling is zero). */
export const ID_LANGS = [
  { id: 'ko', flag: '🇰🇷', name: LOCALE_META.ko.name, code: 'KOR' },
  { id: 'ja', flag: '🇯🇵', name: '日本語', code: 'JPN' },
  { id: 'zh', flag: '🇨🇳', name: '中文', code: 'CHN' },
  { id: 'vi', flag: '🇻🇳', name: 'Tiếng Việt', code: 'VNM' },
  { id: 'es', flag: '🇪🇸', name: 'Español', code: 'ESP' },
  { id: 'tl', flag: '🇵🇭', name: 'Filipino', code: 'PHL' },
] as const;

/** The jobs, with only nursing ready. `code` is the profile job + the MRZ code. */
export const ID_JOBS = [
  { id: 'nurse', icon: 'stetho', nameKey: 'onb.job.nurse', code: 'RN', soon: false },
  { id: 'hotel', icon: 'bell', nameKey: 'onb.job.hotel', code: 'HTL', soon: true },
  { id: 'service', icon: 'coffee', nameKey: 'onb.job.service', code: 'SVC', soon: true },
  { id: 'engineer', icon: 'gear', nameKey: 'onb.job.engineer', code: 'ENG', soon: true },
] as const;

/** Six passport-photo presets, built from the handoff's hair/outfit combos plus the
 *  friendly default face (dot eyes, a smile). Varied skin so the row does not read as one
 *  person in six wigs. */
const AVATAR_PRESET_PARTIALS: Partial<AvatarSpec>[] = [
  { hair: 'bob', hairColor: 'darkbrown', outfit: 'scrubPocket', outfitColor: 'mint', skin: 'beige' },
  { hair: 'ponytail', hairColor: 'brown', outfit: 'scrubPocket', outfitColor: 'sky', skin: 'warm' },
  { hair: 'short', hairColor: 'black', outfit: 'scrubPocket', outfitColor: 'navy', skin: 'tan' },
  { hair: 'bun', hairColor: 'ash', outfit: 'labCoat', outfitColor: 'teal', skin: 'ivory' },
  { hair: 'curlyShort', hairColor: 'darkbrown', outfit: 'scrubPocket', outfitColor: 'lilac', skin: 'brown' },
  { hair: 'part', hairColor: 'brown', outfit: 'labCoat', outfitColor: 'burgundy', skin: 'olive' },
];
const AVATAR_PRESETS: AvatarSpec[] = AVATAR_PRESET_PARTIALS.map((p) => ({
  ...DEFAULT_AVATAR_SPEC, eyes: 'dot', mouth: 'smile', bg: 'plain', hat: 'none', acc: 'none', ...p,
}));

type Picker = 'lang' | 'job' | 'ava' | 'name' | null;

/** One ID field: mono label over the value, an underline that goes solid+ink when filled,
 *  gold+blinking-prompt when it is this blank's turn, and dashed grey when it is waiting. */
function Field({ label, filled, active, onPress, children }: {
  label: string; filled: boolean; active: boolean; onPress?: () => void; children?: React.ReactNode;
}) {
  const t = useT();
  return (
    <Pressable onPress={filled ? onPress : undefined} disabled={!filled}>
      <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 7.5, letterSpacing: 1.2, color: nb.soft }}>{label}</Text>
      <View style={{
        minHeight: 34, marginTop: 2, justifyContent: 'center',
        borderBottomWidth: 1.6, borderStyle: filled ? 'solid' : 'dashed',
        borderBottomColor: active ? GOLD : filled ? 'rgba(62,54,43,.5)' : 'rgba(62,54,43,.28)',
        backgroundColor: active ? 'rgba(233,196,90,.14)' : 'transparent',
      }}>
        {filled ? <FillPop>{children}</FillPop>
          : active ? <Blink><Text style={[nbText.hand(15, GOLD)]}>{t('onb.id.fillHere')}</Text></Blink>
            : <Text style={nbText.hand(14, 'rgba(154,143,124,.55)')}>—</Text>}
      </View>
    </Pressable>
  );
}

/** nb2-fill: the value pops in — scale 1.5 → 0.95 → 1 — the moment the blank is filled. */
function FillPop({ children }: { children?: React.ReactNode }) {
  const s = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    s.setValue(0);
    Animated.timing(s, { toValue: 1, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [s]);
  const scale = s.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1.5, 0.95, 1] });
  return <Animated.View style={{ opacity: s, transform: [{ scale }] }}>{children}</Animated.View>;
}

/** nb2-blink: the "여기를 채워요 ✎" prompt pulses so the eye lands on the active blank. */
function Blink({ children }: { children?: React.ReactNode }) {
  const o = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 0.25, duration: 120, delay: 720, easing: Easing.step0, useNativeDriver: true }),
      Animated.timing(o, { toValue: 1, duration: 120, delay: 460, easing: Easing.step0, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [o]);
  return <Animated.View style={{ opacity: o }}>{children}</Animated.View>;
}

/** The centre-zoom picker overlay: a dimmed backdrop and a card that zooms up
 *  (nb2-zoom: scale 0.18 → 1.04 → 1). Tapping the backdrop is not a dismiss — a blank must
 *  be filled, so the only way out is choosing. */
function Picker({ title, hint, children }: { title: string; hint?: string; children?: React.ReactNode }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    a.setValue(0);
    Animated.timing(a, { toValue: 1, duration: 420, easing: Easing.bezier(0.3, 0.8, 0.3, 1), useNativeDriver: true }).start();
  }, [a]);
  const scale = a.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.18, 1.04, 1] });
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 26 }}>
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(62,54,43,.28)', opacity: a }} />
      <Animated.View style={{ width: '100%', opacity: a, transform: [{ scale }] }}>
        <NbPaper rot={-0.4} style={{ paddingTop: 15, paddingHorizontal: 16, paddingBottom: 17 }}>
          <Text style={nbText.hand(20)}>{title}</Text>
          {children}
          {!!hint && <Text style={[nbText.hand(12, nb.soft), { marginTop: 10, textAlign: 'center' }]}>{hint}</Text>}
        </NbPaper>
      </Animated.View>
    </View>
  );
}

export type IdLang = (typeof ID_LANGS)[number];
export type IdJob = (typeof ID_JOBS)[number];
type Lang = IdLang;
type Job = IdJob;

export function PassportIdPage({ lang, job, ava, name, nameDone, onPickLang, onPickJob, onPickAva, onName, onNext }: {
  lang: Lang | null;
  job: Job | null;
  ava: AvatarSpec | null;
  name: string;
  nameDone: boolean;
  onPickLang: (l: Lang) => void;
  onPickJob: (j: Job) => void;
  onPickAva: (a: AvatarSpec) => void;
  /** `done` marks the name as committed (the field fills only then). */
  onName: (name: string, done: boolean) => void;
  onNext: () => void;
}) {
  const t = useT();
  const [picker, setPicker] = useState<Picker>(null);
  const [avaOpts, setAvaOpts] = useState<AvatarSpec[]>(AVATAR_PRESETS);
  const [draftName, setDraftName] = useState(name);

  const fields = [!!lang, !!job, !!ava, nameDone && !!name.trim()];
  const nextEmpty = fields.findIndex((v) => !v);
  const allDone = nextEmpty === -1;

  // Auto-open the next blank's picker after the fill animation settles — the whole flow is
  // "a blank lights up, its choices rise". The first one waits a touch longer so the page
  // is read before it takes over.
  useEffect(() => {
    if (picker || allDone) return;
    const id = setTimeout(() => setPicker((['lang', 'job', 'ava', 'name'] as const)[nextEmpty]), nextEmpty === 0 ? 900 : 620);
    return () => clearTimeout(id);
  }, [picker, nextEmpty, allDone]);

  const jobName = (j: Job | null) => (j ? t(j.nameKey) : '');
  const upperName = useMemo(() => (nameDone && name.trim() ? (name.trim().toUpperCase().replace(/[^A-Z]/g, '') || 'LEARNER') : '<<<<<<<'), [name, nameDone]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: TOP_INSET, paddingBottom: 96, paddingLeft: 36, paddingRight: 24 }} showsVerticalScrollIndicator={false}>
        {/* header */}
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 9.5, letterSpacing: 3, color: nb.soft }}>PASSPORT · forin</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 9, color: nb.soft }}>TYPE P</Text>
        </View>
        <Text style={[nbText.hand(24), { marginTop: 10, lineHeight: 30 }]}>{t('onb.id.title')}</Text>

        {/* ID card */}
        <View style={{ marginTop: 15, borderWidth: 1.6, borderColor: 'rgba(62,54,43,.4)', backgroundColor: 'rgba(255,253,244,.6)', paddingTop: 14, paddingHorizontal: 14, paddingBottom: 12 }}>
          <Text style={{ position: 'absolute', right: 10, top: 10, fontFamily: nbFonts.monoBold, fontSize: 8, letterSpacing: 1, color: 'rgba(154,143,124,.6)' }}>NO. FR-2026-0901</Text>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {/* photo slot */}
            <Pressable onPress={() => ava && setPicker('ava')} disabled={!ava} style={{
              width: 96, height: 118, borderWidth: 1.6, borderStyle: ava ? 'solid' : 'dashed',
              borderColor: picker === null && nextEmpty === 2 ? GOLD : 'rgba(62,54,43,.4)',
              backgroundColor: ava ? '#FDFAF0' : 'rgba(62,54,43,.04)', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              {ava ? (
                <FillPop><View style={{ width: 86, height: 94, overflow: 'hidden', alignItems: 'center' }}><NbAvatar spec={ava} size={86} /></View></FillPop>
              ) : (
                <>
                  <NbIcon name="me" size={30} />
                  <Text style={{ fontFamily: nbFonts.monoBold, fontSize: 7.5, color: nb.soft, marginTop: 6, letterSpacing: 1 }}>PHOTO</Text>
                </>
              )}
            </Pressable>
            {/* fields */}
            <View style={{ flex: 1, minWidth: 0, gap: 10 }}>
              <Field label={t('onb.id.labelLang')} filled={!!lang} active={!picker && nextEmpty === 0} onPress={() => setPicker('lang')}>
                {lang && <Text numberOfLines={1} style={nbText.hand(18)}>{lang.flag} {lang.name} <Text style={{ fontFamily: nbFonts.mono, fontSize: 10, color: nb.soft }}>{lang.code}</Text></Text>}
              </Field>
              <Field label={t('onb.id.labelJob')} filled={!!job} active={!picker && nextEmpty === 1} onPress={() => setPicker('job')}>
                {job && <Text numberOfLines={1} style={nbText.hand(18)}><NbIcon name={job.icon} size={16} /> {jobName(job)} <Text style={{ fontFamily: nbFonts.mono, fontSize: 10, color: nb.soft }}>{job.code}</Text></Text>}
              </Field>
              <Field label={t('onb.id.labelName')} filled={!!(nameDone && name.trim())} active={!picker && nextEmpty === 3} onPress={() => setPicker('name')}>
                {nameDone && !!name.trim() && <Text numberOfLines={1} style={nbText.hand(20)}>{name}</Text>}
              </Field>
            </View>
          </View>
          {/* MRZ */}
          <View style={{ marginTop: 13, borderTopWidth: 1.3, borderTopColor: 'rgba(62,54,43,.25)', paddingTop: 7 }}>
            <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 9.5, letterSpacing: 1.4, color: 'rgba(62,54,43,.45)' }}>
              {`P<FRN${upperName}<<${job ? job.code : '<<<'}<<<<<<<<`}
            </Text>
            <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 9.5, letterSpacing: 1.4, color: 'rgba(62,54,43,.45)' }}>
              {`${lang ? lang.code : '<<<'}2026090<<<<<<<<<<<<<<<<<<<02`}
            </Text>
          </View>
        </View>

        {/* progress note */}
        <View style={{ marginTop: 14 }}>
          {allDone ? (
            <NbMemo color={nb.green} rot={0.3}><Text style={nbText.hand(13.5)}><Text style={{ color: nb.green }}>{t('onb.id.readyBold')}</Text> {t('onb.id.readyRest')}</Text></NbMemo>
          ) : (
            <NbMemo rot={0.3}><Text style={nbText.hand(13.5)}>{t((['onb.id.stepLang', 'onb.id.stepJob', 'onb.id.stepAva', 'onb.id.stepName'] as const)[nextEmpty])} · {fields.filter(Boolean).length}/4</Text></NbMemo>
          )}
        </View>
      </ScrollView>

      {/* next */}
      <View style={{ position: 'absolute', left: 36, right: 24, bottom: 34, opacity: allDone ? 1 : 0.45 }} pointerEvents={allDone ? 'auto' : 'none'}>
        <NbButton variant="ink" size="lg" full iconRight="chevronRight" onPress={onNext}>{t('onb.id.next')}</NbButton>
      </View>

      {/* ── pickers ── */}
      {picker === 'lang' && (
        <Picker title={t('onb.id.pickLang')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
            {ID_LANGS.map((l, i) => {
              const on = lang?.id === l.id;
              return (
                <View key={l.id} style={{ width: '50%', padding: 4.5 }}>
                  <Pressable onPress={() => { onPickLang(l); setPicker(null); }} style={{
                    borderWidth: 1.5, borderColor: on ? GOLD : 'rgba(62,54,43,.3)', backgroundColor: on ? 'rgba(233,196,90,.14)' : '#FDFAF0',
                    paddingVertical: 9, paddingHorizontal: 6, alignItems: 'center', transform: [{ rotate: i % 2 ? '0.5deg' : '-0.5deg' }],
                  }}>
                    <Text style={{ fontSize: 20 }}>{l.flag}</Text>
                    <Text numberOfLines={1} style={[nbText.hand(15.5), { marginTop: 2 }]}>{l.name}</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </Picker>
      )}
      {picker === 'job' && (
        <Picker title={t('onb.id.pickJob')}>
          <View style={{ marginTop: 6 }}>
            {ID_JOBS.map((j, i) => {
              const on = job?.id === j.id;
              return (
                <Pressable key={j.id} onPress={() => { if (!j.soon) { onPickJob(j); setPicker(null); } }} disabled={j.soon} style={{
                  flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 9, paddingVertical: 10, paddingHorizontal: 12,
                  borderWidth: 1.5, borderColor: on ? GOLD : 'rgba(62,54,43,.3)', backgroundColor: j.soon ? 'rgba(62,54,43,.04)' : '#FDFAF0',
                  opacity: j.soon ? 0.55 : 1, transform: [{ rotate: i % 2 ? '0.4deg' : '-0.4deg' }],
                }}>
                  <NbIcon name={j.icon} size={24} />
                  <Text style={[nbText.hand(17), { flex: 1, minWidth: 0 }]}>{t(j.nameKey)}</Text>
                  {j.soon ? <NbTag color={nb.soft} rot={2}>{t('onb.soon')}</NbTag> : <NbCheck done={on} />}
                </Pressable>
              );
            })}
          </View>
        </Picker>
      )}
      {picker === 'ava' && (
        <Picker title={t('onb.id.pickAva')} hint={t('onb.id.avaHint')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
            {avaOpts.map((p, i) => {
              const on = ava === p;
              return (
                <View key={i} style={{ width: '33.33%', padding: 4.5 }}>
                  <Pressable testID={`id-ava-${i}`} onPress={() => { onPickAva(p); setPicker(null); }} style={{ borderWidth: 1.5, borderColor: on ? GOLD : 'rgba(62,54,43,.3)', backgroundColor: '#FDFAF0', padding: 4, transform: [{ rotate: i % 2 ? '0.6deg' : '-0.6deg' }] }}>
                    <View style={{ width: '100%', aspectRatio: 64 / 70, overflow: 'hidden', alignItems: 'center' }}><NbAvatar spec={p} size={72} /></View>
                  </Pressable>
                </View>
              );
            })}
          </View>
          <View style={{ marginTop: 12 }}>
            <NbButton variant="paper" size="md" full icon="star" onPress={() => setAvaOpts(Array.from({ length: 6 }, () => randomAvatarSpec()))}>{t('onb.id.reshuffle')}</NbButton>
          </View>
        </Picker>
      )}
      {picker === 'name' && (
        <Picker title={t('onb.id.pickName')} hint={t('onb.id.nameHint')}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 16 }}>
            <Text style={nbText.hand(16, nb.soft)}>NAME</Text>
            <TextInput
              testID="id-name-input"
              autoFocus
              value={draftName}
              onChangeText={setDraftName}
              onSubmitEditing={() => { if (draftName.trim()) { onName(draftName.trim(), true); setPicker(null); } }}
              placeholder={t('onb.id.namePlaceholder')}
              placeholderTextColor={nb.placeholder}
              maxLength={14}
              returnKeyType="done"
              style={{ flex: 1, minWidth: 0, borderBottomWidth: 2, borderBottomColor: 'rgba(62,54,43,.5)', fontFamily: nbFonts.hand, fontSize: 24, color: nb.ink, paddingVertical: 2, paddingHorizontal: 4, textAlign: 'center' }}
            />
          </View>
          <View style={{ marginTop: 16, opacity: draftName.trim() ? 1 : 0.45 }} pointerEvents={draftName.trim() ? 'auto' : 'none'}>
            <NbButton variant="yellow" size="md" full onPress={() => { onName(draftName.trim(), true); setPicker(null); }}>{t('onb.id.nameConfirm')}</NbButton>
          </View>
        </Picker>
      )}
    </View>
  );
}
