// 응원 보내기 시트 (handoff v21 ScreenCheerCompose).
//
// 프리셋 4개 + 60자 한마디. 프리셋 문구는 서버가 소유하므로 여기서는 키만 보내고,
// 표시 문구는 화면 사본을 쓴다(서버 PresetText와 동일 — 어긋나면 서버가 진실).
import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { PixelIcon } from '@/components/PixelIcon';
import type { CheerPreset } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;
const MAX = 60;

const PRESETS: { key: CheerPreset; label: string }[] = [
  { key: 'well_done', label: '잘하고 있어요' },
  { key: 'fighting', label: '오늘도 화이팅' },
  { key: 'streak', label: '연속 대단해요' },
  { key: 'rest', label: '무리하지 말아요' },
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
    <Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
      <Pressable onPress={close} style={{ flex: 1, backgroundColor: 'rgba(42,37,34,0.55)' }} />
      <View style={{ backgroundColor: colors.paper, borderTopWidth: 4, borderTopColor: C, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 24 }}>
        <View style={{ width: 44, height: 5, backgroundColor: C + '33', alignSelf: 'center', marginBottom: 14 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <View style={{ width: 40, height: 40, backgroundColor: colors.cream, borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
            <PixelIcon name="clap" color={C} size={22} sw={1.7} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C }}>{name}에게 응원 보내기</Text>
            {!!activity && (
              <Text numberOfLines={1} style={{ fontFamily: fonts.body, fontSize: 10, color: colors.textSoft, marginTop: 3 }}>{activity}</Text>
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
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C }}>{p.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 10, paddingHorizontal: 11, marginBottom: 13 }}>
          <TextInput
            value={message}
            onChangeText={(v) => setMessage([...v].slice(0, MAX).join(''))}
            placeholder="한마디 남기기 (선택)"
            placeholderTextColor={colors.textFaint}
            multiline
            style={{ fontFamily: fonts.body, fontSize: 11, color: C, lineHeight: 17, minHeight: 40 }}
          />
          <Text style={{ textAlign: 'right', fontFamily: fonts.heading, fontSize: 9, color: colors.textFaint, marginTop: 6 }}>
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
            : <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: colors.cream }}>보내기</Text>}
        </Pressable>
      </View>
    </Modal>
  );
}
