// 코드로 동료 추가 (handoff v21 ScreenColleagueAdd).
//
// 코드를 입력해도 바로 연결되지 않는다 — 요청이 가고 상대가 수락해야 서로의 학습
// 현황이 열린다. 코드를 아는 것만으로 현황이 공개되면 코드 유출이 곧 프라이버시
// 사고가 되기 때문이다(핸드오프도 "상대가 수락하면"이라고 명시).
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Share, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbMemo, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { RULE_COLOR, RULE_H, nb, nbFonts } from '@/theme/nb';
import { api, type CodePreview, type InviteCode } from '@/api/client';
import { useT } from '@/i18n';

export default function ColleagueAddScreen() {
  const t = useT();
  const router = useRouter();
  const [mine, setMine] = useState<InviteCode | null>(null);
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState<CodePreview | null>(null);
  const [lookup, setLookup] = useState<'idle' | 'looking' | 'notfound'>('idle');
  const [sending, setSending] = useState(false);

  useEffect(() => { api.inviteCode().then(setMine).catch(() => setMine(null)); }, []);

  // Normalize the same way the server does, so what the user sees is what is sent.
  const normalize = (v: string) => v.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 6);
  const pretty = (v: string) => (v.length > 2 ? `${v.slice(0, 2)}-${v.slice(2)}` : v);

  const onChange = useCallback((v: string) => {
    const n = normalize(v);
    setInput(n);
    setPreview(null);
    setLookup('idle');
    if (n.length === 6) {
      setLookup('looking');
      api.lookupCode(pretty(n))
        .then((p) => { setPreview(p); setLookup('idle'); })
        .catch(() => setLookup('notfound'));
    }
  }, []);

  const send = async () => {
    if (!preview) return;
    setSending(true);
    try {
      const res = await api.addColleague(pretty(input));
      if (res.autoAccepted) Alert.alert(t('colleagueAdd.connected'), t('colleagueAdd.connectedBody'));
      else if (res.alreadyLinked) Alert.alert(t('colleagueAdd.already'));
      else if (res.alreadyRequested) Alert.alert(t('colleagueAdd.alreadySent'), t('colleagueAdd.waiting'));
      else Alert.alert(t('colleagueAdd.sent'), t('colleagueAdd.sentBody'));
      router.back();
    } catch {
      Alert.alert(t('colleagueAdd.failed'), t('colleagueAdd.failedBody'));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: nb.cream }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Rules />

      <View style={{ paddingTop: 52, paddingHorizontal: 20, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <NbPaper rot={-1} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="chevronLeft" size={16} />
          </NbPaper>
        </Pressable>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text numberOfLines={1} style={nbText.hand(24)}>{t('colleagueAdd.title')}</Text>
          <Text numberOfLines={1} style={[nbText.body(11, nb.soft), { marginTop: 2 }]}>{t('colleagueAdd.sub')}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        {/* My code, on a green note. The code itself is TYPED and large: it exists to be
            read out to somebody, or copied — the one string on this screen that is not
            handwriting. */}
        <NbPaper rot={-0.6} tape tapeLeft={120} bg="rgba(95,141,90,.10)" style={{ marginTop: 14, paddingVertical: 16, paddingHorizontal: 14, alignItems: 'center', borderColor: '#BFD3BB' }}>
          <Text style={nbText.body(10.5, nb.soft)}>{t('me.myCode')}</Text>
          <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 30, letterSpacing: 4, color: nb.ink, marginTop: 9, marginBottom: 4 }}>
            {mine?.code ?? '· · · ·'}
          </Text>
          {!!mine && (
            <Text numberOfLines={1} style={nbText.body(9.5, nb.soft)}>
              {t('colleagueAdd.validity', { max: mine.maxUses, used: mine.uses })}
            </Text>
          )}
          <View style={{ flexDirection: 'row', gap: 9, marginTop: 12, alignSelf: 'stretch' }}>
            <View style={{ flex: 1 }}>
              <NbButton
                variant="paper"
                full
                icon="pencil"
                disabled={!mine}
                onPress={() => { if (mine) { void Clipboard.setStringAsync(mine.code).then(() => Alert.alert(t('colleagueAdd.copied'), mine.code)); } }}
              >
                {t('colleagueAdd.copy')}
              </NbButton>
            </View>
            <View style={{ flex: 1 }}>
              <NbButton
                variant="ink"
                full
                icon="handshake2"
                iconColor={nb.paper}
                disabled={!mine}
                onPress={() => { if (mine) void Share.share({ message: t('colleagueAdd.shareBody', { code: mine.code }) }); }}
              >
                {t('colleagueAdd.share')}
              </NbButton>
            </View>
          </View>
        </NbPaper>

        {/* 또는 — a dotted rule, because this is a fold in the page rather than a divider
            between two features. */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 16, marginBottom: 13 }}>
          <View style={{ flex: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.25)' }} />
          <Text style={nbText.hand(14, nb.soft)}>{t('colleagueAdd.or')}</Text>
          <View style={{ flex: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.25)' }} />
        </View>

        {/* A code somebody gave you, written in. The field is a ruled line that turns
            yellow while it is being filled — the notebook's own "you are writing here". */}
        <Text style={nbText.hand(16)}>{t('colleagueAdd.enterCode')}</Text>
        <View style={{
          marginTop: 8, marginBottom: 11, paddingBottom: 2,
          borderBottomWidth: 2,
          borderBottomColor: input ? '#C99A1E' : 'rgba(62,54,43,.35)',
          backgroundColor: input ? 'rgba(249,227,123,.35)' : 'transparent',
        }}>
          <TextInput
            value={pretty(input)}
            onChangeText={onChange}
            autoCapitalize="characters"
            autoCorrect={false}
            placeholder="XX-XXXX"
            placeholderTextColor={nb.placeholder}
            style={{
              paddingVertical: 10, textAlign: 'center',
              fontFamily: nbFonts.monoBold, fontSize: 22, letterSpacing: 3, color: nb.ink,
            }}
          />
        </View>

        {lookup === 'looking' && (
          <View style={{ paddingVertical: 12, alignItems: 'center' }}><ActivityIndicator color={nb.ink} /></View>
        )}
        {lookup === 'notfound' && (
          <Text style={[nbText.hand(15, nb.soft), { textAlign: 'center', paddingVertical: 12 }]}>
            {t('colleagueAdd.notFound')}
          </Text>
        )}
        {!!preview && (
          <NbPaper rot={0.5} style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 12 }}>
            <NbPaper rot={-1.5} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <NbIcon name="me" size={22} />
            </NbPaper>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={nbText.hand(17)}>{preview.name}</Text>
              <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 2 }]}>
                {[preview.targetLevel, preview.destination?.toUpperCase(), preview.streak ? t('colleague.streakDays', { n: preview.streak }) : null]
                  .filter(Boolean).join(' · ')}
              </Text>
            </View>
            <NbTag color={nb.green}>{t('colleagueAdd.found')}</NbTag>
          </NbPaper>
        )}

        {/* Disabled until a real person has been found. A live button with nobody behind
            it is a request sent into the dark. */}
        <NbButton variant="ink" size="lg" full icon="handshake2" iconColor={nb.paper} disabled={!preview || sending} onPress={send}>
          {sending ? t('colleagueAdd.sending') : t('colleagueAdd.sendRequest')}
        </NbButton>

        <NbMemo color={nb.blue} rot={-0.3} style={{ marginTop: 14 }}>
          <Text style={nbText.hand(13.5)}>{t('colleagueAdd.note')}</Text>
        </NbMemo>
      </ScrollView>
    </View>
  );
}

/** The notebook's ruled lines. */
function Rules() {
  const { height } = useWindowDimensions();
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' }}>
      {Array.from({ length: Math.ceil(height / RULE_H) }).map((_, i) => (
        <View key={i} style={{ position: 'absolute', left: 0, right: 0, top: (i + 1) * RULE_H, height: 1, backgroundColor: RULE_COLOR }} />
      ))}
    </View>
  );
}
