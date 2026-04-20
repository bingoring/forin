import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as Speech from 'expo-speech';
import { Icon } from './Icon';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { analytics } from '../../analytics';

interface Props {
  /** Remote mp3 to play. Takes precedence over `fallbackText` when set. */
  audioUrl?: string | null;
  /** Text the device TTS reads when `audioUrl` is absent. */
  fallbackText?: string | null;
  /** Exercise id for analytics. */
  exerciseId?: string;
  /** Autoplay once on mount. Defaults to true — most language-app UX. */
  autoplay?: boolean;
  /** BCP-47 tag passed to expo-speech (ignored by expo-av file playback). */
  language?: string;
}

type PlaybackSource = 'audio_url' | 'tts' | 'none';

const SPEEDS: [number, number] = [1.0, 0.75];

/**
 * Hybrid audio player. Plays a remote mp3 when `audioUrl` is set;
 * otherwise falls back to device TTS reading `fallbackText`. UX is
 * language-app shaped: big play button, always-available replay,
 * one-tap 0.75× slow-down toggle. No scrubber — stage lines are short.
 *
 * Analytics: fires `audio_play` on the first playback per mount (with
 * `was_autoplay`) and `audio_replay_count` on unmount with the total
 * number of times the learner hit replay.
 */
export function AudioPlayer({
  audioUrl,
  fallbackText,
  exerciseId,
  autoplay = true,
  language = 'en-AU',
}: Props) {
  const source: PlaybackSource = audioUrl
    ? 'audio_url'
    : fallbackText && fallbackText.trim().length > 0
    ? 'tts'
    : 'none';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);
  const replaysRef = useRef(0);
  const hasAutoplayedRef = useRef(false);
  const firedPlayEventRef = useRef(false);

  // Cleanup on unmount + emit the replay total so we can see how many
  // times learners needed to re-listen per exercise.
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
      Speech.stop();
      if (exerciseId && replaysRef.current > 0) {
        analytics.track({
          name: 'audio_replay_count',
          properties: { exercise_id: exerciseId, count: replaysRef.current },
        });
      }
    };
  }, [exerciseId]);

  const emitPlayOnce = useCallback(
    (wasAutoplay: boolean) => {
      if (firedPlayEventRef.current) return;
      firedPlayEventRef.current = true;
      analytics.track({
        name: 'audio_play',
        properties: {
          exercise_id: exerciseId ?? 'unknown',
          was_autoplay: wasAutoplay,
          source,
        },
      });
    },
    [exerciseId, source],
  );

  const play = useCallback(
    async (opts: { isReplay: boolean; wasAutoplay: boolean }) => {
      if (source === 'none') return;
      setIsLoading(true);
      try {
        if (source === 'audio_url' && audioUrl) {
          // Unload the prior sound so a replay starts from zero.
          if (soundRef.current) {
            await soundRef.current.unloadAsync().catch(() => {});
            soundRef.current = null;
          }
          const { sound } = await Audio.Sound.createAsync(
            { uri: audioUrl },
            { shouldPlay: true, rate: SPEEDS[speedIdx], shouldCorrectPitch: true },
          );
          soundRef.current = sound;
          sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
            if (!status.isLoaded) return;
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) setIsPlaying(false);
          });
        } else if (source === 'tts' && fallbackText) {
          Speech.stop();
          Speech.speak(fallbackText, {
            language,
            rate: SPEEDS[speedIdx],
            onStart: () => setIsPlaying(true),
            onDone: () => setIsPlaying(false),
            onStopped: () => setIsPlaying(false),
            onError: () => setIsPlaying(false),
          });
        }
        if (opts.isReplay) {
          replaysRef.current += 1;
        }
        emitPlayOnce(opts.wasAutoplay);
      } finally {
        setIsLoading(false);
      }
    },
    [audioUrl, fallbackText, language, source, speedIdx, emitPlayOnce],
  );

  // Autoplay once per mount.
  useEffect(() => {
    if (!autoplay || hasAutoplayedRef.current || source === 'none') return;
    hasAutoplayedRef.current = true;
    void play({ isReplay: false, wasAutoplay: true });
  }, [autoplay, play, source]);

  if (source === 'none') return null;

  const onReplay = () => {
    void play({ isReplay: true, wasAutoplay: false });
  };

  const toggleSpeed = () => {
    setSpeedIdx((i) => (i + 1) % SPEEDS.length);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.mainBtn, isPlaying && styles.mainBtnActive]}
        onPress={onReplay}
        accessibilityLabel={isPlaying ? 'Playing audio' : 'Play audio'}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Icon name="arrow-right" size={20} color={colors.white} />
        )}
        <Text style={styles.mainBtnText}>
          {isPlaying ? 'Playing' : 'Listen'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.speedBtn} onPress={toggleSpeed} accessibilityLabel="Toggle speed">
        <Text style={styles.speedText}>{SPEEDS[speedIdx].toFixed(2)}x</Text>
      </TouchableOpacity>

      {source === 'tts' ? <Text style={styles.sourceHint}>TTS</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  mainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    minHeight: 44,
  },
  mainBtnActive: { backgroundColor: colors.primaryDark },
  mainBtnText: { ...typography.button, color: colors.white },
  speedBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    minWidth: 56,
    alignItems: 'center',
  },
  speedText: { ...typography.bodyBold, color: colors.textPrimary },
  sourceHint: {
    ...typography.small,
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
});
