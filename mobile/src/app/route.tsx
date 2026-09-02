// 메인 루트 — the guided progression path, in the 근무 수첩 line (v30).
//
// A vertical stepper of event nodes from the server (GET /me/route): cleared ones ticked,
// the current one ringed and tagged 지금 여기, and locked ones gated by prerequisites.
// Nodes whose scenario is not authored yet say 준비 중.
//
// NOTE ON THE v30 ARTBOARD: 07 lists a 길찾기 screen — a hand-drawn floor plan with a
// red dotted path from where you are to a room. That is NOT this screen and is not
// implemented here: it needs a room graph, a door-to-door path and a current position,
// none of which the server sends (the interior fixtures in src/map do carry room geometry,
// so it is buildable — as a feature, not as a re-skin). This is the curriculum route, and
// it borrows the artboard's numbered-step vocabulary because that part fits what the data
// actually is.
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbButton, NbPaper, NbSheet, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { api, type RouteNode } from '@/api/client';
import { useT } from '@/i18n';
import { PLACE_SCREEN } from '@/theme/transitions';

export default function Route() {
  const t = useT();
  const router = useRouter();
  const [nodes, setNodes] = useState<RouteNode[]>([]);
  const [state, setState] = useState<'loading' | 'error' | 'ok'>('loading');

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      api.mainRoute()
        .then((n) => { if (alive) { setNodes(n); setState('ok'); } })
        .catch(() => { if (alive) setState('error'); });
      return () => { alive = false; };
    }, []),
  );

  const done = nodes.filter((n) => n.state === 'completed').length;

  return (
    <NbSheet>
      <Stack.Screen options={PLACE_SCREEN} />

      <View style={styles.head}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <NbPaper rot={-1} style={styles.chip}><NbIcon name="chevronLeft" size={16} /></NbPaper>
        </Pressable>
        <Text numberOfLines={1} style={[nbText.hand(26), { flex: 1, minWidth: 0 }]}>{t('route.title')}</Text>
        {state === 'ok' && nodes.length > 0 && (
          <Text numberOfLines={1} style={styles.count}>{done}/{nodes.length}</Text>
        )}
      </View>

      {state === 'loading' && <View style={styles.centre}><ActivityIndicator color={nb.ink} /></View>}
      {state === 'error' && (
        <View style={styles.centre}>
          <Text style={[nbText.hand(17), { textAlign: 'center' }]}>{t('route.loadFailed')}</Text>
          <NbButton variant="paper" onPress={() => router.back()}>{t('common.back')}</NbButton>
        </View>
      )}

      {state === 'ok' && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={nbText.body(12, nb.soft)}>{t('route.sub')}</Text>

          {nodes.length === 0 ? (
            <View style={styles.empty}>
              <NbIcon name="compass" size={34} color={nb.soft} />
              <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center' }]}>{t('route.empty')}</Text>
            </View>
          ) : (
            nodes.map((n, i) => (
              <RouteStep
                key={n.eventId}
                node={n}
                n={i + 1}
                last={i === nodes.length - 1}
                onPress={() => n.scenarioId && router.push(`/scenario/${n.scenarioId}`)}
              />
            ))
          )}
        </ScrollView>
      )}
    </NbSheet>
  );
}

function RouteStep({ node, n, last, onPress }: { node: RouteNode; n: number; last: boolean; onPress: () => void }) {
  // Its own useT, not the module-level t(): a component that reads the module singleton is
  // not re-rendered when the locale changes (see i18n/useT.test.ts).
  const t = useT();
  const completed = node.state === 'completed';
  const available = node.state === 'available';
  const locked = node.state === 'locked';
  const noScenario = available && !node.scenarioId; // graph node authored ahead of its content
  const tappable = available && !!node.scenarioId;

  // The number's pen: green for done, gold for where you are, pencil for what is shut.
  const penColor = completed ? nb.green : available ? '#C99A1E' : nb.soft;

  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {/* The rail. Solid behind you, dashed ahead — the walk you have done is drawn and
          the rest is pencilled in. */}
      <View style={{ alignItems: 'center', width: 30 }}>
        <View style={[styles.dot, { borderColor: penColor, borderWidth: available ? 2.4 : 1.8 }]}>
          {completed
            ? <NbIcon name="check" size={15} color={nb.green} />
            : locked
              ? <NbIcon name="lock" size={13} color={nb.soft} />
              : <Text style={[nbText.hand(15, penColor), { lineHeight: 17 }]}>{n}</Text>}
        </View>
        {!last && (
          <View
            style={[
              styles.rail,
              completed
                ? { borderLeftWidth: 2, borderLeftColor: nb.green }
                : { borderLeftWidth: 1.8, borderStyle: 'dashed', borderLeftColor: 'rgba(62,54,43,.28)' },
            ]}
          />
        )}
      </View>

      <Pressable onPress={onPress} disabled={!tappable} style={{ flex: 1, marginBottom: 14 }}>
        <NbPaper
          rot={n % 2 ? -0.5 : 0.5}
          bg={completed ? 'rgba(168,217,151,.18)' : undefined}
          style={[
            styles.card,
            // The one ringed card is where you are — the same gold ring the curriculum
            // list and the profile use for "this is the one you chose".
            available && !noScenario ? { borderColor: '#C99A1E', borderWidth: 2 } : null,
            locked ? { opacity: 0.55, backgroundColor: 'transparent', borderStyle: 'dashed' } : null,
          ]}
        >
          <View style={styles.cardHead}>
            <Text numberOfLines={1} style={styles.tier}>TIER {node.tier}</Text>
            <View style={{ flex: 1 }} />
            {/* Same slot, different word — a node you already tried says so instead of
                inviting you as if it were new. */}
            {available && !noScenario && (
              <NbTag color={node.attempted ? nb.red : '#C99A1E'} rot={-2}>
                {t(node.attempted ? 'route.tryAgain' : 'route.hereNow')}
              </NbTag>
            )}
            {noScenario && <NbTag color={nb.soft}>{t('route.notReady')}</NbTag>}
          </View>

          <Text numberOfLines={2} style={[nbText.hand(18), { marginTop: 4, lineHeight: 21 }]}>{node.title}</Text>

          {/* "통과", not "완료": unlocking needs a CLEAR, and a learner who played the
              previous step and did not pass it was told to complete something they thought
              they had. */}
          {locked && <Text style={[nbText.body(10.5, nb.soft), { marginTop: 3 }]}>{t('route.lockedHint')}</Text>}
          {noScenario && <Text style={[nbText.body(10.5, nb.soft), { marginTop: 3 }]}>{t('route.comingSoon')}</Text>}
        </NbPaper>
      </Pressable>
    </View>
  );
}

const styles = {
  head: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', gap: 10 } as const,
  chip: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' } as const,
  count: { fontFamily: nbFonts.monoBold, fontSize: 12, color: nb.soft } as const,
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 28 } as const,
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 } as const,
  empty: { alignItems: 'center', paddingVertical: 44, gap: 9 } as const,

  dot: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: nb.paper,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  } as const,
  rail: { flex: 1, marginVertical: 4, minHeight: 22 } as const,
  card: { marginTop: 2, paddingVertical: 12, paddingHorizontal: 14 } as const,
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 7 } as const,
  /** The tier is printed: it is a coordinate in the curriculum, not a word. */
  tier: { fontFamily: nbFonts.mono, fontSize: 9, color: nb.soft, letterSpacing: 1 } as const,
};
