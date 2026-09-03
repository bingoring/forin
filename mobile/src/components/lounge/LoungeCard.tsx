// One staff-lounge post, pinned to the corkboard (핸드오프 v31 07 · 라운지).
//
// The pin is the wall's grammar: every card is a slip of paper somebody stuck up,
// and the head's colour says what kind of post it is before a word is read —
// blue for a note, amber for a question, red for a shared conversation. Position
// varies per index so the wall does not look like a table.
//
// What is NOT drawn here, on purpose: the handoff's 댓글 count and 답글 쓰기 line.
// There are no comments behind the lounge yet, and a footer that counts replies
// nobody can write is a promise the screen cannot keep.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NbIcon } from '@/components/nb/NbIcon';
import { NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { nb, nbFonts } from '@/theme/nb';
import { type Translate, useT } from '@/i18n';
import type { LoungeKind, LoungePost } from '@/api/client';

/** kind → pin colour, paper tint and the badge next to the name. */
const KIND: Record<LoungeKind, { pin: string; pinDark: string; tint?: string; badge: string; badgeKey: string }> = {
  talk: { pin: nb.blue, pinDark: '#2E4A73', badge: nb.blue, badgeKey: 'lounge.kindTalk' },
  question: { pin: nb.green, pinDark: '#3E6139', tint: '#FCF3E4', badge: '#C77E2E', badgeKey: 'lounge.kindQuestion' },
  share: { pin: nb.red, pinDark: '#8E3A32', badge: nb.red, badgeKey: 'lounge.kindShare' },
};
const kindOf = (k: LoungeKind) => KIND[k] ?? KIND.talk;

/** Fixed per index rather than random: a wall that reshuffles its pins on every
 *  render is a wall that moves while you read it. */
const PIN_X = [150, 34, 250, 96, 200, 62];
const ROT = [-0.5, 0.5, -0.4, 0.45, -0.3, 0.4];

export function LoungeCard({ post, index, onCheer, onMenu, onOpenScenario }: {
  post: LoungePost;
  index: number;
  onCheer: (p: LoungePost) => void;
  onMenu: (p: LoungePost) => void;
  /** Only passed where the scenario can actually be opened. */
  onOpenScenario?: (scenarioId: string) => void;
}) {
  const t = useT();
  const k = kindOf(post.kind);
  const turns = post.snippet?.turns ?? [];

  return (
    <NbPaper
      rot={ROT[index % ROT.length]}
      pinned={PIN_X[index % PIN_X.length]}
      pinColor={k.pin}
      bg={k.tint}
      style={styles.card}
    >
      <View style={styles.metaRow}>
        <Avatar seed={post.authorId} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text numberOfLines={1} style={[nbText.hand(16), { flexShrink: 1 }]}>
              {post.mine ? t('lounge.meSuffix', { name: post.authorName }) : post.authorName}
            </Text>
            <NbTag color={k.badge} fill>{t(k.badgeKey)}</NbTag>
          </View>
          <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 1 }]}>{subtitle(post)}</Text>
        </View>
        {/* Three dots drawn rather than typed: the app's glyph ratchet bans ⋯, and a
            character would render at whatever weight the font decided next to 1.7px
            line icons. */}
        <Pressable onPress={() => onMenu(post)} hitSlop={12} accessibilityLabel={t('lounge.more')}>
          <View style={styles.dots}>{[0, 1, 2].map((i) => <View key={i} style={styles.dot} />)}</View>
        </Pressable>
      </View>

      <Text style={[nbText.hand(16.5), { marginTop: 9, lineHeight: 22 }]}>{post.body}</Text>

      {turns.length > 0 && (
        <View style={styles.snippet}>
          <View style={styles.snippetHead}>
            <Text numberOfLines={1} style={[nbText.hand(12.5), { flex: 1, minWidth: 0 }]}>
              {post.snippet?.title || t('lounge.sharedConversation')}
            </Text>
            <Pressable
              onPress={() => post.scenarioId && onOpenScenario?.(post.scenarioId)}
              disabled={!post.scenarioId || !onOpenScenario}
              hitSlop={8}
            >
              <Text numberOfLines={1} style={{ fontFamily: nbFonts.monoBold, fontSize: 8.5, color: nb.soft }}>
                {post.scenarioId && onOpenScenario
                  ? t('lounge.turnsOpen', { n: turns.length })
                  : t('lounge.turns', { n: turns.length })}
              </Text>
            </Pressable>
          </View>
          <View style={styles.snippetBody}>
            {turns.map((turn, i) => {
              const mine = turn.role === 'user';
              return (
                <View key={i} style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleNpc]}>
                  <Text style={nbText.body(11.5, nb.ink)}>{turn.text}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {!!post.tags?.length && (
        <View style={styles.tagRow}>
          {post.tags.map((tag) => (
            <Text key={tag} numberOfLines={1} style={nbText.hand(12.5, nb.blue)}>{`#${tag}`}</Text>
          ))}
        </View>
      )}

      <View style={styles.foot}>
        <Pressable onPress={() => onCheer(post)} hitSlop={8} style={styles.cheer}>
          {/* Filled star for a cheer already given: the count alone cannot say whether
              the tap was yours. */}
          <NbIcon name="star" size={14} color={post.cheered ? '#C99A1E' : nb.soft} />
          <Text numberOfLines={1} style={nbText.hand(13.5, post.cheered ? nb.ink : nb.soft)}>
            {t('lounge.cheers', { n: post.cheers })}
          </Text>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text numberOfLines={1} style={nbText.mono(9)}>{ago(t, post.createdAt)}</Text>
      </View>
    </NbPaper>
  );
}

/** 간호사 · 🇺🇸 텍사스 · LV 29 — whatever of it the server actually knows. */
function subtitle(p: LoungePost): string {
  return [p.authorJob, p.authorDestination, p.authorLevel ? `LV ${p.authorLevel}` : '']
    .filter(Boolean)
    .join(' · ');
}

/** A polaroid-ish head, tinted from the author id so the same person is the same
 *  colour every time without the server sending an avatar it does not have. */
const AVATAR_BG = ['#B8CBB0', '#E9C45A', '#C3B1E8', '#8FC7E8', '#F4A49B', '#A8D997'];
function Avatar({ seed }: { seed: string }) {
  let n = 0;
  for (let i = 0; i < seed.length; i++) n = (n + seed.charCodeAt(i)) % AVATAR_BG.length;
  const bg = AVATAR_BG[n];
  return (
    <View style={[styles.avatar, { transform: [{ rotate: '-2deg' }] }]}>
      <View style={[styles.avatarHead, { backgroundColor: bg }]} />
      <View style={[styles.avatarBody, { backgroundColor: bg }]} />
    </View>
  );
}

/** Relative time, in the catalog's words. Anything past a week is the date itself —
 *  "62일 전" is a number nobody converts back into a day. */
function ago(t: Translate, iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const mins = Math.floor((Date.now() - then) / 60000);
  if (mins < 1) return t('lounge.justNow');
  if (mins < 60) return t('lounge.minsAgo', { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('lounge.hoursAgo', { n: hours });
  const days = Math.floor(hours / 24);
  if (days <= 7) return t('lounge.daysAgo', { n: days });
  const d = new Date(then);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

const styles = StyleSheet.create({
  card: { marginTop: 15, paddingTop: 13, paddingBottom: 11, paddingHorizontal: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  dots: { flexDirection: 'row', gap: 2.5, paddingHorizontal: 4, paddingVertical: 8 },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: nb.soft },
  avatar: {
    width: 38, height: 38, flexShrink: 0, backgroundColor: nb.paper,
    borderWidth: 1, borderColor: nb.paperEdge, alignItems: 'center', overflow: 'hidden',
  },
  avatarHead: { width: 15, height: 15, borderRadius: 99, borderWidth: 1.4, borderColor: nb.ink, marginTop: 5 },
  avatarBody: {
    width: 27, height: 13, borderTopLeftRadius: 13, borderTopRightRadius: 13,
    borderWidth: 1.4, borderColor: nb.ink, marginTop: 2,
  },
  snippet: { marginTop: 9, borderWidth: 1.5, borderColor: nb.ink, borderRadius: 3, overflow: 'hidden' },
  snippetHead: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(143,199,232,.25)', paddingVertical: 5, paddingHorizontal: 9,
    borderBottomWidth: 1.5, borderBottomColor: nb.ink,
  },
  snippetBody: { padding: 9, gap: 6 },
  bubble: { maxWidth: '86%', borderWidth: 1.3, paddingVertical: 5, paddingHorizontal: 9 },
  bubbleMine: {
    alignSelf: 'flex-end', backgroundColor: nb.paper, borderColor: nb.ink,
    borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 2,
  },
  bubbleNpc: {
    alignSelf: 'flex-start', backgroundColor: '#FCEEDC', borderColor: '#E8D2B0',
    borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10, borderBottomLeftRadius: 2,
  },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  foot: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10, paddingTop: 8,
    borderTopWidth: 1.3, borderStyle: 'dashed', borderTopColor: 'rgba(62,54,43,.15)',
  },
  cheer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
});
