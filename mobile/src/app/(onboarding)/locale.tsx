// Onboarding 1/4 — language & destination (handoff ScreenLocale). Pick the app's
// native language and the destination country (→ target language), then carry the
// selection forward to the job step. Answers are also written to a local draft
// so closing the app mid-wizard doesn't throw the earlier steps away.
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { PixelIcon } from '@/components/PixelIcon';
import { PressCard } from '@/components/PressCard';
import { FLAGS } from '@/components/onboardingArt';
import { loadDraft, saveDraft } from '@/lib/onboardingDraft';
import { colors, fonts, fs } from '@/theme/tokens';
import { LOCALES, LOCALE_META, completenessLabel, t, useLocale } from '@/i18n';
import { isDestinationReady } from '@/data/destinations';

const C = colors.ink;
// A language is named in its own language — that is how someone finds their own
// row — so these come straight from LOCALE_META and are never translated.
const NATIVE = LOCALES.map((code) => ({ code, ...LOCALE_META[code] }));

// Countries ARE translated (미국 / United States / アメリカ), so they carry keys.
const DEST = [
  { code: 'us', targetLang: 'en', flag: 'us', nameKey: 'country.us', sub: 'English-US' },
  { code: 'de', targetLang: 'de', flag: 'de', nameKey: 'country.de', sub: 'Deutsch' },
];

export default function Locale() {
  const router = useRouter();
  const [native, setNative] = useState('ko');
  const [dest, setDest] = useState('us');

  // Come back to a half-finished wizard and your earlier answers are still here.
  useEffect(() => {
    loadDraft().then((d) => {
      if (d.nativeLang) setNative(d.nativeLang);
      // A draft can hold a destination that has since been withdrawn (or was saved
      // before this check existed). Fall back rather than carrying a choice the app
      // cannot honour into the rest of the wizard.
      if (d.destination && isDestinationReady(d.destination)) setDest(d.destination);
    });
  }, []);

  const next = async () => {
    const targetLang = DEST.find((d) => d.code === dest)?.targetLang || 'en';
    await saveDraft({ nativeLang: native, destination: dest, targetLang });
    router.push({ pathname: '/job', params: { nativeLang: native, destination: dest, targetLang } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack.Screen options={{ headerShown: false }} />
      <OnbTopBar title="LANGUAGE" step="1/4" onBack={() => router.replace('/login')} />
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(21), color: C, lineHeight: 30 }}>{t('onboarding.whereFrom')}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, marginTop: 6, marginBottom: 20 }}>{t('onboarding.pickNative')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {NATIVE.map((o) => {
            // The same computed figure the settings picker shows. A language whose UI
            // is only half translated is offered, but it says so — the alternative is
            // a wizard that promises Japanese and then renders Korean.
            const done = completenessLabel(o.code);
            return (
              <LocaleCard
                key={o.code} flag={o.flag} name={o.name} sub={o.sub}
                note={done.full ? undefined : done.text}
                selected={native === o.code} onPress={() => setNative(o.code)}
              />
            );
          })}
        </View>

        <Text style={{ fontFamily: fonts.heading, fontSize: fs(16), color: C, marginTop: 28, marginBottom: 12 }}>{t('onboarding.pickDest')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {DEST.map((o) => {
            // A destination is offered for real only when its authored learning
            // phrases exist in that language (server: content.ReadyTargetLangs). The
            // AI would hold a German consultation happily, but every example sentence
            // is authored in English, and the phrases are the part being taught.
            const ready = isDestinationReady(o.code);
            return (
              <LocaleCard
                key={o.code} flag={o.flag} name={t(o.nameKey)} sub={o.sub}
                note={ready ? undefined : t('onboarding.destNotReady')}
                disabled={!ready}
                selected={dest === o.code} onPress={() => setDest(o.code)}
              />
            );
          })}
        </View>

        <View style={{ marginTop: 30 }}>
          <PixelButton label={t('common.next')} icon="play" bg={colors.yellow} shadowColor={colors.yellowShadow} full onPress={next} />
        </View>
      </ScrollView>
    </View>
  );
}

function LocaleCard({ flag, name, sub, note, disabled, selected, onPress }: {
  flag: string; name: string; sub: string; note?: string; disabled?: boolean;
  selected: boolean; onPress: () => void;
}) {
  const Flag = FLAGS[flag];
  return (
    <PressCard
      selected={selected}
      disabled={disabled}
      onPress={onPress}
      shadowColor={selected ? colors.mintShadow : C + '33'}
      style={{ width: '45%', flexGrow: 1 }}
      contentStyle={{
        backgroundColor: selected ? colors.mint : disabled ? colors.paper : '#fff',
        borderWidth: 3,
        borderColor: disabled ? C + '55' : C,
        paddingVertical: 14,
        paddingHorizontal: 12,
        opacity: disabled ? 0.6 : 1,
      }}
    >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          {Flag ? <Flag size={38} /> : null}
          {selected && (
            <View style={{ marginLeft: 'auto', width: 20, height: 20, backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
              <PixelIcon name="check" color={C} size={12} sw={2.2} />
            </View>
          )}
        </View>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C }}>{name}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 4 }}>{sub}</Text>
        {!!note && (
          <View style={{ alignSelf: 'flex-start', marginTop: 7, backgroundColor: colors.yellow, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: C }}>{note}</Text>
          </View>
        )}
    </PressCard>
  );
}

export function OnbTopBar({ title, step, onBack }: { title: string; step: string; onBack: () => void }) {
  return (
    <View style={{ paddingTop: 52, paddingHorizontal: 18, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* An icon, not a ‹. The app replaced its glyph arrows with drawn ones so they
          share the line weight of everything else; this one was left behind. */}
      <Pressable onPress={onBack} hitSlop={10} style={{ width: 28 }}>
        <PixelIcon name="chevron-left" color={C} size={18} sw={2} />
      </Pressable>
      <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C }}>{title}</Text>
      <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, width: 28, textAlign: 'right' }}>{step}</Text>
    </View>
  );
}

export function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: object }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}
