// listen quiz — verbal-order dictation. A dark audio card with a pixel speaker +
// a REAL waveform: the dictation line is synthesized to audio server-side (Azure
// TTS, cached), the client plays it (expo-audio) and colors the bars in sync with
// playback (played=cyan / unplayed=slate + a moving yellow playhead). The bar
// heights are the clip's actual RMS amplitude envelope, so the shape matches the
// audio. 0.7×/1.0× speed + a 📝 자막 reveal. Falls back to on-device TTS
// (expo-speech, static bars) if synthesis is unavailable/offline.
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import * as Speech from 'expo-speech';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import { api, type QuizDetail } from '@/api/client';
import { AUDIO } from '@/components/pron/nbPron';
import { NbIcon } from '@/components/nb/NbIcon';
import { nb, nbFonts } from '@/theme/nb';
import { QuizShell, type QuizProgress, Shadowed, ContextBox, HintRow, ResultBanner, C } from '@/components/quiz/QuizShell';
import { NbButton } from '@/components/nb/NbUI';
import { t, useT } from '@/i18n';

// Fallback bar heights, only used when real audio/waveform can't be fetched.
const WAVE = [6, 12, 18, 10, 22, 14, 8, 16, 28, 18, 24, 12, 8, 14, 20, 30, 22, 16, 8, 12, 18, 26, 14, 8, 10, 16, 22, 28, 18, 12, 8, 14, 20, 16, 10, 18, 24, 12, 8, 14, 20, 16, 10, 6, 12, 18, 8, 14, 20, 10];

const mmss = (sec: number) => {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export function ListenQuiz({ quiz, onExit, onComplete, progress }: { quiz: QuizDetail; onExit: () => void; onComplete: () => void; progress?: QuizProgress }) {
  const t = useT();
  const c = quiz.content!;
  const choices = c.choices ?? [];
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [subtitle, setSubtitle] = useState(false);
  const [replays, setReplays] = useState(0);
  const correct = checked && picked !== null && !!choices[picked]?.correct;

  // Real synthesized audio + amplitude waveform (with graceful TTS fallback).
  // The clip is downloaded to a local file and played from there — iOS AVPlayer
  // won't stream cleartext-http localhost (ATS), but plays local files fine.
  const player = useAudioPlayer(undefined, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  const [meta, setMeta] = useState<{ waveform: number[]; durationMs: number } | null>(null);
  const [ttsFallback, setTtsFallback] = useState(false);
  useEffect(() => {
    let alive = true;
    api.quizAudioMeta(quiz.id)
      .then((m) => { if (alive) (m.waveform.length ? setMeta(m) : setTtsFallback(true)); })
      .catch(() => { if (alive) setTtsFallback(true); });
    (async () => {
      try {
        const path = `${FileSystem.cacheDirectory}listen-${quiz.id}.wav`;
        const info = await FileSystem.getInfoAsync(path);
        if (!info.exists) await FileSystem.downloadAsync(api.quizAudioUrl(quiz.id), path);
        if (alive) player.replace({ uri: path });
      } catch { if (alive) setTtsFallback(true); }
    })();
    return () => { alive = false; Speech.stop(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.id]);

  const bars = meta?.waveform.length ? meta.waveform : WAVE;
  const barMax = Math.max(1, ...bars);
  const durationSec = (meta?.durationMs ? meta.durationMs / 1000 : 0) || status.duration || 0;
  const played = ttsFallback ? 0.52 : durationSec > 0 ? Math.min(1, status.currentTime / durationSec) : 0;

  const play = (rate = speed) => {
    setReplays((r) => r + 1);
    if (ttsFallback) { // TTS unavailable → on-device speech, no live waveform
      Speech.stop(); Speech.speak(c.audioText ?? '', { language: 'en-US', rate });
      return;
    }
    try {
      player.setPlaybackRate(rate);
      player.seekTo(0);
      player.play();
    } catch {
      setTtsFallback(true);
      Speech.stop(); Speech.speak(c.audioText ?? '', { language: 'en-US', rate });
    }
  };

  return (
    <QuizShell
      title={quiz.title} sub={c.sub} zone={c.zone} onExit={onExit} progress={progress}
      footer={
        checked && correct
          ? <View style={{ flex: 1 }}><NbButton variant="ink" full iconColor={nb.paper} onPress={onComplete}>{t('quiz.finish')}</NbButton></View>
          : (
            <>
              <NbButton variant="paper" onPress={() => play()} style={{ flex: 1 }}>{t('quiz.listenAgain', { n: Math.min(replays, 3) })}</NbButton>
              <View style={{ flex: 2 }}>
                <NbButton variant="ink" full iconColor={nb.paper} disabled={picked === null} onPress={() => (checked ? (setChecked(false), setPicked(null)) : setChecked(true))}>{checked ? t('quiz.retry') : t('quiz.readBack')}</NbButton>
              </View>
            </>
          )
      }
    >
      {!!c.context && <ContextBox text={c.context} />}

      {/* audio card */}
      <Shadowed offset={3}>
        <View style={{ backgroundColor: AUDIO.bg, borderWidth: 1.5, borderColor: AUDIO.edge, borderRadius: 4, padding: 10, paddingTop: 14 }}>
          <View style={{ position: 'absolute', top: -8, left: 8, backgroundColor: nb.paper, borderWidth: 1.3, borderColor: nb.ink, paddingHorizontal: 5 }}>
            <Text style={{ fontFamily: nbFonts.hand, fontSize: 12.2, color: C }}>AUDIO · {durationSec > 0 ? mmss(durationSec) : (c.duration || '0:00')}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {/* speaker (▶ when idle, ❚❚ pulse while playing) */}
            <Pressable onPress={() => play()}>
              <Shadowed offset={2} shadowColor={nb.green}>
                <View style={{ width: 44, height: 44, backgroundColor: status.playing ? 'rgba(249,227,123,.5)' : 'rgba(168,217,151,.4)', borderWidth: 1.5, borderColor: nb.paperEdge, alignItems: 'center', justifyContent: 'center' }}>
                  <Svg width={22} height={22} viewBox="0 0 22 22">
                    <Rect x={4} y={8} width={3} height={6} fill={C} />
                    <Rect x={7} y={6} width={2} height={10} fill={C} />
                    <Rect x={9} y={4} width={2} height={14} fill={C} />
                    <Rect x={13} y={7} width={1} height={2} fill={C} />
                    <Rect x={14} y={6} width={1} height={4} fill={C} />
                    <Rect x={13} y={13} width={1} height={2} fill={C} />
                    <Rect x={14} y={12} width={1} height={4} fill={C} />
                    <Rect x={16} y={9} width={1} height={4} fill={C} />
                    <Rect x={17} y={8} width={1} height={6} fill={C} />
                  </Svg>
                </View>
              </Shadowed>
            </Pressable>
            {/* waveform — bars are the real amplitude envelope; coloring + playhead track playback */}
            <View style={{ flex: 1 }}>
              <Svg width="100%" height={40} viewBox={`0 0 ${bars.length * 4} 40`} preserveAspectRatio="none">
                {bars.map((h, i) => {
                  const barH = 4 + (h / barMax) * 32;
                  const isPlayed = (i + 0.5) / bars.length <= played;
                  return <Rect key={i} x={i * 4} y={20 - barH / 2} width={3} height={barH} fill={isPlayed ? '#22D3EE' : '#475569'} />;
                })}
                {(status.playing || (played > 0 && played < 1)) && !ttsFallback && (
                  <Rect x={played * bars.length * 4} y={0} width={2} height={40} fill="#FEF08A" />
                )}
              </Svg>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 10.8, color: '#FEF08A' }}>{ttsFallback ? '0:00' : mmss(status.currentTime)}</Text>
                <Text style={{ fontFamily: nbFonts.hand, fontSize: 10.8, color: '#94A3B8' }}>{durationSec > 0 ? mmss(durationSec) : (c.duration || '0:00')}</Text>
              </View>
            </View>
          </View>
          {/* speed + subtitle */}
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 12, alignItems: 'center' }}>
            <SpeedBtn label="0.7×" active={speed === 0.7} onPress={() => { setSpeed(0.7); play(0.7); }} />
            <SpeedBtn label="1.0×" active={speed === 1.0} onPress={() => { setSpeed(1.0); play(1.0); }} />
            <View style={{ flex: 1 }} />
            <SpeedBtn label={t('quiz.captions')} active={subtitle} onPress={() => setSubtitle((s) => !s)} />
          </View>
          {/* subtitle reveal */}
          {subtitle && !!c.audioText && (
            <View style={{ marginTop: 10, backgroundColor: '#1E2A38', borderWidth: 1.5, borderColor: '#475569', paddingVertical: 6, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: nbFonts.body, fontSize: 11, color: '#E2E8F0', lineHeight: 16 }}>"{c.audioText}"</Text>
            </View>
          )}
        </View>
      </Shadowed>

      {/* instruction */}
      <Text style={{ fontFamily: nbFonts.body, fontSize: 11, color: nb.ink, textAlign: 'center', marginTop: 12, marginBottom: 8 }}>
        닥터가 뭐라고 말했나요? <Text style={{ fontFamily: nbFonts.hand }}>가장 정확한 것</Text>을 고르세요.
      </Text>

      {/* choices */}
      <View style={{ gap: 6 }}>
        {choices.map((ch, i) => {
          const isPicked = picked === i;
          const showRight = checked && ch.correct;
          const showWrong = checked && isPicked && !ch.correct;
          const bg = showRight ? 'rgba(168,217,151,.4)' : showWrong ? '#FFF0EC' : isPicked ? 'rgba(249,227,123,.5)' : '#fff';
          return (
            <Shadowed key={i} offset={isPicked ? 3 : 2} shadowColor={isPicked ? '#C99A1E' : C}>
              <Pressable onPress={() => !checked && setPicked(i)} style={{ backgroundColor: bg, borderWidth: 2.5, borderColor: isPicked ? '#C99A1E' : C, flexDirection: 'row' }}>
                <View style={{ width: 30, backgroundColor: isPicked || showRight ? 'rgba(249,227,123,.5)' : '#FFF3EE', borderRightWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: nbFonts.hand, fontSize: 21.6, color: C }}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <View style={{ flex: 1, paddingVertical: 7, paddingHorizontal: 9 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                    <Text style={{ flex: 1, minWidth: 0, fontFamily: nbFonts.body, fontSize: 12, color: C, lineHeight: 17 }}>"{ch.text}"</Text>
                    {showRight && <View style={{ marginTop: 2 }}><NbIcon name="check" size={12} color={nb.green} /></View>}
                    {showWrong && <View style={{ marginTop: 2 }}><NbIcon name="cross" size={11} color={nb.red} /></View>}
                  </View>
                  {!!ch.tags?.length && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 4 }}>
                      {ch.tags.map((t, ti) => (
                        <View key={ti} style={{ backgroundColor: nb.paper, borderWidth: 1, borderColor: C + '55', paddingHorizontal: 4, paddingVertical: 1 }}>
                          <Text style={{ fontFamily: nbFonts.hand, fontSize: 10.8, color: C }}>{t}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                {isPicked && !checked && (
                  <View style={{ position: 'absolute', top: -7, right: -7, width: 15, height: 15, backgroundColor: '#C99A1E', borderWidth: 1.4, borderColor: nb.ink, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: nbFonts.hand, fontSize: 12.2, color: nb.paper }}>?</Text>
                  </View>
                )}
              </Pressable>
            </Shadowed>
          );
        })}
      </View>

      {/* glossary */}
      {!!c.glossary?.length && (
        <View style={{ marginTop: 10, backgroundColor: nb.paper, borderWidth: 1.3, borderColor: nb.ink + '55', borderStyle: 'dashed', paddingVertical: 6, paddingHorizontal: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
          <Text style={{ fontFamily: nbFonts.hand, fontSize: 13.5, color: C }}>약어.  </Text>
          {c.glossary.map((g, i) => (
            <Text key={i} style={{ fontFamily: nbFonts.body, fontSize: 10, color: nb.soft, marginRight: 8 }}>
              <Text style={{ fontFamily: nbFonts.hand, color: C }}>{g.abbr}</Text> {g.meaning}
            </Text>
          ))}
        </View>
      )}

      {checked && <ResultBanner correct={correct} />}
      {!!c.hint && <HintRow text={c.hint} />}
    </QuizShell>
  );
}

function SpeedBtn({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Shadowed offset={active ? 2 : 1.5} shadowColor={active ? '#C99A1E' : C}>
      <Pressable onPress={onPress} style={{ backgroundColor: active ? 'rgba(249,227,123,.5)' : '#fff', borderWidth: 1.4, borderColor: nb.ink, paddingVertical: 3, paddingHorizontal: 8 }}>
        <Text style={{ fontFamily: nbFonts.hand, fontSize: 13.5, color: C }}>{label}</Text>
      </Pressable>
    </Shadowed>
  );
}
