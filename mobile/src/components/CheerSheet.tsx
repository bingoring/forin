// 응원 보내기 시트 (handoff v21 ScreenCheerCompose).
//
// 프리셋 4개 + 60자 한마디. 프리셋 문구는 서버가 소유하므로 여기서는 키만 보내고,
// 표시 문구는 화면 사본을 쓴다(서버 PresetText와 동일 — 어긋나면 서버가 진실).
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { PixelIcon } from '@/components/PixelIcon';
import type { CheerPreset } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { BottomSheet } from '@/components/BottomSheet';
import { t, useLocale } from '@/i18n';

const C = colors.ink;
const MAX = 60;

// labelKey, not t(...): evaluated once at import (see i18n/module-scope.test.ts).
const PRESETS: { key: CheerPreset; labelKey: string }[] = [
  { key: 'well_done', labelKey: 'cheer.doingWell' },
  { key: 'fighting', labelKey: 'cheer.goToday' },
  { key: 'streak', labelKey: 'cheer.streakGreat' },
  { key: 'rest', labelKey: 'cheer.takeItEasy' },
];

export function CheerSheet({ visible, name, activity, onSend, onClose }: {
  visible: boolean;
  name: string;
  activity?: string;
  onSend: (preset: CheerPreset | undefined, message: string) => Promise<void>;
  onClose: () => void;
}) {
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
    <BottomSheet visible={visible} onClose={close}>
      <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <View style={{ width: 40, height: 40, backgroundColor: colors.cream, borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <PixelIcon name="clap" color={C} size={22} sw={1.7} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: C }}>{name}에게 응원 보내기</Text>
            {!!activity && (
              <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: fs(10), color: colors.textSoft, marginTop: 3 }}>{activity}</Text>
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 13 }}>
          {PRESETS.map((p) => {
            const on = preset === p.key;
            return (
              <Pressable
                key={p.key}
                onPress={() => setPreset(on ? undefined : p.key)}
                style={{
                  width: '47.5%', flexDirection: 'row', alignItems: 'center', gap: 7,
                  backgroundColor: on ? colors.yellow : '#fff',
                  borderWidth: 2.5, borderColor: C, paddingVertical: 9, paddingHorizontal: 10,
                }}
              >
                <PixelIcon name={p.key === 'rest' ? 'moon' : p.key === 'streak' ? 'flame' : 'clap'} color={C} size={15} sw={1.7} />
                <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: C }}>{t(p.labelKey)}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 11, marginBottom: 13 }}>
          <TextInput
            value={message}
            onChangeText={(v) => setMessage([...v].slice(0, MAX).join(''))}
            placeholder={t('cheer.notePlaceholder')}
            placeholderTextColor={colors.textFaint}
            multiline
            style={{ fontFamily: fonts.body, fontSize: fs(11), color: C, lineHeight: 17, minHeight: 40 }}
          />
          <Text style={{ textAlign: 'right', fontFamily: fonts.heading, fontSize: fs(9), color: colors.textFaint, marginTop: 6 }}>
            {[...message].length} / {MAX}
          </Text>
        </View>

        <Pressable
          onPress={send}
          disabled={sending || (!preset && !message.trim())}
          style={{
            backgroundColor: C, borderWidth: 3, borderColor: C, paddingVertical: 13, alignItems: 'center',
            opacity: sending || (!preset && !message.trim()) ? 0.5 : 1,
          }}
        >
          {sending
            ? <ActivityIndicator color={colors.cream} />
            : <Text style={{ fontFamily: fonts.heading, fontSize: fs(14), color: colors.cream }}>보내기</Text>}
        </Pressable>
      </View>
    </BottomSheet>
  );
}
