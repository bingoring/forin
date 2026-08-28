// 오늘의 호출 — the pager that drops on the home screen once a day (v27 PagingCall).
//
// A navy pager frame with a red header, a blinking light, a shake, and a countdown that
// runs out. Answering enters a short scenario and pays a one-off bonus.
//
// The rules it draws are all the SERVER's: which scenario, when it was issued, how long
// is left, whether it was answered, and how much the bonus is worth. None of that can be
// the client's — "once a day", "expires if missed" and "+40 XP" are claims about what
// already happened, and a phone that owned them could farm the bonus with a reinstall or
// a clock change. This file counts down from a number it was given and asks the server
// to decide the rest.
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, Text, View } from 'react-native';
import { FIcon } from '@/components/FIcon';
import type { HomePage } from '@/api/client';
import { colors, fonts, fs } from '@/theme/tokens';
import { playSfx } from '@/lib/sfx';
import { useT } from '@/i18n';

const C = colors.ink;
const NAVY = '#213B4A';
const NAVY_DEEP = '#0F2430';
const ALARM = '#F58A8A';
const AMBER = '#FEF08A';
const MUTED = '#8FA8B8';

/** mm:ss, as the handoff draws it. */
function countdown(seconds: number): string {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** A hard blink, held at each end: an indicator light, not a fade. */
function useBlink(periodMs: number) {
  const v = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: periodMs * 0.5, easing: Easing.step0, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.15, duration: periodMs * 0.5, easing: Easing.step0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [v, periodMs]);
  return v;
}

export function PagingCall({ page, onAnswer, onIgnore }: {
  page: HomePage;
  /** Answers, then enters the scenario. Awaited so the button can show it is working —
   *  the bonus is granted server-side and the navigation should follow that, not race it. */
  onAnswer: () => Promise<void>;
  onIgnore: () => void;
}) {
  const t = useT();
  const [busy, setBusy] = useState(false);
  const [ignored, setIgnored] = useState(false);

  // Counted down locally from the server's number, and re-read from the server on the
  // next home load. A client clock cannot be trusted to decide expiry — but it is fine
  // for showing the seconds passing between two loads.
  const [left, setLeft] = useState(page.secondsLeft);
  useEffect(() => { setLeft(page.secondsLeft); }, [page.secondsLeft]);
  useEffect(() => {
    if (page.answered || left <= 0) return;
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1_000);
    return () => clearInterval(id);
  }, [page.answered, left]);

  const lamp = useBlink(800);
  const shake = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (page.answered) return;
    // Mostly still, with a jolt near the end of each cycle — the handoff's fw-shake is
    // 88% rest. A pager that vibrates continuously reads as broken, not as urgent.
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(2_600),
        Animated.timing(shake, { toValue: -2, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 2, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [page.answered, shake]);

  // ── answered: one line, not a vanished card ─────────────────────────────
  if (page.answered) {
    return (
      <View style={{ marginHorizontal: 16, marginTop: 13 }}>
        <View style={{ position: 'absolute', left: 3, top: 3, right: -3, bottom: -3, backgroundColor: C }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#fff', borderWidth: 3, borderColor: C, paddingVertical: 9, paddingHorizontal: 12 }}>
          <FIcon name="bell" size={15} />
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: fs(10.5), color: colors.textSoft }}>
            {t('page.answeredLine', { xp: page.bonusXp })}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 6 }}>
            <FIcon name="check" size={11} />
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9.5), color: C }}>{t('page.answeredBadge')}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Dismissed for this session. Not sent to the server: 무시 is "not now", and a call
  // the learner ignored is still theirs to answer until it expires — hiding it forever
  // on a stray tap would take the bonus away without saying so.
  if (ignored || left <= 0) return null;

  return (
    <Animated.View style={{ marginHorizontal: 16, marginTop: 13, transform: [{ translateX: shake }] }}>
      <View style={{ position: 'absolute', left: 4, top: 4, right: -4, bottom: -4, backgroundColor: C }} />
      <View style={{ backgroundColor: NAVY, borderWidth: 3, borderColor: C }}>
        {/* header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 8, paddingHorizontal: 11, borderBottomWidth: 2.5, borderBottomColor: C, backgroundColor: ALARM }}>
          <Animated.View style={{ width: 8, height: 8, backgroundColor: '#fff', borderWidth: 2, borderColor: C, opacity: lamp }} />
          <FIcon name="bell" size={12} />
          <Text style={{ flex: 1, fontFamily: fonts.heading, fontSize: fs(11), color: C }}>{t('page.title')}</Text>
          <View style={{ backgroundColor: C, paddingVertical: 1, paddingHorizontal: 6 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(10), color: AMBER }}>+{page.bonusXp} XP</Text>
          </View>
        </View>

        <View style={{ paddingTop: 11, paddingHorizontal: 12, paddingBottom: 12 }}>
          {/* The summons is the server's words — see domain/home/page.go for why. */}
          <Text style={{ fontFamily: fonts.heading, fontSize: fs(13.5), color: '#fff', lineHeight: 20 }}>{page.line}</Text>
          <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: '#BFDBFE', marginTop: 6 }}>{page.hint}</Text>

          {/* time bar — the fraction of the window still left */}
          <View style={{ marginTop: 10, height: 12, backgroundColor: NAVY_DEEP, borderWidth: 2, borderColor: C }}>
            {/* A fraction of the WHOLE window, which the server sends: the window is
                not a constant (a call issued near midnight is clipped short), and
                measuring against "what was left when this screen loaded" would start
                every bar full however late the learner opened the app. */}
            <View style={{ width: `${Math.max(0, Math.min(100, (left / Math.max(1, page.totalSeconds)) * 100))}%`, height: '100%', backgroundColor: AMBER }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Text style={{ fontFamily: fonts.heading, fontSize: fs(9), color: AMBER }}>{t('page.left', { time: countdown(left) })}</Text>
            <View style={{ flex: 1 }} />
            <Text style={{ fontFamily: fonts.body, fontSize: fs(9), color: MUTED }}>{t('page.expires')}</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 11 }}>
            <View style={{ flex: 1 }}>
              <View style={{ position: 'absolute', left: 2.5, top: 2.5, right: -2.5, bottom: -2.5, backgroundColor: '#000' }} />
              <Pressable
                disabled={busy}
                onPress={async () => {
                  if (busy) return;
                  setBusy(true);
                  playSfx('tap');
                  try { await onAnswer(); } finally { setBusy(false); }
                }}
                style={{ backgroundColor: AMBER, borderWidth: 2.5, borderColor: C, paddingVertical: 9, alignItems: 'center' }}
              >
                {busy
                  ? <ActivityIndicator color={C} />
                  : <Text style={{ fontFamily: fonts.heading, fontSize: fs(12.5), color: C }}>{t('page.answer')}</Text>}
              </Pressable>
            </View>
            <Pressable
              onPress={() => { setIgnored(true); onIgnore(); }}
              style={{ borderWidth: 2.5, borderColor: MUTED, paddingVertical: 9, paddingHorizontal: 12, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: MUTED }}>{t('page.ignore')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
