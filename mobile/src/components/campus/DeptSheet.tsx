// 이 층의 다른 상황 — the department's full situation list, beyond its curricula.
//
// Situations come from GET /me/situations (paged, tagged by cleared). The bundled
// fallback list this sheet used to fall back on is gone: its entries named
// scenarios they did not point at (흉통 환자 트리아지 → SCN-ER-00002, a pain
// assessment), the same defect the curriculum had. An empty list now says so.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { api, type Curriculum, type DeptSituation } from '@/api/client';
import { BottomSheet } from '@/components/BottomSheet';
import { PixelButton } from '@/components/PixelButton';
import { PixelIcon } from '@/components/PixelIcon';
import { colors, fonts, fs } from '@/theme/tokens';
import { Shadowed } from './parts';
import { t, useLocale } from '@/i18n';

const C = colors.ink;
const PAGE = 20;

export type DeptTarget = {
  deptCode: string;
  place: string; // "응급의료센터"
  where: string; // "본관 1F 응급의료센터"
  accent: string;
  curricula: Curriculum[];
};

export function DeptSheet({ target, onClose, onStart, onWalk }: {
  target: DeptTarget | null;
  onClose(): void;
  onStart(scenarioID?: string): void;
  onWalk(deptCode: string): void;
}) {
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

  // '완료' is not a label here — it is the value GET /me/situations puts in `tag`,
  // and the same string is then rendered. Translating these three comparisons would
  // break the match while leaving the display Korean, so they stay until the server
  // sends a tag CODE alongside its label (i18n build-spec P3). The ratchet's
  // components ceiling accounts for exactly these three.
  const cleared = sits.filter((s) => s.tag === '완료').length;
  const nextSit = sits.find((s) => s.tag !== '완료')?.scenarioId;
  const curDone = target ? target.curricula.filter((c) => c.state === 'done').length : 0;

  return (
    <BottomSheet visible={!!target} onClose={onClose} expandable>
      {target && (
        <View>
          <View style={{ backgroundColor: colors.cream, borderBottomWidth: 3, borderBottomColor: C, paddingTop: 4, paddingHorizontal: 14, paddingBottom: 11 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <View style={{ width: 34, height: 34, backgroundColor: target.accent, borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <PixelIcon name="pin" color={C} size={18} sw={1.8} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(15), color: C }}>{target.place}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: fs(9.5), color: colors.textSoft, marginTop: 2 }}>{target.where}</Text>
              </View>
              <Pressable onPress={onClose} hitSlop={8} style={{ width: 24, height: 24, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <PixelIcon name="x" color={C} size={12} sw={2} />
              </Pressable>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={{ padding: 14, paddingBottom: 96 }}
            scrollEventThrottle={200}
            onScroll={(e) => {
              const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
              if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 240) loadMore();
            }}
          >
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {[
                [t('campus.deptCurricula'), `${curDone}/${target.curricula.length}`],
                [t('campus.deptCleared'), sits.length ? `${cleared}/${sits.length}${hasMore ? '+' : ''}` : '—'],
              ].map(([k, v], i) => (
                <Shadowed key={i} offset={2.5} style={{ flex: 1 }}>
                  <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 7, paddingHorizontal: 6, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.body, fontSize: fs(8.5), color: colors.textSoft }}>{k}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: fs(13), color: C, marginTop: 2 }}>{v}</Text>
                  </View>
                </Shadowed>
              ))}
            </View>

            <Text style={{ fontFamily: fonts.heading, fontSize: fs(11), color: C, marginBottom: 8 }}>━ 커리큘럼 밖의 상황 ━━━━</Text>
            {sits.length === 0 && (
              <Text style={{ fontFamily: fonts.body, fontSize: fs(11), color: colors.textSoft, textAlign: 'center', paddingVertical: 14 }}>
                지금은 불러올 상황이 없어요.
              </Text>
            )}
            {sits.map((s, i) => {
              const done = s.tag === '완료';
              return (
                <Shadowed key={i} offset={2.5} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: s.urgent && !done ? colors.red : '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 9, paddingHorizontal: 10, opacity: done ? 0.62 : 1 }}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                        <View style={{ backgroundColor: done ? colors.mint : s.urgent ? C : colors.yellow, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: s.urgent && !done ? colors.cream : C }}>{s.tag}</Text>
                        </View>
                        {!!s.room && <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: s.urgent ? C : colors.textSoft }}>{s.room}</Text>}
                      </View>
                      <Text style={{ fontFamily: fonts.body, fontSize: fs(12), color: C, lineHeight: 15 }}>{s.name}</Text>
                      <Text style={{ fontFamily: fonts.heading, fontSize: fs(8.5), color: s.urgent ? C : colors.textSoft, marginTop: 3 }}>Lv.{s.lv} · 약 {s.min}분</Text>
                    </View>
                    <PixelButton label={done ? t('common.review') : t('common.start')} bg={done ? '#fff' : C} textColor={done ? C : colors.cream} shadowColor={done ? C : colors.mintShadow} offset={2} fontSize={11} borderWidth={2} paddingV={6} paddingH={9} onPress={() => onStart(s.scenarioId)} />
                  </View>
                </Shadowed>
              );
            })}
            {hasMore && (
              <Pressable onPress={loadMore} style={{ paddingVertical: 12, alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: fs(10.5), color: colors.textSoft }}>더 많은 상황 불러오기</Text>
              </Pressable>
            )}
          </ScrollView>

          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.cream, borderTopWidth: 3, borderTopColor: C, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <PixelButton icon="play" label={t('campus.deptNextSituation')} bg={C} textColor={colors.cream} shadowColor={colors.mintShadow} fontSize={13} borderWidth={2.5} paddingV={10} disabled={!nextSit} onPress={() => onStart(nextSit)} full />
            </View>
            <PixelButton icon="map" label={t('campus.deptWalk')} bg={colors.lilac} shadowColor={C} fontSize={12} borderWidth={2.5} paddingV={10} paddingH={12} onPress={() => onWalk(target.deptCode)} />
          </View>
        </View>
      )}
    </BottomSheet>
  );
}
