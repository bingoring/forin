// A floor, opened from the career tab: its curricula first, then everything else
// happening there, scrolling on.
//
// This is the shape the tab had before the v2 rewrite, and it was better: one gesture
// from a floor to both of the things you can do on it. The rewrite expanded curricula
// inline in the list and left the situations behind a second, smaller link, which put
// the two at different depths for no reason. What v2 keeps is that a floor now holds
// SEVERAL curricula rather than one — so the top of the sheet is a list, and each row
// expands in place to show its steps. In place, not in another modal: a RN Modal over a
// Modal leaves the lower one's scrim across the screen.
//
// No close button. The handle above and a tap outside both dismiss it, and by now those
// are the two things people try first — a third affordance for the same action just took
// up the corner where the day's numbers belong.
//
// Situations come from GET /me/situations (paged, tagged by cleared). The bundled
// fallback list this sheet used to fall back on is gone: its entries named scenarios
// they did not point at (흉통 환자 트리아지 → SCN-ER-00002, a pain assessment), the
// same defect the curriculum had. An empty list now says so.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { api, type Curriculum, type DeptSituation } from '@/api/client';
import { BottomSheet } from '@/components/BottomSheet';
import { NbIcon, type NbIconName } from '@/components/nb/NbIcon';
import { NbButton, NbMark, NbPaper, NbTag, nbText } from '@/components/nb/NbUI';
import { STEP_META, type StepKind } from '@/data/campus';
import { nb, nbFonts } from '@/theme/nb';
import { t, useLocale, useT } from '@/i18n';
import { Collapsible } from '@/components/Collapsible';
import { toggleSituationFavorite, useIsSituationFavorite } from '@/lib/favorites';

const PAGE = 20;

export type DeptTarget = {
  /** The 근무 수첩 doodle for this ward, from BUILDING_STYLE. Optional so a caller that
   *  has not been ported yet still compiles — it falls back to the hospital cross. */
  nbIcon?: NbIconName;
  deptCode: string;
  place: string; // "응급의료센터"
  where: string; // "본관 1F 응급의료센터"
  accent: string;
  curricula: Curriculum[];
};

export function DeptSheet({ target, suspended, focusSituation, onClose, onStart, onWalk }: {
  target: DeptTarget | null;
  /** Hidden because a screen was pushed on top, NOT dismissed. See campus.tsx. */
  suspended?: boolean;
  /**
   * A situation the learner arrived at from search, shown at the top and marked.
   *
   * Carried in rather than hunted for: the dept list pages 20 at a time, so scrolling to
   * an arbitrary situation could mean chasing pages until it turns up. The search already
   * has the card — handing it over costs one row and no requests.
   */
  focusSituation?: DeptSituation | null;
  onClose(): void;
  /** `guide` is the rung the learner TAPPED. Both entries of a dialogue point at the
   *  same scenario, so without it the two rows navigate identically and the choice the
   *  list just offered is thrown away. */
  onStart(scenarioID?: string, guide?: 'choices' | 'free'): void;
  onWalk(deptCode: string): void;
}) {
  const t = useT();
  // Which curriculum is expanded. Defaults to the one being resumed, so opening the
  // floor you are working on already shows the next step.
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [sits, setSits] = useState<DeptSituation[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const loadingRef = useRef(false); // guards concurrent page fetches
  const offsetRef = useRef(0);
  const code = target?.deptCode;

  useEffect(() => {
    let alive = true;
    setSits([]);
    setHasMore(false);
    offsetRef.current = 0;
    setOpenKey(target?.curricula.find((c) => c.resume)?.key ?? null);
    if (!code) return;
    loadingRef.current = true;
    api.deptSituations(code, 0, PAGE)
      .then((r) => {
        if (!alive) return;
        setSits(r.situations);
        offsetRef.current = r.situations.length;
        setHasMore(r.hasMore);
      })
      .catch(() => {})
      .finally(() => { loadingRef.current = false; });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const loadMore = useCallback(() => {
    if (!code || loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    api.deptSituations(code, offsetRef.current, PAGE)
      .then((r) => {
        setSits((prev) => [...prev, ...r.situations]);
        offsetRef.current += r.situations.length;
        setHasMore(r.hasMore);
      })
      .catch(() => {})
      .finally(() => { loadingRef.current = false; });
  }, [code, hasMore]);

  // Compare on the code, render the label. These three used to test against '완료',
  // the Korean the server put in `tag` — which is exactly why that string could not
  // be translated: doing so would have broken the match and left the display Korean.
  const cleared = sits.filter((s) => s.tagCode === 'cleared').length;
  const nextSit = sits.find((s) => s.tagCode !== 'cleared')?.scenarioId;
  const curDone = target ? target.curricula.filter((c) => c.state === 'done').length : 0;

  return (
    <BottomSheet
      visible={!!target}
      suspended={suspended}
      overlay
      onClose={onClose}
      size="tall"
      // The place name drags the sheet along with the grabber. It matters more here than
      // on a short sheet: this one opens at the top of the screen, so the strip is as far
      // from the thumb as a control gets.
      // No grabber in here, either: BottomSheet draws one above every header it is given,
      // and this used to add a second directly under it — two handles for one drag.
      header={target ? (
        <View style={{ paddingTop: 2, paddingHorizontal: 20, paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
            {/* A small card with the ward's own doodle, tilted — the pixel version put a
                coloured square with a pin in it, which said "a place" and not which. */}
            <NbPaper rot={-2} style={{ width: 46, height: 46, alignItems: 'center', justifyContent: 'center' }}>
              <NbIcon name={target.nbIcon ?? 'hospital'} size={28} />
            </NbPaper>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={[nbText.hand(24), { lineHeight: 26 }]}>{target.place}</Text>
              <Text numberOfLines={1} style={[nbText.body(11, nb.soft), { marginTop: 3 }]}>{target.where}</Text>
            </View>
          </View>
        </View>
      ) : null}
    >
      {target && (
        <View>

          <ScrollView
            contentContainerStyle={{ padding: 14, paddingBottom: 96 }}
            scrollEventThrottle={200}
            onScroll={(e) => {
              const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
              if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 240) loadMore();
            }}
          >
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 15 }}>
              {[
                [t('campus.deptCurricula'), `${curDone}/${target.curricula.length}`],
                [t('campus.deptCleared'), sits.length ? `${cleared}/${sits.length}${hasMore ? '+' : ''}` : '—'],
              ].map(([k, v], i) => (
                <View key={i} style={{ flex: 1 }}>
                  <NbPaper rot={i ? 0.5 : -0.5} style={{ paddingVertical: 9, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={nbText.body(10.5, nb.soft)}>{k}</Text>
                    <Text numberOfLines={1} style={[nbText.hand(21), { marginTop: 1 }]}>{v}</Text>
                  </NbPaper>
                </View>
              ))}
            </View>

            {/* ── this floor's curricula ── */}
            <SectionRule>{t('campus.floorCurricula')}</SectionRule>
            {target.curricula.map((c, ci) => {
              const on = openKey === c.key;
              const done = c.state === 'done';
              return (
                <NbPaper
                  key={c.key}
                  rot={ci % 2 ? 0.3 : -0.4}
                  // Done reads as struck off a list: a green wash and a line through the
                  // name. Resuming gets the gold ring the whole app uses for "this is the
                  // one you chose", so the two states cannot be confused.
                  bg={done ? 'rgba(95,141,90,.12)' : undefined}
                  style={[{ marginTop: 10 }, c.resume ? { borderWidth: 2.5, borderColor: '#E9C45A' } : null]}
                >
                  <Pressable
                    onPress={() => setOpenKey(on ? null : c.key)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: on }}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 12 }}
                  >
                    <View style={{ flex: 1, minWidth: 0 }}>
                      {done ? (
                        <Text numberOfLines={1} style={[nbText.hand(17.5, nb.soft), { textDecorationLine: 'line-through', lineHeight: 19 }]}>{c.name}</Text>
                      ) : c.resume ? (
                        <NbMark textStyle={{ fontSize: 17.5 }}>{c.name}</NbMark>
                      ) : (
                        <Text numberOfLines={1} style={[nbText.hand(17.5), { lineHeight: 19 }]}>{c.name}</Text>
                      )}
                      {!!c.next && !done && (
                        <Text numberOfLines={1} style={[nbText.body(10.5, nb.soft), { marginTop: 2 }]}>
                          {t('campus.resumeNext', { name: c.next })}
                        </Text>
                      )}
                    </View>
                    {c.resume && <NbTag color={nb.red}>{t('step.now')}</NbTag>}
                    <Text numberOfLines={1} style={nbText.hand(13.5, nb.soft)}>{c.done}/{c.total}</Text>
                    <NbIcon name={on ? 'chevronUp' : 'chevronDown'} size={15} />
                  </Pressable>

                  <Collapsible open={on}>
                    <View>
                      {(c.steps ?? []).map((st, i) => {
                        const meta = STEP_META[st.kind as StepKind] ?? STEP_META.dlg;
                        const locked = st.state === 'lock';
                        const optional = st.state === 'optional';
                        // Played and not passed. The row is tinted blue and the chip says
                        // 다시 — the learner's next move is another go, not a new step.
                        const retry = st.state === 'now' && st.attempted;
                        return (
                          <Pressable
                            key={i}
                            disabled={locked}
                            onPress={() => onStart(st.scenarioId, st.guide)}
                            style={{
                              flexDirection: 'row', alignItems: 'center', gap: 8,
                              paddingVertical: 7, paddingHorizontal: 10,
                              borderTopWidth: 1.3, borderTopColor: 'rgba(62,54,43,.14)', borderStyle: 'dashed',
                              backgroundColor: retry ? 'rgba(143,199,232,.22)' : 'transparent',
                              opacity: locked ? 0.45 : 1,
                            }}
                          >
                            {/* A lock replaces the step's own icon rather than sitting
                                beside it: the row is already four things wide. */}
                            <NbIcon name={locked ? 'lock' : meta.nbIcon} size={16} />
                            <View style={{ flex: 1, minWidth: 0 }}>
                              <Text numberOfLines={1} style={[nbText.hand(15.5), { lineHeight: 17 }]}>{st.name}</Text>
                              <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 1.5 }]}>
                                {t(meta.labelKey)}
                                {/* Which rung. A dialogue is listed twice — the same
                                    situation guided, then alone — so the two entries have
                                    to say which is which, or the list reads as a
                                    duplicated title. */}
                                {!!st.passes && st.passes > 1
                                  ? ` · ${st.pass}/${st.passes} ${t(st.guide === 'choices' ? 'step.guided' : 'step.solo')}`
                                  : ''}
                                {optional ? ` · ${t('step.optional')}` : ''}
                              </Text>
                            </View>
                            {st.state === 'done' && (
                              <Svg viewBox="0 0 24 24" width={17} height={17}>
                                <Path d="M5 12 L10 17 L20 6" fill="none" stroke={nb.green} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                              </Svg>
                            )}
                            {st.state === 'now' && (
                              <NbTag color={retry ? nb.blue : nb.ink}>{t(retry ? 'step.retry' : 'step.now')}</NbTag>
                            )}
                          </Pressable>
                        );
                      })}
                    </View>
                  </Collapsible>
                </NbPaper>
              );
            })}

            {!!focusSituation && (
              <View style={{ marginBottom: 12 }}>
                <SectionRule>{t('campus.foundSituation')}</SectionRule>
                <SituationRow s={focusSituation} onStart={onStart} highlight />
              </View>
            )}
            <SectionRule top={16}>{t('campus.deptSituations')}</SectionRule>
            {sits.length === 0 && (
              <Text style={[nbText.hand(16, nb.soft), { textAlign: 'center', paddingVertical: 16 }]}>
                {t('campus.deptNoSituations')}
              </Text>
            )}
            {sits.map((s, i) => (
              <SituationRow key={i} s={s} onStart={onStart} />
            ))}
            {hasMore && (
              <Pressable onPress={loadMore} style={{ paddingVertical: 14, alignItems: 'center' }}>
                <Text style={nbText.hand(15, nb.soft)}>{t('campus.deptLoadMore')}</Text>
              </Pressable>
            )}
          </ScrollView>

          {/* The two things you can do with a floor, pinned above the fold of the sheet.
              Paper, not a bar with its own heavy border: the sheet is already a sheet. */}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: nb.cream, borderTopWidth: 1.5, borderTopColor: nb.paperEdge, paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', gap: 9 }}>
            <View style={{ flex: 1 }}>
              <NbButton variant="ink" full icon="pencil" iconColor={nb.paper} disabled={!nextSit} onPress={() => onStart(nextSit)}>
                {t('campus.deptNextSituation')}
              </NbButton>
            </View>
            <NbButton variant="paper" icon="compass" onPress={() => onWalk(target.deptCode)}>
              {t('campus.deptWalk')}
            </NbButton>
          </View>
        </View>
      )}
    </BottomSheet>
  );
}

/** A section heading written as the handoff draws it: the words, then a rule trailing off
 *  to the right. A bare bold label is the pixel line's device; on paper a heading is
 *  underlined by hand and the line does not reach the margin. */
function SectionRule({ top = 6, children }: { top?: number; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: top, marginBottom: 4 }}>
      <Text style={nbText.hand(16)}>{children}</Text>
      <View style={{ flex: 1, height: 1.5, backgroundColor: 'rgba(62,54,43,.22)' }} />
    </View>
  );
}

/**
 * One situation card — the list's rows and the one search sent you to.
 *
 * Extracted rather than copied: the tag colour, the urgency, the cleared dimming and the
 * star are four states, and a second copy is a second place for the same situation to look
 * different depending on how you reached it.
 */
function SituationRow({ s, onStart, highlight }: {
  s: DeptSituation;
  onStart(scenarioID?: string): void;
  highlight?: boolean;
}) {
  const t = useT();
  const done = s.tagCode === 'cleared';
  // Played but not passed. Deliberately NOT folded into `done`: it still needs doing,
  // so it is neither dimmed nor labelled 복습 — the learner's next move is another go.
  const tried = s.tagCode === 'attempted';
  const starred = useIsSituationFavorite(s.scenarioId);
  return (
    <NbPaper
      rot={highlight ? 0 : 0.35}
      // 긴급 is peach paper with a red edge — the one row that should catch the eye before
      // it is read. Cleared rows are dimmed instead of coloured: they are still worth
      // seeing (복습) but not worth reaching for first.
      bg={s.urgent && !done ? '#FFF0EC' : highlight ? 'rgba(249,227,123,.5)' : undefined}
      style={[
        { marginTop: 10, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 9 },
        s.urgent && !done ? { borderColor: '#E4B4A6' } : null,
        done ? { opacity: 0.85 } : null,
      ]}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={{ fontFamily: nbFonts.bodyBold, fontSize: 10, color: done ? nb.green : tried ? nb.blue : s.urgent ? nb.red : nb.soft }}>
          {s.tag}{s.room ? ` · ${s.room}` : ''}
        </Text>
        <Text numberOfLines={2} style={[nbText.hand(17), { marginTop: 2, lineHeight: 19 }]}>{s.name}</Text>
        <Text numberOfLines={1} style={[nbText.body(10, nb.soft), { marginTop: 2 }]}>
          {t('campus.situationMeta', { lv: s.lv, min: s.min })}
        </Text>
      </View>
      {/* The star is its own target, so starring does not also start the situation. */}
      <Pressable
        onPress={() => void toggleSituationFavorite({ scenarioId: s.scenarioId, name: s.name, where: s.room })}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        accessibilityRole="switch"
        accessibilityState={{ checked: starred }}
        accessibilityLabel={t(starred ? 'campus.favRemove' : 'campus.favAdd')}
      >
        <View style={{ opacity: starred ? 1 : 0.3 }}>
          <NbIcon name="star" size={18} color={starred ? '#C99A1E' : nb.soft} />
        </View>
      </Pressable>
      {/* The verb says what this tap is: 시작 for untouched, 다시 도전 for a run that did
          not pass, 복습 for one that did. */}
      <NbButton
        variant={s.urgent && !done ? 'danger' : done ? 'paper' : 'ink'}
        size="sm"
        rot={1.5}
        iconColor={s.urgent && !done ? nb.red : done ? nb.ink : nb.paper}
        onPress={() => onStart(s.scenarioId)}
      >
        {done ? t('common.review') : tried ? t('common.retry') : t('common.start')}
      </NbButton>
    </NbPaper>
  );
}
