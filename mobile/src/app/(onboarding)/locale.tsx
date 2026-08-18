// Onboarding 1/4 — language & destination (handoff ScreenLocale). Pick the app's
// native language and the destination country (→ target language), then carry the
// selection forward to the job step. Answers are also written to a local draft
// so closing the app mid-wizard doesn't throw the earlier steps away.
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { FLAGS } from '@/components/onboardingArt';
import { loadDraft, saveDraft } from '@/lib/onboardingDraft';
import { colors, fonts, fs } from '@/theme/tokens';

const C = colors.ink;
const NATIVE = [
  { code: 'ko', flag: 'kr', name: '한국어', sub: 'Korean' },
  { code: 'ja', flag: 'jp', name: '日本語', sub: 'Japanese' },
  { code: 'en', flag: 'us', name: 'English', sub: 'US' },
  { code: 'de', flag: 'de', name: 'Deutsch', sub: 'Germany' },
];
const DEST = [
  { code: 'us', targetLang: 'en', flag: 'us', name: '미국', sub: 'English-US' },
  { code: 'de', targetLang: 'de', flag: 'de', name: '독일', sub: 'Deutsch' },
];

export default function Locale() {
  const router = useRouter();
  const [native, setNative] = useState('ko');
  const [dest, setDest] = useState('us');

  // Come back to a half-finished wizard and your earlier answers are still here.
  useEffect(() => {
    loadDraft().then((d) => {
      if (d.nativeLang) setNative(d.nativeLang);
      if (d.destination) setDest(d.destination);
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
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(21), color: C, lineHeight: 30 }}>어디서 오셨나요?</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: colors.textSoft, marginTop: 6, marginBottom: 20 }}>앱이 사용할 모국어를 골라주세요.</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {NATIVE.map((o) => <LocaleCard key={o.code} {...o} selected={native === o.code} onPress={() => setNative(o.code)} />)}
        </View>

        <Text style={{ fontFamily: fonts.heading, fontSize: fs(16), color: C, marginTop: 28, marginBottom: 12 }}>⇨ 어디로 가시나요?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {DEST.map((o) => <LocaleCard key={o.code} {...o} selected={dest === o.code} onPress={() => setDest(o.code)} />)}
        </View>

        <View style={{ marginTop: 30 }}>
          <PixelButton label="다음" icon="play" bg={colors.yellow} shadowColor={colors.yellowShadow} full onPress={next} />
        </View>
      </ScrollView>
    </View>
  );
}

function LocaleCard({ flag, name, sub, selected, onPress }: { flag: string; name: string; sub: string; selected: boolean; onPress: () => void }) {
  const Flag = FLAGS[flag];
  return (
    <Shadowed offset={selected ? 4 : 3} shadowColor={selected ? colors.mintShadow : C + '33'} style={{ width: '45%', flexGrow: 1 }}>
      <Pressable onPress={onPress} style={{ backgroundColor: selected ? colors.mint : '#fff', borderWidth: 3, borderColor: C, paddingVertical: 14, paddingHorizontal: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          {Flag ? <Flag size={38} /> : null}
          {selected && (
            <View style={{ marginLeft: 'auto', width: 20, height: 20, backgroundColor: colors.yellow, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(12), color: C }}>✓</Text>
            </View>
          )}
        </View>
        <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C }}>{name}</Text>
        <Text style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 4 }}>{sub}</Text>
      </Pressable>
    </Shadowed>
  );
}

export function OnbTopBar({ title, step, onBack }: { title: string; step: string; onBack: () => void }) {
  return (
    <View style={{ paddingTop: 52, paddingHorizontal: 18, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Pressable onPress={onBack} hitSlop={10}><Text style={{ fontFamily: fonts.heading, fontSize: fs(20), color: C }}>‹</Text></Pressable>
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
