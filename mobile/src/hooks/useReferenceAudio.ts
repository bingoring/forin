// Play a sentence in the reference voice, from anywhere.
//
// Extracted from the pronunciation screen, which owns the same three facts and had
// them inline: iOS AVPlayer will not stream cleartext-http localhost (ATS), the
// endpoint is AUTHENTICATED so the player cannot fetch it itself, and
// downloadAsync writes the response body to disk whatever the status code — so a
// 401/404 JSON body caches as if it were a WAV and the device never recovers.
//
// The pronunciation screen keeps its own copy on purpose: it interleaves this with
// recording state, waveform capture and playback rate. This hook is the simple
// case — one sentence, one tap, one clip.
import { useCallback, useRef, useState } from 'react';
import { useAudioPlayer } from 'expo-audio';
import { cacheDirectory, deleteAsync, downloadAsync, getInfoAsync } from 'expo-file-system/legacy';
import { api } from '@/api/client';

/** Stable per sentence, so the same line is downloaded once per install. */
function cacheKey(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export function useReferenceAudio(text: string) {
  const player = useAudioPlayer(undefined, { updateInterval: 200 });
  const pathRef = useRef<string | null>(null);
  const loadedFor = useRef('');
  const [busy, setBusy] = useState(false);

  const play = useCallback(async () => {
    const line = text.trim();
    if (!line || busy) return;
    setBusy(true);
    try {
      if (loadedFor.current !== line || !pathRef.current) {
        const path = `${cacheDirectory}pron-ref-${cacheKey(line)}.wav`;
        const info = await getInfoAsync(path);
        if (!info.exists) {
          const res = await downloadAsync(api.speechReferenceAudioUrl(line), path, { headers: api.authHeaders() });
          if (res.status !== 200) {
            // Deleted, so the next tap is a real retry rather than replaying a
            // cached error body forever.
            await deleteAsync(path, { idempotent: true }).catch(() => {});
            return;
          }
        }
        player.replace({ uri: path });
        pathRef.current = path;
        loadedFor.current = line;
      }
      player.seekTo(0);
      player.play();
    } catch {
      // Silence is the honest failure here: TTS may be unconfigured, and an alert
      // about a speaker button is worse than nothing happening.
    } finally {
      setBusy(false);
    }
  }, [text, busy, player]);

  return { play, busy };
}
