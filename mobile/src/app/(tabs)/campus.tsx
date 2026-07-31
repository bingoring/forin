// 캠퍼스 허브 (tab 1) — v19 handoff screen-campus-hub. Mobile-first: two segmented
// tabs (커리큘럼 / 건물·층) instead of walk-the-tilemap-first. Curriculum is the
// main line (이어하기 hero + chapter timeline + roadmap); 건물·층 browses places
// (building accordions → floor tap opens a dept sheet). The tile-walk campus is
// demoted to an opt-in ExploreDock. Axis split: 캠퍼스 = 장소·커리큘럼, 상황판 = 시간·피드.
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { api, type Progress, type CurriculumChapter } from '@/api/client';
import {
  CURRICULUM, STEP_META, BLD, deptFor,
  type Building, type Floor, type DeptDetail,
} from '@/data/campus';
import { colors, fonts } from '@/theme/tokens';

// Bundled fallback in server shape (used only while /me/curriculum is loading or offline).
const FALLBACK_CHAPTERS: CurriculumChapter[] = CURRICULUM.map((c) => ({
  ch: c.ch, name: c.name, dept: c.dept, done: c.done, total: c.total, state: c.state, next: c.next,
  steps: c.steps?.map((s) => ({ kind: s.k, name: s.n, scenarioId: s.scn, state: s.s })),
}));

const C = colors.ink;

export default function Campus() {
  const router = useRouter();
  const [tab, setTab] = useState<'curriculum' | 'buildings'>('curriculum');
  const [sheet, setSheet] = useState<DeptDetail | null>(null);
  const [enLevel, setEnLevel] = useState('B1');
  const [streak, setStreak] = useState(0);
  const [chapters, setChapters] = useState<CurriculumChapter[]>(FALLBACK_CHAPTERS);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      Promise.all([
        api.progress().catch(() => null),
        api.me().catch(() => null),
        api.curriculum().catch(() => [] as CurriculumChapter[]),
      ]).then(([p, me, chs]) => {
        if (!alive) return;
        if (p) setStreak((p as Progress).streakCurrent);
        const lv = (me as { profile?: { targetLevel?: string } } | null)?.profile?.targetLevel;
        if (lv) setEnLevel(lv);
        if (chs.length) setChapters(chs);
      });
      return () => { alive = false; };
    }, []),
  );

  const openScenario = (scn?: string) => scn && router.push(`/scenario/${scn}`);

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      {/* ── fixed header: title + Lv + streak, then segmented tabs ── */}
      <View style={{ paddingTop: 50, paddingHorizontal: 14, backgroundColor: colors.cream, borderBottomWidth: 3, borderBottomColor: C }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Text style={{ fontFamily: fonts.heading, fontSize: 17, color: C }}>캠퍼스</Text>
          <Shadowed offset={2} shadowColor={colors.mintShadow}>
            <View style={{ backgroundColor: colors.mint, borderWidth: 2, borderColor: C, paddingVertical: 2, paddingHorizontal: 7 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 10, color: C }}>Lv.{enLevel}</Text>
            </View>
          </Shadowed>
          <View style={{ flex: 1 }} />
          <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C }}>🔥 {streak}일</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {([['curriculum', '커리큘럼'], ['buildings', '건물·층']] as const).map(([id, label]) => {
            const on = id === tab;
            return (
              <Pressable key={id} onPress={() => setTab(id)} style={{ flex: 1, alignItems: 'center', paddingTop: 7, paddingBottom: 6, marginBottom: -3, backgroundColor: on ? colors.paper : 'transparent', borderWidth: 3, borderColor: on ? C : 'transparent', borderBottomColor: on ? colors.paper : 'transparent' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: on ? C : colors.textFaint }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── scroll body ── */}
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 150 }}>
        {tab === 'curriculum'
          ? <Curriculum chapters={chapters} onResume={openScenario} />
          : <Buildings onFloor={(b, f) => setSheet(deptFor(b, f))} />}
      </ScrollView>

      {/* ── explore dock (opt-in tile walk) ── */}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 12, paddingHorizontal: 14 }}>
        <Shadowed offset={3}>
          <Pressable onPress={() => router.push('/interior/CAMPUS-00001')} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.lilac, borderWidth: 3, borderColor: C, paddingVertical: 9, paddingHorizontal: 11 }}>
            <Text style={{ fontSize: 17 }}>🎮</Text>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>캠퍼스 탐험 모드</Text>
              <Text style={{ fontFamily: fonts.body, fontSize: 9.5, color: colors.textSoft, marginTop: 1 }}>직접 걸어다니며 NPC 만나기 · 선택 기능</Text>
            </View>
            <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C, paddingVertical: 4, paddingHorizontal: 8 }}>
              <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C }}>입장 ›</Text>
            </View>
          </Pressable>
        </Shadowed>
      </View>

      <DeptSheet dept={sheet} chapters={chapters} onClose={() => setSheet(null)} onStart={openScenario} onWalk={() => { setSheet(null); router.push('/interior/INT-ER-00001'); }} />
    </View>
  );
}

// ══ TAB 1 · 커리큘럼 ════════════════════════════════════════════════
function Curriculum({ chapters, onResume }: { chapters: CurriculumChapter[]; onResume: (scn?: string) => void }) {
  const cur = chapters.find((c) => c.state === 'now') ?? chapters[0];
  const nowStep = cur?.steps?.find((s) => s.state === 'now');
  return (
    <View>
      {/* 이어하기 hero */}
      {cur && (
        <View style={{ marginTop: 6, marginBottom: 15 }}>
          <Shadowed offset={4} shadowColor={colors.mintShadow}>
            <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 12 }}>
              <View style={{ position: 'absolute', top: -8, left: 10, backgroundColor: C, paddingVertical: 1, paddingHorizontal: 6 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.cream }}>MAIN CURRICULUM</Text>
              </View>
              <Text style={{ fontFamily: fonts.body, fontSize: 10, color: C, opacity: 0.75, marginTop: 2 }}>CHAPTER {cur.ch} · {cur.dept}</Text>
              <Text style={{ fontFamily: fonts.heading, fontSize: 16, color: C, marginTop: 4, marginBottom: 8 }}>{cur.name}</Text>
              <ProgressBar done={cur.done} total={cur.total} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 9 }}>
                <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 10.5, color: C }}>다음 · {cur.next ?? '준비 중'}</Text>
                <Pressable onPress={() => onResume(nowStep?.scenarioId)} style={{ backgroundColor: C, borderWidth: 2, borderColor: C, paddingVertical: 7, paddingHorizontal: 13 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 12.5, color: colors.cream }}>▶ 이어하기</Text>
                </Pressable>
              </View>
            </View>
          </Shadowed>
        </View>
      )}

      {/* chapter timeline */}
      {cur?.steps && cur.steps.length > 0 && (
        <>
          <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C, marginBottom: 8 }}>━ CHAPTER {cur.ch} 진행 ━━━━━━</Text>
          <View style={{ paddingLeft: 16, marginBottom: 17 }}>
            <View style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 3, backgroundColor: C + '22' }} />
            {cur.steps.map((s, i) => {
              const m = STEP_META[s.kind];
              const bg = s.state === 'done' ? '#fff' : s.state === 'now' ? m.bg : C + '11';
              const dot = s.state === 'done' ? colors.mintShadow : s.state === 'now' ? colors.yellowDeep : C + '33';
              const inner = (
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: bg, borderWidth: 2.5, borderColor: s.state === 'lock' ? C + '55' : C, paddingVertical: 8, paddingHorizontal: 9, opacity: s.state === 'lock' ? 0.55 : 1 }}>
                  <Text style={{ fontSize: 14 }}>{s.state === 'lock' ? '🔒' : m.icon}</Text>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontFamily: fonts.body, fontSize: 11.5, color: C, lineHeight: 15 }}>{s.name}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 8.5, color: colors.textSoft, marginTop: 2 }}>{m.label}</Text>
                  </View>
                  {s.state === 'done' && <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: colors.mintShadow }}>✓</Text>}
                  {s.state === 'now' && <View style={{ backgroundColor: C, paddingVertical: 2, paddingHorizontal: 6 }}><Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.cream }}>NOW</Text></View>}
                </View>
              );
              return (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                  <View style={{ position: 'absolute', left: -14, width: 11, height: 11, borderRadius: 6, backgroundColor: dot, borderWidth: 2, borderColor: C }} />
                  {s.state === 'now'
                    ? <Pressable style={{ flex: 1, flexDirection: 'row' }} onPress={() => onResume(s.scenarioId)}>{inner}</Pressable>
                    : inner}
                </View>
              );
            })}
          </View>
        </>
      )}

      {/* full roadmap */}
      <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C, marginBottom: 8 }}>━ 전체 로드맵 ━━━━━━━━</Text>
      {chapters.map((c, i) => {
        const lock = c.state === 'lock', now = c.state === 'now';
        return (
          <Shadowed key={i} offset={lock ? 0 : 2.5} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: now ? colors.yellow : '#fff', borderWidth: 2.5, borderColor: lock ? C + '55' : C, paddingVertical: 9, paddingHorizontal: 10, opacity: lock ? 0.6 : 1 }}>
              <View style={{ width: 26, height: 26, backgroundColor: c.state === 'done' ? colors.mint : now ? C : C + '18', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: now ? colors.cream : C }}>{c.state === 'done' ? '✓' : lock ? '🔒' : c.ch}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, lineHeight: 15 }}>{c.name}</Text>
                <Text style={{ fontFamily: fonts.heading, fontSize: 9, color: colors.textSoft, marginTop: 2 }}>{c.dept} · {c.done}/{c.total}</Text>
              </View>
              {!lock && <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>›</Text>}
            </View>
          </Shadowed>
        );
      })}
    </View>
  );
}

// ══ TAB 2 · 건물·층 ════════════════════════════════════════════════
function Buildings({ onFloor }: { onFloor: (b: Building, f: Floor) => void }) {
  const [open, setOpen] = useState<string>('tower');
  return (
    <View>
      {/* axis-split helper */}
      <Shadowed offset={2.5} style={{ marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', gap: 7, backgroundColor: colors.blue, borderWidth: 2.5, borderColor: C, paddingVertical: 8, paddingHorizontal: 10 }}>
          <Text style={{ fontSize: 13 }}>🧭</Text>
          <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 10, color: C, lineHeight: 15 }}>
            <Text style={{ fontFamily: fonts.heading }}>여기</Text>는 장소로 찾는 곳 — 층을 누르면 그 부서의 학습 카드가 열려요. 지금 병원 전체에 벌어지는 일은 <Text style={{ fontFamily: fonts.heading }}>상황판</Text> 탭에서 시간순으로 봐요.
          </Text>
        </View>
      </Shadowed>

      {BLD.map((b) => {
        const isOpen = open === b.id;
        return (
          <Shadowed key={b.id} offset={3} style={{ marginBottom: 10 }}>
            <View style={{ borderWidth: 3, borderColor: C, backgroundColor: '#fff' }}>
              <Pressable onPress={() => setOpen(isOpen ? '' : b.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 10, paddingHorizontal: 11, backgroundColor: isOpen ? colors.cream : '#fff', borderBottomWidth: isOpen ? 2.5 : 0, borderBottomColor: C }}>
                <View style={{ width: 28, height: 28, backgroundColor: b.accent, borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 14 }}>{b.icon}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 12.5, color: C }}>{b.name}</Text>
                  <Text style={{ fontFamily: fonts.body, fontSize: 9.5, color: colors.textSoft, marginTop: 2 }}>{b.sub}</Text>
                </View>
                <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>{isOpen ? '▾' : '▸'}</Text>
              </Pressable>
              {isOpen && b.floors.map((f, j) => (
                <Pressable key={j} onPress={() => onFloor(b, f)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9, paddingHorizontal: 11, borderBottomWidth: j < b.floors.length - 1 ? 1.5 : 0, borderBottomColor: C + '33', borderStyle: 'dotted' }}>
                  <View style={{ width: 40, backgroundColor: C, borderWidth: 2, borderColor: C, paddingVertical: 3, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 9.5, color: colors.cream }}>{f.f}</Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontFamily: fonts.body, fontSize: 11, color: C, lineHeight: 14 }}>{f.d}</Text>
                    <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                      {!!f.cur && <Chip label={`CH.${f.cur}`} bg={colors.mint} color={C} />}
                      <Chip label={`상황 ${f.n}`} bg="#fff" color={colors.textSoft} />
                      {f.hot && <Chip label="🔴 긴급" bg={colors.red} color={C} />}
                    </View>
                  </View>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>›</Text>
                </Pressable>
              ))}
            </View>
          </Shadowed>
        );
      })}
    </View>
  );
}

// ══ 부서 상세 시트 ══════════════════════════════════════════════════
function DeptSheet({ dept, chapters, onClose, onStart, onWalk }: { dept: DeptDetail | null; chapters: CurriculumChapter[]; onClose: () => void; onStart: (scn?: string) => void; onWalk: () => void }) {
  // link this department to its server curriculum chapter (live progress).
  const chapter = dept?.chapterCh != null ? chapters.find((c) => c.ch === dept.chapterCh) : undefined;
  const chapterNowScn = chapter?.steps?.find((s) => s.state === 'now')?.scenarioId;
  return (
    <Modal visible={!!dept} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable onPress={onClose} style={{ flex: 1, backgroundColor: '#000A' }} />
      {dept && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 74, backgroundColor: colors.paper, borderWidth: 3, borderBottomWidth: 0, borderColor: C }}>
          {/* header */}
          <View style={{ backgroundColor: colors.cream, borderBottomWidth: 3, borderBottomColor: C, paddingTop: 8, paddingHorizontal: 14, paddingBottom: 11 }}>
            <View style={{ width: 40, height: 4, backgroundColor: C + '44', alignSelf: 'center', marginBottom: 9 }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
              <View style={{ width: 34, height: 34, backgroundColor: dept.accent, borderWidth: 2.5, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 17 }}>{dept.icon}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 15, color: C }}>{dept.name}</Text>
                <Text style={{ fontFamily: fonts.body, fontSize: 9.5, color: colors.textSoft, marginTop: 2 }}>{dept.where}{dept.en ? ` · ${dept.en}` : ''}</Text>
              </View>
              <Pressable onPress={onClose} style={{ width: 24, height: 24, backgroundColor: '#fff', borderWidth: 2, borderColor: C, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C }}>×</Text>
              </Pressable>
            </View>
          </View>

          <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 96 }}>
            {/* 3 stat tiles */}
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {[['권장 레벨', dept.lv], ['해결한 상황', `${dept.cleared}/${dept.totalSit}`], ['커리큘럼', chapter ? `CH.${chapter.ch}` : '—']].map(([k, v], i) => (
                <Shadowed key={i} offset={2.5} style={{ flex: 1 }}>
                  <View style={{ backgroundColor: '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 7, paddingHorizontal: 6, alignItems: 'center' }}>
                    <Text style={{ fontFamily: fonts.body, fontSize: 8.5, color: colors.textSoft }}>{k}</Text>
                    <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: C, marginTop: 2 }}>{v}</Text>
                  </View>
                </Shadowed>
              ))}
            </View>

            {/* 이 부서의 커리큘럼 — server-driven (live progress) */}
            <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C, marginBottom: 8 }}>━ 이 부서의 커리큘럼 ━━━━━</Text>
            {chapter && chapter.state !== 'lock' ? (
              <Shadowed offset={3} shadowColor={colors.mintShadow} style={{ marginBottom: 16 }}>
                <View style={{ backgroundColor: colors.mint, borderWidth: 3, borderColor: C, padding: 11 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 9.5, color: C, opacity: 0.75 }}>CHAPTER {chapter.ch}{chapter.state === 'done' ? ' · 완료' : ''}</Text>
                  <Text style={{ fontFamily: fonts.heading, fontSize: 14, color: C, marginTop: 3, marginBottom: 7 }}>{chapter.name}</Text>
                  <ProgressBar done={chapter.done} total={chapter.total} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <Text style={{ flex: 1, fontFamily: fonts.body, fontSize: 10, color: C }}>{chapter.state === 'done' ? '이 챕터를 마쳤어요' : `다음 · ${chapter.next ?? '준비 중'}`}</Text>
                    {chapter.state !== 'done' && (
                      <Pressable onPress={() => onStart(chapterNowScn)} style={{ backgroundColor: C, borderWidth: 2, borderColor: C, paddingVertical: 6, paddingHorizontal: 11 }}>
                        <Text style={{ fontFamily: fonts.heading, fontSize: 11.5, color: colors.cream }}>▶ 이어하기</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Shadowed>
            ) : (
              <View style={{ backgroundColor: '#fff', borderWidth: 2, borderColor: C + '55', borderStyle: 'dashed', padding: 14, marginBottom: 16 }}>
                <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft, textAlign: 'center' }}>{chapter ? '이전 챕터를 완료하면 열려요.' : '이 부서의 학습 콘텐츠가 곧 추가돼요.'}</Text>
              </View>
            )}

            {/* 이 부서의 상황 */}
            <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: C, marginBottom: 8 }}>━ 이 부서의 상황 ━━━━━━</Text>
            {dept.sits.length === 0 && (
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: colors.textSoft, textAlign: 'center', paddingVertical: 14 }}>준비 중인 상황이에요.</Text>
            )}
            {dept.sits.map((s, i) => {
              const urgent = s.urg === 1, done = s.tag === '완료';
              return (
                <Shadowed key={i} offset={2.5} style={{ marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: urgent ? colors.red : '#fff', borderWidth: 2.5, borderColor: C, paddingVertical: 9, paddingHorizontal: 10, opacity: done ? 0.62 : 1 }}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                        <View style={{ backgroundColor: done ? colors.mint : urgent ? C : colors.yellow, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 5 }}>
                          <Text style={{ fontFamily: fonts.heading, fontSize: 8.5, color: urgent && !done ? colors.cream : C }}>{s.tag}</Text>
                        </View>
                        <Text style={{ fontFamily: fonts.heading, fontSize: 8.5, color: urgent ? C : colors.textSoft }}>{s.room}</Text>
                      </View>
                      <Text style={{ fontFamily: fonts.body, fontSize: 12, color: C, lineHeight: 15 }}>{s.name}</Text>
                      <Text style={{ fontFamily: fonts.heading, fontSize: 8.5, color: urgent ? C : colors.textSoft, marginTop: 3 }}>Lv.{s.lv} · 약 {s.min}분</Text>
                    </View>
                    <Pressable onPress={() => onStart(s.scn)} style={{ backgroundColor: done ? '#fff' : C, borderWidth: 2, borderColor: C, paddingVertical: 6, paddingHorizontal: 9 }}>
                      <Text style={{ fontFamily: fonts.heading, fontSize: 11, color: done ? C : colors.cream }}>{done ? '복습' : '시작'}</Text>
                    </Pressable>
                  </View>
                </Shadowed>
              );
            })}
          </ScrollView>

          {/* sticky footer */}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.cream, borderTopWidth: 3, borderTopColor: C, paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', gap: 8 }}>
            <Shadowed offset={2.5} style={{ flex: 1 }}>
              <Pressable onPress={() => onStart(dept.sits.find((x) => x.tag !== '완료')?.scn ?? chapterNowScn)} style={{ backgroundColor: C, borderWidth: 2.5, borderColor: C, paddingVertical: 10, alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 13, color: colors.cream }}>▶ 다음 상황 시작</Text>
              </Pressable>
            </Shadowed>
            <Shadowed offset={2.5}>
              <Pressable onPress={onWalk} style={{ backgroundColor: colors.lilac, borderWidth: 2.5, borderColor: C, paddingVertical: 10, paddingHorizontal: 12, alignItems: 'center' }}>
                <Text style={{ fontFamily: fonts.heading, fontSize: 12, color: C }}>🎮 걸어보기</Text>
              </Pressable>
            </Shadowed>
          </View>
        </View>
      )}
    </Modal>
  );
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  return (
    <View style={{ height: 12, backgroundColor: '#fff', borderWidth: 2, borderColor: C, justifyContent: 'center' }}>
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(done / total) * 100}%`, backgroundColor: colors.mintShadow }} />
      <Text style={{ position: 'absolute', right: 4, fontFamily: fonts.heading, fontSize: 8.5, color: C }}>{done}/{total}</Text>
    </View>
  );
}

function Chip({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <View style={{ backgroundColor: bg, borderWidth: 1.5, borderColor: C, paddingVertical: 1, paddingHorizontal: 4 }}>
      <Text style={{ fontFamily: fonts.heading, fontSize: 8, color }}>{label}</Text>
    </View>
  );
}

function Shadowed({ children, offset = 4, shadowColor = C, style }: { children: React.ReactNode; offset?: number; shadowColor?: string; style?: object }) {
  return (
    <View style={style}>
      <View style={{ position: 'absolute', left: offset, top: offset, right: -offset, bottom: -offset, backgroundColor: shadowColor }} />
      {children}
    </View>
  );
}
