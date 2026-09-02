// 응원 보내기 시트 (handoff v21 ScreenCheerCompose).
//
// 프리셋 4개 + 60자 한마디. 프리셋 문구는 서버가 소유하므로 여기서는 키만 보내고,
// 표시 문구는 화면 사본을 쓴다(서버 PresetText와 동일 — 어긋나면 서버가 진실).
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbPaper, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import type { CheerPreset } from '@/api/client';
import { BottomSheet } from '@/components/BottomSheet';
import { useT } from '@/i18n';

const MAX = 60;

// labelKey, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
const PRESETS: { key: CheerPreset; labelKey: string; nbIcon: NbIconName }[] = [
  { key: 'well_done', labelKey: 'cheer.doingWell', nbIcon: 'handshake2' },
  { key: 'fighting', labelKey: 'cheer.goToday', nbIcon: 'star' },
  { key: 'streak', labelKey: 'cheer.streakGreat', nbIcon: 'chartup' },
  { key: 'rest', labelKey: 'cheer.takeItEasy', nbIcon: 'coffee' },
];

export function CheerSheet({ visible, name, activity, onSend, onClose }: {
  visible: boolean;
  name: string;
  activity?: string;
  onSend: (preset: CheerPreset | undefined, message: string) => Promise<void>;
  onClose: () => void;
}) {
  const t = useT();
  const [preset, setPreset] = useState<CheerPreset | undefined>();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const close = () => { setPreset(undefined); setMessage(''); onClose(); };
  const send = async () => {
    // The server rejects an empty cheer; mirror that here so the button can't lie.
    if (!preset && !message.trim()) return;
    setSending(true);
    try {
      await onSend(preset, message.trim());
      close();
    } finally {
      setSending(false);
    }
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={close}
      // The title drags the sheet along with the grabber: the 27px strip is a target you
      // have to aim at, and this is what a hand actually reaches for.
      header={(
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 20, paddingTop: 2, paddingBottom: 12 }}>
          <NbPaper rot={-2} bg="rgba(249,227,123,.5)" style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <NbIcon name="speech" size={21} />
          </NbPaper>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={nbText.hand(19)}>{t('cheer.sendTo', { name })}</Text>
            {!!activity && (
              <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 1 }]}>{activity}</Text>
            )}
          </View>
        </View>
      )}
    >
      <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
        {/* Four ready-made notes, each on its own slip. The chosen one is highlighted
            rather than outlined: it is the note you picked up. */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginBottom: 14 }}>
          {PRESETS.map((p, i) => {
            const on = preset === p.key;
            return (
              <Pressable key={p.key} onPress={() => setPreset(on ? undefined : p.key)} style={{ width: '47.5%' }}>
                <NbPaper
                  rot={i % 2 ? 0.6 : -0.6}
                  bg={on ? 'rgba(249,227,123,.5)' : undefined}
                  style={[styles.preset, on && { borderColor: '#C99A1E', borderWidth: 2 }]}
                >
                  <NbIcon name={p.nbIcon} size={16} />
                  <Text numberOfLines={2} style={[nbText.hand(15), { flex: 1, minWidth: 0 }]}>{t(p.labelKey)}</Text>
                </NbPaper>
              </Pressable>
            );
          })}
        </View>

        {/* A ruled line to write on, not a boxed field. */}
        <View style={styles.noteLine}>
          <TextInput
            value={message}
            onChangeText={(v) => setMessage([...v].slice(0, MAX).join(''))}
            placeholder={t('cheer.notePlaceholder')}
            placeholderTextColor={nb.placeholder}
            multiline
            style={styles.noteInput}
          />
          <Text style={styles.counter}>{[...message].length} / {MAX}</Text>
        </View>

        <Pressable onPress={send} disabled={sending || (!preset && !message.trim())} style={styles.send(sending || (!preset && !message.trim()))}>
          {sending
            ? <ActivityIndicator color={nb.paper} />
            : (
              <>
                <NbIcon name="speech" size={17} color={nb.paper} />
                <Text style={nbText.hand(18, nb.paper)}>{t('cheer.send')}</Text>
              </>
            )}
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = {
  preset: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 10, paddingHorizontal: 11 } as const,
  noteLine: {
    marginBottom: 14, paddingBottom: 4,
    borderBottomWidth: 2, borderBottomColor: 'rgba(62,54,43,.35)',
  } as const,
  noteInput: { fontFamily: nbFonts.hand, fontSize: 17, color: nb.ink, lineHeight: 24, minHeight: 44, paddingTop: 4 } as const,
  counter: { textAlign: 'right', fontFamily: nbFonts.mono, fontSize: 9, color: nb.placeholder } as const,
  /** The ink button. A function because its dimming depends on whether there is anything
   *  to send — the server rejects an empty cheer, so the button must not look ready. */
  send: (off: boolean) => ({
    flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: 7,
    backgroundColor: nb.ink, borderRadius: 3, paddingVertical: 13,
    opacity: off ? 0.45 : 1,
    transform: [{ rotate: '-0.3deg' }],
  }),
};
