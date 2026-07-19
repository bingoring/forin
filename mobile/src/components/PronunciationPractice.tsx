// Pronunciation practice: record the learner speaking a reference phrase, send
// it to the server (Azure) for assessment, and show the score. Records 16kHz
// mono PCM WAV (the format the assessment endpoint expects) via expo-audio.
//
// NOTE: live scoring needs a valid AZURE_SPEECH_KEY on the server (the assess
// endpoint returns 502 otherwise) and a real device/mic to capture audio — the
// iOS simulator has no microphone. The UI degrades gracefully on any failure.
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import {
  useAudioRecorder,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  IOSOutputFormat,
  AudioQuality,
  type RecordingOptions,
} from 'expo-audio';
import { readAsStringAsync, EncodingType } from 'expo-file-system/legacy';
import { PronunciationScore } from '@/components/PronunciationScore';
import { api, type PronunciationResult } from '@/api/client';
import { colors, fonts } from '@/theme/tokens';

const C = colors.ink;

// 16kHz mono PCM WAV — matches the server's audio/wav; codecs=pcm; samplerate=16000.
const WAV_16K_MONO: RecordingOptions = {
  extension: '.wav',
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 256000,
  ios: {
    outputFormat: IOSOutputFormat.LINEARPCM,
    audioQuality: AudioQuality.HIGH,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  android: {
    outputFormat: 'default',
    audioEncoder: 'default',
  },
  web: {},
};

type Phase = 'idle' | 'recording' | 'assessing' | 'done' | 'error';

export function PronunciationPractice({ referenceText }: { referenceText: string }) {
  const recorder = useAudioRecorder(WAV_16K_MONO);
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [err, setErr] = useState('');

  const start = async () => {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) { setErr('마이크 권한이 필요합니다.'); setPhase('error'); return; }
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setPhase('recording');
    } catch {
      setErr('녹음을 시작하지 못했습니다.'); setPhase('error');
    }
  };

  const stopAndAssess = async () => {
    setPhase('assessing');
    try {
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri) throw new Error('no audio');
      const b64 = await readAsStringAsync(uri, { encoding: EncodingType.Base64 });
      const res = await api.assessPronunciation(referenceText, b64);
      setResult(res); setPhase('done');
    } catch {
      setErr('발음 채점을 불러오지 못했습니다. (서버 Azure 키 확인)'); setPhase('error');
    }
  };

  return (
    <View style={{ marginTop: 10, backgroundColor: colors.paper, borderWidth: 2, borderColor: C, padding: 10, gap: 8 }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: colors.textSoft }}>🎤 발음 연습</Text>
      <Text style={{ fontFamily: fonts.body, fontSize: 13, color: C }}>"{referenceText}"</Text>

      {phase === 'recording' ? (
        <Pressable onPress={stopAndAssess} style={{ backgroundColor: '#FCA5A5', borderWidth: 2, borderColor: C, paddingVertical: 8, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>■ 녹음 중지 · 채점</Text>
        </Pressable>
      ) : phase === 'assessing' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, justifyContent: 'center' }}>
          <ActivityIndicator color={C} size="small" />
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: colors.textSoft }}>채점 중…</Text>
        </View>
      ) : (
        <Pressable onPress={start} style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 8, alignItems: 'center' }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>🎤 {phase === 'done' || phase === 'error' ? '다시 녹음' : '녹음 시작'}</Text>
        </Pressable>
      )}

      {phase === 'error' && <Text style={{ fontFamily: fonts.body, fontSize: 11, color: '#DC2626' }}>{err}</Text>}
      {phase === 'done' && result && <PronunciationScore result={result} />}
    </View>
  );
}
